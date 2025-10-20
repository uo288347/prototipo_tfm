export function renderScreen8() {
    /*
     <div id="canvas" aria-label="Área de prueba de toques"></div>

  <div class="debug" id="debug" aria-hidden="true">
    <strong>Toques activos:</strong>
    <ul id="debug-list" style="padding-left:1rem;margin:0.4rem 0 0 0;"></ul>
    <small style="display:block;margin-top:6px;color:#666;">Nota: no todos los dispositivos reportan el tamaño del contacto.</small>
  </div>

  <div class="controls">
        <h3>🎨 Controles</h3>
        <div class="control-group">
            <label>Color:</label>
            <input type="color" id="colorPicker" value="#ff6b6b">
        </div>
        <div class="control-group">
            <label>Opacidad: <span id="opacityValue">0.6</span></label>
            <input type="range" id="opacitySlider" min="0.1" max="1" step="0.1" value="0.6">
        </div>
        <div class="control-group">
            <label>Multiplicador: <span id="scaleValue">2</span>x</label>
            <input type="range" id="scaleSlider" min="1" max="5" step="0.5" value="2">
        </div>
        <button id="clearBtn">🗑️ Limpiar Canvas</button>
    </div>
*/
    const $instructions = $('<p>').text('Pulsa sobre la pantalla para pintar');

    const $area = $('<canvas>', { id: 'canvas' });
    for(let i=0; i<10; i++){
        $area.append('<br>');
    }

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
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
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
            ctx.lineWidth = 2;
            ctx.globalAlpha = opacity * 0.5;
            ctx.stroke();
            ctx.restore();
        }
        
        // Manejar eventos táctiles
        $canvas.on('touchstart', handleTouch, { passive: false });
        $canvas.on('touchmove', handleTouch, { passive: false });
        
        function handleTouch(e) {
            e.preventDefault();
            
            const color = colorPicker.value;
            
            for (let touch of e.touches) {
                const x = touch.clientX;
                const y = touch.clientY;
                
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
        /*html += `
            ${metrics.touch.radiusX ? `Radio X inicial: ${metrics.touch.radiusX}<br>` : ''}
            ${metrics.touch.radiusY ? `Radio Y inicial: ${metrics.touch.radiusY}<br>` : ''}
            ${metrics.touch.area ? `Área: ${metrics.touch.area}<br>` : ''}
            ${metrics.touch.rotationAngle ? `Ángulo de inclinación: ${metrics.touch.rotationAngle}<br>` : 
                'Ángulo de inclinación: 0<br>'}
            ${metrics.touch.force ? `Fuerza inicial: ${metrics.touch.force}<br>` : ''}`*/
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
