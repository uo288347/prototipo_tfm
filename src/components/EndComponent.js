import { CheckOutlined } from "@ant-design/icons"
import { Button, Typography } from "antd"
const {Title} = Typography
import confetti from 'canvas-confetti';
import { useRef } from "react";

export const EndComponent = ({}) => {
    const lastTapRef = useRef(0);

    const handleDoubleTap = () => {
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
    const handleDoubleClick = () => {
        // Dispara el confetti 🎊
        confetti({
        particleCount: 150,
        spread: 80,
        origin: { y: 0.6 },
        });
    };

    return(<>
        <Title style={{paddingBottom:"4rem"}} level={2}>Thanks for participating!</Title>
        <Button type="primary" size="large" block
        icon={<CheckOutlined/>}
        onTouchStart={handleDoubleTap}>Double-tap to finish</Button>
    </>)
}