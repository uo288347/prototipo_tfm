import { LanguageSwitcher } from "@/components/shared/LanguageSwitcher";
import { SusFormComponent } from "@/components/susFormComponent/SusFormComponent";
import { useEffect } from "react";
import { finishSubsceneTracking, initTracking, finishExperiment, finishTracking } from "@/metrics/scriptTest";
import { SCENES } from "@/metrics/constants/scenes";

export default function SusForm() {
  useEffect(() => {
    initTracking(SCENES.QUESTIONNAIRE);
    console.log("Tracking iniciado para escena: QUESTIONNAIRE (12)");

    return () => {
      finishTracking();
      finishExperiment();
      // Aquí termina el experimento, no hay siguiente escena
      console.log("Experimento finalizado");
    };
  }, []);

    return (
      <div style={{
        flex: 1, padding: "20px 20px",
        display: "flex", flexDirection: "column", justifyContent: "space-between",
        alignItems: "center", position: "relative", overflow: "hidden"
      }}>
        <div style={{ position: "absolute", top: "20px", right: "20px" }}>
          <LanguageSwitcher />
        </div>
        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", width: "100%" }}>
          <SusFormComponent/>
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