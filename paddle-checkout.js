(() => {
  const status = document.querySelector('#status');
  const retry = document.querySelector('#retry');
  const transactionId = new URLSearchParams(location.search).get('transaction_id') || '';
  let initialized = false;
  const fail = (message) => { status.textContent = message; status.classList.add('error'); retry.hidden = false; };
  const open = () => {
    status.classList.remove('error'); retry.hidden = true;
    if (!/^txn_[A-Za-z0-9_-]+$/.test(transactionId)) return fail('A transação do Paddle é inválida ou não foi informada. Volte ao Launcher e tente novamente.');
    const config = window.LIPEX_CONFIG || {};
    const token = String(config.PADDLE_SANDBOX_CLIENT_TOKEN || '').trim();
    if (String(config.PADDLE_CHECKOUT_MODE || '').toLowerCase() !== 'sandbox' || !token.startsWith('test_')) return fail('O checkout Paddle Sandbox não está configurado neste site.');
    if (!window.Paddle) return fail('Não foi possível carregar o Paddle. Verifique sua conexão e tente novamente.');
    try {
      if (!initialized) {
        window.Paddle.Environment.set('sandbox');
        window.Paddle.Initialize({ token, eventCallback(event) {
          const name = String(event?.name || '');
          if (name === 'checkout.completed') status.textContent = 'Pagamento confirmado. O LipeX Launcher liberará o acesso após a confirmação do servidor.';
          if (name === 'checkout.closed') status.textContent = 'Checkout fechado. Você pode voltar ao Launcher ou abrir novamente por lá.';
        }});
        initialized = true;
      }
      status.textContent = 'Abrindo o checkout oficial do Paddle…';
      window.Paddle.Checkout.open({ transactionId, settings: { displayMode:'overlay', theme:'dark', locale:'pt' } });
    } catch (error) { fail(`Não foi possível abrir o checkout do Paddle: ${error?.message || error}`); }
  };
  retry.addEventListener('click', open);
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', () => setTimeout(open, 0)); else setTimeout(open, 0);
})();
