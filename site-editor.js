(() => {
  "use strict";

  const SELECTORS = {"header.brand_name":".brand-copy strong","header.brand_subtitle":".brand-copy small","header.community_button":".header-community span","hero.eyebrow":"#inicio .eyebrow span:last-child","hero.title_top":"#inicio .hero-title-white","hero.title_bottom":"#inicio .hero-title-gradient","hero.description":"#inicio .hero-copy > p","hero.community_button":"#inicio .hero-actions .btn-community-blue span","hero.launcher_button":"#inicio .hero-actions .btn-download span","hero.games_button":"#inicio .hero-actions .btn-ghost","hero.windows_note":"#inicio .launcher-windows-note p","hero.proof_1":"#inicio .hero-proof span:nth-child(1)","hero.proof_2":"#inicio .hero-proof span:nth-child(2)","hero.proof_3":"#inicio .hero-proof span:nth-child(3)","hub.status":"#inicio .hub-status span:last-child","hub.item1_title":"#inicio .hub-links a:nth-child(1) strong","hub.item1_desc":"#inicio .hub-links a:nth-child(1) small","hub.item2_title":"#inicio .hub-links a:nth-child(2) strong","hub.item2_desc":"#inicio .hub-links a:nth-child(2) small","hub.item3_title":"#inicio .hub-links a:nth-child(3) strong","hub.item3_desc":"#inicio .hub-links a:nth-child(3) small","hub.item4_title":"#inicio .hub-links a:nth-child(4) strong","hub.item4_desc":"#inicio .hub-links a:nth-child(4) small","resources.label":"#recursos .section-label","resources.card1_title":"#recursos .feature-card:nth-child(1) h3","resources.card1_desc":"#recursos .feature-card:nth-child(1) p","resources.card2_title":"#recursos .feature-card:nth-child(2) h3","resources.card2_desc":"#recursos .feature-card:nth-child(2) p","resources.card3_title":"#recursos .feature-card:nth-child(3) h3","resources.card3_desc":"#recursos .feature-card:nth-child(3) p","how.eyebrow":"#como-funciona .eyebrow span:last-child","how.title":"#como-funciona .section-heading h2","how.step1_title":"#como-funciona .step:nth-child(1) h3","how.step1_desc":"#como-funciona .step:nth-child(1) p","how.step2_title":"#como-funciona .step:nth-child(2) h3","how.step2_desc":"#como-funciona .step:nth-child(2) p","how.step3_title":"#como-funciona .step:nth-child(3) h3","how.step3_desc":"#como-funciona .step:nth-child(3) p","how.step4_title":"#como-funciona .step:nth-child(4) h3","how.step4_desc":"#como-funciona .step:nth-child(4) p","catalog.eyebrow":"#jogos .eyebrow span:last-child","catalog.title":"#jogos .section-heading h2","catalog.description":"#jogos .section-heading > p","community.eyebrow":"#comunidade .eyebrow span:last-child","community.title":"#comunidade .section-heading h2","community.description":"#comunidade .section-heading > p","faq.eyebrow":"#faq .eyebrow span:last-child","faq.title":"#faq .section-heading h2","faq.description":"#faq .section-heading > p","faq.q1":"#faq details:nth-child(1) summary","faq.a1":"#faq details:nth-child(1) p","faq.q2":"#faq details:nth-child(2) summary","faq.a2":"#faq details:nth-child(2) p","faq.q3":"#faq details:nth-child(3) summary","faq.a3":"#faq details:nth-child(3) p","faq.q4":"#faq details:nth-child(4) summary","faq.a4":"#faq details:nth-child(4) p","faq.q5":"#faq details:nth-child(5) summary","faq.a5":"#faq details:nth-child(5) p","faq.q6":"#faq details:nth-child(6) summary","faq.a6":"#faq details:nth-child(6) p","footer.description":".footer-brand p","footer.copyright":".footer > small"};
  const SECTION_IDS = ["inicio","recursos","como-funciona","jogos","comunidade","faq"];
  const CONFIG = window.LIPEX_CONFIG || {};
  let activeConfig = null;
  let publishedConfig = null;
  let previewMode = new URLSearchParams(location.search).get("lipexPreview") === "1";

  function lang() {
    return window.LipexI18n?.getLanguage?.() === "en" ? "en" : "pt";
  }

  function safeNumber(value, fallback = null) {
    const n = Number(value);
    return Number.isFinite(n) ? n : fallback;
  }

  function setText(selector, value) {
    const node = document.querySelector(selector);
    if (!node || value == null) return;
    node.textContent = String(value);
  }

  function applyTextStyles(config) {
    const styles = config?.text_styles || {};
    for (const [key, selector] of Object.entries(SELECTORS)) {
      const node = document.querySelector(selector);
      if (!node) continue;
      const style = styles[key] || {};
      node.style.fontSize = style.font_size ? `${Number(style.font_size)}px` : "";
      node.style.fontWeight = style.font_weight ? String(style.font_weight) : "";
      node.style.textAlign = style.align && ["left","center","right"].includes(style.align) ? style.align : "";
      const x = safeNumber(style.x, 0) || 0;
      node.style.transform = x ? `translateX(${x}px)` : "";
    }
  }

  function applyButtonSize(node, size) {
    if (!node) return;
    node.classList.remove("lipex-btn-small","lipex-btn-medium","lipex-btn-large");
    if (["small","medium","large"].includes(size)) node.classList.add(`lipex-btn-${size}`);
  }

  function applyGlobal(config) {
    const root = document.documentElement;
    const global = config?.global || {};
    if (global.accent) root.style.setProperty("--blue", global.accent);
    if (global.cyan) root.style.setProperty("--cyan", global.cyan);
    if (global.max_width) root.style.setProperty("--max", `${safeNumber(global.max_width,1180)}px`);
    if (global.section_padding) root.style.setProperty("--lipex-section-padding", `${safeNumber(global.section_padding,94)}px`);
    if (global.card_radius) root.style.setProperty("--lipex-card-radius", `${safeNumber(global.card_radius,18)}px`);

    const logo = global.logo_url;
    if (logo) {
      document.querySelectorAll(
        ".brand-emblem,.header-community img,.btn-community-blue img,.hub-brand img,.footer-brand img,.auth-brand img"
      ).forEach(img => { img.src = logo; });
    }
  }

  function applyLayout(config) {
    const layout = config?.layout || {};
    const main = document.querySelector("main");
    if (main && Array.isArray(layout.section_order)) {
      layout.section_order.forEach(id => {
        const section = document.getElementById(id);
        if (section && section.parentElement === main) main.appendChild(section);
      });
    }
    SECTION_IDS.forEach(id => {
      const section = document.getElementById(id);
      if (!section) return;
      const enabled = layout.section_enabled?.[id] !== false;
      section.style.display = enabled ? "" : "none";
    });

    const heroCopy = document.querySelector("#inicio .hero-copy");
    if (heroCopy) {
      const align = ["left","center","right"].includes(layout.hero_text_align) ? layout.hero_text_align : "left";
      heroCopy.style.textAlign = align;
      if (align !== "left") {
        heroCopy.querySelectorAll(":scope > p").forEach(p => {
          p.style.marginLeft = align === "center" ? "auto" : "";
          p.style.marginRight = align === "center" ? "auto" : "";
        });
      }
    }
    const actions = document.querySelector("#inicio .hero-actions");
    if (actions) {
      const align = layout.hero_buttons_align || "left";
      actions.style.justifyContent = align === "center" ? "center" : align === "right" ? "flex-end" : "flex-start";
    }
    const hero = document.getElementById("inicio");
    if (hero && layout.hero_gap != null) hero.style.gap = `${safeNumber(layout.hero_gap,64)}px`;
  }

  function applyTexts(config) {
    const currentLang = lang();
    const texts = config?.texts || {};
    for (const [key, selector] of Object.entries(SELECTORS)) {
      const localized = texts[key];
      if (!localized) continue;
      const value = localized[currentLang] ?? localized.pt ?? localized.en;
      setText(selector, value);
    }
  }

  function applyLinks(config) {
    const links = config?.links || {};
    const bindings = [
      [".header-community","header_community"],
      ["#inicio .btn-community-blue","hero_community"],
      ["#inicio .btn-download","hero_launcher"],
      ["#inicio .btn-ghost","hero_games"],
    ];
    bindings.forEach(([selector,key]) => {
      const node = document.querySelector(selector);
      const href = links[key];
      if (node && href) node.setAttribute("href", href);
    });

    const buttonStyles = config?.button_styles || {};
    const buttons = [
      ["#inicio .btn-community-blue","hero_community"],
      ["#inicio .btn-download","hero_launcher"],
      ["#inicio .btn-ghost","hero_games"],
    ];
    buttons.forEach(([selector,key]) => {
      const node = document.querySelector(selector);
      const style = buttonStyles[key] || {};
      applyButtonSize(node, style.size || "medium");
      const x = safeNumber(style.x,0) || 0;
      if (node) node.style.transform = x ? `translateX(${x}px)` : "";
    });
  }

  function clearCustomElements() {
    document.querySelectorAll("[data-lipex-custom-element]").forEach(node => node.remove());
  }

  function customText(element, currentLang) {
    return element?.text?.[currentLang] ?? element?.text?.pt ?? element?.text?.en ?? "";
  }

  function renderCustomElements(config) {
    clearCustomElements();
    const currentLang = lang();
    const items = Array.isArray(config?.custom_elements) ? config.custom_elements : [];
    items.forEach(item => {
      if (!item || item.enabled === false) return;
      const section = document.getElementById(item.section);
      if (!section) return;

      const wrap = document.createElement("div");
      wrap.dataset.lipexCustomElement = item.id || "custom";
      wrap.className = "lipex-custom-element-wrap";
      wrap.style.justifyContent = item.align === "right" ? "flex-end" : item.align === "center" ? "center" : "flex-start";
      wrap.style.marginTop = `${safeNumber(item.margin_top, 18)}px`;

      if (item.type === "button") {
        const a = document.createElement("a");
        a.className = "btn btn-primary lipex-custom-button";
        a.textContent = customText(item,currentLang) || "Botão";
        a.href = item.url || "#";
        if (/^https?:/i.test(a.href)) {
          a.target = "_blank";
          a.rel = "noopener noreferrer";
        }
        applyButtonSize(a, item.size || "medium");
        wrap.appendChild(a);
      } else if (item.type === "image") {
        const img = document.createElement("img");
        img.className = "lipex-custom-image";
        img.src = item.src || "";
        img.alt = customText(item,currentLang) || "";
        img.style.maxWidth = `${safeNumber(item.width, 420)}px`;
        wrap.appendChild(img);
      } else {
        const p = document.createElement("p");
        p.className = "lipex-custom-text";
        p.textContent = customText(item,currentLang);
        if (item.font_size) p.style.fontSize = `${safeNumber(item.font_size,16)}px`;
        if (item.font_weight) p.style.fontWeight = String(item.font_weight);
        wrap.appendChild(p);
      }
      section.appendChild(wrap);
    });
  }

  function applyConfig(config) {
    if (!config || typeof config !== "object") return;
    activeConfig = config;
    applyGlobal(config);
    applyLayout(config);
    applyTexts(config);
    applyTextStyles(config);
    applyLinks(config);
    renderCustomElements(config);
  }

  async function fetchPublished() {
    if (!CONFIG.SUPABASE_URL || !CONFIG.SUPABASE_PUBLISHABLE_KEY) return null;
    try {
      const response = await fetch(
        `${CONFIG.SUPABASE_URL}/rest/v1/site_public_config?id=eq.1&select=config,revision,published_at`,
        {
          headers: {
            apikey: CONFIG.SUPABASE_PUBLISHABLE_KEY,
            Accept: "application/json",
          },
          cache: "no-store",
        }
      );
      if (!response.ok) return null;
      const rows = await response.json();
      return Array.isArray(rows) ? rows[0] || null : null;
    } catch {
      return null;
    }
  }

  window.addEventListener("lipex:languagechange", () => {
    if (activeConfig) applyConfig(activeConfig);
  });

  if (previewMode) {
    window.addEventListener("message", event => {
      const data = event.data;
      if (!data || data.type !== "lipex:site-preview" || !data.config) return;
      applyConfig(data.config);
    });
  }

  async function boot() {
    const row = await fetchPublished();
    if (row?.config) {
      publishedConfig = row.config;
      applyConfig(publishedConfig);
    }
    if (previewMode && window.parent !== window) {
      window.parent.postMessage({ type:"lipex:site-ready" }, "*");
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot, { once:true });
  } else {
    boot();
  }
})();
