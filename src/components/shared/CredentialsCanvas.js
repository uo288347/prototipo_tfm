import { useRef, useEffect } from "react";

export const CredentialsCanvas = ({ hint, email, password }) => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        const dpr = window.devicePixelRatio || 1;

        const W = canvas.offsetWidth;
        const H = 110;
        canvas.width = W * dpr;
        canvas.height = H * dpr;
        ctx.scale(dpr, dpr);

        // Fondo
        /*ctx.fillStyle = "#fffbe6";
        ctx.beginPath();
        ctx.roundRect(0, 0, W, H, 8);
        ctx.fill();

        // Borde
        ctx.strokeStyle = "#ffe58f";
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.roundRect(0.75, 0.75, W - 1.5, H - 1.5, 8);
        ctx.stroke();*/

        // Obtener la fuente principal de la app desde la variable CSS --default-font-family
        const root = document.documentElement;
        let fontFamily = getComputedStyle(root).getPropertyValue('--default-font-family').trim();
        if (!fontFamily) {
            // fallback a system-ui si la variable no está definida
            fontFamily = "ui-sans-serif, system-ui, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji'";
        }
        // Hint
        ctx.fillStyle = "#595959";
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
        const emailY = hintY + 10; // 10px extra de separación
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
    }, [hint, email, password]);

    return (
        <canvas
            ref={canvasRef}
            style={{
                width: "100%",
            }}
        />
    );
};