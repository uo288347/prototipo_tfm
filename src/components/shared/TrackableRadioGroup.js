import { Radio } from "antd";
import { useEffect, useRef } from "react";
import { getCurrentSceneId } from "@/metrics/scriptTest";
import { COMPONENT_RADIO_BUTTON, registerComponent } from "../../metrics/scriptTest";

/**
 * Componente Radio.Group con tracking automático para métricas.
 * Registra cada RadioButton individualmente.
 * 
 * @param {string} id - ID base para el grupo (los botones serán id-value)
 * @param {boolean} enableTracking - Habilitar auto-registro (default: true)
 * @param {Array} options - Array de opciones con value y label
 * @param {...any} props - Resto de props de Ant Design Radio.Group
 */
export const TrackableRadioGroup = ({
  id,
  enableTracking = true,
  children,
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
        console.warn(`[TrackableRadioGroup] No active scene for component: ${id}`);
        return;
      }

      // Registrar cada radio button
      const radioButtons = container.querySelectorAll('.ant-radio-button-wrapper, .ant-radio-wrapper');
      radioButtons.forEach((el, index) => {
        const input = el.querySelector('input');
        const value = input?.value || index;
        const radioId = `${id}-${value}`;
        
        el.id = radioId;
        el.setAttribute('data-trackable-id', radioId);
        
        const rect = el.getBoundingClientRect();
        registerComponent(
          sceneId,
          radioId,
          rect.left + window.scrollX,
          rect.top + window.scrollY,
          rect.right + window.scrollX,
          rect.bottom + window.scrollY,
          COMPONENT_RADIO_BUTTON,
          id
        );

        //console.log(`[TrackableRadioGroup] Registered RADIO -> ${radioId} at (${rect.left},${rect.top})`);
      });
    }, 300);

    return () => clearTimeout(timer);
  }, [id, enableTracking]);

  return (
    <div ref={containerRef} data-trackable-id={id}>
      <Radio.Group {...props} size="large">
        {children}
        
      </Radio.Group>
    </div>
  );
};

export default TrackableRadioGroup;
