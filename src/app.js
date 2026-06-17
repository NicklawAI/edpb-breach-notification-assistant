/* EDPB Breach Notification Assistant - app engine.
 * Apache-2.0 (code). (c) 2026 Nicola Franchetto, Martim Taborda Barata.
 * Runs fully client-side, offline. No data leaves the browser.
 */
(function () {
  "use strict";
  var DATA = window.EBNA_DATA;
  var I18N = window.EBNA_I18N;
  var lang = "en";
  var state = { pre: {}, enisa: {}, form: {}, severity: null };

  function t(key, fallback) {
    var L = I18N[lang] || {};
    if (L[key] != null) return L[key];
    if (I18N.en[key] != null) return I18N.en[key];
    return (fallback != null) ? fallback : key;
  }
  // Field/option content helpers (route the EDPB template strings through i18n).
  function fLabel(f) { return t("f." + f.id + ".label", f.label); }
  function fTip(f) { return f.tooltip ? t("f." + f.id + ".tip", f.tooltip) : ""; }
  function oLabel(fid, okey, fallback) { return t("f." + fid + ".opt." + okey, fallback); }
  function el(tag, attrs, children) {
    var e = document.createElement(tag);
    attrs = attrs || {};
    Object.keys(attrs).forEach(function (k) {
      if (k === "class") e.className = attrs[k];
      else if (k === "html") e.innerHTML = attrs[k];
      else if (k.slice(0, 2) === "on") e.addEventListener(k.slice(2), attrs[k]);
      else e.setAttribute(k, attrs[k]);
    });
    (children || []).forEach(function (c) {
      if (typeof c === "string") e.appendChild(document.createTextNode(c));
      else if (c) e.appendChild(c);
    });
    return e;
  }

  /* ---------- ENISA severity engine (graduated CB, verbatim ENISA Annex 3) ---------- */
  var ENISA = DATA.enisa;
  // cbState = { confidentiality: 0|0.25|0.5, integrity: ..., availability: ..., malicious: bool }
  function cbTotal(cb) {
    cb = cb || {};
    var sum = (cb.confidentiality || 0) + (cb.integrity || 0) + (cb.availability || 0);
    if (cb.malicious) sum += ENISA.cb.malicious_intent.points;
    return sum;
  }
  function computeSeverity(dpcBase, eiScore, cb) {
    var se = dpcBase * eiScore + cbTotal(cb);
    var band = ENISA.bands.find(function (b) {
      var okMin = (b.min == null) || se >= b.min;
      var okMax = (b.max == null) || se < b.max;
      return okMin && okMax;
    });
    return { se: Math.round(se * 100) / 100, band: band, notify: se >= 2 };
  }

  /* Segmented button group: immediate selection, active-state feedback, no dropdown.
     options: [{value,label,title}]; current: selected value; onpick(value). Updates
     its own active state in place (no full re-render) and calls onpick. */
  function segmented(options, current, onpick) {
    var group = el("div", { class: "segmented" });
    options.forEach(function (o) {
      var b = el("button", { type: "button", "aria-pressed": String(o.value === current),
        class: "seg" + (o.value === current ? " active" : ""), title: o.title || "",
        onclick: function () {
          Array.prototype.forEach.call(group.children, function (c) { c.className = "seg"; c.setAttribute("aria-pressed", "false"); });
          b.className = "seg active"; b.setAttribute("aria-pressed", "true");
          onpick(o.value);
        } }, [o.label]);
      group.appendChild(b);
    });
    return group;
  }
  function helpLine(text) { return el("p", { class: "help muted small" }, [text]); }

  /* ---------- Conditional visibility (best-effort from raw business logic) ---------- */
  function fieldVisible(field) {
    // Section headers and unconditional fields always show. visible_if is raw
    // EDPB business logic; we surface it but default to visible so the form is
    // never under-inclusive. Fine-grained rule evaluation is a roadmap item.
    return true;
  }

  /* ---------- Views ---------- */
  function viewPreAssessment() {
    var wrap = el("section", { class: "card" }, [
      el("h2", {}, [t("pre.title")]),
      el("p", { class: "muted" }, [t("pre.intro")]),
    ]);
    var qs = [
      ["isbreach", "pre.q_isbreach"],
      ["personaldata", "pre.q_personaldata"],
      ["risk", "pre.q_risk"],
      ["highrisk", "pre.q_highrisk"],
    ];
    qs.forEach(function (q) {
      var row = el("div", { class: "q" }, [el("label", {}, [t(q[1])])]);
      ["yes", "no", "unknown"].forEach(function (v) {
        var id = "pre_" + q[0] + "_" + v;
        var input = el("input", {
          type: "radio", name: "pre_" + q[0], id: id, value: v,
          onchange: function () { state.pre[q[0]] = v; renderVerdict(); },
        });
        if (state.pre[q[0]] === v) input.checked = true;
        row.appendChild(el("span", { class: "opt" }, [input, el("label", { for: id }, [t("common." + v)])]));
      });
      wrap.appendChild(row);
    });
    var verdict = el("div", { class: "verdict", id: "pre-verdict" });
    wrap.appendChild(verdict);
    function renderVerdict() {
      var p = state.pre, msgs = [];
      if (p.isbreach === "no" || p.personaldata === "no") msgs.push(["warn", t("pre.verdict.notbreach")]);
      else {
        if (p.risk === "no") msgs.push(["info", t("pre.verdict.norisk")]);
        if (p.risk === "yes") msgs.push(["alert", t("pre.verdict.notify_dpa")]);
        if (p.highrisk === "yes") msgs.push(["alert", t("pre.verdict.notify_subjects")]);
      }
      verdict.innerHTML = "";
      msgs.forEach(function (m) { verdict.appendChild(el("div", { class: "banner " + m[0] }, [m[1]])); });
    }
    renderVerdict();
    return wrap;
  }

  function viewSeverity() {
    var wrap = el("section", { class: "card" }, [
      el("h2", {}, [t("enisa.title")]),
      el("p", { class: "muted" }, [t("enisa.intro")]),
      el("p", { class: "formula" }, ["SE = DPC × EI + CB"]),
    ]);
    var s = state.enisa;
    s.cb = (s.cb && typeof s.cb === "object" && !Array.isArray(s.cb)) ? s.cb : { confidentiality: 0, integrity: 0, availability: 0, malicious: false };
    s.mitigants = s.mitigants || {};
    var result = el("div", { class: "verdict sticky", id: "enisa-result" });

    // DPC base - segmented buttons (verbatim ENISA values, only the control type changes)
    wrap.appendChild(el("h3", {}, [t("enisa.dpc")]));
    wrap.appendChild(helpLine(t("help.dpc")));
    wrap.appendChild(segmented(Object.keys(ENISA.dpc.base).map(function (k) {
      var b = ENISA.dpc.base[k], lbl = t("enisa.dpc.base." + k, b.label); return { value: b.score, label: lbl.split(" (")[0] + " (" + b.score + ")", title: lbl };
    }), s.dpc, function (v) { s.dpc = v; recalc(); }));

    // EI - segmented buttons
    wrap.appendChild(el("h3", {}, [t("enisa.ei")]));
    wrap.appendChild(helpLine(t("help.ei")));
    wrap.appendChild(segmented(Object.keys(ENISA.ei.levels).map(function (k) {
      var lv = ENISA.ei.levels[k], lbl = t("enisa.ei.lvl." + k, lv.label); return { value: lv.score, label: lbl.split(" -")[0] + " (" + lv.score + ")", title: lbl };
    }), s.ei, function (v) { s.ei = v; recalc(); }));

    // CB graduated 0 / +0.25 / +0.5 per C/I/A (verbatim ENISA Annex 3) + malicious +0.5
    wrap.appendChild(el("h3", {}, [t("enisa.cb")]));
    wrap.appendChild(helpLine(t("help.cb")));
    Object.keys(ENISA.cb.graduated).forEach(function (k) {
      var g = ENISA.cb.graduated[k];
      wrap.appendChild(el("label", { class: "seg-label" }, [t("enisa.cb." + k + ".label", g.label)]));
      wrap.appendChild(segmented(g.levels.map(function (lv, i) {
        return { value: lv.points, label: "+" + lv.points, title: t("enisa.cb." + k + ".lvl" + i, lv.label) };
      }), (s.cb[k] || 0), function (v) { s.cb[k] = v; recalc(); }));
    });
    // Malicious intent as a toggle button
    wrap.appendChild(el("label", { class: "seg-label" }, [t("enisa.cb.malicious", ENISA.cb.malicious_intent.label) + " (+" + ENISA.cb.malicious_intent.points + ")"]));
    wrap.appendChild(segmented([{ value: false, label: t("common.no") }, { value: true, label: t("common.yes") + " (+0.5)" }], !!s.cb.malicious, function (v) { s.cb.malicious = v; recalc(); }));

    // Mitigating factors (P5) - editable toggle buttons; apply a one-time nudge to the
    // indicated variable (Art. 5: editable suggestion, the controller sees the change).
    if (ENISA.mitigating_factors) {
      wrap.appendChild(el("h3", {}, [t("enisa.mititle", "Mitigating factors")]));
      wrap.appendChild(helpLine(t("enisa.mit.note", ENISA.mitigating_factors.note)));
      ENISA.mitigating_factors.factors.forEach(function (m) {
        var row = el("div", { class: "mitigant" }, [
          el("span", { class: "mit-label" }, [t("enisa.mit." + m.key, m.label), el("span", { class: "mit-tag" }, [" " + m.variable + " " + m.direction])]),
        ]);
        row.appendChild(segmented([{ value: false, label: t("mit.off", "Off") }, { value: true, label: t("mit.apply", "Apply") }], !!s.mitigants[m.key],
          function (v) { var was = !!s.mitigants[m.key]; s.mitigants[m.key] = v; if (v && !was) applyMitigant(m); activeTab = "enisa"; render(); }));
        wrap.appendChild(row);
      });
    }
    function applyMitigant(m) {
      if (m.effect === "zero_confidentiality" || m.effect === "neutralise_confidentiality") s.cb.confidentiality = 0;
      else if (m.effect === "zero_availability") s.cb.availability = 0;
      else if (m.variable === "DPC" && m.direction === "decrease") s.dpc = Math.max(1, (s.dpc || 1) - 1); // whole-step, qualitative
      else if (m.variable === "EI" && m.direction === "decrease") {
        var order = [0.25, 0.5, 0.75, 1.0]; var i = order.indexOf(s.ei != null ? s.ei : 1.0);
        s.ei = order[Math.max(0, i - 1)];
      } else if (m.variable === "CB" && m.direction === "decrease") s.cb.confidentiality = Math.max(0, (s.cb.confidentiality || 0) - 0.25);
    }

    wrap.appendChild(result);
    if (ENISA.provenance) wrap.appendChild(el("p", { class: "muted small prov" }, ["Provenance: " + t("enisa.provenance", ENISA.provenance)]));
    function recalc() {
      if (s.dpc == null || s.ei == null) {
        result.innerHTML = ""; result.appendChild(el("div", { class: "muted small" }, [t("enisa.select_prompt", "Select DPC and EI to compute the severity.")]));
        return;
      }
      var r = computeSeverity(s.dpc, s.ei, s.cb);
      state.severity = r;
      result.innerHTML = "";
      result.appendChild(el("div", { class: "score" }, [t("enisa.result") + ": ", el("b", { class: "se-num" }, [String(r.se)]),
        "  -  " + t("enisa.band") + ": ", el("b", { class: "band-" + r.band.key }, [t("enisa.band." + r.band.key, r.band.label)])]));
      result.appendChild(el("div", { class: "banner " + (r.notify ? "alert" : "info") }, [r.notify ? t("enisa.trigger_on") : t("enisa.trigger_off")]));
      result.appendChild(el("div", { class: "muted small" }, [t("enisa.band." + r.band.key + ".meaning", r.band.meaning)]));
    }
    recalc();
    return wrap;
  }

  function viewForm() {
    var wrap = el("section", { class: "card" }, [
      el("h2", {}, [t("form.title")]),
      el("p", { class: "muted" }, [t("form.intro")]),
    ]);
    // Prefill: ENISA severity -> field 87 (severity) + field 90 (methodology)
    if (state.severity) {
      var sevMap = { low: "a", medium: "b", high: "c", very_high: "c" };
      state.form["field_87"] = sevMap[state.severity.band.key] || state.form["field_87"];
      state.form["field_90"] = t("form.methodology_prefix", "ENISA severity methodology: SE = DPC x EI + CB = ") + state.severity.se +
        " (" + t("enisa.band." + state.severity.band.key, state.severity.band.label) + "). " + t("enisa.band." + state.severity.band.key + ".meaning", state.severity.band.meaning);
    }
    var currentSection = null;
    DATA.fields.forEach(function (f) {
      if (f.section && f.section !== currentSection) {
        currentSection = f.section;
        wrap.appendChild(el("h3", { class: "section" }, [f.section]));
      }
      if (!fieldVisible(f)) return;
      wrap.appendChild(renderField(f));
    });
    var btn = el("button", { class: "primary", onclick: exportJSON }, [t("form.export_json")]);
    wrap.appendChild(el("div", { class: "actions" }, [btn]));
    wrap.appendChild(el("p", { class: "muted small" }, [t("form.export_note")]));
    return wrap;
  }

  function renderField(f) {
    var key = "field_" + f.id;
    var row = el("div", { class: "field" });
    var labelText = fLabel(f) + (f.mandatory === "yes" ? " *" : "");
    var label = el("label", {}, [labelText]);
    if (f.gdpr_ref) label.appendChild(el("span", { class: "gdpr" }, [" [" + t("form.gdpr") + ": " + f.gdpr_ref + "]"]));
    row.appendChild(label);
    if (f.tooltip) row.appendChild(el("div", { class: "tooltip muted small" }, [fTip(f)]));
    var ctl;
    if (f.type === "enum" && f.options.length) {
      ctl = el("select", { onchange: function (e) { state.form[key] = e.target.value; } });
      ctl.appendChild(el("option", { value: "" }, [t("common.option_dash", "--")]));
      f.options.forEach(function (o) {
        var op = el("option", { value: o.key }, [o.key + ") " + oLabel(f.id, o.key, o.label)]);
        if (state.form[key] === o.key) op.selected = true;
        ctl.appendChild(op);
      });
    } else if (f.type === "multi-select" && f.options.length) {
      ctl = el("div", { class: "multi" });
      f.options.forEach(function (o) {
        var cb = el("input", { type: "checkbox", id: key + "_" + o.key,
          onchange: function (e) {
            state.form[key] = state.form[key] || [];
            if (e.target.checked) state.form[key].push(o.key);
            else state.form[key] = state.form[key].filter(function (x) { return x !== o.key; });
          } });
        if ((state.form[key] || []).indexOf(o.key) >= 0) cb.checked = true; // restore state on re-render
        ctl.appendChild(el("span", { class: "opt" }, [cb, el("label", { for: key + "_" + o.key }, [o.key + ") " + oLabel(f.id, o.key, o.label)])]));
      });
    } else if (f.type === "textarea") {
      ctl = el("textarea", { rows: "2", oninput: function (e) { state.form[key] = e.target.value; } });
      if (state.form[key]) ctl.value = state.form[key];
    } else if (f.type === "date" || f.type === "datetime") {
      ctl = el("input", { type: f.type === "date" ? "date" : "datetime-local", oninput: function (e) { state.form[key] = e.target.value; } });
      if (state.form[key]) ctl.value = state.form[key];
    } else if (f.type === "number") {
      ctl = el("input", { type: "number", min: "0", oninput: function (e) { state.form[key] = e.target.value; } });
      if (state.form[key] != null && state.form[key] !== "") ctl.value = state.form[key]; // restore state
    } else if (f.type === "boolean") {
      ctl = el("input", { type: "checkbox", onchange: function (e) { state.form[key] = e.target.checked; } });
      if (state.form[key]) ctl.checked = true; // restore state on re-render
    } else {
      ctl = el("input", { type: "text", oninput: function (e) { state.form[key] = e.target.value; } });
      if (state.form[key]) ctl.value = state.form[key];
    }
    // f.visible_if holds the EDPB template's raw English authoring notes (e.g.
    // "implement only if required"); they are template-authoring metadata, not
    // controller-facing guidance, so we do not surface them. Retained in data.js
    // for future real conditional-visibility logic (roadmap, see fieldVisible).
    row.appendChild(ctl);
    return row;
  }

  /* ---------- Obligations checklist ("Your obligations for this breach") ----------
   * Derives the duties from data already entered (pre-assessment risk/high-risk +
   * ENISA severity + notification fields). Read-only summary with article refs. */
  function viewObligations() {
    var p = state.pre || {}, sev = state.severity, n = state.form || {};
    var card = el("div", { class: "card obligations" }, [
      el("h3", {}, [t("obl.title", "Your obligations for this breach")]),
      el("p", { class: "muted small" }, [t("obl.intro", "Indicative guidance generated from the data you entered.")]),
    ]);
    function item(state_, title, detail, ref) {
      var badge = state_ === "yes" ? t("obl.badge.required", "Required") : state_ === "no" ? t("obl.badge.notreq", "Not required") : t("obl.badge.assess", "To assess");
      return el("div", { class: "obl " + state_ }, [
        el("div", { class: "obl-head" }, [el("span", { class: "obl-badge " + state_ }, [badge]),
          el("b", {}, [" " + title]), el("span", { class: "obl-ref muted small" }, ["  " + ref])]),
        el("div", { class: "muted small" }, [detail]),
      ]);
    }
    // Art. 33 - notify the supervisory authority. Trigger is the Art. 33(1) risk test,
    // NOT the ENISA score (SE informs the assessment, it does not determine it).
    var notifyAuth = (p.risk === "yes") ? "yes" : (p.risk === "no" ? "no" : "assess");
    card.appendChild(item(notifyAuth, t("obl.auth.title", "Notify the supervisory authority"),
      notifyAuth === "yes" ? t("obl.auth.required") : notifyAuth === "no" ? t("obl.auth.notreq") : t("obl.auth.assess"), "Art. 33(1)"));
    // Art. 34 - communicate to data subjects
    var notifySubj = (p.highrisk === "yes") ? "yes" : (p.highrisk === "no" ? "no" : "assess");
    card.appendChild(item(notifySubj, t("obl.subj.title", "Communicate to the affected individuals"), t("obl.subj.text"), "Art. 34"));
    // Art. 33(5) - internal documentation (always). 24 months is the recommended
    // retention on the Canadian model (paper Part III.5), NOT a GDPR period.
    card.appendChild(item("yes", t("obl.doc.title", "Document the breach internally"), t("obl.doc.text"), "Art. 33(5)"));
    card.appendChild(el("p", { class: "muted small disclaimer-note" }, [t("obl.disclaimer")]));
    return card;
  }

  /* ---------- Record-keeping (PIPEDA-style, localStorage) ---------- */
  function getRecords() {
    try { return JSON.parse(localStorage.getItem("ebna_records") || "[]"); } catch (e) { return []; }
  }
  function viewRecord() {
    var container = el("div", {});
    container.appendChild(viewObligations()); // "Your obligations for this breach" checklist on top
    var wrap = el("section", { class: "card" }, [
      el("h2", {}, [t("record.title")]),
      el("p", { class: "muted" }, [t("record.intro")]),
    ]);
    // PIPEDA-style minimum fields (6) + 24-month retention note
    var rk = DATA.record_keeping;
    state.record = state.record || {};
    wrap.appendChild(el("p", { class: "muted small" }, [t("record.retention_prefix", "Retention") + ": " + rk.retention_months + " months. " + t("rk.retention_note", rk.retention_note)]));
    rk.minimum_fields.forEach(function (mf) {
      var row = el("div", { class: "field" }, [el("label", {}, [t("rk." + mf.key, mf.label)])]);
      var ctl = mf.type === "textarea"
        ? el("textarea", { rows: "2", oninput: function (e) { state.record[mf.key] = e.target.value; } })
        : el("input", { type: "text", oninput: function (e) { state.record[mf.key] = e.target.value; } });
      if (state.record[mf.key]) ctl.value = state.record[mf.key];
      row.appendChild(ctl);
      wrap.appendChild(row);
    });
    wrap.appendChild(el("button", { class: "primary", onclick: function () {
      var recs = getRecords();
      recs.push({ saved_at: new Date().toISOString(), retention_until_months: rk.retention_months,
        severity: state.severity, pre: state.pre, minimum_record: state.record, notification: state.form });
      localStorage.setItem("ebna_records", JSON.stringify(recs));
      render();
    } }, [t("record.add")]));
    var recs = getRecords();
    if (!recs.length) wrap.appendChild(el("p", { class: "muted" }, [t("record.empty")]));
    else {
      var list = el("ul", { class: "records" });
      recs.forEach(function (r, i) {
        var sev = r.severity ? (t("enisa.band." + r.severity.band.key, r.severity.band.label) + " / SE " + r.severity.se) : "n/a";
        list.appendChild(el("li", {}, ["#" + (i + 1) + " - " + r.saved_at + " - " + sev]));
      });
      wrap.appendChild(list);
      var bar = el("div", { class: "actions" }, [
        el("button", { onclick: function () { downloadJSON(recs, "breach-record.json"); } }, [t("record.export", "Export record (JSON)")]),
        el("button", { onclick: function () { downloadText(registerCSV(recs), "breach-register.csv", "text/csv"); } }, [t("btn.export_csv", "Export CSV")]),
        el("button", { onclick: function () { downloadText(registerXLS(recs), "breach-register.xls", "application/vnd.ms-excel"); } }, [t("btn.export_xls", "Export XLS")]),
        el("button", { onclick: exportAggregate }, [t("btn.export_aggregate", "Export aggregate statistics (anonymised)")]),
      ]);
      wrap.appendChild(bar);
      wrap.appendChild(el("p", { class: "muted small" }, [t("record.aggregate_note", "Aggregate export: anonymised counts by taxonomy, k-anonymity") + " k=" + DATA.aggregate_transparency.k_default + " " + t("record.aggregate_note2", "(small cells suppressed). No single-notification rows, no controller identity.")]));
    }
    container.appendChild(wrap);
    return container;
  }

  /* ---------- Breach register export (Frank P8): rich record, CSV + XLS ---------- */
  // Columns combine the Canadian record fields with data pulled from the
  // pre-assessment, ENISA score and the EDPB notification.
  var REGISTER_COLUMNS = [
    ["reference", "Internal reference"],
    ["date_period", "Date / period of incident"],
    ["circumstances_cause", "Circumstances and cause"],
    ["nature_cia", "Nature (C-I-A)"],
    ["incident_type", "Incident type (taxonomy)"],
    ["data_categories", "Data categories"],
    ["numbers", "Number of data subjects / records (approx.)"],
    ["risk_outcome", "Risk assessment outcome"],
    ["methodology_enisa", "Methodology (ENISA SE)"],
    ["notified_authority", "Notified to supervisory authority"],
    ["notified_individuals", "Communicated to individuals"],
    ["reasoned_basis", "Reasoned basis if not notified/communicated"],
    ["measures", "Measures taken"],
    ["retention", "Retention"],
    ["saved_at", "Record created"],
  ];
  function optLabel(fieldId, key) {
    var f = DATA.fields.find(function (x) { return x.id === fieldId; });
    if (!f || !key) return key || "";
    var o = (f.options || []).find(function (x) { return x.key === key; });
    return o ? (key + ") " + oLabel(fieldId, key, o.label)) : key;
  }
  // Array-safe label: handles single value or a multi-select array of keys.
  function optLabelAny(fieldId, val) {
    if (Array.isArray(val)) return val.map(function (k) { return optLabel(fieldId, k); }).join("; ");
    return optLabel(fieldId, val);
  }
  function registerRow(r) {
    var n = r.notification || {}, mr = r.minimum_record || {}, sev = r.severity;
    var f97 = n.field_97; // communicated to data subjects
    var authority = (r.pre && r.pre.risk === "yes") ? "Yes (Art. 33)" : (r.pre && r.pre.risk === "no" ? "No (no likely risk - recorded)" : "To assess");
    var individuals = f97 ? optLabel(97, f97) : ((r.pre && r.pre.highrisk === "yes") ? "Yes (Art. 34)" : "No / not required");
    return {
      reference: n.field_7 || "",
      date_period: n.field_44 ? optLabel(44, n.field_44) : (mr.date_or_period || ""),
      circumstances_cause: (mr.circumstances_cause || "") + (n.field_61 ? " | cause: " + optLabel(61, n.field_61) : ""),
      nature_cia: n.field_55 ? optLabelAny(55, n.field_55) : "",
      incident_type: n.field_60 ? optLabel(60, n.field_60) : "",
      data_categories: mr.personal_information || (n.field_70 ? optLabelAny(70, n.field_70) : ""),
      numbers: mr.number_affected || n.field_68 || n.field_73 || "",
      risk_outcome: n.field_89 ? optLabel(89, n.field_89) : (sev && sev.notify ? "Risk -> notification path" : "No high risk"),
      methodology_enisa: sev ? ("ENISA SE = " + sev.se + " (" + sev.band.label + ")") : "",
      notified_authority: authority,
      notified_individuals: individuals,
      reasoned_basis: n.field_100 ? optLabel(100, n.field_100) : (n.field_101 || mr.notification_steps || ""),
      measures: mr.mitigation_steps || (n.field_92 || ""),
      retention: (r.retention_until_months || 24) + " months min.",
      saved_at: r.saved_at || "",
    };
  }
  function csvCell(v) { v = (v == null ? "" : String(v)); return '"' + v.replace(/"/g, '""') + '"'; }
  function registerCSV(recs) {
    var head = REGISTER_COLUMNS.map(function (c) { return csvCell(c[1]); }).join(",");
    var rows = recs.map(function (r) {
      var row = registerRow(r);
      return REGISTER_COLUMNS.map(function (c) { return csvCell(row[c[0]]); }).join(",");
    });
    return "﻿" + [head].concat(rows).join("\r\n");
  }
  function xmlEsc(v) { return String(v == null ? "" : v).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;"); }
  function registerXLS(recs) {
    // SpreadsheetML 2003 (Excel-native, dependency-free, opens offline).
    var head = REGISTER_COLUMNS.map(function (c) { return '<Cell><Data ss:Type="String">' + xmlEsc(c[1]) + "</Data></Cell>"; }).join("");
    var body = recs.map(function (r) {
      var row = registerRow(r);
      var cells = REGISTER_COLUMNS.map(function (c) { return '<Cell><Data ss:Type="String">' + xmlEsc(row[c[0]]) + "</Data></Cell>"; }).join("");
      return "<Row>" + cells + "</Row>";
    }).join("");
    return '<?xml version="1.0"?>\n' +
      '<?mso-application progid="Excel.Sheet"?>\n' +
      '<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet" xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet">' +
      '<Worksheet ss:Name="Breach register"><Table>' +
      "<Row>" + head + "</Row>" + body +
      "</Table></Worksheet></Workbook>";
  }

  /* ---------- Aggregate transparency (Frank/Martim P2, California model) ----------
   * Anonymised aggregate statistics by template taxonomy. Counts only, by category,
   * over a period. k-anonymity: cells with count < k are suppressed into __suppressed__.
   */
  function subjectsBucket(r) {
    var raw = (r.minimum_record && r.minimum_record.number_affected) || (r.notification && (r.notification.field_68 || r.notification.field_73)) || "";
    var n = parseInt(String(raw).replace(/[^0-9]/g, ""), 10);
    if (!n) return "unknown";
    if (n === 1) return "1";
    if (n < 10) return "2-9";
    if (n < 100) return "10-99";
    if (n < 1000) return "100-999";
    if (n < 10000) return "1k-10k";
    return ">10k";
  }
  function aggregateRecords(recs, k, period) {
    var dims = { incident_type: {}, cause: {}, nature_cia: {}, data_categories: {}, severity_band: {}, nace_sector: {}, data_subjects_range: {}, art34_communicated: {} };
    function bump(map, key) {
      if (key == null || key === "") return;
      if (Array.isArray(key)) { key.forEach(function (k) { bump(map, k); }); return; } // multi-select: count each value
      map[key] = (map[key] || 0) + 1;
    }
    recs.forEach(function (r) {
      var n = r.notification || {};
      bump(dims.incident_type, n.field_60);
      bump(dims.cause, n.field_61);
      bump(dims.nature_cia, n.field_55);
      bump(dims.data_categories, n.field_70);
      bump(dims.severity_band, r.severity && r.severity.band ? r.severity.band.key : null);
      bump(dims.nace_sector, n.field_17);
      bump(dims.data_subjects_range, subjectsBucket(r));
      bump(dims.art34_communicated, n.field_97 ? "communicated" : "not_communicated");
    });
    // k-anonymity: suppress small cells into __suppressed__
    Object.keys(dims).forEach(function (d) {
      var m = dims[d], supp = 0;
      Object.keys(m).forEach(function (key) { if (m[key] < k) { supp += m[key]; delete m[key]; } });
      if (supp > 0) m.__suppressed__ = supp;
    });
    return {
      period: { granularity: (period && period.granularity) || "year", label: (period && period.label) || String(new Date().getUTCFullYear ? "" : "") || "current" },
      k_anonymity_threshold: k,
      total_notifications: recs.length,
      anonymisation_guarantees: DATA.aggregate_transparency.guarantees,
      dimensions: dims,
    };
  }

  /* ---------- Export ---------- */
  function exportJSON() {
    downloadJSON(state.form, "edpb-breach-notification.json");
  }
  function exportAggregate() {
    var k = DATA.aggregate_transparency.k_default;
    var agg = aggregateRecords(getRecords(), k, { granularity: "year", label: "current" });
    downloadJSON(agg, "aggregate-transparency.json");
  }
  function downloadJSON(obj, name) { downloadText(JSON.stringify(obj, null, 2), name, "application/json"); }
  function downloadText(text, name, mime) {
    var blob = new Blob([text], { type: (mime || "text/plain") + ";charset=utf-8" });
    var a = el("a", { href: URL.createObjectURL(blob), download: name });
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
  }

  /* ---------- Shell ---------- */
  var activeTab = "pre";
  function render() {
    var root = document.getElementById("app");
    root.innerHTML = "";
    // header
    var header = el("header", {}, [
      el("h1", {}, [t("app.title")]),
      el("p", { class: "subtitle" }, [t("app.subtitle")]),
      el("div", { class: "disclaimer" }, [t("app.disclaimer")]),
    ]);
    // language selector
    var sel = el("select", { class: "lang", onchange: function (e) { lang = e.target.value; render(); } });
    Object.keys(I18N).forEach(function (code) {
      var meta = I18N[code]._meta || {};
      var label = (meta.name || code) + (meta.status === "complete" ? "" : " " + t("lang.incomplete"));
      var o = el("option", { value: code }, [label]);
      if (code === lang) o.selected = true;
      sel.appendChild(o);
    });
    header.appendChild(el("div", { class: "langbox" }, [el("span", {}, [t("lang.label") + ": "]), sel]));
    root.appendChild(header);
    // tabs
    var tabs = el("nav", { class: "tabs" });
    [["pre", "nav.preassessment"], ["enisa", "nav.severity"], ["form", "nav.notification"], ["record", "nav.record"]].forEach(function (tb) {
      tabs.appendChild(el("button", { class: activeTab === tb[0] ? "tab active" : "tab",
        onclick: function () { activeTab = tb[0]; render(); } }, [t(tb[1])]));
    });
    root.appendChild(tabs);
    // body
    var body;
    if (activeTab === "pre") body = viewPreAssessment();
    else if (activeTab === "enisa") body = viewSeverity();
    else if (activeTab === "form") body = viewForm();
    else body = viewRecord();
    root.appendChild(body);
    // step navigation (Back / Next)
    var order = ["pre", "enisa", "form", "record"];
    var idx = order.indexOf(activeTab);
    var nav = el("div", { class: "stepnav" });
    if (idx > 0) nav.appendChild(el("button", { onclick: function () { activeTab = order[idx - 1]; render(); window.scrollTo(0, 0); } }, ["← " + t("common.back")]));
    else nav.appendChild(el("span", {}));
    nav.appendChild(el("span", { class: "stepcount muted small" }, [t("common.step", "Step") + " " + (idx + 1) + " / " + order.length]));
    if (idx < order.length - 1) nav.appendChild(el("button", { class: "primary", onclick: function () { activeTab = order[idx + 1]; render(); window.scrollTo(0, 0); } }, [t("common.next") + " →"]));
    else nav.appendChild(el("span", {}));
    root.appendChild(nav);
    // footer
    root.appendChild(el("footer", {}, [
      el("span", {}, ["EDPB template v1.0 - consultation until 2026-08-05 - "]),
      el("a", { href: DATA.template.source_url, target: "_blank" }, ["source"]),
      el("span", {}, [" - Apache-2.0 + CC-BY-4.0 - (c) Nicola Franchetto, Martim Taborda Barata"]),
    ]));
  }

  /* Deep-link: #tab=<pre|enisa|form|record>[&demo=1] sets the initial tab and,
     with demo=1, seeds an example ENISA score (used for docs/screenshots). */
  function applyHash() {
    var h = (location.hash || "").replace(/^#/, "");
    var params = {};
    h.split("&").forEach(function (kv) { var p = kv.split("="); if (p[0]) params[p[0]] = p[1]; });
    if (params.lang && I18N[params.lang]) lang = params.lang;
    if (params.tab && ["pre", "enisa", "form", "record"].indexOf(params.tab) >= 0) activeTab = params.tab;
    if (params.demo === "1") {
      state.pre = { isbreach: "yes", personaldata: "yes", risk: "yes", highrisk: "yes" };
      var demoCb = { confidentiality: 0.5, integrity: 0, availability: 0, malicious: true };
      state.enisa = { dpc: 4, ei: 1.0, cb: demoCb };
      state.severity = computeSeverity(4, 1.0, demoCb);
      state.record = { circumstances_cause: "Ransomware exfiltration of customer database.", date_or_period: "2026-06-15", personal_information: "Names, emails, payment methods.", number_affected: "~12,000", mitigation_steps: "Isolated systems, rotated credentials, engaged IR firm.", notification_steps: "Email to affected individuals scheduled." };
      state.form = { field_55: ["a"], field_60: "b", field_89: "a", field_70: ["a", "q"] };
      // Seed one saved record so the export bar (JSON/CSV/XLS) is demonstrable.
      try {
        if (!getRecords().length) {
          localStorage.setItem("ebna_records", JSON.stringify([{ saved_at: "2026-06-16T09:00:00Z", retention_until_months: 24, severity: state.severity, pre: state.pre, minimum_record: state.record, notification: state.form }]));
        }
      } catch (e) { /* localStorage unavailable */ }
    }
  }

  window.addEventListener("DOMContentLoaded", function () { applyHash(); render(); });
})();
