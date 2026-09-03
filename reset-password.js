import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const cfg = window.LIPEX_CONFIG || window.LIPEX_SITE_CONFIG || {};
const url = cfg.supabaseUrl || cfg.SUPABASE_URL;
const key = cfg.supabasePublishableKey || cfg.supabaseAnonKey || cfg.SUPABASE_PUBLISHABLE_KEY || cfg.SUPABASE_ANON_KEY;
const feedback = document.querySelector("#reset-password-feedback");
const form = document.querySelector("#reset-password-form");
const btn = document.querySelector("#reset-password-submit");

function installPasswordVisibilityToggles() {
  document.querySelectorAll('input[type="password"]').forEach((input) => {
    if (input.dataset.visibilityToggleInstalled === "true") return;
    input.dataset.visibilityToggleInstalled = "true";
    const wrap = document.createElement("span");
    wrap.className = "password-input-wrap";
    input.parentNode.insertBefore(wrap, input);
    wrap.appendChild(input);
    const toggle = document.createElement("button");
    toggle.type = "button";
    toggle.className = "password-visibility-toggle";
    toggle.setAttribute("aria-label", "Mostrar senha");
    toggle.setAttribute("aria-pressed", "false");
    const renderEye = (visible) => {
      toggle.innerHTML = visible
        ? '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 3l18 18"/><path d="M10.6 10.7a2 2 0 0 0 2.7 2.7"/><path d="M9.9 4.2A10.7 10.7 0 0 1 12 4c5.2 0 8.7 4.4 9 7.5a10.8 10.8 0 0 1-2.3 4.5"/><path d="M6.2 6.2C4.3 7.5 3.2 9.5 3 11.5 3.3 14.6 6.8 19 12 19c1.4 0 2.7-.3 3.8-.8"/></svg>'
        : '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 12s3.3-6 9-6 9 6 9 6-3.3 6-9 6-9-6-9-6Z"/><circle cx="12" cy="12" r="2.5"/></svg>';
    };
    renderEye(false);
    toggle.addEventListener("click", () => {
      const showing = input.type === "text";
      input.type = showing ? "password" : "text";
      toggle.setAttribute("aria-label", showing ? "Mostrar senha" : "Ocultar senha");
      toggle.setAttribute("aria-pressed", String(!showing));
      renderEye(!showing);
      input.focus({ preventScroll: true });
    });
    wrap.appendChild(toggle);
  });
}
installPasswordVisibilityToggles();

if (!url || !key) {
  feedback.textContent = "Configuração do Supabase indisponível.";
  feedback.dataset.type = "error";
} else {
  const supabase = createClient(url, key, { auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true } });
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const password = document.querySelector("#reset-new-password").value;
    const confirm = document.querySelector("#reset-confirm-password").value;
    if (password.length < 6) {
      feedback.textContent = "A senha precisa ter pelo menos 6 caracteres.";
      feedback.dataset.type = "error";
      return;
    }
    if (password !== confirm) {
      feedback.textContent = "As senhas não coincidem.";
      feedback.dataset.type = "error";
      return;
    }
    btn.disabled = true;
    feedback.textContent = "Salvando...";
    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      feedback.textContent = "Senha alterada com sucesso. Você já pode voltar ao site.";
      feedback.dataset.type = "success";
      form.reset();
    } catch (error) {
      feedback.textContent = String(error?.message || "Não foi possível alterar a senha.");
      feedback.dataset.type = "error";
    } finally {
      btn.disabled = false;
    }
  });
}
