# V8 — BRL + USD com trava segura de Stripe

Esta build preserva o visual da V8 e altera apenas o roteamento de checkout.

## Comportamento

- BRL: usa `create-checkout-prod` (Mercado Pago produção).
- USD em `localhost` ou `127.0.0.1`: usa `create-checkout-stripe-test`.
- USD em site público:
  - `STRIPE_CHECKOUT_MODE: "disabled"` → compra internacional bloqueada com aviso.
  - `STRIPE_CHECKOUT_MODE: "prod"` → usa `create-checkout-stripe-prod`.

## Estado atual recomendado

Mantenha em `config.js`:

```js
STRIPE_CHECKOUT_MODE: "disabled"
```

Assim o site pode ser publicado sem expor checkout de teste a clientes reais.

Quando Stripe produção estiver liberado e os secrets/webhook live estiverem configurados, altere apenas para:

```js
STRIPE_CHECKOUT_MODE: "prod"
```

Não é necessário alterar o design nem os botões.
