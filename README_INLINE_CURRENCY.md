# V8 — seletor de moeda junto ao preço

Alterações desta build:
- remove o seletor BRL/USD da barra superior;
- adiciona um seletor compacto ao lado de cada preço nos cards;
- adiciona o mesmo seletor ao lado do preço nas páginas dos jogos;
- mostra apenas `BRL` ou `USD` no seletor, sem símbolo adicional;
- mantém a moeda sincronizada entre todos os preços via `currency.js`;
- mantém o comportamento de segurança: localhost usa Stripe Test; site público bloqueia USD enquanto `STRIPE_CHECKOUT_MODE` estiver `disabled`.
