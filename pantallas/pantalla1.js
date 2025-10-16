export function renderScreen1() {
  const $btn = $('<button>', { id: 'clickBtn', text: 'Haz click o toca aquí' });
  const $output = $('<p>', { id: 'output', text: 'Esperando interacción...' });
  $('#screen-content').empty().append($btn, $output);
  attachButtonEvents($btn, $output);
}

function attachButtonEvents($btn, $output) {
  let downTime = null, upTime = null, moves = [];
  $btn.off(); // Limpia eventos previos

  
  function showData(data) {
    //console.log(data); 
    $output.html(`<pre>${JSON.stringify(data, null, 2)}</pre>`);
  }

  $btn.on('pointerdown', function(e) {
    downTime = Date.now();
    moves = [];
    showData({
      type: 'pointerdown',
      timestamp: downTime,
      time: new Date(downTime).toLocaleString(),
      pointerType: e.pointerType,
      x: e.clientX,
      y: e.clientY,
      screenX: e.screenX,
      screenY: e.screenY,
      pressure: e.pressure,
      button: e.button,
      width: e.width || null,
      height: e.height || null,
      area: (e.width && e.height) ? e.width * e.height : null
    });
  });
  $btn.on('pointermove', function(e) {
    moves.push({
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
    showData({
      type: 'pointermove',
      moves_count: moves.length,
      moves
    });
  });
  $btn.on('pointerup', function(e) {
    upTime = Date.now();
    showData({
      type: 'pointerup',
      timestamp: upTime,
      time: new Date(upTime).toLocaleString(),
      pointerType: e.pointerType,
      x: e.clientX,
      y: e.clientY,
      screenX: e.screenX,
      screenY: e.screenY,
      pressure: e.pressure,
      button: e.button,
      width: e.width || null,
      height: e.height || null,
      area: (e.width && e.height) ? e.width * e.height : null,
      duration_ms: upTime - downTime,
      moves_count: moves.length,
      moves
    });
    downTime = null;
    upTime = null;
    moves = [];
  });
  $btn.on('click', function(e) {
    showData({
      type: 'click',
      timestamp: Date.now(),
      time: new Date().toLocaleString(),
      pointerType: e.pointerType || 'mouse',
      x: e.clientX,
      y: e.clientY,
      screenX: e.screenX,
      screenY: e.screenY,
      pressure: e.pressure || null,
      button: e.button,
      width: e.width || null,
      height: e.height || null,
      area: (e.width && e.height) ? e.width * e.height : null
    });
  });
}


