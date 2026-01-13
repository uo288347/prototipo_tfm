import { useRouter } from "next/router";
import { Button } from "antd";
import { useTranslations } from 'next-intl';
import { LanguageSwitcher } from "@/components/shared/LanguageSwitcher";
import useGestureDetector from "@/metrics/GestureDetectorHook";
import { startExperiment, registerUserData, registerComponent, COMPONENT_BUTTON, getCurrentSceneId } from "@/metrics/scriptTest";
import { useScene } from "@/experiment/useScene";
import { SCENES } from "@/metrics/constants/scenes";
import { useEffect, useRef } from "react";

export default function Index() {
  const startButtonRef = useRef(null);

  // Limpiar usuario al cargar la página para forzar creación de uno nuevo
  useEffect(() => {
    if (typeof window !== "undefined" && typeof localStorage !== "undefined") {
      localStorage.removeItem("user");
    }
  }, []);

  useEffect(() => {
    const sceneId = getCurrentSceneId();
    const timer = setTimeout(() => {
      if (startButtonRef.current) {
        const rect = startButtonRef.current.getBoundingClientRect();
        registerComponent(sceneId, "btn-start-experiment", rect.x, rect.y, rect.width, rect.height, COMPONENT_BUTTON, null);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  const { 
    handlePointerDown, 
    handlePointerMove, 
    handlePointerUp, 
    handlePointerCancel } = useGestureDetector();

  const t = useTranslations();
  const router = useRouter();
  const scene = useScene(SCENES.WELCOME);
  const handleStart = () => {
    startExperiment();
    registerUserData();
    scene.start();
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
        ref={startButtonRef}
        id="btn-start-experiment"
        data-trackable-id="btn-start-experiment"
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
