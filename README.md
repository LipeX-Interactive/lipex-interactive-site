# LipeX Interactive — Site oficial

Site estático para GitHub Pages com autenticação Supabase e checkout Mercado Pago via Edge Function.

## Antes de publicar a versão com login e compra
1. Abra `config.js`.
2. Mantenha a URL do projeto Supabase já preenchida.
3. A **Publishable Key** do projeto `lipex-production` já está configurada em `config.js`.
4. Nunca coloque `service_role`, secret key, Access Token do Mercado Pago ou Client Secret neste repositório.

## Backend esperado
- Supabase Auth: e-mail + senha.
- Edge Function autenticada: `create-checkout-prod`.
- Webhook público: `mercadopago-webhook-prod`.
- Produtos esperados: `messi-vs-ronaldo` e `android-vs-iphone`.

## Publicação no GitHub Pages
1. Envie todos os arquivos para a raiz do repositório.
2. Abra Settings → Pages.
3. Em Build and deployment, escolha Source: Deploy from a branch.
4. Branch: main e pasta: /(root).
5. Salve e aguarde o deploy.

URL:
https://lipex-interactive.github.io/lipex-interactive-site/
