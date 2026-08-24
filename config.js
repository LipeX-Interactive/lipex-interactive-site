// Configuração pública do Supabase e Paddle para o site LipeX Interactive.
// Publishable/client-side tokens são próprios para uso no frontend.
// NUNCA coloque service_role, API keys secretas, webhook secrets ou tokens do Mercado Pago aqui.
window.LIPEX_CONFIG = {
  SUPABASE_URL: "https://narcpzwhkrmegaxxovls.supabase.co",
  SUPABASE_PUBLISHABLE_KEY: "sb_publishable_rJlH3EpCeGmmfuuE6TT4wQ_nEZPnAxG",

  // Paddle Sandbox: client-side token público, usado somente pelo Paddle.js.
  PADDLE_SANDBOX_CLIENT_TOKEN: "test_704d5c3415493dafd10b8c9fa90",

  // Enquanto estivermos testando: BRL continua no Mercado Pago e USD abre
  // o checkout Paddle Sandbox via create-checkout-paddle.
  PADDLE_CHECKOUT_MODE: "sandbox",

  // Mantido apenas como compatibilidade com builds anteriores.
  STRIPE_CHECKOUT_MODE: "disabled"
};
