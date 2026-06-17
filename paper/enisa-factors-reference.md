# Component 1b - ENISA factor values (detail)
**For:** tool (developer) + paper (legal) - exact factor values | **Prepared:** 17 June 2026 | research
**Source [PRIMARY]:** ENISA, *Recommendations for a methodology of the assessment of severity of personal data breaches*, v1.0, Dec 2013 - https://www.enisa.europa.eu/sites/default/files/publications/Data%20breach%20severity%20methodology_1.0.pdf
Each value marked **[verbatim PDF]** or **[standard, not verbatim from this PDF]**.

## Formula
**SE = DPC × EI + CB** [verbatim]. CB elements are **added** (verbatim: "the points obtained for each CB element are added").

## DPC - Data Processing Context
- Base scores [verbatim, Assessment Table 1]: **1 = simple**, **2 = behavioural**, **3 = financial**, **4 = sensitive**.
- **Volume factor [verbatim]: NO fixed numeric weight.** Verbatim: "The volume of the breached data (for the same individual): this factor *can increase* the basic DPC score… (acting as aggravating factor). The volume should be considered both in terms of time and content." → qualitative aggravating factor, **not** a fixed −0.25/−0.5. Documented adjustments in the Assessment Table are integer steps ("the DPC score could be decreased by 1").
- Other contextual factors [verbatim, qualitative - no fixed weight]: special characteristics of the controller (field of operation) ↑; vulnerability of data subjects ↑; public availability / invalidity-inaccuracy of data ↓.
- **Tool rule**: model DPC base as 1-4; contextual factors as justified qualitative adjustments capped within the 1-4 band - do NOT hardcode fractional volume weights.

## EI - Ease of Identification [verbatim, multiplicative on DPC]
- **0.25 Negligible** / **0.5 Limited** / **0.75 Significant** / **1 Maximum** [verbatim].
- Selection criteria (verbatim examples):
  - Full name: 0.25 if many share it → 1 if combined with date of birth + email.
  - Picture: 0.25 if unclear/vague (distant CCTV) → 1 if clear + linked to additional info.
  - Email: 0.25 if reveals no identity → 0.75 if used as a primary identifier.
  - Code/alias: 0.25 if not linkable → 0.75 if it reveals data about the individual.
  - Pseudonymisation/encryption lower EI; availability of a reference database enabling re-identification raises EI toward 1.

## CB - Circumstances of the Breach [verbatim, Annex 3]
- **Loss of confidentiality**: 0 (no evidence of illegal processing) / +0.25 / **+0.5** - graduated by scope of disclosure (publication to unknown recipients = +0.5).
- **Loss of integrity**: 0 (no identified incorrect/illegal use) / **+0.25** (altered, recoverable) / **+0.5** (altered, not recoverable).
- **Loss of availability**: 0 (recoverable without difficulty) / +0.25 / **+0.5** (full unavailability, not recoverable).
- **Malicious intent**: **+0.5** [verbatim].
- Rapid recovery → availability element = **0 baseline** (not a reduction of +0.25; the "recoverable without difficulty" band is 0).

## Severity bands
- **SE < 2 = Low** [verbatim]. Medium 2-<3 / High 3-<4 / Very High ≥4 [standard, not verbatim from this PDF - see Component 1 caveat].

*Research Agent | 17 June 2026 - extends component-1-enisa-severity.md*
