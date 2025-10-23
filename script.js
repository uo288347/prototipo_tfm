import { renderScreen1 } from './pantallas/pantalla1.js';
import { renderScreen2 } from './pantallas/pantalla2.js';
import { renderScreen3 } from './pantallas/pantalla3.js';
import { renderScreen5 } from './pantallas/pantalla5.js';
import { renderScreen4 } from './pantallas/pantalla4.js';
import { renderScreen6 } from './pantallas/pantalla6.js';
import { renderScreen7 } from './pantallas/pantalla7.js';
import { renderScreen8 } from './pantallas/pantalla8.js';
import { renderScreen9 } from './pantallas/pantalla9.js';

let currentScreen = 7;

// Array de funciones, cada una renderiza una pantalla
const screens = [
  () => renderScreen1(),
  () => renderScreen2(),
  () => renderScreen3(),
  () => renderScreen4(),
  () => renderScreen5(),
  () => renderScreen6(),
  () => renderScreen7(),
  () => renderScreen8(),
  () => renderScreen9()
];

const TOTAL_SCREENS = screens.length;
function renderScreen() {
  $('#screen-indicator').text(`${currentScreen}/${TOTAL_SCREENS}`);
  if (screens[currentScreen - 1]) {
    screens[currentScreen - 1]();
  } else {
    $('#screen-content').empty();
  }
}

$('#prevBtn').on('click', function() {
  if (currentScreen > 1) {
    currentScreen--;
    renderScreen();
  }
});
$('#nextBtn').on('click', function() {
  if (currentScreen < TOTAL_SCREENS) {
    currentScreen++;
    renderScreen();
  }
});

$(document).ready(function() {
  renderScreen();
});