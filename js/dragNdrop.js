document.addEventListener('DOMContentLoaded', function () {
    let isDragging = false;         // Stato di dragging
    let currentElement = null;      // Elemento attualmente trascinato
    let shiftX = 0, shiftY = 0;       // Offset per mantenere la posizione interna
    let lastMouseX = 0, lastMouseY = 0; // Ultima posizione nota del mouse

    const container = document.getElementById('container');

    // Listener globale per aggiornare la posizione del mouse
    // e spostare l'elemento se in dragging
    document.addEventListener('mousemove', function (e) {
        lastMouseX = e.clientX;
        lastMouseY = e.clientY;

        if (isDragging && currentElement) {
            let maxX = container.clientWidth - currentElement.clientWidth;
            let maxY = container.clientHeight - currentElement.clientHeight;
            let newX = Math.min(Math.max(0, e.clientX - shiftX), maxX);
            let newY = Math.min(Math.max(0, e.clientY - shiftY), maxY);
            currentElement.style.left = newX + 'px';
            currentElement.style.top = newY + 'px';
        }
    });

    // Drag and drop tramite mouse
    document.querySelectorAll('.draggable').forEach(item => {
        item.addEventListener('mousedown', function(e) {
            // Imposta l'elemento corrente e calcola lo shift
            currentElement = item;
            isDragging = true;
            shiftX = e.clientX - item.getBoundingClientRect().left;
            shiftY = e.clientY - item.getBoundingClientRect().top;

            // Quando il mouse viene rilasciato, termina il dragging
            function onMouseUp() {
                isDragging = false;
                currentElement = null;
                document.removeEventListener('mouseup', onMouseUp);
            }
            document.addEventListener('mouseup', onMouseUp);
        });

        // Previene il comportamento di drag nativo del browser
        item.ondragstart = () => false;
    });

    // Inizializza il gestore del riconoscimento vocale
    window.speechHandler = new SpeechRecognitionHandler();
    document.getElementById('toggleButton').addEventListener('click', function () {
        window.speechHandler.toggleListening();
    });
    window.addEventListener('keydown', (event) => {
        if (event.key.toLowerCase() === 'm') {
            window.speechHandler.toggleListening();
        }
    });

    // Mantiene traccia dell'elemento sotto il mouse
    let elementoSottoMouse = null;
    document.addEventListener('mousemove', function(e) {
        elementoSottoMouse = e.target.closest('.draggable');
        console.log(elementoSottoMouse);
    });


    let flashTimeout = null;
    // cambia colore allo sfondo per qualche millisecondo
    function flashBackground(color, duration = 200) {
        if (flashTimeout) clearTimeout(flashTimeout); // Cancella eventuali timer precedenti

        document.body.style.backgroundColor = color; // Cambia colore sfondo
        setTimeout(() => {
            document.body.style.backgroundColor = ''; // Ripristina colore originale
            flashTimeout = null;
        }, duration);
    }

    // comando vocale per il drag
    window.speechHandler.addVocalCommand("drag", () => {
        if (!isDragging) { // Previene doppia esecuzione
            console.log("Comando vocale 'drag' attivato");
            if (elementoSottoMouse && elementoSottoMouse.classList.contains('draggable')) {
                currentElement = elementoSottoMouse;
                isDragging = true;
                let rect = currentElement.getBoundingClientRect();
                shiftX = lastMouseX - rect.left;
                shiftY = lastMouseY - rect.top;
                console.log("Inizia drag con voce su:", currentElement);

                flashBackground("yellow", 500);
            } else {
                console.log("Nessun elemento draggable sotto il mouse.");
            }
        }
    });

    // comando vocale per il drop
    window.speechHandler.addVocalCommand("drop", () => {
        if (isDragging) { // Previene doppia esecuzione
            console.log("Comando vocale 'drop' attivato");
            isDragging = false;
            currentElement = null;

            flashBackground("pink", 500);
        }
    });

});
