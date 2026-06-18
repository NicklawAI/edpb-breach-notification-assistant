<!-- AUTO-GENERATED from the canonical Google Doc. Do not edit by hand; run paper/build-paper.sh. -->
> **CONSULTATION DRAFT - 2026-06-18** - pending co-author review. The canonical, authoritative version is the Google Doc linked below. This snapshot is versioned in the repository for citation and reproducibility.
> Canonical IT: see README "Position paper" links.

# **Position Paper sul Template EDPB per la notifica delle violazioni di dati personali ai sensi dell'articolo 33 GDPR**

Questa è la versione italiana del position paper, predisposta per agevolarne la lettura. L'adesione si appone sulla versione ufficiale in lingua inglese, disponibile qui: https://docs.google.com/document/d/1j\_EviybY26zvKFckELPB5nwFt1pk5HhGxEYK4EcUaQA

Risposta alla consultazione pubblica \- EDPB "Template for the notification of personal data breaches under Article 33 GDPR", versione 1.0, adottato l'8 giugno 2026 (121a plenaria), pubblicato il 10 giugno 2026\. Consultazione aperta fino al 5 agosto 2026\.

Autori: Nicola Franchetto (Avvocato, Franchetto Legal) e Martim Taborda Barata.

Licenza: Questo position paper e gli artefatti tecnici di accompagnamento (JSON Schema, catalogo dei campi, specifica OpenAPI) sono rilasciati con licenza Creative Commons Attribuzione 4.0 Internazionale (CC BY 4.0). Sono destinati alla libera adozione da parte delle Autorità di controllo e delle istituzioni UE senza restrizioni. Gli autori chiedono unicamente di essere citati come fonte; nessun'altra condizione si applica. Si veda la Sezione VI.

Data: giugno 2026\. Stato: bozza per validazione interna prima della presentazione.

## **Executive summary**

Il template EDPB è un passo sostanziale verso l'armonizzazione delle notifiche di violazione ex articolo 33 GDPR nell'UE. Questo paper condivide i suoi punti di forza fondamentali \- una tassonomia comune di 25 tipi di incidente, una logica condizionale integrata e una sezione cross-border sviluppata \- e propone una serie di miglioramenti incrementali e additivi, tratti da un'analisi comparata di regimi di notifica maturi (Regno Unito, Australia, Singapore, USA, Canada) e di standard internazionali (ENISA, ISO/IEC 27035).

Il paper sviluppa in particolare quattro idee: (1) una fase di pre-valutazione guidata, modellata sull'approccio ICO, che effettua il triage e pre-compila il template; (2) l'ancoraggio esplicito del campo severità alla metodologia ENISA di Severity Assessment, con una soglia di rilevanza dichiarata; (3) una struttura di record-keeping delle violazioni modellata sul regime canadese PIPEDA, che dà forma operativa all'obbligo documentale dell'articolo 33(5); e (4) l'allineamento del vocabolario degli incidenti e del ciclo di vita del template alla ISO/IEC 27035\. Propone inoltre la standardizzazione di uno schema machine-readable e di un canale opzionale di trasmissione machine-to-machine, con un'implementazione di riferimento open-source rilasciata in CC BY 4.0. Il paper va anche oltre la critica: include un'implementazione di riferimento funzionante (JSON Schema, vocabolario controllato, mappa campo-articolo GDPR) come allegato non vincolante in CC BY 4.0, che l'EDPB e le Autorità sono libere di adottare.

Cinque raccomandazioni chiave:

1\. Ancorare il campo severità alla metodologia ENISA (trattando la soglia SE \>= 2 come soglia operativa indicativa, ferma restando la valutazione caso per caso ai sensi degli articoli 33 e 34 GDPR) e consentire il calcolo di una banda di severità proposta a partire dagli input ENISA dichiarati dal titolare.  
2\. Aggiungere una fase di pre-valutazione guidata e un percorso semplificato per le PMI, per ridurre l'onere e l'eccesso di notifica difensiva.  
3\. Dare forma operativa al registro delle violazioni ex articolo 33(5) sul modello canadese, e allineare il vocabolario degli incidenti alla ISO/IEC 27035\.  
4\. Pubblicare il template come JSON Schema machine-readable con un vocabolario controllato e indipendente dalla lingua, con un canale M2M sicuro opzionale \- in allegato un'implementazione di riferimento.  
5\. Trattare l'interoperabilità multi-regime come obiettivo di progettazione, allineando il template alle timeline scaglionate NIS2 e DORA oggi in vigore, così che un'unica presentazione strutturata possa servire più regimi. (La forward-compatibility con il single entry point del Digital Omnibus, proposta non ancora adottata, è trattata separatamente come future-proofing, nella Parte IV.5.)

## **Parte I \- Osservazioni generali**

### **1\. Valutazione complessiva (positiva)**

Il template è un avanzamento significativo verso un formato armonizzato di notifica ex articolo 33\. Tre caratteristiche meritano lode esplicita:

\* Una tassonomia comune di 25 tipi di incidente più una classificazione delle cause a quattro quadranti (interna/esterna x dolosa/non dolosa): per la prima volta, un vocabolario europeo condiviso che riduce l'eterogeneità delle notifiche e abilita statistiche aggregate comparabili tra Autorità.  
\* Una logica condizionale integrata, in particolare il campo di giustificazione del ritardo auto-attivato oltre le 72 ore (articolo 33(1)) e le esenzioni dell'articolo 34(3) codificate come opzioni strutturate: la conformità procedurale è guidata dal modulo stesso.  
\* Una sezione cross-border sviluppata (autorità di controllo capofila ex articolo 56, paesi di stabilimento, interessati per paese, elenco delle Autorità SEE): risponde a un'esigenza reale dei gruppi multi-paese, che oggi si trovano davanti a moduli diversi in lingue diverse con tassonomie diverse durante le 72 ore più critiche.

### **2\. Proporzionalità verso le PMI (un destinatario dichiarato)**

L'EDPB include le PMI tra i destinatari del template. Un modulo di 126 righe (100 campi di input) su sette sezioni, per quanto condizionale, può risultare gravoso per una piccola impresa priva di una funzione privacy strutturata, specie durante le 72 ore di gestione dell'incidente.

Proposta: introdurre un "percorso PMI" semplificato che, in prima battuta, esponga solo il sottoinsieme minimo richiesto dall'articolo 33(3) (natura; categorie e numero approssimativo di interessati e di registrazioni; probabili conseguenze; misure adottate o proposte), rinviando i campi di dettaglio a una fase di follow-up. La logica condizionale già presente rende ciò fattibile senza un secondo modulo. Questa proposta è complementare alla pre-valutazione guidata della Sezione 3 e al canale machine-readable della Parte IV: le PMI usano il percorso leggero, le organizzazioni strutturate usano l'automazione.

### **3\. Una fase di pre-valutazione guidata (modello ICO)**

