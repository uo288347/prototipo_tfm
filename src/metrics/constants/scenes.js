/**
 * Definición de Scene IDs para el tracking del experimento
 * Cada escena corresponde a una página o tarea específica del experimento
 * 
 * Este sistema permite capturar patrones táctiles únicos para identificación de usuarios
 * mediante el análisis de interacciones en cada fase del experimento
 */

export const SCENES = {
  // === FASE DE INICIO ===
  WELCOME: 0,                    // Pantalla de bienvenida antes de empezar
  INITIAL_FORM: 1,              // Formulario de datos demográficos iniciales (form.js)
  LOGIN: 2,                     // Página de login (login.js)
  
  // === FASE DE TAREAS (tasks_es.json) ===
  TASK_ACCEPT_TUTORIAL: 3,      // accept_tutorial - Leer instrucciones y completar tutorial
  TASK_ADD_PINK_DRESSES: 4,     // add_pink_dresses - Añadir 2 unidades de "Vestido de verano rosa" (M)
  TASK_OFFER_GREEN_COAT: 5,     // offer_green_coat - Encontrar código gratuito en imágenes y aplicarlo
  TASK_ADD_GREEN_COAT: 6,       // add_green_coat - Añadir "Abrigo verde" al carrito
  TASK_ADD_BOMBER_JACKET: 7,    // add_bomber_jacket - Añadir "Chaqueta bomber" a favoritos y carrito
  TASK_CHECK_FAVORITES: 8,      // check_favorites - Consultar lista de favoritos
  TASK_DELETE_ITEM: 9,          // delete_item - Eliminar "Abrigo verde" del carrito
  TASK_MAKE_PURCHASE: 10,       // make_purchase - Comprar carrito y rellenar información de envío
  TASK_DOUBLE_BUTTON: 11,       // double_button - Pulsar dos veces el botón para continuar
  
  // === FASE FINAL ===
  QUESTIONNAIRE: 12             // questionnaire - Cuestionario SUS final (sus.js)
};

/**
 * Mapeo de tareas a Scene IDs
 * Útil para obtener el Scene ID basado en el storageKey de la tarea
 */
export const TASK_TO_SCENE = {
  'task_tutorial_completed': SCENES.TASK_ACCEPT_TUTORIAL,
  'task_pink_summer_dress_completed': SCENES.TASK_ADD_PINK_DRESSES,
  'task_offer_green_coat_completed': SCENES.TASK_OFFER_GREEN_COAT,
  'task_green_coat_completed': SCENES.TASK_ADD_GREEN_COAT,
  'task_bomber_jacket_completed': SCENES.TASK_ADD_BOMBER_JACKET,
  'task_favorites_checked': SCENES.TASK_CHECK_FAVORITES,
  'task_delete_item_completed': SCENES.TASK_DELETE_ITEM,
  'task_purchase_completed': SCENES.TASK_MAKE_PURCHASE,
  'task_end_completed': SCENES.TASK_DOUBLE_BUTTON
};

/**
 * Obtiene el Scene ID de la tarea actual
 * @returns {number} Scene ID de la tarea actual o QUESTIONNAIRE si todas están completadas
 */
export const getCurrentSceneId = () => {
  const tasks = [
    { storageKey: 'task_tutorial_completed', sceneId: SCENES.TASK_ACCEPT_TUTORIAL },
    { storageKey: 'task_pink_summer_dress_completed', sceneId: SCENES.TASK_ADD_PINK_DRESSES },
    { storageKey: 'task_offer_green_coat_completed', sceneId: SCENES.TASK_OFFER_GREEN_COAT },
    { storageKey: 'task_green_coat_completed', sceneId: SCENES.TASK_ADD_GREEN_COAT },
    { storageKey: 'task_bomber_jacket_completed', sceneId: SCENES.TASK_ADD_BOMBER_JACKET },
    { storageKey: 'task_favorites_checked', sceneId: SCENES.TASK_CHECK_FAVORITES },
    { storageKey: 'task_delete_item_completed', sceneId: SCENES.TASK_DELETE_ITEM },
    { storageKey: 'task_purchase_completed', sceneId: SCENES.TASK_MAKE_PURCHASE },
    { storageKey: 'task_end_completed', sceneId: SCENES.TASK_DOUBLE_BUTTON }
  ];

  // Buscar la primera tarea no completada
	const currentTask = tasks.find(task =>
	  typeof window !== "undefined" && localStorage.getItem(task.storageKey) !== 'true'
	);

  return currentTask ? currentTask.sceneId : SCENES.QUESTIONNAIRE;
};

/**
 * Mapeo de nombres de escenas (para debugging y logs)
 */
export const SCENE_NAMES = {
  [SCENES.WELCOME]: 'Welcome',
  [SCENES.INITIAL_FORM]: 'Initial Form',
  [SCENES.LOGIN]: 'Login',
  [SCENES.TASK_ACCEPT_TUTORIAL]: 'Accept Tutorial',
  [SCENES.TASK_ADD_PINK_DRESSES]: 'Add Pink Dresses',
  [SCENES.TASK_OFFER_GREEN_COAT]: 'Offer Green Coat',
  [SCENES.TASK_ADD_GREEN_COAT]: 'Add Green Coat',
  [SCENES.TASK_ADD_BOMBER_JACKET]: 'Add Bomber Jacket',
  [SCENES.TASK_CHECK_FAVORITES]: 'Check Favorites',
  [SCENES.TASK_DELETE_ITEM]: 'Delete Item',
  [SCENES.TASK_MAKE_PURCHASE]: 'Make Purchase',
  [SCENES.TASK_DOUBLE_BUTTON]: 'Double Button',
  [SCENES.QUESTIONNAIRE]: 'Questionnaire'
};
