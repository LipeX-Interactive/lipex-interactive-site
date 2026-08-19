(() => {
  const config = window.LIPEX_CONFIG || {};
  const tr = (text) => window.LipexI18n?.t?.(text) || text;
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
  const accountSettingsClose = document.querySelector("#account-settings-close");
  const settingsAccountEmail = document.querySelector("#settings-account-email");
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
  const toast = document.querySelector("#toast");
  const paymentBanner = document.querySelector("#payment-banner");
  const buyButtons = [...document.querySelectorAll("[data-buy-product]")];

  let mode = "login";
  let currentUser = null;
  let supabaseClient = null;
  let pendingDirectCheckout = null;

  function captureDirectCheckoutRequest() {
    const params = new URLSearchParams(window.location.search);
    const requestedProduct = String(params.get("checkout") || "").trim();
    if (!requestedProduct) return;

    const matchingButton = buyButtons.find(
      (button) => button.dataset.buyProduct === requestedProduct
    );
    if (!matchingButton) return;

    pendingDirectCheckout = requestedProduct;

    // Remove only the checkout flag from the visible URL so refresh/back
    // does not accidentally create another checkout session.
    params.delete("checkout");
    const nextQuery = params.toString();
    const nextUrl =
      window.location.pathname +
      (nextQuery ? `?${nextQuery}` : "") +
      window.location.hash;
    window.history.replaceState({}, "", nextUrl);
  }

  function continueDirectCheckoutIfReady() {
    if (!pendingDirectCheckout) return;

    const matchingButton = buyButtons.find(
      (button) => button.dataset.buyProduct === pendingDirectCheckout
    );
    if (!matchingButton) {
      pendingDirectCheckout = null;
      return;
    }

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

  function openAccountSettings() {
    if (!currentUser || !accountSettingsModal) return;
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
  }

  function closeAccountSettings() {
    accountSettingsModal?.classList.remove("open");
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
      stripe_success: {
        title: tr("Pagamento Stripe concluído"),
        text: tr("A Stripe confirmou o checkout. A licença é liberada automaticamente pelo servidor após a confirmação do pagamento. Atualize o LipeX Launcher em alguns instantes."),
        type: "success"
      },
      stripe_cancel: {
        title: tr("Checkout Stripe cancelado"),
        text: tr("A compra não foi concluída. Nenhuma licença foi liberada e você pode tentar novamente quando quiser."),
        type: "error"
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
      window.history.replaceState({}, "", url.pathname + url.search + url.hash);
    });
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

  buyButtons.forEach((button) => {
    button.addEventListener("click", async () => {
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
        let checkoutFunction = "create-checkout-prod";

        if (selectedCurrency === "USD") {
          const host = String(window.location.hostname || "").toLowerCase();
          const isLocalTest = host === "localhost" || host === "127.0.0.1";

          if (isLocalTest) {
            checkoutFunction = "create-checkout-stripe-test";
          } else {
            const stripeMode = String(
              window.LIPEX_CONFIG?.STRIPE_CHECKOUT_MODE || "disabled"
            ).toLowerCase();

            if (stripeMode !== "prod") {
              showToast(
                tr("Os pagamentos internacionais estão temporariamente indisponíveis. Tente novamente em breve."),
                "info"
              );
              setLoading(button, false);
              return;
            }

            checkoutFunction = "create-checkout-stripe-prod";
          }
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
  });


  const clickableGameCards = [...document.querySelectorAll("[data-product-page]")];
  clickableGameCards.forEach((card) => {
    const openProduct = () => {
      const target = card.dataset.productPage;
      if (target) window.location.assign(target);
    };

    card.addEventListener("click", (event) => {
      if (event.target.closest("a,button,input,select,textarea")) return;
      openProduct();
    });

    card.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        openProduct();
      }
    });
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
  });

  async function initializeAuth() {
    showPaymentReturnMessage();
    if (!supabaseClient) {
      updateAccountUI(null);
      return;
    }

    const { data } = await supabaseClient.auth.getSession();
    updateAccountUI(data?.session?.user || null);
    continueDirectCheckoutIfReady();

    supabaseClient.auth.onAuthStateChange((_event, session) => {
      updateAccountUI(session?.user || null);
      if (session?.user) continueDirectCheckoutIfReady();
    });
  }

  initializeAuth();
})();