L'ICO britannico integra uno strumento di auto-valutazione che aiuta un'organizzazione a decidere se una violazione vada notificata, insieme a esempi pubblicati e a una distinzione tra violazioni sopra e sotto soglia. L'auto-valutazione ICO è un albero decisionale guidato (è una violazione? \-\> rischio? \-\> notifica all'ICO? \-\> informare gli interessati? \-\> documentare) (ico.org.uk/for-organisations/report-a-breach/personal-data-breach-assessment/).

La determinazione di una violazione notificabile ex articolo 33 è essa stessa un giudizio giuridico reso sotto pressione temporale. Una pre-valutazione guidata, a monte del template, consentirebbe di: (a) effettuare il triage se sorga l'obbligo di notifica ex articolo 33 (rischio per i diritti e le libertà) e se sorga l'obbligo di comunicazione ex articolo 34 (rischio elevato); (b) ridurre l'eccesso di notifica difensiva/precauzionale, che grava sulle Autorità e diluisce il segnale; e (c) pre-compilare il template con gli input già raccolti durante il triage (categorie di dati, identificabilità, natura C-I-D, causa), così che il titolare non reinserisca due volte le stesse informazioni.

Proposta: l'EDPB dovrebbe accompagnare il template con una pre-valutazione guidata \- un breve flusso decisionale che determina l'esistenza degli obblighi di notifica/comunicazione e ne riporta gli input nel template. L'implementazione di riferimento open-source (Parte IV.7 / Sezione VI) include una simile pre-valutazione come primo passo, dimostrando la fattibilità di un unico flusso triage-to-notification. La pre-valutazione dovrebbe inoltre far emergere i fattori attenuanti che abbassano il punteggio di severità ENISA (e lo sforzo di valutazione) nel caso concreto \- per esempio una violazione che riguarda un solo interessato, o un caso di destinatario errato in cui il destinatario ha confermato la cancellazione dei dati \- così che il titolare non sia indotto a notificare in eccesso laddove il rischio residuo è in realtà basso. L'implementazione di riferimento (Parte IV.7) lo rende operativo come un insieme esplicito e non esaustivo di fattori attenuanti \- un solo interessato (che abbassa il DPC), un destinatario errato che conferma la cancellazione, un nome comune o l'omonimia che riduce l'identificabilità, la cifratura forte o dati resi inintelligibili, la pseudonimizzazione senza chiave accessibile, un destinatario tenuto al segreto professionale, il rapido ripristino della disponibilità da backup, oppure dati già pubblici o di bassa criticità \- ciascuno mostrato come un aggiustamento editabile della variabile ENISA pertinente (DPC / EI / CB) e non come un punteggio nascosto, coerentemente con l'accountability del titolare ex articolo 5\.

### **4\. Valutazione della severità: ancorare il campo metodologia all'ENISA (con soglia dichiarata)**

Il template chiede al titolare di "descrivere la metodologia utilizzata e i fattori rilevanti" (campo 90\) ma non indica una metodologia di riferimento, pur offrendo una scala di severità a tre livelli (Minore / Moderata / Grave). Ciò lascia una valutazione percepita come soggettiva e incoerente tra titolari.

La metodologia ENISA di Severity Assessment è lo standard europeo de facto per quantificare la severità di una violazione. La sua formula è SE \= DPC x EI \+ CB, dove DPC è il Data Processing Context, EI l'Ease of Identification e CB le Circumstances of the Breach, con quattro fasce: bassa / media / alta / molto alta (ENISA Working Document v1.0, dicembre 2013, sviluppato da ENISA con le Autorità greca e tedesca \- enisa.europa.eu/publications/dbn-severity; PDF: enisa.europa.eu/sites/default/files/publications/Data%20breach%20severity%20methodology\_1.0.pdf).

Un punto di chiarezza sostanziale sulla soglia di rilevanza. Secondo la metodologia ENISA, un punteggio di severità inferiore a 2 corrisponde a "Low" \- testualmente, "individuals either will not be affected or may encounter a few inconveniences, which they will overcome without any problem" \- mentre un punteggio pari o superiore a 2 corrisponde, sulla scala ENISA, alle fasce "Medium e superiori" (descritte da ENISA come comprese tra inconvenienti significativi e conseguenze significative o persino irreversibili). Questa soglia SE \>= 2 va letta come soglia operativa indicativa, non come cut-off normativo: ENISA non è il GDPR, e il rischio per i diritti e le libertà delle persone fisiche ai sensi dell'articolo 33 non coincide automaticamente con un punteggio ENISA pari o superiore a 2\. La metodologia supporta, ma non sostituisce, la valutazione giuridica caso per caso del titolare ai sensi degli articoli 33 e 34 GDPR. Nella formula, il punteggio base DPC riflette la criticità del dato (1 \= semplice, 2 \= comportamentale, 3 \= finanziario, 4 \= sensibile), EI è una correzione moltiplicativa per la facilità di identificazione \- non un valore assoluto, ma un fattore da modulare in base alle circostanze attenuanti del caso concreto (per esempio, l'omonimia di un interessato può rendere più difficile il singling-out e quindi abbassare l'EI) \- e CB aggiunge le circostanze della violazione. Ancorare il campo 90 a questa metodologia offre ai titolari un risultato riproducibile e difendibile e alle Autorità una scala comune e citabile, mentre la qualificazione giuridica della violazione resta una valutazione caso per caso ai sensi degli articoli 33 e 34 GDPR. Questa modulazione caso per caso non è teorica: l'EDPB la applica già nelle sue Linee guida 01/2021 sugli esempi di notifica delle violazioni, dove sono i fattori attenuanti a determinare l'esito. Nel Caso 1 (un attacco ransomware con backup intatto, nessuna esfiltrazione e dati rimasti cifrati) il rischio residuo è basso e la notifica può non essere nemmeno richiesta, mentre nel Caso 3 (un attacco ransomware a un ospedale, con migliaia di pazienti coinvolti e interventi rinviati, che richiama i reali incidenti ransomware sanitari su larga scala nell'UE) il rischio è elevato e fa scattare sia la notifica all'Autorità sia la comunicazione agli interessati. Questi fattori attenuanti si mappano direttamente sui campi 57 del template (dati resi inintelligibili / cifrati) e 74-76 (misure di sicurezza in essere). \[EDPB Linee guida 01/2021 sugli esempi in materia di notifica delle violazioni di dati personali, adottate il 14 dicembre 2021: edpb.europa.eu/system/files/2022-01/edpb\_guidelines\_012021\_pdbnotification\_adopted\_en.pdf\]

