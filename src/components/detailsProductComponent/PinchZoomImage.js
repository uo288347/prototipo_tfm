import { useEffect, useRef, useState } from 'react';

export const PinchZoomImage = ({ src, alt, onSwipeLeft, onSwipeRight }) => {
    const [scale, setScale] = useState(1);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [isGesturing, setIsGesturing] = useState(false);

    const containerRef = useRef(null);
    const activePointers = useRef(new Map());
    const swipeStart = useRef({ x: 0, y: 0, time: 0 });
    const dragStart = useRef({ x: 0, y: 0 });
    const isDraggingRef = useRef(false);
    const wasPinchingRef = useRef(false);

    // Estado absoluto capturado UNA VEZ al inicio de cada gesto de pinch.
    // No se muta durante el gesto: cada frame calcula relativo a este origen,
    // eliminando la acumulación de errores que causa el temblor en iOS.
    const pinchStart = useRef({
        distance: 0,
        scale: 1,
        position: { x: 0, y: 0 },
        center: { x: 0, y: 0 },
    });

    // Refs espejo de scale/position para evitar closures obsoletas en handlers
    const currentScale = useRef(1);
    const currentPosition = useRef({ x: 0, y: 0 });

    const getDistance = (p1, p2) => {
        const dx = p1.clientX - p2.clientX;
        const dy = p1.clientY - p2.clientY;
        return Math.sqrt(dx * dx + dy * dy);
    };

    const getCenter = (p1, p2) => ({
        x: (p1.clientX + p2.clientX) / 2,
        y: (p1.clientY + p2.clientY) / 2,
    });

    const applyScale = (s) => { currentScale.current = s; setScale(s); };
    const applyPosition = (p) => { currentPosition.current = p; setPosition(p); };

    const handlePointerDown = (e) => {
        activePointers.current.set(e.pointerId, e);
        e.currentTarget.setPointerCapture(e.pointerId);

        if (activePointers.current.size === 2) {
            wasPinchingRef.current = true;
            isDraggingRef.current = false;
            setIsGesturing(true);

            const [p1, p2] = Array.from(activePointers.current.values());
            const rect = containerRef.current.getBoundingClientRect();
            const center = getCenter(p1, p2);

            // Capturar estado absoluto de inicio — no se toca durante el pinch
            pinchStart.current = {
                distance: getDistance(p1, p2),
                scale: currentScale.current,
                position: { ...currentPosition.current },
                center: { x: center.x - rect.left, y: center.y - rect.top },
            };
        } else if (activePointers.current.size === 1) {
            swipeStart.current = { x: e.clientX, y: e.clientY, time: Date.now() };
            if (currentScale.current > 1) {
                isDraggingRef.current = true;
                setIsGesturing(true);
                dragStart.current = {
                    x: e.clientX - currentPosition.current.x,
                    y: e.clientY - currentPosition.current.y,
                };
            }
        }
    };

    const handlePointerMove = (e) => {
        if (!activePointers.current.has(e.pointerId)) return;
        activePointers.current.set(e.pointerId, e);

        if (activePointers.current.size === 2) {
            const [p1, p2] = Array.from(activePointers.current.values());
            const currentDistance = getDistance(p1, p2);

            // Ratio absoluto desde el inicio del gesto, sin acumulación incremental.
            // En iOS los pointer events se disparan por separado para cada dedo,
            // por lo que el cálculo incremental (frame anterior como referencia)
            // acumula errores y produce temblor. El cálculo absoluto lo evita.
            const ratio = currentDistance / pinchStart.current.distance;
            const newScale = Math.min(Math.max(pinchStart.current.scale * ratio, 1), 5);

            // Centro actual del pinch en coordenadas del contenedor
            const rect = containerRef.current.getBoundingClientRect();
            const center = getCenter(p1, p2);
            const cx = center.x - rect.left;
            const cy = center.y - rect.top;

            // Fórmula absoluta: el punto de imagen que estaba bajo pinchStart.center
            // debe aparecer ahora bajo el centro actual.
            // Con transformOrigin '0% 0%': containerCoord = translate + imageCoord * scale
            // → newTranslate = currentCenter − (startCenter − startTranslate) × (newScale / startScale)
            const scaleRatio = newScale / pinchStart.current.scale;
            applyPosition({
                x: cx - (pinchStart.current.center.x - pinchStart.current.position.x) * scaleRatio,
                y: cy - (pinchStart.current.center.y - pinchStart.current.position.y) * scaleRatio,
            });
            applyScale(newScale);

        } else if (activePointers.current.size === 1 && isDraggingRef.current) {
            const { clientWidth, clientHeight } = containerRef.current;
            const newX = e.clientX - dragStart.current.x;
            const newY = e.clientY - dragStart.current.y;
            // Con transformOrigin '0% 0%' la imagen se expande hacia abajo/derecha → translate ≤ 0
            const minX = clientWidth * (1 - currentScale.current);
            const minY = clientHeight * (1 - currentScale.current);

            applyPosition({
                x: Math.min(Math.max(newX, minX), 0),
                y: Math.min(Math.max(newY, minY), 0),
            });
        }
    };

    const handlePointerUp = (e) => {
        activePointers.current.delete(e.pointerId);

        if (activePointers.current.size === 0) {
            setIsGesturing(false);
            isDraggingRef.current = false;

            if (wasPinchingRef.current) {
                wasPinchingRef.current = false;
                applyScale(1);
                applyPosition({ x: 0, y: 0 });
            } else if (currentScale.current <= 1) {
                // Detectar swipe: movimiento horizontal rápido con un solo dedo
                const dx = e.clientX - swipeStart.current.x;
                const dy = e.clientY - swipeStart.current.y;
                const elapsed = Date.now() - swipeStart.current.time;
                const absDx = Math.abs(dx);
                const absDy = Math.abs(dy);

                if (absDx > 50 && absDx > absDy * 1.5 && elapsed < 400) {
                    if (dx < 0) onSwipeLeft?.();
                    else onSwipeRight?.();
                }
            }
        } else if (activePointers.current.size === 1 && wasPinchingRef.current) {
            // Un dedo suelto: transicionar de pinch a drag con el dedo restante
            wasPinchingRef.current = false;
            const [remaining] = activePointers.current.values();
            if (currentScale.current > 1) {
                isDraggingRef.current = true;
                dragStart.current = {
                    x: remaining.clientX - currentPosition.current.x,
                    y: remaining.clientY - currentPosition.current.y,
                };
            }
        }
    };

    // Reset al cambiar de imagen
    useEffect(() => {
        currentScale.current = 1;
        currentPosition.current = { x: 0, y: 0 };
        setScale(1);
        setPosition({ x: 0, y: 0 });
    }, [src]);

    return (
        <div
            ref={containerRef}
            style={{
                width: '100%',
                height: '50vh',
                overflow: 'hidden',
                position: 'relative',
                touchAction: 'none',
                backgroundColor: '#f5f5f5',
            }}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
        >
            <img
                src={src}
                alt={alt}
                style={{
                    width: '100%',
                    height: '50vh',
                    objectFit: 'cover',
                    objectPosition: 'top',
                    transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
                    transformOrigin: '0% 0%',
                    transition: isGesturing ? 'none' : 'transform 0.1s ease-out',
                    userSelect: 'none',
                    WebkitUserSelect: 'none',
                    willChange: 'transform',
                }}
                draggable={false}
            />
        </div>
    );
};
