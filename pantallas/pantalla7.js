export function renderScreen7() {
    const $instructions = $('<p>').text('Pulsación larga sobre la pantalla');

    const $area = $('<div>', { id: 'longPressArea' });
    for(let i=0; i<10; i++){
        $area.append('<br>');
    }
    const $metrics = $('<div>', { class: 'metricas'}).text('Esperando pulsación...');
    $('#screen-content').empty().append($instructions, $area, $metrics);

    monitorLongPress($area, $metrics);
}

function monitorLongPress($area, $metrics) {
    let startX = 0;
    let startY = 0;
    let startTime = null;
    let metrics = null;
    let moves = [];
    let touch_moves = null;

    $area.on('pointerdown', function(e) {
        startX = e.clientX;
        startY = e.clientY;
        startTime = Date.now();
        $metrics.text('Dedo presionado... suelta para ver métricas');
    });

    $area.on('pointermove', function(e) {
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

    $area.on('touchstart', function(e) {
            const newTouches = e.changedTouches;
            const lastTouch = newTouches[newTouches.length - 1];
            console.log("newTouches", newTouches, lastTouch);
            touch_moves={
                timestamp: Date.now(),
                x: lastTouch.clientX,
                y: lastTouch.clientY,
                radiusX: lastTouch.radiusX || null,
                radiusY: lastTouch.radiusY || null,
                area: Math.PI * lastTouch.radiusX * lastTouch.radiusY || null,
                force: lastTouch.force || null
            };
    
        
        //console.log(touch_moves);
        //console.log(e);
    });

    $area.on('pointerup', function(e) {
        const endTime = Date.now();
        const duration = endTime - startTime;

        if (duration >= 500) { // Umbral de pulsación larga (500 ms)
            metrics = {
                startTime: new Date(startTime).toLocaleTimeString(),
                endTime: new Date(endTime).toLocaleTimeString(),
                duration: duration,
                startX: startX,
                startY: startY,
                endX: e.clientX,
                endY: e.clientY,
                moves: moves,
                touch_moves: touch_moves
            }
            console.log("metrics", metrics);
            actualizarMetricas();
        }
    });

    function actualizarMetricas(){
        let html = '';
        html += '<div class="metricas">';
        html += `           
            Momento inicial: ${metrics.startTime}<br>
            Momento final: ${metrics.endTime}<br>
            Duración: ${metrics.duration}ms<br>
            Posición inicial: (${Math.round(metrics.startX)}, ${Math.round(metrics.startY)}<br>
            Posición final: (${Math.round(metrics.endX)}, ${Math.round(metrics.endY)}<br>            
            <strong>Movimientos: ${metrics.moves.length} registros</strong><br>`;
        html += `Touch Moves: ${metrics.touch_moves.length} registros<br>
            ${metrics.touch_moves.timestamp ? `Timestamp: ${metrics.touch_moves.timestamp}<br>` : ''}
            ${metrics.touch_moves.x ? `(${metrics.touch_moves.x}, ` : ''}   
            ${metrics.touch_moves.y ? `${metrics.touch_moves.y})` : ''} 
            ${metrics.touch_moves.radiusX ? `Radio X inicial: ${metrics.touch_moves.radiusX}<br>` : ''}
            ${metrics.touch_moves.radiusY ? `Radio Y inicial: ${metrics.touch_moves.radiusY}<br>` : ''}
            ${metrics.touch_moves.area ? `Área: ${metrics.touch_moves.area}<br>` : ''}
            ${metrics.touch_moves.force ? `Fuerza inicial: ${metrics.touch_moves.force}<br>` : ''}`
        }
        html += '</div>';
        $metrics.html(html);

        console.log("touch moves", metrics.touch_moves)
    }
}