Proposta: senza imporre un'unica metodologia, l'EDPB dovrebbe (a) richiamare la ENISA SEV come metodologia raccomandata nelle note esplicative al campo 90, indicando la soglia SE \>= 2 come soglia operativa indicativa (ferma restando la valutazione giuridica caso per caso del titolare ai sensi degli articoli 33 e 34 GDPR); (b) fornire una mappatura indicativa tra le quattro fasce ENISA (bassa / media / alta / molto alta) e i tre livelli del template (es. bassa \-\> Minore; media \-\> Moderata; alta e molto alta \-\> Grave); e (c) consentire al titolare di trasmettere gli input ENISA (DPC, EI, CB) come campi strutturati, così che venga calcolata una banda di severità proposta a partire dagli input dichiarati dal titolare (DPC, EI e CB restano giudizi qualitativi del titolare, non una valutazione del rischio automatizzata o oggettiva) e sia comparabile tra notifiche e tra Autorità \- abilitando analisi a livello EDPB sulla severità delle violazioni e chiudendo il cerchio con la pre-valutazione della Sezione 3 (il valore calcolato pre-compila il template). La standardizzazione di questi valori aiuterebbe inoltre l'EDPB e tutte le Autorità di controllo ad aggiornare le linee guida EDPB sugli esempi di violazione e a ottenere valori più comparabili in modo autonomo dai titolari, ferma restando la responsabilità del titolare per i valori che dichiara (accountability ex articolo 5 GDPR). Valori più comparabili rafforzano inoltre il meccanismo di cooperazione tra le Autorità di controllo e la consistenza nell'applicazione degli articoli 33 e 34: oggi, per diversi motivi, Autorità diverse possono giungere a conclusioni diverse a parità di eventi o incidenti, e un input di severità standardizzato e comparabile riduce tale divergenza.

### **5\. Disallineamento delle scale di severità**

Il template usa tre livelli (Minore/Moderata/Grave), mentre ENISA ne usa quattro e molte organizzazioni usano scale interne. Chi già opera su ENISA o su scale a quattro/cinque livelli dovrà rimappare, con rischio di perdita di granularità e di incoerenza.

Proposta: chiarire nelle note la relazione tra i tre livelli del template e le scale comunemente usate, oppure valutare l'adozione di una scala a quattro livelli allineata all'ENISA, lo strumento di valutazione più diffuso.

### **6\. Canale versus formato**

Il template armonizza il formato, non il canale: la notifica resta indirizzata all'Autorità nazionale competente (in Italia, il Garante via servizi.gpdp.it). La comunicazione di accompagnamento dell'EDPB dovrebbe affermare chiaramente che il template non istituisce un punto di presentazione unico europeo, per evitare l'aspettativa di un canale centralizzato. (Confronto con lo strumento telematico italiano del 2021 e con altre Autorità nella Parte III.)

## **Parte II \- Osservazioni sezione per sezione**

### **Sezione 1 \- Tipo di notifica**

\* Ritiro formale di una notifica: una novità positiva (duplicato, o rischio escluso dopo valutazione). Proposta: aggiungere un campo strutturato per la motivazione del ritiro (duplicato / rischio rivalutato come improbabile / errore di compilazione), utile a fini statistici e di accountability.

### **Sezione 2 \- Titolare e notificante**

\* Il campo dedicato al responsabile / contitolare è benvenuto. Proposta: aggiungere un flag che indichi se la violazione sia stata rilevata dal responsabile e notificata al titolare ex articolo 33(2), con la relativa data, per ricostruire la catena di consapevolezza rilevante per il computo delle 72 ore.

### **Sezione 3 \- Informazioni iniziali sulla violazione**

\* Il campo di giustificazione del ritardo auto-attivato oltre le 72h è un'eccellente trasposizione dell'articolo 33(1). Cautela: assicurare che il computo decorra dalla "consapevolezza" del titolare, non dalla data della violazione, e che il campo gestisca la notifica scaglionata (preliminare) senza penalizzare chi notifica tempestivamente ma in modo incompleto.  
\* La triade C-I-D con sotto-qualificazioni (es. riservatezza: esfiltrati / probabilmente esfiltrati / non esfiltrati con evidenza) è solida e coerente con le Linee guida 9/2022.  
\* Il campo cifratura/intelligibilità con l'opzione intermedia "misure presenti ma probabilmente aggirabili" è realistico e utile. Proposta: collegare esplicitamente questo campo all'esenzione dell'articolo 34(3)(a) nella logica condizionale, così che una dichiarazione di cifratura efficace pre-compili/orienti la Sezione 5 sulla comunicazione agli interessati.  
\* Categorie di interessati con flag per minori e persone vulnerabili: benvenuti, coerenti con il Considerando 75\.

### **Sezione 4 \- Ulteriori informazioni (il nucleo della valutazione)**

