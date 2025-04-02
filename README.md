# Progetto di User Interface Technologies
## Gestione delle Dipendenze

Tutte le dipendenze sono gestite tramite il file `package.json` e il file di lock (`package-lock.json` o `yarn.lock`)

## Installazione delle Dipendenze

Dopo aver clonato il repository su un altro sistema, assicurati di avere Node.js e NPM installati, quindi esegui:

```bash
npm install
```
Questo comando installerà tutte le dipendenze elencate in package.json utilizzando le versioni specificate in package-lock.json.

Dopo aver fatto qualsiasi modifica al file JavaScript (attenzione, non quello dentro il .html) runnare il seguente comando su terminale:

```bash
npx webpack
```
Per eseguire il progetto su un server locale, è necessaria l'installazione di http-server:

```bash
npm install -g http-server
```

Per l'avvio del server basta eseguire il comando:

```bash
http-server
```


# ⚠️⚠️ATTENZIONE⚠️⚠️:
Tra diversi sistemi operativi, Windows e Mac (Apple) vi è una diversa gestione dei percorsi. Infatti, su
Windows i file locali dovrebbe essere letti con "/inizia/con/slash" mentre su Mac "inizia/senza/slash". Effettuare modifiche sui percorsi se si vede
che qualcosa non viene caricato correttamente (sia Javascript che forniscono le funzionalità agli html ma
anche le immagini), soprattutto nel caso non si utilizzi un server locale e si aprano i file accedendovi direttamente dalla cartella `html`.

# Get Started
Dopo essere arrivati sino a qui siamo pronti per visualizzare le prove di interazioni realizzate raggiungibili
mediante la pagina index.html, la quale porta a tutte le pagine delle prove. Da ogni pagina di prova poi si può 
tornare all'index mediante un comodo pulsante inserito nella pagina ipertestuale.

# Documentazione della Libreria SpeechRecognitionHandler

`SpeechRecognitionHandler` è una classe JavaScript che gestisce il riconoscimento vocale nel browser utilizzando l'API `webkitSpeechRecognition`. Permette di attivare e disattivare il riconoscimento, associare comandi vocali ad azioni personalizzate e combinare input vocali con interazioni del mouse.

## Costruttore
### `constructor()`
Inizializza la classe creando le variabili di stato e chiamando il metodo `initRecognition` per configurare il riconoscimento vocale.

- `this.recognition`: Oggetto per il riconoscimento vocale.
- `this.isListening`: Stato dell'ascolto.
- `this.selectedMenuItem`: Elemento selezionato nel menu.
- `this.isPressed`: Stato per la pressione lunga.
- `this.receivedVoiceInput`: Ultimo input vocale ricevuto.
- `this.menuVocalActions`: Mappa di azioni attivate tramite comandi vocali.
- `this.menuMouseActions`: Mappa di azioni attivate tramite il mouse.
- `this.isDoingCombinedAction`: Indica se è in corso un'azione combinata.
- `this.customVocalCommands`: Comandi vocali personalizzati.
- `this.menuAliases`: Alias per i comandi vocali.
- `this.combinedActions`: Azioni combinate (mouse + voce).

## Metodi

### `initRecognition()`
Inizializza il riconoscimento vocale se supportato dal browser, configurando:
- `continuous`: Mantiene l'ascolto attivo.
- `interimResults`: Mostra solo risultati definitivi.
- `lang`: Imposta la lingua italiana (`it-IT`).

Gestisce gli eventi:
- `onresult`: Riceve e processa i comandi vocali.
- `onerror`: Logga gli errori di riconoscimento.
- `onend`: Riavvia l'ascolto se `isListening` è attivo.

### `toggleListening()`
Avvia o ferma il riconoscimento vocale e aggiorna l'interfaccia utente.

### `updateOutput(text)`
Aggiorna il testo visualizzato in un `div` con `id='output'` e lo cancella dopo 2 secondi.

### `updateButton()`
Aggiorna il testo e lo stato di un pulsante con `id='toggleButton'` per riflettere l'attuale stato del riconoscimento vocale.

### `processVoiceCommand(command)`
Gestisce i comandi vocali:
- Se il comando ha un alias, lo converte nel nome reale.
- Gestisce comandi predefiniti (`avvia riconoscimento`, `ferma`, `seleziona`, `annulla`, `clicca`).
- Esegue comandi personalizzati.
- Supporta comandi con espressioni regolari.

### `selectMenuItem(item)`
Seleziona un elemento dato il suo `id` HTML, evidenziandolo con la classe `selected`.

### `clearSelection()`
Rimuove la selezione da tutti gli elementi del menu.

### `clickMenuItem(fromVoiceCommand = true)`
Esegue l'azione associata all'elemento selezionato:
- Se `fromVoiceCommand` è `true`, esegue l'azione vocale.
- Se `false`, esegue l'azione associata al mouse.

