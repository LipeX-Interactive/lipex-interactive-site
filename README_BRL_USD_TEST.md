# LipeX Site V8 — BRL / USD

Esta build preserva o visual da V8 aprovada e adiciona somente o fluxo de moeda/pagamento:

- BRL -> `create-checkout-prod` (Mercado Pago produção)
- USD -> `create-checkout-stripe-test` (Stripe modo teste)
- Messi vs Ronaldo: R$ 139,90 / US$ 28.00
- Android vs iPhone: R$ 149,90 / US$ 29.00
- A escolha de moeda é salva localmente no navegador.
- Sem escolha manual, PT inicia em BRL e EN inicia em USD.
- O preço enviado ao provedor continua sendo decidido pelo backend. O site envia apenas `product_slug`.

A rota Stripe desta build ainda é de TESTE. Não publicar como checkout USD de produção até a conta Stripe ser aprovada e as funções de produção serem ativadas.
