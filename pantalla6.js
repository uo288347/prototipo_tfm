export function renderScreen6() {
    /*
    <div class="instrucciones">
            <h2>🖼️ Interactúa con la imagen</h2>
            <ul>
                <li><strong>Pinch (pellizcar):</strong> Usa dos dedos para hacer zoom. La imagen se ampliará y volverá al soltarla.</li>
                <li><strong>Drag (arrastrar):</strong> Arrastra la imagen por la pantalla. Volverá a su posición al soltarla.</li>
                <li><strong>Doble clic:</strong> Haz doble clic para ampliar la imagen al doble. Vuelve a hacer doble clic para restaurar.</li>
            </ul>
        </div>

        <div class="image-container" id="imageContainer">
            <img id="interactiveImage" 
                 src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop" 
                 alt="Imagen interactiva">
        </div>

        <div class="metricas">
            <h3>📊 Métricas de Interacción</h3>
            <div id="metricasContenido">Esperando interacción...</div>
        </div>*/
    const $instructions = $('<div>', { class: 'instrucciones'});
    const $h2_inst = $('<h2>').text('🖼️ Interactúa con la imagen');
    const $ul_inst = $('<ul>');
    const instrucciones = [
        { strong: 'Pinch (pellizcar):', text: ' Usa dos dedos para hacer zoom. La imagen se ampliará y volverá al soltarla.' },
        { strong: 'Drag (arrastrar):', text: ' Arrastra la imagen por la pantalla. Volverá a su posición al soltarla.' },
        { strong: 'Doble clic:', text: ' Haz doble clic para ampliar la imagen al doble. Vuelve a hacer doble clic para restaurar.' }
    ];
    instrucciones.forEach(inst => {
        const $li = $('<li>').html(`<strong>${inst.strong}</strong>${inst.text}`);
        $ul_inst.append($li);
    });
    $instructions.append($h2_inst, $ul_inst);
    const $imageContainer = $('<div>', { class: 'image-container', id: 'imageContainer' });
    const $interactiveImage = $('<img>', {
        id: 'interactiveImage',
        src: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop',
        alt: 'Imagen interactiva'
    });
    $imageContainer.append($interactiveImage);
    const $metrics = $('<div>', { class: 'metricas' });
    const $h3_metrics = $('<h3>').text('📊 Métricas de Interacción');
    const $metricsContent = $('<div>', { id: 'metricasContenido', text: 'Esperando interacción...' });
    $metrics.append($h3_metrics, $metricsContent);
    $('#screen-content').empty().append($instructions, $imageContainer, $metrics);
    
    attachImageInteractions($interactiveImage, $imageContainer, $metricsContent);
}

