import { InitialFormComponent } from "@/components/InitialFormComponent";
import { LanguageSwitcher } from "@/components/shared/LanguageSwitcher";
import { useEffect } from "react";
import { useScene } from "@/experiment/useScene";
import { SCENES } from "@/metrics/constants/scenes";

export default function InitialForm({footer}) {
  /*const scene = useScene(SCENES.INITIAL_FORM);
  
  useEffect(() => {
    scene.start();

    return () => {
      scene.end();
    };
  }, []);
*/

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
      {footer}
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