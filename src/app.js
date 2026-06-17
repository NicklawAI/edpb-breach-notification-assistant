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

  function t(key) {
    var L = I18N[lang] || {};
    if (L[key] != null) return L[key];
    return (I18N.en[key] != null) ? I18N.en[key] : key;
  }
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
    // DPC base
    wrap.appendChild(el("h3", {}, [t("enisa.dpc")]));
    var dpcSel = el("select", { onchange: function (e) { s.dpc = parseFloat(e.target.value); recalc(); } });
    Object.keys(ENISA.dpc.base).forEach(function (k) {
      var b = ENISA.dpc.base[k];
      var o = el("option", { value: b.score }, [b.label + " (" + b.score + ")"]);
      if (s.dpc === b.score) o.selected = true;
      dpcSel.appendChild(o);
    });
    wrap.appendChild(dpcSel);
    // EI
    wrap.appendChild(el("h3", {}, [t("enisa.ei")]));
    var eiSel = el("select", { onchange: function (e) { s.ei = parseFloat(e.target.value); recalc(); } });
    Object.keys(ENISA.ei.levels).forEach(function (k) {
      var lv = ENISA.ei.levels[k];
      var o = el("option", { value: lv.score }, [lv.label + " (" + lv.score + ")"]);
      if (s.ei === lv.score) o.selected = true;
      eiSel.appendChild(o);
    });
    wrap.appendChild(eiSel);
    // CB - graduated 0 / +0.25 / +0.5 per C/I/A (verbatim ENISA Annex 3) + malicious +0.5
    wrap.appendChild(el("h3", {}, [t("enisa.cb")]));
    s.cb = (s.cb && typeof s.cb === "object" && !Array.isArray(s.cb)) ? s.cb : { confidentiality: 0, integrity: 0, availability: 0, malicious: false };
    Object.keys(ENISA.cb.graduated).forEach(function (k) {
      var g = ENISA.cb.graduated[k];
      var row = el("div", { class: "field" }, [el("label", {}, [g.label])]);
      var sel = el("select", { onchange: function (e) { s.cb[k] = parseFloat(e.target.value); recalc(); } });
      g.levels.forEach(function (lv) {
        var o = el("option", { value: lv.points }, ["+" + lv.points + " - " + lv.label]);
        if (s.cb[k] === lv.points) o.selected = true;
        sel.appendChild(o);
      });
      row.appendChild(sel);
      wrap.appendChild(row);
    });
    var mal = el("input", { type: "checkbox", id: "cb_mal", onchange: function (e) { s.cb.malicious = e.target.checked; recalc(); } });
    if (s.cb.malicious) mal.checked = true;
    wrap.appendChild(el("div", { class: "opt" }, [mal, el("label", { for: "cb_mal" }, [ENISA.cb.malicious_intent.label + " (+" + ENISA.cb.malicious_intent.points + ")"])]));

    // Mitigating factors (Frank P5) - editable toggles that move a variable in the
    // indicated direction. Per Art. 5 accountability these are suggestions the
    // controller can override; numbers are ENISA-grounded with provenance.
    if (ENISA.mitigating_factors) {
      wrap.appendChild(el("h3", {}, ["Mitigating factors"]));
      wrap.appendChild(el("p", { class: "muted small" }, [ENISA.mitigating_factors.note]));
      ENISA.mitigating_factors.factors.forEach(function (m) {
        var mx = el("input", { type: "checkbox", id: "mit_" + m.key, onchange: function (e) { applyMitigant(m, e.target.checked); } });
        wrap.appendChild(el("div", { class: "opt" }, [mx, el("label", { for: "mit_" + m.key }, [m.label + "  [" + m.variable + " " + m.direction + "]"])]));
      });
    }
    function applyMitigant(m, on) {
      if (!on) { recalc(); return; }
      if (m.effect === "zero_confidentiality" || m.effect === "neutralise_confidentiality") s.cb.confidentiality = 0;
      else if (m.effect === "zero_availability") s.cb.availability = 0;
      else if (m.variable === "DPC" && m.direction === "decrease") s.dpc = Math.max(1, (s.dpc || 1) - 1); // whole-step, qualitative (not a decimal)
      else if (m.variable === "EI" && m.direction === "decrease") {
        var order = [0.25, 0.5, 0.75, 1.0]; var i = order.indexOf(s.ei != null ? s.ei : 1.0);
        s.ei = order[Math.max(0, i - 1)];
      } else if (m.variable === "CB" && m.direction === "decrease") s.cb.confidentiality = Math.max(0, (s.cb.confidentiality || 0) - 0.25);
      activeTab = "enisa"; render(); // re-render so the controller SEES the adjusted editable controls (not black-box)
    }
    var result = el("div", { class: "verdict", id: "enisa-result" });
    wrap.appendChild(result);
    if (ENISA.provenance) wrap.appendChild(el("p", { class: "muted small prov" }, ["Provenance: " + ENISA.provenance]));
    function recalc() {
      if (s.dpc == null || s.ei == null) return;
      var r = computeSeverity(s.dpc, s.ei, s.cb);
      state.severity = r;
      result.innerHTML = "";
      result.appendChild(el("div", { class: "score" }, [t("enisa.result") + ": ", el("b", {}, [String(r.se)]),
        "  -  " + t("enisa.band") + ": ", el("b", { class: "band-" + r.band.key }, [r.band.label])]));
      result.appendChild(el("div", { class: "banner " + (r.notify ? "alert" : "info") }, [r.notify ? t("enisa.trigger_on") : t("enisa.trigger_off")]));
      result.appendChild(el("div", { class: "muted small" }, [r.band.meaning]));
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
      state.form["field_90"] = "ENISA severity methodology: SE = DPC x EI + CB = " + state.severity.se +
        " (" + state.severity.band.label + "). " + state.severity.band.meaning;
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
    var labelText = f.label + (f.mandatory === "yes" ? " *" : "");
    var label = el("label", {}, [labelText]);
    if (f.gdpr_ref) label.appendChild(el("span", { class: "gdpr" }, [" [" + t("form.gdpr") + ": " + f.gdpr_ref + "]"]));
    row.appendChild(label);
    if (f.tooltip) row.appendChild(el("div", { class: "tooltip muted small" }, [f.tooltip]));
    var ctl;
    if (f.type === "enum" && f.options.length) {
      ctl = el("select", { onchange: function (e) { state.form[key] = e.target.value; } });
      ctl.appendChild(el("option", { value: "" }, ["--"]));
      f.options.forEach(function (o) {
        var op = el("option", { value: o.key }, [o.key + ") " + o.label]);
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
        ctl.appendChild(el("span", { class: "opt" }, [cb, el("label", { for: key + "_" + o.key }, [o.key + ") " + o.label])]));
      });
    } else if (f.type === "textarea") {
      ctl = el("textarea", { rows: "2", oninput: function (e) { state.form[key] = e.target.value; } });
      if (state.form[key]) ctl.value = state.form[key];
    } else if (f.type === "date" || f.type === "datetime") {
      ctl = el("input", { type: f.type === "date" ? "date" : "datetime-local", oninput: function (e) { state.form[key] = e.target.value; } });
      if (state.form[key]) ctl.value = state.form[key];
    } else if (f.type === "number") {
      ctl = el("input", { type: "number", min: "0", oninput: function (e) { state.form[key] = e.target.value; } });
    } else if (f.type === "boolean") {
      ctl = el("input", { type: "checkbox", onchange: function (e) { state.form[key] = e.target.checked; } });
    } else {
      ctl = el("input", { type: "text", oninput: function (e) { state.form[key] = e.target.value; } });
      if (state.form[key]) ctl.value = state.form[key];
    }
    if (f.visible_if) row.appendChild(el("div", { class: "cond muted small" }, ["⤷ " + f.visible_if]));
    row.appendChild(ctl);
    return row;
  }

  /* ---------- Record-keeping (PIPEDA-style, localStorage) ---------- */
  function getRecords() {
    try { return JSON.parse(localStorage.getItem("ebna_records") || "[]"); } catch (e) { return []; }
  }
  function viewRecord() {
    var wrap = el("section", { class: "card" }, [
      el("h2", {}, [t("record.title")]),
      el("p", { class: "muted" }, [t("record.intro")]),
    ]);
    // PIPEDA-style minimum fields (6) + 24-month retention note
    var rk = DATA.record_keeping;
    state.record = state.record || {};
    wrap.appendChild(el("p", { class: "muted small" }, ["Retention: " + rk.retention_months + " months. " + rk.retention_note]));
    rk.minimum_fields.forEach(function (mf) {
      var row = el("div", { class: "field" }, [el("label", {}, [mf.label])]);
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
        var sev = r.severity ? (r.severity.band.label + " / SE " + r.severity.se) : "n/a";
        list.appendChild(el("li", {}, ["#" + (i + 1) + " - " + r.saved_at + " - " + sev]));
      });
      wrap.appendChild(list);
      var bar = el("div", { class: "actions" }, [
        el("button", { onclick: function () { downloadJSON(recs, "breach-record.json"); } }, ["Export JSON"]),
        el("button", { onclick: function () { downloadText(registerCSV(recs), "breach-register.csv", "text/csv"); } }, ["Export CSV"]),
        el("button", { onclick: function () { downloadText(registerXLS(recs), "breach-register.xls", "application/vnd.ms-excel"); } }, ["Export XLS"]),
        el("button", { onclick: exportAggregate }, ["Export aggregate statistics (anonymised)"]),
      ]);
      wrap.appendChild(bar);
      wrap.appendChild(el("p", { class: "muted small" }, ["Aggregate export: anonymised counts by taxonomy, k-anonymity k=" + DATA.aggregate_transparency.k_default + " (small cells suppressed). No single-notification rows, no controller identity."]));
    }
    return wrap;
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
    return o ? (key + ") " + o.label) : key;
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
      nature_cia: n.field_55 ? optLabel(55, n.field_55) : "",
      incident_type: n.field_60 ? optLabel(60, n.field_60) : "",
      data_categories: mr.personal_information || (n.field_70 ? optLabel(70, n.field_70) : ""),
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
    function bump(map, key) { if (key == null || key === "") return; map[key] = (map[key] || 0) + 1; }
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
    if (params.tab && ["pre", "enisa", "form", "record"].indexOf(params.tab) >= 0) activeTab = params.tab;
    if (params.demo === "1") {
      state.pre = { isbreach: "yes", personaldata: "yes", risk: "yes", highrisk: "yes" };
      var demoCb = { confidentiality: 0.5, integrity: 0, availability: 0, malicious: true };
      state.enisa = { dpc: 4, ei: 1.0, cb: demoCb };
      state.severity = computeSeverity(4, 1.0, demoCb);
      state.record = { circumstances_cause: "Ransomware exfiltration of customer database.", date_or_period: "2026-06-15", personal_information: "Names, emails, payment methods.", number_affected: "~12,000", mitigation_steps: "Isolated systems, rotated credentials, engaged IR firm.", notification_steps: "Email to affected individuals scheduled." };
      state.form = { field_55: "a", field_60: "b", field_89: "a" };
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