function attachImageInteractions($img, $container, $metricsContent) {
            const metricas = {
                pinches: [],
                drags: [],
                doubleClicks: []
            };

            let isDragging = false;
            let startX = 0;
            let startY = 0;
            let currentX = 0;
            let currentY = 0;
            let currentScale = 1;
            let dragStartTime = null;

            // Variables para pinch
            const activePointers = new Map();
            let isPinching = false;
            let initialDistance = 0;
            let pinchStartTime = null;
            let pinchCenter = { x: 0, y: 0 };

            // Variable para doble clic
            let isZoomed = false;
            let lastClickTime = 0;

            // Prevenir comportamiento por defecto
            $img.on('dragstart', function(e) {
                e.preventDefault();
            });

            // ========== DRAG ==========
            // ========== PINCH (Multi-touch) ==========
    $container.on('pointerdown', function(e) {
        // Ignorar si ya estamos en un pinch (para evitar conflictos de inicio)
        if (isPinching) return; 

        // 1. Agregar el puntero al mapa
        activePointers.set(e.pointerId, e.originalEvent); // Almacenar el evento original para las coordenadas
        
        // 2. Comprobar si hay 2 punteros para iniciar el PINCH
        if (activePointers.size === 2) {
            e.preventDefault(); // Prevenir zoom/scroll del navegador
            isDragging = false; // Detener Drag si estaba activo

            isPinching = true;
            pinchStartTime = Date.now();
            $img.css('transition', 'none');

            // Obtener los dos punteros
            const pointers = Array.from(activePointers.values());
            const p1 = pointers[0];
            const p2 = pointers[1];

            initialDistance = getDistance(p1, p2);

            pinchCenter = {
                x: (p1.clientX + p2.clientX) / 2,
                y: (p1.clientY + p2.clientY) / 2
            };
            
            return; // Salir, es un pinch
        }

        // 3. Si no es un Pinch, iniciar el DRAG (solo con 1 puntero)
        if (activePointers.size === 1) {
            isDragging = true;
            dragStartTime = Date.now();
            
            // Obtener la posición actual de la imagen (0,0 si no hay zoom/drag previo)
            const transform = $img.css('transform');
            if (transform && transform !== 'none') {
                 const match = transform.match(/translate\(([^,]+)px, ([^)]+)px\)/);
                 if (match) {
                    currentX = parseFloat(match[1]);
                    currentY = parseFloat(match[2]);
                 }
            } else {
                 currentX = 0;
                 currentY = 0;
            }

            startX = e.clientX - currentX;
            startY = e.clientY - currentY;
            
            $img.css('transition', 'none');
            $(this).css('cursor', 'grabbing');
        }
    });

    // --- 2. pointermove (Mover Drag o Pinch) ---
    $container.on('pointermove', function(e) {
        if (activePointers.has(e.pointerId) && (isDragging || isPinching)) {
            e.preventDefault(); 
        }

        // Actualizar la posición del puntero en el mapa
        if (activePointers.has(e.pointerId)) {
            activePointers.set(e.pointerId, e.originalEvent);
        }

        // PINCH MOVE
        if (isPinching && activePointers.size === 2) {
            const pointers = Array.from(activePointers.values());
            const p1 = pointers[0];
            const p2 = pointers[1];
            
            const currentDistance = getDistance(p1, p2);
            currentScale = currentDistance / initialDistance; // Actualiza la escala
            
            // APLICACIÓN COMBINADA: Solo escala, ya que el pinch se resetea al soltar.
            // Si quieres que un pinch activo pueda ser arrastrado simultáneamente, 
            // la lógica es mucho más compleja, pero para el "zoom temporal", solo el scale es suficiente.
            $img.css('transform', `scale(${currentScale})`);
            return; 
        }

        // DRAG MOVE
        if (isDragging) {
            currentX = e.clientX - startX;
            currentY = e.clientY - startY;

            // APLICACIÓN COMBINADA: El Drag DEBE combinar el translate con la escala de Doble Clic (si está activa)
            // La escala base es 1, a menos que el doble clic esté activo (isZoomed).
            const scaleForDrag = isZoomed ? 2 : 1; 

            // COMBINAMOS la traslación con la escala actual (que es 1 si no hay Doble Clic)
            $img.css('transform', `scale(${scaleForDrag}) translate(${currentX}px, ${currentY}px)`);
        }
    });

    // --- 3. pointerup/pointercancel (Fin de Drag o Pinch) ---
    $container.on('pointerup pointercancel', function(e) {
        // Eliminar el puntero del mapa
        if (activePointers.has(e.pointerId)) {
            activePointers.delete(e.pointerId);
        }

        // PINCH END
        if (isPinching && activePointers.size < 2) {
            const duracion = Date.now() - pinchStartTime;
            
            metricas.pinches.push({
                momento: new Date().toLocaleTimeString(),
                duracion: duracion,
                centroPinch: pinchCenter,
                distanciaInicial: Math.round(initialDistance)
            });

            // Volver a posición inicial
            $img.css('transition', 'transform 0.3s ease');
        
            // RESTAURAR AL ESTADO BASE (escala del doble clic + 0,0 de traslación)
            const scaleBase = isZoomed ? 2 : 1;
            $img.css('transform', `scale(${scaleBase}) translate(0, 0)`); // Aquí restauramos
            
            currentScale = scaleBase; // Reiniciar la escala de movimiento
            isPinching = false;
            actualizarMetricas();
            return;
        }
        
        // DRAG END
        if (isDragging && activePointers.size === 0) {
            const duracion = Date.now() - dragStartTime;
            
            metricas.drags.push({
                momento: new Date().toLocaleTimeString(),
                duracion: duracion,
                coordenadasInicio: { x: startX, y: startY },
                coordenadasFin: { x: e.clientX, y: e.clientY },
                desplazamiento: { x: currentX, y: currentY }
            });

            // Volver a posición inicial
            $img.css('transition', 'transform 0.3s ease');
        
            // RESTAURAR AL ESTADO BASE (escala del doble clic + 0,0 de traslación)
            const scaleBase = isZoomed ? 2 : 1;
            $img.css('transform', `scale(${scaleBase}) translate(0px, 0px)`);
            
            currentX = 0;
            currentY = 0;
            isDragging = false;
            $img.css('cursor', 'move');
            
            actualizarMetricas();
        }
    });
            
            // ========== DOBLE CLIC ==========
            $img.on('click', function(e) {
                const currentTime = Date.now();
                const timeDiff = currentTime - lastClickTime;

                if (timeDiff < 300 && timeDiff > 0) {
                    // Es un doble clic
                    isZoomed = !isZoomed;

                    metricas.doubleClicks.push({
                        momento: new Date().toLocaleTimeString(),
                        coordenadas: { x: e.clientX, y: e.clientY },
                        accion: isZoomed ? 'Ampliar' : 'Restaurar',
                        escala: isZoomed ? 2 : 1
                    });

                    if (isZoomed) {
                        $img.css('transition', 'transform 0.3s ease');
                        $img.css('transform', 'scale(2)');
                    } else {
                        $img.css('transition', 'transform 0.3s ease');
                        $img.css('transform', 'scale(1)');
                    }

                    actualizarMetricas();
                }

                lastClickTime = currentTime;
            });

            function actualizarMetricas() {
                let html = '';

                if (metricas.pinches.length > 0) {
                    html += '<div class="metrica-item pinch"><div class="metrica-header">🤏 PINCH (Pellizcar)</div>';
                    metricas.pinches.forEach((pinch, idx) => {
                        html += `
                            <div style="margin-top: 8px;">
                                ${idx + 1}. Momento: ${pinch.momento}<br>
                                Duración: ${pinch.duracion}ms<br>
                                Centro del pinch: (${Math.round(pinch.centroPinch.x)}, ${Math.round(pinch.centroPinch.y)})<br>
                                Distancia inicial: ${pinch.distanciaInicial}px
                            </div>
                        `;
                    });
                    html += '</div>';
                }

                if (metricas.drags.length > 0) {
                    html += '<div class="metrica-item drag"><div class="metrica-header">👆 DRAG (Arrastrar)</div>';
                    metricas.drags.forEach((drag, idx) => {
                        html += `
                            <div style="margin-top: 8px;">
                                ${idx + 1}. Momento: ${drag.momento}<br>
                                Duración: ${drag.duracion}ms<br>
                                Inicio: (${Math.round(drag.coordenadasInicio.x)}, ${Math.round(drag.coordenadasInicio.y)})<br>
                                Fin: (${Math.round(drag.coordenadasFin.x)}, ${Math.round(drag.coordenadasFin.y)})<br>
                                Desplazamiento: (${Math.round(drag.desplazamiento.x)}px, ${Math.round(drag.desplazamiento.y)}px)
                            </div>
                        `;
                    });
                    html += '</div>';
                }

                if (metricas.doubleClicks.length > 0) {
                    html += '<div class="metrica-item doubleclick"><div class="metrica-header">🖱️ DOBLE CLIC</div>';
                    metricas.doubleClicks.forEach((dc, idx) => {
                        html += `
                            <div style="margin-top: 8px;">
                                ${idx + 1}. Momento: ${dc.momento}<br>
                                Coordenadas: (${Math.round(dc.coordenadas.x)}, ${Math.round(dc.coordenadas.y)})<br>
                                Acción: ${dc.accion}<br>
                                Escala: ${dc.escala}x
                            </div>
                        `;
                    });
                    html += '</div>';
                }

                if (html === '') {
                    html = 'Esperando interacción...';
                }

                $metricsContent.html(html);
            }
}