import { InitialFormComponent } from "@/components/InitialFormComponent";
import { LanguageSwitcher } from "@/components/shared/LanguageSwitcher";
import { useEffect } from "react";
import { finishSubsceneTracking, finishExperiment } from "@/metrics/scriptTest";
import { useScene } from "@/experiment/useScene";
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
  const scene = useScene(SCENES.INITIAL_FORM);
  useEffect(() => {
    scene.start();

    const formEl = document.getElementById('initial-form-root');
    if (!formEl) return;

    setTimeout(() => {
      const registerElem = (el, typeId, componentId = null) => {
        const id = componentId || el.id;
        if (!id) return;

        const rect = el.getBoundingClientRect();
        const x = rect.left + window.scrollX;
        const y = rect.top + window.scrollY;
        const xF = rect.right + window.scrollX;
        const yF = rect.bottom + window.scrollY;

        registerComponent(
          SCENES.INITIAL_FORM,
          id,
          x,
          y,
          xF,
          yF,
          typeId,
          null
        );

        console.log(`Registered ${typeId} -> ${id} at (${x},${y})`);
      };

      //const selectors = formEl.querySelectorAll('select');
      const antSelects = formEl.querySelectorAll('.ant-select');
      console.log("Found selects:", [...antSelects]);
      antSelects.forEach(el => {
        // Intentamos obtener id lógico del componente
        const componentId = el.querySelector('[data-component-id]')?.dataset.componentId
          || el.dataset.componentId
          || el.id;

        registerElem(el, COMPONENT_COMBOBOX, componentId);
      });


      const textfields = formEl.querySelectorAll(
        'input[type="text"], input[type="email"], input[type="number"], textarea'
      );
      console.log("Found textfields:", [...textfields]);
      textfields.forEach(el => registerElem(el, COMPONENT_TEXT_FIELD));
    }, 300);

    return () => {
      scene.end();
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