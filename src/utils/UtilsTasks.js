import { NoticeBar } from "antd-mobile";
import React, { forwardRef, useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { getFavorite } from "./UtilsFavorites";
import { isInCart } from "./UtilsCart";

// Utilidad para gestionar las tareas
export const UtilsTasks = {
  tasks: [
    { id: 'accept_tutorial', text: 'Read instructions and finish the tutorial', storageKey: 'task_tutorial_completed' },
    { id: 'add_pink_dresses', text: 'Add two pink summer dresses (size M) to shopping cart', storageKey: 'task_pink_summer_dress_completed' },
    { id: 'offer_green_coat', text: 'Search and apply free code to the green coat', storageKey: 'task_offer_green_coat_completed' },
    { id: 'add_green_coat', text: 'Add green coat to shopping cart', storageKey: 'task_green_coat_completed'},
    { id: 'add_bomber_jacket', text: 'Add bomber jacket to favorites and shopping cart', storageKey: 'task_bomber_jacket_completed' },
    { id: 'check_favorites', text: 'Check favorites list', storageKey: 'task_favorites_checked' },
    { id: 'delete_item', text: 'Delete green coat from shopping cart', storageKey: 'task_delete_item_completed' },
    { id: 'make_purchase', text: 'Buy shopping cart and fill in the shipping information', storageKey: 'task_purchase_completed' },
    { id: 'end', text: 'Double tap the final button', storageKey: 'task_end_completed' }
  ],

  /*tasks: [
    { id: 'accept_tutorial', text: 'Read instructions and finish the tutorial', storageKey: 'task_tutorial_completed' },
    { id: 'add_pink_dresses', text: 'Add two pink summer dresses (size M) to shopping cart', storageKey: 'task_pink_summer_dress_completed' },
    { id: 'offer_green_coat', text: 'Search and apply free code to the green coat. Add the green coat to shopping cart', storageKey: 'task_offer_green_coat_completed' },
    { id: 'add_bomber_jacket', text: 'Add bomber jacket to favorites and shopping cart', storageKey: 'task_bomber_jacket_completed' },
    { id: 'check_favorites', text: 'Check favorites list', storageKey: 'task_favorites_checked' },
    { id: 'delete_item', text: 'Delete green coat from shopping cart', storageKey: 'task_delete_item_completed' },
    { id: 'make_purchase', text: 'Buy shopping cart and fill in the shipping information', storageKey: 'task_purchase_completed' },
    { id: 'end', text: 'Double tap the final button', storageKey: 'task_end_completed' }
  ],*/

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

export const task1 = () => {
  if(UtilsTasks.getCurrentTask().storageKey!="task_tutorial_completed") return;
  console.log("task1 called");
  if(!UtilsTasks.isTaskCompleted("task_tutorial_completed")) {
    UtilsTasks.completeTask("task_tutorial_completed");
  }
}

export const task2 = (id, size, units) => {
  if(UtilsTasks.getCurrentTask().storageKey!="task_pink_summer_dress_completed") return;
  if(id=="mw2" && size=="M" && units>=2 && !UtilsTasks.isTaskCompleted("task_pink_summer_dress_completed")){
    UtilsTasks.completeTask("task_pink_summer_dress_completed");
  } 
}

export const task3 = (id, price) => {
  if(UtilsTasks.getCurrentTask().storageKey!="task_offer_green_coat_completed") return;
  if(id=="mw1" && price==0 && !UtilsTasks.isTaskCompleted("task_offer_green_coat_completed")){
    UtilsTasks.completeTask("task_offer_green_coat_completed");
  }
}

export const task4 = (id, price) => {
  if(UtilsTasks.getCurrentTask().storageKey!="task_green_coat_completed") return;
  if(id=="mw1" && price==0 && !UtilsTasks.isTaskCompleted("task_green_coat_completed")){
    UtilsTasks.completeTask("task_green_coat_completed");
  } 
}

export const task5 = (id) => {
  if(UtilsTasks.getCurrentTask().storageKey!="task_bomber_jacket_completed") return;
  if(id=="mh1" && getFavorite(id) && isInCart(id) 
    && !UtilsTasks.isTaskCompleted("task_bomber_jacket_completed")){
    UtilsTasks.completeTask("task_bomber_jacket_completed");
  } 
}

export const task6 = () => {
  if(UtilsTasks.getCurrentTask().storageKey!="task_favorites_checked") return;
  if(!UtilsTasks.isTaskCompleted("task_favorites_checked")) {
    UtilsTasks.completeTask("task_favorites_checked");
  }
}

export const task7 = (id) => {
  if(UtilsTasks.getCurrentTask().storageKey!="task_delete_item_completed") return;
  if(id=="mw1" && !UtilsTasks.isTaskCompleted("task_delete_item_completed")){
    UtilsTasks.completeTask("task_delete_item_completed");
  } 
}

export const task8 = () => {
  if(UtilsTasks.getCurrentTask().storageKey!="task_purchase_completed") return;
  if(!UtilsTasks.isTaskCompleted("task_purchase_completed")) {
    UtilsTasks.completeTask("task_purchase_completed");
  }
}

export const task9 = () => {
  if(UtilsTasks.getCurrentTask().storageKey!="task_end_completed") return;
  if(!UtilsTasks.isTaskCompleted("task_end_completed")) {
    UtilsTasks.completeTask("task_end_completed");
  }
}