import { CheckOutlined } from "@ant-design/icons"
import { Button, Typography } from "antd"
const {Title} = Typography
import confetti from 'canvas-confetti';
import { useRef } from "react";
import { useRouter } from "next/router";
import { task9, UtilsTasks } from "@/utils/UtilsTasks";
import { clearCart } from "@/utils/UtilsCart";
import { clearFavorites } from "@/utils/UtilsFavorites";
import { clearLogin } from "@/utils/UtilsLogin";
import { useTranslations } from 'next-intl';

export const EndComponent = ({}) => {
    const t = useTranslations();
    const router = useRouter();
    const lastTapRef = useRef(0);

    const handleDoubleTap = () => {
        task9();
        const now = Date.now();
        const DOUBLE_TAP_DELAY = 300; // milisegundos entre taps

        if (now - lastTapRef.current < DOUBLE_TAP_DELAY) {
        // 🎉 Doble tap detectado → lanzar confetti
        confetti({
            particleCount: 150,
            spread: 80,
            origin: { y: 0.6 },
        });
        }

        lastTapRef.current = now;
        
    };

    return(<>
        <Title style={{paddingBottom:"3rem", textAlign: "center"}} level={3}>{t('end.thanksMessage')}</Title>
        <Button type="primary" size="large" block
        icon={<CheckOutlined/>}
        onTouchStart={handleDoubleTap}>{t('end.doubleTapFinish')}</Button>
        <Button type="text" onClick={() => {
            clearCart();
            clearFavorites();
            clearLogin();
            UtilsTasks.resetAllTasks();
            router.push("/")}} block>{t('end.backToStart')}</Button>
    </>)
}