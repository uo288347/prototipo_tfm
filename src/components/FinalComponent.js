import { COMPONENT_BUTTON, getCurrentSceneId, registerComponent } from "@/metrics/scriptTest";
import { Button, Typography } from "antd";
import { useTranslations } from 'next-intl';
import { useRouter } from "next/router";
import { useEffect, useRef } from "react";
import Lottie from 'react-lottie';
import animationData from '../../public/Rewards.json';
const { Title } = Typography

export const FinalComponent = ({ }) => {
    const t = useTranslations();
    const router = useRouter();
    const backButtonRef = useRef(null);

    const defaultOptions = {
        loop: true,
        autoplay: true,
        animationData: animationData,
        rendererSettings: {
            preserveAspectRatio: 'xMidYMid slice'
        }
    };

    useEffect(() => {
        const sceneId = getCurrentSceneId();
        const timer = setTimeout(() => {
            if (backButtonRef.current) {
                const rect = backButtonRef.current.getBoundingClientRect();
                registerComponent(sceneId, "btn-back-to-start",  rect.x, rect.y, rect.width, rect.height, COMPONENT_BUTTON, null);
            }
        }, 300);
        return () => clearTimeout(timer);
    }, []);

    return (
        <div style={{
            flex: 1, minHeight: "100%", padding: "20px 20px",
            display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center"
        }}>
            <Title style={{ textAlign: "center" }} level={3}>{t('end.thanksMessage')}</Title>
            <Button ref={backButtonRef} id="btn-back-to-start" data-trackable-id="btn-back-to-start" type="text" onClick={() => {
                router.push("/")
            }} block>{t('end.backToStart')}</Button>
            <div style={{ width: "200px", height: "200px" }}>
                <Lottie options={defaultOptions} />
            </div>
        </div>
    )
}