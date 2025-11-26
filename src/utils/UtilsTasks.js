import { NoticeBar } from "antd-mobile";
import React, { forwardRef, useState, useEffect } from 'react';
import confetti from 'canvas-confetti';

// Utilidad para gestionar las tareas
export const UtilsTasks = {
  tasks: [
    { id: 'add_green_coat', text: 'Add green coat to shopping cart', storageKey: 'task_green_coat_completed' },
    { id: 'add_blue_shoes', text: 'Add blue shoes to wishlist', storageKey: 'task_blue_shoes_completed' },
    { id: 'complete_profile', text: 'Complete your profile information', storageKey: 'task_profile_completed' },
    { id: 'make_purchase', text: 'Make your first purchase', storageKey: 'task_purchase_completed' }
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