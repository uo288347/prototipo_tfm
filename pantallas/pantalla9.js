export function renderScreen9() {
    const $instructions = $('<p>').text('Pulsa sobre la pantalla para pintar');

    const $area = $('<div>', { id: 'longPressArea' });
    for(let i=0; i<10; i++){
        $area.append('<br>');
    }
    const $metrics = $('<div>', { class: 'metricas'}).text('Esperando pulsación...');
    $('#screen-content').empty().append($instructions, $area, $metrics);

    monitorPress($area, $metrics);
}

function monitorPress($area, $metrics) {
    let pressureInit, pressureEnd = null;
    let widthInit, widthEnd = null;
    let heightInit, heightEnd = null;
    let areaInit, areaEnd = null;
    let radiusXareaTInit, radiusYareaTInit = null;
    let radiusXTEnd, radiusYTEnd = null;
    let areaTInit, areaTEnd = null;
    $area.on('pointerdown', function(e) {
        pressureInit = e.pressure;
        widthInit = e.width || null;
        heightInit = e.height || null;
        areaInit = (e.width && e.height) ? e.width * e.height : null;
        actualizarMetricas();
    });

    $area.on('pointerup', function(e) {
        pressureEnd = e.pressure;
        widthEnd = e.width || null;
        heightEnd = e.height || null;
        areaEnd = (e.width && e.height) ? e.width * e.height : null;
    });

    $area.on('touchstart', function(e) {
        newTouches = e.changedTouches;
        lastTouch = newTouches[newTouches.length - 1];
        console.log("newTouches", newTouches, lastTouch);
        radiusXareaTInit, radiusYareaTInit = normalizeTouchRadius(lastTouch);
        areaTInit = Math.PI * radiusXareaTInit * radiusYareaTInit || null;
    });

    $area.on('touchend', function(e) {
        newTouches = e.changedTouches;
        lastTouch = newTouches[newTouches.length - 1];
        console.log("newTouches", newTouches, lastTouch);
        radiusXTEnd, radiusYTEnd = normalizeTouchRadius(lastTouch);
        areaTEnd = Math.PI * radiusXTEnd * radiusYTEnd || null;
    });

    function normalizeTouchRadius(touch) {
        let radiusX = touch.radiusX;
        let radiusY = touch.radiusY;
        return {radiusX, radiusY};
    }

    function actualizarMetricas() {
        $metrics.html(
            `<strong>Métricas de la pulsación:</strong><br>
            Presión inicial: ${pressureInit}<br>
            Ancho inicial: ${widthInit}<br>
            Alto inicial: ${heightInit}<br>
            Área inicial: ${areaInit}<br>
            <br>
            Presión final: ${pressureEnd}<br>
            Ancho final: ${widthEnd}<br>
            Alto final: ${heightEnd}<br>
            Área final: ${areaEnd}<br>
            <br>
            Radio X inicial (touch): ${radiusXareaTInit}<br>
            Radio Y inicial (touch): ${radiusYareaTInit}<br>
            Área inicial (touch): ${areaTInit}<br>
            <br>
            Radio X final (touch): ${radiusXTEnd}<br>
            Radio Y final (touch): ${radiusYTEnd}<br>
            Área final (touch): ${areaTEnd}<br>`
        );
    }

}