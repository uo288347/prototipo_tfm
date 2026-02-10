import { COMPONENT_BUTTON, getCurrentSceneId, registerComponent } from "@/metrics/scriptTest";
import { task9 } from "@/utils/UtilsTasks";
import { CheckOutlined } from "@ant-design/icons";
import { Button, Typography } from "antd";
import { useTranslations } from 'next-intl';
import { useRouter } from "next/router";
import { useEffect, useRef } from "react";
const { Title } = Typography

export const EndComponent = ({ }) => {
    const t = useTranslations();
    const router = useRouter();
    const lastTapRef = useRef(0);
    const finishButtonRef = useRef(null);

    useEffect(() => {
        const sceneId = getCurrentSceneId();
        const timer = setTimeout(() => {
            if (finishButtonRef.current) {
                const rect = finishButtonRef.current.getBoundingClientRect();
                registerComponent(sceneId, "btn-finish-double-tap", rect.x, rect.y, rect.width, rect.height, COMPONENT_BUTTON, null);
            }
        }, 300);
        return () => clearTimeout(timer);
    }, []);

    const handleDoubleTap = () => {
        
        const now = Date.now();
        const DOUBLE_TAP_DELAY = 300; // milisegundos entre taps

        if (now - lastTapRef.current < DOUBLE_TAP_DELAY) {
            task9();
            router.push('/sus');
        }

        lastTapRef.current = now;

    };

    return (
        <div style={{
            flex: 1, minHeight: "100%", padding: "20px 20px",
            display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center"
        }}>
                <Button ref={finishButtonRef} id="btn-finish-double-tap" data-trackable-id="btn-finish-double-tap" type="primary" size="large" block
                    icon={<CheckOutlined />}
                    onTouchStart={handleDoubleTap}>{t('end.doubleTapFinish')}</Button>
        </div>
    )
}

/*<Title style={{ paddingBottom: "3rem", textAlign: "center" }} level={3}>{t('end.thanksMessage')}</Title> */