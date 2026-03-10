/**
 * CustomNoticeBar_v2 — Variante con dos fases de animación:
 *  1ª pasada: el texto empieza desde RIGHT_OFFSET px a la derecha, así el
 *             principio es visible desde el inicio (sin corte).
 *  Loops:     el texto entra desde el borde derecho del contenedor y sale
 *             por la izquierda, transición suave tipo marquee.
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

// Píxeles de desplazamiento inicial hacia la derecha en la primera pasada.
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
    const wrapperRef   = useRef(null);
    const innerRef     = useRef(null);
    const styleTagRef  = useRef(null);
    const [animStyle, setAnimStyle] = useState({ visibility: 'hidden' });

    useEffect(() => {
        // Resetear animación cuando cambia el contenido (ocultar hasta que esté lista)
        setAnimStyle({ visibility: 'hidden' });

        // Eliminar keyframes anteriores si los hay
        if (styleTagRef.current) {
            try { document.head.removeChild(styleTagRef.current); } catch (_) {}
            styleTagRef.current = null;
        }

        const timer = setTimeout(() => {
            const wrapper = wrapperRef.current;
            const inner   = innerRef.current;
            if (!wrapper || !inner) return;

            const wrapperWidth = wrapper.clientWidth;
            const contentWidth = inner.scrollWidth;

            // Si el texto no desborda, mostrar estático sin animación
            if (contentWidth <= wrapperWidth) {
                setAnimStyle({ visibility: 'visible' });
                return;
            }

            const id = Math.random().toString(36).slice(2, 9);
            const animInitial = `cnb2_init_${id}`;
            const animLoop    = `cnb2_loop_${id}`;

            // 1ª pasada: de RIGHT_OFFSET hasta -contentWidth (una sola vez)
            const initialDuration = (contentWidth + RIGHT_OFFSET) / speed;
            // Loop: entra desde el borde derecho del contenedor, sale por la izquierda
            const loopDuration    = (contentWidth + wrapperWidth) / speed;

            const keyframes = `
                @keyframes ${animInitial} {
                    0%   { transform: translateX(${RIGHT_OFFSET}px); }
                    100% { transform: translateX(-${contentWidth}px); }
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

            // Arrancar con la animación inicial (1 iteración), ya visible
            setAnimStyle({
                visibility:              'visible',
                animationName:           animInitial,
                animationDuration:       `${initialDuration.toFixed(2)}s`,
                animationTimingFunction: 'linear',
                animationIterationCount: '1',
                animationFillMode:       'forwards',
            });

            // Al terminar la primera pasada, cambiar al loop infinito
            const handleAnimEnd = () => {
                if (!innerRef.current) return;
                setAnimStyle({
                    visibility:              'visible',
                    animationName:           animLoop,
                    animationDuration:       `${loopDuration.toFixed(2)}s`,
                    animationTimingFunction: 'linear',
                    animationIterationCount: 'infinite',
                });
            };

            // Añadir listener; se limpia cuando el efecto se ejecute de nuevo
            const el = inner;
            el.addEventListener('animationend', handleAnimEnd, { once: true });
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
                ...style,
            }}
        >
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