\* Campi severità \+ esito della valutazione del rischio: si vedano le Sezioni 4-5 della Parte I. Proposta: rendere esplicito nel modulo il collegamento tra l'esito della valutazione del rischio (rischio elevato / rischio / rischio improbabile) e gli obblighi che ne derivano (notifica ex articolo 33 all'Autorità / comunicazione ex articolo 34 agli interessati), con guida contestuale. Campi multi-valore: il template sembra consentire la selezione multipla esplicitamente su un solo campo, mentre diversi campi enumerati sono per natura multi-valore. Una singola violazione colpisce spesso più di una dimensione di natura (riservatezza, integrità e disponibilità possono essere compromesse insieme \- il template stesso prevede sub-type C/I/A separati), più di una categoria di dati personali e di interessati (l'articolo 33(3)(a) parla di "categorie" al plurale), e comporta più conseguenze probabili e più misure di sicurezza e di rimedio. Forzare una scelta singola su questi campi perde informazione, distorce la descrizione del titolare e mina la comparabilità delle statistiche aggregate. Proposta: l'EDPB dovrebbe abilitare esplicitamente la selezione multipla sui campi intrinsecamente multi-valore \- in particolare la natura della violazione (C/I/A), le categorie di dati personali e di interessati, le conseguenze probabili e le misure in essere o proposte \- mantenendo la selezione singola dove è appropriato un unico valore primario (in particolare il tipo di incidente primario, per preservare la comparabilità statistica della tassonomia dei 25 tipi). L'implementazione di riferimento modella questi campi come array.

### **Sezione 5 \- Comunicazione agli interessati**

\* Le esenzioni dell'articolo 34(3) come opzioni strutturate sono un'eccellente codificazione. Proposta: per l'esenzione (c) (sforzo sproporzionato \-\> comunicazione pubblica), aggiungere un campo che descriva il metodo di comunicazione pubblica adottato, a sostegno dell'accountability. L'EDPB potrebbe spingersi oltre e indicare in anticipo le modalità accettabili di comunicazione pubblica \- per esempio una FAQ dedicata o un avviso pubblicato sul sito web del titolare \- così che i titolari che si avvalgono dell'esenzione (c) abbiano un riferimento chiaro e armonizzato.

### **Sezione 6 \- Altri aspetti (cross-border, altre autorità)**

\* Il campo sull'interazione con NIS / altre autorità è utile e tempestivo, dato il crescente sovrapporsi tra notifiche GDPR e notifiche NIS2/DORA per lo stesso incidente. Proposta: includere un riferimento esplicito al coordinamento con le notifiche dovute ad altre autorità per il medesimo evento (NIS2, DORA, autorità settoriali), per ridurre la duplicazione di sforzi e segnalare la pluralità di obblighi. Interoperabilità temporale con NIS2: il GDPR usa un'unica notifica a 72 ore, mentre NIS2 (articolo 23\) usa uno schema scaglionato: preallarme a 24 ore \-\> notifica a 72 ore \-\> relazione finale a un mese. Il template già supporta i sotto-tipi preliminare/completa/follow-up (campi 3-4); l'EDPB potrebbe mappare esplicitamente questi sotto-tipi sullo scaglionamento NIS2, così che un soggetto rientrante in entrambi presenti una sequenza coerente e non duplicativa \- una concreta misura di alleggerimento per le PMI. \[Dir. NIS2 (UE) 2022/2555, art. 23: eur-lex.europa.eu/eli/dir/2022/2555/oj\] Un regime scaglionato parallelo esiste sotto DORA per i major ICT-related incident (articolo 19 del Reg. (UE) 2022/2554): una notifica iniziale entro 4 ore dalla classificazione come major (ed entro 24 ore dall'awareness), una relazione intermedia entro 72 ore e una relazione finale entro un mese (RTS (UE) 2025/301 e ITS (UE) 2024/2956). Per un soggetto rientrante sia nel GDPR sia in DORA, un'unica violazione di dati personali all'interno di un incidente ICT può far scattare due binari di reporting paralleli con tempistiche e tassonomie diverse; mappare i sotto-tipi preliminare/completa/follow-up del template su questi regimi scaglionati ridurrebbe la doppia notifica disallineata. Questo raccordo è specifico per i soggetti rientranti in entrambi i regimi \- DORA è settoriale, si applica alle entità finanziarie \- e non è una regola generale.  
\* Titolari extra-SEE senza stabilimento (articolo 3(2)): la necessità di notificare a ogni Autorità dei paesi in cui si trovano gli interessati, in assenza di uno sportello unico, resta un onere significativo. Il template lo gestisce bene includendo l'elenco delle Autorità, ma la frammentazione sottostante è una questione sistemica che va oltre il template. La base dottrinale di questi campi extra-SEE (attorno a 119-123) è il paragrafo 73 delle Linee guida EDPB 9/2022 sulla notifica delle violazioni di dati personali (v2.0), il cui aggiornamento chiave riguarda proprio gli obblighi di notifica per le violazioni presso stabilimenti fuori dall'UE: un titolare extra-SEE privo di stabilimento principale deve notificare a ciascuna Autorità di controllo interessata. \[EDPB Linee guida 9/2022 v2.0, par. 73: edpb.europa.eu/system/files/2023-04/edpb\_guidelines\_202209\_personal\_data\_breach\_notification\_v2.0\_en.pdf\] (Sviluppata nella Parte III.)

### **Sezione 7 \- Allegati**

\* L'elenco tipizzato degli allegati (copia della comunicazione agli interessati, valutazione del rischio, nota ransomware, messaggio di phishing) è pratico e utile alle indagini. Proposta: aggiungere indicazioni su formato accettato e dimensione massima, per evitare divergenze tra le implementazioni delle diverse Autorità.

## **Parte III \- Confronto con le best practice internazionali e proposte derivate**

Il template può assorbire selettivamente pratiche mature di altri regimi, ciascuna ancorata a una fonte primaria verificabile.

### **III.1 \- Italia (Garante): transizione da un modulo nazionale al template comune**

Dal 1 luglio 2021 il Garante italiano opera una procedura telematica strutturata (provv. 27/5/2021, docweb 9667201), unico canale ordinario, con logica preliminare/completa e solleciti automatici \- lo stesso meccanismo completa/incompleta/follow-up poi ripreso dal template EDPB. L'Italia era perciò già avanti, e il passo per i titolari italiani sarà modesto. \[garanteprivacy.it/home/docweb/-/docweb-display/docweb/9667201 ; servizi.gpdp.it/databreach\] L'Italia non è un caso isolato. Diverse Autorità disponevano di un canale nazionale dedicato di notifica delle violazioni già prima del template EDPB, sicché il template armonizza in larga parte una prassi nazionale preesistente più che crearla ex novo. La Francia (CNIL) in particolare usa già la stessa logica a due fasi \- una notifica iniziale entro 72 ore seguita da una supplementare, su un modulo salvabile e completabile in più riprese \[cnil.fr/fr/services-en-ligne/notifier-une-violation-de-donnees-personnelles\]. Spagna (AEPD, modulo online sulla sede electronica), Paesi Bassi (AP, il portale Meldloket datalekken) e Irlanda (DPC, webform online per le violazioni \[dataprotection.ie/en/organisations/know-your-obligations/breach-notification\]) forniscono parimenti portali nazionali dedicati preesistenti (hub EDPB, 'How to notify a data breach to your DPA': edpb.europa.eu/notify-data-breach\_en). La logica preliminare/completa del template codifica quindi una prassi convergente già consolidata nelle giurisdizioni più attive.

Osservazione: il template comune armonizza il formato, ma le Autorità che già dispongono di uno strumento proprio avranno bisogno di una fase di transizione. L'EDPB dovrebbe indicare una tempistica e un periodo di coesistenza per evitare disallineamenti tra il nuovo formato e i portali nazionali esistenti.

### **III.2 \- Regno Unito (ICO): l'auto-valutazione guidata**

L'ICO integra un albero decisionale di auto-valutazione che guida la decisione "notificare o no" (è una violazione di dati personali? \-\> c'è un rischio? \-\> notificare all'ICO? \-\> informare gli interessati? \-\> documentare), più esempi pubblicati e una distinzione sopra/sotto soglia. \[ico.org.uk/for-organisations/report-a-breach/personal-data-breach-assessment/\]

È la fonte della proposta di pre-valutazione della Parte I, Sezione 3\.

### **III.3 \- Australia (OAIC) e Singapore (PDPC): separazione pubblico/riservato e trigger chiari**

\* L'OAIC (Australia) usa un modulo in due parti: la Parte 1 (statement) contiene le informazioni che devono essere comunicate anche agli individui; la Parte 2, opzionale, può essere mantenuta riservata dal regolatore \- una separazione esplicita tra informazioni pubbliche e informazioni riservate verso l'autorità. \[oaic.gov.au/privacy/notifiable-data-breaches/report-a-data-breach\]  
\* Il PDPC (Singapore) usa una doppia soglia esplicita: danno significativo OPPURE una scala numerica (\>=500 individui). \[pdpc.gov.sg/report-data-breach\]

