/**
 * Definición de Scene IDs para el tracking del experimento
 * Cada escena corresponde a una tarea específica del experimento
 */

export const SCENES = {
  // Inicio del experimento
  WELCOME: 0,  // Pantalla de bienvenida antes de empezar
  
  // Tarea 1: Aceptar tutorial
  TASK_TUTORIAL: 1,  // accept_tutorial - Leer instrucciones y completar tutorial
  
  // Tarea 2: Añadir vestidos rosas
  TASK_ADD_PINK_DRESSES: 2,  // add_pink_dresses - Añadir 2 unidades de "Pink Summer Dress" (M)
  
  // Tarea 3: Buscar y aplicar código gratuito al abrigo verde
  TASK_OFFER_GREEN_COAT: 3,  // offer_green_coat - Buscar y aplicar código gratuito a "Green Coat"
  
  // Tarea 4: Añadir abrigo verde al carrito
  TASK_ADD_GREEN_COAT: 4,  // add_green_coat - Añadir "Green Coat" al carrito
  
  // Tarea 5: Añadir bomber jacket a favoritos y carrito
  TASK_ADD_BOMBER_JACKET: 5,  // add_bomber_jacket - Añadir "Bomber Jacket" a favoritos y carrito
  
  // Tarea 6: Revisar lista de favoritos
  TASK_CHECK_FAVORITES: 6,  // check_favorites - Revisar lista de favoritos
  
  // Tarea 7: Eliminar producto del carrito
  TASK_DELETE_ITEM: 7,  // delete_item - Eliminar "Green Coat" del carrito
  
  // Tarea 8: Realizar compra
  TASK_MAKE_PURCHASE: 8,  // make_purchase - Comprar carrito y rellenar información de envío
  
  // Tarea 9: Finalizar experimento
  TASK_END: 9  // end - Doble toque en el botón final
};

/**
 * Mapeo de tareas a Scene IDs
 * Útil para obtener el Scene ID basado en el storageKey de la tarea
 */
export const TASK_TO_SCENE = {
  'task_tutorial_completed': SCENES.TASK_TUTORIAL,
  'task_pink_summer_dress_completed': SCENES.TASK_ADD_PINK_DRESSES,
  'task_offer_green_coat_completed': SCENES.TASK_OFFER_GREEN_COAT,
  'task_green_coat_completed': SCENES.TASK_ADD_GREEN_COAT,
  'task_bomber_jacket_completed': SCENES.TASK_ADD_BOMBER_JACKET,
  'task_favorites_checked': SCENES.TASK_CHECK_FAVORITES,
  'task_delete_item_completed': SCENES.TASK_DELETE_ITEM,
  'task_purchase_completed': SCENES.TASK_MAKE_PURCHASE,
  'task_end_completed': SCENES.TASK_END
};

/**
 * Obtiene el Scene ID de la tarea actual
 * @returns {number} Scene ID de la tarea actual o TASK_END si todas están completadas
 */
export const getCurrentSceneId = () => {
  const tasks = [
    { storageKey: 'task_tutorial_completed', sceneId: SCENES.TASK_TUTORIAL },
    { storageKey: 'task_pink_summer_dress_completed', sceneId: SCENES.TASK_ADD_PINK_DRESSES },
    { storageKey: 'task_offer_green_coat_completed', sceneId: SCENES.TASK_OFFER_GREEN_COAT },
    { storageKey: 'task_green_coat_completed', sceneId: SCENES.TASK_ADD_GREEN_COAT },
    { storageKey: 'task_bomber_jacket_completed', sceneId: SCENES.TASK_ADD_BOMBER_JACKET },
    { storageKey: 'task_favorites_checked', sceneId: SCENES.TASK_CHECK_FAVORITES },
    { storageKey: 'task_delete_item_completed', sceneId: SCENES.TASK_DELETE_ITEM },
    { storageKey: 'task_purchase_completed', sceneId: SCENES.TASK_MAKE_PURCHASE },
    { storageKey: 'task_end_completed', sceneId: SCENES.TASK_END }
  ];

  // Buscar la primera tarea no completada
  const currentTask = tasks.find(task => 
    localStorage.getItem(task.storageKey) !== 'true'
  );

  return currentTask ? currentTask.sceneId : SCENES.TASK_END;
};
