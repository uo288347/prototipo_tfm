import React, { useEffect, useRef } from "react";
import { Form, Input, Typography } from "antd";
import { modifyStateProperty } from "../../utils/UtilsState";
import { registerComponent, COMPONENT_TEXT_FIELD } from "../../metrics/script_v2";
import { getCurrentSceneId } from "../../metrics/constants/scenes";

/**
 * Componente de Input de formulario reutilizable con validación
 * Se auto-registra en el sistema de métricas cuando se monta
 * 
 * @param {string} id - ID del componente (usado para métricas)
 * @param {string} name - Nombre del campo (key en formData y formErrors)
 * @param {string} placeholder - Placeholder del input
 * @param {object} formData - Estado del formulario
 * @param {function} setFormData - Setter del estado del formulario
 * @param {object} formErrors - Errores del formulario
 * @param {function} setFormErrors - Setter de errores
 * @param {function} validateFunc - Función de validación que devuelve true/false
 * @param {array} validateParams - Parámetros adicionales para la función de validación (ej: mensajes de error traducidos)
 * @param {boolean} enableTracking - Habilitar auto-registro para métricas (default: true)
 */
export const TextInputField = ({
  id,
  name,
  icon, 
  placeholder,
  formData,
  setFormData,
  formErrors,
  setFormErrors,
  validateFunc,
  validateParams = [],
  enableTracking = true
}) => {
  const inputRef = useRef(null);

  // Auto-registro del componente para métricas
  useEffect(() => {
    if (!enableTracking || !id) return;

    const timer = setTimeout(() => {
      const element = document.getElementById(id);
      if (!element) {
        console.warn(`[TextInputField] Element not found: ${id}`);
        return;
      }

      const sceneId = getCurrentSceneId();
      if (sceneId === null) {
        console.warn(`[TextInputField] No active scene for component: ${id}`);
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
        COMPONENT_TEXT_FIELD,
        null
      );

      //console.log(`[TextInputField] Registered ${id} at (${rect.left},${rect.top}) in scene ${sceneId}`);
    }, 300);

    return () => clearTimeout(timer);
  }, [id, enableTracking]);

  const handleChange = (i) => {
    const value = i.currentTarget.value;
    modifyStateProperty(formData, setFormData, name, value);
  };

  const isValid = validateFunc ? validateFunc(formData, name, formErrors, setFormErrors, ...validateParams) : true;

  return (
    <>
      {formErrors?.[name]?.msg && (
        <Typography.Text type="danger">{formErrors[name].msg}</Typography.Text>
      )}
      <Form.Item
        label=""
        key={`${name}-input`}
        name={name}
        validateStatus={isValid ? "success" : "error"}
      >
        <div data-trackable-id={id}>
          <Input 
            ref={inputRef} 
            id={id} 
            data-trackable-id={id}
            prefix={icon} 
            placeholder={placeholder} 
            value={formData[name]} 
            onChange={handleChange} 
          />
        </div>
      </Form.Item>
    </>
  );
};


