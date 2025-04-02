document.addEventListener('DOMContentLoaded', function () {
    window.speechHandler = new SpeechRecognitionHandler();

    // Attiva/disattiva il riconoscimento vocale con il pulsante o il tasto "m"
    document.getElementById('toggleButton').addEventListener('click', function () {
        window.speechHandler.toggleListening();
    });

    function showMessage(msg) {
        const outputDiv = document.getElementById("output");
        outputDiv.textContent = msg;
        setTimeout(() => { outputDiv.textContent = ""; }, 3000);
    }

    // Gestione conflitti se sto usando mouse su un elemento, non lo posso modificare a voce
    document.addEventListener('mousedown', function (event) {
        let target = event.target;

        // Controlla se è un input, select o un campo data
        if (target.tagName === 'INPUT' || target.tagName === 'SELECT' || target.type === 'date') {
            window.speechHandler.setElementInteractive(target, false);
            console.log(`Elemento ${target.tagName} reso non interagibile con la voce`);
        }
    });

    document.addEventListener('blur', function (event) {
        let target = event.target;
        if (window.speechHandler.isElementNonInteractive(target)) {
            setTimeout(() => {
                if (document.activeElement !== target) {
                    window.speechHandler.setElementInteractive(target, true);
                    target.style.backgroundColor = "white";
                    console.log(`Elemento ${target.tagName} ora è di nuovo interagibile con la voce`);
                }
            }, 500);
        }
    }, true);

    // Click con voce e mouse hover
    let elementoSottoMouse = null;
    document.addEventListener('mousemove', function (event) {
        // event.target è l'elemento su cui si trova il mouse
        elementoSottoMouse = event.target;
        //console.log("mousemove attivato", event.target);
        // (Opzionale) Puoi controllare se si tratta di un link (elemento <a>)
        if (elementoSottoMouse.tagName === 'A') {
            console.log("Il mouse punta un link");
        } else if (elementoSottoMouse.tagName === 'SELECT') {
            console.log("Il mouse punta una tendina di selezione");
        } else if (elementoSottoMouse.tagName === 'INPUT') {
            console.log("Il mouse punta un campo di input");
        } else if (elementoSottoMouse.tagName === 'BUTTON') {
            console.log("Il mouse punta un bottone");
        }
    });

    let lastClickedElement = null; // Variabile per tenere traccia dell'elemento già cliccato
    // Funzione per il click del mouse simulato vocalmente
    window.speechHandler.addVocalCommand("click", () => {
        console.log("Comando vocale 'clicca' attivato");

        // Per sicurezza, ricava ancora l'elemento sotto il mouse
        elementoSottoMouse = window.speechHandler.getElementUnderMouse();
        if (elementoSottoMouse) {
            console.log("Elemento cliccato:", elementoSottoMouse);

            // Imposta l'elemento come non interagibile
            if (lastClickedElement===elementoSottoMouse || window.speechHandler.isElementNonInteractive(elementoSottoMouse)) {
                console.log("L'elemento è già stato cliccato o è non interagibile.");
                return;
            }

            window.speechHandler.setElementInteractive(elementoSottoMouse, false);
            elementoSottoMouse.style.backgroundColor = "red"; // Sfondo rosso

            lastClickedElement = elementoSottoMouse;

            let tag = elementoSottoMouse.tagName.toLowerCase();

            let evt = new MouseEvent('click', {
                bubbles: true,
                cancelable: true,
                view: window
            });

            if (tag === 'a' || tag === 'button') {
                elementoSottoMouse.dispatchEvent(evt);
            } else if (tag === 'select') {
                window.speechHandler.showSelectOverlay(elementoSottoMouse.id);
            } else if (tag === 'input' && elementoSottoMouse.type === 'date') {
                if (typeof elementoSottoMouse.showPicker === 'function') {
                    elementoSottoMouse.showPicker();
                } else {
                    elementoSottoMouse.focus();
                    elementoSottoMouse.dispatchEvent(evt);
                }
            } else if (tag === 'input') {
                elementoSottoMouse.focus();
                elementoSottoMouse.dispatchEvent(evt);
            } else {
                elementoSottoMouse.dispatchEvent(evt);
            }

            // Mantiene una copia dell'elemento per evitare problemi di riferimento
            let elementoDaResettare = elementoSottoMouse;

            // Gestisci il click
            window.speechHandler.selectMenuItem(elementoSottoMouse.id);
            window.speechHandler.clickMenuItem(false); // Falso per dire che non è un comando vocale, è un click del mouse


            setTimeout(() => {
                elementoDaResettare.classList.remove("non-interagibile");
                elementoDaResettare.style.removeProperty("background-color");
                console.log("Elemento ora interagibile:", elementoDaResettare);
                lastClickedElement = null;
            }, 1000);

        } else {
            console.log("Nessun elemento sotto il mouse al momento del comando.");
        }
    });

    // Controlla le keyword per capire quale oggetto disattivare in quanto lo si sta modificando
    let output = document.getElementById('output');

    // Crea un observer per monitorare i cambiamenti del contenuto
    var observer = new MutationObserver(function (mutationsList) {
        mutationsList.forEach(function (mutation) {
            if (mutation.type === 'childList' || mutation.type === 'characterData') {
                aggiornaInterattivita(output.textContent);
            }
        });
    });

    // Configura il MutationObserver per monitorare il nodo di testo dentro "output"
    observer.observe(output, { childList: true, characterData: true, subtree: true });

    // aggiorna ciò che può essere modificato o meno tramite una classe che viene aggiunta o
    // rimossa
    function aggiornaInterattivita(testo) {
        console.log("aggiorno interattività")
        if (testo.trim() === "") {
            setTimeout(function() {
                window.speechHandler.setElementInteractive(document.getElementById("destination"), true);
                window.speechHandler.setElementInteractive(document.getElementById("departure"), true);
                window.speechHandler.setElementInteractive(document.getElementById("return"), true);
            }, 1500);

        } else {
            if (window.speechHandler.containsKeyword(testo, "scegli")) {
                window.speechHandler.setElementInteractive(document.getElementById("destination"), false);
            } else if (window.speechHandler.containsKeyword(testo, "ritorno")) {
                window.speechHandler.setElementInteractive(document.getElementById("return"), false);
            } else if (window.speechHandler.containsKeyword(testo, "partenza")) {
                window.speechHandler.setElementInteractive(document.getElementById("departure"), false);
            }
        }
    }

    // Mappa dei comandi vocali per le città
    const cityCommands = {
        "scegli roma": "Roma",
        "scegli parigi": "Parigi",
        "scegli new york": "New York",
        "scegli tokyo": "Tokyo"
    };

    // Registra i comandi vocali per le città
    Object.keys(cityCommands).forEach(command => {
        window.speechHandler.addVocalCommand(command, () => {
            const destinationSelect = document.getElementById("destination");

            // Se l'elemento ha la classe "non-interagibile" ma non è attualmente in uso (non è focalizzato),
            // allora rimuovila così da poter eseguire il comando vocale.
            if (window.speechHandler.isElementNonInteractive(destinationSelect)) {
                if (document.activeElement !== destinationSelect) {
                    window.speechHandler.setElementInteractive(destinationSelect, true);
                    destinationSelect.style.backgroundColor = "white";
                    console.log("Elemento non più in uso, ripristino l'interattività vocale.");
                } else {
                    console.log("Il select è attualmente in uso, comando vocale ignorato.");
                    return;
                }
            }

            // Seleziona la destinazione
            selectDestination(cityCommands[command]);
            document.querySelector(".overlay")?.remove();
            showMessage(`Destinazione selezionata: ${cityCommands[command]}`);
        });
    });

    // Funzione per selezionare la destinazione
    function selectDestination(city) {
        const destinationSelect = document.getElementById("destination");
        destinationSelect.value = city;
        destinationSelect.dispatchEvent(new Event("change"));
    }

    // Funzione per convertire il mese in numero
    function convertMonthNameToNumber(monthName) {
        const months = {
            "gennaio": "01", "febbraio": "02", "marzo": "03", "aprile": "04",
            "maggio": "05", "giugno": "06", "luglio": "07", "agosto": "08",
            "settembre": "09", "ottobre": "10", "novembre": "11", "dicembre": "12"
        };
        return months[monthName.toLowerCase()] || null;
    }

    const departureRegex = /partenza (\d{1,2})\s+(gennaio|febbraio|marzo|aprile|maggio|giugno|luglio|agosto|settembre|ottobre|novembre|dicembre)\s+(\d{4})/i;
    const returnRegex = /ritorno (\d{1,2})\s+(gennaio|febbraio|marzo|aprile|maggio|giugno|luglio|agosto|settembre|ottobre|novembre|dicembre)\s+(\d{4})/i;

    // Aggiungi il comando vocale "imposta partenza"
    window.speechHandler.addVocalCommand(departureRegex, (transcript) => {
        const departureInput = document.getElementById("departure");

        // Se il campo è contrassegnato come non interagibile, ignoriamo il comando vocale.
        if (departureInput.classList.contains("non-interagibile")) {
            console.log("Il campo data di partenza è non interagibile, comando vocale ignorato.");
            return;
        }

        let departureMatch = transcript.match(departureRegex);
        if (departureMatch) {
            let day = departureMatch[1].padStart(2, '0');
            let month = convertMonthNameToNumber(departureMatch[2]);
            let year = departureMatch[3];
            let dateStr = `${year}-${month}-${day}`;
            departureInput.value = dateStr;
            showMessage(`Data di partenza impostata: ${day}/${month}/${year}`);
        }
    });

    // Aggiunge il comando vocale "imposta ritorno"
    window.speechHandler.addVocalCommand(returnRegex, (transcript) => {
        const returnInput = document.getElementById("return");

        // Se il campo è contrassegnato come non interagibile, ignoriamo il comando vocale.
        if (window.speechHandler.isElementNonInteractive(returnInput)) {
            console.log("Il campo data di ritorno è non interagibile, comando vocale ignorato.");
            return;
        }

        let returnMatch = transcript.match(returnRegex);
        if (returnMatch) {
            let day = returnMatch[1].padStart(2, '0');
            let month = convertMonthNameToNumber(returnMatch[2]);
            let year = returnMatch[3];
            let dateStr = `${year}-${month}-${day}`;
            returnInput.value = dateStr;
            showMessage(`Data di ritorno impostata: ${day}/${month}/${year}`);
        }
    });

    // Registra il comando vocale per la prenotazione
    window.speechHandler.addVocalCommand("prenota", () => {
        document.getElementById('bookButton').click();
        showMessage("Prenotazione avviata");
    });

    // Associa l'evento di click al pulsante Prenota
    window.speechHandler.onMouseClick('bookButton',() => {
        let dest = document.getElementById("destination").value;
        let dep = document.getElementById("departure").value;
        let ret = document.getElementById("return").value;

        if (!dep || !ret) {
            alert("Seleziona entrambe le date per procedere!");
            return;
        }
        alert(`Viaggio prenotato per ${dest} dal ${dep} al ${ret}!`);
    });

    // Aggiorna l'output quando si cambia la destinazione manualmente
    document.getElementById("destination").addEventListener("change", function () {
        showMessage(`Destinazione selezionata: ${this.value}`);
    });
});