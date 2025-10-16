export function renderScreen1(attachButtonEvents) {
  const $btn = $('<button>', { id: 'clickBtn', text: 'Haz click o toca aquí' });
  const $output = $('<p>', { id: 'output', text: 'Esperando interacción...' });
  $('#screen-content').empty().append($btn, $output);
  attachButtonEvents($btn, $output);
}

export function renderScreen2(attachInputEvents) {
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

export function renderScreen3(monitorInteractions) {
  // 1. Seleccionar y limpiar el contenedor principal
  const $screenContent = $('#screen-content');
  $screenContent.empty();

  // 2. Crear el párrafo de instrucciones
  const $instruccionP = $('<p>', {
      style: "font-size: 1.2em; font-weight: bold; color: #333;"
  }).text('Buscar y hacer clic sobre la foto del conejo');

  // 3. Definir y crear el texto largo para forzar el scroll
  const textoBase = `
      <h2>Texto Extenso para Scroll Móvil</h2>
      <p>
          El desarrollo "mobile-first" es crucial. Esta sección de texto ha sido creada para **forzar el desplazamiento (scroll)** en tu dispositivo móvil. Debes deslizar hacia abajo repetidamente para encontrar el objetivo. La usabilidad táctil, la optimización de recursos y la velocidad de carga son pilares de una buena aplicación web móvil. Sigue deslizando, el objetivo está mucho más abajo.
      </p>
      <p>
          Al usar jQuery para la manipulación del DOM, garantizamos una forma concisa de construir la interfaz. Asegúrate de que tu aplicación maneje bien los eventos táctiles y que el tamaño de los elementos interactivos sea adecuado para el dedo (al menos 48px). Continuar descendiendo... el conejo aún se oculta.
      </p>
      <p>
          La implementación de este ejercicio valida la capacidad de la interfaz de gestionar contenido extenso. Casi llegas al final del contenido.
      </p>
      <hr>
  `;
    
    // Repetimos el texto varias veces para garantizar un scroll significativo
  const $textoLargoDiv = $('<div>', {
      class: 'texto-largo'
  }).html(textoBase.repeat(8)); 

    // 4. Crear la imagen del conejo clickeable
  const $imagenConejo = $('<img>', {
      class: 'imagen-conejo',
      src: "https://i0.wp.com/www.elconejo.net/wp-content/uploads/2017/11/Nuestras-razas.jpg?fit=1920%2C650&ssl=1", // Usa tu propia URL de imagen
      alt: "Foto del conejo neerlandés enano.",
      title: "¡Haz clic o toca aquí!"
  });

    // 5. Añadir todos los elementos al contenedor principal
  $screenContent
      .append($instruccionP)
      .append($('<hr>'))
      .append($textoLargoDiv)
      .append($imagenConejo);

  monitorInteractions();
}

const carruselImagenes = [
    'https://picsum.photos/id/237/300/200', // Perro
    'https://picsum.photos/id/1080/300/200', // Lápiz
    'https://picsum.photos/id/1018/300/200', // Puente
    'https://picsum.photos/id/1025/300/200'  // Cebra
];
const CAROUSEL_WIDTH_PERCENT = 80;
const ASPECT_RATIO = 200 / 300;

export function renderScreen4(attachSwipeEvents) {
    const $screenContent = $('#screen-content');
    $screenContent.empty();

    // 1. Título e Instrucciones
    const $instruccionP = $('<p>').text('Desliza (Swipe) la imagen hacia la izquierda o derecha para cambiarla');
    const $carousel = $('<div>', {class:'carousel', id:"carousel"});

    // Crear las diapositivas dinámicamente
    carruselImagenes.forEach(url => {
      const $slide = $('<div>', {class:'slide'}).css('background-image', `url(${url})`);
      $carousel.append($slide);
    });

    const $feedbackOutput = $('<p>', { 
        id: 'output', 
        text: 'Esperando gesto de deslizamiento...'
    });

    $screenContent.append($instruccionP, $carruselContainer, $feedbackOutput);
    attachSwipeEvents($carousel, $carousel.find('.slide'), $feedbackOutput, carruselImagenes.length);
}

export function renderScreen5(attachSwipeEvents) {
    const $screenContent = $('#screen-content');
    $screenContent.empty();

    // 1. Título e Instrucciones
    const $instruccionP = $('<p>').text('Desliza (Swipe) la imagen hacia la izquierda o derecha para cambiarla');

    // 2. Contenedor del Carrusel y la Imagen
    const SLIDE_WIDTH = 300; // Ancho fijo del contenedor y de cada diapositiva
    const totalSlides = carruselImagenes.length;
    const WRAPPER_TOTAL_WIDTH_PERCENT = totalSlides * 100;
    const $carruselContainer = $('<div>', {
        id: 'carruselContainer',
        class: 'carrusel'});

    const $innerContainer = $('<div>', {
        style: 'position: absolute; top: 0; left: 0; width: 100%; height: 100%;'
    });
    
    const $imagenWrapper = $('<div>', {
        id: 'imagenWrapper',
        style: `display: flex; transition: transform 0.3s ease-out; ${WRAPPER_TOTAL_WIDTH_PERCENT}%; height: 100%;`
    });

    // 3. Crear los elementos <img> dentro del wrapper
    carruselImagenes.forEach((url, index) => {
        const $img = $('<img>', {
            src: url,
            class: 'carrusel-img',
            'data-index': index,
            style: `width: ${100 / totalSlides}%; height: 100%; object-fit: cover;` // min-width 100% es clave
        });
        $imagenWrapper.append($img);
    });
    
    // 4. Crear el elemento de feedback (output)
    const $feedbackOutput = $('<p>', { 
        id: 'output', 
        text: 'Esperando gesto de deslizamiento...',
        style: 'margin-top: 20px; font-weight: bold; min-height: 20px;'
    });

    // 5. Ensamblar y añadir al DOM
    $innerContainer.append($imagenWrapper);
    $carruselContainer.append($innerContainer);
    $screenContent.append($instruccionP, $carruselContainer, $feedbackOutput);

    // 6. Adjuntar los eventos de swipe al contenedor
    attachSwipeEvents($carruselContainer, $imagenWrapper, $feedbackOutput, carruselImagenes.length);
}
