document.addEventListener('DOMContentLoaded', function () {
    window.speechHandler = new SpeechRecognitionHandler();

    // Attiva/disattiva il riconoscimento vocale con il pulsante o il tasto "m"
    document.getElementById('toggleButton').addEventListener('click', function () {
        window.speechHandler.toggleListening();
    });
    window.addEventListener('keydown', (event) => {
        if (event.key.toLowerCase() === 'm') {
            window.speechHandler.toggleListening();
        }
    });

    // Funzione per mostrare un messaggio nell'output vocale
    function showMessage(msg) {
        const outputDiv = document.getElementById("output");
        outputDiv.textContent = msg;
        setTimeout(() => { outputDiv.textContent = ""; }, 3000);
    }

    // Funzione per selezionare la destinazione e simulare un cambio "manuale"
    function selectDestination(city) {
        const destinationSelect = document.getElementById("destination");
        destinationSelect.value = city; // imposta l'opzione corrispondente
        destinationSelect.dispatchEvent(new Event("change"));
    }

    // Aggiorna l'output quando l'utente cambia manualmente la destinazione
    document.getElementById("destination").addEventListener("change", function () {
        showMessage(`Destinazione selezionata: ${this.value}`);
    });

    // Mappa dei comandi vocali per le città
    const cityCommands = {
        "seleziona roma": "Roma",
        "seleziona parigi": "Parigi",
        "seleziona new york": "New York",
        "seleziona tokyo": "Tokyo"
    };

    // Estendiamo il metodo onresult per gestire manualmente i comandi vocali
    // (Nota: questo esempio presuppone che SpeechRecognitionHandler utilizzi la proprietà "recognition")
    const originalOnResult = window.speechHandler.recognition.onresult;
    window.speechHandler.recognition.onresult = function (event) {
        let transcript = event.results[event.resultIndex][0].transcript.toLowerCase().trim();
        console.log("Riconosciuto:", transcript);

        // Controlla se il testo riconosciuto corrisponde a uno dei comandi per le città
        Object.keys(cityCommands).forEach(command => {
            if (transcript.includes(command)) {
                selectDestination(cityCommands[command]);
                showMessage(`Destinazione selezionata: ${cityCommands[command]}`);
            }
        });

        // Gestione delle date e prenotazione (resta invariata)
        // Ad esempio, se dici "imposta partenza 20 marzo 2025"
        let departureRegex = /imposta partenza (\d{1,2})\s+(gennaio|febbraio|marzo|aprile|maggio|giugno|luglio|agosto|settembre|ottobre|novembre|dicembre)\s+(\d{4})/i;
        let departureMatch = transcript.match(departureRegex);
        if (departureMatch) {
            let day = departureMatch[1].padStart(2, '0');
            let month = convertMonthNameToNumber(departureMatch[2]);
            let year = departureMatch[3];
            let dateStr = `${year}-${month}-${day}`;
            document.getElementById("departure").value = dateStr;
            showMessage(`Data di partenza impostata: ${day}/${month}/${year}`);
        }

        let returnRegex = /imposta ritorno (\d{1,2})\s+(gennaio|febbraio|marzo|aprile|maggio|giugno|luglio|agosto|settembre|ottobre|novembre|dicembre)\s+(\d{4})/i;
        let returnMatch = transcript.match(returnRegex);
        if (returnMatch) {
            let day = returnMatch[1].padStart(2, '0');
            let month = convertMonthNameToNumber(returnMatch[2]);
            let year = returnMatch[3];
            let dateStr = `${year}-${month}-${day}`;
            document.getElementById("return").value = dateStr;
            showMessage(`Data di ritorno impostata: ${day}/${month}/${year}`);
        }

        // Se dici "prenota", simula il click sul pulsante Prenota
        if (transcript.includes("prenota")) {
            document.getElementById('bookButton').click();
        }

        // Chiamare anche il metodo originale (se necessario)
        if (typeof originalOnResult === "function") {
            originalOnResult.call(this, event);
        }
    };

    // Funzione per convertire il nome del mese italiano in numero a due cifre
    function convertMonthNameToNumber(monthName) {
        const months = {
            "gennaio": "01",
            "febbraio": "02",
            "marzo": "03",
            "aprile": "04",
            "maggio": "05",
            "giugno": "06",
            "luglio": "07",
            "agosto": "08",
            "settembre": "09",
            "ottobre": "10",
            "novembre": "11",
            "dicembre": "12"
        };
        return months[monthName.toLowerCase()] || "01";
    }

    // Associa l'evento di click al pulsante Prenota (per l'interazione manuale)
    document.getElementById('bookButton').addEventListener('click', function () {
        let dest = document.getElementById("destination").value;
        let dep = document.getElementById("departure").value;
        let ret = document.getElementById("return").value;

        if (!dep || !ret) {
            alert("Seleziona entrambe le date per procedere!");
            return;
        }
        alert(`Viaggio prenotato per ${dest} dal ${dep} al ${ret}!`);
    });
});
