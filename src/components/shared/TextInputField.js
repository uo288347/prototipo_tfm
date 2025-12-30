import React from "react";
import { Form, Input, Typography } from "antd";
import {modifyStateProperty} from "../../utils/UtilsState";

/**
 * Componente de Input de formulario reutilizable con validación
 * @param {string} name - Nombre del campo (key en formData y formErrors)
 * @param {string} placeholder - Placeholder del input
 * @param {object} formData - Estado del formulario
 * @param {function} setFormData - Setter del estado del formulario
 * @param {object} formErrors - Errores del formulario
 * @param {function} setFormErrors - Setter de errores
 * @param {function} validateFunc - Función de validación que devuelve true/false
 * @param {array} validateParams - Parámetros adicionales para la función de validación (ej: mensajes de error traducidos)
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
  validateParams = []
}) => {
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
        <Input id={id} prefix={icon} placeholder={placeholder} value={formData[name]} onChange={handleChange} />
      </Form.Item>
    </>
  );
};

