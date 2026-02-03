import { Button } from "antd";
import React, { useEffect, useRef } from "react";
import { getCurrentSceneId } from "../../metrics/constants/scenes";
import { COMPONENT_BUTTON, registerComponent } from "../../metrics/scriptTest";

/**
 * Componente Button con tracking automático para métricas.
 * Se auto-registra cuando se monta.
 * 
 * @param {string} id - ID único del componente (requerido para métricas)
 * @param {boolean} enableTracking - Habilitar auto-registro (default: true)
 * @param {React.ReactNode} children - Contenido del botón
 * @param {...any} props - Resto de props de Ant Design Button
 */
export const TrackableButton = ({
  id,
  enableTracking = true,
  children,
  ...props
}) => {
  const buttonRef = useRef(null);

  useEffect(() => {
    if (!enableTracking || !id) return;

    const timer = setTimeout(() => {
      const element = document.getElementById(id);
      if (!element) {
        console.warn(`[TrackableButton] Element not found: ${id}`);
        return;
      }

      const sceneId = getCurrentSceneId();
      if (sceneId === null) {
        console.warn(`[TrackableButton] No active scene for component: ${id}`);
        return;
      }

      const rect = element.getBoundingClientRect();
      registerComponent(
        sceneId,
        id,
        rect.left + window.scrollX,
        rect.top + window.scrollY,
        rect.right + window.scrollX,
        rect.bottom + window.scrollY,
        COMPONENT_BUTTON,
        null
      );

      // Añadir atributo para detección mejorada
      element.setAttribute('data-trackable-id', id);
    }, 300);

    return () => clearTimeout(timer);
  }, [id, enableTracking]);

  return (
    <Button
      id={id}
      ref={buttonRef}
      data-trackable-id={id}
      {...props}
    >
      {children}
    </Button>
  );
};

export default TrackableButton;
