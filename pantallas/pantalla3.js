
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