Proposta (OAIC) \[NUOVA, forte\]: il template non distingue chiaramente quali campi siano destinati anche alla comunicazione agli interessati (articolo 34\) e quali siano riservati al regolatore. Adottare una struttura a due livelli sul modello OAIC \- un nucleo "comunicabile agli interessati" e un livello "riservato all'Autorità" \- renderebbe il template utilizzabile sia per la notifica ex articolo 33 sia, in parte, per la comunicazione ex articolo 34, riducendo la duplicazione di lavoro nelle 72 ore.

### **III.4 \- USA (California AG, FTC HBNR): trasparenza e modelli settoriali**

\* California AG: chi notifica a più di 500 residenti in California deve inviare un campione dell'informativa all'AG, che mantiene un database pubblico e ricercabile delle notifiche e fornisce un modello ufficiale di avviso ai consumatori. \[oag.ca.gov/privacy/databreach/list\]  
\* FTC Health Breach Notification Rule (16 CFR Part 318): un modello settoriale per i dati sanitari fuori HIPAA (fornitori di PHR, app sanitarie), rilevante per l'interfaccia EHDS/wearable. \[ftc.gov/business-guidance/resources/complying-ftcs-health-breach-notification-rule-0\]

Proposta (California) \[modello concreto\]: l'EDPB dovrebbe accompagnare il template con un modello di trasparenza concreto \- un dataset statistico aggregato e anonimizzato delle notifiche, pubblicato periodicamente, derivato direttamente dal vocabolario controllato del template. In concreto, per le violazioni il cui esito della valutazione del rischio porta alla notifica, il modello aggrega un sottoinsieme definito di campi strutturati: tipo di incidente (la tassonomia dei 25 tipi), quadrante di causa (interna/esterna x dolosa/non dolosa), categorie di dati (a-u), banda di severità, settore (NACE), il numero di interessati raggruppato in fasce anziché in cifre esatte, e se sia stata richiesta la comunicazione ex articolo 34\. La granularità è il conteggio per categoria su un periodo di riferimento (per esempio trimestrale o annuale), mai a livello di singola notifica. Garanzie di anonimizzazione: nessuna identità del titolare, nessun campo a testo libero, nessuna data più fine del periodo di riferimento, e soppressione delle celle piccole o k-anonimato (un conteggio minimo di cella, con k \>= 5 come default raccomandato) in modo che nessuna notifica o titolare sia re-identificabile. Poiché ogni campo è tratto dal vocabolario controllato del template, le statistiche sono comparabili tra le Autorità per costruzione, trasformando la tassonomia in una base di evidenze paneuropea per la trasparenza e la ricerca, sul modello del database pubblico delle violazioni del California Attorney General. Uno schema di riferimento per questo modello aggregato è rilasciato con l'allegato tecnico (Parte IV.7).

### **III.5 \- Canada (OPC/PIPEDA): record-keeping di tutte le violazioni**

Il regime canadese (Breach of Security Safeguards Regulations, SOR/2018-64) richiede il record-keeping obbligatorio di TUTTE le violazioni \- incluse quelle sotto la soglia di notifica (Real Risk of Significant Harm) \- conservato per un minimo di 24 mesi dal giorno in cui l'organizzazione determina che la violazione si è verificata, con un dettaglio sufficiente a consentire all'autorità di verificare che il rischio sia stato valutato correttamente. \[laws-lois.justice.gc.ca/eng/regulations/SOR-2018-64/index.html ; guida OPC: priv.gc.ca/en/privacy-topics/business-privacy/breaches-and-safeguards/privacy-breaches-at-your-business/gd\_pb\_201810/\]

Proposta (Canada) \[NUOVA, forte\]: l'articolo 33(5) GDPR già richiede al titolare di documentare TUTTE le violazioni (incluse quelle non notificate), ma in termini generici \- senza prescrivere un registro formale, un periodo di conservazione o un livello di dettaglio. Il modello canadese (registro strutturato, conservazione minima di 2 anni, dettaglio sufficiente per la verifica del regolatore) offre un benchmark concreto. L'EDPB potrebbe dare forma operativa all'obbligo documentale dell'articolo 33(5) usando il modello canadese di record-keeping: accanto al template di notifica, offrire una struttura modello di registro interno allineata ai campi del template. Un titolare che ha compilato il template detiene già gran parte di un record ex articolo 33(5). Campi suggeriti per il registro, sul modello canadese: riferimento e data (o periodo) dell'incidente; circostanze e causa della violazione (se note); natura (C-I-D); tipo di incidente (tassonomia del template); categorie di dati e numeri approssimativi; esito della valutazione del rischio e metodologia (valore ENISA SE), incluso il caso in cui la conclusione sia "nessun rischio elevato"; se notificata all'Autorità e agli interessati (e, in caso negativo, la base motivata); misure adottate; conservazione del record per un minimo di 24 mesi. Il collegamento rafforza l'accountability e riduce la notifica difensiva (il titolare documenta internamente anziché notificare per precauzione). E questo registro non è soltanto proposto ma consegnato: l'implementazione di riferimento (Parte IV.7) include un modello di registro interno scaricabile (export CSV / XLS) che implementa esattamente questi campi, così che il titolare possa adottarlo direttamente.

### **III.6 \- Standard internazionali: allineamento con la ISO/IEC 27035**

Lo standard ISO/IEC 27035-1:2023 (gestione degli incidenti di sicurezza delle informazioni \- principi e processo) definisce un ciclo di vita e un vocabolario riconosciuti per la gestione degli incidenti: Plan & Prepare \-\> Detect \-\> Report \-\> Assess \-\> Respond \-\> Learn Lessons. \[iso.org/standard/78973.html \- ISO/IEC 27035-1:2023\]

Una precisazione importante: la ISO/IEC 27035 fornisce un ciclo di vita di processo e una terminologia, non una tassonomia chiusa dei tipi di violazione equivalente ai 25 tipi di incidente del template. Il valore è quindi l'allineamento di processo e terminologia, non una corrispondenza uno-a-uno dei tipi.

Proposta (ISO): l'EDPB potrebbe richiamare la ISO/IEC 27035 come ancora di interoperabilità per il ciclo di vita e il vocabolario degli incidenti, così che il processo interno di gestione degli incidenti di un titolare \- spesso già allineato a ISO 27035 / ISO 27001 \- alimenti la notifica GDPR senza una riclassificazione parallela. Il punto va inquadrato come interoperabilità e machine-readability (la terminologia di security operations esistente di un titolare dovrebbe mapparsi pulitamente sulla notifica), piuttosto che come corrispondenza letterale tipo-per-tipo. (Il testo normativo integrale della ISO/IEC 27035 è a pagamento; i riferimenti dovrebbero citare lo standard per numero e clausola senza riprodurre testo protetto.)

### **III.7 \- Sintesi del valore comparato**

Il template, già solido, può assorbire selettivamente quattro best practice mature: separazione pubblico/riservato (OAIC), auto-valutazione guidata (ICO), collegamento al registro interno ex articolo 33(5) (Canada), e ancoraggio della tassonomia a uno standard internazionale (ISO 27035). Sono miglioramenti incrementali, non riscritture, tutti coerenti con il disegno attuale.

