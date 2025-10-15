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
export function renderScreen4(attachCarouselEvents) {
  // 1. Seleccionar y limpiar contenedor
  const $screenContent = $('#screen-content');
  $screenContent.empty();

  // 2. Texto de instrucción
  const $instruccion = $('<p>').text('Desliza hacia la izquierda o derecha para ver las imágenes');
  
  // 3. Contenedor del carrusel
  const $carousel = $('<section>', { class: 'carousel' });

  // 4. Lista interna de imágenes (el “carril”)
  const $track = $('<div>', { class: 'carousel-track' });

  // 5. Agregar imágenes al carrusel
  const images = [
    'https://picsum.photos/id/1011/600/400',
    'https://picsum.photos/id/1015/600/400',
    'https://picsum.photos/id/1020/600/400',
    'https://picsum.photos/id/1024/600/400'
  ];

  images.forEach(src => {
    $('<img>', { src, alt: 'imagen' })
      .appendTo($track);
  });

  $carousel.append($track);
  $screenContent.append($instruccion, $carousel);

  // 6. Variables de swipe
  let startX = 0;
  let currentTranslate = 0;
  let currentIndex = 0;

  // 7. Eventos táctiles
  $carousel.on('pointerstart', e => {
    startX = e.originalEvent.touches[0].clientX;
  });

  $carousel.on('pointermove', e => {
    const currentX = e.originalEvent.touches[0].clientX;
    const diff = currentX - startX;
    $track.css('transform', `translateX(${currentTranslate + diff}px)`);
  });

  $carousel.on('pointerend', e => {
    const endX = e.originalEvent.changedTouches[0].clientX;
    const diff = endX - startX;

    // Si el swipe es suficientemente grande, cambia de imagen
    if (diff > 50 && currentIndex > 0) {
      currentIndex--;
    } else if (diff < -50 && currentIndex < images.length - 1) {
      currentIndex++;
    }

    // Calcula nuevo desplazamiento
    currentTranslate = -currentIndex * $carousel.width();
    $track.css('transform', `translateX(${currentTranslate}px)`);

    console.log(`Mostrando imagen ${currentIndex + 1} de ${images.length}`);
  });

    attachCarouselEvents();
}
