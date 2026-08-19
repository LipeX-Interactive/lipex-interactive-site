# LipeX — Account Management Setup

## delete-account Edge Function

Deploy `supabase/functions/delete-account/index.ts` as an authenticated Edge Function named `delete-account`.

Dashboard path:
1. Edge Functions
2. Deploy a new function
3. Via Editor
4. Function name: `delete-account`
5. Replace the template code with the contents of `index.ts`
6. Deploy function

Keep JWT verification enabled. The browser sends the logged-in user's Authorization token automatically through `supabase.functions.invoke()`.

Hosted Edge Functions already receive `SUPABASE_URL`, `SUPABASE_ANON_KEY`, and `SUPABASE_SERVICE_ROLE_KEY` as project environment variables.

### Deletion behavior
- Verifies the authenticated user.
- Requires explicit `EXCLUIR` confirmation from the site.
- Removes devices through their `entitlement_id` relationship.
- Revokes entitlements instead of deleting purchase/license history.
- Removes avatar files and the public profile.
- Soft-deletes the Supabase Auth account.
- Keeps financial/audit records that may be necessary historically.

Test only with a disposable account first.


## Recuperação de senha

O site inclui `Esqueci minha senha` e a página `reset-password.html`. Para testar localmente, adicione `http://localhost:8000/reset-password.html` em Supabase Auth > URL Configuration > Redirect URLs. Em produção, adicione também a URL HTTPS equivalente do domínio oficial.
