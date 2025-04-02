class SpeechRecognitionHandler {
    constructor() {
        this.recognition = null;
        this.isListening = false;
        this.selectedMenuItem = null;  // Per tenere traccia dell'elemento selezionato
        this.isPressed = false; //long press
        this.receivedVoiceInput = null;
        this.menuVocalActions = {}; // Oggetto per memorizzare le azioni da click vocale legate ai componenti
        this.menuMouseActions = {};
        this.isDoingCombinedAction = false;
        this.customVocalCommands = {}; // Nuovo oggetto per comandi personalizzati
        this.menuAliases = {}; //nuovo oggetto per gli alias
        this.combinedActions = {}; //nuovo oggetto per memorizzare le azioni da eseguire mouse+voce
        this.initRecognition()

    }


    /**
     * Inizializza il riconoscimento vocale utilizzando l'API webkitSpeechRecognition.
     * Se supportato dal browser, avvia il riconoscimento continuo della voce.
     *
     * - Imposta la lingua su italiano (`it-IT`).
     * - Attiva il riconoscimento continuo per restare in ascolto.
     * - Gestisce gli errori e riavvia il riconoscimento in caso di interruzione.
     *
     * @throws {Error} Se il browser non supporta il riconoscimento vocale, mostra un alert.
     */
    initRecognition() {
        if ('webkitSpeechRecognition' in window) {
            this.recognition = new webkitSpeechRecognition();
            this.recognition.continuous = true;  // Mantieni il riconoscimento in ascolto
            this.recognition.interimResults = true;  // Mostra solo i risultati definitivi
            this.recognition.lang = 'it-IT';  // Imposta la lingua italiana

            /**
             * Evento chiamato quando vengono riconosciuti risultati vocali.
             * Estrae il testo trascritto e lo elabora.
             * La chiamata a ProcessVoiceCommand permette di avviare il
             * riconoscimento dei comandi vocali di base.
             *
             * @param {SpeechRecognitionEvent} event - L'evento del riconoscimento vocale.
             */
            this.recognition.onresult = (event) => {
                let transcript = event.results[event.resultIndex][0].transcript.toLowerCase().trim();
                this.updateOutput(transcript);
                this.processVoiceCommand(transcript);
            };

            /**
             * Evento chiamato in caso di errore nel riconoscimento vocale.
             * Registra l'errore nella console.
             *
             * @param {SpeechRecognitionErrorEvent} event - L'evento di errore.
             */
            this.recognition.onerror = (event) => {
                console.error('Errore riconoscimento vocale:', event.error);
            };

            /**
             * Evento chiamato quando il riconoscimento termina.
             * Se l'ascolto è ancora attivo (`isListening`), riavvia il riconoscimento.
             */
            this.recognition.onend = () => {
                if (this.isListening) {
                    this.recognition.start(); // Riavvia il riconoscimento vocale
                }
            };

        } else {
            alert("Il riconoscimento vocale non è supportato dal tuo browser.");
        }
    }


    /**
     * Attiva o disattiva il riconoscimento vocale.
     *
     * - Se il riconoscimento è attivo, lo ferma e imposta `isListening` su `false`.
     * - Se è disattivato, lo avvia (inizializzandolo se necessario) e imposta `isListening` su `true`.
     * - Aggiorna lo stato del pulsante di attivazione.
     */
    toggleListening() {
        if (this.isListening) {
            this.recognition.stop();  // Ferma il riconoscimento
            this.isListening = false;
        } else {
            if (!this.recognition) {
                this.initRecognition();
            }
            this.recognition.start();  // Avvia il riconoscimento
            this.isListening = true;
        }
        this.updateButton();
    }


    /**
     * Aggiorna l'output visivo con il testo fornito per 2 secondi.
     *
     * - Imposta il testo dell'elemento con id 'output' al valore fornito.
     * - Dopo 2 secondi, rimuove il testo dall'elemento.
     *
     * @param {string} text - Il testo da visualizzare nell'elemento di output.
     */
    updateOutput(text) {
        const outputDiv = document.getElementById('output');
        outputDiv.textContent = text;
        setTimeout(() => {
            outputDiv.textContent = '';
        }, 2000);
    }


    /**
     * Aggiorna lo stato del pulsante di attivazione del riconoscimento vocale.
     *
     * - Cambia il testo del pulsante in base allo stato di `isListening`.
     * - Aggiunge o rimuove la classe 'off' dal pulsante per riflettere lo stato attuale.
     *
     * @example
     * // Se il riconoscimento vocale è attivo, il pulsante mostrerà "Ferma Riconoscimento".
     * // Se il riconoscimento vocale è inattivo, mostrerà "Attiva Riconoscimento".
     */
    updateButton() {
        const button = document.getElementById('toggleButton');
        if (button) {
            button.textContent = this.isListening ? 'Ferma Riconoscimento' : 'Attiva Riconoscimento';
            button.classList.toggle('off', !this.isListening);
        }
    }


    /**
     * Elabora il comando vocale ricevuto e esegue l'azione corrispondente.
     *
     * - Converte eventuali alias di comandi nel nome effettivo del menu.
     * - Gestisce comandi predefiniti (attiva/ferma riconoscimento, seleziona [elemento], annulla, clicca).
     * - Gestisce comandi personalizzati.
     * - Esegue azioni basate su comandi che corrispondono a pattern regex.
     *
     * @param {string} command - Il comando vocale ricevuto da elaborare.
     *
     * @example
     * // Se il comando vocale è "avvia riconoscimento", verrà avviato il riconoscimento vocale.
     * // Se il comando è "clicca", verrà simulato un clic su un elemento del menu.
     */
    processVoiceCommand(command) {
        // 🔹 Se esiste un alias, lo converte nel nome dell'item effettivo
        let final_command = this.menuAliases[command] || command;

        if (final_command === "avvia riconoscimento") {
            if (!this.isListening) {
                this.toggleListening(); // attiva il riconoscimento
            }
        } else if (final_command === "ferma") {
            if (this.isListening) {
                this.toggleListening(); // ferma il riconoscimento
            }
        } else if (final_command.startsWith("seleziona ")) {
            // gestisce la selezione di un'elemento
            final_command = final_command.replace("seleziona ", "").trim();
            final_command = this.menuAliases[final_command] || final_command;
            this.selectMenuItem(final_command);
        } else if (final_command === "annulla") {
            this.clearSelection(); // annulla la selezione
        } else if (final_command === "clicca") {
            this.clickMenuItem(true); // esegue l'azione legata al click vocale
        } else if (this.customVocalCommands[final_command]) {
            // Se il comando è personalizzato, lo esegue
            this.customVocalCommands[final_command]();
        } else {
            // Verifica se esiste un comando con regex
            for (let regexCommand of this.customVocalCommands.regex || []) {
                if (regexCommand.regex.test(command)) {
                    regexCommand.callback(command);  // Esegui il callback se c'è corrispondenza
                }
            }
        }
        if (this.isPressed) { // se l'item subisce un long press
            this.receivedVoiceInput = final_command;
        }
    }



    /**
     * Seleziona un elemento e applica un'evidenziazione visiva.
     *
     * - Rimuove qualsiasi selezione precedente.
     * - Aggiunge una classe `selected` all'elemento per evidenziarlo.
     * - Memorizza l'elemento selezionato per eventuali azioni successive.
     *
     * @param {string} item - Il nome (ID) dell'elemento da selezionare.
     *
     * @example
     * // Se item è 'file', seleziona l'elemento con ID 'file' e lo evidenzia.
     */
    selectMenuItem(item) {
        const menuItem = document.getElementById(`${item}`);
        if (menuItem) {
            this.clearSelection();  // Rimuove la selezione precedente
            menuItem.classList.add('selected');  // Aggiunge la classe per evidenziare il menu
            this.selectedMenuItem = menuItem;  // Salva il menu selezionato
        }
    }



    /**
     * Rimuove la selezione corrente di un elemento del menu.
     *
     * - Rimuove la classe `selected` da tutti gli elementi del menu che sono selezionati.
     * - Resetta la variabile `selectedMenuItem` a `null` per indicare che non c'è nessun elemento selezionato.
     *
     * @example
     * // Rimuove la selezione di qualsiasi elemento che ha la classe 'selected'.
     */
    clearSelection() {
        document.querySelectorAll('.menu-item.selected').forEach(item => item.classList.remove('selected'));
        this.selectedMenuItem = null;
    }


    /**
     * Esegue l'azione personalizzata sull'elemento selezionato.
     *
     * - Se il comando proviene dalla voce, esegue l'azione vocale associata all'elemento selezionato.
     * - Se il comando proviene dal mouse, esegue l'azione associata al clic del mouse sull'elemento selezionato.
     *
     * @param {boolean} [fromVoiceCommand=true] - Indica se l'azione proviene da un comando vocale (default: `true`).
     */
    clickMenuItem(fromVoiceCommand = true) {
        //l'azione viene eseguita sull'elemento selezionato
        if (this.selectedMenuItem && fromVoiceCommand===true) {
            // Esegue l'azione vocale per l'elemento selezionato
            const action = this.menuVocalActions[this.selectedMenuItem.id];
            if (action) {
                action(this.selectedMenuItem);
            }
        }
        if (fromVoiceCommand===false) {
            // Esegue l'azione col mouse per l'elemento selezionato
            const action = this.menuMouseActions[this.selectedMenuItem.id];
            if (action) {
                action(this.selectedMenuItem);
            }
        }
    }


    /**
     * Gestisce ed esegue l'azione combinata di un elemento tramite pressione lunga del mouse e comando vocale.
     *
     * - Se viene rilevata una pressione lunga (long press) su un elemento insieme a un comando vocale
     * specifico, attiva un'azione combinata associata a quest'azione combinata.
     * - Imposta un timeout per distinguere tra pressione breve e lunga.
     *
     * @param {string} item_name - Il nome (ID) dell'elemento del menu su cui eseguire l'azione combinata.
     *
     * @example
     * // Se l'elemento con ID 'prenota' viene premuto brevemente, eseguirà l'azione associata a quel pulsante.
     * // Se l'elemento viene tenuto premuto e nel frattempo un comando vocale corrisponde, al rilascio del
     * long press eseguirà un'azione combinata.
     */
    combinedClickMenuItem(item_name) {
        const button = document.getElementById(item_name);
        if (!button) return;

        let timeout;
        let clickTimeout;
        this.receivedVoiceInput = null; // Reset ad ogni pressione
        let actionExecuted = false; // Flag per segnare se l'azione combinata è stata eseguita

        // Gestione della pressione del mouse (mousedown)
        button.addEventListener("mousedown", () => {
            console.log(`[DEBUG] ${item_name} premuto`);
            this.isPressed = true;
            this.receivedVoiceInput = null; // Reset per evitare vecchi comandi

            // Timeout per il long press
            timeout = setTimeout(() => {
                this.isDoingCombinedAction = true; // Azione combinata
                console.log("[DEBUG] Long press attivato");
            }, 1000); // Tempo per riconoscere la pressione lunga
        });

        // Gestione del rilascio del mouse (mouseup)
        button.addEventListener("mouseup", () => {
            clearTimeout(timeout); // Cancella il timeout del long press
            console.log(`[DEBUG] ${item_name} rilasciato`);
            this.isPressed = false; // Reset dopo rilascio

            // Se è stato un long press, non eseguire l'azione breve
            if (this.isDoingCombinedAction) {
                const combinedAction = this.combinedActions[item_name];
                if (combinedAction && this.receivedVoiceInput === combinedAction.keyword) {
                    console.log(`✅ Azione combinata per "${item_name}" con comando "${combinedAction.keyword}"`);
                    combinedAction.action(button); // Esegui l'azione combinata
                    actionExecuted = true; // Segna che l'azione combinata è stata eseguita
                }
                // Reset della flag per l'azione combinata dopo un timeout
                clickTimeout = setTimeout(() => {
                    this.isDoingCombinedAction = false;
                }, 600); // Dopo 600 ms reset della flag
            }

        });
    }



    /**
     * Associa un comando vocale a un'azione personalizzata per un elemento, senza eseguirla.
     *
     * - Quando viene riconosciuto il comando "clicca" e l'item è selezionato, l'azione personalizzata
     * specificata con onVocalClick viene eseguita.
     *
     * @param {string} itemName - Il nome (ID) dell'elemento del menu a cui associare il comando vocale.
     * @param {Function} action - L'azione che verrà eseguita quando il comando vocale associato viene attivato.
     *
     */
    onVocalClick(itemName, action) {
        this.menuVocalActions[itemName] = action;
    }



    /**
     * Associa ed esegue un'azione personalizzata al click del mouse su un elemento.
     *
     * - Quando l'elemento viene cliccato, viene subito eseguita l'azione associata
     * grazie all'event listener per il click.
     * - Se è in corso un'azione combinata (long press), il click viene bloccato.
     *
     * @param {string} itemName - Il nome (ID) dell'elemento del menu a cui associare l'azione di click del mouse.
     * @param {Function} action - L'azione che verrà eseguita al click del mouse sull'elemento del menu.
     *
     */
    onMouseClick(itemName, action) {
        this.menuMouseActions[itemName] = action;

        // Trova l'elemento e aggiungi l'evento onclick
        const menuElement = document.getElementById(`${itemName}`);
        if (menuElement) {
            // Gestione del click del mouse
            menuElement.addEventListener("click", (e) => {
                // Verifica se è in corso un'azione combinata
                if (this.isDoingCombinedAction) {
                    e.preventDefault(); // Blocca l'azione del click
                    console.log(`[DEBUG] Azione combinata in corso, click del mouse evitato per ${itemName}`);
                } else {
                    console.log(`[DEBUG] Click normale su ${itemName}`);
                    // Esegui l'azione di click del mouse solo se non è un'azione combinata
                    this.selectMenuItem(itemName);
                    action(menuElement);  // Esegue l'azione associata al click del mouse
                }
            });
        }
    }


    /**
     * Associa un'azione personalizzata ad una combinazione di input (ong press + comando vocale), senza eseguirla.
     *
     * - La combinazione di un long press e un comando vocale (indicato dalla keyword) eseguirà l'azione associata
     * tramite onCombinedClickMenuItem.
     *
     * @param {string} itemName - Il nome (ID) dell'elemento del menu per cui definire l'azione combinata.
     * @param {string} keyword - La parola chiave del comando vocale che attiva l'azione combinata.
     * @param {Function} action - L'azione che verrà eseguita quando la combinazione di long press e comando vocale
     * viene riconosciuta.
     *
     */
    onCombinedInput(itemName, keyword, action) {
        this.combinedActions[itemName] = { keyword, action };  // Associa la keyword e l'azione personalizzata al nome del menu
    }


    /**
     * Aggiunge un nuovo comando vocale personalizzato o una regex alla lista dei comandi vocali riconosciuti.
     *
     * - Se viene fornito un comando vocale come stringa, verrà associata una funzione di callback che
     * verrà eseguita quando il comando vocale viene riconosciuto.
     * - Se viene fornita una regex, verrà aggiunta alla lista di comandi basati su regex, eseguendo una funzione
     * di callback quando una corrispondenza è trovata.
     *
     * @param {string|RegExp} command - Il comando vocale da associare, che può essere una stringa o una regex.
     * @param {Function} callback - La funzione che verrà eseguita quando il comando vocale (o la regex) viene riconosciuto.
     *
     */
    addVocalCommand(command, callback) {
        if (typeof command === "string") {
            command = command.toLowerCase().trim();
            this.customVocalCommands[command] = callback;
        } else if (command instanceof RegExp) {
            // Aggiunge la regex alla lista delle regex
            this.customVocalCommands.regex = this.customVocalCommands.regex || [];
            this.customVocalCommands.regex.push({ regex: command, callback });
        }
    }

    /**
     * Aggiunge un alias a un elemento, permettendo l'uso di un comando vocale alternativo per selezionarlo.
     *
     * - Gli alias permettono di usare parole o frasi più brevi o personalizzate per selezionare un elemento del menu.
     *
     * @param {string} alias - L'alias vocale che si desidera associare all'elemento del menu.
     * @param {string} itemName - Il nome dell'elemento del menu (ID) a cui associare l'alias.
     *
     * @example
     * // Aggiunge un alias per l'elemento con ID "prenotazioneButton" nel menu
     * addVocalItemAlias('prenota', 'prenotazioneButton');
     * // Ora è possibile dire anche 'seleziona prenota' per selezionare l'elemento
     *
     */
    addVocalItemAlias(alias, itemName) {
        this.menuAliases[alias] = itemName;
    }

    /**
     * Restituisce l'elemento attualmente sotto il cursore del mouse.
     *
     * Utilizza il selettore `:hover` per raccogliere tutti gli elementi attualmente "hoverati"
     * (ovvero sotto il cursore). Restituisce l'ultimo elemento trovato nella lista degli elementi hoverati.
     * Se non ci sono elementi sotto il mouse, restituisce `null`.
     *
     * @returns {HTMLElement|null} L'elemento sotto il cursore del mouse, o `null` se non c'è nessun elemento.
     *
     * @example
     * // È utile quando l'utente non può eseguire un click dal mouse, ma può almeno trascinare il cursore sopra
     * il cursore sull'elemento che vuole cliccare. Quindi, può essere usato per recuperare l'elemento e attivare
     * un click con un comando vocale.
     */
    getElementUnderMouse() {
        const hoveredElements = Array.from(document.querySelectorAll(':hover'));
        return hoveredElements[hoveredElements.length - 1] || null;
    }



    /**
     * Verifica se l'elemento è "non-interagibile", per gestire i conflitti tra i vari tipi di interazione.
     *
     * Controlla se l'elemento passato come parametro contiene la classe `non-interagibile`.
     * Se l'elemento ha questa classe, significa che non può essere cliccato.
     *
     * @param {HTMLElement} element - L'elemento HTML da verificare.
     * @returns {boolean} `true` se l'elemento è "non-interagibile", `false` altrimenti.
     *
     */    isElementNonInteractive(element) {
        return element && element.classList.contains("non-interagibile");
    }



    /**
     * Imposta l'elemento come interagibile o non-interagibile.
     *
     * Se `isInteractive` è `true`, rimuove la classe `non-interagibile` dall'elemento, rendendolo interagibile.
     * Se `isInteractive` è `false`, aggiunge la classe `non-interagibile` all'elemento, rendendolo non interagibile.
     *
     * @param {HTMLElement} element - L'elemento HTML da rendere interagibile o non interagibile.
     * @param {boolean} isInteractive - Se `true`, l'elemento diventa interagibile. Se `false`, l'elemento diventa non interagibile.
     *
     */
    setElementInteractive(element, isInteractive) {
        if (element) {
            if (isInteractive) {
                element.classList.remove("non-interagibile");
            } else {
                element.classList.add("non-interagibile");
            }
        }
    }


    /**
     * Verifica se una stringa contiene una parola chiave.
     *
     * Controlla se la `keyword` è presente all'interno della `stringa`.
     * La ricerca è sensibile al maiuscolo/minuscolo.
     *
     * @param {string} stringa - La stringa in cui cercare la parola chiave.
     * @param {string} keyword - La parola chiave da cercare all'interno della stringa.
     * @returns {boolean} `true` se la parola chiave è presente nella stringa, `false` altrimenti.
     *
     */
     containsKeyword(stringa, keyword){
            return stringa.includes(keyword);
        }


    /**
     * Mostra un overlay personalizzato per un elemento `select` con le sue opzioni.
     *
     * Quando viene chiamata, questa funzione crea un overlay sopra la pagina, mostrando le opzioni di un `select`
     * in un formato personalizzato. L'utente può cliccare su un'opzione per selezionarla, e l'overlay verrà rimosso
     * una volta selezionata un'opzione. Inoltre, se si clicca fuori dall'overlay, quest'ultimo viene chiuso.
     *
     * @param {string} selectId - L'ID dell'elemento `select` di cui si vogliono mostrare le opzioni in un overlay.
     *
     * @example
     * // È utile per l'utilizzo vocale di elementi di tipo select, quando cliccati attraverso l'uso di una grid
     * numerata, dove ad ogni numero corrisponde un elemento dell'interfaccia.
     */
    showSelectOverlay(selectId) {
        const elemento = document.getElementById(selectId);

        // Verifica se esiste già un overlay e, in tal caso, si rimuove
        const existingOverlay = document.querySelector('.overlay');
        if (existingOverlay) {
            existingOverlay.remove();
        }

        // Crea l'elemento overlay
        const overlay = document.createElement('div');
        overlay.classList.add('overlay');

        // Crea il contenitore del contenuto
        const content = document.createElement('div');
        content.classList.add('overlay-content');

        // Crea la lista delle opzioni
        const ul = document.createElement('ul');

        // Itera sulle opzioni del select
        Array.from(elemento.options).forEach(option => {
            const li = document.createElement('li');
            li.textContent = option.text;

            // Aggiunge un evento click per selezionare l'opzione
            li.addEventListener('click', () => {
                // Imposta il valore del select in base all'opzione scelta
                elemento.value = option.value;
                // Dispatch dell'evento change se necessario
                elemento.dispatchEvent(new Event('change'));
                // Rimuove l'overlay
                document.body.removeChild(overlay);
            });

            ul.appendChild(li);
        });

        content.appendChild(ul);
        overlay.appendChild(content);
        document.body.appendChild(overlay);

        // Aggiunge un listener per rimuovere l'overlay quando si clicca fuori dal contenuto
        overlay.addEventListener('click', (e) => {
            // Se il click è fuori dal contenuto, rimuove l'overlay
            if (e.target === overlay) {
                document.body.removeChild(overlay);
            }
        });
    }
}
