/**
 * CustomNoticeBar_v2 — Variante sin pausa inicial.
 * Si el texto necesita scroll, la animación empieza desde un pequeño
 * desplazamiento a la derecha (RIGHT_OFFSET px), de manera que los primeros
 * píxeles de movimiento no cortan el inicio del texto. El usuario tiene
 * ese margen extra para leer el comienzo antes de que desaparezca.
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

// Píxeles de desplazamiento inicial hacia la derecha antes de que el texto
// empiece a salir por la izquierda. Ajustar según se necesite.
const RIGHT_OFFSET = 50;

// Colores extraídos directamente del CSS de antd-mobile
const COLOR_THEMES = {
    default: { backgroundColor: '#999999', borderColor: '#999999', color: '#ffffff' },
    info:    { backgroundColor: '#d0e4ff', borderColor: '#bcd8ff', color: '#1677ff' },
    success: { backgroundColor: '#d1fff0', borderColor: '#a8f0d8', color: '#00b578' },
    alert:   { backgroundColor: '#fff9ed', borderColor: '#fff3e9', color: '#ff6430' },
    error:   { backgroundColor: '#ff3141', borderColor: '#d9281e', color: '#ffffff' },
};

export function CustomNoticeBar_v2({ icon, content, color = 'default', style, onClick, speed = 50 }) {
    const wrapperRef  = useRef(null);
    const innerRef    = useRef(null);
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

            const wrapperWidth = wrapper.clientWidth;
            const contentWidth = inner.scrollWidth;

            // Solo animar si el texto desborda
            if (contentWidth <= wrapperWidth) return;

            // Distancia total: offset inicial + todo el ancho del texto
            const totalDistance  = contentWidth + RIGHT_OFFSET;
            const totalDuration  = totalDistance / speed;

            // Nombre único para evitar colisiones entre instancias
            const animName = `cnb2_${Math.random().toString(36).slice(2, 9)}`;

            // Empieza en +RIGHT_OFFSET (texto desplazado a la derecha),
            // termina en -contentWidth (texto completamente fuera por la izquierda).
            // En el loop, vuelve a empezar desde +RIGHT_OFFSET sin pausa.
            const keyframes = `
                @keyframes ${animName} {
                    0%   { transform: translateX(${RIGHT_OFFSET}px); }
                    100% { transform: translateX(-${contentWidth}px); }
                }
            `;

            const styleEl = document.createElement('style');
            styleEl.textContent = keyframes;
            document.head.appendChild(styleEl);
            styleTagRef.current = styleEl;

            setAnimStyle({
                animationName:           animName,
                animationDuration:       `${totalDuration.toFixed(2)}s`,
                animationTimingFunction: 'linear',
                animationIterationCount: 'infinite',
            });
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
                cursor:          onClick ? 'pointer' : 'default',
                // — props extra del llamador (sobreescriben el tema) —
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
                    flex:       1,
                    overflow:   'hidden',
                    position:   'relative',
                    height:     '100%',
                    display:    'flex',
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
