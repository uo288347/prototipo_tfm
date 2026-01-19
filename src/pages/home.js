import { HomeComponent } from "@/components/homeComponent/HomeComponent";
import { useEffect } from "react";
import { finishSubsceneTracking } from "@/metrics/script_v2";
import { useScene } from "@/experiment/useScene";
import { getCurrentSceneId } from "@/metrics/constants/scenes";

export default function Home() {
    const currentSceneId = getCurrentSceneId();
    const scene = useScene(currentSceneId);
    useEffect(() => {
      scene.start();
      return () => scene.end();
    }, []);

    return (
    <div style={{margin: "0 10px"}}>
      <HomeComponent />
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