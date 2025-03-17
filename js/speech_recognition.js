class SpeechRecognitionHandler {
    constructor() {
        this.recognition = null;
        this.isListening = false;
        this.selectedMenuItem = null;  // Per tenere traccia dell'elemento selezionato
        this.isPressed = false; //long press
        this.receivedVoiceInput = null;
        this.menuVocalActions = {}; // Oggetto per memorizzare le azioni da comando vocale
        this.menuMouseActions = {};
        this.isDoingCombinedAction = false;
        this.customVocalCommands = {}; // Nuovo oggetto per comandi personalizzati
        this.menuAliases = {}; //nuovo oggetto per dare un altro nome vocale a un item, tipo per dire "seleziona pippo" al posto di seleziona file
        this.combinedActions = {}; //nuovo oggetto per memorizzare le azioni da fare mouse+voce
        this.initRecognition()

    }

    initRecognition() {
        if ('webkitSpeechRecognition' in window) {
            this.recognition = new webkitSpeechRecognition();
            this.recognition.continuous = true;  // Mantieni il riconoscimento in ascolto
            this.recognition.interimResults = false;  // Mostra solo i risultati definitivi
            this.recognition.lang = 'it-IT';  // Imposta la lingua italiana

            this.recognition.onresult = (event) => {
                let transcript = event.results[event.resultIndex][0].transcript.toLowerCase().trim();
                this.updateOutput(transcript);
                this.processVoiceCommand(transcript);
            };

            this.recognition.onerror = (event) => {
                console.error('Errore riconoscimento vocale:', event.error);
            };

            this.recognition.onend = () => {
                if (this.isListening) {
                    this.recognition.start(); // Riavvia il riconoscimento vocale
                }
            };

        } else {
            alert("Il riconoscimento vocale non è supportato dal tuo browser.");
        }
    }

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

    updateOutput(text) {
        const outputDiv = document.getElementById('output');
        outputDiv.textContent = text;
        setTimeout(() => {
            outputDiv.textContent = '';
        }, 2000);
    }

    updateButton() {
        const button = document.getElementById('toggleButton');
        if (button) {
            button.textContent = this.isListening ? 'Ferma Riconoscimento' : 'Attiva Riconoscimento';
            button.classList.toggle('off', !this.isListening);
        }
    }

    processVoiceCommand(command) {

        // 🔹 Se esiste un alias, lo converte nel nome del menu effettivo
        let final_command = this.menuAliases[command] || command;

        if (final_command === "avvia riconoscimento") {
            if (!this.isListening) {
                this.toggleListening();
            }
        } else if (final_command === "ferma") {
            if (this.isListening) {
                this.toggleListening();
            }
        } else if (final_command.startsWith("seleziona ")) {
            final_command = final_command.replace("seleziona ", "").trim();
            final_command= this.menuAliases[final_command] || final_command;
            this.selectMenuItem(final_command);
        } else if (final_command === "annulla") {
            this.clearSelection();
        } else if (final_command === "clicca") {
            this.clickMenuItem(true);
        } else if (this.customVocalCommands[final_command]) {
            // Se il comando è personalizzato, eseguilo
            this.customVocalCommands[final_command]();
        }
        if(this.isPressed){ //se l'item subisce un long press
            this.receivedVoiceInput = final_command;
        }
    }

    // Seleziona l'elemento del menu
    selectMenuItem(menu) {
        const menuItem = document.getElementById(`${menu}`);
        if (menuItem) {
            this.clearSelection();  // Rimuove la selezione precedente
            menuItem.classList.add('selected');  // Aggiunge la classe per evidenziare il menu
            this.selectedMenuItem = menuItem;  // Salva il menu selezionato
        }
    }

    // Funzione per rimuovere la selezione
    clearSelection() {
        document.querySelectorAll('.menu-item.selected').forEach(item => item.classList.remove('selected'));
        this.selectedMenuItem = null;
    }

    // Funzione per eseguire l'azione personalizzata sul menu selezionato (vocale o mouse)
    clickMenuItem(fromVoiceCommand = true) {
        //l'azione viene eseguita sull'elemento selezionato, nel caso vocale
        if (this.selectedMenuItem && fromVoiceCommand===true) {
            // Esegui l'azione personalizzata per il menu selezionato
            const action = this.menuVocalActions[this.selectedMenuItem.id];
            if (action) {
                action(this.selectedMenuItem);
            }
        }
        if (fromVoiceCommand===false) {
            const action = this.menuMouseActions[this.selectedMenuItem.id];
            if (action) {
                action(this.selectedMenuItem);
            }
        }
    }

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

    //lega un comando vocale a un'azione personalizzata
    onVocalClick(menuName, action) {
        this.menuVocalActions[menuName] = action;
    }

    //lega ed esegue una funzione personalizzata al click del mouse
    onMouseClick(menuName, action) {
        this.menuMouseActions[menuName] = action;

        // Trova l'elemento e aggiungi l'evento onclick
        const menuElement = document.getElementById(`${menuName}`);
        if (menuElement) {
            // Gestione del click del mouse
            menuElement.addEventListener("click", (e) => {
                // Verifica se è in corso un'azione combinata
                if (this.isDoingCombinedAction) {
                    e.preventDefault(); // Blocca l'azione del click
                    console.log(`[DEBUG] Azione combinata in corso, click del mouse evitato per ${menuName}`);
                } else {
                    console.log(`[DEBUG] Click normale su ${menuName}`);
                    // Esegui l'azione di click del mouse solo se non è un'azione combinata
                    this.selectMenuItem(menuName);
                    action(menuElement);  // Esegui l'azione associata al click del mouse
                }
            });
        }
    }

    onCombinedInput(menuName, keyword, action) {
        this.combinedActions[menuName] = { keyword, action };
    }

    // *** Metodo per aggiungere nuovi comandi ***
    addVocalCommand(command, callback) {
        this.customVocalCommands[command.toLowerCase().trim()] = callback;
    }

    addVocalItemAlias(alias, itemName) {
        this.menuAliases[alias] = itemName;
    }



}

