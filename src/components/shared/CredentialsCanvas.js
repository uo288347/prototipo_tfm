import Paragraph from "antd/es/typography/Paragraph";
import { useRef, useEffect } from "react";
import { useTranslations } from 'next-intl';

export const CredentialsCanvas = ({ email, password }) => {
    const canvasEmailRef = useRef(null);
    const canvasPasswordRef = useRef(null);

    const t = useTranslations();

    const drawTextOnCanvas = (canvasRef, text) => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        const dpr = window.devicePixelRatio || 1;

        const computedStyle = getComputedStyle(canvas);
        const fontSize = computedStyle.fontSize;
        const lineHeight = parseFloat(computedStyle.lineHeight)
            || parseFloat(fontSize) * 1.5;

        const fontFamily = getComputedStyle(document.documentElement)
            .getPropertyValue('--default-font-family').trim()
            || "ui-sans-serif, system-ui, sans-serif";

        const W = canvas.offsetWidth;
        canvas.width = W * dpr;
        canvas.height = lineHeight * dpr;
        ctx.scale(dpr, dpr);

        ctx.fillStyle = "#262626";
        ctx.font = `bold ${fontSize} ${fontFamily}`;
        ctx.textBaseline = "middle";                 
        ctx.fillText(text, 2, lineHeight / 2 + 1);
    };

    useEffect(() => {
        drawTextOnCanvas(canvasEmailRef, email);
    }, [email]);

    useEffect(() => {
        drawTextOnCanvas(canvasPasswordRef, password);
    }, [password]);

    return (
        <div style={{ marginBottom: "1.5rem" }}>
            <Paragraph style={{ marginBottom: 0 }}>
                {t('auth.loginCredentialsHint')}
            </Paragraph>
            <Paragraph style={{
                display: "flex", flexDirection: "row", alignItems: "center", gap: "4px",
                marginBottom: 0
            }}>
                <div>📧 {t('auth.emailLabel')}: </div>
                <canvas ref={canvasEmailRef} style={{ flex: 1, width: "50%" }} />
            </Paragraph>
            <Paragraph style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: "4px" }}>
                <div>🔑 {t('auth.password')}: </div>
                <canvas ref={canvasPasswordRef} style={{ flex: 1, width: "40%" }} />
            </Paragraph>
        </div>
    );
};