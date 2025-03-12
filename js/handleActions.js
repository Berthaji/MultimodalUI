// Inizializza l'oggetto quando la pagina è caricata
window.onload = function () {
    window.speechHandler = new SpeechRecognitionHandler();

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

    // SET AZIONI COMANDI VOCALI BASE (associazione componente a un'azione)

    window.speechHandler.onVocalClick('file', (menuItem) => {
        // Azione personalizzata per "File"
        console.log("Azione per File eseguita!");

        // Cambia il colore per il menu qui
        menuItem.style.backgroundColor = "#f0f0f0";  // Colore di esempio
        setTimeout(() => {
            menuItem.style.backgroundColor = "";  // Ripristina il colore
        }, 2000);  // Ripristina dopo 2 secondi
    });

    window.speechHandler.onVocalClick('visualizza', (menuItem) => {
        // Azione per "Visualizza"
        console.log("Azione per Visualizza eseguita!");

        // Cambia il colore per il menu qui
        menuItem.style.backgroundColor = "#ee00ff";  // Colore di esempio
        setTimeout(() => {
            menuItem.style.backgroundColor = "";  // Ripristina il colore
        }, 2000);  // Ripristina dopo 2 secondi
    });

    window.speechHandler.onVocalClick('modifica', (menuItem) => {
        // Azione per "Modifica"
        console.log("Azione per Modifica eseguita!");

        // Cambia il colore per il menu qui
        menuItem.style.backgroundColor = "rgba(85,179,17,0.93)";  // Colore di esempio
        setTimeout(() => {
            menuItem.style.backgroundColor = "";  // Ripristina il colore
        }, 2000);  // Ripristina dopo 2 secondi
    });

    window.speechHandler.onVocalClick('strumenti', (menuItem) => {
        // Azione per "Strumenti"
        console.log("Azione per Strumenti eseguita!");
        // Cambia il colore per il menu qui
        menuItem.style.backgroundColor = "#fff200";  // Colore di esempio
        setTimeout(() => {
            menuItem.style.backgroundColor = "";  // Ripristina il colore
        }, 2000);  // Ripristina dopo 2 secondi
    });

    window.speechHandler.onVocalClick('opzioni', (menuItem) => {
        // Azione per "Opzioni"
        console.log("Azione per Opzioni eseguita!");

        // Cambia il colore per il menu qui
        menuItem.style.backgroundColor = "#00ffe1";  // Colore di esempio
        setTimeout(() => {
            menuItem.style.backgroundColor = "";  // Ripristina il colore
        }, 2000);  // Ripristina dopo 2 secondi
    });

    //ESEMPIO: AGGIUNTA NUOVO COMANDO CUSTOM
    // Impostiamo il comando "colora" per colorare tutti gli elementi del menu
    // sfruttando le azioni salvate per tutti i comandi già associati a un'azione

    window.speechHandler.addVocalCommand("colora", () => {
        const menuItems = ["strumenti", "modifica", "file", "visualizza", "opzioni"];

        menuItems.forEach((menu, index) => {
            setTimeout(() => {
                window.speechHandler.selectMenuItem(menu);
                window.speechHandler.clickSelectedMenuItem();  // Attiva l'azione registrata on click
            }, index*1000);
        });
    });


    //SET COMANDI BASE INPUT MOUSE

    window.speechHandler.onMouseClick('file', (menuItem) => {
        console.log("Azione per File eseguita con il mouse!");

        menuItem.style.color = "#aa0f0f";  // Cambia il colore del testo
        setTimeout(() => {
            menuItem.style.color = "";  // Ripristina il colore originale del testo
        }, 500);
    });

    window.speechHandler.onMouseClick('modifica', (menuItem) => {
        console.log("Azione per File eseguita con il mouse!");

        menuItem.style.color = "#aa0f0f";  // Cambia il colore del testo
        setTimeout(() => {
            menuItem.style.color = "";  // Ripristina il colore originale del testo
        }, 500);
    });

    window.speechHandler.onMouseClick('visualizza', (menuItem) => {
        console.log("Azione per File eseguita con il mouse!");

        menuItem.style.color = "#aa0f0f";  // Cambia il colore del testo
        setTimeout(() => {
            menuItem.style.color = "";  // Ripristina il colore originale del testo
        }, 500);
    });

    window.speechHandler.onMouseClick('strumenti', (menuItem) => {
        console.log("Azione per File eseguita con il mouse!");

        menuItem.style.color = "#aa0f0f";  // Cambia il colore del testo
        setTimeout(() => {
            menuItem.style.color = "";  // Ripristina il colore originale del testo
        }, 500);
    });

    window.speechHandler.onMouseClick('opzioni', (menuItem) => {
        console.log("Azione per File eseguita con il mouse!");

        menuItem.style.color = "#aa0f0f";  // Cambia il colore del testo
        setTimeout(() => {
            menuItem.style.color = "";  // Ripristina il colore originale del testo
        }, 500);
    });
};


//GESTIRE I CONFLITTI per evitare di cliccare col mouse mentre il riconoscimento vocale
//sta svolgendo un'azione
