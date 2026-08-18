(() => {
  const config = window.LIPEX_CONFIG || {};
  const tr = (text) => window.LipexI18n?.t?.(text) || text;
  const status = document.querySelector("#recovery-status");
  const form = document.querySelector("#recovery-form");
  const password = document.querySelector("#recovery-password");
  const confirm = document.querySelector("#recovery-password-confirm");
  const submit = document.querySelector("#recovery-submit");
  const languageButtons = [...document.querySelectorAll("[data-recovery-language]")];

  const setStatus = (message, type = "info") => {
    status.textContent = message;
    status.dataset.type = type;
  };

  const syncLanguageButtons = () => {
    const lang = window.LipexI18n?.getLanguage?.() || "pt";
    languageButtons.forEach((button) => button.classList.toggle("active", button.dataset.recoveryLanguage === lang));
  };

  languageButtons.forEach((button) => button.addEventListener("click", () => {
    window.LipexI18n?.setLanguage?.(button.dataset.recoveryLanguage);
    syncLanguageButtons();
  }));
  window.addEventListener("lipex:languagechange", syncLanguageButtons);
  syncLanguageButtons();

  const ready =
    typeof config.SUPABASE_URL === "string" && config.SUPABASE_URL.startsWith("https://") &&
    typeof config.SUPABASE_PUBLISHABLE_KEY === "string" && config.SUPABASE_PUBLISHABLE_KEY.length > 20;

  if (!ready || !window.supabase?.createClient) {
    setStatus(tr("A conexão com o Supabase ainda não foi configurada."), "error");
    return;
  }

  const supabaseClient = window.supabase.createClient(
    config.SUPABASE_URL,
    config.SUPABASE_PUBLISHABLE_KEY,
    { auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true } }
  );

  let recoveryAuthorized = false;
  let settled = false;

  const allowReset = () => {
    if (settled) return;
    recoveryAuthorized = true;
    settled = true;
    setStatus("", "info");
    form.hidden = false;
    window.setTimeout(() => password?.focus(), 50);
  };

  const denyReset = () => {
    if (settled) return;
    settled = true;
    form.hidden = true;
    setStatus(tr("Link de recuperação inválido ou expirado. Solicite um novo link na tela de login."), "error");
  };

  supabaseClient.auth.onAuthStateChange((event, session) => {
    if (event === "PASSWORD_RECOVERY" && session) allowReset();
  });

  // No fluxo implícito, o link de recuperação inclui type=recovery no hash.
  // Isso também cobre o caso em que o evento de Auth acontece muito cedo.
  const recoveryHint = window.location.hash.includes("type=recovery");

  window.setTimeout(async () => {
    if (settled) return;
    const { data } = await supabaseClient.auth.getSession();
    if (recoveryHint && data?.session) {
      allowReset();
    } else {
      window.setTimeout(() => {
        if (!settled) denyReset();
      }, 1200);
    }
  }, 350);

  form?.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (!recoveryAuthorized) {
      denyReset();
      return;
    }

    const next = password.value;
    const repeated = confirm.value;

    if (next.length < 6) {
      setStatus(tr("A nova senha precisa ter pelo menos 6 caracteres."), "error");
      return;
    }
    if (next !== repeated) {
      setStatus(tr("As senhas não coincidem."), "error");
      return;
    }

    submit.disabled = true;
    const original = submit.textContent;
    submit.textContent = tr("Salvando nova senha...");
    setStatus("", "info");

    try {
      const { error } = await supabaseClient.auth.updateUser({ password: next });
      if (error) throw error;

      await supabaseClient.auth.signOut({ scope: "local" }).catch(() => {});
      form.hidden = true;
      setStatus(tr("Senha redefinida com sucesso. Você já pode entrar com a nova senha."), "success");
    } catch (error) {
      console.error(error);
      setStatus(String(error?.message || tr("Não foi possível alterar a senha.")), "error");
    } finally {
      submit.disabled = false;
      submit.textContent = original;
    }
  });
})();
