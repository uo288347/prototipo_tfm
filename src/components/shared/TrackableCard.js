import React, { useEffect, useRef } from "react";
import { Card } from "antd";
import { registerComponent, COMPONENT_CARD } from "../../metrics/scriptTest";
import { getCurrentSceneId } from "../../metrics/constants/scenes";

/**
 * Componente Card con tracking automático para métricas.
 * Útil para ProductCards, FavoriteCards, etc.
 * 
 * @param {string} trackingId - ID único para tracking (requerido para métricas)
 * @param {boolean} enableTracking - Habilitar auto-registro (default: true)
 * @param {React.ReactNode} children - Contenido del card
 * @param {...any} props - Resto de props de Ant Design Card
 */
export const TrackableCard = ({
  trackingId,
  enableTracking = true,
  children,
  ...props
}) => {
  const cardRef = useRef(null);

  useEffect(() => {
    if (!enableTracking || !trackingId) return;

    const timer = setTimeout(() => {
      const element = cardRef.current;
      if (!element) {
        console.warn(`[TrackableCard] Element ref not found for: ${trackingId}`);
        return;
      }

      const sceneId = getCurrentSceneId();
      if (sceneId === null) {
        console.warn(`[TrackableCard] No active scene for component: ${trackingId}`);
        return;
      }

      const rect = element.getBoundingClientRect();
      registerComponent(
        sceneId,
        trackingId,
        rect.left + window.scrollX,
        rect.top + window.scrollY,
        rect.right + window.scrollX,
        rect.bottom + window.scrollY,
        COMPONENT_CARD,
        null
      );

      console.log(`[TrackableCard] Registered ${trackingId} at (${rect.left},${rect.top}) in scene ${sceneId}`);
    }, 300);

    return () => clearTimeout(timer);
  }, [trackingId, enableTracking]);

  return (
    <div ref={cardRef} data-trackable-id={trackingId}>
      <Card {...props}>
        {children}
      </Card>
    </div>
  );
};

export default TrackableCard;
