// Configuração pública do Supabase para o site LipeX Interactive.
// A Publishable Key (ou a legacy anon key) é feita para uso no frontend.
// NUNCA coloque service_role, secret key ou tokens do Mercado Pago aqui.
window.LIPEX_CONFIG = {
  SUPABASE_URL: "https://narcpzwhkrmegaxxovls.supabase.co",
  SUPABASE_PUBLISHABLE_KEY: "sb_publishable_rJlH3EpCeGmmfuuE6TT4wQ_nEZPnAxG",

  // Segurança do checkout internacional no site público:
  // "disabled" = USD aparece no site, mas a compra fica bloqueada.
  // "prod" = USD usa create-checkout-stripe-prod.
  // Em localhost/127.0.0.1 o site usa automaticamente o Stripe TEST,
  // independentemente deste valor, para continuar permitindo testes locais.
  STRIPE_CHECKOUT_MODE: "disabled"
};
