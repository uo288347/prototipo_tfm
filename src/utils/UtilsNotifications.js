// utils/UtilsNotifications.js
import { notification } from 'antd';

let apiHolder;

// Inicializar la notificación con Ant Design
export const initNotification = (api) => {
  apiHolder = api;
};

// Función para mostrar notificación
export const openNotification = (placement, text, type) => {
  if (!apiHolder) {
    console.warn('Notification API no inicializada');
    return;
  }


  apiHolder[type]({
    message: text,
    placement: placement,
    duration: 1.5,
  });
};
