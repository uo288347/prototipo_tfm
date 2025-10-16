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
            let dragStartTime = null;
            let dragPointerId = null; // Para asegurar que solo rastreamos 1 puntero

            // --- VARIABLES DE PINCH (Touch Events) ---
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

            function getDistance(touch1, touch2) {
                return Math.hypot(
                    touch2.clientX - touch1.clientX,
                    touch2.clientY - touch1.clientY
                );
            }

            // ========== DRAG ==========
            // ========== 1. DRAG (Pointer Events) ==========
    // =======================================
    $container.on('pointerdown', function(e) {
        // Solo iniciar DRAG si es el primer puntero (dragPointerId es null)
        if (dragPointerId !== null) return;
        
        // Excluir dispositivos táctiles para permitir que los Touch Events manejen el pinch
        if (e.originalEvent.pointerType === 'touch') {
            // Este puntero es táctil. Dejamos que los Touch Events decidan si es drag o pinch.
            return; 
        }

        // Si es mouse/pen y no estamos ya en drag, iniciar el DRAG
        isDragging = true;
        dragPointerId = e.pointerId;
        dragStartTime = Date.now();
        
        // Obtener la posición inicial de forma similar a tu lógica original
        startX = e.clientX - currentX;
        startY = e.clientY - currentY;
        
        $img.css('transition', 'none');
        //$(this).css('cursor', 'grabbing');
    });

    $(document).on('pointermove', function(e) {
        if (!isDragging || e.pointerId !== dragPointerId) return;

        currentX = e.clientX - startX;
        currentY = e.clientY - startY;
        
        const scaleBase = isZoomed ? 2 : 1;
        $img.css('transform', `scale(${scaleBase}) translate(${currentX}px, ${currentY}px)`);
    });

    $(document).on('pointerup pointercancel', function(e) {
        if (!isDragging || e.pointerId !== dragPointerId) return;
        
        // DRAG END
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
        const scaleBase = isZoomed ? 2 : 1;
        $img.css('transform', `scale(${scaleBase}) translate(0px, 0px)`);
        currentX = 0;
        currentY = 0;
        
        isDragging = false;
        dragPointerId = null;
        $img.css('cursor', 'move');
        
        actualizarMetricas();
    });

    // ========== 2. PINCH (Touch Events) & DRAG TÁCTIL (Touch Events) ==========
    // =======================================
    
    $container.on('touchstart', function(e) {
        // Usar e.originalEvent para acceder a las propiedades nativas
        const touches = e.originalEvent.touches;
        
        if (touches.length > 1) {
            e.preventDefault(); // Prevenir el zoom/scroll del navegador

            // Si hay 2 o más toques, es un PINCH
            isPinching = true;
            isDragging = false; // Asegurarse de que el Drag no esté activo
            pinchStartTime = Date.now();

            const touch1 = touches[0];
            const touch2 = touches[1];

            initialDistance = getDistance(touch1, touch2);

            pinchCenter = {
                x: (touch1.clientX + touch2.clientX) / 2,
                y: (touch1.clientY + touch2.clientY) / 2
            };

            $img.css('transition', 'none');
            
        } else if (touches.length === 1 && dragPointerId === null) {
            // Si es un solo toque (y no hay Drag de mouse/pen activo), iniciar DRAG TÁCTIL
            // La lógica de DRAG ya está cubierta por los Pointer Events si no ignoramos el 'touch'
            // Pero para asegurarnos de que el pinch anula el drag, ponemos el flag.
            // Para simplicidad, DEJAMOS QUE EL DRAG ANTERIOR MANEJE EL TOQUE ÚNICO, 
            // y solo usamos touchstart/move/end para EL PINCH.
            
            // **IMPORTANTE**: No hacer nada aquí para el single-touch, 
            // dejamos que el pointerdown lo maneje cuando no es multi-touch.
        }
    });

    $container.on('touchmove', function(e) {
        if (isPinching) {
            e.preventDefault();

            const touches = e.originalEvent.touches;
            if (touches.length < 2) return; // Se levantó un dedo, pero aún estamos en transición
            
            const touch1 = touches[0];
            const touch2 = touches[1];

            const currentDistance = getDistance(touch1, touch2);
            const currentScale = currentDistance / initialDistance;
            
            const scaleBase = isZoomed ? 2 : 1;
            // Combina el scale del pinch con el scale base del doble clic si es necesario
            $img.css('transform', `scale(${scaleBase * currentScale})`);
        }
    });

    $container.on('touchend touchcancel', function(e) {
        if (isPinching) {
            // Un dedo se levantó, o se canceló el gesto

            const duracion = Date.now() - pinchStartTime;
            
            metricas.pinches.push({
                momento: new Date().toLocaleTimeString(),
                duracion: duracion,
                centroPinch: pinchCenter,
                distanciaInicial: Math.round(initialDistance)
            });

            // Volver a posición inicial del pinch
            $img.css('transition', 'transform 0.3s ease');
            
            // Restaurar la escala al estado base (la del doble clic)
            const scaleBase = isZoomed ? 2 : 1;
            $img.css('transform', `scale(${scaleBase}) translate(0, 0)`);
            
            isPinching = false;
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