// Inizializza l'oggetto quando la pagina è caricata
window.onload = function () {
    window.speechHandler = new SpeechRecognitionHandler();
    // assegno il nuovo nome vocale "ciao" all'item multiaction (funziona sia multiaction che ciao)
    window.speechHandler.addVocalItemAlias('ciao', 'multiaction');
    //faccio ripartire il riconoscimento per riconoscere anche l'alias di multiaction
    window.speechHandler.initRecognition();

    // Assegna il pulsante al metodo toggleListening
    document.getElementById('toggleButton').addEventListener('click', () => {
        window.speechHandler.toggleListening();
    });

    // Aggiunge il listener per il tasto "m"
    window.addEventListener('keydown', (event) => {
        if (event.key.toLowerCase() === 'm') {
            window.speechHandler.toggleListening();
        }
    });

    // Registra l'azione click breve per il bottone
    window.speechHandler.onMouseClick('multiaction', (item) => {
        console.log("Azione mouse per MultiAction Button registrata!");

        // Cambia colore per evidenziare l'azione
        item.style.color = "#00ffa6";
        setTimeout(() => {
            item.style.color = "";  // Ripristina colore
        }, 500);
    });

    // Registra l'azione vocale per il bottone
    window.speechHandler.onVocalClick('multiaction', (item) => {
        console.log("Azione vocale per MultiAction Button registrata");

        // Cambia colore per evidenziare l'azione
        item.style.backgroundColor = "#00ffa6";
        setTimeout(() => {
            item.style.backgroundColor = "";  // Ripristina colore
        }, 500);
        window.speechHandler.clearSelection();

    });

    //Registra l'azione combinata long press+vocale
    window.speechHandler.onCombinedInput('multiaction', 'combinato', (item) => {
        console.log("azione combinata per multiaction registrata");

        item.style.backgroundColor = "#ff003b";
        setTimeout(() => {
            item.style.backgroundColor = "";  // Ripristina colore
        }, 500);
        window.speechHandler.clearSelection();

    });
    window.speechHandler.combinedClickMenuItem("multiaction");

}