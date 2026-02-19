import { useEffect, useRef, useState } from 'react';
import { openNotification } from '@/utils/UtilsNotifications';

export const PinchZoomImage = ({ src, alt }) => {
    const [scale, setScale] = useState(1);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [origin, setOrigin] = useState({ x: 50, y: 50 });
    const [isDragging, setIsDragging] = useState(false);

    const imageRef = useRef(null);
    const containerRef = useRef(null);
    const activePointers = useRef(new Map());
    const touchStartDistance = useRef(0);
    const lastScale = useRef(1);
    const lastPosition = useRef({ x: 0, y: 0 });
    const dragStart = useRef({ x: 0, y: 0 });
    const wasPinching = useRef(false);
    const pinchNotified = useRef(false);

    // Calcular distancia entre dos puntos táctiles
    const getDistance = (touch1, touch2) => {
        const dx = touch1.clientX - touch2.clientX;
        const dy = touch1.clientY - touch2.clientY;
        return Math.sqrt(dx * dx + dy * dy);
    };

    // Calcular centro entre dos puntos
    const getCenter = (touch1, touch2) => {
        return {
            x: (touch1.clientX + touch2.clientX) / 2,
            y: (touch1.clientY + touch2.clientY) / 2
        };
    };

    const handlePointerDown = (e) => {
        activePointers.current.set(e.pointerId, e);
        containerRef.current.setPointerCapture(e.pointerId);

        if (activePointers.current.size === 2) {
            wasPinching.current = true;
            const [p1, p2] = Array.from(activePointers.current.values());
            const distance = getDistance(p1, p2);
            const center = getCenter(p1, p2);
            const rect = imageRef.current.getBoundingClientRect();

            touchStartDistance.current = distance;
            lastScale.current = scale;
            lastPosition.current = position;

            setOrigin({
                x: ((center.x - rect.left) / rect.width) * 100,
                y: ((center.y - rect.top) / rect.height) * 100
            });

            if (!pinchNotified.current) {
                pinchNotified.current = true;
                openNotification(
                    'top',
                    '🤏 Pinch detectado',
                    'info',
                    <div style={{ fontSize: 13, lineHeight: 1.6 }}>
                        <div><b>Pointers activos:</b> {activePointers.current.size}</div>
                        <div><b>Distancia inicial:</b> {Math.round(distance)}px</div>
                        <div><b>Centro del gesto:</b> ({Math.round(center.x)}, {Math.round(center.y)})</div>
                        <div><b>Escala actual:</b> {scale.toFixed(2)}x</div>
                    </div>
                );
            }
        } else if (activePointers.current.size === 1 && scale > 1) {
            setIsDragging(true);
            dragStart.current = {
                x: e.clientX - position.x,
                y: e.clientY - position.y
            };
        }
    };

    const handlePointerMove = (e) => {
        if (!activePointers.current.has(e.pointerId)) return;
        activePointers.current.set(e.pointerId, e);

        if (activePointers.current.size === 2) {
            const [p1, p2] = Array.from(activePointers.current.values());
            const currentDistance = getDistance(p1, p2);
            const scaleMultiplier = currentDistance / touchStartDistance.current;
            const newScale = Math.min(Math.max(lastScale.current * scaleMultiplier, 1), 5);

            const rect = imageRef.current.getBoundingClientRect();
            const center = getCenter(p1, p2);
            const offsetX = center.x - (rect.left + rect.width / 2);
            const offsetY = center.y - (rect.top + rect.height / 2);

            const newPosition = {
                x: offsetX * (newScale / lastScale.current - 1) + lastPosition.current.x,
                y: offsetY * (newScale / lastScale.current - 1) + lastPosition.current.y
            };

            // Actualizar referencias para el siguiente frame
            lastScale.current = newScale;
            lastPosition.current = newPosition;
            touchStartDistance.current = currentDistance;

            setScale(newScale);
            setPosition(newPosition);
        } else if (activePointers.current.size === 1 && isDragging && scale > 1) {
            const newX = e.clientX - dragStart.current.x;
            const newY = e.clientY - dragStart.current.y;
            const maxX = (scale - 1) * 150;
            const maxY = (scale - 1) * 150;

            setPosition({
                x: Math.min(Math.max(newX, -maxX), maxX),
                y: Math.min(Math.max(newY, -maxY), maxY)
            });
        }
    };

    const handlePointerUp = (e) => {
        activePointers.current.delete(e.pointerId);

        if (activePointers.current.size === 0) {
            setIsDragging(false);
            if (wasPinching.current) {
                wasPinching.current = false;
                lastScale.current = 1;
                lastPosition.current = { x: 0, y: 0 };
                setScale(1);
                setPosition({ x: 0, y: 0 });
                setOrigin({ x: 50, y: 50 });
            } else {
                lastPosition.current = position;
            }
        }
    };

    // Reset al cambiar de imagen
    useEffect(() => {
        setScale(1);
        setPosition({ x: 0, y: 0 });
        lastScale.current = 1;
        lastPosition.current = { x: 0, y: 0 };
        setOrigin({ x: 50, y: 50 });
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
                backgroundColor: '#f5f5f5'
            }}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerDown={handlePointerDown}
            onPointerCancel={handlePointerUp}
        >
            <img
                ref={imageRef}
                src={src}
                alt={alt}
                style={{
                    width: '100%',
                    height: "50vh",
                    objectFit: 'cover',
                    objectPosition: 'top',
                    transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
                    transformOrigin: `${origin.x}% ${origin.y}%`,
                    transition: isDragging ? 'none' : 'transform 0.1s ease-out',
                    userSelect: 'none',
                    WebkitUserSelect: 'none'
                }}
                draggable={false}
            />
        </div>
    );
};
