import { renderScreen1, renderScreen2, renderScreen3, renderScreen4 } from './pantallas.js';

const TOTAL_SCREENS = 10;
let currentScreen = 1;

// Array de funciones, cada una renderiza una pantalla
const screens = [
  () => renderScreen1(attachButtonEvents),
  () => renderScreen2(attachInputEvents),
  () => renderScreen3(monitorScreen2Interactions),
  () => renderScreen4(attachSwipeEvents)
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
      pressure: e.pressure || null,
      button: e.button,
      width: e.width || null,
      height: e.height || null,
      area: (e.width && e.height) ? e.width * e.height : null
    });
  });
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

function attachSwipeEvents($carousel, $slides, $output, totalSlides) {
    let index = 0;
    let startX = 0;
    let currentX = 0;
    let isDragging = false;
    const SWIPE_THRESHOLD = 5;
    let currentSlide = 0;
    console.log('Total slides:', $slides.length); //Debug

    function updateCarousel() {
      $carousel.css('transform', `translateX(${-index * 100}%)`);
      $output.text(`Imagen ${index+1} de ${totalSlides}. ¡Swipe detectado!`);
    }

    let downTime = null, upTime = null;
    let moves = [];
    let allEvents = [];
    let scrollMoves = [];

    function logEvent(data) {
      data.timestamp = Date.now();
      data.time = new Date().toLocaleString();
      allEvents.push(data);

      if (data.type === 'scroll') {
        scrollMoves.push(data.scrollData);
      }

      console.log(data);

    }

    // Eventos táctiles
    $carousel.on('pointerdown', function (e) {
      startX = e.clientX;
      isDragging = true;
      $carousel.css('transition', `none`);
      //metrics
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

    $carousel.on('pointermove', function (e) {
      if (!isDragging) return;
      currentX = e.clientX;
  
      const diff = currentX - startX;
      const currentTranslate = -currentSlide * window.innerWidth;
      
      $carousel.css('transform', `translateX(${currentTranslate + diff}px)`);

      //metrics
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

    $carousel.on('pointerup', function (e) {
      if (!isDragging) return;
      isDragging = false;
      const diff = startX - currentX;
      const threshold = window.innerWidth * 0.2; // 20% del ancho de la pantalla
      console.log('Diff:', diff, 'Threshold:', threshold); //Debug
      $carousel.css('transition', 'transform 0.4s ease-in-out');
      /*if (diff > SWIPE_THRESHOLD && index < $slides.length - 1) index++;
      if (diff < -SWIPE_THRESHOLD && index > 0) index--;
      if (diff < SWIPE_THRESHOLD || diff > -SWIPE_THRESHOLD) {
        $output.text('Toque registrado, movimiento insuficiente.');
      }*/
      if (Math.abs(diff) > threshold) {
        if (diff > 0 && currentSlide > 0) {
          // Swipe a la derecha - slide anterior
          currentSlide--;
          console.log('Anterior → Slide:', currentSlide); // Debug
        } else if (diff < 0 && currentSlide < totalSlides - 1) {
          // Swipe a la izquierda - slide siguiente
          currentSlide++;
          console.log('Siguiente → Slide:', currentSlide); // Debug
        }
      }
      
      const newTransform = -currentSlide * 100;
      $carousel.css('transition',`translateX(${newTransform}vw)`);
      console.log('Transform aplicado:', newTransform + 'vw'); // Debug      
      updateCarousel();

      //metrics
      upTime = Date.now();
      moves = [];
      logEvent({
        type: 'pointerup',
        pointerType: e.pointerType,
        x: e.clientX,
        y: e.clientY,
        screenX: e.screenX,
        screenY: e.screenY,
        pressure: e.pressure,
        button: e.button
      });
    });
}

function attachSwipeEvents2($container, $wrapper, $output, totalSlides) {
    let startX = 0;          // Posición X inicial al tocar
    let currentSlide = 0;    // Índice de la imagen actual
    const SWIPE_THRESHOLD = 50; // Mínimo de píxeles a moverse para considerarlo un swipe

    // 1. Función para actualizar la imagen visible
    const moveCarousel = (newIndex) => {
        const slideWidth = $container.width(); 

        // Asegura un índice cíclico
        currentSlide = (newIndex + totalSlides) % totalSlides; 
        
        const offset = -currentSlide * slideWidth; 
        
        $wrapper.css('transform', `translateX(${offset}px)`);
    };

    const updateCarouselAndFeedback = (newIndex, swiped = false) => {
        moveCarousel(newIndex); // Mueve el carrusel

        if (swiped) {
            // Muestra este mensaje SOLO si ha habido un swipe real
            $output.text(`Imagen ${currentSlide + 1} de ${totalSlides}. ¡Swipe detectado!`);
        } else {
            // Muestra este mensaje en la inicialización o si el movimiento fue insuficiente
            $output.text('Esperando gesto de deslizamiento...');
        }
    };

    moveCarousel(0);
    $output.text('Esperando gesto de deslizamiento...');
    /*const updateCarousel = (newIndex) => {
        const slideWidth = $container.width();
        currentSlide = (newIndex + totalSlides) % totalSlides; // Asegura un índice cíclico
        const offset = -currentSlide * slideWidth; // 300px es el ancho del contenedor
        
        $wrapper.css('transform', `translateX(${offset}px)`);
        $output.text(`Imagen ${currentSlide + 1} de ${totalSlides}. ¡Swipe detectado!`);
    };*/

    // 2. Captura del inicio del toque (pointerdown)
    $container.on('pointerdown', function(e) {
        // Solo para el primer toque o toque primario
        if (e.isPrimary) {
            startX = e.clientX;
            // Opcional: Desactivar la transición CSS temporalmente
            $wrapper.css('transition', 'none'); 
            // Capturar el puntero para que los eventos 'move' sigan al dedo fuera del contenedor
            $container[0].setPointerCapture(e.pointerId);
            $output.text('Iniciando toque...');
        }
    });

    // 3. Seguimiento del movimiento (pointermove)
    $container.on('pointermove', function(e) {
        if (startX !== 0 && e.isPrimary) {
            const deltaX = e.clientX - startX;
            const slideWidth = $container.width();
            // Mover el wrapper en tiempo real para un efecto visual de arrastre
           const currentOffset = -currentSlide * slideWidth;
            $wrapper.css('transform', `translateX(${currentOffset + deltaX}px)`);
        }
    });

    // 4. Fin del toque (pointerup)
    $container.on('pointerup', function(e) {
        if (startX !== 0 && e.isPrimary) {
            const deltaX = e.clientX - startX;
            startX = 0; // Resetear la posición inicial

            // Volver a activar la transición
            $wrapper.css('transition', 'transform 0.3s ease-out');
            
            // Liberar el puntero
            $container[0].releasePointerCapture(e.pointerId);

            if (deltaX < -SWIPE_THRESHOLD) {
                // Swipe a la izquierda (quiere ver la siguiente imagen)
                updateCarousel(currentSlide + 1);
            } else if (deltaX > SWIPE_THRESHOLD) {
                // Swipe a la derecha (quiere ver la imagen anterior)
                updateCarousel(currentSlide - 1);
            } else {
                // Movimiento menor que el umbral, regresa a la posición actual
                updateCarousel(currentSlide);
                $output.text('Toque registrado, movimiento insuficiente.');
            }
        }
    });

    // Inicializar la primera imagen
    updateCarousel(0);
}


$('#prevBtn').on('click', function() {
  if (currentScreen > 1) {
    currentScreen--;
    renderScreen();
  }
});
$('#nextBtn').on('click', function() {
  if (currentScreen < TOTAL_SCREENS) {
    currentScreen++;
    renderScreen();
  }
});

$(document).ready(function() {
  renderScreen();
});