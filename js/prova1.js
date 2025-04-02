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
        console.log("Azione per File registrata!");

        // Rende l'elemento non interagibile
        window.speechHandler.setElementInteractive(menuItem, false);

        // Applica lo stile del background
        menuItem.style.backgroundColor = "#f0f0f0";

        // Dopo 2 secondi: resetta colore e rende di nuovo interagibile
        setTimeout(() => {
            menuItem.style.backgroundColor = "";
            window.speechHandler.setElementInteractive(menuItem, true);
        }, 2000);
    });

    window.speechHandler.onVocalClick('visualizza', (menuItem) => {
        console.log("Azione per Visualizza registrata!");

        // Rende l'elemento non interagibile
        window.speechHandler.setElementInteractive(menuItem, false);

        // Applica lo stile del background
        menuItem.style.backgroundColor = "#ee00ff";

        // Dopo 2 secondi: resetta colore e rende di nuovo interagibile
        setTimeout(() => {
            menuItem.style.backgroundColor = "";
            window.speechHandler.setElementInteractive(menuItem, true);
        }, 2000);
    });

    window.speechHandler.onVocalClick('modifica', (menuItem) => {
        console.log("Azione per Modifica registrata!");

        // Rende l'elemento non interagibile
        window.speechHandler.setElementInteractive(menuItem, false);

        // Applica lo stile del background
        menuItem.style.backgroundColor = "rgba(85,179,17,0.93)";

        // Dopo 2 secondi: resetta colore e rende di nuovo interagibile
        setTimeout(() => {
            menuItem.style.backgroundColor = "";
            window.speechHandler.setElementInteractive(menuItem, true);
        }, 2000);
    });

    window.speechHandler.onVocalClick('strumenti', (menuItem) => {
        console.log("Azione per Strumenti registrata!");

        // Rende l'elemento non interagibile
        window.speechHandler.setElementInteractive(menuItem, false);

        // Applica lo stile del background
        menuItem.style.backgroundColor = "#fff200";

        // Dopo 2 secondi: resetta colore e rende di nuovo interagibile
        setTimeout(() => {
            menuItem.style.backgroundColor = "";
            window.speechHandler.setElementInteractive(menuItem, true);
        }, 2000);
    });

    window.speechHandler.onVocalClick('opzioni', (menuItem) => {
        console.log("Azione per Strumenti registrata!");

        // Rende l'elemento non interagibile
        window.speechHandler.setElementInteractive(menuItem, false);

        // Applica lo stile del background
        menuItem.style.backgroundColor = "#00ffe1";

        // Dopo 2 secondi: resetta colore e rende di nuovo interagibile
        setTimeout(() => {
            menuItem.style.backgroundColor = "";
            window.speechHandler.setElementInteractive(menuItem, true);
        }, 2000);
    });


    //ESEMPIO: AGGIUNTA NUOVO COMANDO CUSTOM
    // Impostiamo il comando "colora" per colorare tutti gli elementi del menu
    // sfruttando le azioni salvate per tutti i comandi già associati a un'azione

    window.speechHandler.addVocalCommand("colora", () => {
        const menuItems = ["file", "visualizza", "modifica", "strumenti", "opzioni"];

        menuItems.forEach((menu, index) => {
            setTimeout(() => {
                window.speechHandler.selectMenuItem(menu);
                //attiva l'azione associata con la funzione onVocalClick
                window.speechHandler.clickMenuItem(true);
            }, index*2500);
        });
    });


    //SET COMANDI BASE INPUT MOUSE

    window.speechHandler.onMouseClick('file', (menuItem) => {
        console.log("Azione per File registrata con il mouse!");

        // Se NON è interagibile, blocca l’azione
        if (window.speechHandler.isElementNonInteractive(menuItem)) {
            return;
        }

        // Altrimenti, esegue l’azione (modifica colore testo)
        menuItem.style.color = "#aa0f0f";
        setTimeout(() => {
            menuItem.style.color = "";
        }, 500);
    });

    window.speechHandler.onMouseClick('modifica', (menuItem) => {
        console.log("Azione per Modifica registrata con il mouse!");

        // Se NON è interagibile, blocca l’azione
        if (window.speechHandler.isElementNonInteractive(menuItem)) {
            return;
        }

        // Altrimenti, esegue l’azione
        menuItem.style.color = "#aa0f0f";
        setTimeout(() => {
            menuItem.style.color = "";
        }, 500);
    });

    window.speechHandler.onMouseClick('visualizza',(menuItem) => {
        console.log("Azione per Visualizza registrata con il mouse!");

        // Se NON è interagibile, blocca l’azione
        if (window.speechHandler.isElementNonInteractive(menuItem)) {
            return;
        }

        // Altrimenti, esegue l’azione
        menuItem.style.color = "#aa0f0f";
        setTimeout(() => {
            menuItem.style.color = "";
        }, 500);
    });

    window.speechHandler.onMouseClick('strumenti', (menuItem) => {
        console.log("Azione per Opzioni registrata con il mouse!");

        // Se NON è interagibile, blocca l’azione
        if (window.speechHandler.isElementNonInteractive(menuItem)) {
            return;
        }

        // Altrimenti, esegue l’azione
        menuItem.style.color = "#aa0f0f";
        setTimeout(() => {
            menuItem.style.color = "";
        }, 500);
    });

    window.speechHandler.onMouseClick('opzioni',(menuItem) => {
        console.log("Azione per File registrata con il mouse!");

        // Se NON è interagibile, blocca l’azione
        if (window.speechHandler.isElementNonInteractive(menuItem)) {
            return;
        }

        // Altrimenti, esegue l’azione
        menuItem.style.color = "#aa0f0f";
        setTimeout(() => {
            menuItem.style.color = "";
        }, 500);
    });
};

