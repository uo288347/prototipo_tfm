import { getUser, registerid, registerUserData, startExperiment } from "@/metrics/scriptTest";
import { Button, Card, Checkbox, Divider, Typography, Collapse } from 'antd';
import { useTranslations } from 'next-intl';
import { useRouter } from "next/router";
import { useRef, useState } from "react";
import { List } from 'antd'; // LIST debe reemplazarse por LISTY en la versión 7, deprecado

const { Title, Paragraph } = Typography;

export const IndexComponent = () => {
    const startButtonRef = useRef(null);
    const [accepted, setAccepted] = useState(false);

    const t = useTranslations();
    const router = useRouter();
    const handleStart = () => {
        console.log("Start button clicked, starting experiment...");
        startExperiment();
        router.push("/form");
        registerUserData();
        registerid(getUser());
    };
    
    return (
        <>
            <div style={{ flex: 1, display: "flex", alignItems: "center" }}>
                <Card title={<>
                    <Paragraph style={{
                        textTransform: "uppercase",
                        color: "#8a827D",
                        margin: "0.5rem 0 6px",
                    }}>
                        {t("auth.university")}
                    </Paragraph>
                    <Title level={4} style={{ marginBottom: 10, marginTop: 0 }}>
                        {t('auth.informedConsentTitle')}
                    </Title>
                </>}
                    style={{ marginTop: "2rem" }}>
                    <Paragraph style={{
                        margin: "0 0 1rem", color: "#3a3630",
                    }}>
                        {t('auth.consentText1')}
                    </Paragraph>
                    <Paragraph style={{ margin: "0 0 1rem", color: "#3a3630" }}>
                        {t('auth.consentText2')}
                    </Paragraph>
                    <Paragraph style={{ margin: 0, color: "#3a3630" }}>
                        {t('auth.consentText3')}
                    </Paragraph>
                </Card>
            </div>

            <div style={{ flexShrink: 0 }}>
                <Checkbox onChange={e => setAccepted(e.target.checked)}
                    style={{ marginBottom: "0.5rem" }}>
                    {t('auth.acceptTerms')}
                </Checkbox>
                <Button
                    ref={startButtonRef}
                    id="btn-start-experiment"
                    disabled={!accepted}
                    data-trackable-id="btn-start-experiment"
                    style={{ width: "100%", margin: "0.5rem 0" }} size="large" type="primary" onClick={handleStart}>
                    {t('auth.start')}
                </Button>
            </div>
        </>

    );
}