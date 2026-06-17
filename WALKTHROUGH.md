# Walkthrough - EDPB Breach Notification Assistant

> For Frank's review. To try it: open `dist/index.html` in any browser (works offline, double-click the file). Screenshots in `screenshots/`.

## In one line
A single offline web page that takes a controller from "did we have a breach?" to a ready-to-submit, GDPR-anchored EDPB notification - computing the ENISA severity score along the way and keeping an accountability record. **No backend, no network: breach data never leaves the device.**

## The 4 steps (tabs)

### 1. Pre-assessment - `screenshots/tab-pre.png`
An ICO-style triage decision tree: *is it a personal data breach? → does it involve personal data? → is there a risk? → a high risk?* As you answer, it tells you in plain language whether you likely must notify the authority (Art. 33) and/or the individuals (Art. 34). Makes the notify / don't-notify reasoning explicit and auditable.

### 2. ENISA severity - `screenshots/tab-enisa.png`
Computes `SE = DPC × EI + CB` and the band (Low / Medium / High / Very High). The example shown (sensitive data × max identifiability + confidentiality loss + malicious intent) scores **4.75 → Very High**, and the tool flags **"SE ≥ 2: notification path activated"**. The reproducible score is what you put in the template's "describe the methodology used" field. *Provenance note shown in-tool: only `SE < 2 = Low` is verbatim from the ENISA document; the upper bands are the standard consolidated ENISA bands - consistent with the position paper.*

### 3. EDPB notification - `screenshots/tab-form.png`
The full official template: **100 input fields across 7 sections**, each tagged with its **GDPR article** (e.g. `[GDPR: Art. 33(3)(a)]`) and its conditional-visibility rule. Severity and methodology fields are **prepopulated** from step 2. A button exports the notification as **JSON** - the same payload the open API accepts.

### 4. Breach record - `screenshots/tab-record.png`
A register of **all** breaches, including non-notifiable ones (GDPR Art. 33(5), modelled on Canada's PIPEDA), with the 6 minimum fields and a **24-month retention** note. Saved locally in the browser, exportable as JSON.

## Under the hood
- **Open API**: `api/openapi.yaml` (OpenAPI 3.1) for machine-to-machine submission from corporate systems to authorities, with 8 security-by-design (Art. 32) measures. A zero-dependency `mock-server/` lets anyone test the contract offline.
- **24 EU languages**: language selector; English complete, the other 23 progressively translated (English fallback). Enum values are language-independent, so the submitted payload is identical in every language.
- **License**: Apache-2.0 (code) + CC-BY-4.0 (content), attribution to **Nicola Franchetto and Martim Taborda Barata**. README states it is built for free adoption by data protection authorities.

## Status
Built and tested locally; **not pushed**. Awaiting Frank's go to publish on GitHub (NicklawAI, public, isolated). The EDPB template is in consultation - the tool carries a prominent disclaimer that it is not a live submission channel.
