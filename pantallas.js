export function renderScreen1(attachButtonEvents) {
  const $btn = $('<button>', { id: 'clickBtn', text: 'Haz click o toca aquí' });
  const $output = $('<p>', { id: 'output', text: 'Esperando interacción...' });
  $('#screen-content').empty().append($btn, $output);
  attachButtonEvents($btn, $output);
}

export function renderScreen2() {
  // 1. Seleccionar y limpiar el contenedor principal
  const $screenContent = $('#screen-content');
  $screenContent.empty();

  // 2. Crear el párrafo de instrucciones
  const $instruccionP = $('<p>', {
      style: "font-size: 1.2em; font-weight: bold; color: #333;"
  }).text('El usuario tiene que encontrar la foto del conejo y hacer clic sobre ella. 🐇');

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
  }).html(textoBase.repeat(4)); 

    // 4. Crear la imagen del conejo clickeable
  const $imagenConejo = $('<img>', {
      class: 'imagen-conejo',
      src: "https://upload.wikimedia.org/wikipedia/commons/0/07/Rabbit_in_Edinburgh_Gardens.jpg", // Usa tu propia URL de imagen
      alt: "Foto del conejo clickeable.",
      title: "¡Haz clic o toca aquí!"
  });

    // 5. Añadir el manejador de eventos click a la imagen
  $imagenConejo.on('click', function() {
        // Lógica de JavaScript a ejecutar cuando el usuario encuentre el conejo
      alert('🐰 ¡Éxito! Has encontrado y clickeado la foto del conejo.');
        // Aquí podrías llamar a otra función para pasar al siguiente nivel o pantalla
        // ejemplo: renderScreen3();
  });

    // 6. Añadir todos los elementos al contenedor principal
  $screenContent
      .append($instruccionP)
      .append($('<hr>'))
      .append($textoLargoDiv)
      .append($imagenConejo);
}


function renderPantallaConejo() {
            // 1. Definir el contenedor principal donde inyectar el código
            const $container = $('#contenedor-principal');
            
            // Limpiar el contenedor si ya tiene contenido (para evitar duplicados)
            $container.empty();

            // 2. Crear el párrafo de instrucciones
            const $instruccionP = $('<p>', {
                style: "font-size: 1.2em; font-weight: bold; color: #333;"
            }).text('El usuario tiene que encontrar la foto del conejo y hacer clic sobre ella. 🐇');

            // 3. Crear el texto largo para forzar el scroll
            const textoExtenso = `
                <h2>Información Extensa sobre Desarrollo Móvil y jQuery</h2>
                <p>
                    El desarrollo de aplicaciones web móviles requiere la optimización de recursos y la gestión eficiente del DOM, tareas en las que **jQuery** puede asistir, aunque la tendencia actual es hacia frameworks más ligeros. No obstante, para manipulaciones rápidas del DOM como esta, jQuery es eficaz. Este texto se ha generado para forzar el desplazamiento (*scroll*) en la pantalla de su dispositivo. El objetivo del conejo está en la parte inferior, por lo que debe deslizar la pantalla hacia abajo varias veces.
                </p>
                <p>
                    La implementación de diseños **"mobile-first"** asegura que el sitio cargue rápidamente en dispositivos con recursos limitados, aplicando luego mejoras para pantallas más grandes. Recuerde que, al usar JavaScript para inyectar HTML, debe tener cuidado con las vulnerabilidades de seguridad como los ataques XSS (Cross-Site Scripting). En este ejemplo, el contenido es estático, lo cual es seguro. Continúe su descenso, el conejo no aparece aún.
                </p>
                <p>
                    Para mejorar la experiencia táctil, asegúrese de que todos los elementos interactivos sean fácilmente accesibles con el dedo. El desarrollo para móviles requiere pruebas rigurosas en diferentes dispositivos y condiciones de red. ¡Ya casi llega al final! Siga bajando hasta el final del contenido.
                </p>
                <hr>
            `;
            
            const $textoLargoDiv = $('<div>', {
                class: 'texto-largo'
            }).html(textoExtenso.repeat(3)); // Repetimos el texto para garantizar un scroll considerable

            // 4. Crear la imagen del conejo envuelta en un enlace (o solo como imagen con click handler)
            const $imagenConejo = $('<img>', {
                class: 'imagen-conejo',
                src: "https://upload.wikimedia.org/wikipedia/commons/0/07/Rabbit_in_Edinburgh_Gardens.jpg",
                alt: "Foto de un conejo que el usuario debe seleccionar."
            });

            // 5. Añadir el manejador de eventos (click) con jQuery a la imagen
            $imagenConejo.on('click', function() {
                alert('¡Felicidades! Encontraste y clickeaste el conejo. Aquí ejecutarías la lógica de tu aplicación.');
                // Puedes añadir aquí tu lógica de JavaScript, por ejemplo:
                // iniciarSiguienteNivel();
            });

            // 6. Añadir todos los elementos al contenedor principal en el orden deseado
            $container
                .append($instruccionP)
                .append($('<hr>'))
                .append($textoLargoDiv)
                .append($imagenConejo);

            // Opcional: Desplazarse automáticamente al inicio del contenido dinámico
            $('html, body').animate({ scrollTop: 0 }, 'slow');
        }
        
        // **Llamada de ejemplo para probar la función inmediatamente al cargar la página:**
        // $(document).ready(function() {
        //     renderPantallaConejo();
        // });

export function renderScreen3() {
  $('#screen-content').empty();
}
