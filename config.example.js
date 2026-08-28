// LipeX Interactive Games — exemplo de configuração pública do site.
// NÃO substitua o config.js que já funciona em produção sem conferir os valores.
// Use apenas chaves públicas/client-side aqui. Nunca coloque Service Role, API keys secretas
// do Paddle/Mercado Pago ou outros segredos neste arquivo.
window.LIPEX_CONFIG = {
  SUPABASE_URL: "https://SEU-PROJETO.supabase.co",
  SUPABASE_PUBLISHABLE_KEY: "SUA_CHAVE_PUBLICAVEL",

  // Para os testes atuais do checkout internacional no site.
  PADDLE_CHECKOUT_MODE: "sandbox",
  PADDLE_SANDBOX_CLIENT_TOKEN: "SEU_CLIENT_TOKEN_PUBLICO_DO_PADDLE_SANDBOX"
};
