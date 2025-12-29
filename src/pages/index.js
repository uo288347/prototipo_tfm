import { useRouter } from "next/router";
import { Button } from "antd";
import { useTranslations } from 'next-intl';
import { LanguageSwitcher } from "@/components/shared/LanguageSwitcher";
import useGestureDetector from "@/metrics/GestureDetectorHook";
import { startExperiment, registerUserData, initTracking, finishTracking } from "@/metrics/scriptTest";
import { SCENES, getCurrentSceneId } from "@/metrics/constants/scenes";

export default function Index() {
  const { 
    handlePointerDown, 
    handlePointerMove, 
    handlePointerUp, 
    handlePointerCancel } = useGestureDetector();

  const t = useTranslations();
  const router = useRouter();
  const handleStart = () => {
    // Iniciar el experimento cuando se pulsa "Empezar"
    startExperiment();
    registerUserData();
    
    // Iniciar tracking de la escena de bienvenida
    initTracking(SCENES.WELCOME);
    console.log("Tracking iniciado para escena: WELCOME (0)");
    
    finishTracking();
    // Iniciar tracking de la siguiente escena según el orden de tareas
    const nextSceneId = getCurrentSceneId();
    initTracking(nextSceneId);
    router.push("/form");
  };

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
        <Button 
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerCancel}
        style={{ width: "100%" }} size="large" type="primary" onClick={handleStart}>
          {t('auth.start')}
        </Button>
      </div>

    </div>
  );
}

export async function getServerSideProps(context) {
  const locale = context.locale || 'es';

  return {
    props: {
      messages: (await import(`../../messages/${locale}.json`)).default,
    },
  };
}
