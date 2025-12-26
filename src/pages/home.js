import { HomeComponent } from "@/components/homeComponent/HomeComponent";
import { useEffect } from "react";
import { finishSubsceneTracking, initTracking } from "@/metrics/scriptTest";
import { getCurrentSceneId } from "@/constants/scenes";

export default function Home() {
    useEffect(() => {
        const currentSceneId = getCurrentSceneId();
        initTracking(currentSceneId);
        console.log(`Tracking iniciado para escena: ${currentSceneId}`);

        return () => {
            finishSubsceneTracking();
        };
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