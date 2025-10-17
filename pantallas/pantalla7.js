export function renderScreen7() {
    const $instructions = $('<p>').text('Pulsación larga sobre la pantalla');
    const $area = $('<div>', { id: 'longPressArea' });
    const $p = $('<p>').text('Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam dapibus mattis quam. Etiam tellus sapien, eleifend vitae gravida a, tincidunt vel massa. Duis efficitur volutpat felis at ullamcorper. Nam hendrerit lorem nisi, ut eleifend ligula commodo quis. Phasellus varius eleifend sapien eget molestie. Maecenas sagittis neque vitae sem gravida ullamcorper. Integer viverra turpis efficitur odio elementum convallis. Etiam vitae nisi libero. Nulla feugiat maximus nunc id condimentum. Ut finibus luctus risus, vel tincidunt lectus tempus vitae. Integer aliquet, nulla ac semper facilisis, nisl nulla interdum mauris, ac convallis ipsum sapien sed quam. Nullam fermentum fermentum enim, posuere condimentum erat pretium velIn dapibus augue non metus ornare lobortis. Nulla blandit porttitor condimentum. Aliquam rhoncus ullamcorper neque. Etiam sed laoreet arcu. Duis at eros eget sem blandit dictum vitae ut massa. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Nullam tincidunt ante non libero semper fermentum vitae non magna. Praesent et nisl nibh. Integer vestibulum, elit ac posuere vulputate, nisl libero auctor sem, in commodo eros mi non mauris. Sed blandit tincidunt ullamcorper. Aliquam erat volutpat. Nunc pharetra nisl erat, ac viverra turpis mollis consequat. Fusce fermentum eros quam, eget efficitur ante dapibus et. Duis volutpat accumsan ullamcorper. Donec non molestie arcu.Vivamus nisl purus, tristique eu dignissim in, rutrum sed sem. Phasellus euismod lacinia sapien, in efficitur velit tristique vitae. Praesent eu auctor libero, mattis porttitor tortor. Phasellus et ornare risus. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Etiam rutrum mollis magna, eu maximus felis elementum in. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam ullamcorper diam non sapien pharetra dignissim. Integer sollicitudin eu mi vel bibendum. Quisque eu dolor rhoncus, rhoncus odio eu, pretium turpis. Nam tristique erat sagittis lobortis tincidunt. Donec quis tempus sem. Ut interdum lorem ac ligula imperdiet, in tempus odio gravida. Quisque vel lectus a elit mollis accumsan.');
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
                x: e.touches[e.touches.length-1].clientX,
                y: e.touches[e.touches.length-1].clientY,
                radiusX: e.touches[e.touches.length-1].radiusX || null,
                radiusY: e.touches[e.touches.length-1].radiusY || null,
                area: Math.PI * e.touches[e.touches.length-1].radiusX * e.touches[e.touches.length-1].radiusY || null,
                force: e.touches[e.touches.length-1].force || null
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
        html += '</div>';
        $metrics.html(html);

        console.log("touch moves", metrics.touch_moves)
    }
}