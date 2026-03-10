/**
 * CustomNoticeBar — Reemplaza al NoticeBar de antd-mobile con una pausa inicial
 * de 2 segundos antes de que el texto empiece a desplazarse.
 *
 * Props (equivalentes a NoticeBar de antd-mobile):
 *   icon     — nodo React para el icono izquierdo
 *   content  — texto a mostrar
 *   color    — 'default' | 'info' | 'success' | 'alert' | 'error'
 *   style    — estilos inline adicionales (sobreescriben el tema de color)
 *   onClick  — callback al pulsar
 *   speed    — velocidad de desplazamiento en px/s (por defecto 50)
 */
import { useEffect, useRef, useState } from 'react';

const PAUSE_SECONDS = 1.5;

// Colores extraídos directamente del CSS de antd-mobile
const COLOR_THEMES = {
    default: { backgroundColor: '#999999', borderColor: '#999999', color: '#ffffff' },
    info:    { backgroundColor: '#d0e4ff', borderColor: '#bcd8ff', color: '#1677ff' },
    success: { backgroundColor: '#d1fff0', borderColor: '#a8f0d8', color: '#00b578' },
    alert:   { backgroundColor: '#fff9ed', borderColor: '#fff3e9', color: '#ff6430' },
    error:   { backgroundColor: '#ff3141', borderColor: '#d9281e', color: '#ffffff' },
};

export function CustomNoticeBar({ icon, content, color = 'default', style, onClick, speed = 50 }) {
    const wrapperRef = useRef(null);
    const innerRef   = useRef(null);
    const styleTagRef = useRef(null);
    const [animStyle, setAnimStyle] = useState({});

    useEffect(() => {
        // Resetear animación cuando cambia el contenido
        setAnimStyle({});

        // Eliminar keyframes anteriores si los hay
        if (styleTagRef.current) {
            try { document.head.removeChild(styleTagRef.current); } catch (_) {}
            styleTagRef.current = null;
        }

        // Esperar al siguiente frame para que el DOM refleje el nuevo contenido
        const timer = setTimeout(() => {
            const wrapper = wrapperRef.current;
            const inner   = innerRef.current;
            if (!wrapper || !inner) return;

            const wrapperWidth  = wrapper.clientWidth;
            const contentWidth  = inner.scrollWidth;

            // Solo animar si el texto desborda
            if (contentWidth <= wrapperWidth) return;

            const id = Math.random().toString(36).slice(2, 9);
            const animInitial = `cnb_init_${id}`;
            const animLoop    = `cnb_loop_${id}`;

            // 1ª pasada: pausa inicial + desplazamiento hasta salir por la izquierda
            const scrollDuration  = contentWidth / speed;
            const initialDuration = PAUSE_SECONDS + scrollDuration;
            const pausePercent    = (PAUSE_SECONDS / initialDuration) * 100;

            // Loop: entra desde el borde derecho del contenedor, sale por la izquierda
            const loopDuration = (contentWidth + wrapperWidth) / speed;

            const keyframes = `
                @keyframes ${animInitial} {
                    0%,
                    ${pausePercent.toFixed(2)}% { transform: translateX(0); }
                    100%                        { transform: translateX(-${contentWidth}px); }
                }
                @keyframes ${animLoop} {
                    0%   { transform: translateX(${wrapperWidth}px); }
                    100% { transform: translateX(-${contentWidth}px); }
                }
            `;

            const styleEl = document.createElement('style');
            styleEl.textContent = keyframes;
            document.head.appendChild(styleEl);
            styleTagRef.current = styleEl;

            // Arrancar con la animación inicial (1 iteración)
            setAnimStyle({
                animationName:           animInitial,
                animationDuration:       `${initialDuration.toFixed(2)}s`,
                animationTimingFunction: 'linear',
                animationIterationCount: '1',
                animationFillMode:       'forwards',
            });

            // Al terminar la primera pasada, cambiar al loop infinito que entra por la derecha
            inner.addEventListener('animationend', () => {
                if (!innerRef.current) return;
                setAnimStyle({
                    animationName:           animLoop,
                    animationDuration:       `${loopDuration.toFixed(2)}s`,
                    animationTimingFunction: 'linear',
                    animationIterationCount: 'infinite',
                });
            }, { once: true });
        }, 100);

        return () => clearTimeout(timer);
    }, [content, speed]);

    // Limpiar el <style> al desmontar
    useEffect(() => {
        return () => {
            if (styleTagRef.current) {
                try { document.head.removeChild(styleTagRef.current); } catch (_) {}
                styleTagRef.current = null;
            }
        };
    }, []);

    const theme = COLOR_THEMES[color] || COLOR_THEMES.default;

    return (
        <div
            onClick={onClick}
            style={{
                // — estructura base idéntica al .adm-notice-bar —
                height:          '40px',
                boxSizing:       'border-box',
                fontSize:        '15px',
                padding:         '0 12px',
                display:         'flex',
                alignItems:      'center',
                justifyContent:  'space-between',
                borderTop:       `1px solid ${theme.borderColor}`,
                borderBottom:    `1px solid ${theme.borderColor}`,
                backgroundColor: theme.backgroundColor,
                color:           theme.color,
                // — props extra del llamador (sobreescriben el tema) —
                cursor: onClick ? 'pointer' : 'default',
                ...style,
            }}
        >
            {/* .adm-notice-bar-left */}
            {icon && (
                <span style={{
                    flexShrink: 0,
                    marginRight: '8px',
                    fontSize:    '18px',
                    display:     'flex',
                    alignItems:  'center',
                }}>
                    {icon}
                </span>
            )}

            {/* .adm-notice-bar-content */}
            <div
                ref={wrapperRef}
                style={{
                    flex:     1,
                    overflow: 'hidden',
                    position: 'relative',
                    height:   '100%',
                    display:  'flex',
                    alignItems: 'center',
                }}
            >
                {/* .adm-notice-bar-content-inner */}
                <span
                    ref={innerRef}
                    style={{
                        whiteSpace: 'nowrap',
                        ...animStyle,
                    }}
                >
                    {content}
                </span>
            </div>
        </div>
    );
}
