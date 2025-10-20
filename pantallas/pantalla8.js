export function renderScreen8() {
    const $instructions = $('<p>').text('Pulsa sobre la pantalla para pintar');

    const $area = $('<canvas>', { id: 'canvas' });

    const $controls = $('<div>', { class: 'controls' });
    $controls.append('<h3>🎨 Controles</h3>');
    $controls.append(`
        <div class="control-group">
            <label>Color:</label>  
            <input type="color" id="colorPicker" value="#ff6b6b">
        </div>
    `);
    $controls.append(`
        <div class="control-group">
            <label>Multiplicador: <span id="scaleValue">1</span>x</label>
            <input type="range" id="scaleSlider" min="1" max="5" step="0.5" value="2">
        </div>
    `);
    $controls.append(`
        <button id="clearBtn">🗑️ Limpiar Canvas</button>
    `);

    const $metrics = $('<div>', { class: 'metricas'}).text('Esperando pulsación...');
    $('#screen-content').empty().append($instructions, $area, $controls, $metrics);

    monitorPress($area, $metrics, $controls);
}

function monitorPress($canvas, $metrics, $controls) {
        const canvas = $canvas[0];
        const ctx = canvas.getContext('2d');
        const colorPicker = $controls.find('#colorPicker')[0];
        const scaleSlider = $controls.find('#scaleSlider')[0];
        const scaleValue = $controls.find('#scaleValue')[0];
        const clearBtn = $controls.find('#clearBtn')[0];
        
        // Configurar canvas
        function resizeCanvas() {
            const rect = canvas.getBoundingClientRect();
            canvas.width = rect.width;
            canvas.height = rect.height;
        }
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);
                
        scaleSlider.addEventListener('input', (e) => {
            scaleValue.textContent = e.target.value;
        });
     
        // Función para dibujar elipse
        function drawEllipse(x, y, radiusX, radiusY, color, opacity=1) {
            const scale = parseFloat(scaleSlider.value);
            
            ctx.save();
            ctx.beginPath();
            ctx.ellipse(x, y, radiusX * scale, radiusY * scale, 0, 0, Math.PI * 2);
            ctx.fillStyle = color;
            ctx.globalAlpha = opacity;
            ctx.fill();
            
            // Borde
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
            ctx.lineWidth = 1;
            ctx.globalAlpha = opacity * 0.5;
            ctx.stroke();
            ctx.restore();
        }
        
        // Manejar eventos táctiles
        canvas.addEventListener('touchstart', handleTouch, { passive: false });
        canvas.addEventListener('touchmove', handleTouch, { passive: false });
        /*$canvas.on('touchstart', handleTouch);
        $canvas.on('touchmove', handleTouch);*/
        
        function handleTouch(e) {
            console.log("handleTouch", e, e.touches.length);
            e.preventDefault();
            
            const rect = canvas.getBoundingClientRect(); 
            const color = colorPicker.value;
            
            for (let touch of e.touches) {
                const x = touch.clientX - rect.left;
                const y = touch.clientY - rect.top;
                
                // radiusX y radiusY representan el tamaño del área de contacto
                // Si no están disponibles, usar valores por defecto
                const radiusX = touch.radiusX || 20;
                const radiusY = touch.radiusY || 20;
                
                drawEllipse(x, y, radiusX, radiusY, color);
                console.log(`Dibujado en (${x}, ${y}) con área (${radiusX}, ${radiusY})`);
            }

             const newTouches = e.changedTouches;
            console.log("touches", e.changedTouches);
            
            const lastTouch = newTouches[newTouches.length - 1];
            console.log("newTouches", newTouches, lastTouch);
            const { radiusX, radiusY } = normalizeTouchRadius(lastTouch);
            touch={
                timestamp: Date.now(),
                x: lastTouch.clientX,
                y: lastTouch.clientY,
                radiusX: radiusX || null,
                radiusY: radiusY || null,
                area: Math.PI * radiusX * radiusY || null,
                rotationAngle: lastTouch.rotationAngle || null,
                force: lastTouch.force || null
            };
        }
        
        // Limpiar canvas
        clearBtn.addEventListener('click', () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        });

    let startX = 0;
    let startY = 0;
    let startTime = null;
    let metrics = null;
    let moves = [];
    let touch = null;

    $canvas.on('pointerdown', function(e) {
        startX = e.clientX;
        startY = e.clientY;
        startTime = Date.now();
        $metrics.text('Dedo presionado... suelta para ver métricas');
    });

    $canvas.on('pointermove', function(e) {
        moves.push({
                timestamp: Date.now(),
                x: e.clientX,
                y: e.clientY,
                pageX: e.pageX,
                pageY: e.pageY,
                pressure: e.pressure,
                width: e.width || null,
                height: e.height || null,
                area: (e.width && e.height) ? e.width * e.height : null
            });
    });

    $canvas.on('pointerup', function(e) {
        const endTime = Date.now();
        const duration = endTime - startTime;

        metrics = {
                startTime: new Date(startTime).toLocaleTimeString(),
                endTime: new Date(endTime).toLocaleTimeString(),
                duration: duration,
                startX: startX,
                startY: startY,
                endX: e.clientX,
                endY: e.clientY,
                moves: moves,
                touch: touch
        }            
        console.log("metrics", metrics);
        actualizarMetricas();
    });

    function actualizarMetricas(){
        let html = '';
        html += '<div class="metricas">';
        html += `           
            Momento inicial: ${metrics.startTime}<br>
            Momento final: ${metrics.endTime}<br>
            Duración: ${metrics.duration}ms<br>
            Posición inicial: (${Math.round(metrics.startX)}, ${Math.round(metrics.startY)})<br>
            Posición final: (${Math.round(metrics.endX)}, ${Math.round(metrics.endY)})<br>            
            Movimientos: ${metrics.moves.length} registros<br>`;
        html += `
            ${metrics.touch.radiusX ? `Radio X inicial: ${metrics.touch.radiusX}<br>` : ''}
            ${metrics.touch.radiusY ? `Radio Y inicial: ${metrics.touch.radiusY}<br>` : ''}
            ${metrics.touch.area ? `Área: ${metrics.touch.area}<br>` : ''}
            ${metrics.touch.rotationAngle ? `Ángulo de inclinación: ${metrics.touch.rotationAngle}<br>` : 
                'Ángulo de inclinación: 0<br>'}
            ${metrics.touch.force ? `Fuerza inicial: ${metrics.touch.force}<br>` : ''}`
        html += '</div>';
        $metrics.html(html);
    }

    function normalizeTouchRadius(touch) {
        const dpr = window.devicePixelRatio || 1;

        return {
            radiusX: touch.radiusX / dpr,
            radiusY: touch.radiusY / dpr
        };
    }
}
