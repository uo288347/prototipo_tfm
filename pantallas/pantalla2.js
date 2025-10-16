
export function renderScreen2() {
    // 1. Seleccionar y limpiar el contenedor principal
    const $screenContent = $('#screen-content');

    $screenContent.empty();

    // 2. Definir la frase objetivo
    const fraseObjetivo = "Mi animal favorito son los conejos";

    // 3. Crear el párrafo de instrucción
    const $instruccionP = $('<p>').html(`Por favor, escribe exactamente la siguiente frase en el campo de abajo: <br><strong>"${fraseObjetivo}"</strong>`);

    // 4. Crear el campo de entrada de texto (el input)
    const $textInput = $('<input>', {
        id: 'textInput',
        type: 'text',
        placeholder: 'Escribe la frase aquí...',
        // Estilo básico para móviles
    });

    // 5. Crear el área de feedback (el output)
    const $feedbackOutput = $('<p>', { 
        id: 'output', 
        text: 'Esperando que escribas la frase...'
    });

    // 6. Añadir todos los elementos al contenedor principal
    const $monitorization = $('<p>', { id: 'monitorization', text: '' });
    $screenContent.append($instruccionP, $textInput, $feedbackOutput, $monitorization);

    // 7. Adjuntar los eventos al input usando la función pasada como parámetro
    // Pasamos el input y el output al manejador de eventos.
    attachInputEvents($textInput, $feedbackOutput, $monitorization, fraseObjetivo);
}


function attachInputEvents($inputElement, $outputElement, $monitorization, targetPhrase) {
  
  function showData(data) {
    console.log(data); 
    $monitorization.html(`<pre>${JSON.stringify(data, null, 2)}</pre>`);
  }
      $inputElement.on('keydown', function(e) {
        const currentTime = Date.now();
        const currentValue = $(this).val();
        let keyChar = e.key;
        let logEntry = {
            timestamp: currentTime,
            time: new Date(currentTime).toLocaleString(),
            key: keyChar,
            currentText: currentValue, // El texto antes de esta pulsación
            expectedChar: null,
            matchStatus: 'Neutral', // Por defecto 'Neutral'
            eventSource: 'keydown'
        };

        // 1. Manejar Teclas Especiales (Eliminar/Backspace)
        if (keyChar === 'Backspace' || keyChar === 'Delete') {
            logEntry.matchStatus = 'Correction';
            logEntry.expectedChar = (currentValue.length > 0) 
                ? targetPhrase[currentValue.length - 1] // Carácter que se estaba a punto de borrar
                : null;
            showData(logEntry);
            return; // Continúa con el evento keydown normal
        }
        
        // 2. Manejar Teclas de Carácter (si no es una tecla de control como Shift, Alt, etc.)
        if (keyChar.length === 1) { 
          console.log("Primer if");
            const currentIndex = currentValue.length;
            const expected = targetPhrase[currentIndex];
            
            // Si el índice es válido para la frase objetivo
            if (expected !== undefined) {
                console.log("Segundo if");

                logEntry.expectedChar = expected;
                
                // Comparación para determinar si el carácter es correcto o un error
                if (keyChar === expected) {
                    console.log("Tercer if");

                    logEntry.matchStatus = 'Correct';
                } else {
                    logEntry.matchStatus = 'Error';
                }
            } else {
                // Si el usuario ya escribió la frase completa y sigue escribiendo
                logEntry.matchStatus = 'ExtraInput';
            }
            showData(logEntry);
        }
    });  



    // Verificar la frase completa
    $inputElement.on('input', function() {
        const userText = $(this).val();
        
        // La validación es estricta (case sensitive y espacios)
        if (userText === targetPhrase) {
            $outputElement
                .text('¡Correcto! Frase ingresada con éxito. 🎉')
                .css('color', 'green');
        } else if (userText.length >= targetPhrase.length) {
             // Si el texto es más largo o no coincide después de la longitud completa
            $outputElement
                .text('El texto no coincide con la frase objetivo. Inténtalo de nuevo.')
                .css('color', 'red');
        }
        else {
             $outputElement
                .text(`Escribiendo... (Faltan ${targetPhrase.length - userText.length} caracteres)`)
                .css('color', '#888');
        }
    });
}