import { renderScreen1, renderScreen2, renderScreen3 } from './pantallas.js';

const TOTAL_SCREENS = 10;
let currentScreen = 1;

// Array de funciones, cada una renderiza una pantalla
const screens = [
  () => renderScreen1(attachButtonEvents),
  () => renderScreen2(monitorScreen2Interactions),
  renderScreen3,
  // ...añade más funciones importadas aquí
];

function renderScreen() {
  $('#screen-indicator').text(`${currentScreen}/${TOTAL_SCREENS}`);
  if (screens[currentScreen - 1]) {
    screens[currentScreen - 1]();
  } else {
    $('#screen-content').empty();
  }
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
      button: e.button,
      width: e.width || null,
      height: e.height || null,
      area: (e.width && e.height) ? e.width * e.height : null
    });
  });
}

function monitorScreen2Interactions() {
  const $screenContent = $('#screen-content');
  const $imagenConejo = $screenContent.find('.imagen-conejo');

  let downTime = null, upTime = null;
  let moves = [];
  let allEvents = [];
  let scrollMoves = [];

  // Función para registrar y mostrar en consola
  function logEvent(data) {
    data.timestamp = Date.now();
    data.time = new Date().toLocaleString();
    allEvents.push(data);

    if (data.type === 'scroll') {
      scrollMoves.push(data.scrollData);
    }

    console.log(data);
  }

  // Pointer events sobre la imagen
  $imagenConejo.on('pointerdown', e => {
    downTime = Date.now();
    moves = [];
    logEvent({
      type: 'pointerdown',
      pointerType: e.pointerType,
      x: e.clientX,
      y: e.clientY,
      screenX: e.screenX,
      screenY: e.screenY,
      pressure: e.pressure,
      button: e.button
    });
  });

  $imagenConejo.on('pointermove', e => {
    const moveData = {
      timestamp: Date.now(),
      x: e.clientX,
      y: e.clientY,
      screenX: e.screenX,
      screenY: e.screenY,
      pressure: e.pressure
    };
    moves.push(moveData);
    logEvent({ type: 'pointermove', move: moveData });
  });

  $imagenConejo.on('pointerup', e => {
    upTime = Date.now();
    logEvent({
      type: 'pointerup',
      pointerType: e.pointerType,
      x: e.clientX,
      y: e.clientY,
      screenX: e.screenX,
      screenY: e.screenY,
      pressure: e.pressure,
      duration_ms: upTime - downTime,
      moves_count: moves.length,
      moves
    });
    downTime = null;
    upTime = null;
    moves = [];
  });

  $imagenConejo.on('click', e => {
    logEvent({
      type: 'click',
      pointerType: e.pointerType || 'mouse',
      x: e.clientX,
      y: e.clientY,
      screenX: e.screenX,
      screenY: e.screenY
    });
  });

  // Scrolls de la ventana
  $(window).on('scroll', e => {
    const scrollData = {
      scrollX: window.scrollX,
      scrollY: window.scrollY
    };
    logEvent({ type: 'scroll', scrollData });
  });
}


$('#prevBtn').on('click', function() {
  if (currentScreen > 1) {
    currentScreen--;
    console.log(currentScreen);
    renderScreen();
  }
});
$('#nextBtn').on('click', function() {
  if (currentScreen < TOTAL_SCREENS) {
    currentScreen++;
    console.log(currentScreen);
    renderScreen();
  }
});

$(document).ready(function() {
  renderScreen();
});