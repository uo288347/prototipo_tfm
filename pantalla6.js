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

            // Variables para pinch
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
            $img.on('pointerdown', function(e) {
                if (e.pointerType === 'touch' && e.originalEvent.touches && e.originalEvent.touches.length > 1) {
                    return; // Ignorar si es multi-touch
                }

                isDragging = true;
                dragStartTime = Date.now();
                startX = e.clientX - currentX;
                startY = e.clientY - currentY;
                
                $img.css('transition', 'none');
                $(this).css('cursor', 'grabbing');
            });

            $(document).on('pointermove', function(e) {
                if (!isDragging) return;

                currentX = e.clientX - startX;
                currentY = e.clientY - startY;

                $img.css('transform', `translate(${currentX}px, ${currentY}px)`);
            });

            $(document).on('pointerup', function(e) {
                if (isDragging) {
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
                    $img.css('transform', 'translate(0px, 0px)');
                    currentX = 0;
                    currentY = 0;
                    
                    isDragging = false;
                    $img.css('cursor', 'move');
                    
                    actualizarMetricas();
                }
            });

            // ========== PINCH (Multi-touch) ==========
            $container.on('pointerdown', function(e) {
                if (e.originalEvent.touches.length === 2) {
                    e.preventDefault();
                    isPinching = true;
                    pinchStartTime = Date.now();

                    const touch1 = e.originalEvent.touches[0];
                    const touch2 = e.originalEvent.touches[1];

                    initialDistance = Math.hypot(
                        touch2.clientX - touch1.clientX,
                        touch2.clientY - touch1.clientY
                    );

                    pinchCenter = {
                        x: (touch1.clientX + touch2.clientX) / 2,
                        y: (touch1.clientY + touch2.clientY) / 2
                    };

                    $img.css('transition', 'none');
                }
            });

            $container.on('pointermove', function(e) {
                if (isPinching && e.originalEvent.touches.length === 2) {
                    e.preventDefault();

                    const touch1 = e.originalEvent.touches[0];
                    const touch2 = e.originalEvent.touches[1];

                    const currentDistance = Math.hypot(
                        touch2.clientX - touch1.clientX,
                        touch2.clientY - touch1.clientY
                    );

                    const scale = currentDistance / initialDistance;

                    // Calcular centro actual del pinch
                    const currentCenter = {
                        x: (touch1.clientX + touch2.clientX) / 2,
                        y: (touch1.clientY + touch2.clientY) / 2
                    };

                    const imgRect = $img[0].getBoundingClientRect();
                    const offsetX = currentCenter.x - (imgRect.left + imgRect.width / 2);
                    const offsetY = currentCenter.y - (imgRect.top + imgRect.height / 2);

                    $img.css('transform', `scale(${scale}) translate(${offsetX}px, ${offsetY}px)`);
                }
            });

            $container.on('pointerup', function(e) {
                if (isPinching) {
                    const duracion = Date.now() - pinchStartTime;
                    
                    metricas.pinches.push({
                        momento: new Date().toLocaleTimeString(),
                        duracion: duracion,
                        centroPinch: pinchCenter,
                        distanciaInicial: Math.round(initialDistance)
                    });

                    // Volver a posición inicial
                    $img.css('transition', 'transform 0.3s ease');
                    $img.css('transform', 'scale(1) translate(0, 0)');
                    
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
});}