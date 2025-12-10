import { useRef } from 'react';

const useGestureDetector = () => {
    const pointerCache = useRef([]);
    const gestureState = useRef({
        currentGestureId: null,
        gestureType: null,
        startTime: null,
        startPositions: {},
        lastTapTime: 0,
        lastTapPosition: null,
        lastTapData: null,
        tapCount: 0,
        eventsInGesture: [],
        pinchStartDistance: null,
        lockedDirection: null
    });

    // Guardar todos los eventos raw
    const rawEventsRef = useRef([]);

    const generateGestureId = () => `gesture_${Date.now()}_${Math.random()}`;

    const distance = (x1, y1, x2, y2) => Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);

    const calculateVelocity = (dist, time) => (time > 0 ? dist / time : 0);

    const captureEventData = (e, eventType, eventName = null) => {
        const width = window.innerWidth;
        const height = window.innerHeight;

        const data = {
            eventId: `${eventType}_${Date.now()}_${Math.random()}`,
            timestamp: Date.now(),
            eventType,
            eventName: eventName || e.target.dataset.eventName || null,
            pointerId: e.pointerId,
            pointerType: e.pointerType,
            isPrimary: e.isPrimary,
            clientX: e.clientX,
            clientY: e.clientY,
            pageX: e.pageX,
            pageY: e.pageY,
            screenX: e.screenX,
            screenY: e.screenY,
            width: e.width || 0,
            height: e.height || 0,
            pressure: e.pressure || 0,
            tiltX: e.tiltX || 0,
            tiltY: e.tiltY || 0,
            button: e.button,
            buttons: e.buttons,
            normalizedClientX: e.clientX / width,
            normalizedClientY: e.clientY / height,
            deviceInfo: {
                userAgent: navigator.userAgent,
                platform: navigator.platform,
                screenWidth: window.screen.width,
                screenHeight: window.screen.height,
                devicePixelRatio: window.devicePixelRatio
            }
        };
        rawEventsRef.current.push(data); // Guardar el evento raw
        return data;
    };


    // Calcular distancia normalizada (independiente del tamaño de pantalla)
    const normalizedDistance = (event1, event2) => {
        const dx = event2.normalizedClientX - event1.normalizedClientX;
        const dy = event2.normalizedClientY - event1.normalizedClientY;
        return Math.sqrt(dx * dx + dy * dy);
    };

    const startGesture = (gestureType, eventData) => {
        const gestureId = generateGestureId();
        gestureState.current.currentGestureId = gestureId;
        gestureState.current.gestureType = gestureType;
        gestureState.current.startTime = eventData.timestamp;
        gestureState.current.eventsInGesture = [eventData];
        return gestureId;
    };

    const addEventToGesture = (eventData) => {
        if (gestureState.current.currentGestureId) {
            gestureState.current.eventsInGesture.push(eventData);
        }
    };

    const finalizeGesture = (finalEventData = null, gestureSpecificData = {}) => {
        if (!gestureState.current.currentGestureId) return null;

        const events = [...gestureState.current.eventsInGesture];
        if (finalEventData) events.push(finalEventData);

        const firstEvent = events[0];
        const lastEvent = events[events.length - 1];
        const duration = lastEvent.timestamp - firstEvent.timestamp;

        // Calcular trayectoria (absoluta y normalizada)
        const trajectory = events.map(e => ({
            x: e.clientX,
            y: e.clientY,
            nx: e.normalizedClientX,
            ny: e.normalizedClientY,
            t: e.timestamp
        }));

        // Calcular distancia total (absoluta)
        let totalDistance = 0;
        for (let i = 1; i < trajectory.length; i++) {
            totalDistance += distance(
                trajectory[i - 1].x, trajectory[i - 1].y,
                trajectory[i].x, trajectory[i].y
            );
        }

        // Calcular distancia total normalizada (0-1, comparable entre dispositivos)
        let totalNormalizedDistance = 0;
        for (let i = 1; i < events.length; i++) {
            totalNormalizedDistance += normalizedDistance(events[i - 1], events[i]);
        }

        // Distancia directa (inicio a fin) - absoluta y normalizada
        const straightDistance = distance(
            firstEvent.clientX, firstEvent.clientY,
            lastEvent.clientX, lastEvent.clientY
        );

        const straightNormalizedDistance = normalizedDistance(firstEvent, lastEvent);

        // Calcular velocidades
        const velocities = [];
        for (let i = 1; i < events.length; i++) {
            const dist = distance(
                events[i - 1].clientX, events[i - 1].clientY,
                events[i].clientX, events[i].clientY
            );
            const time = events[i].timestamp - events[i - 1].timestamp;
            velocities.push(calculateVelocity(dist, time));
        }

        const avgVelocity = velocities.length > 0
            ? velocities.reduce((a, b) => a + b, 0) / velocities.length
            : 0;
        const maxVelocity = velocities.length > 0 ? Math.max(...velocities) : 0;
        const minVelocity = velocities.length > 0 ? Math.min(...velocities) : 0;

        // Calcular aceleración
        const accelerations = [];
        for (let i = 1; i < velocities.length; i++) {
            const timeDelta = events[i + 1].timestamp - events[i].timestamp;
            if (timeDelta > 0) {
                accelerations.push((velocities[i] - velocities[i - 1]) / timeDelta);
            }
        }
        const avgAcceleration = accelerations.length > 0
            ? accelerations.reduce((a, b) => a + b, 0) / accelerations.length
            : 0;

        // Calcular dirección dominante
        const deltaX = lastEvent.clientX - firstEvent.clientX;
        const deltaY = lastEvent.clientY - firstEvent.clientY;
        let direction = null;
        if (Math.abs(deltaX) > 30 || Math.abs(deltaY) > 30) {
            if (Math.abs(deltaX) > Math.abs(deltaY)) {
                direction = deltaX > 0 ? 'right' : 'left';
            } else {
                direction = deltaY > 0 ? 'down' : 'up';
            }
        }

        // Calcular presión promedio, mínima y máxima
        const pressures = events.map(e => e.pressure).filter(p => p > 0);
        const avgPressure = pressures.length > 0
            ? pressures.reduce((a, b) => a + b, 0) / pressures.length
            : 0;
        const maxPressure = pressures.length > 0 ? Math.max(...pressures) : 0;
        const minPressure = pressures.length > 0 ? Math.min(...pressures) : 0;

        // Calcular área de contacto promedio, mínima y máxima
        const widths = events.map(e => e.width).filter(w => w > 0);
        const heights = events.map(e => e.height).filter(h => h > 0);
        const avgWidth = widths.length > 0 ? widths.reduce((a, b) => a + b, 0) / widths.length : 0;
        const avgHeight = heights.length > 0 ? heights.reduce((a, b) => a + b, 0) / heights.length : 0;
        const maxWidth = widths.length > 0 ? Math.max(...widths) : 0;
        const maxHeight = heights.length > 0 ? Math.max(...heights) : 0;

        // Calcular jitter (variación en la posición - útil para taps)
        // Calculado tanto en píxeles absolutos como normalizado
        let jitter = 0;
        let normalizedJitter = 0;
        if (events.length > 1) {
            const positions = events.map(e => ({ x: e.clientX, y: e.clientY }));
            const avgX = positions.reduce((sum, p) => sum + p.x, 0) / positions.length;
            const avgY = positions.reduce((sum, p) => sum + p.y, 0) / positions.length;
            const deviations = positions.map(p => distance(p.x, p.y, avgX, avgY));
            jitter = deviations.reduce((a, b) => a + b, 0) / deviations.length;

            // Jitter normalizado
            const normalizedPositions = events.map(e => ({ x: e.normalizedClientX, y: e.normalizedClientY }));
            const avgNX = normalizedPositions.reduce((sum, p) => sum + p.x, 0) / normalizedPositions.length;
            const avgNY = normalizedPositions.reduce((sum, p) => sum + p.y, 0) / normalizedPositions.length;
            const normalizedDeviations = normalizedPositions.map(p =>
                Math.sqrt((p.x - avgNX) ** 2 + (p.y - avgNY) ** 2)
            );
            normalizedJitter = normalizedDeviations.reduce((a, b) => a + b, 0) / normalizedDeviations.length;
        }

        const gesture = {
            gestureId: gestureState.current.currentGestureId,
            gestureType: gestureState.current.gestureType,
            startTime: firstEvent.timestamp,
            endTime: lastEvent.timestamp,
            duration,
            eventCount: events.length,
            events: events,

            // Información del dispositivo (del primer evento)
            deviceInfo: firstEvent.deviceInfo,

            // Métricas espaciales ABSOLUTAS (píxeles)
            startPosition: { x: firstEvent.clientX, y: firstEvent.clientY },
            endPosition: { x: lastEvent.clientX, y: lastEvent.clientY },
            displacement: { x: deltaX, y: deltaY },
            totalDistance,
            straightDistance,
            curvature: totalDistance > 0 ? straightDistance / totalDistance : 1,
            direction,
            jitter,

            // Métricas espaciales NORMALIZADAS (0-1, comparables entre dispositivos)
            normalizedStartPosition: {
                x: firstEvent.normalizedClientX,
                y: firstEvent.normalizedClientY
            },
            normalizedEndPosition: {
                x: lastEvent.normalizedClientX,
                y: lastEvent.normalizedClientY
            },
            normalizedDisplacement: {
                x: lastEvent.normalizedClientX - firstEvent.normalizedClientX,
                y: lastEvent.normalizedClientY - firstEvent.normalizedClientY
            },
            totalNormalizedDistance,
            straightNormalizedDistance,
            normalizedCurvature: totalNormalizedDistance > 0 ? straightNormalizedDistance / totalNormalizedDistance : 1,
            normalizedJitter,

            // Métricas temporales y de velocidad
            averageVelocity: avgVelocity,
            maxVelocity: maxVelocity,
            minVelocity: minVelocity,
            averageAcceleration: avgAcceleration,

            // Métricas de presión y contacto
            averagePressure: avgPressure,
            maxPressure: maxPressure,
            minPressure: minPressure,
            averageContactWidth: avgWidth,
            averageContactHeight: avgHeight,
            maxContactWidth: maxWidth,
            maxContactHeight: maxHeight,

            // Datos del elemento
            eventName: firstEvent.eventName,
            pointerType: firstEvent.pointerType,

            // Datos específicos del gesto
            ...gestureSpecificData
        };

        // Resetear estado
        gestureState.current = {
            currentGestureId: null,
            gestureType: null,
            startTime: null,
            startPositions: {},
            lastTapTime: gestureState.current.lastTapTime,
            lastTapPosition: gestureState.current.lastTapPosition,
            lastTapData: gestureState.current.lastTapData,
            tapCount: gestureState.current.tapCount,
            eventsInGesture: [],
            pinchStartDistance: null
        };
        return gesture;
    };

    const handlePointerDown = (e) => {
        const eventData = captureEventData(e, 'pointerdown');
        pointerCache.current.push({
            pointerId: e.pointerId,
            startX: e.clientX,
            startY: e.clientY,
            startTime: Date.now(),
            downEventData: eventData
        });

        // Guardar posición inicial
        gestureState.current.startPositions[e.pointerId] = {
            x: e.clientX,
            y: e.clientY,
            time: Date.now()
        };

        if (pointerCache.current.length === 2) {
            const p1 = pointerCache.current[0];
            const p2 = pointerCache.current[1];
            const initialDistance = distance(p1.startX, p1.startY, p2.startX, p2.startY);
            gestureState.current.pinchStartDistance = initialDistance;
            startGesture('pinch', eventData);
        } else {
            startGesture('tap_potential', eventData);
        }
    };

    const handlePointerMove = (e) => {
        const eventData = captureEventData(e, 'pointermove');
        const startPos = gestureState.current.startPositions[e.pointerId];
        if (!startPos) return;

        const dist = distance(startPos.x, startPos.y, e.clientX, e.clientY);

        // Si es un pinch, añadir al gesto existente
        if (gestureState.current.gestureType === 'pinch') {
            addEventToGesture(eventData);
            return;
        }

        // Si es tap_potential y se mueve más de 10px, determinar el tipo de movimiento
        if (gestureState.current.gestureType === 'tap_potential' && dist > 10) {
            const dx = e.clientX - startPos.x;
            const dy = e.clientY - startPos.y;
            const velocity = calculateVelocity(dist, Date.now() - startPos.time); // px/ms

            // ---- Detectar dirección dominante (direction lock) ----
            if (!gestureState.current.lockedDirection) {
                gestureState.current.lockedDirection = Math.abs(dx) > Math.abs(dy) ? 'horizontal' : 'vertical';
            }

            // Swipe: velocidad > 0.5 px/ms
            // Drag: según direction lock = horizontal y velocidad < 0.5 px/ms
            // Scroll: según direction lock = vertical 
            gestureState.current.gestureType =
                gestureState.current.lockedDirection === 'horizontal'
                    ? velocity >= 0.5 ? 'swipe' : 'drag'
                    : 'scroll';

            addEventToGesture(eventData);
            return;
        }

        // Si ya es un gesto de movimiento, añadir eventos
        if (gestureState.current.currentGestureId) {
            addEventToGesture(eventData);
        }
    };

    const handlePointerUp = (e) => {
        const eventData = captureEventData(e, 'pointerup');
        const pointerInfo = pointerCache.current.find(p => p.pointerId === e.pointerId);
        if (!pointerInfo) return;

        const duration = Date.now() - pointerInfo.startTime;
        const dist = distance(pointerInfo.startX, pointerInfo.startY, e.clientX, e.clientY);

        // Finalizar gesto existente (scroll, drag, swipe, pinch)
        if (gestureState.current.currentGestureId && gestureState.current.gestureType !== 'tap_potential') {
            let gestureSpecificData = {};

            // Calcular métricas específicas de pinch
            if (gestureState.current.gestureType === 'pinch' && pointerCache.current.length === 2) {
                const p1 = pointerCache.current[0];
                const p2 = pointerCache.current[1];
                const p1Current = gestureState.current.startPositions[p1.pointerId];
                const p2Current = gestureState.current.startPositions[p2.pointerId];

                if (p1Current && p2Current) {
                    const finalDistance = distance(p1Current.x, p1Current.y, p2Current.x, p2Current.y);
                    const initialDistance = gestureState.current.pinchStartDistance || finalDistance;
                    const scaleFactor = initialDistance > 0 ? finalDistance / initialDistance : 1;

                    gestureSpecificData = {
                        pinchInitialDistance: initialDistance,
                        pinchFinalDistance: finalDistance,
                        pinchScaleFactor: scaleFactor,
                        pinchType: scaleFactor > 1 ? 'zoom_in' : 'zoom_out'
                    };
                }
            }

            const gesture = finalizeGesture(eventData, gestureSpecificData);
            if (gesture) {
                console.log('Gesto detectado:', gesture);
            }

        }
        // Si es tap_potential, determinar qué tipo de tap fue
        else if (gestureState.current.gestureType === 'tap_potential') {
            const now = Date.now();
            const timeSinceLastTap = now - gestureState.current.lastTapTime;
            const lastPos = gestureState.current.lastTapPosition;

            // Verificar si es cerca del último tap
            const isNearLastTap = lastPos ?
                distance(lastPos.x, lastPos.y, e.clientX, e.clientY) < 30 : false;

            // Añadir el evento up al gesto
            addEventToGesture(eventData);

            // Long tap: duración > 500ms
            if (duration > 500) {
                gestureState.current.gestureType = 'long_tap';
                const gesture = finalizeGesture(null, {
                    longTapDuration: duration,
                    longTapPressure: eventData.pressure
                });
                if (gesture) console.log('Gesto detectado:', gesture);
                gestureState.current.tapCount = 0;
                gestureState.current.lastTapData = null;
                addEventToGesture(eventData);
            }
            // Double tap: dos taps rápidos (< 300ms)
            else if (timeSinceLastTap < 300 && isNearLastTap && gestureState.current.lastTapData) {
                gestureState.current.tapCount++;
                if (gestureState.current.tapCount === 2) {
                    const firstTapData = gestureState.current.lastTapData;

                    // Crear un gesto que incluye ambos taps
                    gestureState.current.gestureType = 'double_tap';
                    const gesture = finalizeGesture(null, {
                        doubleTapInterval: timeSinceLastTap,
                        firstTapDuration: firstTapData.duration,
                        secondTapDuration: duration,
                        firstTapPressure: firstTapData.averagePressure || firstTapData.pressure || 0,
                        secondTapPressure: eventData.pressure,
                        tapDistance: distance(
                            firstTapData.startPosition.x,
                            firstTapData.startPosition.y,
                            e.clientX,
                            e.clientY
                        )
                    });
                    if (gesture) console.log('Gesto detectado:', gesture);
                    gestureState.current.tapCount = 0;
                    gestureState.current.lastTapData = null;
                }
            }
            // Single tap
            else {
                gestureState.current.tapCount = 1;
                gestureState.current.lastTapTime = now;
                gestureState.current.lastTapPosition = { x: e.clientX, y: e.clientY };

                // Guardar el gesto del primer tap
                gestureState.current.gestureType = 'tap';
                const firstTapGesture = finalizeGesture(null, {
                    tapDuration: duration,
                    tapPressure: eventData.pressure,
                    tapJitter: dist
                });

                gestureState.current.lastTapData = firstTapGesture;

                // Esperar para confirmar que no es doble tap
                setTimeout(() => {
                    if (gestureState.current.tapCount === 1 && gestureState.current.lastTapData) {
                        const tapGesture = gestureState.current.lastTapData;
                        console.log('Gesto detectado:', tapGesture);
                        gestureState.current.tapCount = 0;
                        gestureState.current.lastTapData = null;
                    }
                }, 310);
            }
        }

        // Limpiar cache
        pointerCache.current = pointerCache.current.filter(p => p.pointerId !== e.pointerId);
        delete gestureState.current.startPositions[e.pointerId];
    };

    const handlePointerCancel = (e) => {
        const eventData = captureEventData(e, 'pointercancel');
        if (gestureState.current.currentGestureId) {
            const gesture = finalizeGesture(eventData);
            if (gesture) {
                gesture.cancelled = true;
                console.log('Gesto cancelado:', gesture);
            }
        }
        pointerCache.current = pointerCache.current.filter(p => p.pointerId !== e.pointerId);
        delete gestureState.current.startPositions[e.pointerId];
    };

    return {
        handlePointerDown,
        handlePointerMove,
        handlePointerUp,
        handlePointerCancel,
        rawEventsRef // Expuesto para enviar todos los eventos al backend
    };
};

export default useGestureDetector;
