(() => {
  const STORAGE_KEY = "lipex_site_currency";
  const SUPPORTED = new Set(["BRL", "USD"]);
  const saved = localStorage.getItem(STORAGE_KEY);
  let explicitChoice = SUPPORTED.has(saved);
  let currentCurrency = explicitChoice
    ? saved
    : (window.LipexI18n?.getLanguage?.() === "en" ? "USD" : "BRL");

  function formatPrice(amount, currency) {
    const value = Number(amount);
    if (!Number.isFinite(value)) return "—";
    if (currency === "USD") return `US$ ${value.toFixed(2)}`;
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  }

  function applyCurrency() {
    document.documentElement.dataset.currency = currentCurrency.toLowerCase();

    document.querySelectorAll("[data-currency-current]").forEach((el) => {
      el.textContent = currentCurrency;
    });

    document.querySelectorAll("[data-currency-option]").forEach((button) => {
      const active = button.dataset.currencyOption === currentCurrency;
      button.classList.toggle("active", active);
      button.setAttribute("aria-checked", active ? "true" : "false");
    });

    document.querySelectorAll("[data-price-brl][data-price-usd]").forEach((el) => {
      const raw = currentCurrency === "USD" ? el.dataset.priceUsd : el.dataset.priceBrl;
      el.textContent = formatPrice(raw, currentCurrency);
    });
  }

  function setCurrency(currency, persist = true) {
    const next = String(currency || "").toUpperCase();
    if (!SUPPORTED.has(next)) return;
    currentCurrency = next;
    if (persist) {
      localStorage.setItem(STORAGE_KEY, currentCurrency);
      explicitChoice = true;
    }
    applyCurrency();
    window.dispatchEvent(new CustomEvent("lipex:currencychange", {
      detail: { currency: currentCurrency },
    }));
  }

  function closeCurrencyMenus(except = null) {
    document.querySelectorAll(".currency-wrap").forEach((wrap) => {
      if (wrap === except) return;
      const menu = wrap.querySelector(".currency-menu");
      const button = wrap.querySelector("[data-currency-toggle]");
      if (menu) menu.hidden = true;
      if (button) button.setAttribute("aria-expanded", "false");
    });
  }

  function setupCurrencyMenus() {
    document.querySelectorAll("[data-currency-toggle]").forEach((button) => {
      const wrap = button.closest(".currency-wrap");
      const menu = wrap?.querySelector(".currency-menu");
      if (!wrap || !menu) return;

      button.addEventListener("click", (event) => {
        event.stopPropagation();
        closeCurrencyMenus(wrap);
        document.querySelectorAll(".language-menu").forEach((other) => { other.hidden = true; });
        document.querySelectorAll("[data-language-toggle]").forEach((other) => other.setAttribute("aria-expanded", "false"));
        menu.hidden = !menu.hidden;
        button.setAttribute("aria-expanded", menu.hidden ? "false" : "true");
      });

      menu.querySelectorAll("[data-currency-option]").forEach((option) => {
        option.addEventListener("click", () => {
          setCurrency(option.dataset.currencyOption, true);
          menu.hidden = true;
          button.setAttribute("aria-expanded", "false");
        });
      });
    });

    document.addEventListener("click", (event) => {
      document.querySelectorAll(".currency-wrap").forEach((wrap) => {
        if (wrap.contains(event.target)) return;
        const menu = wrap.querySelector(".currency-menu");
        const button = wrap.querySelector("[data-currency-toggle]");
        if (menu) menu.hidden = true;
        if (button) button.setAttribute("aria-expanded", "false");
      });
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") closeCurrencyMenus();
    });
  }

  window.addEventListener("lipex:languagechange", (event) => {
    if (explicitChoice) return;
    setCurrency(event.detail?.language === "en" ? "USD" : "BRL", false);
  });

  window.LipexCurrency = {
    getCurrency: () => currentCurrency,
    setCurrency,
    formatPrice,
    applyCurrency,
  };

  setupCurrencyMenus();
  applyCurrency();
})();
