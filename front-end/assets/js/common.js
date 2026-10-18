"use strict";

/* ---------- Theme: applied immediately (script is loaded in <head>) ---------- */
(function () {
  let saved = null;
  try { saved = localStorage.getItem("hp-theme"); } catch (_) { /* storage blocked */ }
  const dark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
  document.documentElement.dataset.theme =
    saved === "light" || saved === "dark" ? saved : (dark ? "dark" : "light");
})();

/* ---------- Shared page behaviour: theme toggle, mobile menu, year ---------- */
document.addEventListener("DOMContentLoaded", () => {
  const root = document.documentElement;
  const toggle = document.getElementById("themeToggle");
  if (toggle) {
    const sync = () => toggle.setAttribute("aria-pressed", String(root.dataset.theme === "dark"));
    sync();
    toggle.addEventListener("click", () => {
      root.dataset.theme = root.dataset.theme === "dark" ? "light" : "dark";
      try { localStorage.setItem("hp-theme", root.dataset.theme); } catch (_) { /* ignore */ }
      sync();
    });
  }

  const navToggle = document.getElementById("navToggle");
  const navLinks = document.getElementById("navLinks");
  if (navToggle && navLinks) {
    navToggle.addEventListener("click", () => {
      const open = navLinks.classList.toggle("open");
      navToggle.setAttribute("aria-expanded", String(open));
    });
    navLinks.addEventListener("click", (e) => {
      if (e.target.closest("a")) {
        navLinks.classList.remove("open");
        navToggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  const year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();
});

/* ---------- Shared prediction-form engine ---------- */
(function () {
  class ApiError extends Error {}

  function el(tag, attrs, children) {
    const node = document.createElement(tag);
    Object.entries(attrs || {}).forEach(([k, v]) => {
      if (v === undefined || v === null || v === false) return;
      if (k === "text") node.textContent = v;
      else if (k === "class") node.className = v;
      else node.setAttribute(k, v === true ? "" : v);
    });
    (children || []).forEach((c) => node.append(c));
    return node;
  }

  /* Returns the probability only if the backend sent a valid 0-100 number. It is
     already a percentage, so it is never multiplied by 100 here. */
  function toPercent(value) {
    return typeof value === "number" && Number.isFinite(value) && value >= 0 && value <= 100
      ? value : null;
  }

  /* ----- Form rendering ----- */
  function buildField(f) {
    const id = "f-" + f.name;
    const describedBy = [f.hint ? id + "-hint" : null, id + "-err"].filter(Boolean).join(" ");
    const label = el("label", { for: id, text: f.label });
    if (f.unit) label.append(el("span", { class: "unit", text: " (" + f.unit + ")" }));

    let control;
    if (f.kind === "select") {
      control = el("select", { id, name: f.name, required: true, "aria-describedby": describedBy });
      control.append(el("option", { value: "", text: "Select an option" }));
      f.options.forEach(([value, text]) => control.append(el("option", { value, text })));
    } else {
      control = el("input", {
        id, name: f.name, type: "number", required: true, autocomplete: "off",
        step: f.kind === "int" ? "1" : "any", min: String(f.min ?? 0),
        inputmode: f.kind === "int" ? "numeric" : "decimal", "aria-describedby": describedBy
      });
    }
    const wrap = el("div", { class: "field" }, [label, control]);
    if (f.hint) wrap.append(el("p", { class: "hint", id: id + "-hint", text: f.hint }));
    wrap.append(el("p", { class: "error", id: id + "-err" }));
    return wrap;
  }

  function renderForm(cfg, container) {
    cfg.groups.forEach((group) => {
      const grid = el("div", { class: "grid" }, group.fields.map(buildField));
      container.append(el("fieldset", {}, [el("legend", { text: group.title }), grid]));
    });
  }

  /* ----- Validation: returns {value} or {error}. No silent defaults, ever. ----- */
  function validateField(f, control) {
    const raw = control.value.trim();
    if (f.kind === "select") {
      if (!raw) return { error: "Choose an option." };
      if (!f.options.some(([v]) => v === raw)) return { error: "Choose a listed option." };
      return { value: f.cast === "number" ? Number(raw) : raw };
    }
    if (control.validity && control.validity.badInput) return { error: "Enter a valid number." };
    if (raw === "") return { error: "This field is required." };
    const n = Number(raw);
    if (!Number.isFinite(n)) return { error: "Enter a finite number." };
    if (f.kind === "int" && !Number.isInteger(n)) return { error: "Enter a whole number." };
    const min = f.min ?? 0; // basic sanity check only (no negative values), not a clinical range
    if (n < min) return { error: "Value must be " + min + " or greater." };
    return { value: n };
  }

  function setFieldError(control, message) {
    const err = document.getElementById(control.id + "-err");
    err.textContent = message || "";
    if (message) control.setAttribute("aria-invalid", "true");
    else control.removeAttribute("aria-invalid");
  }

  /* ----- Network ----- */
  function describeHttpError(status, body) {
    if (status === 422 && body && Array.isArray(body.detail)) {
      const lines = body.detail.map((d) => {
        const where = Array.isArray(d.loc) ? d.loc.filter((p) => p !== "body").join(".") : "";
        return (where ? where + ": " : "") + (d.msg || "invalid value");
      });
      return "The API rejected the input (HTTP 422). " + lines.join("; ");
    }
    if (body && typeof body.detail === "string") return "The API returned an error (HTTP " + status + "): " + body.detail;
    return "The API returned an error (HTTP " + status + ").";
  }

  async function postJson(url, payload) {
    const { REQUEST_TIMEOUT_MS } = window.APP_CONFIG;
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), REQUEST_TIMEOUT_MS);
    let res;
    try {
      res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(payload),
        signal: ctrl.signal
      });
    } catch (err) {
      throw new ApiError(err.name === "AbortError"
        ? "The request timed out. The API did not respond in time."
        : "Could not reach the prediction API. Check that the backend is running, that API_BASE_URL in config.js is correct, and that the backend allows CORS for this page.");
    } finally {
      clearTimeout(timer);
    }
    const text = await res.text();
    let body;
    try { body = text ? JSON.parse(text) : null; } catch (_) { body = undefined; }
    if (!res.ok) throw new ApiError(describeHttpError(res.status, body));
    if (body === undefined || body === null) throw new ApiError("The API returned a response that is not valid JSON.");
    return body;
  }

  /* ----- Page controller ----- */
  function initPredictor(cfg) {
    const form = document.getElementById("predictForm");
    const fieldsHost = document.getElementById("formFields");
    const status = document.getElementById("status");
    const notice = document.getElementById("apiNotice");
    const submitBtn = document.getElementById("submitBtn");
    const resetBtn = document.getElementById("resetBtn");
    const spinner = submitBtn.querySelector(".spinner");
    const btnLabel = submitBtn.querySelector(".btn-label");
    let busy = false;

    renderForm(cfg, fieldsHost);
    const fields = cfg.groups.flatMap((g) => g.fields);
    const controlOf = (f) => document.getElementById("f-" + f.name);
    const path = window.APP_CONFIG.API_ENDPOINTS[cfg.key];

    if (!path) {
      notice.append(el("p", { text: "API endpoint pending configuration. Set API_ENDPOINTS." + cfg.key +
        " in assets/js/config.js once the FastAPI route is confirmed. The form is ready, but no request will be sent until then." }));
      notice.hidden = false;
    }

    fields.forEach((f) => {
      const c = controlOf(f);
      c.addEventListener("input", () => setFieldError(c, ""));
      c.addEventListener("change", () => setFieldError(c, ""));
    });

    function setBusy(state) {
      busy = state;
      submitBtn.disabled = state;
      form.setAttribute("aria-busy", String(state));
      spinner.hidden = !state;
      btnLabel.textContent = state ? "Predicting" : "Predict";
    }

    function showMessage(kind, text) {
      status.replaceChildren(el("div", { class: "msg msg-" + kind, role: kind === "error" ? "alert" : null }, [
        kind === "loading" ? el("span", { class: "spinner", "aria-hidden": "true" }) : "",
        el("span", { text })
      ]));
    }

    function showResult(r) {
      const card = el("section", { class: "result-card" + (r.predictionClass === 1 ? " is-class-1" : r.predictionClass === 0 ? " is-class-0" : ""), "aria-labelledby": "resultLabel" });
      card.append(el("p", { class: "result-eyebrow", text: "Model prediction" }));
      card.append(el("h2", { id: "resultLabel", class: "result-label", text: r.label }));
      if (r.predictionClass !== null) card.append(el("p", { class: "badge", text: "Predicted class: " + r.predictionClass }));
      card.append(el("p", { class: "result-prob", text: r.probability !== null
        ? "Probability returned by the model: " + Number(r.probability.toFixed(2)) + "%"
        : "The API did not return a valid probability for this prediction." }));
      card.append(el("p", { class: "result-note", text: "This is an educational model output, not a medical diagnosis. The probability is not a guaranteed chance of having a condition." }));
      const again = el("button", { type: "button", class: "btn btn-ghost", text: "Make another prediction" });
      again.addEventListener("click", () => resetAll(true));
      card.append(again);
      status.replaceChildren(card);
      status.scrollIntoView({ block: "nearest" });
    }

    function resetAll(focusFirst) {
      if (busy) return;
      form.reset();
      fields.forEach((f) => setFieldError(controlOf(f), ""));
      status.replaceChildren();
      if (focusFirst) { controlOf(fields[0]).focus(); form.scrollIntoView({ block: "start" }); }
    }

    resetBtn.addEventListener("click", () => resetAll(false));

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      if (busy) return; // prevents duplicate submissions

      const values = {};
      let firstInvalid = null;
      fields.forEach((f) => {
        const c = controlOf(f);
        const r = validateField(f, c);
        if (r.error) { setFieldError(c, r.error); firstInvalid = firstInvalid || c; }
        else { setFieldError(c, ""); values[f.name] = r.value; }
      });
      if (firstInvalid) {
        firstInvalid.focus();
        showMessage("error", "Fix the highlighted fields, then select Predict again.");
        return;
      }
      if (!path) {
        showMessage("error", "This module's API endpoint is not configured yet, so no request was sent.");
        return;
      }

      setBusy(true);
      showMessage("loading", "Sending your inputs to the prediction API");
      try {
        const base = window.APP_CONFIG.API_BASE_URL.replace(/\/+$/, "");
        const data = await postJson(base + path, cfg.buildPayload(values));
        let parsed;
        try { parsed = cfg.parseResponse(data); }
        catch (err) { throw new ApiError("The response could not be interpreted: " + err.message); }
        showResult(parsed);
      } catch (err) {
        showMessage("error", err instanceof ApiError ? err.message : "Unexpected error: " + err.message);
      } finally {
        setBusy(false); // inputs are never cleared on failure
      }
    });
  }

  window.HealthPredict = { initPredictor, toPercent };
})();
