class SpeechRecognitionHandler {
    constructor() {
        this.recognition = null;
        this.isListening = false;
        this.selectedMenuItem = null;  // Per tenere traccia dell'elemento selezionato
        this.menuVocalActions = {}; // Oggetto per memorizzare le azioni da comando vocale
        this.menuMouseActions = {};
        this.customCommands = {}; // Nuovo oggetto per comandi personalizzati
        this.initRecognition();
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
        if (command === "avvia riconoscimento") {
            if (!this.isListening) {
                this.toggleListening();
            }
        } else if (command === "ferma") {
            if (this.isListening) {
                this.toggleListening();
            }
        } else if (command.startsWith("seleziona ")) {
            this.selectMenuItem(command.replace("seleziona ", "").trim());
        } else if (command === "annulla") {
            this.clearSelection();
        } else if (command === "clicca") {
            this.clickSelectedMenuItem(true);
        } else if (this.customCommands[command]) {
            // Se il comando è personalizzato, eseguilo
            this.customCommands[command]();
        }
    }

    // Seleziona l'elemento del menu
    selectMenuItem(menu) {
        const menuItem = document.getElementById(`${menu}-menu`);
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

    // Funzione per eseguire il click sul menu selezionato
    clickSelectedMenuItem(fromVoiceCommand = true) {
        if (this.selectedMenuItem && fromVoiceCommand===true) {
            // Esegui l'azione personalizzata per il menu selezionato
            const action = this.menuVocalActions[this.selectedMenuItem.id.replace("-menu", "")];
            if (action) {
                action(this.selectedMenuItem);
            }
        }
        if (fromVoiceCommand===false) {
            const action = this.menuMouseActions[this.selectedMenuItem.id.replace("-menu", "")];
            if (action) {
                action(this.selectedMenuItem);
            }
        }
    }

    onVocalClick(menuName, action) {
        this.menuVocalActions[menuName] = action;
    }

    onMouseClick(menuName, action) {
        this.menuMouseActions[menuName] = action;

        // Trova l'elemento e aggiungi l'evento onclick
        const menuElement = document.getElementById(`${menuName}-menu`);
        if (menuElement) {
            menuElement.addEventListener("click", () => {
                this.selectMenuItem(menuName);
                this.clickSelectedMenuItem(false);  // false perché è un click del mouse
            });
        }
    }

    // *** Metodo per aggiungere nuovi comandi ***
    addVocalCommand(command, callback) {
        this.customCommands[command.toLowerCase().trim()] = callback;
    }
}

