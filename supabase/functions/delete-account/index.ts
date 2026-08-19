import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
}

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  })

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders })
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405)

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")
    const anonKey = Deno.env.get("SUPABASE_ANON_KEY")
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")

    if (!supabaseUrl || !anonKey || !serviceRoleKey) {
      return json({ error: "Server configuration is incomplete." }, 500)
    }

    const authorization = req.headers.get("Authorization") || ""
    if (!authorization.startsWith("Bearer ")) return json({ error: "Unauthorized" }, 401)

    const userClient = createClient(supabaseUrl, anonKey, {
      global: { headers: { Authorization: authorization } },
      auth: { persistSession: false, autoRefreshToken: false },
    })

    const {
      data: { user },
      error: userError,
    } = await userClient.auth.getUser()

    if (userError || !user) return json({ error: "Unauthorized" }, 401)

    const body = await req.json().catch(() => ({}))
    if (body?.confirmation !== "EXCLUIR") {
      return json({ error: "Invalid confirmation." }, 400)
    }

    const admin = createClient(supabaseUrl, serviceRoleKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    })

    // 1) Descobre as licenças do usuário. Devices pertencem à licença
    // (entitlement_id), e não diretamente ao user_id.
    const { data: entitlements, error: entitlementsLookupError } = await admin
      .from("entitlements")
      .select("id")
      .eq("user_id", user.id)

    if (entitlementsLookupError) {
      console.error("delete-account: entitlement lookup failed", entitlementsLookupError)
      return json({ error: "Could not prepare account licenses for deletion." }, 500)
    }

    const entitlementIds = (entitlements || []).map((item) => item.id).filter(Boolean)

    // 2) Remove os dispositivos vinculados às licenças da conta.
    if (entitlementIds.length > 0) {
      const { error: devicesError } = await admin
        .from("devices")
        .delete()
        .in("entitlement_id", entitlementIds)

      if (devicesError) {
        console.error("delete-account: device cleanup failed", devicesError)
        return json({ error: "Could not remove account devices." }, 500)
      }
    }

    // 3) Mantém o histórico de compra/licença, mas revoga imediatamente o acesso.
    // Isso evita quebrar pedidos, auditoria ou referências financeiras históricas.
    const { error: revokeError } = await admin
      .from("entitlements")
      .update({ status: "revoked" })
      .eq("user_id", user.id)

    if (revokeError) {
      console.error("delete-account: entitlement revoke failed", revokeError)
      return json({ error: "Could not revoke account licenses." }, 500)
    }

    // 4) Apaga avatar(s) do bucket, quando existirem. Falha aqui não impede
    // o bloqueio da conta, mas é registrada nos logs para limpeza posterior.
    try {
      const { data: avatarFiles, error: avatarListError } = await admin.storage
        .from("avatars")
        .list(user.id, { limit: 100 })

      if (avatarListError) {
        console.error("delete-account: avatar list failed", avatarListError)
      } else if (avatarFiles?.length) {
        const paths = avatarFiles
          .filter((file) => file.name && file.name !== ".emptyFolderPlaceholder")
          .map((file) => `${user.id}/${file.name}`)
        if (paths.length) {
          const { error: avatarDeleteError } = await admin.storage.from("avatars").remove(paths)
          if (avatarDeleteError) console.error("delete-account: avatar cleanup failed", avatarDeleteError)
        }
      }
    } catch (avatarError) {
      console.error("delete-account: unexpected avatar cleanup error", avatarError)
    }

    // 5) Apaga o perfil público e libera o username para outro cadastro.
    const { error: profileError } = await admin.from("profiles").delete().eq("user_id", user.id)
    if (profileError) {
      console.error("delete-account: profile cleanup failed", profileError)
      return json({ error: "Could not remove the public profile." }, 500)
    }

    // 6) Soft-delete no Supabase Auth. A conta deixa de ser utilizável e o ID
    // fica preservado de forma segura para referências históricas/auditoria.
    const { error: deleteError } = await admin.auth.admin.deleteUser(user.id, true)
    if (deleteError) {
      console.error("delete-account: auth deletion failed", deleteError)
      return json({ error: "Could not delete the authentication account." }, 500)
    }

    return json({ ok: true })
  } catch (error) {
    console.error("delete-account unexpected error", error)
    return json({ error: "Unexpected server error." }, 500)
  }
})
