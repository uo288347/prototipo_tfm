const carruselImagenes = [
    "http://googleusercontent.com/image_collection/image_retrieval/17026540104275499652_0",
    "http://googleusercontent.com/image_collection/image_retrieval/17026540104275499652_1",
    "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1d/Oryctolagus_cuniculus_dorsal_view.jpg/1280px-Oryctolagus_cuniculus_dorsal_view.jpg",
    "https://images.pexels.com/photos/103986/pexels-photo-103986.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
];

export function renderScreen5() {
    const $screenContent = $('#screen-content');
    $screenContent.empty();

    // 1. Título e Instrucciones
    const $instruccionP = $('<p>').text('Desliza (Swipe) la imagen hacia la izquierda o derecha para cambiarla');
    const $carousel = $('<div>', {class:'carousel', id:"carousel"});

    // Crear las diapositivas dinámicamente
    carruselImagenes.forEach(url => {
        const $slide = $('<div>', {class:'slide'});
        const $img = $('<img>', {
            src: url,
            alt: 'Imagen del carrusel'
        });
        $slide.append($img);
        $carousel.append($slide);
    });

    const $feedbackOutput = $('<p>', { 
        id: 'output', 
        text: 'Esperando gesto de deslizamiento...'
    });

    $screenContent.append($instruccionP, $carousel, $feedbackOutput);
    attachSwipeEvents($carousel, $carousel.find('.slide'), $feedbackOutput, carruselImagenes.length);
}



function attachSwipeEvents($carousel, $slides, $output, totalSlides) {
    let index = 0;
    let startX = 0;
    let currentX = 0;
    let isDragging = false;
    let pointerId = null;
    const SWIPE_THRESHOLD = 5;
    let currentSlide = 0;
    console.log('Total slides:', $slides.length); //Debug
    const carousel = $carousel[0];

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
      pointerId = e.pointerId;
      carousel.setPointerCapture(e.pointerId);
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
      if (pointerId !== null) {
        carousel.releasePointerCapture(pointerId);
        pointerId = null;
      }

      isDragging = false;
      const diff = currentX - startX;
      //const threshold = window.innerWidth * 0.2; // 20% del ancho de la pantalla
      const threshold = SWIPE_THRESHOLD; // Umbral fijo en píxeles
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
      
      const newTransform = currentSlide * 100;
      $carousel.css('transform',`translateX(${newTransform}vw)`);
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