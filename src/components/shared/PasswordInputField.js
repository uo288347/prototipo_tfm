import { Form, Input, Typography } from "antd";
import { useEffect, useRef } from "react";
import { getCurrentSceneId } from "../../metrics/constants/scenes";
import { COMPONENT_TEXT_FIELD, registerComponent } from "../../metrics/scriptTest";
import { modifyStateProperty } from "../../utils/UtilsState";

/**
 * Componente de Input de contraseña reutilizable con validación
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
 * @param {array} validateParams - Parámetros adicionales para la función de validación
 * @param {boolean} enableTracking - Habilitar auto-registro para métricas (default: true)
 */
export const PasswordInputField = ({
  id,
  name,
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
  const componentId = id || `input-${name}`;

  // Auto-registro del componente para métricas
  useEffect(() => {
    if (!enableTracking) return;

    const timer = setTimeout(() => {
      const element = document.getElementById(componentId);
      if (!element) {
        console.warn(`[PasswordInputField] Element not found: ${componentId}`);
        return;
      }

      const sceneId = getCurrentSceneId();
      if (sceneId === null) {
        console.warn(`[PasswordInputField] No active scene for component: ${componentId}`);
        return;
      }

      const rect = element.getBoundingClientRect();
      registerComponent(
        sceneId,
        componentId,
        rect.left + window.scrollX,
        rect.top + window.scrollY,
        rect.right + window.scrollX,
        rect.bottom + window.scrollY,
        COMPONENT_TEXT_FIELD,
        null
      );

      element.setAttribute('data-trackable-id', componentId);
    }, 300);

    return () => clearTimeout(timer);
  }, [componentId, enableTracking]);

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
        <div data-trackable-id={componentId}>
          <Input.Password 
            ref={inputRef}
            id={componentId} 
            placeholder={placeholder} 
            value={formData[name]} 
            onChange={handleChange}
            data-trackable-id={componentId}
          />
        </div>
      </Form.Item>
    </>
  );
};

