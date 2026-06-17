<!-- AUTO-GENERATED from the canonical Google Doc. Do not edit by hand; run paper/build-paper.sh. -->
> **CONSULTATION DRAFT - 2026-06-17** - pending co-author review. The canonical, authoritative version is the Google Doc linked below. This snapshot is versioned in the repository for citation and reproducibility.
> Canonical EN: see README "Position paper" links.


# **A Position Paper on the EDPB Template for Personal Data Breach Notification under Article 33 GDPR** {#a-position-paper-on-the-edpb-template-for-personal-data-breach-notification-under-article-33-gdpr}

**Public consultation response** \- EDPB "Template for the notification of personal data breaches under Article 33 GDPR", version 1.0, adopted 8 June 2026 (121st plenary), published 10 June 2026\. Consultation open until **5 August 2026**.

**Authors**: Nicola Franchetto and Martim Taborda Barata (Attorneys-at-law)

**Licence**: This position paper and the accompanying technical artefacts (JSON Schema, field catalogue, OpenAPI specification) are released under **Creative Commons Attribution 4.0 International (CC BY 4.0)**. They are intended for **free adoption by Data Protection Authorities and EU institutions** without restriction. See Section VI.

**Date**: June 2026\. **Status**: draft for internal validation before submission.

[A Position Paper on the EDPB Template for Personal Data Breach Notification under Article 33 GDPR](#a-position-paper-on-the-edpb-template-for-personal-data-breach-notification-under-article-33-gdpr)

[Executive summary](#executive-summary)

[Part I \- General comments](#part-i---general-comments)

[1\. Overall assessment (positive)](#1.-overall-assessment-\(positive\))

[2\. Proportionality toward SMEs (a stated target audience)](#2.-proportionality-toward-smes-\(a-stated-target-audience\))

[3\. A guided pre-assessment stage (ICO model)](#3.-a-guided-pre-assessment-stage-\(ico-model\))

[4\. Severity assessment: anchor the methodology field to ENISA (with a stated threshold)](#4.-severity-assessment:-anchor-the-methodology-field-to-enisa-\(with-a-stated-threshold\))

[5\. Misalignment of severity scales](#5.-misalignment-of-severity-scales)

[6\. Channel versus format](#6.-channel-versus-format)

[Part II \- Section-by-section comments](#part-ii---section-by-section-comments)

[Section 1 \- Notification type](#section-1---notification-type)

[Section 2 \- Controller and notifier](#section-2---controller-and-notifier)

[Section 3 \- Initial breach information](#section-3---initial-breach-information)

[Section 4 \- Further information (the assessment core)](#section-4---further-information-\(the-assessment-core\))

[Section 5 \- Communication to data subjects](#section-5---communication-to-data-subjects)

[Section 6 \- Other aspects (cross-border, other authorities)](#section-6---other-aspects-\(cross-border,-other-authorities\))

[Section 7 \- Attachments](#section-7---attachments)

[Part III \- Comparison with international best practice and derived proposals](#part-iii---comparison-with-international-best-practice-and-derived-proposals)

[III.1 \- Italy (Garante): transition from a national form to the common template](#iii.1---italy-\(garante\):-transition-from-a-national-form-to-the-common-template)

[III.2 \- UK (ICO): the guided self-assessment](#iii.2---uk-\(ico\):-the-guided-self-assessment)

[III.3 \- Australia (OAIC) and Singapore (PDPC): public/confidential separation and clear triggers](#iii.3---australia-\(oaic\)-and-singapore-\(pdpc\):-public/confidential-separation-and-clear-triggers)

[III.4 \- USA (California AG, FTC HBNR): transparency and sectoral models](#iii.4---usa-\(california-ag,-ftc-hbnr\):-transparency-and-sectoral-models)

[III.5 \- Canada (OPC/PIPEDA): record-keeping of all breaches](#iii.5---canada-\(opc/pipeda\):-record-keeping-of-all-breaches)

[III.6 \- International standards: aligning with ISO/IEC 27035](#iii.6---international-standards:-aligning-with-iso/iec-27035)

[III.7 \- Comparative value summary](#iii.7---comparative-value-summary)

[Part IV \- Machine-readable standardisation and an optional M2M channel](#part-iv---machine-readable-standardisation-and-an-optional-m2m-channel)

[IV.1 \- The proposal](#iv.1---the-proposal)

[IV.2 \- Policy arguments](#iv.2---policy-arguments)

[IV.3 \- Voluntariness and proportionality](#iv.3---voluntariness-and-proportionality)

[IV.4 \- Security of the channel (Article 32 by design)](#iv.4---security-of-the-channel-\(article-32-by-design\))

[IV.5 \- Forward-compatibility with the Digital Omnibus single reporting entry point](#iv.5---forward-compatibility-with-the-digital-omnibus-single-reporting-entry-point)

[IV.6 \- Multilingual consistency of the controlled vocabulary](#iv.6---multilingual-consistency-of-the-controlled-vocabulary)

[IV.7 \- Reference implementation (annex)](#iv.7---reference-implementation-\(annex\))

[Part V \- Summary of proposals](#part-v---summary-of-proposals)

[Part VI \- Licence and free adoption](#part-vi---licence-and-free-adoption)

## Executive summary {#executive-summary}

The EDPB template is a substantial step toward harmonising Article 33 breach notifications across the EU. This paper endorses its core strengths \- a common 25-incident taxonomy, embedded conditional logic, and a developed cross-border section \- and proposes a set of incremental, additive improvements drawn from a comparative analysis of mature notification regimes (UK, Australia, Singapore, USA, Canada) and international standards (ENISA, ISO/IEC 27035).

The paper develops four ideas in particular: (1) a **guided pre-assessment** stage, modelled on the ICO approach, that triages and pre-populates the template; (2) explicit anchoring of the severity field to the **ENISA Severity Assessment** methodology, with a stated relevance threshold; (3) a **breach record-keeping** structure modelled on the Canadian PIPEDA regime, giving operational shape to the Article 33(5) documentation duty; and (4) alignment of the template's incident vocabulary and lifecycle with **ISO/IEC 27035**. It also proposes the standardisation of a machine-readable schema and an optional machine-to-machine submission channel, with a reference open-source implementation released under CC BY 4.0. The paper also goes beyond critique: it includes a working reference implementation (JSON Schema, controlled vocabulary, GDPR field-to-article map) as a non-binding CC BY 4.0 annex, which the EDPB and DPAs are free to adopt.

**Five key recommendations:**

1. Anchor the severity field to the ENISA methodology (treating the SE \>= 2 line as an indicative operational threshold, without prejudice to the case-by-case assessment under Articles 33 and 34 GDPR) and allow a proposed severity band to be computed from the controller's declared ENISA inputs.  
2. Add a guided **pre-assessment** stage and a simplified **SME track** to reduce burden and defensive over-notification.  
3. Give operational shape to the **Article 33(5) breach register** on the Canadian model, and align the incident vocabulary with **ISO/IEC 27035**.  
4. Publish the template as a **machine-readable JSON Schema with a controlled, language-independent vocabulary**, with an optional secure **M2M channel** \- a reference implementation is annexed.  
5. Treat multi-regime interoperability as a design goal, aligning the template with the NIS2 and DORA staged timelines now in force, so one structured submission can serve multiple regimes. (Forward-compatibility with the proposed, not-yet-adopted Digital Omnibus single entry point is addressed separately as future-proofing, in Part IV.5.)

## Part I \- General comments {#part-i---general-comments}

### 1\. Overall assessment (positive) {#1.-overall-assessment-(positive)}

The template is a meaningful advance toward a harmonised Article 33 notification format. Three features deserve explicit praise:

- A **common taxonomy of 25 incident types** plus a four-quadrant cause classification (internal/external × malicious/non-malicious): for the first time, a shared European vocabulary that reduces the heterogeneity of notifications and enables comparable aggregate statistics across DPAs.  
- **Embedded conditional logic**, in particular the delay-justification field auto-triggered beyond 72 hours (Article 33(1)) and the Article 34(3) exemptions coded as structured options: procedural compliance is guided by the form itself.  
- A **developed cross-border section** (lead supervisory authority under Article 56, establishment countries, data subjects per country, EEA DPA list): it answers a real need of multi-country groups, who today face different forms in different languages with different taxonomies during the most critical 72 hours.

### 2\. Proportionality toward SMEs (a stated target audience) {#2.-proportionality-toward-smes-(a-stated-target-audience)}

The EDPB lists SMEs among the template's addressees. A form of **126 rows (100 input fields)** across seven sections, however conditional, can be daunting for a small undertaking without a structured privacy function, especially during the 72 hours of incident handling.

**Proposal**: introduce a **simplified "SME track"** that, in the first instance, exposes only the minimum subset required by Article 33(3) GDPR (nature; categories and approximate number of data subjects and records; likely consequences; measures taken or proposed), deferring the detail fields to a follow-up stage. The conditional logic already present makes this feasible without a second form. This proposal is complementary to the guided pre-assessment in Section 3 and the machine-readable channel in Part IV: SMEs use the lightweight path, structured organisations use automation.

### 3\. A guided pre-assessment stage (ICO model) {#3.-a-guided-pre-assessment-stage-(ico-model)}

The UK ICO embeds a **self-assessment tool** that helps an organisation decide whether a breach must be reported at all, alongside published examples and a distinction between above- and below-threshold breaches. The ICO self-assessment is a guided decision tree (is it a breach? → risk? → report to the ICO? → inform data subjects? → document) ([ico.org.uk/for-organisations/report-a-breach/personal-data-breach-assessment/](http://ico.org.uk/for-organisations/report-a-breach/personal-data-breach-assessment/)).

A reportable-breach determination under Article 33 GDPR is itself a legal judgement made under time pressure. A guided pre-assessment, sitting **upstream of the template**, would: (a) triage whether the Article 33 notification duty arises (risk to rights and freedoms) and whether the Article 34 communication duty arises (high risk); (b) reduce defensive/precautionary over-notification, which burdens DPAs and dilutes the signal; and (c) **pre-populate** the template with the inputs already gathered during the triage (data categories, identifiability, C-I-A nature, cause), so that the controller does not re-enter the same information twice.

**Proposal**: the EDPB should accompany the template with a **guided pre-assessment** \- a short decision flow that determines the existence of the notification/communication duties and carries its inputs forward into the template. The reference open-source implementation (Part IV.7 / Section VI) includes such a pre-assessment as a first step, demonstrating the feasibility of a single triage-to-notification flow. The pre-assessment should also surface the mitigating factors that lower the ENISA severity score (and the assessment effort) in the concrete case \- for example, a breach affecting a single data subject, or a wrong-recipient case where the recipient has confirmed deletion of the data \- so that the controller is not driven to over-notify where the residual risk is in fact low. The reference implementation (Part IV.7) operationalises this as an explicit, non-exhaustive set of mitigating factors \- a single data subject (lowering the DPC), a wrong recipient confirming deletion, a common name or homonymy reducing identifiability, strong encryption or data rendered unintelligible, pseudonymisation without an accessible key, a recipient bound by professional secrecy, prompt restoration of availability from backup, or data already public or of low criticality \- each shown as an editable adjustment to the relevant ENISA variable (DPC / EI / CB) rather than a hidden score, consistent with the controller's accountability under Article 5 GDPR.

### 4\. Severity assessment: anchor the methodology field to ENISA (with a stated threshold) {#4.-severity-assessment:-anchor-the-methodology-field-to-enisa-(with-a-stated-threshold)}

The template asks the controller to "describe the methodology used and the relevant factors" (field 90\) but **does not indicate a reference methodology**, while offering a three-level severity scale (Minor / Moderate / Severe). This leaves an assessment perceived as subjective and inconsistent across controllers.

The **ENISA Severity Assessment** methodology is the de facto European standard for quantifying breach severity. Its formula is **SE \= DPC × EI \+ CB**, where DPC is the Data Processing Context, EI the Ease of Identification, and CB the Circumstances of the Breach, yielding four bands: low / medium / high / very high (ENISA Working Document v1.0, December 2013, developed by ENISA with the Greek and German DPAs \- [enisa.europa.eu/publications/dbn-severity](http://enisa.europa.eu/publications/dbn-severity);  PDF: [enisa.europa.eu/sites/default/files/publications/Data%20breach%20severity%20methodology\_1.0.pdf](http://enisa.europa.eu/sites/default/files/publications/Data%20breach%20severity%20methodology_1.0.pdf)).

A material point of clarity on the threshold of relevance. Under the ENISA methodology, a severity score **below 2 corresponds to "Low"** \- verbatim, *"individuals either will not be affected or may encounter a few inconveniences, which they will overcome without any problem"* \- whereas a score of 2 or above corresponds, on the ENISA scale, to the "Medium and above" bands (described by ENISA as ranging from significant inconveniences to significant or even irreversible consequences). This SE \>= 2 line should be read as an indicative operational threshold, not as a normative cut-off: ENISA is not the GDPR, and the risk to the rights and freedoms of natural persons under Article 33 GDPR does not automatically coincide with an ENISA score of 2 or above. The methodology supports, but does not replace, the controller's case-by-case legal assessment under Articles 33 and 34 GDPR. In the formula, the DPC base score reflects the criticality of the data (1 \= simple, 2 \= behavioural, 3 \= financial, 4 \= sensitive), EI is a multiplicative correction for ease of identification \- not an absolute value, but a factor to be modulated by the mitigating circumstances of the concrete case (for instance, a data subject's homonymy may make singling-out harder and therefore lower the EI) \- and CB adds the circumstances of the breach. Anchoring field 90 to this methodology gives controllers a reproducible, defensible result and gives DPAs a common, citable scale, while the legal qualification of the breach remains a case-by-case assessment under Articles 33 and 34 GDPR. This case-by-case modulation is not theoretical: the EDPB already applies it in its Guidelines 01/2021 on examples of breach notification, where the mitigating factors drive the outcome. In Case 1 (a ransomware attack with an intact backup, no exfiltration and data that remained encrypted) the residual risk is low and notification may not even be required, whereas in Case 3 (a ransomware attack on a hospital, with thousands of affected patients and postponed procedures, echoing real-world large-scale healthcare ransomware incidents in the EU) the risk is high and triggers both DPA notification and communication to data subjects. These mitigating factors map directly onto template fields 57 (data rendered unintelligible / encrypted) and 74-76 (security measures in place). \[EDPB Guidelines 01/2021 on examples regarding personal data breach notification, adopted 14 December 2021: [edpb.europa.eu/system/files/2022-01/edpb\_guidelines\_012021\_pdbnotification\_adopted\_en.pdf](http://edpb.europa.eu/system/files/2022-01/edpb_guidelines_012021_pdbnotification_adopted_en.pdf)\].

**Proposal**: without mandating a single methodology, the EDPB should (a) reference ENISA SEV as the recommended methodology in the explanatory notes to field 90, stating the SE \>= 2 indicative operational threshold (without prejudice to the controller's case-by-case legal assessment under Articles 33 and 34 GDPR); (b) provide an indicative mapping between the four ENISA bands (low / medium / high / very high) and the template's three levels (e.g. low → Minor; medium → Moderate; high and very high → Severe); and (c) allow the controller to submit the **ENISA inputs (DPC, EI, CB) as structured fields**, so that a proposed severity band is computed from the controller's declared inputs (DPC, EI and CB remain qualitative judgments of the controller, not an automated or objective risk assessment) and is comparable across notifications and DPAs **\- enabling EDPB-level analytics on breach severity and closing the loop with the pre-assessment in Section 3 (the computed value pre-populates the template). Standardising these values would also help the EDPB and all supervisory authorities to update the EDPB guidelines on examples of data breaches and to obtain more comparable values autonomously from controllers, without prejudice to the controller's responsibility for the values it declares (accountability under Article 5 GDPR). More comparable values also strengthen the cooperation mechanism between supervisory authorities and the consistency of application of Articles 33 and 34 GDPR: today, for various reasons, different Authorities may reach different conclusions on equivalent events or incidents, and a standardised, comparable severity input reduces that divergence.**

### 5\. Misalignment of severity scales {#5.-misalignment-of-severity-scales}

The template uses **three levels** (Minor/Moderate/Severe), while ENISA uses **four** and many organisations use internal scales. Those already operating on ENISA or on four/five-level scales will have to remap, with a risk of lost granularity and inconsistency.

**Proposal**: clarify in the notes the relationship between the template's three levels and the commonly used scales, or consider adopting a four-level scale aligned with ENISA, the most widespread assessment tool.

### 6\. Channel versus format {#6.-channel-versus-format}

The template harmonises the **format**, not the **channel**: the notification is still addressed to the competent national DPA (in Italy, the Garante via servizi.gpdp.it). The EDPB's accompanying communication should **state clearly** that the template does not establish a single European one-stop submission point, to avoid the expectation of a centralised channel. (Comparison with the Italian 2021 telematic tool and other DPAs in Part III.)

## Part II \- Section-by-section comments {#part-ii---section-by-section-comments}

### Section 1 \- Notification type {#section-1---notification-type}

- **Formal withdrawal** of a notification: a positive novelty (duplicate, or risk excluded after assessment). *Proposal*: add a structured field for the withdrawal reason (duplicate / risk reassessed as unlikely / filing error), useful for statistics and accountability.

### Section 2 \- Controller and notifier {#section-2---controller-and-notifier}

- The dedicated **processor / joint-controller** field is welcome. *Proposal*: add a flag indicating whether the breach was detected by the processor and notified to the controller under Article 33(2), with the relevant date, to reconstruct the awareness chain relevant to the 72-hour clock.

### Section 3 \- Initial breach information {#section-3---initial-breach-information}

- The **delay-justification field auto-triggered beyond 72h** is an excellent embedding of Article 33(1). *Caution*: ensure the clock starts from the controller's "awareness", not the date of the breach, and that the field handles phased (preliminary) notification without penalising those who notify promptly but incompletely.  
- The **C-I-A triad with sub-qualifications** (e.g. confidentiality: exfiltrated / likely exfiltrated / not exfiltrated with evidence) is solid and consistent with Guidelines 9/2022.  
- The **encryption/intelligibility field** with an intermediate "measures present but likely circumventable" option is realistic and useful. *Proposal*: explicitly connect this field to the Article 34(3)(a) exemption in the conditional logic, so that a declaration of effective encryption pre-fills/orients Section 5 on communication to data subjects.  
- **Data-subject categories with flags for minors and vulnerable persons**: welcome, consistent with Recital 75\.

### Section 4 \- Further information (the assessment core) {#section-4---further-information-(the-assessment-core)}

- Severity \+ risk-assessment outcome fields: see Sections 4-5 of Part I. *Proposal*: make explicit in the form the link between the risk-assessment outcome (high risk / risk / unlikely risk) and the obligations that follow (Article 33 notification to the DPA / Article 34 communication to data subjects), with contextual guidance.

### Section 5 \- Communication to data subjects {#section-5---communication-to-data-subjects}

- The **Article 34(3) exemptions as structured options** are excellent codification. *Proposal: for exemption (c) (disproportionate effort → public communication), add a field describing the public-communication method adopted, to support accountability. The EDPB could go further and indicate in advance the acceptable modalities of public communication \- for example a dedicated FAQ or notice published on the controller's website \- so that controllers relying on exemption (c) have a clear and harmonised reference.*

### Section 6 \- Other aspects (cross-border, other authorities) {#section-6---other-aspects-(cross-border,-other-authorities)}

- The **interaction with NIS / other authorities** field is useful and timely, given the growing overlap between GDPR notifications and NIS2/DORA notifications for the same incident. *Proposal*: include an explicit reference to coordination with notifications due to other authorities for the same event (NIS2, DORA, sectoral authorities), to reduce duplicated effort and signal the plurality of obligations. **Timeline interoperability with NIS2**: GDPR uses a single 72-hour notification, whereas NIS2 (Article 23\) uses a staged 24-hour early warning → 72-hour notification → one-month final report. The template already supports preliminary/complete/follow-up sub-types (fields 3-4); the EDPB could explicitly **map these sub-types onto the NIS2 staging**, so an entity in scope of both files a coherent, non-duplicative sequence \- a concrete SME-relief measure. \[NIS2 Dir. (EU) 2022/2555, Art. 23: [eur-lex.europa.eu/eli/dir/2022/2555/oj](http://eur-lex.europa.eu/eli/dir/2022/2555/oj)\]. A parallel staged regime exists under DORA for major ICT-related incidents (Article 19 of Regulation (EU) 2022/2554): an initial notification within 4 hours of classification as major (and within 24 hours of awareness), an intermediate report within 72 hours, and a final report within one month (RTS (EU) 2025/301 and ITS (EU) 2024/2956). For an entity in scope of both GDPR and DORA, a single personal-data breach occurring within an ICT incident can trigger two parallel reporting tracks with different timelines and taxonomies; mapping the template's preliminary/complete/follow-up sub-types onto these staged regimes would reduce misaligned double reporting. This alignment is specific to entities in scope of both regimes \- DORA is sectoral, applying to financial entities \- and is not a general rule.  
- **Non-EEA controllers without an establishment** (Article 3(2) GDPR): the need to notify every DPA of the countries where data subjects are located, absent a one-stop-shop, remains a significant burden. The template handles it well by including the DPA list, but the underlying fragmentation is a systemic matter beyond the template. The doctrinal basis for these extra-EEA fields (around 119-123) is paragraph 73 of the EDPB Guidelines 9/2022 on personal data breach notification (v2.0), whose key update concerns precisely the notification obligations for breaches at establishments outside the EU: a non-EEA controller without a main establishment must notify each supervisory authority concerned. \[EDPB Guidelines 9/2022 v2.0, para 73: [edpb.europa.eu/system/files/2023-04/edpb\_guidelines\_202209\_personal\_data\_breach\_notification\_v2.0\_en.pdf](http://edpb.europa.eu/system/files/2023-04/edpb_guidelines_202209_personal_data_breach_notification_v2.0_en.pdf)\]  (Developed in Part III.)

### Section 7 \- Attachments {#section-7---attachments}

- The typed attachment list (copy of the communication to data subjects, risk assessment, ransomware note, phishing message) is practical and useful to investigations. *Proposal*: add guidance on accepted format and maximum size, to avoid divergence across DPA implementations.

## Part III \- Comparison with international best practice and derived proposals {#part-iii---comparison-with-international-best-practice-and-derived-proposals}

The template can selectively absorb mature practices from other regimes, each anchored to a verifiable primary source.

### III.1 \- Italy (Garante): transition from a national form to the common template {#iii.1---italy-(garante):-transition-from-a-national-form-to-the-common-template}

Since 1 July 2021 the Italian DPA has operated a structured telematic procedure (provv. 27/5/2021, docweb 9667201), the sole ordinary channel, with a preliminary/complete logic and automatic reminders \- the same complete/incomplete/follow-up mechanism later taken up by the EDPB template. Italy was therefore already ahead, and the step for Italian controllers will be modest. \[[garanteprivacy.it/home/docweb/-/docweb-display/docweb/9667201](http://garanteprivacy.it/home/docweb/-/docweb-display/docweb/9667201)\];   [servizi.gpdp.it/databreach](http://servizi.gpdp.it/databreach)\]. 

Italy is not an isolated case. Several DPAs operated a dedicated national breach-notification channel before the EDPB template, so the template largely harmonises pre-existing national practice rather than creating it ex novo.   
France (CNIL) in particular already uses the same two-phase logic \- an initial notification within 72 hours followed by a supplementary one, on a form that can be saved and completed in stages \[[cnil.fr/fr/services-en-ligne/notifier-une-violation-de-donnees-personnelles](http://cnil.fr/fr/services-en-ligne/notifier-une-violation-de-donnees-personnelles)\]. 

Spain (AEPD, online form on its sede electronica), the Netherlands (AP, the Meldloket datalekken portal) and Ireland (DPC, online breach webform \[[dataprotection.ie/en/organisations/know-your-obligations/breach-notification](http://dataprotection.ie/en/organisations/know-your-obligations/breach-notification)\]) likewise provide dedicated pre-existing national portals (EDPB hub, 'How to notify a data breach to your DPA': [edpb.europa.eu/notify-data-breach\_en](http://edpb.europa.eu/notify-data-breach_en)). The template's preliminary/complete logic therefore codifies a converging practice already established in the most active jurisdictions.

**Observation**: the common template harmonises the format, but DPAs that already have their own tool will need a transition phase. The EDPB should indicate a timeline and a coexistence period to avoid misalignment between the new format and existing national portals.

### III.2 \- UK (ICO): the guided self-assessment {#iii.2---uk-(ico):-the-guided-self-assessment}

The ICO integrates a **self-assessment decision tree** guiding the "notify or not" decision (is it a personal data breach? → is there a risk? → report to the ICO? → inform the data subjects? → document), plus published examples and an above/below-threshold distinction. \[[ico.org.uk/for-organisations/report-a-breach/personal-data-breach-assessment/](http://ico.org.uk/for-organisations/report-a-breach/personal-data-breach-assessment/)\].

This is the source of the pre-assessment proposal in Part I, Section 3\.

### III.3 \- Australia (OAIC) and Singapore (PDPC): public/confidential separation and clear triggers {#iii.3---australia-(oaic)-and-singapore-(pdpc):-public/confidential-separation-and-clear-triggers}

- **OAIC (Australia)** uses a **two-part form**: Part 1 (statement) holds the information that must also be communicated to individuals; Part 2, optional, may be kept confidential by the regulator \- an explicit separation between public information and confidential information toward the authority. \[[oaic.gov.au/privacy/notifiable-data-breaches/report-a-data-breach](http://oaic.gov.au/privacy/notifiable-data-breaches/report-a-data-breach)\]  
- **PDPC (Singapore)** uses an **explicit dual threshold**: significant harm OR a numeric scale (≥500 individuals). \[[pdpc.gov.sg/report-data-breach](http://pdpc.gov.sg/report-data-breach)\]

**Proposal (OAIC)**: the template does not clearly distinguish which fields are intended also for communication to data subjects (Article 34 GDPR) and which are reserved to the regulator. Adopting a **two-tier structure on the OAIC model** \- a "communicable to data subjects" core and a "reserved to the DPA" tier \- would make the template usable both for the Article 33 notification and, in part, for the Article 34 communication, reducing duplicated work in the 72 hours.

### III.4 \- USA (California AG, FTC HBNR): transparency and sectoral models {#iii.4---usa-(california-ag,-ftc-hbnr):-transparency-and-sectoral-models}

- **California AG**: those notifying more than 500 California residents must send a sample of the notice to the AG, which maintains a **public, searchable database** of notifications and provides an official consumer-notice template. \[[oag.ca.gov/privacy/databreach/list](http://oag.ca.gov/privacy/databreach/list)\]   
- **FTC Health Breach Notification Rule** (16 CFR Part 318): a sectoral model for health data outside HIPAA (PHR vendors, health apps), relevant to the EHDS/wearables interface. \[[ftc.gov/business-guidance/resources/complying-ftcs-health-breach-notification-rule-0](http://ftc.gov/business-guidance/resources/complying-ftcs-health-breach-notification-rule-0)\].

**Proposal (California) \[concrete model\]: the EDPB should accompany the template with a concrete transparency model \- a periodically published, aggregate and anonymised statistical dataset of notifications, derived directly from the template's controlled vocabulary. Concretely, for breaches whose risk assessment results in notification, the model aggregates a defined subset of structured fields: incident type (the 25-type taxonomy), cause quadrant (internal/external x malicious/non-malicious), data categories (a-u), severity band, sector (NACE), the number of affected data subjects bracketed into ranges rather than exact figures, and whether Article 34 communication was required. Granularity is counts per category over a reporting period (for example quarterly or annual), never at the level of an individual notification. Anonymisation guarantees: no controller identity, no free-text fields, no dates finer than the reporting period, and small-cell suppression or k-anonymity (a minimum cell count, with k \>= 5 as a recommended default) so that no notification or controller is re-identifiable. Because every field is drawn from the template's controlled vocabulary, the statistics are comparable across DPAs by construction, turning the taxonomy into a pan-European evidence base for transparency and research, on the model of the California Attorney General's public breach database. A reference schema for this aggregate model is released with the technical annex (Part IV.7).**

### III.5 \- Canada (OPC/PIPEDA): record-keeping of all breaches {#iii.5---canada-(opc/pipeda):-record-keeping-of-all-breaches}

The Canadian regime (Breach of Security Safeguards Regulations, **SOR/2018-64**) requires **mandatory record-keeping of ALL breaches** \- including those below the notification threshold (Real Risk of Significant Harm) \- retained for a minimum of **24 months** from the day the organisation determines the breach occurred, with detail sufficient to allow the authority to verify that the risk was properly assessed. \[[laws-lois.justice.gc.ca/eng/regulations/SOR-2018-64/index.html](http://laws-lois.justice.gc.ca/eng/regulations/SOR-2018-64/index.html); OPC guidance: [priv.gc.ca/en/privacy-topics/business-privacy/breaches-and-safeguards/privacy-breaches-at-your-business/gd\_pb\_201810/](http://priv.gc.ca/en/privacy-topics/business-privacy/breaches-and-safeguards/privacy-breaches-at-your-business/gd_pb_201810/)\].

**Proposal (Canada) \[NEW, strong\]**: Article 33(5) GDPR already requires the controller to document all breaches (including those not notified), but in generic terms \- without prescribing a formal register, a retention period, or a level of detail. The Canadian model (structured register, minimum 2-year retention, detail sufficient for regulator verification) offers a concrete benchmark. The EDPB could **give operational shape to the Article 33(5) GDPR documentation duty using the Canadian record-keeping model**: alongside the notification template, offer a model internal-register structure aligned with the template's fields. A controller who has completed the template already holds most of an Article 33(5) record. Suggested register fields, on the Canadian model: incident reference and date (or period); circumstances and cause of the breach (if known); nature (C-I-A); incident type (template taxonomy); data categories and approximate numbers; risk-assessment outcome and methodology (ENISA SE value), including where the conclusion was "no high risk"; whether notified to the DPA and to data subjects (and, if not, the reasoned basis); measures taken; retention of the record for a minimum of 24 months. The link strengthens accountability and reduces defensive notification (the controller documents internally rather than notifying as a precaution). This register is not merely proposed but also made available: the reference implementation (Part IV.7) includes a downloadable internal-register model (CSV / XLS export) that implements exactly these fields, so that a controller can adopt it directly.

### III.6 \- International standards: aligning with ISO/IEC 27035 {#iii.6---international-standards:-aligning-with-iso/iec-27035}

The **ISO/IEC 27035-1:2023** standard (information security incident management \- principles and process) defines a recognised incident-management **lifecycle and vocabulary**: Plan & Prepare → Detect → Report → Assess → Respond → Learn Lessons. \[[iso.org/standard/78973.html](http://iso.org/standard/78973.html) \- ISO/IEC 27035-1:2023\].

An important clarification: ISO/IEC 27035 provides a **process lifecycle and a terminology**, not a closed taxonomy of breach types equivalent to the template's 25 incident types. The value is therefore **process and terminology alignment**, not a one-to-one type mapping.

**Proposal (ISO)**: the EDPB could reference ISO/IEC 27035 as the interoperability anchor for the incident lifecycle and vocabulary, so that a controller's internal incident-management process \- frequently already ISO 27035 / ISO 27001-aligned \- feeds the GDPR notification without a parallel re-classification. The point is best framed as interoperability and machine-readability (a controller's existing security-operations terminology should map cleanly onto the notification), rather than as a literal type-for-type correspondence. *(The full normative text of ISO/IEC 27035 is paywalled; references should cite the standard by number and clause without reproducing protected text.)*

### III.7 \- Comparative value summary {#iii.7---comparative-value-summary}

The template, already solid, can selectively absorb four mature best practices: public/confidential separation (OAIC), guided self-assessment (ICO), the link to the internal Article 33(5) record (Canada), and the anchoring of the taxonomy to an international standard (ISO 27035). These are incremental enhancements, not rewrites, all consistent with the current design.

## Part IV \- Machine-readable standardisation and an optional M2M channel {#part-iv---machine-readable-standardisation-and-an-optional-m2m-channel}

In its 1.0 version the template is in fact already a **structured electronic module with conditional logic**, meant for implementation in DPA portals. This opens an opportunity the current Word document does not yet exploit: standardising not only the visual form, but the data format and the transmission channel. A note on how to read this paper: the contributions fall into three tiers \- (A) essential observations on the template itself (Parts I-III); (B) optional technical proposals that the EDPB and the DPAs may take up at their discretion (this Part IV.1 to IV.6); and (C) a non-binding technical annex (Part IV.7). The optional and forward-looking items are deliberately kept separate from the essential observations, so that the core consultation feedback can be read on its own.

### IV.1 \- The proposal {#iv.1---the-proposal}

Pair the form with two open technical artefacts:

1. A **machine-readable schema** (a JSON Schema of the fields): it formalises, unambiguously, the structure, data types, conditional logic and constraints. The schema becomes the "contract" of the format, identical across the EU.  
2. A **receiving API endpoint (OpenAPI 3.1)** for automated machine-to-machine (M2M) transmission of notifications from organisations to DPAs: undertakings with incident-management systems (SIEM/SOC, privacy GRC tools) could notify directly from their tools rather than re-keying a form manually.

### IV.2 \- Policy arguments {#iv.2---policy-arguments}

- **Timeliness (Article 33(1))**: automated transmission reduces transcription errors and speeds compliance with the 72-hour deadline by removing the manual re-entry of data already held in corporate systems.  
- **Real cross-border interoperability**: an identical payload can be addressed to the lead supervisory authority (Article 56 GDPR) or, for non-EEA controllers, to several DPAs at once \- operationally overcoming the fragmentation that today forces different forms in different languages. It is the technical translation of the template's cross-border section.  
- **Consistency with the current design**: the embedded conditional logic already makes the template an electronic module; the machine-readable schema is its natural formalisation, not an external addition.  
- **A consolidated EU trend**: structured machine-readable reporting to authorities is already the direction of EU legislation \- see the structured templates for major ICT-incident reporting under DORA and the multi-stage notifications under NIS2. An M2M channel for GDPR breach notifications fits this path; it is not an outlier.  
- **National precedent**: the Italian Garante has had a telematic channel since 2021 (docweb 9667201). Several other DPAs likewise operated dedicated breach-notification channels before the template: France's CNIL uses the same two-phase logic (an initial 72-hour notification followed by a supplementary one), while Spain (AEPD), the Netherlands (AP) and Ireland (DPC) provide pre-existing dedicated national portals (EDPB hub, 'How to notify a data breach to your DPA') \- so a machine-readable channel builds on an established practice rather than introducing a wholly new one. The API would be its natural evolution.

### IV.3 \- Voluntariness and proportionality {#iv.3---voluntariness-and-proportionality}

The M2M channel is to be understood as an **option, not a replacement for the web form**. SMEs without automated systems continue with the form; organisations with a SOC/GRC tool use M2M. The proposal is therefore consistent and complementary with the "SME track" (Part I, Section 2): no additional burden on less-structured entities. These artefacts are offered as soft-harmonisation instruments: the EDPB can recommend a template and issue guidance, and can make a reference schema and API available, but whether to adopt a common machine-readable schema or an M2M channel rests with the EDPB's and the DPAs' own assessment of their competence and legal basis. The technical proposals in this Part are therefore offered, not imposed.

### IV.4 \- Security of the channel (Article 32 by design) {#iv.4---security-of-the-channel-(article-32-by-design)}

An endpoint receiving breach notifications itself processes personal data and sensitive security information: it must therefore be **itself compliant with Article 32 GDPR**, so as not to become a new risk vector. The proposal is security-by-design, with the following measures (already specified as requirements in the OpenAPI specification):

| \# | Measure | Function |
| :---- | :---- | :---- |
| 1 | **TLS 1.3 \+ mTLS** (mutual TLS) | Encrypted transport; both the sending organisation and the DPA authenticate with certificates |
| 2 | **OAuth 2.0 client credentials** (short-lived, scoped token) \+ mTLS | Defence in depth; the controller/DPO identity in the payload is bound to the authenticated client (mapped to a registered controller), preventing spoofed notifications |
| 3 | **Request signing \- JWS / HTTP Message Signatures (RFC 9421\)** | Integrity and **non-repudiation**: the DPA can prove WHO sent the notification and that the payload was not altered. Legally crucial: a breach notification is a legal act with a 72-hour deadline |
| 4 | **Idempotency-key** | Avoids duplicates on retransmission (network failure during the 72 hours); ties into the template's follow-up/withdrawal logic |
| 5 | **Per-client rate limiting** | The endpoint must not become a DoS vector |
| 6 | **Immutable audit log** (sender, timestamp, payload hash) | Article 32 \+ Article 5(2) accountability |
| 7 | **Server-side validation against the JSON Schema** | Malformed payloads rejected; the schema is the contract |
| 8 | **API versioning** | Schema evolution without breaking clients |

Point 3 (cryptographic non-repudiation) deserves legal emphasis: by turning the notification into a signed message with proof of sender and timestamp, the API strengthens certainty of compliance with the 72-hour deadline \- a benefit both for the controller (proof of timeliness) and for the DPA (proof of authenticity).

### IV.5 \- Forward-compatibility with the Digital Omnibus single reporting entry point {#iv.5---forward-compatibility-with-the-digital-omnibus-single-reporting-entry-point}

The Digital Omnibus proposes an ENISA-operated single entry point ('report once, share many') routing incident and breach notifications across NIS2, GDPR, DORA, eIDAS and CER: the entity notifies once, and the back-end routes the submission to the relevant authorities. If adopted (European Parliament plenary vote expected 7-10 July 2026), the single entry point would become available approximately 18 months after the new measures enter into force (extendable to 24 months if the Commission finds the portal does not yet meet the required integrity, reliability and confidentiality standards). The EDPB breach template could/should be designed **upfront** to be compatible with that single-entry-point data model, so that one structured submission can satisfy multiple regimes. This turns the template from a GDPR silo into the GDPR node of a pan-regulatory reporting fabric \- aligning with the EU Commission's own simplification agenda.

**Important framing**: the Digital Omnibus is, at the time of writing, a **legislative proposal still in the adoption process** (European Parliament plenary vote expected 7-10 July 2026; publication in the Official Journal anticipated before 2 August 2026). It is **not yet adopted law**. This recommendation is therefore made strictly as **forward-compatibility / anticipation of a proposal in progress**, not as compliance with an existing obligation.

*Proposal*: ensure the template's data model (field names, controlled vocabulary, identifiers) is designed to be forward-compatible with the single-entry-point schema envisaged by the Digital Omnibus proposal, so that \- if and when adopted \- the GDPR notification can be emitted or consumed by the common entry point without re-mapping. \[EDPB-EDPS Joint Opinion 2/2026 on the Digital Omnibus: [edpb.europa.eu/system/files/2026-02/edpb\_edps\_jointopinion\_202602\_digitalomnibus\_en.pdf](http://edpb.europa.eu/system/files/2026-02/edpb_edps_jointopinion_202602_digitalomnibus_en.pdf);  NIS2 Art. 23: [eur-lex.europa.eu/eli/dir/2022/2555/oj](http://eur-lex.europa.eu/eli/dir/2022/2555/oj)\].

### IV.6 \- Multilingual consistency of the controlled vocabulary {#iv.6---multilingual-consistency-of-the-controlled-vocabulary}

With \+27 DPAs implementing the template, the enumerations (incident types, data categories, exemptions) must be **semantically identical across languages**, to avoid a "same field, different meaning" drift between national portals.

*Proposal*: the EDPB should maintain the controlled vocabulary centrally with **stable, language-independent keys**, binding translations to those keys. The reference schema (IV.7) already implements this: the enumerations use stable semantic keys (e.g. `loss_of_confidentiality`, or letter codes a/b/c) so that the **transmitted value is identical across all EU languages** \- only the displayed label changes, never the value. Two DPAs operating in different languages therefore receive the same payload. This is the technical foundation of multilingual consistency, and it links the multilingual-consistency, single-entry-point and machine-readability objectives.

### IV.7 \- Reference implementation (annex) {#iv.7---reference-implementation-(annex)}

To make the proposal concrete, a first reference implementation is annexed to this paper as a non-binding technical contribution released under CC BY 4.0:

- A **JSON Schema (Draft 2020-12)** of the notification payload derived from template v1.0: **100 input fields** (of 126 total rows, 26 being section/structure), of which 42 always mandatory, 46 conditional and 12 optional.  
- **Complete taxonomies faithfully reproduced**: 25 incident types, 21 data categories (a-u), 6 causes, 3 severity levels, 3 Article 34(3) GDPR exemptions, the C-I-A triad, NACE classification, complete EEA supervisory-authority lists. 90 of 100 fields are anchored to specific GDPR articles.  
- **Conditional logic** (visible\_if / required\_if) transcribed in full from the template's "business logic" column.  
- A guided pre-assessment step (Part I, Section 3), an ISO/IEC 27035 mapping of the incident taxonomy (Part III.6), a downloadable Article 33(5) breach-register model (CSV / XLS export) implementing the fields proposed in Part III.5, and an aggregate, anonymised transparency-statistics schema (Part III.4) with small-cell suppression (k \>= 5).

Method: cell-level extraction from the native table of the official .docx file, with two independent parses and diff reconciliation (zero cell-boundary ambiguity). The OpenAPI 3.1 specification, with the securitySchemes at IV.4, is complete (OpenAPI 3.1.0, mTLS and OAuth2 security schemes, the eight Article 32 measures of Section IV.4 documented, validated against a tested mock server) and will be released on the same terms upon publication. 

**Reference implementation and technical artefacts (CC BY 4.0)**

**Repository:** [https://github.com/NicklawAI/edpb-breach-notification-assistant](https://github.com/NicklawAI/edpb-breach-notification-assistant)    
**Landing page:** [https://nicklawai.github.io/edpb-breach-notification-assistant/](https://nicklawai.github.io/edpb-breach-notification-assistant/)   
**Offline tool**: [https://nicklawai.github.io/edpb-breach-notification-assistant/tool.html](https://nicklawai.github.io/edpb-breach-notification-assistant/tool.html)    
**JSON Schema:**  [https://github.com/NicklawAI/edpb-breach-notification-assistant/blob/main/src/schema/breach-notification.schema.json](https://github.com/NicklawAI/edpb-breach-notification-assistant/blob/main/src/schema/breach-notification.schema.json)   
**OpenAPI 3.1**:  [https://github.com/NicklawAI/edpb-breach-notification-assistant/blob/main/api/openapi.yaml](https://github.com/NicklawAI/edpb-breach-notification-assistant/blob/main/api/openapi.yaml)  **Article 33(5) breach-register example:**  [https://github.com/NicklawAI/edpb-breach-notification-assistant/blob/main/paper/breach-register.example.csv](https://github.com/NicklawAI/edpb-breach-notification-assistant/blob/main/paper/breach-register.example.csv)    
**Aggregate-transparency example** [https://github.com/NicklawAI/edpb-breach-notification-assistant/blob/main/paper/aggregate-transparency.example.json](https://github.com/NicklawAI/edpb-breach-notification-assistant/blob/main/paper/aggregate-transparency.example.json) .

*Caveat*: the schema is a technical interoperability reference, not a submission channel \- the template remains under consultation and is not usable for real notifications until DPAs implement it.

**GDPR field-to-article map (inline)**:

| GDPR article | Fields | Theme |
| :---- | :---- | :---- |
| Art. 4(12); Art. 33(3)(a) | 55 | Definition and nature of the breach |
| Art. 33(1) | 44-53 | Timeline and 72h deadline (awareness/detection) |
| Art. 33(2); Art. 28; Art. 26 | 38-41 | Processor / joint-controller involvement |
| Art. 33(3)(a) | 10-19, 21-26, 56-63, 65-68, 70-73 | Controller identity \+ data-subject/record categories and numbers |
| Art. 33(3)(b) | 29-31, 33-36 | DPO / contact point |
| Art. 33(3)(c) | 79-87 | Likely consequences and severity |
| Art. 33(3)(d) | 92, 94-95 | Measures taken / proposed / preventive |
| Art. 32; Art. 33(3) | 75-76 | Security measures in place |
| Art. 33(1); Art. 34(1) | 89-90 | Risk assessment / high-risk threshold |
| Art. 34(1); Art. 34(2) | 97-99, 102-106 | Communication to data subjects |
| Art. 34(3)(a)(b)(c) | 100-101 | Exemptions from communication to data subjects |
| Art. 56 | 113-118 | Cross-border processing / lead SA (one-stop-shop) |
| Art. 3(2) | 120-123 | Non-EEA controller / extraterritoriality |

---

## Part V \- Summary of proposals {#part-v---summary-of-proposals}

**From general and field comments (Parts I-II):**

1. Introduce a simplified "SME track" based on the Article 33(3) minimum.  
2. Anchor field 90 to ENISA SEV (SE \= DPC x EI \+ CB; SE \>= 2 as an indicative operational threshold, without prejudice to the case-by-case assessment under Articles 33 and 34\) \+ indicative level mapping; let the computed value pre-populate the template.  
3. Clarify/align the severity scale (3 vs 4 levels).  
4. Clarify that the template harmonises the format, not the channel (no single submission point).  
5. Structured reason field for notification withdrawal.  
6. Flag and date of the processor→controller notification under Article 33(2).  
7. Connect, in the conditional logic, the encryption field to the Article 34(3)(a) exemption.  
8. Explicit reference to coordination with NIS2/DORA/other-authority notifications.  
9. Guidance on attachment format/size.

**From the international comparison (Part III):** 

10. A two-tier public/confidential structure on the OAIC (Australia) model, so the template also serves the Article 34 communication.   
11. 11\. A guided "notify or not" pre-assessment upstream, on the ICO (UK) model, to reduce defensive notifications.    
12. A link to the internal breach register under Article 33(5) GDPR on the Canadian record-keeping model, with a model structure aligned with the template's fields.    
13. Align the incident vocabulary and lifecycle with ISO/IEC 27035 (process/terminology interoperability, not a literal type mapping).   
14. \[concrete model\] Propose a concrete aggregate, anonymised transparency model on the California model, derived from the template's controlled vocabulary (incident type, cause, data categories, severity band, sector, bracketed data-subject counts, Article 34 flag), at category-count granularity per reporting period, with small-cell suppression / k-anonymity guarantees (recommended minimum k \>= 5\) and a reference schema in the annex, turning the taxonomy into a comparable pan-European evidence base.  
15. Indicate a timeline and a coexistence period for the transition from existing national forms (e.g. the Italian 2021 tool).

**Technical proposal (Part IV):** 

16. Standardise the data format (JSON Schema) and an optional M2M API channel for automated transmission from corporate systems to DPAs \- security-by-design (mTLS, OAuth2, JWS non-repudiation, immutable audit), voluntary and complementary to the form for SMEs, consistent with the DORA/NIS2 trend. A reference open-source implementation is available as a technical contribution under CC BY 4.0.  
17. **\[forward-looking \- proposal not yet adopted\]** Design the template forward-compatibly with the Digital Omnibus single reporting entry point (one structured submission serving NIS2/GDPR/DORA/eIDAS/CER). NB: the Digital Omnibus is a legislative proposal pending adoption (EP plenary vote July 2026), framed here as anticipation, not existing law.   
18. **\[forward-looking\]** Map the template's preliminary/complete/follow-up sub-types onto the NIS2 staged timeline (24h/72h/1-month) for non-duplicative multi-regime reporting.   
19. Allow a proposed severity band to be computed from the controller's declared ENISA inputs (DPC/EI/CB) \- a qualitative judgment of the controller, not an automated risk assessment \- for cross-DPA comparability and EDPB analytics.   
20. Maintain the controlled vocabulary centrally with stable, language-independent keys to ensure multilingual consistency across 27+ DPAs.

## Part VI \- Licence and free adoption {#part-vi---licence-and-free-adoption}

This position paper and its technical annexes (JSON Schema, field catalogue, ISO/IEC 27035 mapping, OpenAPI specification, and the guided pre-assessment) are released under the **Creative Commons Attribution 4.0 International Licence (CC BY 4.0)**.

The artefacts are made available for adoption by the EDPB, the national Data Protection Authorities and any EU institution, with no restriction beyond attribution. Under CC BY 4.0, DPAs are free to adopt, adapt, implement and redistribute the schema, the mapping tables and the reference implementation, including in their own portals. The artefacts are available in the public repository ([https://github.com/NicklawAI/edpb-breach-notification-assistant](https://github.com/NicklawAI/edpb-breach-notification-assistant)); Stakeholders have adhered and will keep adhering via the repository's adherence form ([https://github.com/NicklawAI/edpb-breach-notification-assistant/issues/new?template=adhere.yml](https://github.com/NicklawAI/edpb-breach-notification-assistant/issues/new?template=adhere.yml)), with signatories listed at [https://github.com/NicklawAI/edpb-breach-notification-assistant/blob/main/SIGNATORIES.md](https://github.com/NicklawAI/edpb-breach-notification-assistant/blob/main/SIGNATORIES.md). 

17 June 2026

Nicola Franchetto LL.M

Martim Taborda Barata