## **Parte IV \- Standardizzazione machine-readable e canale M2M opzionale**

Nella sua versione 1.0 il template è di fatto già un modulo elettronico strutturato con logica condizionale, pensato per l'implementazione nei portali delle Autorità. Ciò apre un'opportunità che l'attuale documento Word non sfrutta ancora: standardizzare non solo il modulo visivo, ma il formato dati e il canale di trasmissione. Una nota su come leggere questo paper: i contributi si articolano in tre livelli \- (A) osservazioni essenziali sul template stesso (Parti I-III); (B) proposte tecniche opzionali che l'EDPB e le Autorità possono recepire a propria discrezione (questa Parte IV.1-IV.6); e (C) un allegato tecnico non vincolante (Parte IV.7). Gli elementi opzionali e prospettici sono volutamente tenuti separati dalle osservazioni essenziali, così che il nucleo del feedback alla consultazione possa essere letto autonomamente.

### **IV.1 \- La proposta**

Affiancare al modulo due artefatti tecnici aperti:

1\. Uno schema machine-readable (un JSON Schema dei campi): formalizza, in modo non ambiguo, la struttura, i tipi di dato, la logica condizionale e i vincoli. Lo schema diventa il "contratto" del formato, identico in tutta l'UE.  
2\. Un endpoint API ricevente (OpenAPI 3.1) per la trasmissione automatizzata machine-to-machine (M2M) delle notifiche dalle organizzazioni alle Autorità: le imprese con sistemi di gestione degli incidenti (SIEM/SOC, strumenti privacy GRC) potrebbero notificare direttamente dai propri strumenti anziché reinserire manualmente un modulo.

### **IV.2 \- Argomenti di policy**

\* Tempestività (articolo 33(1)): la trasmissione automatizzata riduce gli errori di trascrizione e accelera il rispetto del termine delle 72 ore, eliminando il reinserimento manuale di dati già presenti nei sistemi aziendali.  
\* Reale interoperabilità cross-border: un payload identico può essere indirizzato all'autorità di controllo capofila (articolo 56\) o, per i titolari extra-SEE, a più Autorità contemporaneamente \- superando operativamente la frammentazione che oggi impone moduli diversi in lingue diverse. È la traduzione tecnica della sezione cross-border del template.  
\* Coerenza con il disegno attuale: la logica condizionale integrata rende già il template un modulo elettronico; lo schema machine-readable è la sua naturale formalizzazione, non un'aggiunta esterna.  
\* Una tendenza UE consolidata: il reporting strutturato e machine-readable alle autorità è già la direzione della legislazione UE \- si vedano i template strutturati per il reporting dei major ICT incident sotto DORA e le notifiche multi-fase sotto NIS2. Un canale M2M per le notifiche di violazione GDPR si inserisce in questo percorso; non è un'anomalia.  
\* Precedente nazionale: il Garante italiano dispone di un canale telematico dal 2021 (docweb 9667201); l'API ne sarebbe la naturale evoluzione. Diverse altre Autorità disponevano di canali dedicati di notifica delle violazioni già prima del template: la CNIL francese usa la stessa logica a due fasi (una notifica iniziale entro 72 ore seguita da una supplementare), mentre Spagna (AEPD), Paesi Bassi (AP) e Irlanda (DPC) forniscono portali nazionali dedicati preesistenti (hub EDPB, 'How to notify a data breach to your DPA') \- sicché un canale machine-readable si innesta su una prassi consolidata anziché introdurne una del tutto nuova.

### **IV.3 \- Volontarietà e proporzionalità**

Il canale M2M va inteso come un'opzione, non un sostituto del modulo web. Le PMI senza sistemi automatizzati proseguono con il modulo; le organizzazioni con uno strumento SOC/GRC usano l'M2M. La proposta è perciò coerente e complementare con il "percorso PMI" (Parte I, Sezione 2): nessun onere aggiuntivo per i soggetti meno strutturati. Questi artefatti sono offerti come strumenti di soft harmonisation: l'EDPB può raccomandare un template ed emanare linee guida, e può rendere disponibili uno schema di riferimento e un'API, ma se adottare uno schema machine-readable comune o un canale M2M spetta alla valutazione dell'EDPB e delle Autorità sulla propria competenza e base giuridica. Le proposte tecniche di questa Parte sono quindi offerte, non imposte.

### **IV.4 \- Sicurezza del canale (articolo 32 by design)**

Un endpoint che riceve notifiche di violazione tratta esso stesso dati personali e informazioni di sicurezza sensibili: deve quindi essere a sua volta conforme all'articolo 32 GDPR, per non diventare un nuovo vettore di rischio. La proposta è security-by-design, con le seguenti misure (già specificate come requisiti nella specifica OpenAPI):

| \# | Misura | Funzione |
| :---- | :---- | :---- |
| 1 | TLS 1.3 \+ mTLS (mutual TLS) | Trasporto cifrato; sia l'organizzazione mittente sia l'Autorità si autenticano con certificati |
| 2 | OAuth 2.0 client credentials (token a vita breve, scoped) \+ mTLS | Difesa in profondità; l'identità titolare/DPO nel payload è legata al client autenticato (mappato a un titolare registrato), prevenendo notifiche contraffatte |
| 3 | Firma della richiesta \- JWS / HTTP Message Signatures (RFC 9421\) | Integrità e non ripudio: l'Autorità può provare CHI ha inviato la notifica e che il payload non è stato alterato. Giuridicamente cruciale: una notifica di violazione è un atto giuridico con termine di 72 ore |
| 4 | Idempotency-key | Evita duplicati in caso di ritrasmissione (guasto di rete durante le 72 ore); si collega alla logica follow-up/ritiro del template |
| 5 | Rate limiting per client | L'endpoint non deve diventare un vettore DoS |
| 6 | Audit log immutabile (mittente, timestamp, hash del payload) | Accountability ex articolo 32 \+ articolo 5(2) |
| 7 | Validazione server-side rispetto al JSON Schema | I payload malformati sono respinti; lo schema è il contratto |
| 8 | Versioning dell'API | Evoluzione dello schema senza rompere i client |

Il punto 3 (non ripudio crittografico) merita enfasi giuridica: trasformando la notifica in un messaggio firmato con prova di mittente e timestamp, l'API rafforza la certezza della conformità al termine delle 72 ore \- un beneficio sia per il titolare (prova di tempestività) sia per l'Autorità (prova di autenticità).

### **IV.5 \- Forward-compatibility con il single reporting entry point del Digital Omnibus**

