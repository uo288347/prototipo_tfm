import LoginFormComponent from "@/components/LoginFormComponent";
import { LanguageSwitcher } from "@/components/shared/LanguageSwitcher";
import { useEffect } from "react";
import { finishSubsceneTracking } from "@/metrics/script_v2";
import { useScene } from "@/experiment/useScene";
import { SCENES, getCurrentSceneId } from "@/metrics/constants/scenes";

export default function LoginPage({ }) {
  const scene = useScene(SCENES.LOGIN);
  useEffect(() => {
    scene.start();
    return () => scene.end();
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
        <LoginFormComponent />
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