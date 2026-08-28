(() => {
  const STORAGE_KEY = "lipex_site_currency";
  const ONBOARD_KEY = "lipex_site_language_onboarding_v1";
  const qs = new URLSearchParams(window.location.search);
  const requestedCurrency = String(qs.get("currency") || "").toUpperCase();
  const requestedLanguage = String(qs.get("lang") || "").toLowerCase();
  let currentCurrency = requestedCurrency === "USD" ? "USD" : requestedCurrency === "BRL" ? "BRL" : (localStorage.getItem(STORAGE_KEY) === "USD" ? "USD" : "BRL");

  if (requestedLanguage === "pt" || requestedLanguage === "en") {
    window.LipexI18n?.setLanguage?.(requestedLanguage);
    localStorage.setItem(ONBOARD_KEY, "1");
  }

  function format(amount, currency) {
    return new Intl.NumberFormat(currency === "USD" ? "en-US" : "pt-BR", { style: "currency", currency }).format(amount);
  }
  function closeMenus(except = null) {
    document.querySelectorAll(".currency-menu").forEach((menu) => { if (menu !== except) menu.hidden = true; });
    document.querySelectorAll("[data-currency-toggle]").forEach((button) => {
      const own = button.closest(".currency-wrap")?.querySelector(".currency-menu");
      if (own !== except) button.setAttribute("aria-expanded", "false");
    });
  }
  function applyCurrency() {
    document.documentElement.dataset.currency = currentCurrency.toLowerCase();
    document.querySelectorAll("[data-currency-current]").forEach((el) => { el.textContent = currentCurrency; });
    document.querySelectorAll("[data-currency-provider]").forEach((el) => { el.textContent = currentCurrency === "USD" ? "Paddle" : "Mercado Pago"; });
    document.querySelectorAll("[data-currency-option]").forEach((button) => {
      const active = String(button.dataset.currencyOption || "").toUpperCase() === currentCurrency;
      button.classList.toggle("active", active); button.setAttribute("aria-checked", active ? "true" : "false");
    });
    document.querySelectorAll("[data-price-brl][data-price-usd]").forEach((el) => {
      const amount = Number(currentCurrency === "USD" ? el.dataset.priceUsd : el.dataset.priceBrl);
      if (Number.isFinite(amount)) el.textContent = format(amount, currentCurrency);
    });
  }
  function setCurrency(currency, persist = true) {
    currentCurrency = String(currency).toUpperCase() === "USD" ? "USD" : "BRL";
    if (persist) localStorage.setItem(STORAGE_KEY, currentCurrency);
    applyCurrency();
    window.dispatchEvent(new CustomEvent("lipex:currencychange", { detail: { currency: currentCurrency } }));
  }
  document.addEventListener("click", (event) => {
    const toggle = event.target.closest?.("[data-currency-toggle]");
    if (toggle) {
      event.preventDefault(); event.stopPropagation();
      const menu = toggle.closest(".currency-wrap")?.querySelector(".currency-menu"); if (!menu) return;
      const willOpen = menu.hidden; closeMenus(menu); menu.hidden = !willOpen; toggle.setAttribute("aria-expanded", willOpen ? "true" : "false"); return;
    }
    const option = event.target.closest?.("[data-currency-option]");
    if (option) { event.preventDefault(); event.stopPropagation(); setCurrency(option.dataset.currencyOption); closeMenus(); return; }
    if (!event.target.closest?.(".currency-wrap")) closeMenus();
  });
  window.addEventListener("lipex:siteconfigapplied", applyCurrency);
  window.LipexCurrency = { getCurrency: () => currentCurrency, setCurrency, apply: applyCurrency };
  applyCurrency();

  const modal = document.getElementById("first-visit-language");
  const fromLauncher = qs.get("source") === "launcher";
  if (modal && !fromLauncher && !localStorage.getItem(ONBOARD_KEY)) {
    modal.hidden = false; modal.setAttribute("aria-hidden", "false"); document.body.classList.add("first-visit-open");
  }
  modal?.querySelectorAll("[data-first-language]").forEach((button) => button.addEventListener("click", () => {
    const language = button.dataset.firstLanguage === "en" ? "en" : "pt";
    window.LipexI18n?.setLanguage?.(language); localStorage.setItem(ONBOARD_KEY, "1"); modal.hidden = true; modal.setAttribute("aria-hidden", "true"); document.body.classList.remove("first-visit-open");
  }));
})();
