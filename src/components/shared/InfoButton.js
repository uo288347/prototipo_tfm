import { Button, Modal, Typography } from "antd";
import { InfoCircleOutlined } from "@ant-design/icons";
import { useState, useRef, useEffect } from "react";
import { useTranslations } from 'next-intl';
import { COMPONENT_BUTTON, getCurrentSceneId, registerComponent } from "@/metrics/scriptTest";

const { Text, Paragraph } = Typography;

export const InfoButton = ({ tooltip }) => {
    const [open, setOpen] = useState(false);
    const t = useTranslations('infoPopover');
    const buttonRef = useRef(null);

    useEffect(() => {
        const sceneId = getCurrentSceneId();
        const timer = setTimeout(() => {
            if (buttonRef.current) {
                const rect = buttonRef.current.getBoundingClientRect();
                registerComponent(sceneId, "btn-info-favs", rect.x, rect.y, rect.width, rect.height, COMPONENT_BUTTON);
            }
        }, 300);
        return () => clearTimeout(timer);
    }, []);

    return (
        <>
            <Button 
                shape="circle" 
                ref={buttonRef}
                id="btn-info-favs"
                data-trackable-id="btn-info-favs"
                style={{ border: "none" }}
                size="large"
                type="icon"
                icon={<InfoCircleOutlined />}
                onClick={() => setOpen(true)}
            />
            <Modal
                title={t('howToDelete')}
                open={open}
                onCancel={() => setOpen(false)}
                footer={null}
                centered
                width={"100%"}
            >
                <div>
                    <Paragraph style={{ marginBottom: 8 }}>
                        1. {t('step1')}
                    </Paragraph>
                    <Paragraph style={{ marginBottom: 0 }}>
                        2. {t('step2')}
                    </Paragraph>
                </div>
            </Modal>
        </>
    );
}