Il Digital Omnibus propone un single entry point operato da ENISA ('report once, share many') che instrada le notifiche di incidente e di violazione tra NIS2, GDPR, DORA, eIDAS e CER: il soggetto notifica una volta, e il back-end instrada la presentazione alle autorità competenti. Il single entry point fa parte del più ampio pacchetto Digital Omnibus: una proposta della Commissione europea (19 novembre 2025\) che introduce un proposto nuovo articolo 23a della direttiva NIS2 e un punto di ingresso operato da ENISA. È ancora in procedura legislativa ordinaria, con adozione attesa nel corso del 2026; se adottato, il single entry point diventerebbe disponibile circa 18 mesi dopo l'entrata in vigore delle nuove misure (estendibili a 24 mesi se la Commissione rileva che il portale non soddisfa ancora i requisiti di integrità, affidabilità e riservatezza). Il template di violazione EDPB dovrebbe essere progettato fin dall'inizio per essere compatibile con quel modello dati di punto unico, così che un'unica presentazione strutturata possa soddisfare più regimi. Ciò trasforma il template da silo GDPR a nodo GDPR di un tessuto di reporting pan-regolatorio \- allineandosi all'agenda di semplificazione della stessa Commissione.

Inquadramento importante: il single entry point è, al momento della stesura, una proposta della Commissione europea (19 novembre 2025\) ancora in procedura legislativa ordinaria, con adozione attesa nel corso del 2026\. Non è ancora norma vigente (ed è distinto dal file 'Digital Omnibus on AI', approvato dal Parlamento europeo il 16 giugno 2026). Questa raccomandazione è dunque formulata in senso strettamente di forward-compatibility / anticipazione di una proposta in corso, non come conformità a un obbligo esistente.

Proposta: assicurare che il modello dati del template (nomi dei campi, vocabolario controllato, identificatori) sia progettato per essere forward-compatible con lo schema del punto unico previsto dalla proposta di Digital Omnibus, così che \- se e quando adottato \- la notifica GDPR possa essere emessa o consumata dal punto unico comune senza rimappatura. \[Parere congiunto EDPB-EDPS 2/2026 sul Digital Omnibus: edpb.europa.eu/system/files/2026-02/edpb\_edps\_jointopinion\_202602\_digitalomnibus\_en.pdf ; art. 23 NIS2: eur-lex.europa.eu/eli/dir/2022/2555/oj\]

### **IV.6 \- Consistenza multilingue del vocabolario controllato**

Con oltre 27 Autorità che implementano il template, le enumerazioni (tipi di incidente, categorie di dati, esenzioni) devono essere semanticamente identiche tra le lingue, per evitare una deriva "stesso campo, significato diverso" tra i portali nazionali.

Proposta: l'EDPB dovrebbe mantenere il vocabolario controllato centralmente con chiavi stabili e indipendenti dalla lingua, vincolando le traduzioni a tali chiavi. Lo schema di riferimento (IV.7) già lo implementa: le enumerazioni usano chiavi semantiche stabili (es. loss\_of\_confidentiality, o codici a lettera a/b/c) così che il valore trasmesso sia identico in tutte le 24 lingue UE \- cambia solo l'etichetta visualizzata, mai il valore. Due Autorità che operano in lingue diverse ricevono perciò lo stesso payload. Questo è il fondamento tecnico della consistenza multilingue, e collega gli obiettivi di consistenza multilingue, punto unico e machine-readability.

### **IV.7 \- Implementazione di riferimento (allegato)**

Per rendere concreta la proposta, una prima implementazione di riferimento è allegata a questo paper come contributo tecnico non vincolante rilasciato in CC BY 4.0:

\* Un JSON Schema (Draft 2020-12) del payload di notifica derivato dal template v1.0: 100 campi di input (su 126 righe totali, 26 delle quali di sezione/struttura), di cui 42 sempre obbligatori, 46 condizionali e 12 opzionali.  
\* Tassonomie complete riprodotte fedelmente: 25 tipi di incidente, 21 categorie di dati (a-u), 6 cause, 3 livelli di severità, 3 esenzioni dell'articolo 34(3), la triade C-I-D, la classificazione NACE, gli elenchi completi delle autorità di controllo SEE. 90 dei 100 campi sono ancorati a specifici articoli del GDPR.  
\* Logica condizionale (visible\_if / required\_if) trascritta integralmente dalla colonna "business logic" del template.  
\* Una fase di pre-valutazione guidata (Parte I, Sezione 3), una mappatura ISO/IEC 27035 della tassonomia degli incidenti (Parte III.6), un modello di registro delle violazioni ex articolo 33(5) scaricabile (export CSV / XLS, Parte III.5) e uno schema di statistica aggregata e anonimizzata di trasparenza (Parte III.4) con soppressione delle celle piccole (k \>= 5).

