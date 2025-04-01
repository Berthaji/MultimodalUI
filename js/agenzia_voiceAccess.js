document.addEventListener('DOMContentLoaded', function () {
    window.speechHandler = new SpeechRecognitionHandler();

    document.getElementById('toggleButton').addEventListener('click', function () {
        window.speechHandler.toggleListening();
    });

    // Click con voce e mouse hover
    let elementoSottoMouse = null;
    document.addEventListener('mousemove', function(event) {
        // event.target è l'elemento su cui si trova il mouse
        elementoSottoMouse = event.target;
        //console.log("mousemove attivato", event.target);
        // (Opzionale) Puoi controllare se si tratta di un link (elemento <a>)
        if (elementoSottoMouse.tagName === 'A') {
            console.log("Il mouse punta un link");
        } else if(elementoSottoMouse.tagName === 'SELECT'){
            console.log("Il mouse punta una tendina di selezione");
        } else if(elementoSottoMouse.tagName === 'INPUT'){
            console.log("Il mouse punta un campo di input");
        } else if(elementoSottoMouse.tagName === 'BUTTON'){
            console.log("Il mouse punta un bottone");
        }
    });

    let lastClickedElement = null;  // Variabile per tenere traccia dell'elemento già cliccato

    // aggiunge il comando click
    window.speechHandler.addVocalCommand("click", () => {
        console.log("Comando vocale 'clicca' attivato");

        if (elementoSottoMouse) {
            console.log("Elemento cliccato:", elementoSottoMouse);

            // Controlla se l'elemento è già stato cliccato di recente
            if (lastClickedElement === elementoSottoMouse) {
                console.log("L'elemento è già stato cliccato recentemente.");
                return;  // Esci dalla funzione se l'elemento è già stato cliccato
            }

            // Aggiorna l'elemento cliccato recentemente
            lastClickedElement = elementoSottoMouse;

            // Crea un evento MouseEvent per simulare il click
            let evt = new MouseEvent('click', {
                bubbles: true,
                cancelable: true,
                view: window
            });

            // Esegui l'azione in base al tipo dell'elemento
            let tag = elementoSottoMouse.tagName.toLowerCase();

            if (tag === 'a' || tag === 'button') {
                // Per <a> e <button>, possiamo semplicemente eseguire il click
                elementoSottoMouse.dispatchEvent(evt);
            } else if (tag === 'select') {
                // Per <select>, dobbiamo aprire la tendina
                showSelectOverlay(elementoSottoMouse.id);
            } else if (tag === 'input' && elementoSottoMouse.type === 'date') {
                // Per <input type="date">, cerchiamo di aprire il picker data
                if (typeof elementoSottoMouse.showPicker === 'function') {
                    elementoSottoMouse.showPicker(); // Usa il picker se il browser lo supporta
                } else {
                    elementoSottoMouse.focus();
                    elementoSottoMouse.dispatchEvent(evt); // Simula il click per altri browser
                }
            } else if (tag === 'input') {
                // Per gli altri tipi di input, basta fare focus e dispatchare l'evento
                elementoSottoMouse.focus();
                elementoSottoMouse.dispatchEvent(evt);
            } else {
                // Per altri tipi di elementi, esegui semplicemente il click
                elementoSottoMouse.dispatchEvent(evt);
            }

            // Imposta un timeout per resettare l'elemento cliccato dopo un breve periodo (es. 1 secondo)
            setTimeout(() => {
                lastClickedElement = null;  // Resetta l'elemento cliccato dopo 1 secondo
            }, 1000);

        } else {
            console.log("Nessun elemento sotto il mouse al momento del comando.");
        }
    });

    // mostra un overlay per il select come per agenzia.js
    function showSelectOverlay(selectId) {
        var elemento = document.getElementById(selectId);

        // Verifica se esiste già un overlay e, in tal caso, rimuovilo
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

            // Aggiungi un evento click per selezionare l'opzione
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

        // Aggiungi un listener per rimuovere l'overlay quando si clicca fuori dal contenuto
        overlay.addEventListener('click', (e) => {
            // Se il clic è fuori dal contenuto, rimuove l'overlay
            if (e.target === overlay) {
                document.body.removeChild(overlay);
            }
        });
    }

    // controlla che una stringa contenga una determinata keyword
    function containsKeyword(stringa, keyword){
        return stringa.includes(keyword);
    }

    // Controlla le keyword per capire quale oggetto disattivare in quanto lo si sta modificando
    var output = document.getElementById('output');

    // Crea un observer per monitorare i cambiamenti del contenuto
    var observer = new MutationObserver(function (mutationsList) {
        mutationsList.forEach(function (mutation) {
            if (mutation.type === 'childList' || mutation.type === 'characterData') {
                aggiornaInterattività(output.textContent);
            }
        });
    });

    // Configura il MutationObserver per monitorare il nodo di testo dentro "output"
    observer.observe(output, { childList: true, characterData: true, subtree: true });

    // aggiorna interattività come per agenzia.js
    function aggiornaInterattività(testo) {
        console.log("aggiorno interattività")
        if (testo.trim() === "") {
            setTimeout(function() {
                // Qui scrivi il codice da eseguire dopo l'attesa
                document.getElementById("destination").classList.remove("non-interagibile");
                document.getElementById("destination").style.backgroundColor = "white";

                document.getElementById("departure").classList.remove("non-interagibile");
                document.getElementById("departure").style.backgroundColor = "white";

                document.getElementById("return").classList.remove("non-interagibile");
                document.getElementById("return").style.backgroundColor = "white";
            }, 1500);

        } else {
            if (containsKeyword(testo, "scegli")) {
                document.getElementById("destination").classList.add("non-interagibile");
                document.getElementById("destination").style.backgroundColor = "red";
            } else if (containsKeyword(testo, "ritorno")) {
                document.getElementById("departure").classList.remove("non-interagibile");
                document.getElementById("departure").style.backgroundColor = "white";

                document.getElementById("return").classList.add("non-interagibile");
                document.getElementById("return").style.backgroundColor = "red";
            } else if (containsKeyword(testo, "partenza")) {
                document.getElementById("return").classList.remove("non-interagibile");
                document.getElementById("return").style.backgroundColor = "white";

                document.getElementById("departure").classList.add("non-interagibile");
                document.getElementById("departure").style.backgroundColor = "red";
            }
        }
    } //fine controllo keyword per gestire conflitti

    window.addEventListener('keydown', (event) => {
        if (event.key.toLowerCase() === 'm') {
            window.speechHandler.toggleListening();
        }
    });

    // mostra una stringa nela div di output
    function showMessage(msg) {
        const outputDiv = document.getElementById("output");
        outputDiv.textContent = msg;
        setTimeout(() => { outputDiv.textContent = ""; }, 3000);
    }

    // seleziona una destinazione
    function selectDestination(city) {
        const destinationSelect = document.getElementById("destination");
        destinationSelect.value = city;
        destinationSelect.dispatchEvent(new Event("change"));
    }

    // comandi scelta città
    const cityCommands = {
        "scegli roma": "Roma",
        "scegli parigi": "Parigi",
        "scegli new york": "New York",
        "scegli tokyo": "Tokyo"
    };

    // aggiunge ogni comando di scelta città
    Object.keys(cityCommands).forEach(command => {
        window.speechHandler.addVocalCommand(command, () => {
            selectDestination(cityCommands[command]);
            document.querySelector(".overlay").remove();
            showMessage(`Destinazione selezionata: ${cityCommands[command]}`);
        });
    });

    // Funzione per convertire il mese in numero
    function convertMonthNameToNumber(monthName) {
        const months = {
            "gennaio": "01", "febbraio": "02", "marzo": "03", "aprile": "04",
            "maggio": "05", "giugno": "06", "luglio": "07", "agosto": "08",
            "settembre": "09", "ottobre": "10", "novembre": "11", "dicembre": "12"
        };
        return months[monthName.toLowerCase()] || null;
    }

    // regex che controllano la sintassi dei comandi di partenza o ritorno
    const departureRegex = /partenza (\d{1,2})\s+(gennaio|febbraio|marzo|aprile|maggio|giugno|luglio|agosto|settembre|ottobre|novembre|dicembre)\s+(\d{4})/i;
    const returnRegex = /ritorno (\d{1,2})\s+(gennaio|febbraio|marzo|aprile|maggio|giugno|luglio|agosto|settembre|ottobre|novembre|dicembre)\s+(\d{4})/i;

    // Aggiungi il comando vocale "imposta partenza"
    window.speechHandler.addVocalCommand(departureRegex, (transcript) => {
        let departureMatch = transcript.match(departureRegex);
        if (departureMatch) {
            let day = departureMatch[1].padStart(2, '0');
            let month = convertMonthNameToNumber(departureMatch[2]);
            let year = departureMatch[3];
            let dateStr = `${year}-${month}-${day}`;
            document.getElementById("departure").value = dateStr;
            showMessage(`Data di partenza impostata: ${day}/${month}/${year}`);
        }
    });

    // Aggiungi il comando vocale "imposta ritorno"
    window.speechHandler.addVocalCommand(returnRegex, (transcript) => {
        let returnMatch = transcript.match(returnRegex);
        if (returnMatch) {
            let day = returnMatch[1].padStart(2, '0');
            let month = convertMonthNameToNumber(returnMatch[2]);
            let year = returnMatch[3];
            let dateStr = `${year}-${month}-${day}`;
            document.getElementById("return").value = dateStr;
            showMessage(`Data di ritorno impostata: ${day}/${month}/${year}`);
        }
    });

    // aggiunta del comando prenota
    window.speechHandler.addVocalCommand("prenota", () => {
        document.getElementById('bookButton').click();
        showMessage("Prenotazione avviata");
    });

    // prenotazione mediante click del mouse
    window.speechHandler.onMouseClick('bookButton', () => {
        let dest = document.getElementById("destination").value;
        let dep = document.getElementById("departure").value;
        let ret = document.getElementById("return").value;

        if (!dep || !ret) {
            alert("Seleziona entrambe le date per procedere!");
            return;
        }
        alert(`Viaggio prenotato per ${dest} dal ${dep} al ${ret}!`);
    });

    document.getElementById("destination").addEventListener("change", function () {
        showMessage(`Destinazione selezionata: ${this.value}`);
    });

    let labelsVisible = false;
    let activeCommands = [];

    // funziona che mostra le etichette numeriche per ogni elemento interattivo della pagina html
    function toggleNumericLabels() {
        const interactiveElements = document.querySelectorAll('button, a, input, select');
        const toggleButton = document.getElementById('toggleLabels');

        if (!labelsVisible) {
            // Inserisce le etichette accanto agli elementi
            interactiveElements.forEach((element, index) => {
                // Crea l'etichetta numerica
                const label = document.createElement('span');
                label.textContent = `[${index + 10}]`;
                label.style.color = 'black';
                //label.style.marginLeft = '0px';
                label.classList.add('numeric-label');

                // Inserisce l'etichetta subito dopo l'elemento
                element.parentNode.insertBefore(label, element.nextSibling);

                window.speechHandler.addVocalCommand((index + 10).toString(), () => {
                    // Assicurati di usare il tagName in minuscolo per confronti più sicuri
                    const tag = element.tagName.toLowerCase();

                    if (tag === 'button' || tag === 'a') {
                        // Per bottoni e link, basta eseguire il click
                        element.click();
                    } else if (tag === 'select') {
                        // Per i select, lo clicco per aprire la tendina
                        //element.focus(); // Porta il focus sul select
                        showSelectOverlay(element.id);
                    } else if (tag === 'input') {
                        // Per gli input, posso distinguere tra quelli di tipo date e gli altri
                        if (element.type === 'date') {
                            // Se il browser lo supporta, usa showPicker() (Chrome 93+ e simili)
                            if (typeof element.showPicker === 'function') {
                                element.showPicker();
                            } else {
                                // Altrimenti, prova a fare focus e click
                                element.focus();
                                element.click();
                            }
                        } else {
                            // Per input generici, basta fare focus per essere pronti alla scrittura
                            element.focus();
                        }
                    }
                });

            });

            // Aggiorna il testo del pulsante
            toggleButton.textContent = "Nascondi Etichette";
            labelsVisible = true;
        } else {
            // Rimuove tutte le etichette numeriche
            document.querySelectorAll('.numeric-label').forEach(label => label.remove());

            // Aggiorna il testo del pulsante
            toggleButton.textContent = "Mostra Etichette";
            labelsVisible = false;
        }
    }

    document.getElementById('toggleLabels').addEventListener('click', toggleNumericLabels);
});
