// utils/UtilsNotifications.js

let apiHolder;

// Inicializar la notificación con Ant Design
export const initNotification = (api) => {
  apiHolder = api;
};

// Función para mostrar notificación
export const openNotification = (placement, text, type, description) => {
  if (!apiHolder) {
    console.warn('Notification API no inicializada');
    return;
  }

  apiHolder[type]({
    message: text,
    description: description,
    placement: placement,
    duration: 1.5,
  });
};
