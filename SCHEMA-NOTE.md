
## Field cardinality (multi-value)

The reference tool treats the following fields as **multi-select** (array payloads), in addition to field 40 which the template explicitly marks "Allow multiple": 55 (nature C/I/A), 65 (categories of data subjects), 70 (type of breached data), 75 (measures in place), 79/81/83 (likely consequences per C/I/A), 85 (nature of potential impact), 94 (measures to prevent). Field 60 (nature of the incident, 25-type taxonomy) is kept **single** to preserve the statistical comparability of the taxonomy.

**Honesty caveat:** cardinality beyond field 40 is the reference implementation's reasoned interpretation - grounded on Article 33(3)(a) (which refers to "categories" of data subjects and of data in the plural) and on the EDPB Guidelines 9/2022 recognition that confidentiality, integrity and availability breaches can co-exist - and is NOT an explicit instruction of the EDPB template. The enum keys are unchanged, so the payload remains language-independent.
