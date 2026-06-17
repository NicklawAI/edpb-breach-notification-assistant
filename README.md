# A Position Paper on the EDPB Personal Data Breach Notification Template

**A response to the EDPB public consultation** on the *Template for the notification of personal data breaches under Article 33 GDPR* (v1.0, adopted 8 June 2026; consultation open until **5 August 2026**).

**Authors:** Nicola Franchetto  and Martim Taborda Barata (Attorneys-at-law).
**Licence:** the position paper and its technical artefacts are released under **CC BY 4.0** - intended for **free adoption by Data Protection Authorities and EU institutions**. The authors ask only to be credited.

> **Status: consultation draft - pending co-author review.** The canonical versions are the Google Docs linked below; the Markdown snapshots in [`paper/`](paper/) are versioned here for citation. Not for formal circulation until finalised.

---

## We ship a reference implementation, not only a critique

This repository contains **two things**:

1. **The position paper** - [English](paper/position-paper.en.md) · [Italiano](paper/position-paper.it.md) · [canonical EN Google Doc](https://docs.google.com/document/d/1j_EviybY26zvKFckELPB5nwFt1pk5HhGxEYK4EcUaQA) · [20-proposal synthesis](paper/20-proposals.md)
2. **A working open-source tool** - the the EDPB Breach Notification Assistant, a reference implementation of the paper's technical proposals (machine-readable schema, ENISA scoring, open API). Open [`dist/index.html`](dist/index.html) in any browser - it runs **offline**, no backend, breach data never leaves your device.

## The 20 proposals (synthesis)

The paper endorses the template's strengths and proposes 20 additive improvements, drawn from a comparison with mature regimes (UK, Australia, California, Canada) and standards (ENISA, ISO/IEC 27035). Five headline recommendations:

1. **Anchor severity to ENISA** and let it be **machine-computed** from structured inputs (DPC/EI/CB; SE ≥ 2 threshold).
2. Add a guided **pre-assessment** and a simplified **SME track** to cut defensive over-notification.
3. Give operational shape to the **Article 33(5) breach register** (Canadian model) and align the vocabulary with **ISO/IEC 27035**.
4. Publish the template as a **machine-readable JSON Schema with a language-independent controlled vocabulary**, plus an optional secure **machine-to-machine channel** - implemented here.
5. Design it **forward-compatibly** with the Digital Omnibus single entry point and the **NIS2/DORA staged timelines**.

Full list: [`paper/20-proposals.md`](paper/20-proposals.md).

## The reference tool

| Component | What it does |
|---|---|
| Pre-assessment | ICO-style triage: is it a breach? → risk? → notify the authority? → individuals? |
| ENISA severity | `SE = DPC × EI + CB` with editable mitigating factors (Art. 5 accountability), graduated CB per ENISA Annex 3 |
| EDPB notification | The full template (100 fields, GDPR-anchored), prepopulated; exports the JSON payload |
| Breach register | All breaches incl. non-notifiable (Art. 33(5) / PIPEDA), 24-month retention; export **JSON / CSV / XLS** |
| Open API | OpenAPI 3.1 for M2M submission, 8 Article-32 security measures, mock server - [`api/`](api/) |
| 24 EU languages | Stable enum keys → the transmitted payload is identical in every language |

## Adhere to the proposal

If you work in data protection - a DPO, a lawyer, a supervisory authority - you can **add your name in support** in two clicks:

➡️ **[Open an adhesion](../../issues/new?template=adhere.yml)** (a short form: name, role, organisation, country). Your adhesion is recorded in [`SIGNATORIES.md`](SIGNATORIES.md). No git knowledge required.

Developers can also fork, open issues, or contribute to the tool.

## Licence & attribution

- **Code:** Apache-2.0 ([`LICENSE`](LICENSE)).
- **Paper, schema, content:** CC BY 4.0 ([`LICENSE-CONTENT`](LICENSE-CONTENT)).
- Please credit **Nicola Franchetto and Martim Taborda Barata** ([`NOTICE`](NOTICE)).

## Reproducibility

The paper snapshots regenerate from the canonical Google Docs via [`paper/build-paper.sh`](paper/build-paper.sh) - no manual editing, no drift. The field schema is extracted cell-by-cell from the official EDPB `.docx` (double-parsed, reconciled, GDPR-anchored).
