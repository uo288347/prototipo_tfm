import tasksEn from '../../messages/tasks_en.json';
import tasksEs from '../../messages/tasks_es.json';
import { getCurrentSceneId, TASK_TO_SCENE } from '../metrics/constants/scenes';
import { finishSubsceneTracking, initTracking } from '../metrics/scriptTest';
import { isInCart } from "./UtilsCart";
import { getFavorite } from "./UtilsFavorites";

const tasksTranslations = {
  en: tasksEn,
  es: tasksEs
};

export const getTaskText = (taskId, locale = 'es') => {
  const translations = tasksTranslations[locale] || tasksTranslations['es'];
  return translations[taskId] || taskId;
};

// Utilidad para gestionar las tareas
export const UtilsTasks = {
  tasks: [
    { id: 'accept_tutorial', storageKey: 'task_tutorial_completed' },
    { id: 'add_pink_dresses', storageKey: 'task_pink_summer_dress_completed' },
    { id: 'offer_green_coat', storageKey: 'task_offer_green_coat_completed' },
    { id: 'add_green_coat', storageKey: 'task_green_coat_completed' },
    { id: 'add_bomber_jacket', storageKey: 'task_bomber_jacket_completed' },
    { id: 'check_favorites', storageKey: 'task_favorites_checked' },
    { id: 'delete_item', storageKey: 'task_delete_item_completed' },
    { id: 'make_purchase', storageKey: 'task_purchase_completed' },
    { id: 'double_button', storageKey: 'task_end_completed' },
    { id: 'questionnaire', storageKey: 'task_questionnaire_completed' }
  ],

  // Obtener la tarea actual (primera no completada)
  getCurrentTask() {
    return this.tasks.find(task => !this.isTaskCompleted(task.storageKey));
  },

  // Verificar si una tarea está completada
  isTaskCompleted(storageKey) {
    if (typeof window === "undefined") return false;
    return localStorage.getItem(storageKey) === 'true';
  },

  // Marcar tarea como completada y enviar a la BD
  async completeTask(storageKey) {
    if (typeof window === "undefined") return;

    // 1. Marcar como completada y notificar PRIMERO (confetti, sonido, UI)
    localStorage.setItem(storageKey, 'true');
    window.dispatchEvent(new Event('taskCompleted'));

    // 2. Dar tiempo al navegador para renderizar (confetti, animaciones)
    //    antes de ejecutar operaciones pesadas de tracking
    await new Promise(resolve => setTimeout(resolve, 100));

    // 3. Ahora sí, finalizar tracking de la escena actual (incluye html2canvas)
    const currentSceneId = TASK_TO_SCENE[storageKey];
    if (currentSceneId !== undefined) {
      finishSubsceneTracking();
      console.log(`[utilsTasks] Tarea completada: ${storageKey}, Scene ID: ${currentSceneId}`);
    }

    // 4. Iniciar tracking de la siguiente tarea
    const nextSceneId = getCurrentSceneId();
    console.log(`[utilsTasks] Siguiente tarea: ${nextSceneId === SCENES.QUESTIONNAIRE ? 'Cuestionario final' : nextSceneId}, Scene ID: ${nextSceneId}`);
    if (nextSceneId !== undefined) {
      initTracking(nextSceneId);
      console.log(`[utilsTasks] Iniciando tracking de la siguiente tarea, Scene ID: ${nextSceneId}`);
    }
  },

  // Resetear todas las tareas
  resetAllTasks() {
    if (typeof window === "undefined") return;
    this.tasks.forEach(task => localStorage.removeItem(task.storageKey));
    window.dispatchEvent(new Event('taskCompleted'));
  }
};

export const task1 = () => {
  if (UtilsTasks.getCurrentTask().storageKey != "task_tutorial_completed") return;
  if (!UtilsTasks.isTaskCompleted("task_tutorial_completed")) {
    UtilsTasks.completeTask("task_tutorial_completed");
  }
}

export const task2 = (id, size, units) => {
  if (UtilsTasks.getCurrentTask().storageKey != "task_pink_summer_dress_completed") return;
  if (id == "mw2" && size == "M" && units >= 2 && !UtilsTasks.isTaskCompleted("task_pink_summer_dress_completed")) {
    UtilsTasks.completeTask("task_pink_summer_dress_completed");
  }
}

export const task3 = (id, price) => {
  if (UtilsTasks.getCurrentTask().storageKey != "task_offer_green_coat_completed") return;
  if (id == "mw1" && price == 0 && !UtilsTasks.isTaskCompleted("task_offer_green_coat_completed")) {
    UtilsTasks.completeTask("task_offer_green_coat_completed");
  }
}

export const task4 = (id, price) => {
  if (UtilsTasks.getCurrentTask().storageKey != "task_green_coat_completed") return;
  if (id == "mw1" && price == 0 && !UtilsTasks.isTaskCompleted("task_green_coat_completed")) {
    UtilsTasks.completeTask("task_green_coat_completed");
  }
}

export const task5 = (id) => {
  if (UtilsTasks.getCurrentTask().storageKey != "task_bomber_jacket_completed") return;
  if (id == "mh1" && getFavorite(id) && isInCart(id)
    && !UtilsTasks.isTaskCompleted("task_bomber_jacket_completed")) {
    UtilsTasks.completeTask("task_bomber_jacket_completed");
  }
}

export const task6 = () => {
  if (UtilsTasks.getCurrentTask().storageKey != "task_favorites_checked") return;
  if (!UtilsTasks.isTaskCompleted("task_favorites_checked")) {
    UtilsTasks.completeTask("task_favorites_checked");
  }
}

export const task7 = (id) => {
  if (UtilsTasks.getCurrentTask().storageKey != "task_delete_item_completed") return;
  if (id == "mw1" && !UtilsTasks.isTaskCompleted("task_delete_item_completed")) {
    UtilsTasks.completeTask("task_delete_item_completed");
  }
}

export const task8 = () => {
  if (UtilsTasks.getCurrentTask().storageKey != "task_purchase_completed") return;
  if (!UtilsTasks.isTaskCompleted("task_purchase_completed")) {
    UtilsTasks.completeTask("task_purchase_completed");
  }
}

export const task9 = () => {
  if (UtilsTasks.getCurrentTask().storageKey != "task_end_completed") return;
  if (!UtilsTasks.isTaskCompleted("task_end_completed")) {
    UtilsTasks.completeTask("task_end_completed");
  }
}

export const task10 = () => {
  if (UtilsTasks.getCurrentTask().storageKey != "task_questionnaire_completed") return;
  if (!UtilsTasks.isTaskCompleted("task_questionnaire_completed")) {
    UtilsTasks.completeTask("task_questionnaire_completed");
  }
}