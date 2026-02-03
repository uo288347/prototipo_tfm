
import { COMPONENT_BUTTON, getCurrentSceneId, registerComponent } from "@/metrics/scriptTest";
import { Button, Row, Typography } from "antd";
import { useTranslations } from 'next-intl';
import { useRouter } from "next/router";
import { useEffect, useRef } from "react";

const {Title} = Typography

export const BottomSection = ({productsLength, selectionMode, calculateTotal}) => {
    const router = useRouter();
    const t = useTranslations();
    const continueButtonRef = useRef(null);

    useEffect(() => {
        const sceneId = getCurrentSceneId();
        const timer = setTimeout(() => {
            if (continueButtonRef.current && productsLength > 0 && !selectionMode) {
                const rect = continueButtonRef.current.getBoundingClientRect();
                registerComponent(sceneId, "btn-continue-checkout", rect.x, rect.y, rect.width, rect.height, COMPONENT_BUTTON, null);
            }
        }, 300);
        return () => clearTimeout(timer);
    }, [productsLength, selectionMode]);
    
    return (<>
        {productsLength > 0 && !selectionMode &&
            (<div style={{
                position: "fixed",
                bottom: 0,
                left: 0,
                right: 0,
                backgroundColor: "white",
                borderTop: "1px solid #e5e7eb",
                padding: "1rem",
            }}>
                <Row style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", paddingBottom: "1rem" }}>
                    <Title level={2} style={{ padding: 0, margin: 0, fontWeight: "normal" }}>{t('cart.total')}</Title>
                    <Title level={2} style={{ padding: 0, margin: 0, fontWeight: "normal" }}>{calculateTotal()}€</Title>
                </Row>
                <Button ref={continueButtonRef} id="btn-continue-checkout" data-trackable-id="btn-continue-checkout" type="primary" block size="large"
                    style={{ padding: "1rem", marginTop: "1rem" }}
                    onClick={() => { router.push("/checkout") }}>
                    {t('cart.continue')}
                </Button>
            </div>)}
    </>);
}