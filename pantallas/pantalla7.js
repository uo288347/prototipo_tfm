export function renderScreen7() {
    const $instructions = $('<p>').text('Pulsación larga sobre la pantalla');
    const $area = $('<div>', { id: 'longPressArea' });
    const $p = $('<p>').text('       Prueba                            ');
    $area.append($p);    const $metrics = $('<div>', { class: 'metricas'}).text('Esperando pulsación...');
    $('#screen-content').empty().append($instructions, $area, $metrics);

    monitorLongPress($area, $metrics);
}

function monitorLongPress($area, $metrics) {
    let startX = 0;
    let startY = 0;
    let startTime = null;
    let metrics = null;
    let moves = [];
    let touch_moves = [];

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
            touch_moves.push({
                timestamp: Date.now(),
                x: e.touches[0].clientX,
                y: e.touches[0].clientY,
                radiusX: e.touches[0].radiusX || null,
                radiusY: e.touches[0].radiusY || null,
                area: Math.PI * e.touches[0].radiusX * e.touches[0].radiusY || null,
                force: e.touches[0].force || null
            });
    
        
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
        }
        actualizarMetricas();
    });

    function actualizarMetricas(){
        let html = '';
        console.log("updating metrics", metrics);
        /*html += '<div class="metricas">';
        html += `           
            Momento inicial: ${metrics.startTime}<br>
            Momento final: ${metrics.endTime}<br>
            Duración: ${metrics.duration}ms<br>
            Posición inicial: (${Math.round(metrics.startX)}, ${Math.round(metrics.startY)}<br>
            Posición final: (${Math.round(metrics.endX)}, ${Math.round(metrics.endY)}<br>            
            Movimientos: ${metrics.moves.length} registros<br>`;
        if(metrics.touch_moves.length > 0){ 
            html += `Touch Moves: ${metrics.touch_moves.length} registros<br>
            ${metrics.touch_moves[0].startTime ? `Momento inicial: ${metrics.touch_moves[0].startTime}<br>` : ''}
            ${metrics.touch_moves[touch_moves.length - 1].endTime ? `Momento final: ${metrics.touch_moves[touch_moves.length - 1].endTime}<br>` : ''}   
            ${metrics.touch_moves[0].radiusX ? `Radio X inicial: ${metrics.touch_moves[0].radiusX}<br>` : ''}
            ${metrics.touch_moves[0].radiusY ? `Radio Y inicial: ${metrics.touch_moves[0].radiusY}<br>` : ''}
            ${metrics.touch_moves[0].area ? `Área: ${metrics.touch_moves[0].area}<br>` : ''}
            ${metrics.touch_moves[0].force ? `Fuerza inicial: ${metrics.touch_moves[0].force}<br>` : ''}`
        }
        html += '</div>';*/
        $metrics.html(html);

        console.log("touch moves", metrics.touch_moves)
    }
}