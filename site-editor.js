(() => {
  'use strict';

  const TEXT_SELECTORS = {
    'header.brand_name': '.brand-copy strong',
    'header.brand_subtitle': '.brand-copy small',
    'header.community_button': '.header-community span',
    'header.pass_link': '.nav a[href="#lipex-pass"]',
    'hero.eyebrow': '#inicio .eyebrow span:last-child',
    'hero.title_top': '#inicio .hero-title-white',
    'hero.title_bottom': '#inicio .hero-title-gradient',
    'hero.description': '#inicio .hero-copy > p',
    'hero.community_button': '#inicio .hero-actions .btn-community-blue span',
    'hero.launcher_button': '#inicio .hero-actions .btn-download span',
    'hero.games_button': '#inicio .hero-actions .btn-ghost',
    'hero.windows_note': '#inicio .launcher-windows-note p',
    'hero.proof_1': '#inicio .hero-proof span:nth-child(1)',
    'hero.proof_2': '#inicio .hero-proof span:nth-child(2)',
    'hero.proof_3': '#inicio .hero-proof span:nth-child(3)',
    'hub.status': '#inicio .hub-status span:last-child',
    'hub.item1_title': '#inicio .hub-links a:nth-child(1) strong',
    'hub.item1_desc': '#inicio .hub-links a:nth-child(1) small',
    'hub.item2_title': '#inicio .hub-links a:nth-child(2) strong',
    'hub.item2_desc': '#inicio .hub-links a:nth-child(2) small',
    'hub.item3_title': '#inicio .hub-links a:nth-child(3) strong',
    'hub.item3_desc': '#inicio .hub-links a:nth-child(3) small',
    'hub.item4_title': '#inicio .hub-links a:nth-child(4) strong',
    'hub.item4_desc': '#inicio .hub-links a:nth-child(4) small',
    'resources.label': '#recursos .section-label',
    'resources.card1_title': '#recursos .feature-card:nth-child(1) h3',
    'resources.card1_desc': '#recursos .feature-card:nth-child(1) p',
    'resources.card2_title': '#recursos .feature-card:nth-child(2) h3',
    'resources.card2_desc': '#recursos .feature-card:nth-child(2) p',
    'resources.card3_title': '#recursos .feature-card:nth-child(3) h3',
    'resources.card3_desc': '#recursos .feature-card:nth-child(3) p',
    'how.eyebrow': '#como-funciona .eyebrow span:last-child',
    'how.title': '#como-funciona .section-heading h2',
    'how.step1_title': '#como-funciona .step:nth-child(1) h3',
    'how.step1_desc': '#como-funciona .step:nth-child(1) p',
    'how.step2_title': '#como-funciona .step:nth-child(2) h3',
    'how.step2_desc': '#como-funciona .step:nth-child(2) p',
    'how.step3_title': '#como-funciona .step:nth-child(3) h3',
    'how.step3_desc': '#como-funciona .step:nth-child(3) p',
    'how.step4_title': '#como-funciona .step:nth-child(4) h3',
    'how.step4_desc': '#como-funciona .step:nth-child(4) p',
    'catalog.eyebrow': '#jogos .eyebrow span:last-child',
    'catalog.title': '#jogos .section-heading h2',
    'catalog.description': '#jogos .section-heading > p',
    'pass.eyebrow': '#lipex-pass .lipex-pass-heading .eyebrow span:last-child',
    'pass.title': '#lipex-pass .lipex-pass-heading h2',
    'pass.description': '#lipex-pass .lipex-pass-heading > p',
    'pass.currency_label': '#lipex-pass .lipex-pass-toolbar > span',
    'pass.monthly_kicker': '#lipex-pass .lipex-pass-card:nth-child(1) .lipex-pass-kicker',
    'pass.monthly_title': '#lipex-pass .lipex-pass-card:nth-child(1) h3',
    'pass.monthly_description': '#lipex-pass .lipex-pass-card:nth-child(1) .lipex-pass-card-top p',
    'pass.monthly_benefit1': '#lipex-pass .lipex-pass-card:nth-child(1) .lipex-pass-benefits li:nth-child(1) b',
    'pass.monthly_benefit2': '#lipex-pass .lipex-pass-card:nth-child(1) .lipex-pass-benefits li:nth-child(2) b',
    'pass.monthly_benefit3': '#lipex-pass .lipex-pass-card:nth-child(1) .lipex-pass-benefits li:nth-child(3) b',
    'pass.monthly_button': '#lipex-pass [data-pass-plan="monthly"]',
    'pass.annual_kicker': '#lipex-pass .lipex-pass-card:nth-child(2) .lipex-pass-kicker',
    'pass.annual_title': '#lipex-pass .lipex-pass-card:nth-child(2) h3',
    'pass.annual_description': '#lipex-pass .lipex-pass-card:nth-child(2) .lipex-pass-card-top p',
    'pass.annual_saving_brl': '#lipex-pass .lipex-pass-saving-brl',
    'pass.annual_saving_usd': '#lipex-pass .lipex-pass-saving-usd',
    'pass.annual_benefit1': '#lipex-pass .lipex-pass-card:nth-child(2) .lipex-pass-benefits li:nth-child(1) b',
    'pass.annual_benefit2': '#lipex-pass .lipex-pass-card:nth-child(2) .lipex-pass-benefits li:nth-child(2) b',
    'pass.annual_benefit3': '#lipex-pass .lipex-pass-card:nth-child(2) .lipex-pass-benefits li:nth-child(3) b',
    'pass.annual_button': '#lipex-pass [data-pass-plan="annual"]',
    'pass.best_value': '#lipex-pass .lipex-pass-badge',
    'community.eyebrow': '#comunidade .eyebrow span:last-child',
    'community.title': '#comunidade .section-heading h2',
    'community.description': '#comunidade .section-heading > p',
    'faq.eyebrow': '#faq .eyebrow span:last-child',
    'faq.title': '#faq .section-heading h2',
    'faq.description': '#faq .section-heading > p',
    'faq.q1': '#faq details:nth-child(1) summary',
    'faq.a1': '#faq details:nth-child(1) p',
    'faq.q2': '#faq details:nth-child(2) summary',
    'faq.a2': '#faq details:nth-child(2) p',
    'faq.q3': '#faq details:nth-child(3) summary',
    'faq.a3': '#faq details:nth-child(3) p',
    'faq.q4': '#faq details:nth-child(4) summary',
    'faq.a4': '#faq details:nth-child(4) p',
    'faq.q5': '#faq details:nth-child(5) summary',
    'faq.a5': '#faq details:nth-child(5) p',
    'faq.q6': '#faq details:nth-child(6) summary',
    'faq.a6': '#faq details:nth-child(6) p',
    'footer.description': '.footer-brand p',
    'footer.copyright': '.footer > small'
  };

  const BUTTONS = {
    hero_community: { selector: '#inicio .btn-community-blue', textKey: 'hero.community_button', linkKey: 'hero_community' },
    hero_launcher: { selector: '#inicio .btn-download', textKey: 'hero.launcher_button', linkKey: 'hero_launcher' },
    hero_games: { selector: '#inicio .btn-ghost', textKey: 'hero.games_button', linkKey: 'hero_games' }
  };

  const DEEP_SELECTORS = {
    'header:community-icon': '.header-community img',
    'hero:eyebrow-mark': '#inicio .eyebrow i',
    'hero:community-icon': '#inicio .btn-community-blue img',
    'hero:launcher-icon': '#inicio .btn-download svg',
    'hero:windows-icon': '#inicio .launcher-windows-note svg',
    'hub:status-dot': '#inicio .hub-status i',
    'hub:item-1-icon': '#inicio .hub-links a:nth-child(1) .hub-icon',
    'hub:item-2-icon': '#inicio .hub-links a:nth-child(2) .hub-icon',
    'hub:item-3-icon': '#inicio .hub-links a:nth-child(3) .hub-icon',
    'hub:item-4-icon': '#inicio .hub-links a:nth-child(4) .hub-icon',
    'hub:item-1-arrow': '#inicio .hub-links a:nth-child(1) > b',
    'hub:item-2-arrow': '#inicio .hub-links a:nth-child(2) > b',
    'hub:item-3-arrow': '#inicio .hub-links a:nth-child(3) > b',
    'hub:item-4-arrow': '#inicio .hub-links a:nth-child(4) > b',
    'feature:icon-0': '#recursos .feature-card:nth-child(1) .feature-icon',
    'feature:icon-1': '#recursos .feature-card:nth-child(2) .feature-icon',
    'feature:icon-2': '#recursos .feature-card:nth-child(3) .feature-icon',
    'feature:0': '#recursos .feature-card:nth-child(1)',
    'feature:1': '#recursos .feature-card:nth-child(2)',
    'feature:2': '#recursos .feature-card:nth-child(3)',
    'how:eyebrow-mark': '#como-funciona .eyebrow i',
    'how:step-1-number': '#como-funciona .step:nth-child(1) > span:first-child',
    'how:step-2-number': '#como-funciona .step:nth-child(2) > span:first-child',
    'how:step-3-number': '#como-funciona .step:nth-child(3) > span:first-child',
    'how:step-4-number': '#como-funciona .step:nth-child(4) > span:first-child',
    'catalog:eyebrow-mark': '#jogos .eyebrow i',
    'pass:eyebrow-mark': '#lipex-pass .eyebrow i',
    'pass:monthly-card': '#lipex-pass .lipex-pass-card:nth-child(1)',
    'pass:annual-card': '#lipex-pass .lipex-pass-card:nth-child(2)',
    'community:eyebrow-mark': '#comunidade .eyebrow i',
    'faq:eyebrow-mark': '#faq .eyebrow i'
  };

  const params = new URLSearchParams(location.search);
  const previewMode = params.get('lipexPreview') === '1';
  const visualEditMode = params.get('lipexEdit') === '1';
  let config = null;
  let selectedId = null;
  let overlay = null;
  let pointerState = null;
  let publicClient = null;

  const clone = (value) => JSON.parse(JSON.stringify(value));
  const finite = (value, fallback = 0) => Number.isFinite(Number(value)) ? Number(value) : fallback;
  const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
  const lang = () => window.LipexI18n?.getLanguage?.() === 'en' || document.documentElement.lang.startsWith('en') ? 'en' : 'pt';
  const localized = (value, fallback = '') => {
    if (value && typeof value === 'object') return String(value[lang()] ?? value.pt ?? value.en ?? fallback ?? '');
    return String(value ?? fallback ?? '');
  };

  function query(selector) { try { return document.querySelector(selector); } catch { return null; } }
  function queryAll(selector) { try { return [...document.querySelectorAll(selector)]; } catch { return []; } }
  function setText(el, value) { if (el && typeof value === 'string') el.textContent = value; }
  function setCssVar(name, value) { if (value != null && value !== '') document.documentElement.style.setProperty(name, String(value)); }

  function ensureShape(raw) {
    const next = raw && typeof raw === 'object' ? clone(raw) : {};
    next.global = next.global && typeof next.global === 'object' ? next.global : {};
    next.layout = next.layout && typeof next.layout === 'object' ? next.layout : {};
    next.layout.section_order = Array.isArray(next.layout.section_order) ? next.layout.section_order : [];
    for (const id of ['inicio','recursos','como-funciona','jogos','lipex-pass','comunidade','faq']) if (!next.layout.section_order.includes(id)) {
      if (id === 'lipex-pass') {
        const games = next.layout.section_order.indexOf('jogos');
        next.layout.section_order.splice(games >= 0 ? games + 1 : next.layout.section_order.length, 0, id);
      } else next.layout.section_order.push(id);
    }
    next.layout.section_enabled = next.layout.section_enabled && typeof next.layout.section_enabled === 'object' ? next.layout.section_enabled : {};
    if (!Object.prototype.hasOwnProperty.call(next.layout.section_enabled, 'lipex-pass')) next.layout.section_enabled['lipex-pass'] = true;
    next.texts = next.texts && typeof next.texts === 'object' ? next.texts : {};
    next.text_styles = next.text_styles && typeof next.text_styles === 'object' ? next.text_styles : {};
    next.links = next.links && typeof next.links === 'object' ? next.links : {};
    next.button_styles = next.button_styles && typeof next.button_styles === 'object' ? next.button_styles : {};
    next.custom_elements = Array.isArray(next.custom_elements) ? next.custom_elements : [];
    next.visual_positions = next.visual_positions && typeof next.visual_positions === 'object' ? next.visual_positions : {};
    next.element_overrides = next.element_overrides && typeof next.element_overrides === 'object' ? next.element_overrides : {};
    return next;
  }

  function applyGlobal() {
    const global = config?.global || {};
    setCssVar('--blue', global.accent || '#087cff');
    setCssVar('--cyan', global.cyan || '#39d7ff');
    if (finite(global.max_width, 0) > 0) setCssVar('--max', `${finite(global.max_width)}px`);
    if (finite(global.section_padding, 0) > 0) setCssVar('--lipex-section-padding', `${finite(global.section_padding)}px`);
    if (finite(global.card_radius, -1) >= 0) setCssVar('--lipex-card-radius', `${finite(global.card_radius)}px`);
    const hero = query('#inicio');
    if (hero && finite(config?.layout?.hero_gap, 0) > 0) hero.style.gap = `${finite(config.layout.hero_gap)}px`;
    const copy = query('#inicio .hero-copy');
    if (copy && ['left','center','right'].includes(config?.layout?.hero_text_align)) copy.style.textAlign = config.layout.hero_text_align;
    const actions = query('#inicio .hero-actions');
    if (actions) {
      const align = config?.layout?.hero_buttons_align;
      actions.style.justifyContent = align === 'center' ? 'center' : align === 'right' ? 'flex-end' : 'flex-start';
    }
    const logo = String(global.logo_url || '').trim();
    if (logo) {
      queryAll('.brand-emblem,.header-community img,.btn-community-blue img,.hub-brand img,.footer-brand img,.auth-brand img,.first-visit-brand img').forEach(img => { img.src = logo; });
    }
  }

  function applySections() {
    const main = query('main'); if (!main) return;
    const known = new Map(queryAll('main > section[id]').map(section => [section.id, section]));
    const order = config?.layout?.section_order || [];
    for (const id of order) if (known.has(id)) main.appendChild(known.get(id));
    for (const [id, section] of known) if (!order.includes(id)) main.appendChild(section);
    for (const [id, section] of known) section.hidden = config?.layout?.section_enabled?.[id] === false;
  }

  function applyTexts() {
    for (const [key, selector] of Object.entries(TEXT_SELECTORS)) {
      const el = query(selector); if (!el) continue;
      const pair = config?.texts?.[key];
      if (pair) setText(el, localized(pair, el.textContent));
      const style = config?.text_styles?.[key] || {};
      el.style.fontSize = style.font_size != null && style.font_size !== '' ? `${finite(style.font_size)}px` : '';
      el.style.fontWeight = style.font_weight != null && style.font_weight !== '' ? String(style.font_weight) : '';
      el.style.textAlign = ['left','center','right'].includes(style.align) ? style.align : '';
      const x = finite(style.x, 0);
      if (x) el.style.translate = `${x}px 0`; else el.style.removeProperty('translate');
    }
  }

  function applyButtons() {
    for (const [key, def] of Object.entries(BUTTONS)) {
      const el = query(def.selector); if (!el) continue;
      const href = String(config?.links?.[def.linkKey] || '').trim(); if (href) el.setAttribute('href', href);
      const style = config?.button_styles?.[key] || {};
      el.classList.remove('lipex-btn-small','lipex-btn-medium','lipex-btn-large');
      el.classList.add(style.size === 'small' ? 'lipex-btn-small' : style.size === 'large' ? 'lipex-btn-large' : 'lipex-btn-medium');
      const x = finite(style.x, 0); if (x) el.style.translate = `${x}px 0`; else el.style.removeProperty('translate');
    }
    const headerHref = String(config?.links?.header_community || '').trim();
    if (headerHref) query('.header-community')?.setAttribute('href', headerHref);
  }

  function money(value, currency) {
    const amount = Number(value);
    if (!Number.isFinite(amount)) return '';
    return new Intl.NumberFormat(lang() === 'en' ? 'en-US' : 'pt-BR', { style:'currency', currency }).format(amount);
  }

  function applyCatalog() {
    const items = Array.isArray(config?.catalog_items) ? config.catalog_items.filter(item => item?.enabled !== false) : null;
    if (!items?.length) return;
    const grid = query('#jogos .games-grid'); if (!grid) return;
    let cards = [...grid.querySelectorAll(':scope > .game-card')];
    // Preserve the current official card markup (currency picker, Pass badges and
    // checkout hooks) instead of replacing it with an older editor template.
    while (cards.length < items.length && cards.length) {
      const clone = cards[cards.length - 1].cloneNode(true); grid.appendChild(clone); cards.push(clone);
    }
    cards.forEach((card,index) => {
      const item = items[index];
      if (!item) { card.hidden = true; return; }
      card.hidden = false;
      const name = localized(item.name,'Jogo'), desc = localized(item.description,''), version = localized(item.version,''), tag1 = localized(item.tag_1,''), tag2 = localized(item.tag_2,'');
      card.dataset.lipexCatalogId = String(item.id || `game_${index}`);
      card.dataset.lipexVisualId = `game:${card.dataset.lipexCatalogId}`;
      card.dataset.lipexVisualKind = 'game';
      if (item.product_page) card.dataset.productPage = String(item.product_page);
      const image = card.querySelector('.game-media img'); if (image && item.image) { image.src=String(item.image); image.alt=name; }
      const v = card.querySelector('.game-version'); if (v) v.textContent=version;
      const play = card.querySelector('.media-play'); if (play && item.gameplay_url) play.href=String(item.gameplay_url);
      const tags = card.querySelectorAll('.game-topline span'); if(tags[0])tags[0].textContent=tag1;if(tags[1])tags[1].textContent=tag2;
      const title = card.querySelector('.game-content h3'); if(title)title.textContent=name;
      const description = card.querySelector('.game-content > p'); if(description)description.textContent=desc;
      const price = card.querySelector('[data-price-brl][data-price-usd]'); if(price){price.dataset.priceBrl=String(Number(item.price_brl)||0);price.dataset.priceUsd=String(Number(item.price_usd)||0);}
      const buy = card.querySelector('[data-buy-product]'); if(buy && item.product_slug) buy.dataset.buyProduct=String(item.product_slug);
      const radius=item?.style?.radius; card.style.background=item?.style?.background||'';card.style.borderColor=item?.style?.border_color||'';card.style.borderRadius=radius==null?'':`${finite(radius)}px`;
    });
    window.LipexCurrency?.apply?.();
    window.dispatchEvent(new CustomEvent('lipex:sitecatalogrendered'));
  }

  function applySocials() {
    const items = Array.isArray(config?.social_items) ? config.social_items.filter(item => item?.enabled !== false) : null;
    if (!items?.length) return;
    const grid = query('#comunidade .social-grid'); if (!grid) return;
    grid.innerHTML = items.map(item => {
      const title = localized(item.title, ''); const subtitle = localized(item.subtitle, '');
      const radius = item?.style?.radius;
      const style = [`${item?.style?.background ? `background:${item.style.background}` : ''}`,`${item?.style?.border_color ? `border-color:${item.style.border_color}` : ''}`,`${radius != null ? `border-radius:${finite(radius)}px` : ''}`].filter(Boolean).join(';');
      return `<a class="social-card" data-lipex-social-id="${escapeHtml(item.id)}" data-lipex-visual-id="social:${escapeHtml(item.id)}" data-lipex-visual-kind="social" href="${escapeHtml(item.url || '#')}" target="_blank" rel="noopener noreferrer" style="${style}"><div class="social-icon"><img alt="" src="${escapeHtml(item.image || '')}"></div><strong>${escapeHtml(title)}</strong><span>${escapeHtml(subtitle)}</span><b>↗</b></a>`;
    }).join('');
  }

  function escapeHtml(value) { return String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }

  function applyCustomElements() {
    queryAll('[data-lipex-custom-element]').forEach(node => node.remove());
    for (const item of config?.custom_elements || []) {
      if (!item || item.enabled === false) continue;
      const section = query(`#${CSS.escape(String(item.section || 'inicio'))}`); if (!section) continue;
      const wrap = document.createElement('div');
      wrap.className = 'lipex-custom-element-wrap';
      wrap.dataset.lipexCustomElement = String(item.id || 'custom');
      wrap.dataset.lipexVisualId = `custom:${String(item.id || 'custom')}`;
      wrap.dataset.lipexVisualKind = 'custom';
      wrap.style.marginTop = `${finite(item.margin_top, 18)}px`;
      wrap.style.justifyContent = item.align === 'right' ? 'flex-end' : item.align === 'center' ? 'center' : 'flex-start';
      let child;
      if (item.type === 'image') {
        child = document.createElement('img'); child.className = 'lipex-custom-image'; child.src = String(item.src || ''); child.alt = localized(item.text, '');
        if (finite(item.width, 0) > 0) child.style.maxWidth = `${finite(item.width)}px`;
      } else if (item.type === 'button') {
        child = document.createElement('a'); child.className = 'btn btn-primary'; child.href = String(item.url || '#'); child.textContent = localized(item.text, '');
      } else {
        child = document.createElement('p'); child.className = 'lipex-custom-text'; child.textContent = localized(item.text, '');
        if (finite(item.font_size, 0) > 0) child.style.fontSize = `${finite(item.font_size)}px`;
        if (finite(item.font_weight, 0) > 0) child.style.fontWeight = String(finite(item.font_weight));
      }
      wrap.appendChild(child); section.appendChild(wrap);
    }
  }

  function resolveVisualElement(id) {
    if (!id) return null;
    const direct = query(`[data-lipex-visual-id="${CSS.escape(id)}"]`); if (direct) return direct;
    if (id.startsWith('text:')) return query(TEXT_SELECTORS[id.slice(5)]);
    if (id.startsWith('button:')) return query(BUTTONS[id.slice(7)]?.selector);
    if (DEEP_SELECTORS[id]) return query(DEEP_SELECTORS[id]);
    return null;
  }

  function normalizeVisual(value = {}) {
    return {
      x: finite(value.x, 0), y: finite(value.y, 0), scale: clamp(finite(value.scale, 1) || 1, .2, 5),
      rotate: finite(value.rotate, 0), z: Math.max(1, finite(value.z, 1) || 1),
      width: value.width == null || value.width === '' ? null : Math.max(1, finite(value.width, 1)),
      height: value.height == null || value.height === '' ? null : Math.max(1, finite(value.height, 1))
    };
  }

  function applyVisual(id, el, visual) {
    if (!el) return;
    const v = normalizeVisual(visual);
    // Inline spans (for example the 01/02/03/04 numbers in Como funciona) do not
    // reliably accept width/height or transforms. Promote only those edited inline
    // elements to inline-block, preserving the original layout when no visual
    // transform/dimension is configured.
    const needsTransformBox = v.width != null || v.height != null || v.x !== 0 || v.y !== 0 || v.rotate !== 0 || v.scale !== 1;
    const computedDisplay = getComputedStyle(el).display;
    if (needsTransformBox && computedDisplay === 'inline') {
      el.style.display = 'inline-block';
      el.dataset.lipexVisualDisplayApplied = '1';
    } else if (!needsTransformBox && el.dataset.lipexVisualDisplayApplied === '1') {
      el.style.removeProperty('display');
      el.dataset.lipexVisualDisplayApplied = '0';
    }
    el.style.transform = `translate(${v.x}px, ${v.y}px) rotate(${v.rotate}deg) scale(${v.scale})`;
    el.style.transformOrigin = 'center center';
    el.style.zIndex = String(v.z);
    if (v.width != null) el.style.width = `${v.width}px`; else if (el.dataset.lipexVisualWidthApplied === '1') el.style.removeProperty('width');
    if (v.height != null) el.style.height = `${v.height}px`; else if (el.dataset.lipexVisualHeightApplied === '1') el.style.removeProperty('height');
    el.dataset.lipexVisualWidthApplied = v.width != null ? '1' : '0';
    el.dataset.lipexVisualHeightApplied = v.height != null ? '1' : '0';
  }

  function applyOverride(id, el, override = {}) {
    if (!el || !override || typeof override !== 'object') return;
    el.hidden = override.hidden === true;
    const px = (field, prop) => { if (override[field] !== '' && override[field] != null && Number.isFinite(Number(override[field]))) el.style.setProperty(prop, `${Number(override[field])}px`, 'important'); else el.style.removeProperty(prop); };
    px('width','width'); px('height','height'); px('padding','padding'); px('margin','margin'); px('border_width','border-width'); px('border_radius','border-radius'); px('font_size','font-size'); px('blur','--lipex-edit-blur');
    if (override.opacity !== '' && override.opacity != null) el.style.opacity = String(clamp(Number(override.opacity),0,1)); else el.style.removeProperty('opacity');
    if (override.color) el.style.setProperty('color', override.color, 'important'); else el.style.removeProperty('color');
    if (override.background) el.style.setProperty('background', override.background, 'important'); else el.style.removeProperty('background');
    if (override.border_color) el.style.setProperty('border-color', override.border_color, 'important'); else el.style.removeProperty('border-color');
    if (override.border_width !== '' && override.border_width != null) el.style.borderStyle = 'solid';
    if (override.font_weight) el.style.setProperty('font-weight', String(override.font_weight), 'important');
    if (override.text_align) el.style.setProperty('text-align', override.text_align, 'important');
    if (override.letter_spacing !== '' && override.letter_spacing != null) el.style.letterSpacing = `${Number(override.letter_spacing)}px`;
    if (override.line_height !== '' && override.line_height != null) el.style.lineHeight = String(override.line_height);
    if (override.overflow) el.style.overflow = override.overflow;
    if (override.box_shadow) el.style.boxShadow = override.box_shadow;
    el.style.filter = override.blur !== '' && override.blur != null ? `blur(${Number(override.blur)}px)` : '';
    if (override.href && (el instanceof HTMLAnchorElement || el instanceof HTMLButtonElement)) el.setAttribute('href', String(override.href));
    if (override.content && typeof override.content === 'object' && isLeafText(el)) el.textContent = localized(override.content, el.textContent);
    if (override.dot_color && id.startsWith('hero:proof-')) el.style.setProperty('--lipex-proof-dot-color', override.dot_color);
    if (override.dot_size != null && id.startsWith('hero:proof-')) el.style.setProperty('--lipex-proof-dot-size', `${Number(override.dot_size)}px`);
    if (override.asset_mode === 'text' && override.asset_text != null) el.textContent = String(override.asset_text);
    if (override.asset_mode === 'image' && override.asset_url) {
      if (el instanceof HTMLImageElement) el.src = String(override.asset_url);
      else {
        el.innerHTML = ''; const img = document.createElement('img'); img.className = 'lipex-editor-replacement-image'; img.src = String(override.asset_url); img.alt = ''; el.appendChild(img);
      }
    }
    if (override.icon_color) {
      el.style.color = override.icon_color;
      queryAllWithin(el, 'svg').forEach(svg => { svg.style.stroke = override.icon_color; svg.style.color = override.icon_color; });
    }
  }

  function queryAllWithin(root, selector) { try { return [...root.querySelectorAll(selector)]; } catch { return []; } }

  function applyVisuals() {
    assignKnownVisualIds();
    assignGenericVisualIds();
    for (const el of queryAll('[data-lipex-visual-id]')) {
      const id = el.dataset.lipexVisualId;
      let visual = config?.visual_positions?.[id];
      if (id.startsWith('game:')) visual = config?.catalog_items?.find(item => `game:${item.id}` === id)?.visual ?? visual;
      if (id.startsWith('social:')) visual = config?.social_items?.find(item => `social:${item.id}` === id)?.visual ?? visual;
      if (visual) applyVisual(id, el, visual);
      applyOverride(id, el, config?.element_overrides?.[id] || {});
    }
    refreshOverlay();
  }

  function applyConfig(nextConfig, { notify = true } = {}) {
    config = ensureShape(nextConfig);
    applyGlobal(); applySections(); applyTexts(); applyButtons(); applyCatalog(); applySocials(); applyCustomElements(); applyVisuals();
    window.LipexSiteConfig = config;
    if (notify) window.dispatchEvent(new CustomEvent('lipex:siteconfigapplied', { detail: { config } }));
  }

  function assignKnownVisualIds() {
    for (const [key, selector] of Object.entries(TEXT_SELECTORS)) mark(query(selector), `text:${key}`, 'text');
    for (const [key, def] of Object.entries(BUTTONS)) mark(query(def.selector), `button:${key}`, 'button');
    for (const [id, selector] of Object.entries(DEEP_SELECTORS)) mark(query(selector), id, id.startsWith('feature:') && /^feature:\d+$/.test(id) ? 'group' : 'element');
    queryAll('#inicio .hero-proof span').forEach((el, index) => mark(el, `hero:proof-${index+1}`, 'text'));
    queryAll('[data-lipex-catalog-id]').forEach(el => mark(el, `game:${el.dataset.lipexCatalogId}`, 'game'));
    queryAll('[data-lipex-social-id]').forEach(el => mark(el, `social:${el.dataset.lipexSocialId}`, 'social'));
    queryAll('[data-lipex-custom-element]').forEach(el => mark(el, `custom:${el.dataset.lipexCustomElement}`, 'custom'));
  }

  function mark(el, id, kind = 'element') { if (!el) return; el.dataset.lipexVisualId = id; el.dataset.lipexVisualKind = kind; }

  function stablePath(el) {
    const parts = [];
    let node = el;
    while (node && node.nodeType === 1 && node !== document.body) {
      if (node.id) { parts.unshift(`#${node.id}`); break; }
      const tag = node.tagName.toLowerCase();
      const parent = node.parentElement;
      if (!parent) { parts.unshift(tag); break; }
      const same = [...parent.children].filter(child => child.tagName === node.tagName);
      const index = same.indexOf(node) + 1;
      parts.unshift(`${tag}:nth-of-type(${index})`);
      node = parent;
      if (parts.length > 8) break;
    }
    return parts.join('>');
  }

  function assignGenericVisualIds() {
    if (!visualEditMode) return;
    const candidates = queryAll('.site-header a,.site-header button,main h1,main h2,main h3,main p,main span,main strong,main small,main img,main svg,main article,main a,main button,.footer a,.footer strong,.footer p,.footer small,.footer img');
    for (const el of candidates) {
      if (el.dataset.lipexVisualId || el.closest('#lipex-visual-selection-overlay')) continue;
      const path = stablePath(el); if (!path) continue;
      mark(el, `dom:${path}`, elementKind(el));
    }
  }

  function elementKind(el) {
    if (el instanceof HTMLImageElement) return 'image';
    if (el.matches('button,a')) return 'button';
    if (el.matches('svg') || el.querySelector(':scope > svg')) return 'icon';
    if (isLeafText(el)) return 'text';
    return 'element';
  }

  function isLeafText(el) {
    if (!el) return false;
    const text = String(el.textContent || '').trim();
    if (!text) return false;
    return [...el.children].every(child => !String(child.textContent || '').trim());
  }

  function elementMeta(el) {
    const style = getComputedStyle(el);
    const rect = el.getBoundingClientRect();
    return {
      kind: el.dataset.lipexVisualKind || elementKind(el),
      leafText: isLeafText(el),
      text: isLeafText(el) ? String(el.textContent || '').trim() : '',
      href: el.getAttribute?.('href') || '',
      src: el.getAttribute?.('src') || '',
      hasImage: el instanceof HTMLImageElement || Boolean(el.querySelector?.('img')),
      hasSvg: el.matches?.('svg') || Boolean(el.querySelector?.('svg')),
      computed: {
        width: Math.round(rect.width), height: Math.round(rect.height), opacity: style.opacity,
        color: style.color, background: style.backgroundColor, borderColor: style.borderColor
      }
    };
  }

  function ensureOverlay() {
    if (overlay) return overlay;
    overlay = document.createElement('div'); overlay.id = 'lipex-visual-selection-overlay'; overlay.hidden = true;
    overlay.innerHTML = `<span class="lipex-visual-selection-label"></span><div class="lipex-visual-toolbar"><button data-visual-tool="duplicate">DUPLICAR</button><button data-visual-tool="reset">RESETAR</button><button class="danger" data-visual-tool="delete">EXCLUIR</button></div><span class="lipex-visual-resize-handle" title="Redimensionar livremente"></span>`;
    document.body.appendChild(overlay);
    overlay.querySelectorAll('[data-visual-tool]').forEach(button => button.addEventListener('pointerdown', event => event.stopPropagation()));
    overlay.querySelectorAll('[data-visual-tool]').forEach(button => button.addEventListener('click', event => {
      event.preventDefault(); event.stopPropagation();
      if (!selectedId) return;
      parent.postMessage({ type:'lipex:visual-command', id:selectedId, command:button.dataset.visualTool }, '*');
    }));
    overlay.querySelector('.lipex-visual-resize-handle').addEventListener('pointerdown', startResize);
    return overlay;
  }

  function selectVisual(id, { openInspector = false } = {}) {
    if (!visualEditMode) return;
    if (selectedId) resolveVisualElement(selectedId)?.classList.remove('lipex-visual-selected');
    selectedId = id || null;
    const el = resolveVisualElement(selectedId);
    if (el) el.classList.add('lipex-visual-selected');
    refreshOverlay();
    if (el) parent.postMessage({ type: openInspector ? 'lipex:visual-open-inspector' : 'lipex:visual-select', id:selectedId, meta:elementMeta(el) }, '*');
  }

  function refreshOverlay() {
    if (!visualEditMode) return;
    const o = ensureOverlay(); const el = resolveVisualElement(selectedId);
    if (!el || el.hidden) { o.hidden = true; return; }
    const rect = el.getBoundingClientRect();
    if (rect.width <= 0 || rect.height <= 0) { o.hidden = true; return; }
    o.hidden = false; o.style.left = `${rect.left}px`; o.style.top = `${rect.top}px`; o.style.width = `${rect.width}px`; o.style.height = `${rect.height}px`;
    o.querySelector('.lipex-visual-selection-label').textContent = selectedId;
  }

  function visualFor(id, el) {
    let raw = config?.visual_positions?.[id];
    if (id.startsWith('game:')) raw = config?.catalog_items?.find(item => `game:${item.id}` === id)?.visual ?? raw;
    if (id.startsWith('social:')) raw = config?.social_items?.find(item => `social:${item.id}` === id)?.visual ?? raw;
    const visual = normalizeVisual(raw || {});
    if (visual.width == null && el) visual.width = Math.round(el.getBoundingClientRect().width / visual.scale);
    if (visual.height == null && el) visual.height = Math.round(el.getBoundingClientRect().height / visual.scale);
    return visual;
  }

  function startMove(event, el) {
    if (!selectedId || event.button !== 0 || event.target.closest('#lipex-visual-selection-overlay')) return;
    const id = selectedId;
    const startVisual = visualFor(id, el);
    pointerState = { mode:'move', id, pointerId:event.pointerId, startX:event.clientX, startY:event.clientY, visual:startVisual };
    el.setPointerCapture?.(event.pointerId);
    parent.postMessage({ type:'lipex:visual-transform-start', id }, '*');
    event.preventDefault();
  }

  function startResize(event) {
    event.preventDefault(); event.stopPropagation();
    const el = resolveVisualElement(selectedId); if (!el) return;
    const v = visualFor(selectedId, el);
    const rect = el.getBoundingClientRect();
    pointerState = { mode:'resize', id:selectedId, pointerId:event.pointerId, startX:event.clientX, startY:event.clientY, visual:v, width:v.width ?? rect.width, height:v.height ?? rect.height };
    event.currentTarget.setPointerCapture?.(event.pointerId);
    parent.postMessage({ type:'lipex:visual-transform-start', id:selectedId }, '*');
  }

  function onPointerMove(event) {
    if (!pointerState || event.pointerId !== pointerState.pointerId) return;
    const dx = event.clientX - pointerState.startX; const dy = event.clientY - pointerState.startY;
    const next = { ...pointerState.visual };
    if (pointerState.mode === 'move') { next.x = Math.round(pointerState.visual.x + dx); next.y = Math.round(pointerState.visual.y + dy); }
    else { next.width = Math.max(12, Math.round(pointerState.width + dx)); next.height = Math.max(12, Math.round(pointerState.height + dy)); }
    const el = resolveVisualElement(pointerState.id); applyVisual(pointerState.id, el, next); refreshOverlay();
    parent.postMessage({ type:'lipex:visual-transform', id:pointerState.id, visual:next }, '*');
  }

  function endPointer(event) {
    if (!pointerState || event.pointerId !== pointerState.pointerId) return;
    const id = pointerState.id; pointerState = null;
    parent.postMessage({ type:'lipex:visual-transform-end', id }, '*');
  }

  function installVisualEditing() {
    if (!visualEditMode) return;
    document.body.classList.add('lipex-visual-edit-mode'); ensureOverlay(); assignKnownVisualIds(); assignGenericVisualIds();
    document.addEventListener('click', event => {
      const el = event.target.closest?.('[data-lipex-visual-id]'); if (!el || el.closest('#lipex-visual-selection-overlay')) return;
      event.preventDefault(); event.stopPropagation(); selectVisual(el.dataset.lipexVisualId, { openInspector:event.detail >= 2 });
    }, true);
    document.addEventListener('pointerdown', event => {
      const el = event.target.closest?.('[data-lipex-visual-id]'); if (!el || el.closest('#lipex-visual-selection-overlay')) return;
      if (selectedId !== el.dataset.lipexVisualId) selectVisual(el.dataset.lipexVisualId);
      startMove(event, el);
    }, true);
    document.addEventListener('pointermove', onPointerMove, true);
    document.addEventListener('pointerup', endPointer, true);
    document.addEventListener('pointercancel', endPointer, true);
    document.addEventListener('keydown', event => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'z') { event.preventDefault(); parent.postMessage({type:'lipex:visual-history',action:event.shiftKey?'redo':'undo'},'*'); }
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'y') { event.preventDefault(); parent.postMessage({type:'lipex:visual-history',action:'redo'},'*'); }
      if (event.key === 'Escape') selectVisual(null);
    });
    addEventListener('scroll', refreshOverlay, { passive:true }); addEventListener('resize', refreshOverlay, { passive:true });
  }

  async function fetchPublishedConfig() {
    if (previewMode) return;
    const c = window.LIPEX_CONFIG || {};
    if (!window.supabase?.createClient || !String(c.SUPABASE_URL || '').startsWith('https://') || !String(c.SUPABASE_PUBLISHABLE_KEY || '').length) return;
    try {
      publicClient = window.supabase.createClient(c.SUPABASE_URL, c.SUPABASE_PUBLISHABLE_KEY, { auth:{ persistSession:false, autoRefreshToken:false, detectSessionInUrl:false } });
      const { data, error } = await publicClient.from('site_public_config').select('config,revision,published_at').eq('id',1).maybeSingle();
      if (error) throw error; if (data?.config) applyConfig(data.config);
    } catch (error) { console.warn('LipeX site editor runtime:', error); }
  }

  window.addEventListener('message', event => {
    const data = event.data; if (!data || typeof data !== 'object') return;
    if (data.type === 'lipex:site-preview' && data.config) applyConfig(data.config);
    if (data.type === 'lipex:visual-select-from-admin') selectVisual(data.id || null);
  });
  window.addEventListener('lipex:languagechange', () => { if (config) { applyTexts(); applyCatalog(); applySocials(); applyCustomElements(); applyVisuals(); } });
  window.addEventListener('lipex:currencychange', () => { if (config) applyVisuals(); });

  installVisualEditing();
  fetchPublishedConfig().finally(() => {
    if (window.parent !== window) parent.postMessage({ type:'lipex:site-ready', visualEdit:visualEditMode }, '*');
  });
})();
