import { CheckOutlined } from "@ant-design/icons"
import { Button, Typography } from "antd"
const {Title} = Typography
import confetti from 'canvas-confetti';
import { useRef } from "react";
import { useRouter } from "next/router";
import { task9 } from "@/utils/UtilsTasks";

export const EndComponent = ({}) => {
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
        <Title style={{paddingBottom:"3rem", textAlign: "center"}} level={3}>Thanks for participating!</Title>
        <Button type="primary" size="large" block
        icon={<CheckOutlined/>}
        onTouchStart={handleDoubleTap}>Double-tap to finish</Button>
        <Button type="text" onClick={() => router.push("/")} block>Back to start</Button>
    </>)
}