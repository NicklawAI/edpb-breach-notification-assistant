# EDPB Breach-Notification Template - Position Paper: the 20 proposals

A concise synthesis (title + one line each). Full reasoning and primary sources in the position paper.

## From the general and field comments (Parts I-II)

1. **SME track** - A simplified path exposing only the Article 33(3) minimum, with detail fields deferred to a follow-up stage.
2. **Anchor severity to ENISA** - Reference the ENISA SEV methodology (SE = DPC x EI + CB; SE >= 2 relevance threshold) with an indicative mapping to the template's three levels, letting the computed value pre-populate the form.
3. **Align the severity scale** - Clarify the relationship between the template's three levels and the four-level ENISA scale, or adopt four levels.
4. **Format, not channel** - State explicitly that the template harmonises the format, not the submission channel (no single European submission point).
5. **Withdrawal reason** - Add a structured field for the reason a notification is withdrawn (duplicate / risk reassessed / filing error).
6. **Processor-to-controller flag** - Add a flag and date for a breach detected by the processor and notified under Article 33(2), to reconstruct the awareness chain.
7. **Encryption to exemption link** - Connect the encryption field to the Article 34(3)(a) exemption within the conditional logic.
8. **Multi-regime coordination** - Add an explicit reference to coordination with NIS2 / DORA / sectoral-authority notifications for the same event.
9. **Attachment guidance** - Provide guidance on accepted attachment format and maximum size.

## From the international comparison (Part III)

10. **Two-tier public/confidential structure** [new] - On the OAIC (Australia) model, separate a "communicable to data subjects" core from a "reserved to the DPA" tier, so the template also serves the Article 34 communication.
11. **Guided pre-assessment** - A "notify or not" decision flow upstream of the template, on the ICO (UK) model, to reduce defensive over-notification.
12. **Link to the Article 33(5) register** [new] - On the Canadian (PIPEDA / SOR-2018-64) model, offer a model internal-register structure aligned with the template's fields, with 24-month retention.
13. **ISO/IEC 27035 alignment** - Anchor the incident vocabulary and lifecycle to ISO/IEC 27035 as a process/terminology interoperability reference (not a literal type-for-type mapping).
14. **Aggregate transparency** - Consider aggregate, anonymised notification statistics on the California model, leveraging the new common taxonomy.
15. **Transition timeline** - Indicate a timeline and coexistence period for the transition from existing national forms (e.g. the Italian 2021 tool).

## Technical proposals (Part IV)

16. **Machine-readable format + optional M2M channel** - Standardise the data format (JSON Schema) and offer an optional, voluntary machine-to-machine API channel, security-by-design (mTLS, OAuth2, JWS non-repudiation, immutable audit); a CC BY 4.0 reference implementation is annexed.
17. **Digital Omnibus forward-compatibility** [forward-looking, proposal pending adoption] - Design the template to be forward-compatible with the proposed single reporting entry point (one structured submission serving NIS2 / GDPR / DORA / eIDAS / CER).
18. **NIS2 / DORA staged-timeline mapping** [forward-looking] - Map the template's preliminary/complete/follow-up sub-types onto the NIS2 (24h/72h/1-month) and DORA staged regimes, for non-duplicative multi-regime reporting.
19. **Machine-computable severity** - Allow severity to be computed from structured ENISA inputs (DPC / EI / CB) for cross-DPA comparability and EDPB-level analytics.
20. **Multilingual stable vocabulary** - Maintain the controlled vocabulary centrally with stable, language-independent keys, so the transmitted value is identical across all EU languages.
