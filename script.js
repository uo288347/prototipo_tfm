import { renderScreen1 } from './pantallas/pantalla1.js';
import { renderScreen2 } from './pantallas/pantalla2.js';
import { renderScreen3 } from './pantallas/pantalla3.js';
import { renderScreen5 } from './pantallas/pantalla5.js';
import { renderScreen4 } from './pantallas/pantalla4.js';
import { renderScreen6 } from './pantallas/pantalla6.js';

let currentScreen = 1;

// Array de funciones, cada una renderiza una pantalla
const screens = [
  () => renderScreen1(),
  () => renderScreen2(),
  () => renderScreen3(),
  () => renderScreen4(),
  () => renderScreen5(),
  () => renderScreen6()
  // ...añade más funciones importadas aquí
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