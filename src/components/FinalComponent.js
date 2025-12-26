import { Button, Typography } from "antd"
const { Title } = Typography
import confetti from 'canvas-confetti';
import { useEffect, useRef } from "react";
import { useRouter } from "next/router";
import { useTranslations } from 'next-intl';
import Lottie from 'react-lottie';
import animationData from '../../public/Rewards.json';

export const FinalComponent = ({ }) => {
    const t = useTranslations();
    const router = useRouter();

    const defaultOptions = {
        loop: true,
        autoplay: true,
        animationData: animationData,
        rendererSettings: {
            preserveAspectRatio: 'xMidYMid slice'
        }
    };

    useEffect(() => {
        // Lanzar confetti al montar el componente
        /*confetti({
            particleCount: 150,
            spread: 80,
            origin: { y: 0.6 },
        });*/
    }, []);

    return (
        <div style={{
            flex: 1, minHeight: "100%", padding: "20px 20px",
            display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center"
        }}>
            <Title style={{ textAlign: "center" }} level={3}>{t('end.thanksMessage')}</Title>
            <Button type="text" onClick={() => {
                router.push("/")
            }} block>{t('end.backToStart')}</Button>
            <div style={{ width: "200px", height: "200px" }}>
                <Lottie options={defaultOptions} />
            </div>
        </div>
    )
}