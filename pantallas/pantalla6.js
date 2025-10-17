export function renderScreen6() {
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

            // Variables para drag
            let isDragging = false;
            let startX = 0;
            let startY = 0;
            let currentX = 0;
            let currentY = 0;
            let dragStartTime = null;
            let dragPointerId = null; // Para asegurar que solo rastreamos 1 puntero
            let dragMoves = [];

            // Variables para pinch
            let isPinching = false;
            let initialDistance = 0;
            let pinchStartTime = null;
            let pinchCenter = { x: 0, y: 0 };
            let startX1 = 0, startY1 = 0, startX2 = 0, startY2 = 0;
            let currentX1 = 0, currentY1 = 0, currentX2 = 0, currentY2 = 0;
            let pinchMoves = [];

            // Variable para doble clic
            let isZoomed = false;
            let lastClickTime = 0;
            let firstX = 0, firstY = 0, secondX = 0, secondY = 0;

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
            $img.on('pointerdown', function(e) {
                dragMoves = [];
                if (e.pointerType === 'touch' && e.originalEvent.touches && e.originalEvent.touches.length > 1) {
                    return; // Ignorar si es multi-touch
                }

                isDragging = true;
                dragStartTime = Date.now();
                startX = e.clientX - currentX;
                startY = e.clientY - currentY;
                
                $img.css('transition', 'none');
            });

            $(document).on('pointermove', function(e) {
                if (!isDragging) return;

                currentX = e.clientX - startX;
                currentY = e.clientY - startY;

                dragMoves.push({
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

                $img.css('transform', `translate(${currentX}px, ${currentY}px)`);
            });

            $(document).on('pointerup', function(e) {
                if (isDragging) {
                    const duracion = Date.now() - dragStartTime;
                    if(duracion === 0) return;
                    
                    metricas.drags.push({
                        momento: new Date().toLocaleTimeString(),
                        duracion: duracion,
                        coordenadasInicio: { x: startX, y: startY },
                        coordenadasFin: { x: e.clientX, y: e.clientY },
                        desplazamiento: { x: currentX, y: currentY },
                        moves: dragMoves
                    });

                    // Volver a posición inicial
                    $img.css('transition', 'transform 0.3s ease');
                    $img.css('transform', 'translate(0px, 0px)');
                    currentX = 0;
                    currentY = 0;
                    dragMoves = [];
                    
                    isDragging = false;
                    $img.css('cursor', 'move');
                    
                    actualizarMetricas();
                }
            });

    // ========== 2. PINCH (Touch Events) & DRAG TÁCTIL (Touch Events) ==========
    // =======================================
    
    $container.on('touchstart', function(e) {
        // Usar e.originalEvent para acceder a las propiedades nativas
        const touches = e.originalEvent.touches;
        
        
        if (touches.length > 1) {
            pinchMoves = [];
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
            startX1 = touch1.clientX;
            startY1 = touch1.clientY;
            startX2 = touch2.clientX;
            startY2 = touch2.clientY;

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

            pinchMoves.push({
                    timestamp: Date.now(),
                    x1: touch1.clientX,
                    y1: touch1.clientY,
                    x2: touch2.clientX,
                    y2: touch2.clientY,
                    pressure: touch1.pressure,
                    width: touch1.width || null,
                    height: touch1.height || null
                });
            
            currentX1 = touch1.clientX;
            currentY1 = touch1.clientY;
            currentX2 = touch2.clientX;
            currentY2 = touch2.clientY;
            
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
                distanciaInicial: Math.round(initialDistance),
                startX1: startX1,
                startY1: startY1,
                startX2: startX2,
                startY2: startY2,
                endX1: currentX1,
                endY1: currentY1,
                endX2: currentX2,
                endY2: currentY2,
                moves: pinchMoves
            });
            pinchMoves = [];

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

                    secondX = e.clientX;
                    secondY = e.clientY;

                    metricas.doubleClicks.push({
                        momento1: new Date(lastClickTime).toLocaleTimeString(),
                        momento2: new Date().toLocaleTimeString(),
                        firstX: firstX,
                        firstY: firstY,
                        secondX: e.clientX, 
                        secondY: e.clientY,
                        pageX: e.pageX,
                        pageY: e.pageY,
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
                firstX = e.clientX;;
                firstY = e.clientY;
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
                                Distancia inicial: ${pinch.distanciaInicial}px<br>
                                Toque 1 - Inicio: (${Math.round(pinch.startX1)}, ${Math.round(pinch.startY1)}) Fin: (${Math.round(pinch.endX1)}, ${Math.round(pinch.endY1)})<br>
                                Toque 2 - Inicio: (${Math.round(pinch.startX2)}, ${Math.round(pinch.startY2)}) Fin: (${Math.round(pinch.endX2)}, ${Math.round(pinch.endY2)})<br>
                                Movimientos: ${pinch.moves.length} registros
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
                                Desplazamiento: (${Math.round(drag.desplazamiento.x)}px, ${Math.round(drag.desplazamiento.y)}px)<br>
                                Movimientos: ${drag.moves.length} registros
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
                                ${idx + 1}. Momento1: ${dc.momento1}<br>
                                Momento2: ${dc.momento2}<br>
                                Primer clic - Coordenadas: (${Math.round(dc.firstX)}, ${Math.round(dc.firstY)})<br>
                                Segundo clic - Coordenadas: (${Math.round(dc.secondX)}, ${Math.round(dc.secondY)})<br>
                                Página (2nd) - Coordenadas: (${Math.round(dc.pageX)}, ${Math.round(dc.pageY)})<br>
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