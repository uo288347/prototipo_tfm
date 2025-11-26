import { NoticeBar } from "antd-mobile";
import React, { forwardRef, useState, useEffect } from 'react';
import confetti from 'canvas-confetti';

// Utilidad para gestionar las tareas
export const UtilsTasks = {
  tasks: [
    { id: 'accept_tutorial', text: 'Read instructions and finish the tutorial', storageKey: 'task_tutorial_completed' },
    { id: 'add_green_coat', text: 'Add pink summer dress to shopping cart', storageKey: 'task_pink_summer_dress_completed' },
    { id: 'add_blue_shoes', text: 'Apply offer to green coat', storageKey: 'task_offer_green_coat_completed' },
    { id: 'add_green_coat', text: 'Add green coat to shopping cart', storageKey: 'task_green_coat_completed' },
    { id: 'complete_profile', text: 'Add blue shoes to wishlist', storageKey: 'task_blue_shoes_completed' },
    { id: 'check_favorites', text: 'Check favorites list', storageKey: 'task_favorites_checked' },
    { id: 'make_purchase', text: 'Delete green coat from shopping cart', storageKey: 'task_purchase_completed' },
    { id: 'make_purchase', text: 'Buy shopping cart', storageKey: 'task_purchase_completed' },
    { id: 'make_purchase', text: 'Double tap the final button', storageKey: 'task_purchase_completed' }
  ],

  // Obtener la tarea actual (primera no completada)
  getCurrentTask() {
    return this.tasks.find(task => !this.isTaskCompleted(task.storageKey));
  },

  // Verificar si una tarea está completada
  isTaskCompleted(storageKey) {
    return localStorage.getItem(storageKey) === 'true';
  },

  // Marcar tarea como completada
  completeTask(storageKey) {
    localStorage.setItem(storageKey, 'true');
    window.dispatchEvent(new Event('taskCompleted'));
  },

  // Resetear todas las tareas
  resetAllTasks() {
    this.tasks.forEach(task => localStorage.removeItem(task.storageKey));
    window.dispatchEvent(new Event('taskCompleted'));
  }
};

export const task1 = (id) => {
  if(id=="mw1" && !UtilsTasks.isTaskCompleted("task_green_coat_completed")){
    UtilsTasks.completeTask("task_green_coat_completed");
  } 
}