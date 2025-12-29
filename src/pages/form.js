import { InitialFormComponent } from "@/components/InitialFormComponent";
import { LanguageSwitcher } from "@/components/shared/LanguageSwitcher";
import { useEffect } from "react";
import { finishSubsceneTracking, initTracking, finishTracking, finishExperiment } from "@/metrics/scriptTest";
import { SCENES, getCurrentSceneId } from "@/metrics/constants/scenes";

import { registerComponent } from "@/metrics/scriptTest";
import {
  COMPONENT_COMBOBOX,
  COMPONENT_OPTION,
  COMPONENT_RADIO_BUTTON,
  COMPONENT_CHECK_BOX,
  COMPONENT_TEXT_FIELD
} from "@/metrics/scriptTest";

export default function InitialForm() {
  useEffect(() => {
    initTracking(SCENES.INITIAL_FORM);
    console.log("Tracking iniciado para escena: INITIAL_FORM (1)");

    // Registrar gestos pointer en el formulario
    const formEl = document.getElementById('initial-form-root');
    if (formEl) {
      formEl.addEventListener('pointerdown', (e) => {
        // Puedes enviar a scriptTest si quieres registrar aquí
      });
      formEl.addEventListener('pointerup', (e) => {
        // Puedes enviar a scriptTest si quieres registrar aquí
      });
      formEl.addEventListener('pointermove', (e) => {
        // Puedes enviar a scriptTest si quieres registrar aquí
      });
    }

    // --- Registro automático de componentes del formulario ---
    // Esperar a que el DOM esté listo
    setTimeout(() => {
      // Seleccionar todos los elementos interactivos del formulario
      const selectors = formEl ? formEl.querySelectorAll('select') : [];
      const textfields = formEl ? formEl.querySelectorAll('input[type="text"], input[type="email"], input[type="number"], textarea') : [];

      // Helper para registrar un elemento
      const registerElem = (el, typeId) => {
        if (!el.id) return; // Solo si tiene id
        const rect = el.getBoundingClientRect();
        const x = rect.left + window.scrollX;
        const y = rect.top + window.scrollY;
        const xF = rect.right + window.scrollX;
        const yF = rect.bottom + window.scrollY;
        registerComponent(
          SCENES.INITIAL_FORM,
          el.id,
          x,
          y,
          xF,
          yF,
          typeId,
          null
        );
      };

      selectors.forEach(el => registerElem(el, COMPONENT_COMBOBOX));
      textfields.forEach(el => registerElem(el, COMPONENT_TEXT_FIELD));
    }, 500); // Pequeño retardo para asegurar renderizado
    // --- Fin registro automático ---

    return () => {
      finishTracking();
      // Iniciar tracking de la siguiente escena según el orden de tareas
      const nextSceneId = getCurrentSceneId();
      initTracking(nextSceneId);
    };
  }, []);

  return (
    <div id="initial-form-root" style={{
      flex: 1, padding: "20px 20px",
      display: "flex", flexDirection: "column", justifyContent: "space-between",
      alignItems: "center", position: "relative", overflow: "hidden"
    }}>
      <div style={{ position: "absolute", top: "20px", right: "20px" }}>
        <LanguageSwitcher />
      </div>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", width: "100%" }}>
        <InitialFormComponent />
      </div>
    </div>
  );
}

export async function getServerSideProps(context) {
  const locale = context.locale || 'en';

  return {
    props: {
      messages: (await import(`../../messages/${locale}.json`)).default,
    },
  };
}