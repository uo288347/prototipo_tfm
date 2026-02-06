import { LanguageSwitcher } from "@/components/shared/LanguageSwitcher";
import {
  COMPONENT_BUTTON, getCurrentSceneId,
  getUser,
  registerComponent,
  registerid,
  registerUserData,
  startExperiment
} from "@/metrics/scriptTest";
import { Button } from "antd";
import { useTranslations } from 'next-intl';
import { useRouter } from "next/router";
import { useEffect, useRef } from "react";

export default function Index({footer}) {
  const startButtonRef = useRef(null);

  // Limpiar usuario al cargar la página para forzar creación de uno nuevo
  useEffect(() => {
    if (typeof window !== "undefined" && typeof localStorage !== "undefined") {
      localStorage.removeItem("user");
    }
  }, []);

  /*useEffect(() => {
    const sceneId = getCurrentSceneId();
    const timer = setTimeout(() => {
      if (startButtonRef.current) {
        const rect = startButtonRef.current.getBoundingClientRect();
        registerComponent(sceneId, "btn-start-experiment", rect.x, rect.y, rect.width, rect.height, COMPONENT_BUTTON, null);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, []);*/

  const t = useTranslations();
  const router = useRouter();
  const handleStart = () => {
    startExperiment();
    router.push("/form");
    registerUserData();
    registerid(getUser());
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
        style={{ width: "100%" }} size="large" type="primary" onClick={handleStart}>
          {t('auth.start')}
        </Button>
      </div>
      {footer}
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
