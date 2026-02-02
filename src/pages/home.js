import { HomeComponent } from "@/components/homeComponent/HomeComponent";
import { useEffect } from "react";
import { finishSubsceneTracking } from "@/metrics/scriptTest";
import { useScene } from "@/experiment/useScene";
import { getCurrentSceneId } from "@/metrics/constants/scenes";
import { Footer } from "@/components/shared/Footer";

export default function Home({footer}) {
    const currentSceneId = getCurrentSceneId();
    const scene = useScene(currentSceneId);
    useEffect(() => {
      scene.start();
      return () => scene.end();
    }, []);

    return (
    <div style={{margin: "0 10px"}}>
      <HomeComponent footer={footer}/>
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