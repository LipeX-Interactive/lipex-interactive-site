(() => {
  const config = window.LIPEX_CONFIG || {};
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
  const toast = document.querySelector("#toast");
  const paymentBanner = document.querySelector("#payment-banner");
  const buyButtons = [...document.querySelectorAll("[data-buy-product]")];

  let mode = "login";
  let currentUser = null;
  let supabaseClient = null;

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
    if (mode === "register") {
      authTitle.textContent = "Criar conta LipeX";
      authSubtitle.textContent = "Use o mesmo e-mail que você usará no LipeX Launcher.";
      authSubmit.textContent = "Criar conta";
      authSwitchText.textContent = "Já tem uma conta?";
      authSwitch.textContent = "Entrar";
    } else {
      authTitle.textContent = "Entrar na LipeX";
      authSubtitle.textContent = "A compra será vinculada à sua conta e liberada no launcher.";
      authSubmit.textContent = "Entrar";
      authSwitchText.textContent = "Ainda não tem conta?";
      authSwitch.textContent = "Criar conta";
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

  function setLoading(button, loading, label) {
    if (!button) return;
    if (loading) {
      button.dataset.originalText = button.textContent;
      button.textContent = label || "Aguarde...";
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
      accountButton.textContent = "Minha conta";
      accountButton.classList.add("logged-in");
      accountEmail.textContent = currentUser.email || "Conta LipeX";
      accountMenu.hidden = false;
    } else {
      accountButton.textContent = "Entrar";
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
        title: "Pagamento enviado com sucesso",
        text: "O Mercado Pago confirmou o retorno. A licença é liberada pelo servidor após a confirmação final do pagamento. Atualize o LipeX Launcher em alguns instantes.",
        type: "success"
      },
      pending: {
        title: "Pagamento pendente",
        text: "Seu pagamento ainda está em processamento. A licença será liberada automaticamente quando o provedor confirmar a aprovação.",
        type: "pending"
      },
      failure: {
        title: "Pagamento não concluído",
        text: "A compra não foi concluída. Você pode tentar novamente quando quiser.",
        type: "error"
      }
    };

    const message = messages[payment];
    if (!message) return;

    paymentBanner.innerHTML = `<strong>${message.title}</strong><span>${message.text}</span><button type="button" aria-label="Fechar aviso">×</button>`;
    paymentBanner.dataset.type = message.type;
    paymentBanner.hidden = false;
    paymentBanner.querySelector("button")?.addEventListener("click", () => {
      paymentBanner.hidden = true;
      const url = new URL(window.location.href);
      url.searchParams.delete("payment");
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
      showToast("A conexão com o Supabase ainda precisa ser finalizada.", "error");
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
    if (event.key === "Escape" && authModal?.classList.contains("open")) closeAuth();
  });

  authSwitch?.addEventListener("click", () => {
    setAuthMode(mode === "login" ? "register" : "login");
  });

  authForm?.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (!supabaseClient) {
      setAuthFeedback("A conexão com o Supabase ainda não foi configurada.", "error");
      return;
    }

    const email = emailInput.value.trim().toLowerCase();
    const password = passwordInput.value;

    if (!email || !password) {
      setAuthFeedback("Preencha e-mail e senha.", "error");
      return;
    }
    if (password.length < 6) {
      setAuthFeedback("A senha precisa ter pelo menos 6 caracteres.", "error");
      return;
    }

    setLoading(authSubmit, true, mode === "register" ? "Criando conta..." : "Entrando...");
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
          showToast("Conta criada e login realizado.", "success");
        } else {
          setAuthFeedback("Conta criada. Confira seu e-mail para confirmar o cadastro antes de entrar.", "success");
        }
      } else {
        const { data, error } = await supabaseClient.auth.signInWithPassword({ email, password });
        if (error) throw error;
        updateAccountUI(data.user);
        closeAuth();
        showToast("Login realizado com sucesso.", "success");
      }
    } catch (error) {
      console.error(error);
      const raw = String(error?.message || "");
      const message = raw.toLowerCase().includes("invalid login credentials")
        ? "E-mail ou senha incorretos."
        : raw.toLowerCase().includes("already registered")
          ? "Esse e-mail já possui uma conta. Tente entrar."
          : raw || "Não foi possível concluir a autenticação.";
      setAuthFeedback(message, "error");
    } finally {
      setLoading(authSubmit, false);
    }
  });

  logoutButton?.addEventListener("click", async () => {
    if (!supabaseClient) return;
    await supabaseClient.auth.signOut();
    accountMenu.hidden = true;
    updateAccountUI(null);
    showToast("Você saiu da conta.", "info");
  });

  buyButtons.forEach((button) => {
    button.addEventListener("click", async () => {
      if (!supabaseClient || !configReady) {
        showToast("A conexão do site com o Supabase ainda não foi finalizada.", "error");
        return;
      }

      if (!currentUser) {
        openAuth("login");
        setAuthFeedback("Entre na sua conta antes de comprar. A licença será vinculada a ela.", "info");
        return;
      }

      const productSlug = button.dataset.buyProduct;
      setLoading(button, true, "Abrindo checkout...");

      try {
        const { data, error } = await supabaseClient.functions.invoke(
          "create-checkout-prod",
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
          throw new Error(serverMessage || error.message || "Falha ao criar checkout.");
        }

        if (!data?.checkout_url) {
          throw new Error(data?.error || "O checkout não retornou uma URL válida.");
        }

        window.location.assign(data.checkout_url);
      } catch (error) {
        console.error(error);
        const message = String(error?.message || "Não foi possível abrir o checkout.");
        showToast(message, message.includes("biblioteca") ? "info" : "error");
        setLoading(button, false);
      }
    });
  });

  async function initializeAuth() {
    showPaymentReturnMessage();
    if (!supabaseClient) {
      updateAccountUI(null);
      return;
    }

    const { data } = await supabaseClient.auth.getSession();
    updateAccountUI(data?.session?.user || null);

    supabaseClient.auth.onAuthStateChange((_event, session) => {
      updateAccountUI(session?.user || null);
    });
  }

  initializeAuth();
})();
