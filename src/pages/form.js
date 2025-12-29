import { InitialFormComponent } from "@/components/InitialFormComponent";
import { LanguageSwitcher } from "@/components/shared/LanguageSwitcher";
import { useEffect } from "react";
import { finishSubsceneTracking, initTracking, finishTracking } from "@/metrics/scriptTest";
import { SCENES } from "@/metrics/constants/scenes";

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

    return () => {
      finishTracking();
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