Metodo: estrazione a livello di cella dalla tabella nativa del file .docx ufficiale, con due parsing indipendenti e riconciliazione tramite diff (zero ambiguità di confine cella). La specifica OpenAPI 3.1, con i securitySchemes di IV.4, è completa (OpenAPI 3.1.0, security schemes mTLS e OAuth2, le otto misure dell'articolo 32 della Sezione IV.4 documentate, validata su un mock server testato) e sarà rilasciata alle stesse condizioni alla pubblicazione. Implementazione di riferimento e artefatti tecnici (CC BY 4.0): repository https://github.com/NicklawAI/edpb-breach-notification-assistant ; landing page https://nicklawai.github.io/edpb-breach-notification-assistant/ ; tool offline https://nicklawai.github.io/edpb-breach-notification-assistant/tool.html ; JSON Schema https://github.com/NicklawAI/edpb-breach-notification-assistant/blob/main/src/schema/breach-notification.schema.json ; OpenAPI 3.1 https://github.com/NicklawAI/edpb-breach-notification-assistant/blob/main/api/openapi.yaml ; esempio registro Art.33(5) https://github.com/NicklawAI/edpb-breach-notification-assistant/blob/main/paper/breach-register.example.csv ; esempio aggregate-transparency https://github.com/NicklawAI/edpb-breach-notification-assistant/blob/main/paper/aggregate-transparency.example.json.

Avvertenza: lo schema è un riferimento tecnico di interoperabilità, non un canale di presentazione \- il template resta in consultazione e non è utilizzabile per notifiche reali finché le Autorità non lo implementano.

Mappa campo GDPR \- articolo (inline):

| Articolo GDPR | Campi | Tema |
| :---- | :---- | :---- |
| Art. 4(12); Art. 33(3)(a) | 55 | Definizione e natura della violazione |
| Art. 33(1) | 44-53 | Timeline e termine 72h (consapevolezza/rilevamento) |
| Art. 33(2); Art. 28; Art. 26 | 38-41 | Coinvolgimento responsabile / contitolare |
| Art. 33(3)(a) | 10-19, 21-26, 56-63, 65-68, 70-73 | Identità titolare \+ categorie e numeri di interessati/registrazioni |
| Art. 33(3)(b) | 29-31, 33-36 | DPO / punto di contatto |
| Art. 33(3)(c) | 79-87 | Probabili conseguenze e severità |
| Art. 33(3)(d) | 92, 94-95 | Misure adottate / proposte / preventive |
| Art. 32; Art. 33(3) | 75-76 | Misure di sicurezza in essere |
| Art. 33(1); Art. 34(1) | 89-90 | Valutazione del rischio / soglia di rischio elevato |
| Art. 34(1); Art. 34(2) | 97-99, 102-106 | Comunicazione agli interessati |
| Art. 34(3)(a)(b)(c) | 100-101 | Esenzioni dalla comunicazione agli interessati |
| Art. 56 | 113-118 | Trattamento cross-border / autorità capofila (sportello unico) |
| Art. 3(2) | 120-123 | Titolare extra-SEE / extraterritorialità |

## **Parte V \- Sintesi delle proposte**

Dalle osservazioni generali e di campo (Parti I-II):

1\. Introdurre un "percorso PMI" semplificato basato sul minimo dell'articolo 33(3).  
2\. Ancorare il campo 90 alla ENISA SEV (SE \= DPC x EI \+ CB; SE \>= 2 come soglia operativa indicativa, ferma restando la valutazione caso per caso ai sensi degli articoli 33 e 34\) \+ mappatura indicativa dei livelli; lasciare che il valore calcolato pre-compili il template.  
3\. Chiarire/allineare la scala di severità (3 vs 4 livelli).  
4\. Chiarire che il template armonizza il formato, non il canale (nessun punto di presentazione unico).  
5\. Campo strutturato di motivazione per il ritiro della notifica.  
6\. Flag e data della notifica responsabile \-\> titolare ex articolo 33(2).  
7\. Collegare, nella logica condizionale, il campo cifratura all'esenzione dell'articolo 34(3)(a).  
8\. Riferimento esplicito al coordinamento con le notifiche NIS2/DORA/altre autorità.  
9\. Indicazioni su formato/dimensione degli allegati.

Dal confronto internazionale (Parte III):

10\. \[NUOVA\] Una struttura a due livelli pubblico/riservato sul modello OAIC (Australia), così che il template serva anche la comunicazione ex articolo 34\.  
11\. Una pre-valutazione guidata "notificare o no" a monte, sul modello ICO (Regno Unito), per ridurre le notifiche difensive.  
12\. \[NUOVA\] Un collegamento al registro interno delle violazioni ex articolo 33(5) GDPR sul modello canadese di record-keeping, con una struttura modello allineata ai campi del template.  
13\. Allineare il vocabolario e il ciclo di vita degli incidenti alla ISO/IEC 27035 (interoperabilità di processo/terminologia, non una mappatura letterale dei tipi).  
14\. \[modello concreto\] Proporre un modello concreto di trasparenza aggregata e anonimizzata sul modello California, derivato dal vocabolario controllato del template (tipo di incidente, causa, categorie di dati, banda di severità, settore, conteggi di interessati in fasce, flag articolo 34), a granularità di conteggio per categoria per periodo di riferimento, con garanzie di soppressione celle piccole / k-anonimato (minimo raccomandato k \>= 5\) e uno schema di riferimento nell'allegato, trasformando la tassonomia in una base di evidenze paneuropea comparabile.  
15\. Indicare una tempistica e un periodo di coesistenza per la transizione dai moduli nazionali esistenti (es. lo strumento italiano del 2021).

Proposta tecnica (Parte IV):

16\. Standardizzare il formato dati (JSON Schema) e un canale API M2M opzionale per la trasmissione automatizzata dai sistemi aziendali alle Autorità \- security-by-design (mTLS, OAuth2, non ripudio JWS, audit immutabile), volontario e complementare al modulo per le PMI, coerente con la tendenza DORA/NIS2. Un'implementazione di riferimento open-source è disponibile come contributo tecnico in CC BY 4.0.  
17\. \[prospettico \- proposta non ancora adottata\] Progettare il template in modo forward-compatible con il single reporting entry point del Digital Omnibus (un'unica presentazione strutturata che serve NIS2/GDPR/DORA/eIDAS/CER). NB: il single reporting entry point è una proposta della Commissione europea (un proposto articolo 23a NIS2, 19 novembre 2025\) ancora in procedura legislativa ordinaria, con adozione attesa nel corso del 2026; qui inquadrata come anticipazione, non come norma vigente.  
18\. \[prospettico\] Mappare i sotto-tipi preliminare/completa/follow-up del template sulla timeline scaglionata NIS2 (24h/72h/1 mese) per un reporting multi-regime non duplicativo.  
19\. Consentire il calcolo di una banda di severità proposta a partire dagli input ENISA dichiarati dal titolare (DPC/EI/CB) \- un giudizio qualitativo del titolare, non una valutazione del rischio automatizzata \- per la comparabilità tra Autorità e le analisi EDPB.  
20\. Mantenere il vocabolario controllato centralmente con chiavi stabili e indipendenti dalla lingua, per garantire la consistenza multilingue tra oltre 27 Autorità.  
21\. Abilitare la cardinalità a selezione multipla (multi-valore) sui campi intrinsecamente multi-valore \- natura della violazione (C/I/A), categorie di dati personali e di interessati, conseguenze probabili e misure in essere/proposte \- mantenendo la selezione singola per il tipo di incidente primario per preservare la comparabilità della tassonomia. L'implementazione di riferimento rappresenta già questi campi come array.

## **Parte VI \- Licenza e libera adozione**

Questo position paper e i suoi allegati tecnici (JSON Schema, catalogo dei campi, mappatura ISO/IEC 27035, specifica OpenAPI e la pre-valutazione guidata) sono rilasciati con licenza Creative Commons Attribuzione 4.0 Internazionale (CC BY 4.0).

Gli artefatti sono resi disponibili per l'adozione da parte dell'EDPB, delle Autorità nazionali di controllo e di qualunque istituzione UE, senza restrizioni oltre l'attribuzione agli autori, Nicola Franchetto e Martim Taborda Barata. Ai sensi della CC BY 4.0, le Autorità sono libere di adottare, adattare, implementare e ridistribuire lo schema, le tabelle di mappatura e l'implementazione di riferimento, anche nei propri portali. Gli artefatti sono disponibili nel repository pubblico (https://github.com/NicklawAI/edpb-breach-notification-assistant); le Autorità e le istituzioni che intendono aderire possono farlo tramite il form di adesione del repository (https://github.com/NicklawAI/edpb-breach-notification-assistant/issues/new?template=adhere.yml), con i firmatari elencati in https://github.com/NicklawAI/edpb-breach-notification-assistant/blob/main/SIGNATORIES.md. Il trattamento dei dati personali dei firmatari è descritto nell'informativa privacy (https://github.com/NicklawAI/edpb-breach-notification-assistant/blob/main/PRIVACY.md ; versione IT: https://github.com/NicklawAI/edpb-breach-notification-assistant/blob/main/PRIVACY.it.md).
