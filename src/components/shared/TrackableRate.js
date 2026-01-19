import React, { useEffect, useRef } from "react";
import { Rate } from "antd";
import { registerComponent, COMPONENT_RATE } from "../../metrics/script_v2";
import { getCurrentSceneId } from "../../metrics/constants/scenes";

/**
 * Componente Rate con tracking automático para métricas.
 * Registra cada estrella individualmente para tracking preciso.
 * 
 * @param {string} id - ID base para el componente
 * @param {boolean} enableTracking - Habilitar auto-registro (default: true)
 * @param {...any} props - Resto de props de Ant Design Rate
 */
export const TrackableRate = ({
  id,
  enableTracking = true,
  ...props
}) => {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!enableTracking || !id) return;

    const timer = setTimeout(() => {
      const container = containerRef.current;
      if (!container) return;

      const sceneId = getCurrentSceneId();
      if (sceneId === null) {
        console.warn(`[TrackableRate] No active scene for component: ${id}`);
        return;
      }

      // Registrar el componente Rate completo
      const rateElement = container.querySelector('.ant-rate');
      if (rateElement) {
        const rect = rateElement.getBoundingClientRect();
        registerComponent(
          sceneId,
          id,
          rect.left + window.scrollX,
          rect.top + window.scrollY,
          rect.right + window.scrollX,
          rect.bottom + window.scrollY,
          COMPONENT_RATE,
          null
        );
        rateElement.setAttribute('data-trackable-id', id);
        //console.log(`[TrackableRate] Registered ${id} at (${rect.left},${rect.top})`);
      }

      // Registrar cada estrella individualmente
      const stars = container.querySelectorAll('.ant-rate-star');
      stars.forEach((star, index) => {
        const starId = `${id}-star-${index + 1}`;
        star.setAttribute('data-trackable-id', starId);
        
        const rect = star.getBoundingClientRect();
        registerComponent(
          sceneId,
          starId,
          rect.left + window.scrollX,
          rect.top + window.scrollY,
          rect.right + window.scrollX,
          rect.bottom + window.scrollY,
          COMPONENT_RATE,
          id
        );
        //console.log(`[TrackableRate] Registered STAR -> ${starId}`);
      });
    }, 300);

    return () => clearTimeout(timer);
  }, [id, enableTracking]);

  return (
    <div ref={containerRef} data-trackable-id={id}>
      <Rate {...props} />
    </div>
  );
};

export default TrackableRate;
