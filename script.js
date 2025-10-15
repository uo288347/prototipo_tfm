import { renderScreen1, renderScreen2, renderScreen3 } from './pantallas.js';

const TOTAL_SCREENS = 10;
let currentScreen = 1;

// Array de funciones, cada una renderiza una pantalla
const screens = [
  () => renderScreen1(attachButtonEvents),
  () => renderScreen2(attachInputEvents),
  () => renderScreen3(monitorScreen2Interactions),
  // ...añade más funciones importadas aquí
];

function renderScreen() {
  $('#screen-indicator').text(`${currentScreen}/${TOTAL_SCREENS}`);
  if (screens[currentScreen - 1]) {
    screens[currentScreen - 1]();
  } else {
    $('#screen-content').empty();
  }
}


function attachButtonEvents($btn, $output) {
  let downTime = null, upTime = null, moves = [];
  $btn.off(); // Limpia eventos previos

  
  function showData(data) {
    //console.log(data); 
    $output.html(`<pre>${JSON.stringify(data, null, 2)}</pre>`);
  }

  $btn.on('pointerdown', function(e) {
    downTime = Date.now();
    moves = [];
    showData({
      type: 'pointerdown',
      timestamp: downTime,
      time: new Date(downTime).toLocaleString(),
      pointerType: e.pointerType,
      x: e.clientX,
      y: e.clientY,
      screenX: e.screenX,
      screenY: e.screenY,
      pressure: e.pressure,
      button: e.button,
      width: e.width || null,
      height: e.height || null,
      area: (e.width && e.height) ? e.width * e.height : null
    });
  });
  $btn.on('pointermove', function(e) {
    moves.push({
      timestamp: Date.now(),
      x: e.clientX,
      y: e.clientY,
      screenX: e.screenX,
      screenY: e.screenY,
      pressure: e.pressure,
      width: e.width || null,
      height: e.height || null,
      area: (e.width && e.height) ? e.width * e.height : null
    });
    showData({
      type: 'pointermove',
      moves_count: moves.length,
      moves
    });
  });
  $btn.on('pointerup', function(e) {
    upTime = Date.now();
    showData({
      type: 'pointerup',
      timestamp: upTime,
      time: new Date(upTime).toLocaleString(),
      pointerType: e.pointerType,
      x: e.clientX,
      y: e.clientY,
      screenX: e.screenX,
      screenY: e.screenY,
      pressure: e.pressure,
      button: e.button,
      width: e.width || null,
      height: e.height || null,
      area: (e.width && e.height) ? e.width * e.height : null,
      duration_ms: upTime - downTime,
      moves_count: moves.length,
      moves
    });
    downTime = null;
    upTime = null;
    moves = [];
  });
  $btn.on('click', function(e) {
    showData({
      type: 'click',
      timestamp: Date.now(),
      time: new Date().toLocaleString(),
      pointerType: e.pointerType || 'mouse',
      x: e.clientX,
      y: e.clientY,
      screenX: e.screenX,
      screenY: e.screenY,
      button: e.button,
      width: e.width || null,
      height: e.height || null,
      area: (e.width && e.height) ? e.width * e.height : null
    });
  });
}

function attachInputEvents($inputElement, $outputElement, targetPhrase) {
  
  function showData(data) {
    console.log(data); 
    $outputElement.html(`<pre>${JSON.stringify(data, null, 2)}</pre>`);
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
            const currentIndex = currentValue.length;
            const expected = targetPhrase[currentIndex];
            
            // Si el índice es válido para la frase objetivo
            if (expected !== undefined) {
                logEntry.expectedChar = expected;
                
                // Comparación para determinar si el carácter es correcto o un error
                if (keyChar === expected) {
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

function monitorScreen2Interactions() {
  const $screenContent = $('#screen-content');
  const $imagenConejo = $screenContent.find('.imagen-conejo');

  let downTime = null, upTime = null;
  let moves = [];
  let allEvents = [];
  let scrollMoves = [];

  // Función para registrar y mostrar en consola
  function logEvent(data) {
    data.timestamp = Date.now();
    data.time = new Date().toLocaleString();
    allEvents.push(data);

    if (data.type === 'scroll') {
      scrollMoves.push(data.scrollData);
    }

    console.log(data);
  }

  // Pointer events sobre la imagen
  $imagenConejo.on('pointerdown', e => {
    downTime = Date.now();
    moves = [];
    logEvent({
      type: 'pointerdown',
      pointerType: e.pointerType,
      x: e.clientX,
      y: e.clientY,
      screenX: e.screenX,
      screenY: e.screenY,
      pressure: e.pressure,
      button: e.button
    });
  });

  $imagenConejo.on('pointermove', e => {
    const moveData = {
      timestamp: Date.now(),
      x: e.clientX,
      y: e.clientY,
      screenX: e.screenX,
      screenY: e.screenY,
      pressure: e.pressure
    };
    moves.push(moveData);
    logEvent({ type: 'pointermove', move: moveData });
  });

  $imagenConejo.on('pointerup', e => {
    upTime = Date.now();
    logEvent({
      type: 'pointerup',
      pointerType: e.pointerType,
      x: e.clientX,
      y: e.clientY,
      screenX: e.screenX,
      screenY: e.screenY,
      pressure: e.pressure,
      duration_ms: upTime - downTime,
      moves_count: moves.length,
      moves
    });
    downTime = null;
    upTime = null;
    moves = [];
  });

  $imagenConejo.on('click', e => {
    logEvent({
      type: 'click',
      pointerType: e.pointerType || 'mouse',
      x: e.clientX,
      y: e.clientY,
      screenX: e.screenX,
      screenY: e.screenY
    });
  });

  // Scrolls de la ventana
  $(window).on('scroll', e => {
    /*const scrollData = {
      scrollX: window.scrollX,
      scrollY: window.scrollY
    };*/
    logEvent({ 
      type: 'scroll', 
      scrollX: window.scrollX,
      scrollY: window.scrollY
    });
  });
}


$('#prevBtn').on('click', function() {
  if (currentScreen > 1) {
    currentScreen--;
    console.log(currentScreen);
    renderScreen();
  }
});
$('#nextBtn').on('click', function() {
  if (currentScreen < TOTAL_SCREENS) {
    currentScreen++;
    console.log(currentScreen);
    renderScreen();
  }
});

$(document).ready(function() {
  renderScreen();
});