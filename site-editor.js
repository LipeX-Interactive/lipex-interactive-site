(() => {
  "use strict";

  const SELECTORS = {"header.brand_name":".brand-copy strong","header.brand_subtitle":".brand-copy small","header.community_button":".header-community span","hero.eyebrow":"#inicio .eyebrow span:last-child","hero.title_top":"#inicio .hero-title-white","hero.title_bottom":"#inicio .hero-title-gradient","hero.description":"#inicio .hero-copy > p","hero.community_button":"#inicio .hero-actions .btn-community-blue span","hero.launcher_button":"#inicio .hero-actions .btn-download span","hero.games_button":"#inicio .hero-actions .btn-ghost","hero.windows_note":"#inicio .launcher-windows-note p","hero.proof_1":"#inicio .hero-proof span:nth-child(1)","hero.proof_2":"#inicio .hero-proof span:nth-child(2)","hero.proof_3":"#inicio .hero-proof span:nth-child(3)","hub.status":"#inicio .hub-status span:last-child","hub.item1_title":"#inicio .hub-links a:nth-child(1) strong","hub.item1_desc":"#inicio .hub-links a:nth-child(1) small","hub.item2_title":"#inicio .hub-links a:nth-child(2) strong","hub.item2_desc":"#inicio .hub-links a:nth-child(2) small","hub.item3_title":"#inicio .hub-links a:nth-child(3) strong","hub.item3_desc":"#inicio .hub-links a:nth-child(3) small","hub.item4_title":"#inicio .hub-links a:nth-child(4) strong","hub.item4_desc":"#inicio .hub-links a:nth-child(4) small","resources.label":"#recursos .section-label","resources.card1_title":"#recursos .feature-card:nth-child(1) h3","resources.card1_desc":"#recursos .feature-card:nth-child(1) p","resources.card2_title":"#recursos .feature-card:nth-child(2) h3","resources.card2_desc":"#recursos .feature-card:nth-child(2) p","resources.card3_title":"#recursos .feature-card:nth-child(3) h3","resources.card3_desc":"#recursos .feature-card:nth-child(3) p","how.eyebrow":"#como-funciona .eyebrow span:last-child","how.title":"#como-funciona .section-heading h2","how.step1_title":"#como-funciona .step:nth-child(1) h3","how.step1_desc":"#como-funciona .step:nth-child(1) p","how.step2_title":"#como-funciona .step:nth-child(2) h3","how.step2_desc":"#como-funciona .step:nth-child(2) p","how.step3_title":"#como-funciona .step:nth-child(3) h3","how.step3_desc":"#como-funciona .step:nth-child(3) p","how.step4_title":"#como-funciona .step:nth-child(4) h3","how.step4_desc":"#como-funciona .step:nth-child(4) p","catalog.eyebrow":"#jogos .eyebrow span:last-child","catalog.title":"#jogos .section-heading h2","catalog.description":"#jogos .section-heading > p","community.eyebrow":"#comunidade .eyebrow span:last-child","community.title":"#comunidade .section-heading h2","community.description":"#comunidade .section-heading > p","faq.eyebrow":"#faq .eyebrow span:last-child","faq.title":"#faq .section-heading h2","faq.description":"#faq .section-heading > p","faq.q1":"#faq details:nth-child(1) summary","faq.a1":"#faq details:nth-child(1) p","faq.q2":"#faq details:nth-child(2) summary","faq.a2":"#faq details:nth-child(2) p","faq.q3":"#faq details:nth-child(3) summary","faq.a3":"#faq details:nth-child(3) p","faq.q4":"#faq details:nth-child(4) summary","faq.a4":"#faq details:nth-child(4) p","faq.q5":"#faq details:nth-child(5) summary","faq.a5":"#faq details:nth-child(5) p","faq.q6":"#faq details:nth-child(6) summary","faq.a6":"#faq details:nth-child(6) p","footer.description":".footer-brand p","footer.copyright":".footer > small"};
  const SECTION_IDS = ["inicio","recursos","como-funciona","jogos","comunidade","faq"];
  const CONFIG = window.LIPEX_CONFIG || {};
  const DEFAULT_CATALOG = [{"id":"game_messi_ronaldo","enabled":true,"name":{"pt":"Messi vs Ronaldo","en":"Messi vs Ronaldo"},"description":{"pt":"Batalha interativa de futebol com placar, torcida temática e eventos disparados durante a transmissão.","en":"Interactive football battle with scoreboard, themed crowd and events triggered during the stream."},"image":"assets/messi-vs-ronaldo-cover.png","version":{"pt":"V31","en":"V31"},"tag_1":{"pt":"FUTEBOL","en":"FOOTBALL"},"tag_2":{"pt":"TIKTOK LIVE","en":"TIKTOK LIVE"},"price_brl":139.9,"price_usd":28.0,"product_slug":"messi-vs-ronaldo","product_page":"messi-vs-ronaldo.html","gameplay_url":"https://discord.gg/KmnxYwV3ck","visual":{"x":0,"y":0,"scale":1,"z":1},"style":{"background":"","border_color":"","radius":null}},{"id":"game_android_iphone","enabled":true,"name":{"pt":"Android vs iPhone","en":"Android vs iPhone"},"description":{"pt":"Duelo visual entre Android e iPhone com personagens, placar e eventos interativos para a sua LIVE.","en":"Visual Android vs iPhone duel with characters, scoreboard and interactive events for your LIVE."},"image":"assets/android-vs-iphone-cover.png","version":{"pt":"V77","en":"V77"},"tag_1":{"pt":"BATALHA VISUAL","en":"VISUAL BATTLE"},"tag_2":{"pt":"TIKTOK LIVE","en":"TIKTOK LIVE"},"price_brl":149.9,"price_usd":29.0,"product_slug":"android-vs-iphone","product_page":"android-vs-iphone.html","gameplay_url":"https://discord.gg/KmnxYwV3ck","visual":{"x":0,"y":0,"scale":1,"z":1},"style":{"background":"","border_color":"","radius":null}}];
  const DEFAULT_SOCIALS = [{"id":"social_discord","enabled":true,"title":{"pt":"Discord","en":"Discord"},"subtitle":{"pt":"Comunidade oficial LipeX","en":"Official LipeX community"},"image":"assets/social/discord.png","url":"https://discord.gg/KmnxYwV3ck","visual":{"x":0,"y":0,"scale":1,"z":1},"style":{"background":"","border_color":"","radius":null}},{"id":"social_instagram","enabled":true,"title":{"pt":"Instagram","en":"Instagram"},"subtitle":{"pt":"@_.lipex_","en":"@_.lipex_"},"image":"assets/social/instagram.png","url":"https://www.instagram.com/_.lipex_","visual":{"x":0,"y":0,"scale":1,"z":1},"style":{"background":"","border_color":"","radius":null}},{"id":"social_tiktok","enabled":true,"title":{"pt":"TikTok","en":"TikTok"},"subtitle":{"pt":"@_lipe__","en":"@_lipe__"},"image":"assets/social/tiktok.png","url":"https://www.tiktok.com/@_lipe__","visual":{"x":0,"y":0,"scale":1,"z":1},"style":{"background":"","border_color":"","radius":null}},{"id":"social_youtube","enabled":true,"title":{"pt":"YouTube","en":"YouTube"},"subtitle":{"pt":"@lipex8","en":"@lipex8"},"image":"assets/social/youtube.svg","url":"https://www.youtube.com/@lipex8","visual":{"x":0,"y":0,"scale":1,"z":1},"style":{"background":"","border_color":"","radius":null}}];

  let activeConfig = null;
  let previewMode = new URLSearchParams(location.search).get("lipexPreview") === "1";
  let editMode = previewMode && new URLSearchParams(location.search).get("lipexEdit") === "1";
  let selectedVisualId = null;
  let dragState = null;
  let resizeState = null;
  let visualOverlay = null;
  let visualToolbar = null;
  let visualResizeHandle = null;
  let overlayRaf = null;

  function clone(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function lang() {
    return window.LipexI18n?.getLanguage?.() === "en" ? "en" : "pt";
  }

  function localized(value) {
    if (value == null) return "";
    if (typeof value === "string") return value;
    const current = lang();
    return value[current] ?? value.pt ?? value.en ?? "";
  }

  function safeNumber(value, fallback = null) {
    const n = Number(value);
    return Number.isFinite(n) ? n : fallback;
  }

  function ensureVisual(value) {
    const visual = value && typeof value === "object" ? value : {};
    return {
      x: safeNumber(visual.x, 0) || 0,
      y: safeNumber(visual.y, 0) || 0,
      scale: Math.max(.35, Math.min(3, safeNumber(visual.scale, 1) || 1)),
      z: safeNumber(visual.z, 1) || 1,
    };
  }

  function normalizeConfig(input) {
    const config = input && typeof input === "object" ? input : {};
    if (!Array.isArray(config.catalog_items)) config.catalog_items = clone(DEFAULT_CATALOG);
    if (!Array.isArray(config.social_items)) config.social_items = clone(DEFAULT_SOCIALS);
    if (!config.visual_positions || typeof config.visual_positions !== "object") config.visual_positions = {};

    config.catalog_items = config.catalog_items.map((item, index) => ({
      ...clone(DEFAULT_CATALOG[Math.min(index, DEFAULT_CATALOG.length - 1)] || DEFAULT_CATALOG[0]),
      ...item,
      name: { ...(DEFAULT_CATALOG[Math.min(index, DEFAULT_CATALOG.length - 1)]?.name || {}), ...(item?.name || {}) },
      description: { ...(DEFAULT_CATALOG[Math.min(index, DEFAULT_CATALOG.length - 1)]?.description || {}), ...(item?.description || {}) },
      version: { ...(DEFAULT_CATALOG[Math.min(index, DEFAULT_CATALOG.length - 1)]?.version || {}), ...(item?.version || {}) },
      tag_1: { ...(DEFAULT_CATALOG[Math.min(index, DEFAULT_CATALOG.length - 1)]?.tag_1 || {}), ...(item?.tag_1 || {}) },
      tag_2: { ...(DEFAULT_CATALOG[Math.min(index, DEFAULT_CATALOG.length - 1)]?.tag_2 || {}), ...(item?.tag_2 || {}) },
      visual: ensureVisual(item?.visual),
      style: { background:"", border_color:"", radius:null, ...(item?.style || {}) },
      id: String(item?.id || `game_${Date.now()}_${index}`)
    }));

    config.social_items = config.social_items.map((item, index) => ({
      ...clone(DEFAULT_SOCIALS[Math.min(index, DEFAULT_SOCIALS.length - 1)] || DEFAULT_SOCIALS[0]),
      ...item,
      title: { ...(DEFAULT_SOCIALS[Math.min(index, DEFAULT_SOCIALS.length - 1)]?.title || {}), ...(item?.title || {}) },
      subtitle: { ...(DEFAULT_SOCIALS[Math.min(index, DEFAULT_SOCIALS.length - 1)]?.subtitle || {}), ...(item?.subtitle || {}) },
      visual: ensureVisual(item?.visual),
      style: { background:"", border_color:"", radius:null, ...(item?.style || {}) },
      id: String(item?.id || `social_${Date.now()}_${index}`)
    }));

    return config;
  }

  function setText(selector, value) {
    const node = document.querySelector(selector);
    if (!node || value == null) return;
    node.textContent = String(value);
  }

  function visualCss(visual) {
    const v = ensureVisual(visual);
    return `translate(${v.x}px, ${v.y}px) scale(${v.scale})`;
  }

  function applyVisualToNode(node, visual) {
    if (!node) return;
    const v = ensureVisual(visual);
    node.style.transform = visualCss(v);
    node.style.transformOrigin = "center center";
    node.style.position = "relative";
    node.style.zIndex = String(v.z || 1);
  }

  function applyCardStyle(node, style) {
    if (!node) return;
    const s = style || {};
    node.style.background = s.background || "";
    node.style.borderColor = s.border_color || "";
    node.style.borderRadius = s.radius != null && s.radius !== "" ? `${safeNumber(s.radius,18)}px` : "";
  }

  function formatFallbackPrice(amount, currency) {
    const value = Number(amount);
    if (!Number.isFinite(value)) return "—";
    if (currency === "USD") return `US$ ${value.toFixed(2)}`;
    return new Intl.NumberFormat("pt-BR", { style:"currency", currency:"BRL" }).format(value);
  }

  function currencyMenuMarkup(brl, usd) {
    const current = window.LipexCurrency?.getCurrency?.() || (lang() === "en" ? "USD" : "BRL");
    const price = window.LipexCurrency?.formatPrice?.(current === "USD" ? usd : brl, current) || formatFallbackPrice(current === "USD" ? usd : brl, current);
    const selectLabel = lang() === "en" ? "Select currency" : "Selecionar moeda";
    const brlLabel = lang() === "en" ? "Brazilian real" : "Real brasileiro";
    const usdLabel = lang() === "en" ? "US dollar" : "Dólar americano";
    return `
      <div class="price-currency-row">
        <strong data-price-brl="${Number(brl||0).toFixed(2)}" data-price-usd="${Number(usd||0).toFixed(2)}">${price}</strong>
        <div class="currency-wrap currency-inline-wrap currency-card-wrap">
          <button aria-expanded="false" aria-haspopup="true" aria-label="${selectLabel}" class="currency-button currency-inline-button" data-currency-toggle type="button">
            <span data-currency-current>${current}</span>
          </button>
          <div class="currency-menu currency-inline-menu" hidden>
            <button data-currency-option="BRL" role="radio" type="button"><span class="currency-code">BRL</span><span>${brlLabel}</span><b>✓</b></button>
            <button data-currency-option="USD" role="radio" type="button"><span class="currency-code">USD</span><span>${usdLabel}</span><b>✓</b></button>
          </div>
        </div>
      </div>`;
  }

  function renderGames(config) {
    const grid = document.querySelector("#jogos .games-grid");
    if (!grid || !Array.isArray(config.catalog_items)) return;

    const buyLabel = lang() === "en" ? "Buy" : "Comprar";
    const licenseLabel = lang() === "en" ? "Digital license" : "Licença digital";
    const gameplayLabel = lang() === "en" ? "Watch gameplay" : "Ver gameplay";
    const detailLabel = lang() === "en" ? "Click the card to view details" : "Clique no card para ver detalhes";

    grid.innerHTML = config.catalog_items
      .filter(item => item && item.enabled !== false)
      .map(item => `
        <article
          aria-label="${escapeHtml(localized(item.name))}"
          class="game-card clickable-game-card lipex-dynamic-card"
          data-product-page="${escapeHtml(item.product_page || "")}"
          data-lipex-visual-id="game:${escapeHtml(item.id)}"
          data-lipex-visual-kind="game"
          data-lipex-item-id="${escapeHtml(item.id)}"
          role="link"
          tabindex="0">
          <div class="game-media">
            <img alt="${escapeHtml(localized(item.name))}" src="${escapeHtml(item.image || "")}" />
            <div class="media-gradient"></div>
            <span class="game-version">${escapeHtml(localized(item.version))}</span>
            <a aria-label="${escapeHtml(gameplayLabel)}" class="media-play" href="${escapeHtml(item.gameplay_url || "#")}" rel="noopener noreferrer" target="_blank">
              <span class="play-icon">▶</span><span>${escapeHtml(gameplayLabel)}</span>
            </a>
          </div>
          <div class="game-content">
            <div class="game-topline"><span>${escapeHtml(localized(item.tag_1))}</span><span>${escapeHtml(localized(item.tag_2))}</span></div>
            <h3>${escapeHtml(localized(item.name))}</h3>
            <p>${escapeHtml(localized(item.description))}</p>
            <div class="game-footer">
              <div class="price"><small>${escapeHtml(licenseLabel)}</small>${currencyMenuMarkup(item.price_brl,item.price_usd)}</div>
              <button class="buy-button" data-buy-product="${escapeHtml(item.product_slug || "")}" type="button">${escapeHtml(buyLabel)}</button>
            </div>
            <span class="card-detail-hint"><span>${escapeHtml(detailLabel)}</span><b>↗</b></span>
          </div>
        </article>
      `).join("");

    config.catalog_items.forEach(item => {
      const node = grid.querySelector(`[data-lipex-item-id="${cssEscape(item.id)}"]`);
      if (!node) return;
      applyVisualToNode(node, item.visual);
      applyCardStyle(node, item.style);
    });

    window.LipexCurrency?.applyCurrency?.();
  }

  function renderSocials(config) {
    const grid = document.querySelector("#comunidade .social-grid");
    if (!grid || !Array.isArray(config.social_items)) return;

    grid.innerHTML = config.social_items
      .filter(item => item && item.enabled !== false)
      .map(item => `
        <a class="social-card lipex-dynamic-card"
           href="${escapeHtml(item.url || "#")}"
           rel="noopener noreferrer"
           target="_blank"
           data-lipex-visual-id="social:${escapeHtml(item.id)}"
           data-lipex-visual-kind="social"
           data-lipex-item-id="${escapeHtml(item.id)}">
          <img alt="${escapeHtml(localized(item.title))}" src="${escapeHtml(item.image || "")}" />
          <div><strong>${escapeHtml(localized(item.title))}</strong><span>${escapeHtml(localized(item.subtitle))}</span></div>
          <b>↗</b>
        </a>
      `).join("");

    config.social_items.forEach(item => {
      const node = grid.querySelector(`[data-lipex-item-id="${cssEscape(item.id)}"]`);
      if (!node) return;
      applyVisualToNode(node, item.visual);
      applyCardStyle(node, item.style);
    });
  }

  function escapeHtml(value) {
    return String(value ?? "")
      .replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;")
      .replaceAll('"',"&quot;").replaceAll("'","&#039;");
  }

  function cssEscape(value) {
    if (window.CSS?.escape) return CSS.escape(String(value));
    return String(value).replace(/["\\]/g, "\\$&");
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
      document.querySelectorAll(".brand-emblem,.header-community img,.btn-community-blue img,.hub-brand img,.footer-brand img,.auth-brand img")
        .forEach(img => { img.src = logo; });
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
      section.style.display = layout.section_enabled?.[id] === false ? "none" : "";
    });

    const heroCopy = document.querySelector("#inicio .hero-copy");
    if (heroCopy) {
      const align = ["left","center","right"].includes(layout.hero_text_align) ? layout.hero_text_align : "left";
      heroCopy.style.textAlign = align;
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
      const localizedValue = texts[key];
      if (!localizedValue) continue;
      const value = localizedValue[currentLang] ?? localizedValue.pt ?? localizedValue.en;
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

  function renderCustomElements(config) {
    clearCustomElements();
    const items = Array.isArray(config?.custom_elements) ? config.custom_elements : [];
    items.forEach(item => {
      if (!item || item.enabled === false) return;
      const section = document.getElementById(item.section);
      if (!section) return;

      const wrap = document.createElement("div");
      wrap.dataset.lipexCustomElement = item.id || "custom";
      wrap.dataset.lipexVisualId = `custom:${item.id || "custom"}`;
      wrap.dataset.lipexVisualKind = "custom";
      wrap.className = "lipex-custom-element-wrap";
      wrap.style.justifyContent = item.align === "right" ? "flex-end" : item.align === "center" ? "center" : "flex-start";
      wrap.style.marginTop = `${safeNumber(item.margin_top, 18)}px`;

      if (item.type === "button") {
        const a = document.createElement("a");
        a.className = "btn btn-primary lipex-custom-button";
        a.textContent = localized(item.text) || "Botão";
        a.href = item.url || "#";
        if (/^https?:/i.test(a.href)) { a.target = "_blank"; a.rel = "noopener noreferrer"; }
        applyButtonSize(a, item.size || "medium");
        wrap.appendChild(a);
      } else if (item.type === "image") {
        const img = document.createElement("img");
        img.className = "lipex-custom-image";
        img.src = item.src || "";
        img.alt = localized(item.text) || "";
        img.style.maxWidth = `${safeNumber(item.width, 420)}px`;
        wrap.appendChild(img);
      } else {
        const p = document.createElement("p");
        p.className = "lipex-custom-text";
        p.textContent = localized(item.text);
        if (item.font_size) p.style.fontSize = `${safeNumber(item.font_size,16)}px`;
        if (item.font_weight) p.style.fontWeight = String(item.font_weight);
        wrap.appendChild(p);
      }
      section.appendChild(wrap);

      const visual = config.visual_positions?.[`custom:${item.id}`];
      if (visual) applyVisualToNode(wrap, visual);
    });
  }

  function markGenericVisualElements(config) {
    for (const [key, selector] of Object.entries(SELECTORS)) {
      const node = document.querySelector(selector);
      if (!node) continue;
      node.dataset.lipexVisualId = `text:${key}`;
      node.dataset.lipexVisualKind = "text";
    }

    const buttonMap = [
      ["#inicio .btn-community-blue","hero_community"],
      ["#inicio .btn-download","hero_launcher"],
      ["#inicio .btn-ghost","hero_games"],
    ];
    buttonMap.forEach(([selector,key]) => {
      const node = document.querySelector(selector);
      if (!node) return;
      node.dataset.lipexVisualId = `button:${key}`;
      node.dataset.lipexVisualKind = "button";
    });

    document.querySelectorAll("#recursos .feature-card").forEach((node,index) => {
      node.dataset.lipexVisualId = `feature:${index}`;
      node.dataset.lipexVisualKind = "feature";
    });

    for (const node of document.querySelectorAll("[data-lipex-visual-id]")) {
      const id = node.dataset.lipexVisualId;
      if (id.startsWith("game:") || id.startsWith("social:")) continue;
      const visual = config.visual_positions?.[id];
      if (visual) applyVisualToNode(node, visual);
    }
  }

  function applyConfig(configInput) {
    if (!configInput || typeof configInput !== "object") return;
    const config = normalizeConfig(configInput);
    activeConfig = config;
    applyGlobal(config);
    applyLayout(config);
    renderGames(config);
    renderSocials(config);
    applyTexts(config);
    applyTextStyles(config);
    applyLinks(config);
    renderCustomElements(config);
    markGenericVisualElements(config);

    if (editMode) {
      document.body.classList.add("lipex-visual-edit-mode");
      requestOverlayUpdate();
    }

    window.dispatchEvent(new CustomEvent("lipex:siteconfigapplied", { detail: { config } }));
  }

  function getVisualTargetById(id) {
    if (!id) return null;
    return document.querySelector(`[data-lipex-visual-id="${cssEscape(id)}"]`);
  }

  function findCatalogItem(id) {
    const raw = String(id || "").replace(/^game:/,"");
    return activeConfig?.catalog_items?.find(item => item.id === raw) || null;
  }

  function findSocialItem(id) {
    const raw = String(id || "").replace(/^social:/,"");
    return activeConfig?.social_items?.find(item => item.id === raw) || null;
  }

  function getVisualForId(id) {
    if (id?.startsWith("game:")) return ensureVisual(findCatalogItem(id)?.visual);
    if (id?.startsWith("social:")) return ensureVisual(findSocialItem(id)?.visual);
    return ensureVisual(activeConfig?.visual_positions?.[id]);
  }

  function setVisualForId(id, visual) {
    if (!activeConfig || !id) return;
    const next = ensureVisual(visual);
    if (id.startsWith("game:")) {
      const item = findCatalogItem(id); if (item) item.visual = next;
    } else if (id.startsWith("social:")) {
      const item = findSocialItem(id); if (item) item.visual = next;
    } else {
      activeConfig.visual_positions = activeConfig.visual_positions || {};
      activeConfig.visual_positions[id] = next;
    }
    applyVisualToNode(getVisualTargetById(id), next);
  }

  function createVisualOverlay() {
    if (!editMode || visualOverlay) return;
    visualOverlay = document.createElement("div");
    visualOverlay.id = "lipex-visual-selection-overlay";
    visualOverlay.hidden = true;
    visualOverlay.innerHTML = `
      <div class="lipex-visual-selection-label">Selecionado</div>
      <div class="lipex-visual-toolbar">
        <button type="button" data-visual-command="duplicate">⧉ Duplicar</button>
        <button type="button" data-visual-command="reset">↺ Resetar posição</button>
        <button type="button" data-visual-command="delete" class="danger">✕ Excluir</button>
      </div>
      <div class="lipex-visual-resize-handle" title="Arraste para redimensionar"></div>`;
    document.body.appendChild(visualOverlay);
    visualToolbar = visualOverlay.querySelector(".lipex-visual-toolbar");
    visualResizeHandle = visualOverlay.querySelector(".lipex-visual-resize-handle");

    visualToolbar.addEventListener("pointerdown", event => event.stopPropagation());
    visualToolbar.addEventListener("click", event => {
      event.preventDefault(); event.stopPropagation();
      const button = event.target.closest("[data-visual-command]");
      if (!button || !selectedVisualId) return;
      parent.postMessage({
        type:"lipex:visual-command",
        command:button.dataset.visualCommand,
        id:selectedVisualId
      },"*");
    });

    visualResizeHandle.addEventListener("pointerdown", event => {
      event.preventDefault(); event.stopPropagation();
      if (!selectedVisualId) return;
      const target = getVisualTargetById(selectedVisualId);
      if (!target) return;
      const rect = target.getBoundingClientRect();
      const visual = getVisualForId(selectedVisualId);
      resizeState = {
        pointerId:event.pointerId,
        startX:event.clientX,
        startY:event.clientY,
        startScale:visual.scale,
        baseWidth:Math.max(50,rect.width / Math.max(.35,visual.scale))
      };
      visualResizeHandle.setPointerCapture?.(event.pointerId);
    });
  }

  function selectVisual(id) {
    selectedVisualId = id || null;
    createVisualOverlay();
    if (!visualOverlay) return;
    const target = getVisualTargetById(selectedVisualId);
    visualOverlay.hidden = !target;
    if (target) {
      document.querySelectorAll(".lipex-visual-selected").forEach(node => node.classList.remove("lipex-visual-selected"));
      target.classList.add("lipex-visual-selected");
      const kind = target.dataset.lipexVisualKind || "element";
      visualOverlay.querySelector(".lipex-visual-selection-label").textContent =
        kind === "game" ? "JOGO" : kind === "social" ? "REDE SOCIAL" : kind === "text" ? "TEXTO" : kind === "button" ? "BOTÃO" : kind === "feature" ? "CAIXA" : "ELEMENTO";
      visualToolbar.querySelector('[data-visual-command="duplicate"]').hidden = !["game","social","custom"].includes(kind);
      visualToolbar.querySelector('[data-visual-command="delete"]').hidden = !["game","social","custom"].includes(kind);
      parent.postMessage({type:"lipex:visual-select",id:selectedVisualId,kind},"*");
      requestOverlayUpdate();
    }
  }

  function requestOverlayUpdate() {
    if (!editMode || !visualOverlay || !selectedVisualId) return;
    if (overlayRaf) cancelAnimationFrame(overlayRaf);
    overlayRaf = requestAnimationFrame(() => {
      const target = getVisualTargetById(selectedVisualId);
      if (!target) { visualOverlay.hidden = true; return; }
      const rect = target.getBoundingClientRect();
      visualOverlay.hidden = false;
      visualOverlay.style.left = `${rect.left}px`;
      visualOverlay.style.top = `${rect.top}px`;
      visualOverlay.style.width = `${rect.width}px`;
      visualOverlay.style.height = `${rect.height}px`;
    });
  }

  function postVisualTransform(id) {
    parent.postMessage({
      type:"lipex:visual-transform",
      id,
      visual:getVisualForId(id)
    },"*");
  }

  function setupVisualEditing() {
    if (!editMode) return;
    createVisualOverlay();

    document.addEventListener("click", event => {
      const target = event.target.closest("[data-lipex-visual-id]");
      if (!target) {
        if (!event.target.closest("#lipex-visual-selection-overlay")) selectVisual(null);
        return;
      }
      event.preventDefault();
      event.stopPropagation();
      selectVisual(target.dataset.lipexVisualId);
    }, true);

    document.addEventListener("dblclick", event => {
      const target = event.target.closest("[data-lipex-visual-id]");
      if (!target) return;
      event.preventDefault(); event.stopPropagation();
      selectVisual(target.dataset.lipexVisualId);
      parent.postMessage({type:"lipex:visual-open-inspector",id:selectedVisualId,kind:target.dataset.lipexVisualKind||"element"},"*");
    }, true);

    document.addEventListener("pointerdown", event => {
      if (event.button !== 0 || event.target.closest("#lipex-visual-selection-overlay")) return;
      const target = event.target.closest("[data-lipex-visual-id]");
      if (!target) return;
      const id = target.dataset.lipexVisualId;
      selectVisual(id);
      const visual = getVisualForId(id);
      dragState = {
        id,
        pointerId:event.pointerId,
        startX:event.clientX,
        startY:event.clientY,
        originX:visual.x,
        originY:visual.y,
        moved:false,
      };
      target.setPointerCapture?.(event.pointerId);
      event.preventDefault();
    }, true);

    document.addEventListener("pointermove", event => {
      if (resizeState && event.pointerId === resizeState.pointerId && selectedVisualId) {
        const dx = event.clientX - resizeState.startX;
        const nextScale = Math.max(.35, Math.min(3, resizeState.startScale + dx / resizeState.baseWidth));
        const visual = getVisualForId(selectedVisualId);
        visual.scale = Number(nextScale.toFixed(3));
        setVisualForId(selectedVisualId, visual);
        postVisualTransform(selectedVisualId);
        requestOverlayUpdate();
        return;
      }
      if (!dragState || event.pointerId !== dragState.pointerId) return;
      const dx = event.clientX - dragState.startX;
      const dy = event.clientY - dragState.startY;
      if (!dragState.moved && Math.hypot(dx,dy) < 3) return;
      dragState.moved = true;
      const visual = getVisualForId(dragState.id);
      visual.x = Math.round(dragState.originX + dx);
      visual.y = Math.round(dragState.originY + dy);
      setVisualForId(dragState.id, visual);
      postVisualTransform(dragState.id);
      requestOverlayUpdate();
    }, true);

    document.addEventListener("pointerup", event => {
      if (resizeState && event.pointerId === resizeState.pointerId) {
        resizeState = null;
        parent.postMessage({type:"lipex:visual-transform-end",id:selectedVisualId},"*");
      }
      if (dragState && event.pointerId === dragState.pointerId) {
        const id = dragState.id, moved = dragState.moved;
        dragState = null;
        if (moved) parent.postMessage({type:"lipex:visual-transform-end",id},"*");
      }
    }, true);

    window.addEventListener("scroll",requestOverlayUpdate,{passive:true});
    window.addEventListener("resize",requestOverlayUpdate);
  }

  document.addEventListener("click", event => {
    const option = event.target.closest("[data-currency-option]");
    if (option && option.closest(".lipex-dynamic-card")) {
      event.preventDefault();
      event.stopPropagation();
      window.LipexCurrency?.setCurrency?.(option.dataset.currencyOption,true);
      option.closest(".currency-menu").hidden = true;
      return;
    }
    const toggle = event.target.closest("[data-currency-toggle]");
    if (toggle && toggle.closest(".lipex-dynamic-card")) {
      event.preventDefault();
      event.stopPropagation();
      const wrap = toggle.closest(".currency-wrap");
      const menu = wrap?.querySelector(".currency-menu");
      if (menu) {
        const next = !menu.hidden;
        document.querySelectorAll(".currency-menu").forEach(other => { if (other !== menu) other.hidden = true; });
        menu.hidden = !next;
        toggle.setAttribute("aria-expanded",next?"true":"false");
      }
    }
  }, true);

  async function fetchPublished() {
    if (!CONFIG.SUPABASE_URL || !CONFIG.SUPABASE_PUBLISHABLE_KEY) return null;
    try {
      const response = await fetch(
        `${CONFIG.SUPABASE_URL}/rest/v1/site_public_config?id=eq.1&select=config,revision,published_at`,
        {
          headers: { apikey: CONFIG.SUPABASE_PUBLISHABLE_KEY, Accept:"application/json" },
          cache:"no-store"
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
      if (!data) return;
      if (data.type === "lipex:site-preview" && data.config) {
        applyConfig(clone(data.config));
        if (data.selectedId && editMode) setTimeout(() => selectVisual(data.selectedId),20);
      }
      if (data.type === "lipex:visual-select-from-admin" && editMode) {
        setTimeout(() => selectVisual(data.id),20);
      }
    });
  }

  async function boot() {
    const row = await fetchPublished();
    if (row?.config) applyConfig(row.config);
    else applyConfig({});
    if (editMode) setupVisualEditing();
    if (previewMode && window.parent !== window) {
      window.parent.postMessage({type:"lipex:site-ready",visualEdit:editMode},"*");
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded",boot,{once:true});
  } else {
    boot();
  }
})();
