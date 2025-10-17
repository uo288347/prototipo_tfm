export function renderScreen4() {
    const $instructions = $('<p>', { class: 'instrucciones', text: 'Seleccionar el color: Azul' });
    const $selector = $('<select>', { id: 'colorSelector' });
    const colors = [
        { value: '', text: '-- Selecciona un color --' },
        { value: 'rojo', text: 'Rojo' },
        { value: 'verde', text: 'Verde' },
        { value: 'azul', text: 'Azul' },
        { value: 'amarillo', text: 'Amarillo' },
        { value: 'naranja', text: 'Naranja' },
        { value: 'morado', text: 'Morado' }
    ];
    colors.forEach(color => {
        const $option = $('<option>', { value: color.value, text: color.text });
        $selector.append($option);
    });

    const $metrics = $('<p>', { class: 'metricas', id: 'metricasDisplay' });
    const $metricsHeader = $('<h3>').text('📊 Métricas de Interacción');
    const $metricsContent = $('<div>', { id: 'metricasContenido', text: 'Esperando interacción...' });
    $metricsContent.empty();
    $metrics.append($metricsHeader, $metricsContent);

    $('#screen-content').empty().append($instructions, $selector, $metrics);
    attachMenuEvents($selector, $metricsContent);
}

function attachMenuEvents($selector, $metricsContent) {
            const metricas = {
                clicMenu: null,
                selecciones: []
            };

            let pointerDownTime = null;
            let pointerDownCoords = null;

            // Evento cuando se hace clic en el menú desplegable
            $selector.on('pointerdown', function(e) {
                pointerDownTime = Date.now();
                pointerDownCoords = {
                    x: e.clientX,
                    y: e.clientY
                };
            });

            $selector.on('pointerup', function(e) {
                if (pointerDownTime && pointerDownCoords) {
                    const duracion = Date.now() - pointerDownTime;
                    metricas.clicMenu = {
                        duracion: duracion,
                        coordenadasInicio: pointerDownCoords,
                        coordenadasFin: {
                            x: e.clientX,
                            y: e.clientY
                        },
                        momento: new Date().toLocaleTimeString()
                    };
                    actualizarMetricas();
                }
            });

            // Evento cuando se selecciona una opción
            $selector.on('change', function(e) {
                const valorSeleccionado = $(this).val();
                const esCorrecta = valorSeleccionado === 'azul';
                
                const seleccion = {
                    momento: new Date().toLocaleTimeString(),
                    valor: valorSeleccionado,
                    correcto: esCorrecta,
                    coordenadas: {
                        x: e.clientX || 0,
                        y: e.clientY || 0
                    }
                };

                metricas.selecciones.push(seleccion);
                actualizarMetricas();

                if (esCorrecta) {
                    $(this).css('border-color', '#4CAF50');
                }
            });

            // Función para actualizar la visualización de métricas
            function actualizarMetricas() {
                let html = '';

                if (metricas.clicMenu) {
                    html += `<div class="metrica-item">
                        <strong>🖱️ Clic en menú:</strong><br>
                        Duración: ${metricas.clicMenu.duracion}ms<br>
                        Momento: ${metricas.clicMenu.momento}<br>
                        Coordenadas inicio: (${metricas.clicMenu.coordenadasInicio.x}, ${metricas.clicMenu.coordenadasInicio.y})<br>
                        Coordenadas fin: (${metricas.clicMenu.coordenadasFin.x}, ${metricas.clicMenu.coordenadasFin.y})
                    </div>`;
                }

                if (metricas.selecciones.length > 0) {
                    html += '<div class="metrica-item"><strong>📋 Selecciones realizadas:</strong></div>';
                    metricas.selecciones.forEach((sel, idx) => {
                        const clase = sel.correcto ? 'exito' : 'error';
                        html += `<div class="metrica-item ${clase}">
                            ${idx + 1}. ${sel.correcto ? '✓' : '✗'} 
                            Color: ${sel.valor}<br>
                            Momento: ${sel.momento}<br>
                            Coordenadas: (${sel.coordenadas.x}, ${sel.coordenadas.y})
                        </div>`;
                    });
                }

                if (html === '') {
                    html = 'Esperando interacción...';
                }

                $metricsContent.html(html);
            } 
}

