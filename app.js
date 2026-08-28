(() => {
  const config = window.LIPEX_CONFIG || {};
  const tr = (text) => window.LipexI18n?.t?.(text) || text;
  const msg = (pt, en) => window.LipexI18n?.getLanguage?.() === "en" ? en : pt;
  const configReady =
    typeof config.SUPABASE_URL === "string" &&
    config.SUPABASE_URL.startsWith("https://") &&
    typeof config.SUPABASE_PUBLISHABLE_KEY === "string" &&
    config.SUPABASE_PUBLISHABLE_KEY.length > 20 &&
    !config.SUPABASE_PUBLISHABLE_KEY.includes("COLE_AQUI");

  const accountButton = document.querySelector("#account-button");
  const accountMenu = document.querySelector("#account-menu");
  const accountEmail = document.querySelector("#account-email");
  const logoutButton = document.querySelector("#logout-button");
  const manageAccountButton = document.querySelector("#manage-account-button");
  const accountSettingsModal = document.querySelector("#account-settings-modal");
  const accountSettingsTitle = document.querySelector("#account-settings-title");
  const accountSettingsIntro = document.querySelector("#account-settings-intro");
  const accountSettingsClose = document.querySelector("#account-settings-close");
  const settingsAccountEmail = document.querySelector("#settings-account-email");
  const passAccountLoading = document.querySelector("#pass-account-loading");
  const passAccountEmpty = document.querySelector("#pass-account-empty");
  const passAccountDetails = document.querySelector("#pass-account-details");
  const passAccountStatus = document.querySelector("#pass-account-status");
  const passAccountProvider = document.querySelector("#pass-account-provider");
  const passAccountPlan = document.querySelector("#pass-account-plan");
  const passAccountPrice = document.querySelector("#pass-account-price");
  const passAccountRenewal = document.querySelector("#pass-account-renewal");
  const passAccountRenewalLabel = document.querySelector("#pass-account-renewal-label");
  const passAccountRenewalState = document.querySelector("#pass-account-renewal-state");
  const passAccountStarted = document.querySelector("#pass-account-started");
  const passAccountUpdated = document.querySelector("#pass-account-updated");
  const passAccountNote = document.querySelector("#pass-account-note");
  const passAccountFeedback = document.querySelector("#pass-account-feedback");
  const passCancelButton = document.querySelector("#pass-cancel-button");
  const passViewPlansButton = document.querySelector("#pass-view-plans");
  const passChangePlanButton = document.querySelector("#pass-change-plan");
  const changePasswordForm = document.querySelector("#change-password-form");
  const currentPasswordInput = document.querySelector("#current-password");
  const newPasswordInput = document.querySelector("#new-password");
  const confirmPasswordInput = document.querySelector("#confirm-password");
  const passwordFeedback = document.querySelector("#password-feedback");
  const changePasswordButton = document.querySelector("#change-password-button");
  const showDeleteAccountButton = document.querySelector("#show-delete-account");
  const deleteConfirmation = document.querySelector("#delete-confirmation");
  const deleteAccountForm = document.querySelector("#delete-account-form");
  const deleteCurrentPasswordInput = document.querySelector("#delete-current-password");
  const deleteConfirmationText = document.querySelector("#delete-confirmation-text");
  const deleteFeedback = document.querySelector("#delete-feedback");
  const deleteAccountButton = document.querySelector("#delete-account-button");
  const cancelDeleteAccountButton = document.querySelector("#cancel-delete-account");
  const authModal = document.querySelector("#auth-modal");
  const authClose = document.querySelector("#auth-close");
  const authForm = document.querySelector("#auth-form");
  const authTitle = document.querySelector("#auth-title");
  const authSubtitle = document.querySelector("#auth-subtitle");
  const authSubmit = document.querySelector("#auth-submit");
  const authSwitch = document.querySelector("#auth-switch");
  const authSwitchText = document.querySelector("#auth-switch-text");
  const authFeedback = document.querySelector("#auth-feedback");
  const emailInput = document.querySelector("#auth-email");
  const passwordInput = document.querySelector("#auth-password");
  const passwordField = document.querySelector("#auth-password-field");
  const forgotPasswordButton = document.querySelector("#forgot-password-button");
  const lipexConfirmModal = document.querySelector("#lipex-confirm-modal");
  const lipexConfirmCard = lipexConfirmModal?.querySelector(".lipex-confirm-card");
  const lipexConfirmClose = document.querySelector("#lipex-confirm-close");
  const lipexConfirmCancel = document.querySelector("#lipex-confirm-cancel");
  const lipexConfirmOk = document.querySelector("#lipex-confirm-ok");
  const lipexConfirmTitle = document.querySelector("#lipex-confirm-title");
  const lipexConfirmIntro = document.querySelector("#lipex-confirm-intro");
  const lipexConfirmCurrentPlan = document.querySelector("#lipex-confirm-current-plan");
  const lipexConfirmCurrentProvider = document.querySelector("#lipex-confirm-current-provider");
  const lipexConfirmCurrentPrice = document.querySelector("#lipex-confirm-current-price");
  const lipexConfirmTargetPlan = document.querySelector("#lipex-confirm-target-plan");
  const lipexConfirmTargetProvider = document.querySelector("#lipex-confirm-target-provider");
  const lipexConfirmTargetPrice = document.querySelector("#lipex-confirm-target-price");
  const lipexConfirmImpact = document.querySelector("#lipex-confirm-impact");
  const toast = document.querySelector("#toast");
  const paymentBanner = document.querySelector("#payment-banner");
  const getBuyButtons = () => [...document.querySelectorAll("[data-buy-product]")];

  let mode = "login";
  let currentUser = null;
  let supabaseClient = null;
  let pendingDirectCheckout = null;
  let pendingPassPlan = null;
  let pendingPassCurrency = null;
  let pendingManagePass = false;
  let paddleInitialized = false;
  let activePaddleCheckoutButton = null;
  let activePaddleCheckoutKind = null;
  let mercadoPagoPassSyncPromise = null;
  let mercadoPagoPassSyncUserId = null;
  let lastMercadoPagoPassSyncAt = 0;
  let lastMercadoPagoPassSyncResult = null;
  let passAccountLoadPromise = null;
  let currentPassAccountSubscription = null;
  let lipexConfirmResolver = null;

  function captureDirectCheckoutRequest() {
    const params = new URLSearchParams(window.location.search);
    const requestedProduct = String(params.get("checkout") || "").trim();
    const requestedPass = String(params.get("pass") || "").trim().toLowerCase();
    const requestedManage = String(params.get("manage") || "").trim().toLowerCase();
    const requestedCurrency = String(params.get("currency") || "").trim().toUpperCase();

    if (requestedProduct) pendingDirectCheckout = requestedProduct;
    if (requestedPass === "monthly" || requestedPass === "annual") {
      pendingPassPlan = requestedPass;
      if (requestedCurrency === "BRL" || requestedCurrency === "USD") {
        pendingPassCurrency = requestedCurrency;
      }
    }
    if (requestedManage === "lipex-pass" || requestedManage === "pass") {
      pendingManagePass = true;
    }

    if (!requestedProduct && !pendingPassPlan && !pendingManagePass) return;

    // Deep links are one-shot. Removing them prevents refresh/back from reopening
    // checkout or account management unexpectedly.
    params.delete("checkout");
    params.delete("pass");
    params.delete("manage");
    params.delete("source");
    if (pendingPassCurrency) params.delete("currency");
    const nextQuery = params.toString();
    const nextUrl = window.location.pathname + (nextQuery ? `?${nextQuery}` : "") + window.location.hash;
    window.history.replaceState({}, "", nextUrl);
  }

  function continueDirectCheckoutIfReady() {
    if (pendingManagePass) {
      if (!currentUser) {
        openAuth("login");
        setAuthFeedback(
          tr("Entre na sua conta para gerenciar o LipeX Pass. Depois do login, abriremos sua assinatura automaticamente."),
          "info"
        );
        return;
      }
      pendingManagePass = false;
      openAccountSettings({ passFocus: true });
      window.setTimeout(() => document.querySelector("#pass-account-section")?.scrollIntoView({ behavior: "smooth", block: "start" }), 120);
      return;
    }

    if (pendingPassPlan) {
      const matchingPassButton = document.querySelector(`[data-pass-plan="${pendingPassPlan}"]`);
      if (matchingPassButton) {
        if (!currentUser) {
          openAuth("login");
          setAuthFeedback(
            tr("Entre na sua conta para continuar. Depois do login, abriremos o checkout automaticamente."),
            "info"
          );
          return;
        }

        if (pendingPassCurrency && window.LipexCurrency?.setCurrency) {
          window.LipexCurrency.setCurrency(pendingPassCurrency, true);
        }
        pendingPassPlan = null;
        pendingPassCurrency = null;
        window.setTimeout(() => matchingPassButton.click(), 80);
        return;
      }
    }

    if (!pendingDirectCheckout) return;

    const matchingButton = getBuyButtons().find(
      (button) => button.dataset.buyProduct === pendingDirectCheckout
    );
    if (!matchingButton) return;

    if (!currentUser) {
      openAuth("login");
      setAuthFeedback(
        tr("Entre na sua conta para continuar. Depois do login, abriremos o checkout automaticamente."),
        "info"
      );
      return;
    }

    pendingDirectCheckout = null;
    window.setTimeout(() => matchingButton.click(), 80);
  }

  captureDirectCheckoutRequest();

  function showToast(message, type = "info") {
    if (!toast) return;
    toast.textContent = message;
    toast.dataset.type = type;
    toast.classList.add("show");
    window.clearTimeout(showToast.timer);
    showToast.timer = window.setTimeout(() => toast.classList.remove("show"), 4400);
  }

  function setAuthFeedback(message = "", type = "") {
    if (!authFeedback) return;
    authFeedback.textContent = message;
    authFeedback.dataset.type = type;
  }

  function setAuthMode(nextMode) {
    mode = nextMode;
    setAuthFeedback();
    const isForgot = mode === "forgot";
    if (passwordField) passwordField.hidden = isForgot;
    if (passwordInput) {
      passwordInput.required = !isForgot;
      if (isForgot) passwordInput.value = "";
    }
    if (forgotPasswordButton) forgotPasswordButton.hidden = mode !== "login";

    if (mode === "register") {
      authTitle.textContent = tr("Criar conta LipeX");
      authSubtitle.textContent = tr("Use o mesmo e-mail que você usará no LipeX Launcher.");
      authSubmit.textContent = tr("Criar conta");
      authSwitchText.textContent = tr("Já tem uma conta?");
      authSwitch.textContent = tr("Entrar");
    } else if (mode === "forgot") {
      authTitle.textContent = tr("Recuperar senha");
      authSubtitle.textContent = tr("Informe o e-mail da sua conta. Enviaremos um link para você criar uma nova senha.");
      authSubmit.textContent = tr("Enviar link de recuperação");
      authSwitchText.textContent = tr("Lembrou sua senha?");
      authSwitch.textContent = tr("Entrar");
    } else {
      authTitle.textContent = tr("Entrar na LipeX");
      authSubtitle.textContent = tr("A compra será vinculada à sua conta e liberada no launcher.");
      authSubmit.textContent = tr("Entrar");
      authSwitchText.textContent = tr("Ainda não tem conta?");
      authSwitch.textContent = tr("Criar conta");
    }
  }

  function openAuth(nextMode = "login") {
    setAuthMode(nextMode);
    authModal?.classList.add("open");
    authModal?.setAttribute("aria-hidden", "false");
    document.body.classList.add("modal-open");
    window.setTimeout(() => emailInput?.focus(), 60);
  }

  function closeAuth() {
    authModal?.classList.remove("open");
    authModal?.setAttribute("aria-hidden", "true");
    document.body.classList.remove("modal-open");
    setAuthFeedback();
  }

  function setSettingsFeedback(element, message = "", type = "") {
    if (!element) return;
    element.textContent = message;
    element.dataset.type = type;
  }

  function openAccountSettings(options = {}) {
    if (!currentUser || !accountSettingsModal) return;
    const passFocus = Boolean(options?.passFocus);
    accountSettingsModal.classList.toggle("pass-focus-mode", passFocus);
    if (accountSettingsTitle) accountSettingsTitle.textContent = passFocus ? msg("Gerenciar LipeX Pass", "Manage LipeX Pass") : tr("Gerenciar conta");
    if (accountSettingsIntro) accountSettingsIntro.textContent = passFocus
      ? msg("Acompanhe seu plano, cobrança e renovação em um só lugar.", "Review your plan, billing and renewal in one place.")
      : tr("Altere sua senha ou gerencie sua conta LipeX.");
    if (settingsAccountEmail) settingsAccountEmail.textContent = currentUser.email || tr("Conta LipeX");
    if (accountMenu) accountMenu.hidden = true;
    accountSettingsModal.classList.add("open");
    accountSettingsModal.setAttribute("aria-hidden", "false");
    document.body.classList.add("modal-open");
    changePasswordForm?.reset();
    deleteAccountForm?.reset();
    if (deleteConfirmation) deleteConfirmation.hidden = true;
    setSettingsFeedback(passwordFeedback);
    setSettingsFeedback(deleteFeedback);
    setSettingsFeedback(passAccountFeedback);
    refreshPassAccount({ sync: true }).catch(() => {});
  }

  function closeAccountSettings() {
    accountSettingsModal?.classList.remove("open", "pass-focus-mode");
    accountSettingsModal?.setAttribute("aria-hidden", "true");
    document.body.classList.remove("modal-open");
    changePasswordForm?.reset();
    deleteAccountForm?.reset();
    if (deleteConfirmation) deleteConfirmation.hidden = true;
    setSettingsFeedback(passwordFeedback);
    setSettingsFeedback(deleteFeedback);
  }

  function setLoading(button, loading, label) {
    if (!button) return;
    if (loading) {
      button.dataset.originalText = button.textContent;
      button.textContent = label || tr("Aguarde...");
      button.disabled = true;
      button.classList.add("loading");
    } else {
      button.disabled = false;
      button.classList.remove("loading");
      if (button.dataset.originalText) {
        button.textContent = button.dataset.originalText;
        delete button.dataset.originalText;
      }
    }
  }

  function updateAccountUI(user) {
    currentUser = user || null;
    if (currentUser) {
      accountButton.textContent = tr("Minha conta");
      accountButton.classList.add("logged-in");
      accountEmail.textContent = currentUser.email || tr("Conta LipeX");
      if (settingsAccountEmail) settingsAccountEmail.textContent = currentUser.email || tr("Conta LipeX");
      accountMenu.hidden = true;
    } else {
      accountButton.textContent = tr("Entrar");
      accountButton.classList.remove("logged-in");
      accountEmail.textContent = "";
      accountMenu.hidden = true;
    }
  }

  async function callMercadoPagoPassSync() {
    if (!supabaseClient || !currentUser?.id) {
      return null;
    }

    const { data: sessionData, error: sessionError } =
      await supabaseClient.auth.getSession();

    if (sessionError) {
      console.error(
        "LipeX: erro lendo sessão para sincronizar Pass",
        sessionError
      );
      return null;
    }

    const accessToken = sessionData?.session?.access_token;
    if (!accessToken) return null;

    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 12000);

    try {
      const response = await fetch(
        `${config.SUPABASE_URL}/functions/v1/sync-mercadopago-pass-test`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${accessToken}`,
            "apikey": config.SUPABASE_PUBLISHABLE_KEY
          },
          body: "{}",
          signal: controller.signal
        }
      );

      const raw = await response.text();
      let payload = null;

      try {
        payload = raw ? JSON.parse(raw) : {};
      } catch (_) {
        payload = { error: raw || `HTTP ${response.status}` };
      }

      if (!response.ok) {
        console.error(
          "LipeX: sync Mercado Pago falhou",
          response.status,
          payload
        );
        throw new Error(payload?.error || `HTTP ${response.status}`);
      }

      console.log("LipeX Pass sincronizado:", payload);
      return payload;
    } catch (error) {
      if (error?.name === "AbortError") {
        console.error("LipeX: timeout sincronizando Mercado Pago Pass");
      } else {
        console.error("LipeX: falha sincronizando Mercado Pago Pass", error);
      }
      return null;
    } finally {
      window.clearTimeout(timeout);
    }
  }

  function wait(ms) {
    return new Promise((resolve) => window.setTimeout(resolve, ms));
  }

  async function syncMercadoPagoPassIfNeeded(options = {}) {
    if (!supabaseClient || !currentUser?.id) {
      return null;
    }

    const force = options?.force === true;
    const params = new URLSearchParams(window.location.search);
    const isMercadoPagoReturn =
      params.get("subscription") === "mercadopago_test_return";

    const now = Date.now();
    if (
      !force &&
      !isMercadoPagoReturn &&
      lastMercadoPagoPassSyncResult &&
      now - lastMercadoPagoPassSyncAt < 30000
    ) {
      return lastMercadoPagoPassSyncResult;
    }

    if (
      mercadoPagoPassSyncPromise &&
      mercadoPagoPassSyncUserId === currentUser.id
    ) {
      return mercadoPagoPassSyncPromise;
    }

    mercadoPagoPassSyncUserId = currentUser.id;

    mercadoPagoPassSyncPromise = (async () => {
      const delays = isMercadoPagoReturn ? [0, 1500, 3000, 5000] : [0];
      let result = null;

      for (const delay of delays) {
        if (delay > 0) await wait(delay);
        result = await callMercadoPagoPassSync();

        if (!result) continue;
        const status = String(result?.status || "");
        if (status && status !== "pending") break;
      }

      if (result) {
        lastMercadoPagoPassSyncAt = Date.now();
        lastMercadoPagoPassSyncResult = result;
      }

      if (isMercadoPagoReturn) {
        const status = String(result?.status || "");

        if (status === "active") {
          showToast(
            tr("LipeX Pass ativado. Seus jogos já estão disponíveis no launcher."),
            "success"
          );
        } else if (status === "pending") {
          showToast(
            tr("Seu LipeX Pass ainda está sendo confirmado pelo Mercado Pago."),
            "info"
          );
        } else if (status === "paused") {
          showToast(tr("Seu LipeX Pass está pausado."), "info");
        } else if (status === "canceled") {
          showToast(tr("Seu LipeX Pass foi cancelado."), "info");
        } else if (!result) {
          showToast(
            tr("Não conseguimos verificar o LipeX Pass agora. Tente atualizar a página."),
            "error"
          );
        }

        const cleanUrl = new URL(window.location.href);
        cleanUrl.searchParams.delete("subscription");
        window.history.replaceState(
          {},
          "",
          cleanUrl.pathname + cleanUrl.search + cleanUrl.hash
        );
      }

      return result;
    })();

    try {
      return await mercadoPagoPassSyncPromise;
    } finally {
      mercadoPagoPassSyncPromise = null;
    }
  }

  async function callAuthedEdgeFunction(functionName, body = {}) {
    if (!supabaseClient || !currentUser?.id) {
      throw new Error("Usuário não autenticado.");
    }

    const { data: sessionData, error: sessionError } =
      await supabaseClient.auth.getSession();

    if (sessionError) throw sessionError;
    const accessToken = sessionData?.session?.access_token;
    if (!accessToken) throw new Error("Sessão expirada.");

    const response = await fetch(
      `${config.SUPABASE_URL}/functions/v1/${functionName}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${accessToken}`,
          "apikey": config.SUPABASE_PUBLISHABLE_KEY
        },
        body: JSON.stringify(body || {})
      }
    );

    const raw = await response.text();
    let payload = {};
    try {
      payload = raw ? JSON.parse(raw) : {};
    } catch (_) {
      payload = { error: raw || `HTTP ${response.status}` };
    }

    if (!response.ok) {
      throw new Error(payload?.error || payload?.details || `HTTP ${response.status}`);
    }

    return payload;
  }

  function passStatusLabel(status) {
    const labels = {
      active: "ATIVO",
      trialing: "ATIVO",
      paused: "PAUSADO",
      pending: "PENDENTE",
      past_due: "EM ATRASO",
      canceled: "CANCELADO",
      cancelled: "CANCELADO"
    };
    return tr(labels[String(status || "").toLowerCase()] || String(status || "—").toUpperCase());
  }

  function passPlanLabel(plan) {
    return String(plan || "").toLowerCase() === "annual" ? tr("Anual") : tr("Mensal");
  }

  function passPriceLabel(subscription) {
    const provider = String(subscription?.provider || "");
    const plan = String(subscription?.plan || "monthly");
    const amount = Number(subscription?.amount);
    const currency = String(subscription?.currency || (provider === "mercadopago" ? "BRL" : "USD"));

    if (Number.isFinite(amount) && amount > 0) {
      const formatted = new Intl.NumberFormat(
        currency === "BRL" ? "pt-BR" : "en-US",
        { style: "currency", currency }
      ).format(amount);
      return `${formatted}${plan === "annual" ? tr("/ano") : tr("/mês")}`;
    }

    if (provider === "mercadopago") return plan === "annual" ? "R$ 509,90/ano" : "R$ 54,90/mês";
    if (provider === "paddle") return plan === "annual" ? "US$ 79,99/ano" : "US$ 9,99/mês";
    return "—";
  }

  function formatPassDate(value) {
    if (!value) return tr("Sem data");
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return tr("Sem data");
    return new Intl.DateTimeFormat(
      window.LipexI18n?.getLanguage?.() === "en" ? "en-US" : "pt-BR",
      { day: "2-digit", month: "2-digit", year: "numeric" }
    ).format(date);
  }


  function passProviderLabel(provider) {
    return String(provider || "").toLowerCase() === "mercadopago" ? "Mercado Pago" : String(provider || "").toLowerCase() === "paddle" ? "Paddle" : String(provider || "—");
  }

  function passMoney(amount, currency, plan) {
    const numeric = Number(amount);
    if (!Number.isFinite(numeric)) return "—";
    const code = String(currency || "BRL").toUpperCase();
    const formatted = new Intl.NumberFormat(code === "BRL" ? "pt-BR" : "en-US", { style: "currency", currency: code }).format(numeric);
    return `${formatted}${String(plan || "monthly") === "annual" ? tr("/ano") : tr("/mês")}`;
  }

  function closeLipexConfirm(result) {
    if (lipexConfirmModal) {
      lipexConfirmModal.classList.remove("open");
      lipexConfirmModal.setAttribute("aria-hidden", "true");
    }
    const resolve = lipexConfirmResolver;
    lipexConfirmResolver = null;
    if (resolve) resolve(Boolean(result));
  }

  function openLipexConfirm(options = {}) {
    if (!lipexConfirmModal) return Promise.resolve(false);
    if (lipexConfirmResolver) closeLipexConfirm(false);
    lipexConfirmCard?.classList.toggle("cancel-mode", options.mode === "cancel");
    if (lipexConfirmTitle) lipexConfirmTitle.textContent = String(options.title || tr("Confirmar alteração"));
    if (lipexConfirmIntro) lipexConfirmIntro.textContent = String(options.intro || "");
    if (lipexConfirmCurrentPlan) lipexConfirmCurrentPlan.textContent = String(options.currentPlan || "—");
    if (lipexConfirmCurrentProvider) lipexConfirmCurrentProvider.textContent = String(options.currentProvider || "—");
    if (lipexConfirmCurrentPrice) lipexConfirmCurrentPrice.textContent = String(options.currentPrice || "—");
    if (lipexConfirmTargetPlan) lipexConfirmTargetPlan.textContent = String(options.targetPlan || "—");
    if (lipexConfirmTargetProvider) lipexConfirmTargetProvider.textContent = String(options.targetProvider || "—");
    if (lipexConfirmTargetPrice) lipexConfirmTargetPrice.textContent = String(options.targetPrice || "—");
    if (lipexConfirmImpact) lipexConfirmImpact.innerHTML = String(options.impactHtml || "");
    if (lipexConfirmOk) lipexConfirmOk.textContent = String(options.confirmText || tr("Confirmar"));
    if (lipexConfirmCancel) lipexConfirmCancel.textContent = tr("Voltar");
    lipexConfirmModal.classList.add("open");
    lipexConfirmModal.setAttribute("aria-hidden", "false");
    return new Promise((resolve) => { lipexConfirmResolver = resolve; });
  }

  lipexConfirmClose?.addEventListener("click", () => closeLipexConfirm(false));
  lipexConfirmCancel?.addEventListener("click", () => closeLipexConfirm(false));
  lipexConfirmOk?.addEventListener("click", () => closeLipexConfirm(true));
  lipexConfirmModal?.addEventListener("click", (event) => { if (event.target === lipexConfirmModal) closeLipexConfirm(false); });

  function updatePassPlanButtons(subscription) {
    const monthlyButton = document.querySelector('[data-pass-plan="monthly"]');
    const annualButton = document.querySelector('[data-pass-plan="annual"]');
    for (const button of [monthlyButton, annualButton]) {
      if (!button) continue;
      button.disabled = false;
      button.classList.remove("current-plan");
    }

    const status = String(subscription?.status || "").toLowerCase();
    const currentPlan = String(subscription?.plan || "").toLowerCase();
    const renewalCanceled = Boolean(subscription?.renewal_canceled);
    const selectedCurrency = String(window.LipexCurrency?.getCurrency?.() || "BRL").toUpperCase();
    const currentCurrency = String(subscription?.provider || "") === "paddle" ? "USD" : "BRL";

    if (subscription && status === "pending") {
      const pendingButton = currentPlan === "annual" ? annualButton : monthlyButton;
      const otherButton = currentPlan === "annual" ? monthlyButton : annualButton;
      if (selectedCurrency === currentCurrency && pendingButton) {
        pendingButton.textContent = msg("CONTINUAR CHECKOUT", "CONTINUE CHECKOUT");
        pendingButton.disabled = false;
      } else if (pendingButton) {
        pendingButton.textContent = msg("CHECKOUT PENDENTE", "CHECKOUT PENDING");
        pendingButton.disabled = true;
      }
      if (otherButton) { otherButton.textContent = msg("FINALIZE O CHECKOUT PENDENTE", "FINISH PENDING CHECKOUT"); otherButton.disabled = true; }
      return;
    }

    const effective = ["active", "trialing", "past_due"].includes(status);
    if (!subscription || !effective) {
      if (monthlyButton) monthlyButton.textContent = tr("Assinar mensal");
      if (annualButton) annualButton.textContent = tr("Assinar anual");
      return;
    }

    if (renewalCanceled) {
      if (monthlyButton) { monthlyButton.textContent = tr("RENOVAÇÃO CANCELADA"); monthlyButton.disabled = true; }
      if (annualButton) { annualButton.textContent = tr("RENOVAÇÃO CANCELADA"); annualButton.disabled = true; }
      return;
    }

    const sameProviderCurrency = selectedCurrency === currentCurrency;

    if (monthlyButton) {
      if (sameProviderCurrency && currentPlan === "monthly") {
        monthlyButton.textContent = tr("PLANO ATUAL");
        monthlyButton.disabled = true;
        monthlyButton.classList.add("current-plan");
      } else {
        monthlyButton.textContent = currentPlan === "annual" && sameProviderCurrency ? tr("ALTERAR PARA MENSAL") : msg(`ASSINAR MENSAL EM ${selectedCurrency}`, `MONTHLY IN ${selectedCurrency}`);
      }
    }
    if (annualButton) {
      if (sameProviderCurrency && currentPlan === "annual") {
        annualButton.textContent = tr("PLANO ATUAL");
        annualButton.disabled = true;
        annualButton.classList.add("current-plan");
      } else {
        annualButton.textContent = currentPlan === "monthly" && sameProviderCurrency ? tr("ALTERAR PARA ANUAL") : msg(`ASSINAR ANUAL EM ${selectedCurrency}`, `ANNUAL IN ${selectedCurrency}`);
      }
    }
  }

  function renderPassAccount(subscription) {
    currentPassAccountSubscription = subscription || null;
    updatePassPlanButtons(subscription);
    if (passAccountLoading) passAccountLoading.hidden = true;
    setSettingsFeedback(passAccountFeedback);

    if (!subscription) {
      if (passAccountEmpty) passAccountEmpty.hidden = false;
      if (passAccountDetails) passAccountDetails.hidden = true;
      return;
    }

    if (passAccountEmpty) passAccountEmpty.hidden = true;
    if (passAccountDetails) passAccountDetails.hidden = false;

    const status = String(subscription.status || "pending").toLowerCase();
    const provider = String(subscription.provider || "");
    const renewalCanceled = Boolean(subscription.renewal_canceled);
    const accessUntil = subscription.access_until || subscription.current_period_ends_at || null;

    if (passAccountStatus) {
      passAccountStatus.textContent = passStatusLabel(status);
      passAccountStatus.dataset.status = status;
    }
    if (passAccountProvider) {
      passAccountProvider.textContent = provider === "mercadopago" ? tr("Mercado Pago") : provider === "paddle" ? tr("Paddle") : provider;
    }
    if (passAccountRenewalState) {
      passAccountRenewalState.hidden = !renewalCanceled;
      passAccountRenewalState.textContent = renewalCanceled ? tr("RENOVAÇÃO CANCELADA") : "";
    }
    if (passAccountPlan) passAccountPlan.textContent = passPlanLabel(subscription.plan);
    if (passAccountPrice) passAccountPrice.textContent = passPriceLabel(subscription);
    if (passAccountRenewalLabel) {
      passAccountRenewalLabel.textContent = renewalCanceled ? tr("Acesso até") : tr("Próxima cobrança");
    }
    if (passAccountRenewal) {
      passAccountRenewal.textContent = (status === "active" || status === "past_due")
        ? formatPassDate(accessUntil)
        : "—";
    }
    if (passAccountStarted) passAccountStarted.textContent = formatPassDate(subscription.current_period_starts_at);
    if (passAccountUpdated) passAccountUpdated.textContent = formatPassDate(subscription.updated_at);

    const canManageMp = provider === "mercadopago" && subscription.environment === "test";
    const canManagePaddle = provider === "paddle" && subscription.environment === "test";
    const canCancelRenewal = (canManageMp || canManagePaddle) && status === "active" && !renewalCanceled;
    if (passChangePlanButton) {
      passChangePlanButton.hidden = !["active", "trialing", "past_due"].includes(status) || renewalCanceled;
      passChangePlanButton.textContent = msg("Alterar plano ou moeda", "Change plan or currency");
    }
    if (passCancelButton) {
      passCancelButton.hidden = !canCancelRenewal;
      passCancelButton.textContent = tr("Cancelar renovação");
    }
    if (passAccountNote) {
      passAccountNote.textContent = renewalCanceled
        ? msg(`A renovação automática foi cancelada. Seus jogos e benefícios continuam disponíveis até ${formatPassDate(accessUntil)}. Não haverá nova cobrança.`, `Automatic renewal is canceled. Your games and benefits remain available until ${formatPassDate(accessUntil)}. There will be no new charge.`)
        : (canManageMp || canManagePaddle)
          ? tr("A cobrança é renovada automaticamente. Se cancelar a renovação, seus benefícios continuam até o fim do período já pago.")
          : "";
    }
  }

  async function refreshPassAccount(options = {}) {
    if (!currentUser?.id) return null;
    if (passAccountLoadPromise) return passAccountLoadPromise;

    passAccountLoadPromise = (async () => {
      if (passAccountLoading) passAccountLoading.hidden = false;
      try {
        if (options?.sync !== false) {
          await syncMercadoPagoPassIfNeeded({ force: options?.forceSync === true });
        }
        const data = await callAuthedEdgeFunction("get-lipex-pass-status-test", {});
        renderPassAccount(data?.primary || null);
        return data;
      } catch (error) {
        console.error("LipeX: falha carregando Pass da conta", error);
        if (passAccountLoading) passAccountLoading.hidden = true;
        renderPassAccount(null);
        setSettingsFeedback(
          passAccountFeedback,
          String(error?.message || tr("Não foi possível gerenciar sua assinatura agora.")),
          "error"
        );
        return null;
      }
    })();

    try {
      return await passAccountLoadPromise;
    } finally {
      passAccountLoadPromise = null;
    }
  }

  async function managePassAccount(action, button) {
    if (!currentUser?.id || action !== "cancel_at_period_end") return;
    const subscription = currentPassAccountSubscription || {};
    const accessUntil = subscription?.access_until || subscription?.current_period_ends_at;
    const formattedDate = formatPassDate(accessUntil);
    const confirmed = await openLipexConfirm({
      mode: "cancel",
      title: msg("Cancelar renovação?", "Cancel renewal?"),
      intro: msg("Você está cancelando apenas a renovação automática. O período já pago continua válido.", "You are canceling automatic renewal only. Your already-paid period remains valid."),
      currentPlan: passPlanLabel(subscription.plan),
      currentProvider: passProviderLabel(subscription.provider),
      currentPrice: passPriceLabel(subscription),
      impactHtml: msg(`<strong>Sem nova cobrança.</strong> Seus jogos e benefícios continuarão disponíveis até <strong>${formattedDate}</strong>.`, `<strong>No new charge.</strong> Your games and benefits remain available until <strong>${formattedDate}</strong>.`),
      confirmText: msg("Cancelar renovação", "Cancel renewal")
    });
    if (!confirmed) return;

    setLoading(button, true, tr("Cancelando renovação..."));
    setSettingsFeedback(passAccountFeedback, tr("Cancelando renovação..."), "info");
    try {
      const functionName = String(subscription?.provider || "") === "paddle"
        ? "manage-paddle-pass-test"
        : "manage-mercadopago-pass-test";
      await callAuthedEdgeFunction(functionName, { action: "cancel_at_period_end" });
      await refreshPassAccount({ sync: true, forceSync: true });
      setSettingsFeedback(passAccountFeedback, msg(`Renovação cancelada. Seu acesso continua até ${formattedDate}.`, `Renewal canceled. Your access remains active until ${formattedDate}.`), "success");
    } catch (error) {
      console.error("LipeX: falha cancelando renovação do Pass", error);
      setSettingsFeedback(passAccountFeedback, String(error?.message || tr("Não foi possível cancelar a renovação agora.")), "error");
    } finally {
      setLoading(button, false);
    }
  }

  async function loadPublicPassPrices() {
    if (!config?.SUPABASE_URL) return;
    try {
      const response = await fetch(`${config.SUPABASE_URL}/functions/v1/get-lipex-pass-prices`, {
        method: "GET",
        headers: { apikey: config.SUPABASE_PUBLISHABLE_KEY || "" }
      });
      if (!response.ok) return;
      const payload = await response.json().catch(() => null);
      const plans = payload?.plans || {};
      for (const plan of ["monthly", "annual"]) {
        const button = document.querySelector(`[data-pass-plan="${plan}"]`);
        const card = button?.closest(".lipex-pass-card");
        const priceEl = card?.querySelector(".lipex-pass-price strong");
        if (!priceEl) continue;
        const brl = Number(plans?.[plan]?.BRL);
        const usd = Number(plans?.[plan]?.USD);
        if (Number.isFinite(brl) && brl > 0) priceEl.dataset.priceBrl = String(brl);
        if (Number.isFinite(usd) && usd > 0) priceEl.dataset.priceUsd = String(usd);
      }
      const brlMonthly = Number(plans?.monthly?.BRL);
      const brlAnnual = Number(plans?.annual?.BRL);
      if (Number.isFinite(brlMonthly) && Number.isFinite(brlAnnual)) {
        const monthlyEquivalent = brlAnnual / 12;
        const yearlySaving = Math.max(0, brlMonthly * 12 - brlAnnual);
        const savingEl = document.querySelector(".lipex-pass-saving-brl");
        if (savingEl) {
          const eq = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(monthlyEquivalent);
          const save = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(yearlySaving);
          savingEl.textContent = `Equivale a cerca de ${eq} por mês. Economize ${save} por ano.`;
        }
      }
      const usdMonthly = Number(plans?.monthly?.USD);
      const usdAnnual = Number(plans?.annual?.USD);
      if (Number.isFinite(usdMonthly) && Number.isFinite(usdAnnual)) {
        const savingUsd = document.querySelector(".lipex-pass-saving-usd");
        const saving = Math.max(0, usdMonthly * 12 - usdAnnual);
        if (savingUsd) savingUsd.textContent = `Equivale a cerca de US$ ${(usdAnnual / 12).toFixed(2)} por mês. Economize US$ ${saving.toFixed(2)} por ano.`;
      }

      // O currency.js usa os data-price-*; forçamos atualização visual no valor atual.
      const currency = window.LipexCurrency?.getCurrency?.() || "BRL";
      document.querySelectorAll(".lipex-pass-price strong[data-price-brl]").forEach((el) => {
        const amount = Number(currency === "USD" ? el.dataset.priceUsd : el.dataset.priceBrl);
        if (!Number.isFinite(amount)) return;
        el.textContent = new Intl.NumberFormat(currency === "USD" ? "en-US" : "pt-BR", {
          style: "currency", currency
        }).format(amount);
      });
    } catch (error) {
      console.warn("LipeX: não foi possível atualizar preços do Pass", error);
    }
  }

  function showPaymentReturnMessage() {
    const params = new URLSearchParams(window.location.search);
    const payment = params.get("payment");
    if (!payment || !paymentBanner) return;

    const messages = {
      success: {
        title: tr("Pagamento enviado com sucesso"),
        text: tr("O Mercado Pago confirmou o retorno. A licença é liberada pelo servidor após a confirmação final do pagamento. Atualize o LipeX Launcher em alguns instantes."),
        type: "success"
      },
      pending: {
        title: tr("Pagamento pendente"),
        text: tr("Seu pagamento ainda está em processamento. A licença será liberada automaticamente quando o provedor confirmar a aprovação."),
        type: "pending"
      },
      failure: {
        title: tr("Pagamento não concluído"),
        text: tr("A compra não foi concluída. Você pode tentar novamente quando quiser."),
        type: "error"
      },
      paddle_success: {
        title: tr("Pagamento Paddle concluído"),
        text: tr("O Paddle confirmou o checkout. A licença é liberada automaticamente pelo servidor após o webhook de pagamento. Atualize o LipeX Launcher em alguns instantes."),
        type: "success"
      },
      paddle_pass_success: {
        title: tr("LipeX Pass assinado"),
        text: tr("O Paddle confirmou a assinatura. O acesso aos jogos incluídos será liberado automaticamente no launcher em alguns instantes."),
        type: "success"
      }
    };

    const message = messages[payment];
    if (!message) return;

    paymentBanner.innerHTML = `<strong>${message.title}</strong><span>${message.text}</span><button type="button" aria-label="${tr("Fechar aviso")}">×</button>`;
    paymentBanner.dataset.type = message.type;
    paymentBanner.hidden = false;
    paymentBanner.querySelector("button")?.addEventListener("click", () => {
      paymentBanner.hidden = true;
      const url = new URL(window.location.href);
      url.searchParams.delete("payment");
      url.searchParams.delete("session_id");
      url.searchParams.delete("transaction_id");
      window.history.replaceState({}, "", url.pathname + url.search + url.hash);
    });
  }

  function initializePaddleSandbox() {
    if (paddleInitialized) return true;

    const mode = String(config.PADDLE_CHECKOUT_MODE || "disabled").toLowerCase();
    const token = String(config.PADDLE_SANDBOX_CLIENT_TOKEN || "").trim();

    if (mode !== "sandbox") return false;
    if (!token.startsWith("test_")) {
      console.error("LipeX: PADDLE_SANDBOX_CLIENT_TOKEN não configurado.");
      return false;
    }
    if (!window.Paddle) {
      console.error("LipeX: Paddle.js não carregou.");
      return false;
    }

    try {
      window.Paddle.Environment.set("sandbox");
      window.Paddle.Initialize({
        token,
        eventCallback(event) {
          const eventName = String(event?.name || "");

          if (eventName === "checkout.completed") {
            const transactionId = String(event?.data?.transaction_id || "");
            const isPassCheckout = activePaddleCheckoutKind === "pass";
            const url = new URL(window.location.href);
            url.searchParams.set("payment", isPassCheckout ? "paddle_pass_success" : "paddle_success");
            if (transactionId) url.searchParams.set("transaction_id", transactionId);
            window.history.replaceState({}, "", url.pathname + url.search + url.hash);
            showPaymentReturnMessage();
  loadPublicPassPrices();
            showToast(
              isPassCheckout
                ? tr("Assinatura concluída. O acesso será liberado automaticamente no launcher.")
                : tr("Pagamento concluído. A licença será liberada automaticamente no launcher."),
              "success"
            );
          }

          if (eventName === "checkout.closed" || eventName === "checkout.completed") {
            if (activePaddleCheckoutButton) {
              setLoading(activePaddleCheckoutButton, false);
              activePaddleCheckoutButton = null;
            }
            activePaddleCheckoutKind = null;
          }
        }
      });
      paddleInitialized = true;
      return true;
    } catch (error) {
      console.error("LipeX: falha ao inicializar Paddle Sandbox:", error);
      return false;
    }
  }

  if (!configReady) {
    console.warn("LipeX: SUPABASE_PUBLISHABLE_KEY ainda não foi configurada em config.js.");
  } else if (window.supabase?.createClient) {
    supabaseClient = window.supabase.createClient(
      config.SUPABASE_URL,
      config.SUPABASE_PUBLISHABLE_KEY,
      {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
          detectSessionInUrl: true
        }
      }
    );
  }

  accountButton?.addEventListener("click", () => {
    if (!configReady) {
      showToast(tr("A conexão com o Supabase ainda precisa ser finalizada."), "error");
      return;
    }
    if (currentUser) {
      accountMenu.hidden = !accountMenu.hidden;
    } else {
      openAuth("login");
    }
  });

  document.addEventListener("click", (event) => {
    if (!accountMenu || !accountButton) return;
    if (!accountMenu.contains(event.target) && !accountButton.contains(event.target) && currentUser) {
      accountMenu.hidden = true;
    }
  });

  authClose?.addEventListener("click", closeAuth);
  authModal?.addEventListener("click", (event) => {
    if (event.target === authModal) closeAuth();
  });
  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") return;
    if (accountSettingsModal?.classList.contains("open")) { closeAccountSettings(); return; }
    if (authModal?.classList.contains("open")) closeAuth();
  });

  authSwitch?.addEventListener("click", () => {
    setAuthMode(mode === "login" ? "register" : "login");
  });

  forgotPasswordButton?.addEventListener("click", () => {
    setAuthMode("forgot");
    window.setTimeout(() => emailInput?.focus(), 40);
  });

  authForm?.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (!supabaseClient) {
      setAuthFeedback(tr("A conexão com o Supabase ainda não foi configurada."), "error");
      return;
    }

    const email = emailInput.value.trim().toLowerCase();
    const password = passwordInput?.value || "";

    if (!email) {
      setAuthFeedback(tr("Informe seu e-mail."), "error");
      return;
    }
    if (mode !== "forgot" && !password) {
      setAuthFeedback(tr("Preencha e-mail e senha."), "error");
      return;
    }
    if (mode !== "forgot" && password.length < 6) {
      setAuthFeedback(tr("A senha precisa ter pelo menos 6 caracteres."), "error");
      return;
    }

    const loadingLabel = mode === "register" ? tr("Criando conta...") : mode === "forgot" ? tr("Enviando link...") : tr("Entrando...");
    setLoading(authSubmit, true, loadingLabel);
    setAuthFeedback();

    try {
      if (mode === "register") {
        const redirectUrl = window.location.origin + window.location.pathname;
        const { data, error } = await supabaseClient.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: redirectUrl }
        });

        if (error) throw error;

        if (data?.session) {
          updateAccountUI(data.user);
          closeAuth();
          showToast(tr("Conta criada e login realizado."), "success");
          continueDirectCheckoutIfReady();
        } else {
          setAuthFeedback(tr("Conta criada. Confira seu e-mail para confirmar o cadastro antes de entrar."), "success");
        }
      } else if (mode === "forgot") {
        const redirectUrl = new URL("reset-password.html", window.location.href).href;
        const { error } = await supabaseClient.auth.resetPasswordForEmail(email, { redirectTo: redirectUrl });
        if (error) throw error;
        setAuthFeedback(tr("Se esse e-mail estiver cadastrado, enviaremos um link de recuperação. Confira sua caixa de entrada e o spam."), "success");
      } else {
        const { data, error } = await supabaseClient.auth.signInWithPassword({ email, password });
        if (error) throw error;
        updateAccountUI(data.user);
        closeAuth();
        showToast(tr("Login realizado com sucesso."), "success");
        continueDirectCheckoutIfReady();
      }
    } catch (error) {
      console.error(error);
      const raw = String(error?.message || "");
      const message = raw.toLowerCase().includes("invalid login credentials")
        ? tr("E-mail ou senha incorretos.")
        : raw.toLowerCase().includes("already registered")
          ? tr("Esse e-mail já possui uma conta. Tente entrar.")
          : raw || tr("Não foi possível concluir a autenticação.");
      setAuthFeedback(message, "error");
    } finally {
      setLoading(authSubmit, false);
    }
  });

  manageAccountButton?.addEventListener("click", openAccountSettings);
  accountSettingsClose?.addEventListener("click", closeAccountSettings);
  accountSettingsModal?.addEventListener("click", (event) => {
    if (event.target === accountSettingsModal) closeAccountSettings();
  });


  passCancelButton?.addEventListener("click", () => managePassAccount("cancel_at_period_end", passCancelButton));
  passViewPlansButton?.addEventListener("click", () => {
    closeAccountSettings();
    document.querySelector("#lipex-pass")?.scrollIntoView({ behavior: "smooth", block: "start" });
  });
  passChangePlanButton?.addEventListener("click", () => {
    closeAccountSettings();
    document.querySelector("#lipex-pass")?.scrollIntoView({ behavior: "smooth", block: "start" });
  });

  showDeleteAccountButton?.addEventListener("click", () => {
    if (!deleteConfirmation) return;
    deleteConfirmation.hidden = false;
    setSettingsFeedback(deleteFeedback);
    window.setTimeout(() => deleteCurrentPasswordInput?.focus(), 40);
  });

  cancelDeleteAccountButton?.addEventListener("click", () => {
    if (deleteConfirmation) deleteConfirmation.hidden = true;
    deleteAccountForm?.reset();
    setSettingsFeedback(deleteFeedback);
  });

  changePasswordForm?.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (!supabaseClient || !currentUser?.email) return;
    const currentPassword = currentPasswordInput?.value || "";
    const newPassword = newPasswordInput?.value || "";
    const confirmPassword = confirmPasswordInput?.value || "";
    if (!currentPassword || !newPassword || !confirmPassword) { setSettingsFeedback(passwordFeedback, tr("Preencha todos os campos de senha."), "error"); return; }
    if (newPassword.length < 6) { setSettingsFeedback(passwordFeedback, tr("A nova senha precisa ter pelo menos 6 caracteres."), "error"); return; }
    if (newPassword !== confirmPassword) { setSettingsFeedback(passwordFeedback, tr("As novas senhas não coincidem."), "error"); return; }
    if (newPassword === currentPassword) { setSettingsFeedback(passwordFeedback, tr("A nova senha deve ser diferente da senha atual."), "error"); return; }
    setLoading(changePasswordButton, true, tr("Alterando senha...")); setSettingsFeedback(passwordFeedback);
    try {
      const { error: verifyError } = await supabaseClient.auth.signInWithPassword({ email: currentUser.email, password: currentPassword });
      if (verifyError) throw new Error("CURRENT_PASSWORD_INVALID");
      const { error } = await supabaseClient.auth.updateUser({ password: newPassword });
      if (error) throw error;
      changePasswordForm.reset(); setSettingsFeedback(passwordFeedback, tr("Senha alterada com sucesso."), "success"); showToast(tr("Senha alterada com sucesso."), "success");
    } catch (error) {
      console.error(error); const raw = String(error?.message || "");
      const message = raw === "CURRENT_PASSWORD_INVALID" || raw.toLowerCase().includes("invalid login credentials") ? tr("Senha atual incorreta.") : raw || tr("Não foi possível alterar a senha.");
      setSettingsFeedback(passwordFeedback, message, "error");
    } finally { setLoading(changePasswordButton, false); }
  });

  deleteAccountForm?.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (!supabaseClient || !currentUser?.email) return;
    const currentPassword = deleteCurrentPasswordInput?.value || "";
    const typed = (deleteConfirmationText?.value || "").trim().toUpperCase();
    const expected = window.LipexI18n?.getLanguage?.() === "en" ? "DELETE" : "EXCLUIR";
    if (!currentPassword) { setSettingsFeedback(deleteFeedback, tr("Preencha todos os campos de senha."), "error"); return; }
    if (typed !== expected) { setSettingsFeedback(deleteFeedback, tr("Digite EXCLUIR para confirmar."), "error"); return; }
    setLoading(deleteAccountButton, true, tr("Excluindo conta...")); setSettingsFeedback(deleteFeedback);
    try {
      const { error: verifyError } = await supabaseClient.auth.signInWithPassword({ email: currentUser.email, password: currentPassword });
      if (verifyError) throw new Error("CURRENT_PASSWORD_INVALID");
      const { data, error } = await supabaseClient.functions.invoke("delete-account", { body: { confirmation: "EXCLUIR" } });
      if (error) {
        const status = error?.context?.status; if (status === 404) throw new Error("FUNCTION_NOT_DEPLOYED");
        let serverMessage = ""; try { if (error?.context && typeof error.context.json === "function") { const parsed = await error.context.json(); serverMessage = parsed?.error || parsed?.details || ""; } } catch (_) {}
        throw new Error(serverMessage || error.message || tr("Não foi possível excluir a conta."));
      }
      if (!data?.ok) throw new Error(data?.error || tr("Não foi possível excluir a conta."));
      await supabaseClient.auth.signOut({ scope: "local" }).catch(() => {});
      closeAccountSettings(); updateAccountUI(null); showToast(tr("Sua conta foi excluída."), "success");
    } catch (error) {
      console.error(error); const raw = String(error?.message || "");
      const message = raw === "CURRENT_PASSWORD_INVALID" || raw.toLowerCase().includes("invalid login credentials") ? tr("Senha atual incorreta.") : raw === "FUNCTION_NOT_DEPLOYED" ? tr("A função de exclusão da conta ainda não foi publicada no servidor.") : raw || tr("Não foi possível excluir a conta.");
      setSettingsFeedback(deleteFeedback, message, "error");
    } finally { setLoading(deleteAccountButton, false); }
  });

  logoutButton?.addEventListener("click", async () => {
    if (!supabaseClient) return;
    await supabaseClient.auth.signOut();
    accountMenu.hidden = true;
    updateAccountUI(null);
    showToast(tr("Você saiu da conta."), "info");
  });

  document.addEventListener("click", async (event) => {
    const button = event.target.closest("[data-buy-product]");
    if (!button) return;
    event.preventDefault();

      if (!supabaseClient || !configReady) {
        showToast(tr("A conexão do site com o Supabase ainda não foi finalizada."), "error");
        return;
      }

      if (!currentUser) {
        openAuth("login");
        setAuthFeedback(tr("Entre na sua conta antes de comprar. A licença será vinculada a ela."), "info");
        return;
      }

      const productSlug = button.dataset.buyProduct;
      setLoading(button, true, tr("Abrindo checkout..."));

      try {
        const selectedCurrency = window.LipexCurrency?.getCurrency?.() || "BRL";
        const isPaddle = selectedCurrency === "USD";
        const checkoutFunction = isPaddle
          ? "create-checkout-paddle"
          : "create-checkout-prod";

        if (isPaddle && !initializePaddleSandbox()) {
          throw new Error(
            tr("O checkout internacional de teste ainda não está disponível nesta página.")
          );
        }

        const { data, error } = await supabaseClient.functions.invoke(
          checkoutFunction,
          { body: { product_slug: productSlug } }
        );

        if (error) {
          const context = error?.context;
          let serverMessage = "";
          try {
            if (context && typeof context.json === "function") {
              const parsed = await context.json();
              serverMessage = parsed?.error || parsed?.details || "";
            }
          } catch (_) {}
          throw new Error(serverMessage || error.message || tr("Falha ao criar checkout."));
        }

        if (isPaddle) {
          const transactionId = String(data?.transaction_id || "");
          if (!transactionId.startsWith("txn_")) {
            throw new Error(data?.error || tr("O Paddle não retornou uma transação válida."));
          }

          activePaddleCheckoutButton = button;
          activePaddleCheckoutKind = "game";
          window.Paddle.Checkout.open({
            transactionId,
            settings: {
              displayMode: "overlay",
              theme: "dark",
              locale: window.LipexI18n?.getLanguage?.() === "en" ? "en" : "pt"
            }
          });
          return;
        }

        if (!data?.checkout_url) {
          throw new Error(data?.error || tr("O checkout não retornou uma URL válida."));
        }

        window.location.assign(data.checkout_url);
      } catch (error) {
        console.error(error);
        const message = String(error?.message || tr("Não foi possível abrir o checkout."));
        showToast(message, message.includes("biblioteca") ? "info" : "error");
        setLoading(button, false);
      }

  });


  async function openPassCheckout(plan, currency, button) {
    const isBrl = currency === "BRL";
    if (!isBrl && !initializePaddleSandbox()) throw new Error(tr("O checkout do LipeX Pass ainda não está disponível nesta página."));
    setLoading(button, true, tr("Abrindo checkout..."));
    const functionName = isBrl ? "create-checkout-mercadopago-pass-test" : "create-checkout-paddle-pass";
    const { data, error } = await supabaseClient.functions.invoke(functionName, { body: { plan } });
    if (error) {
      const context = error?.context;
      let serverMessage = "";
      try { if (context && typeof context.json === "function") { const parsed = await context.json(); serverMessage = parsed?.error || parsed?.details || ""; } } catch (_) {}
      throw new Error(serverMessage || error.message || tr("Falha ao criar checkout."));
    }
    if (isBrl) {
      const url = String(data?.checkout_url || "");
      if (!url.startsWith("https://")) throw new Error(data?.error || tr("O Mercado Pago não retornou um checkout válido."));
      window.location.assign(url);
      return;
    }
    const transactionId = String(data?.transaction_id || "");
    if (!transactionId.startsWith("txn_")) throw new Error(data?.error || tr("O Paddle não retornou uma transação válida."));
    activePaddleCheckoutButton = button;
    activePaddleCheckoutKind = "pass";
    window.Paddle.Checkout.open({ transactionId, settings: { displayMode: "overlay", theme: "dark", locale: window.LipexI18n?.getLanguage?.() === "en" ? "en" : "pt" } });
  }

  document.addEventListener("click", async (event) => {
    const button = event.target.closest("[data-pass-plan]");
    if (!button) return;
    event.preventDefault();
    if (!supabaseClient || !configReady) { showToast(tr("A conexão do site com o Supabase ainda não foi finalizada."), "error"); return; }
    const plan = String(button.dataset.passPlan || "").toLowerCase();
    if (!["monthly", "annual"].includes(plan)) return;
    if (!currentUser) { pendingPassPlan = plan; openAuth("login"); setAuthFeedback(tr("Entre na sua conta antes de assinar. O LipeX Pass será vinculado a ela."), "info"); return; }

    const selectedCurrency = String(pendingPassCurrency || window.LipexCurrency?.getCurrency?.() || "BRL").toUpperCase() === "USD" ? "USD" : "BRL";
    pendingPassCurrency = null;
    setLoading(button, true, tr("Verificando assinatura..."));
    try {
      const statusData = await callAuthedEdgeFunction("get-lipex-pass-status-test", {});
      const existing = statusData?.primary || null;
      const existingStatus = String(existing?.status || "").toLowerCase();
      if (existing && existingStatus === "paused") {
        throw new Error(tr("Você já possui um LipeX Pass pausado. Reative a assinatura existente em vez de criar outra."));
      }
      if (existing && existingStatus === "pending") {
        const pendingCurrency = String(existing?.currency || (existing?.provider === "paddle" ? "USD" : "BRL")).toUpperCase();
        const pendingPlan = String(existing?.plan || plan).toLowerCase();
        if (pendingCurrency === selectedCurrency && pendingPlan === plan) {
          setLoading(button, true, msg("Continuando checkout...", "Continuing checkout..."));
          await openPassCheckout(plan, selectedCurrency, button);
          return;
        }
        throw new Error(msg("Existe outro checkout pendente nesta conta. Continue aquele checkout antes de iniciar uma opção diferente.", "Another checkout is pending on this account. Continue that checkout before starting a different option."));
      }

      const preview = await callAuthedEdgeFunction("prepare-lipex-pass-switch", { action: "preview", target_plan: plan, target_currency: selectedCurrency });
      if (preview?.mode === "new_subscription") {
        await openPassCheckout(plan, selectedCurrency, button);
        return;
      }
      if (preview?.mode === "unchanged") {
        throw new Error(tr("Você já possui este LipeX Pass ativo neste provedor e moeda."));
      }

      const currentPrice = passMoney(preview?.current_amount, preview?.current_currency, preview?.current_plan);
      const targetPrice = passMoney(preview?.target_amount, preview?.target_currency, preview?.target_plan);
      const currentProvider = passProviderLabel(preview?.current_provider);
      const targetProvider = passProviderLabel(preview?.target_provider);
      const accessUntil = formatPassDate(preview?.access_until);
      const providerChanges = String(preview?.current_provider) !== String(preview?.target_provider);
      const immediateCharge = Boolean(preview?.immediate_charge);
      const impact = preview?.mode === "same_provider_plan_change"
        ? msg(`<strong>A assinatura atual será atualizada no ${targetProvider}.</strong> Não será criada uma segunda assinatura e esta alteração não gera cobrança imediata. A próxima renovação seguirá o novo plano.`, `<strong>Your current subscription will be updated on ${targetProvider}.</strong> A second subscription will not be created and this change does not charge immediately. Your next renewal will use the new plan.`)
        : msg(`<strong>${providerChanges ? `O provedor mudará de ${currentProvider} para ${targetProvider} somente se o novo checkout for pago.` : `A assinatura será substituída no ${targetProvider} somente após a confirmação do novo pagamento.`}</strong> Apenas abrir ou fechar o checkout <strong>não altera a renovação atual</strong>. Depois que o novo plano for ativado, a LipeX encerra a próxima renovação do plano antigo para evitar duas cobranças recorrentes. Seu acesso atual permanece protegido. ${immediateCharge ? "Ao continuar, o novo checkout será aberto e poderá cobrar o novo plano imediatamente." : ""}`, `<strong>${providerChanges ? `The provider will change from ${currentProvider} to ${targetProvider} only if the new checkout is paid.` : `The subscription will be replaced on ${targetProvider} only after the new payment is confirmed.`}</strong> Merely opening or closing checkout <strong>does not change your current renewal</strong>. Once the new plan activates, LipeX stops the next renewal on the old plan to prevent two recurring charges. Your current access remains protected. ${immediateCharge ? "Continuing opens the new checkout, which may charge the new plan immediately." : ""}`);

      const confirmed = await openLipexConfirm({
        title: msg("Confirmar alteração do LipeX Pass", "Confirm LipeX Pass change"),
        intro: msg("Confira o plano, moeda e provedor antes de continuar.", "Review the plan, currency, and provider before continuing."),
        currentPlan: passPlanLabel(preview?.current_plan), currentProvider, currentPrice,
        targetPlan: passPlanLabel(preview?.target_plan), targetProvider, targetPrice,
        impactHtml: impact,
        confirmText: preview?.mode === "same_provider_plan_change" ? msg("Alterar plano", "Change plan") : msg("Continuar para checkout", "Continue to checkout")
      });
      if (!confirmed) return;

      if (preview?.mode === "same_provider_plan_change") {
        setLoading(button, true, tr("Alterando plano..."));
        await callAuthedEdgeFunction("change-lipex-pass-plan-test", { target_plan: plan });
        const refreshed = await callAuthedEdgeFunction("get-lipex-pass-status-test", {});
        renderPassAccount(refreshed?.primary || null);
        showToast(msg("Plano alterado. A próxima renovação seguirá o novo valor e período.", "Plan changed. The next renewal will use the new price and billing period."), "success");
        return;
      }

      setLoading(button, true, tr("Preparando troca..."));
      await callAuthedEdgeFunction("prepare-lipex-pass-switch", { action: "commit", target_plan: plan, target_currency: selectedCurrency });
      await openPassCheckout(plan, selectedCurrency, button);
    } catch (error) {
      console.error(error);
      const message = String(error?.message || tr("Não foi possível abrir o checkout."));
      showToast(message, /já possui|already|renovação|renewal|pausad|pending|aguardando/i.test(message) ? "info" : "error");
    } finally {
      if (activePaddleCheckoutButton !== button) setLoading(button, false);
    }
  });



  document.addEventListener("click", (event) => {
    const card = event.target.closest("[data-product-page]");
    if (!card || event.target.closest("a,button,input,select,textarea")) return;
    const target = card.dataset.productPage;
    if (target) window.location.assign(target);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key !== "Enter" && event.key !== " ") return;
    const card = event.target.closest?.("[data-product-page]");
    if (!card) return;
    event.preventDefault();
    const target = card.dataset.productPage;
    if (target) window.location.assign(target);
  });

  window.addEventListener("lipex:siteconfigapplied", () => {
    continueDirectCheckoutIfReady();
  });


  const productMainImage = document.querySelector("#product-main-image");
  const productThumbs = [...document.querySelectorAll("[data-gallery-image]")];
  productThumbs.forEach((button) => {
    button.addEventListener("click", () => {
      if (!productMainImage) return;
      const nextSrc = button.dataset.galleryImage;
      const nextAlt = button.dataset.galleryAlt || productMainImage.alt;
      if (!nextSrc) return;
      productMainImage.src = nextSrc;
      productMainImage.alt = nextAlt;
      productThumbs.forEach((thumb) => thumb.classList.toggle("active", thumb === button));
    });
  });

  const siteHeader = document.querySelector(".site-header");
  const syncHeaderScrollState = () => {
    if (!siteHeader) return;
    siteHeader.classList.toggle("scrolled", window.scrollY > 18);
  };
  syncHeaderScrollState();
  window.addEventListener("scroll", syncHeaderScrollState, { passive: true });

  window.addEventListener("lipex:languagechange", () => {
    setAuthMode(mode);
    updateAccountUI(currentUser);
    if (accountSettingsModal?.classList.contains("open") && currentUser) {
      refreshPassAccount({ sync: false }).catch(() => {});
    }
  });

  window.addEventListener("lipex:currencychange", () => {
    updatePassPlanButtons(currentPassAccountSubscription);
  });

  async function consumeLauncherHandoff() {
    if (!supabaseClient) return { handled: false, ok: false };
    const rawHash = String(window.location.hash || "").replace(/^#/, "");
    const hashParams = new URLSearchParams(rawHash);
    const tokenHash = String(hashParams.get("handoff") || "");
    const expectedUserId = String(hashParams.get("uid") || "");
    if (!tokenHash) return { handled: false, ok: false };
    try {
      // A launcher handoff always wins over an old browser session.
      await supabaseClient.auth.signOut({ scope: "local" }).catch(() => {});
      const { data, error } = await supabaseClient.auth.verifyOtp({ token_hash: tokenHash, type: "email" });
      if (error) throw error;
      const actualUserId = String(data?.user?.id || data?.session?.user?.id || "");
      if (!actualUserId || actualUserId !== expectedUserId) {
        await supabaseClient.auth.signOut({ scope: "local" }).catch(() => {});
        throw new Error("ACCOUNT_HANDOFF_MISMATCH");
      }
      const clean = new URL(window.location.href);
      clean.hash = "lipex-pass";
      window.history.replaceState({}, "", clean.pathname + clean.search + clean.hash);
      return { handled: true, ok: true, user: data?.user || data?.session?.user || null };
    } catch (error) {
      console.error("LipeX launcher→site handoff:", error);
      const clean = new URL(window.location.href); clean.hash = "lipex-pass";
      window.history.replaceState({}, "", clean.pathname + clean.search + clean.hash);
      showToast(tr("Não foi possível confirmar no site a mesma conta usada no launcher. Entre novamente antes de comprar."), "error");
      return { handled: true, ok: false };
    }
  }

  async function initializeAuth() {
    showPaymentReturnMessage();
    if (!supabaseClient) {
      updateAccountUI(null);
      return;
    }

    const handoff = await consumeLauncherHandoff();
    const { data } = await supabaseClient.auth.getSession();
    updateAccountUI(data?.session?.user || null);
    if (currentUser) {
      await syncMercadoPagoPassIfNeeded();
      await refreshPassAccount({ sync: false }).catch(() => null);
    } else {
      renderPassAccount(null);
    }
    continueDirectCheckoutIfReady();

    supabaseClient.auth.onAuthStateChange((event, session) => {
      updateAccountUI(session?.user || null);
      if (session?.user) {
        if (event === "SIGNED_IN" || event === "USER_UPDATED") {
          syncMercadoPagoPassIfNeeded().then(() => refreshPassAccount({ sync: false })).catch(() => {});
        }
        continueDirectCheckoutIfReady();
      }
    });
  }

  initializeAuth();
})();
