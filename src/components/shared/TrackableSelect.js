import { Select } from "antd";
import { useEffect, useRef } from "react";
import { getCurrentSceneId } from "@/metrics/scriptTest";
import { COMPONENT_COMBOBOX, COMPONENT_OPTION, EVENT_ON_POINTER_DOWN, registerComponent, trackWithEvent } from "../../metrics/scriptTest";

/**
 * Componente Select con tracking automático para métricas.
 * Se auto-registra como COMBOBOX y registra sus opciones cuando se abre.
 * 
 * IMPORTANTE: Para que el tracking funcione correctamente, el componente
 * propaga el ID a los elementos internos del Select de Ant Design.
 * 
 * @param {string} id - ID único del componente (requerido para métricas)
 * @param {boolean} enableTracking - Habilitar auto-registro (default: true)
 * @param {object} pointerEventProps - Props para eventos de pointer (onPointerDown, etc.)
 * @param {...any} props - Resto de props de Ant Design Select
 */
export const TrackableSelect = ({
  id,
  enableTracking = true,
  pointerEventProps = {},
  onDropdownVisibleChange,
  ...props
}) => {
  const containerRef = useRef(null);
  const registeredRef = useRef(false);

  // Auto-registro del Select como COMBOBOX
  useEffect(() => {
    if (!enableTracking || !id) return;

    const timer = setTimeout(() => {
      // Buscar el contenedor del Select
      const container = containerRef.current;
      if (!container) {
        console.warn(`[TrackableSelect] Container ref not found for: ${id}`);
        return;
      }

      const selectWrapper = container.querySelector('.ant-select');
      if (!selectWrapper) {
        console.warn(`[TrackableSelect] Select wrapper not found for: ${id}`);
        return;
      }

      const sceneId = getCurrentSceneId();
      if (sceneId === null) {
        console.warn(`[TrackableSelect] No active scene for component: ${id}`);
        return;
      }

      const rect = selectWrapper.getBoundingClientRect();
      registerComponent(
        sceneId,
        id,
        rect.left + window.scrollX,
        rect.top + window.scrollY,
        rect.right + window.scrollX,
        rect.bottom + window.scrollY,
        COMPONENT_COMBOBOX,
        null
      );

      // IMPORTANTE: Propagar el ID a los elementos internos del Select
      // para que detectElementByName pueda encontrarlos
      selectWrapper.setAttribute('data-trackable-id', id);
      const selector = selectWrapper.querySelector('.ant-select-selector');
      if (selector) {
        selector.id = id;
        selector.setAttribute('data-trackable-id', id);
      }

      registeredRef.current = true;
      //console.log(`[TrackableSelect] Registered COMBOBOX -> ${id} at (${rect.left},${rect.top}) in scene ${sceneId}`);
    }, 300);

    return () => clearTimeout(timer);
  }, [id, enableTracking]);

  // Función para registrar las opciones del dropdown cuando se abre
  const registerOptions = () => {
    if (!enableTracking || !id) return;

    // Pequeño delay para que el dropdown termine de renderizar
    setTimeout(() => {
      const sceneId = getCurrentSceneId();
      if (sceneId === null) return;

      const options = document.querySelectorAll('.ant-select-dropdown .ant-select-item');
      options.forEach((el, index) => {
        const rect = el.getBoundingClientRect();
        const optionId = `${id}-option-${index}`;
        
        // Propagar el ID a la opción
        el.id = optionId;
        el.setAttribute('data-trackable-id', optionId);
        
        registerComponent(
          sceneId,
          optionId,
          rect.left + window.scrollX,
          rect.top + window.scrollY,
          rect.right + window.scrollX,
          rect.bottom + window.scrollY,
          COMPONENT_OPTION,
          id
        );

       // console.log(`[TrackableSelect] Registered OPTION -> ${optionId} at (${rect.left},${rect.top})`);

        // Agregar listener para trackear el click en la opción
        el.addEventListener('pointerdown', (e) => {
          trackWithEvent(EVENT_ON_POINTER_DOWN, e);
        }, { once: true });
      });
    }, 50);
  };

  // Manejar apertura del dropdown
  const handleDropdownVisibleChange = (open) => {
    if (open && enableTracking) {
      registerOptions();
    }
    // Llamar al handler original si existe
    onDropdownVisibleChange?.(open);
  };

  return (
    <div ref={containerRef} data-trackable-id={id}>
      <Select
        id={id}
        onOpenChange={handleDropdownVisibleChange}
        {...pointerEventProps}
        {...props}
      />
    </div>
  );
};

export default TrackableSelect;
