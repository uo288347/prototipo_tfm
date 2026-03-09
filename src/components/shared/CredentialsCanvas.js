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

        const W = canvas.offsetWidth;
        const H = 28;
        canvas.width = W * dpr;
        canvas.height = H * dpr;
        ctx.scale(dpr, dpr);

        const fontFamily = getComputedStyle(document.documentElement)
            .getPropertyValue('--default-font-family').trim()
            || "ui-sans-serif, system-ui, sans-serif";

        ctx.fillStyle = "#262626";
        ctx.font = `bold 0.85rem ${fontFamily}`;
        ctx.fillText(text, 2, 18);
    };

    useEffect(() => {
        drawTextOnCanvas(canvasEmailRef, email);
    }, [email]);

    useEffect(() => {
        drawTextOnCanvas(canvasPasswordRef, password);
    }, [password]);

    /*useEffect(() => {
        const canvasEmail = canvasEmailRef.current;
        if (!canvasEmail) return;
        const ctx = canvasEmail.getContext("2d");
        const dpr = window.devicePixelRatio || 1;

        const W = canvasEmail.offsetWidth;
        const H = 110;
        canvasEmail.width = W * dpr;
        canvasEmail.height = H * dpr;
        ctx.scale(dpr, dpr);

        // Obtener la fuente principal de la app desde la variable CSS --default-font-family
        const root = document.documentElement;
        let fontFamily = getComputedStyle(root).getPropertyValue('--default-font-family').trim();
        if (!fontFamily) {
            // fallback a system-ui si la variable no está definida
            fontFamily = "ui-sans-serif, system-ui, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji'";
        }
        // Hint
        /*ctx.fillStyle = "#595959";
        ctx.font = `0.9rem ${fontFamily}`;
        const maxHintWidth = W - 4; // margen izquierdo y derecho
        const words = hint.split(' ');
        let line = '';
        const lines = [];
        for (let i = 0; i < words.length; i++) {
            const testLine = line + (line ? ' ' : '') + words[i];
            const metrics = ctx.measureText(testLine);
            if (metrics.width > maxHintWidth && line) {
                lines.push(line);
                line = words[i];
            } else {
                line = testLine;
            }
        }
        if (line) lines.push(line);
        // Dibujar cada línea
        let hintY = 16;
        for (const l of lines) {
            ctx.fillText(l, 2, hintY);
            hintY += 18; // espacio entre líneas
        }

        // Calcular posición para email y password
        const emailY = 10; // 10px extra de separación
        ctx.fillStyle = "#595959";
        ctx.font = `0.9rem ${fontFamily}`;
        ctx.fillText("📧 Email:", 2, emailY);
        ctx.fillStyle = "#262626";
        ctx.font = `bold 0.9rem ${fontFamily}`;
        ctx.fillText(email, 70, emailY);

        const passwordY = emailY + 28; // 28px debajo del email
        ctx.fillStyle = "#595959";
        ctx.font = `0.9rem ${fontFamily}`;
        ctx.fillText("🔑 Contraseña:", 2, passwordY);
        ctx.fillStyle = "#262626";
        ctx.font = `bold 0.9rem ${fontFamily}`;
        ctx.fillText(password, 110, passwordY);
    }, [email, password]);*/

    return (
        <div style={{ marginBottom: "1.5rem"}}>
            <Paragraph style={{ marginBottom: 0 }}>
                {t('auth.loginCredentialsHint')}
            </Paragraph>
            <Paragraph style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: "4px",
                marginBottom: 0
             }}>
                <div>📧 {t('auth.emailLabel')}: </div>
                <canvas ref={canvasEmailRef} style={{ flex: 1, width:"50%" }}/>
            </Paragraph>
            <Paragraph style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: "4px" }}>
                <div>🔑 {t('auth.password')}: </div>
                <canvas ref={canvasPasswordRef} style={{ flex: 1, width:"40%" }} />
            </Paragraph>
        </div>

    );
};