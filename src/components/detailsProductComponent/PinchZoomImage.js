import { useEffect, useRef, useState } from 'react';

export const PinchZoomImage = ({ src, alt }) => {
    const [scale, setScale] = useState(1);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [origin, setOrigin] = useState({ x: 50, y: 50 });
    const [isDragging, setIsDragging] = useState(false);
    const [imgStyle, setImgStyle] = useState({});

    const imageRef = useRef(null);
    const activePointers = useRef(new Map());
    const touchStartDistance = useRef(0);
    const lastScale = useRef(1);
    const lastPosition = useRef({ x: 0, y: 0 });
    const dragStart = useRef({ x: 0, y: 0 });
    const gestureStartTime = useRef(null);
    const touchCount = useRef(0);

    const logEvent = (eventType, data) => {
        const event = {
            type: eventType,
            timestamp: new Date().toISOString(),
            timeFromStart: gestureStartTime.current
                ? Date.now() - gestureStartTime.current
                : 0,
            ...data
        };

        console.log('📊 Gesture Event:', event);
    };

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

    // Calcular velocidad del gesto
    const calculateVelocity = (startPos, endPos, timeMs) => {
        const dx = endPos.x - startPos.x;
        const dy = endPos.y - startPos.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        return distance / timeMs;
    };


    // Manejar inicio de touch
    const handleTouchStart = (e) => {
        gestureStartTime.current = Date.now();
        touchCount.current = e.touches.length;

        if (e.touches.length === 2) {
            // Pinch zoom
            e.preventDefault();
            const distance = getDistance(e.touches[0], e.touches[1]);
            const center = getCenter(e.touches[0], e.touches[1]);
            const rect = imageRef.current.getBoundingClientRect();
            const originX = ((center.x - rect.left) / rect.width) * 100;
            const originY = ((center.y - rect.top) / rect.height) * 100;

            touchStartDistance.current = distance;
            lastScale.current = scale;

            // Calcular transformOrigin en %
            setOrigin({
                x: originX,
                y: originY
            });
        } else if (e.touches.length === 1 && scale > 1) {
            // Drag cuando hay zoom
            setIsDragging(true);
            dragStart.current = {
                x: e.touches[0].clientX - position.x,
                y: e.touches[0].clientY - position.y
            };
        }
    };

    const handlePointerDown = (e) => {
        activePointers.current.set(e.pointerId, e);
        containerRef.current.setPointerCapture(e.pointerId);

        if (activePointers.current.size === 2) {
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
        } else if (activePointers.current.size === 1 && scale > 1) {
            setIsDragging(true);
            dragStart.current = {
                x: e.clientX - position.x,
                y: e.clientY - position.y
            };
        }
    };

    // Manejar movimiento de touch
    const handleTouchMove = (e) => {
        if (e.touches.length === 2) {
            // Pinch zoom
            e.preventDefault();
            const currentDistance = getDistance(e.touches[0], e.touches[1]);
            const scaleMultiplier = currentDistance / touchStartDistance.current;
            const newScale = Math.min(Math.max(lastScale.current * scaleMultiplier, 1), 5);

            // Ajustar posición para que el zoom siga el punto de pinch
            const rect = imageRef.current.getBoundingClientRect();
            const originPx = {
                x: (origin.x / 100) * rect.width,
                y: (origin.y / 100) * rect.height
            };

            const deltaScale = newScale - lastScale.current;

            const center = getCenter(e.touches[0], e.touches[1]);
            const offsetX = center.x - (rect.left + rect.width / 2);
            const offsetY = center.y - (rect.top + rect.height / 2);

            setPosition({
                x: offsetX * (newScale / lastScale.current - 1) + lastPosition.current.x,
                y: offsetY * (newScale / lastScale.current - 1) + lastPosition.current.y
            });


            setScale(newScale);
        } else if (e.touches.length === 1 && isDragging && scale > 1) {
            // Drag
            e.preventDefault();
            const newX = e.touches[0].clientX - dragStart.current.x;
            const newY = e.touches[0].clientY - dragStart.current.y;

            // Limitar el drag para no salirse demasiado de los bordes
            const maxX = (scale - 1) * 150;
            const maxY = (scale - 1) * 150;

            setPosition({
                x: Math.min(Math.max(newX, -maxX), maxX),
                y: Math.min(Math.max(newY, -maxY), maxY)
            });
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

            setScale(newScale);
            setPosition({
                x: offsetX * (newScale / lastScale.current - 1) + lastPosition.current.x,
                y: offsetY * (newScale / lastScale.current - 1) + lastPosition.current.y
            });
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

    // Manejar fin de touch
    const handleTouchEnd = (e) => {
        if (e.touches.length === 0) {
            setIsDragging(false);
            lastPosition.current = position;

            // Reset si el zoom es muy pequeño
            if (scale < 1.1) {
                setScale(1);
                setPosition({ x: 0, y: 0 });
                setOrigin({ x: 50, y: 50 });
            }
        }
    };

    const handlePointerUp = (e) => {
        activePointers.current.delete(e.pointerId);

        if (activePointers.current.size === 0) {
            setIsDragging(false);
            lastPosition.current = position;

            if (scale < 1.1) {
                setScale(1);
                setPosition({ x: 0, y: 0 });
                setOrigin({ x: 50, y: 50 });
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
