import { useEffect, useRef, useCallback } from "react";
import { registerComponent } from "./script_v2";
import { getCurrentSceneId } from "./constants/scenes";

/**
 * Hook para registrar automáticamente un componente en el sistema de métricas.
 * 
 * @param {string} componentId - ID único del componente
 * @param {number} componentType - Tipo de componente (COMPONENT_TEXT_FIELD, COMPONENT_COMBOBOX, etc.)
 * @param {string|null} parentId - ID del componente padre (opcional, para opciones de select)
 * @param {number} delay - Delay antes de registrar (ms), útil para componentes que tardan en renderizar
 * @returns {Object} - { ref, registerManually }
 */
export function useComponentRegistry(componentId, componentType, parentId = null, delay = 100) {
  const ref = useRef(null);
  const registeredRef = useRef(false);

  const registerElement = useCallback((element) => {
    if (!element || registeredRef.current) return;

    const sceneId = getCurrentSceneId();
    if (sceneId === null) {
      console.warn(`[useComponentRegistry] No active scene for component: ${componentId}`);
      return;
    }

    const rect = element.getBoundingClientRect();
    const x = rect.left + window.scrollX;
    const y = rect.top + window.scrollY;
    const xF = rect.right + window.scrollX;
    const yF = rect.bottom + window.scrollY;

    registerComponent(
      sceneId,
      componentId,
      x,
      y,
      xF,
      yF,
      componentType,
      parentId
    );

    registeredRef.current = true;
    console.log(`[useComponentRegistry] Registered ${componentType} -> ${componentId} at (${x},${y}) in scene ${sceneId}`);
  }, [componentId, componentType, parentId]);

  // Función para registrar manualmente (útil para elementos dinámicos)
  const registerManually = useCallback((element) => {
    registeredRef.current = false; // Reset para permitir re-registro
    registerElement(element);
  }, [registerElement]);

  useEffect(() => {
    if (!ref.current) return;

    const timer = setTimeout(() => {
      registerElement(ref.current);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [registerElement, delay]);

  // Reset cuando cambia el componentId (por si se reutiliza)
  useEffect(() => {
    registeredRef.current = false;
  }, [componentId]);

  return { ref, registerManually };
}

/**
 * Hook simplificado para registrar un elemento por su ID en el DOM
 * Útil cuando no puedes pasar un ref directamente
 * 
 * @param {string} elementId - ID del elemento en el DOM
 * @param {string} componentId - ID para el registro (puede ser diferente del elementId)
 * @param {number} componentType - Tipo de componente
 * @param {string|null} parentId - ID del componente padre
 * @param {number} delay - Delay antes de registrar
 */
export function useComponentRegistryById(elementId, componentId, componentType, parentId = null, delay = 300) {
  const registeredRef = useRef(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (registeredRef.current) return;

      const element = document.getElementById(elementId);
      if (!element) {
        console.warn(`[useComponentRegistryById] Element not found: ${elementId}`);
        return;
      }

      const sceneId = getCurrentSceneId();
      if (sceneId === null) {
        console.warn(`[useComponentRegistryById] No active scene for component: ${componentId}`);
        return;
      }

      const rect = element.getBoundingClientRect();
      const x = rect.left + window.scrollX;
      const y = rect.top + window.scrollY;
      const xF = rect.right + window.scrollX;
      const yF = rect.bottom + window.scrollY;

      registerComponent(
        sceneId,
        componentId,
        x,
        y,
        xF,
        yF,
        componentType,
        parentId
      );

      registeredRef.current = true;
      console.log(`[useComponentRegistryById] Registered ${componentType} -> ${componentId} at (${x},${y}) in scene ${sceneId}`);
    }, delay);

    return () => clearTimeout(timer);
  }, [elementId, componentId, componentType, parentId, delay]);

  // Reset cuando cambia el elementId
  useEffect(() => {
    registeredRef.current = false;
  }, [elementId]);
}

export default useComponentRegistry;