### `combinedClickMenuItem(item_Name)`
Gestisce ed esegue le azioni combinate (pressione lunga + comando vocale) per un elemento.

### `onVocalClick(itemName, action)`
Associa un'azione personalizzata a un comando vocale per un elemento.

### `onMouseClick(itemName, action)`
Associa un'azione personalizzata a un click del mouse su un elemento.

### `onCombinedInput(itemName, keyword, action)`
Registra un'azione combinata tra pressione lunga del mouse e comando vocale, registrato come keyword.

### `addVocalCommand(command, callback)`
Aggiunge un comando vocale personalizzato:
- Se `command` è una stringa, lo associa a una funzione.
- Se `command` è una regex, lo salva per future corrispondenze dinamiche.

### `addVocalItemAlias(alias, itemName)`
Aggiunge un alias per un elemento del menu, permettendo di selezionarlo con nomi alternativi.

### `getElementUnderMouse()`
Restituisce l'elemento attualmente sotto il cursore del mouse. È utile, per esempio, quando l'utente non può eseguire un click dal mouse, ma può almeno trascinare il cursore sopra l'elemento che vuole cliccare. Quindi, può essere usato per recuperare l'elemento e attivare
un click con un comando vocale.

### `isElementNonInteractive(element)`
Verifica se l'elemento è "non-interagibile", per gestire i conflitti tra i vari tipi di interazione.

### `setElementInteractive(element, isInteractive)`
Imposta l'elemento come interagibile o non-interagibile.

### `containsKeyword(stringa, keyword)`
Verifica se una stringa contiene una parola chiave. È utile per bloccare certi elementi, rendendoli non-interagibili, nel momento in cui viene rilevata una certa parola.

### `showSelectOverlay(selectId)`
Mostra un overlay personalizzato per un elemento `select` con le sue opzioni. È utile come metodo di supporto per il funzionamento corretto di questi elementi nel caso di interazione vocale.





# Descrizione delle prove di interazione
## Prova 0
> Riconoscimento vocale simile alla pagina di prova di Web Speech API che si può visitare
> al seguente link: <https://www.google.com/intl/it/chrome/demos/speech.html>

## Prova 1
> Contiene una prima interazione di elementi del sito web mediante voce. In particolare si
> interagisce con gli elementi di una lista, i quali cambiano colore.
> Con un click breve del mouse, il testo all'interno dell'elemento cliccato si colora di rosso.
> Utilizzando la selezione di un elemento e successivamente il click vocale, il background dell'elemento viene colorato.
> È presente una gestione dei conflitti, perciò se viene cliccato un elemento nel mentre che viene cliccato vocalmente e l'azione vocale è in esecuzione, il click manuale viene ignorato.
> Vengono introdotti i comandi vocali personalizzati. Nella demo, il comando vocale `colora` esegue l'azione legata al click vocale per ogni elemento della lista, a turno.

## Prova 2
> Vengono introdotti gli alias per dire parole diverse che si riferiscono allo stesso comando. In particolare, l'elemento della lista presente può essere selezionato con il comando `seleziona multiaction`, ovvero utilizzando il suo ID, oppure con il comando `seleziona bottone`.
> Il secondo obiettivo di questa demo è mostrare il funzionamento dei comandi combinati: effettuando un long press col mouse sull'elemento della lista e, nel frattempo, pronunciando il comando vocale `combinato`, al rilascio del long press il background dell'elemento si colora di rosso.
> Per distinguere dal comando combinato, in caso di azione vocale attivata dal comando `clicca` il background dell'elemento si colora di verde, in caso di click breve col mouse il testo dentro l'elemento si colora di verde.

## Agenzia Viaggi

> Viene inserita la classe "non-interagibile" e l'interazione "mouse hover - voce".
> Se infatti si dice "click" quando si ha il mouse sopra l'oggetto, questo viene
> cliccato.

## Agenzia Viaggi (Voice Access)

> Questa versione di agenzia viaggi consente di emulare la funzione di
> accessibilità di android "Voice Access" simile al controllo vocale di
> Windows. Si è aggiunta la classe "non-interagibile" per gestire i conflitti
> dell'interazione multimodale mouse-voce. Cliccando su mostra etichette vengono
> mostrate etichette numeriche (es. [10]) affianco agli elementi e se si attiva
> il riconoscimento vocale e si dice il numero dell'etichetta, si interagisce con
> l'elemento.

## Drag and Drop

> Questa prova di interazione multimodale implementa il drag and drop
> che può essere effettuato in maniera classica cliccando su un oggetto,
> tenendo premuto e rilasciando nel punto in cui si vuole spostare. Questo
> può essere fatto anche tramite la libreria di Speech Recognition nel
> seguente modo:
>
>> 1. attiva il riconoscimento vocale
>> 2. punta il mouse sull'oggetto da trascinare
>> 3. Dici "drag" e sposta l'oggetto dove vuoi
>> 4. Dici "drop" per rilasciare l'oggetto nella posizione del mouse
