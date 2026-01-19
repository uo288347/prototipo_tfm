import html2canvas from "html2canvas";
import $ from "jquery";

const VERSION = 4;

// ================= TIPOS DE GESTOS =================
const GESTURE_TAP = 'tap';
const GESTURE_DOUBLE_TAP = 'double_tap';
const GESTURE_LONG_TAP = 'long_tap';
const GESTURE_SCROLL = 'scroll';
const GESTURE_DRAG = 'drag';
const GESTURE_SWIPE = 'swipe';
const GESTURE_PINCH = 'pinch';

// ================= TIPOS DE COMPONENTES =================
const COMPONENT_TEXT_FIELD = 1;
const COMPONENT_COMBOBOX = 2;
const COMPONENT_OPTION = 3;
const COMPONENT_RADIO_BUTTON = 4;
const COMPONENT_CHECK_BOX = 5;
const COMPONENT_BUTTON = 6;
const COMPONENT_CARD = 7;
const COMPONENT_RATE = 8;
const COMPONENT_IMAGE = 9;
const COMPONENT_STEPPER = 10;
const COMPONENT_CAROUSEL = 11;
const COMPONENT_LINK = 12;
const COMPONENT_BANNER = 13;

// ================= EVENTOS ADICIONALES (para compatibilidad) =================
const EVENT_INIT_TRACKING = 100;
const EVENT_TRACKING_END = 200;
const EVENT_KEY_DOWN = 13;
const EVENT_KEY_UP = 15;
const EVENT_FOCUS = 16;
const EVENT_BLUR = 17;

// ================= CONFIGURACIÓN =================
var user = null;
var listenersInitialized = false;
var activeScene = null;

var gestureList = [];
var sceneId = 0;
var gestureCounter = 0;
var trackingOn = false;
var TOP_LIMIT = 20; // Menos gestos por chunk (son más grandes que eventos raw)
var sentRequest = 0;
var pendingRequest = 0;

var pendingBackgroundsDelivered = 0;
var backgroundsDelivered = 0;
var eventsDelivered = false;
var finishedExperiment = false;

var newPage = null;
var elements = [];
var emittingData = true;

var idExperiment = 33;
var urlBase = 'https://interactionlab.hci.uniovi.es:8443';

var url = urlBase + '/TrackerServer/restws/track';
var urlGestureTracker = urlBase + '/TrackerServer/restws/gestureTrack'; // Nueva URL para gestos
var urlBackgroundTracker = urlBase + '/TrackerServer/restws/backgroundTracker';
var urlRegisterComponent = urlBase + '/TrackerServer/restws/registerComponent';
var urlRegisterUserData = urlBase + '/TrackerServer/restws/registerUserData';
var urlDemographicData = urlBase + '/TrackerServer/restws/registerDemographicData';
var urlExperimentStatus = urlBase + '/TrackerServer/restws/experiment/status/' + idExperiment;

// ================= ESTADO DEL DETECTOR DE GESTOS =================
let pointerCache = [];
let gestureState = {
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
};

// ================= FUNCIONES UTILITARIAS =================

function getUser() {
    if (user === null && typeof window !== "undefined" && typeof localStorage !== "undefined") {
        user = createUser();
    }
    return user;
}

function getCurrentSceneId() {
    return sceneId;
}

function getDate() {
    var today = new Date();
    var day = today.getDate();
    var month = today.getMonth() + 1;
    var year = today.getFullYear();
    return (`${month}${day}${year}`);
}

function createUser() {
    if (typeof window === "undefined" || typeof localStorage === "undefined") {
        return null;
    }
    if (localStorage.getItem("user") === null || localStorage.getItem("user") === undefined) {
        let lettrs = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        localStorage.setItem("user",
            lettrs[Math.floor(Math.random() * lettrs.length)] +
            lettrs[Math.floor(Math.random() * lettrs.length)] +
            lettrs[Math.floor(Math.random() * lettrs.length)] +
            (Math.floor(Math.random() * (999999999999 - 100000000000)) + 100000000000).toString() +
            Date.now().toString() + getDate()
        );
    }
    console.log("User created: " + localStorage.getItem("user"));
    return localStorage.getItem("user");
}

function generateGestureId() {
    return `gesture_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

function distance(x1, y1, x2, y2) {
    return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
}

function calculateVelocity(dist, time) {
    return time > 0 ? dist / time : 0;
}

function getQuadrant(dx, dy) {
    if (dx >= 0 && dy < 0) return 'top-right';
    if (dx < 0 && dy < 0) return 'top-left';
    if (dx < 0 && dy >= 0) return 'bottom-left';
    if (dx >= 0 && dy >= 0) return 'bottom-right';
    return 'center';
}

function normalizedDistance(event1, event2) {
    const dx = event2.normalizedClientX - event1.normalizedClientX;
    const dy = event2.normalizedClientY - event1.normalizedClientY;
    return Math.sqrt(dx * dx + dy * dy);
}

// ================= ELEMENTOS =================

class Element {
    constructor(id, x, y, xF, yF, sceneId) {
        this.id = id;
        this.x = x;
        this.y = y;
        this.xF = xF;
        this.yF = yF;
        this.sceneId = sceneId;
    }
    getScene() {
        return this.sceneId;
    }
    isOver(mX, mY) {
        return this.x < mX && mX < this.xF && this.y < mY && mY < this.yF;
    }
}

function isElementVisible(id) {
    const el = document.getElementById(id);
    if (!el) return false;

    const rect = el.getBoundingClientRect();
    const style = window.getComputedStyle(el);

    return (
        rect.width > 0 &&
        rect.height > 0 &&
        style.visibility !== 'hidden' &&
        style.display !== 'none' &&
        rect.bottom > 0 &&
        rect.right > 0 &&
        rect.top < window.innerHeight &&
        rect.left < window.innerWidth
    );
}

function detectElement(x, y) {
    var found = -1;
    let highestZIndex = -Infinity;

    const visibleElements = elements.filter(entry =>
        isElementVisible(entry.id)
    );

    visibleElements.forEach(entry => {
        if (entry.isOver(x, y)) {
            const element = document.getElementById(entry.id);
            if (element) {
                const zIndex = parseInt(window.getComputedStyle(element).zIndex) || 0;
                if (zIndex > highestZIndex || highestZIndex === -Infinity) {
                    highestZIndex = zIndex;
                    found = entry.id;
                }
            }
        }
    });

    return found;
}

function findTrackableIdInAncestors(element) {
    let current = element;
    while (current && current !== document.body) {
        if (!isElementVisible(current.id)) {
            current = current.parentElement;
            continue;
        }
        const trackableId = current.getAttribute('data-trackable-id');
        if (trackableId) {
            return trackableId;
        }
        if (current.id && detectElementByName(current.id) !== -1) {
            return current.id;
        }
        current = current.parentElement;
    }
    return null;
}

function detectElementEnhanced(x, y, eventTarget) {
    var found = detectElement(x, y);

    if (found === -1 && eventTarget) {
        const ancestorId = findTrackableIdInAncestors(eventTarget);
        if (ancestorId) {
            found = ancestorId;
        }
    }

    return found;
}

function detectElementByName(name) {
    const entry = elements.find(e => e.id === name /*&& e.getScene() === sceneId*/);
    if (!entry) return -1;
    return isElementVisible(name) ? entry.id : -1;
}

function registerElement(id, x, y, xF, yF, typeId, sceneId) {
    elements.push(new Element(id, x, y, xF, yF, sceneId));
    addFocusAndBlurEvents(id);
    if (typeId === COMPONENT_COMBOBOX || typeId === COMPONENT_OPTION) {
        addSelectionEvent(id);
    }
}

function addFocusAndBlurEvents(elementId) {
    var element = document.getElementById(elementId);
    if (element != undefined && element != null) {
        element.addEventListener('focus', function (event) {
            trackFocusEvent(event);
        });
        element.addEventListener('blur', function (event) {
            trackBlurEvent(event);
        });
    }
}

function addSelectionEvent(elementId) {
    var element = document.getElementById(elementId);
    if (element != undefined && element != null) {
        element.addEventListener('change', function (event) {
            trackOnChangeSelectionEvent(event);
        });
    }
}

// ================= CAPTURA DE DATOS DE EVENTOS =================

function captureEventData(e, eventType, eventName = null) {
    const width = window.innerWidth;
    const height = window.innerHeight;

    const targetElement = e.target;
    const targetRect = targetElement.getBoundingClientRect();

    const targetCenterX = targetRect.left + targetRect.width / 2;
    const targetCenterY = targetRect.top + targetRect.height / 2;

    const offsetFromCenterX = e.clientX - targetCenterX;
    const offsetFromCenterY = e.clientY - targetCenterY;
    const distanceFromCenter = Math.sqrt(
        offsetFromCenterX ** 2 + offsetFromCenterY ** 2
    );

    const elementDiagonal = Math.sqrt(
        targetRect.width ** 2 + targetRect.height ** 2
    );
    const normalizedDistanceFromCenter = elementDiagonal > 0
        ? distanceFromCenter / elementDiagonal
        : 0;

    const scrollX = window.scrollX || 0;
    const scrollY = window.scrollY || 0;

    const data = {
        eventId: `${eventType}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        timestamp: Date.now(),
        eventType,
        eventName: eventName || e.target.dataset?.eventName || null,
        pointerId: e.pointerId,
        pointerType: e.pointerType,
        isPrimary: e.isPrimary,
        clientX: e.clientX,
        clientY: e.clientY,
        pageX: e.pageX,
        pageY: e.pageY,
        screenX: e.screenX,
        screenY: e.screenY,
        docX: e.clientX + scrollX,
        docY: e.clientY + scrollY,
        scrollX: scrollX,
        scrollY: scrollY,
        width: e.width || 0,
        height: e.height || 0,
        pressure: e.pressure || 0,
        tiltX: e.tiltX || 0,
        tiltY: e.tiltY || 0,
        twist: e.twist || 0,
        button: e.button,
        buttons: e.buttons,
        normalizedClientX: e.clientX / width,
        normalizedClientY: e.clientY / height,
        elementId: detectElementEnhanced(e.clientX, e.clientY, e.target),
        targetInfo: {
            tagName: targetElement.tagName?.toLowerCase(),
            id: targetElement.id || null,
            className: targetElement.className || null,
            ariaLabel: targetElement.getAttribute('aria-label') || null,
            eventName: eventName || targetElement.dataset?.eventName || null,
            elementWidth: targetRect.width,
            elementHeight: targetRect.height,
            elementArea: targetRect.width * targetRect.height,
            elementLeft: targetRect.left,
            elementTop: targetRect.top,
            elementCenterX: targetCenterX,
            elementCenterY: targetCenterY,
            normalizedElementCenterX: targetCenterX / width,
            normalizedElementCenterY: targetCenterY / height,
            normalizedElementWidth: targetRect.width / width,
            normalizedElementHeight: targetRect.height / height,
            offsetFromCenterX,
            offsetFromCenterY,
            distanceFromCenter,
            normalizedDistanceFromCenter,
            relativeOffsetX: targetRect.width > 0 ? (offsetFromCenterX / targetRect.width) * 2 : 0,
            relativeOffsetY: targetRect.height > 0 ? (offsetFromCenterY / targetRect.height) * 2 : 0,
            quadrant: getQuadrant(offsetFromCenterX, offsetFromCenterY),
            isVisible: targetRect.width > 0 && targetRect.height > 0,
            isInViewport: targetRect.top >= 0 &&
                targetRect.left >= 0 &&
                targetRect.bottom <= height &&
                targetRect.right <= width
        },
        deviceInfo: {
            userAgent: navigator.userAgent,
            platform: navigator.platform,
            screenWidth: window.screen.width,
            screenHeight: window.screen.height,
            devicePixelRatio: window.devicePixelRatio
        }
    };

    return data;
}

// ================= GESTIÓN DE GESTOS =================

function startGesture(gestureType, eventData) {
    const gestureId = generateGestureId();
    gestureState.currentGestureId = gestureId;
    gestureState.gestureType = gestureType;
    gestureState.startTime = eventData.timestamp;
    gestureState.eventsInGesture = [eventData];
    return gestureId;
}

function addEventToGesture(eventData) {
    if (gestureState.currentGestureId) {
        gestureState.eventsInGesture.push(eventData);
    }
}

function finalizeGesture(finalEventData = null, gestureSpecificData = {}) {
    if (!gestureState.currentGestureId) return null;

    const events = [...gestureState.eventsInGesture];
    if (finalEventData) events.push(finalEventData);

    if (events.length === 0) return null;

    const firstEvent = events[0];
    const lastEvent = events[events.length - 1];
    const duration = lastEvent.timestamp - firstEvent.timestamp;

    // Calcular trayectoria
    const trajectory = events.map(e => ({
        x: e.clientX,
        y: e.clientY,
        nx: e.normalizedClientX,
        ny: e.normalizedClientY,
        t: e.timestamp,
        pressure: e.pressure
    }));

    // Calcular distancia total (absoluta)
    let totalDistance = 0;
    for (let i = 1; i < trajectory.length; i++) {
        totalDistance += distance(
            trajectory[i - 1].x, trajectory[i - 1].y,
            trajectory[i].x, trajectory[i].y
        );
    }

    // Calcular distancia total normalizada
    let totalNormalizedDistance = 0;
    for (let i = 1; i < events.length; i++) {
        totalNormalizedDistance += normalizedDistance(events[i - 1], events[i]);
    }

    // Distancia directa (inicio a fin)
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
        const timeDelta = events[i + 1]?.timestamp - events[i]?.timestamp;
        if (timeDelta && timeDelta > 0) {
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

    // Calcular área de contacto promedio
    const widths = events.map(e => e.width).filter(w => w > 0);
    const heights = events.map(e => e.height).filter(h => h > 0);
    const avgWidth = widths.length > 0 ? widths.reduce((a, b) => a + b, 0) / widths.length : 0;
    const avgHeight = heights.length > 0 ? heights.reduce((a, b) => a + b, 0) / heights.length : 0;
    const maxWidth = widths.length > 0 ? Math.max(...widths) : 0;
    const maxHeight = heights.length > 0 ? Math.max(...heights) : 0;

    // Calcular jitter
    let jitter = 0;
    let normalizedJitter = 0;
    if (events.length > 1) {
        const positions = events.map(e => ({ x: e.clientX, y: e.clientY }));
        const avgX = positions.reduce((sum, p) => sum + p.x, 0) / positions.length;
        const avgY = positions.reduce((sum, p) => sum + p.y, 0) / positions.length;
        const deviations = positions.map(p => distance(p.x, p.y, avgX, avgY));
        jitter = deviations.reduce((a, b) => a + b, 0) / deviations.length;

        const normalizedPositions = events.map(e => ({ x: e.normalizedClientX, y: e.normalizedClientY }));
        const avgNX = normalizedPositions.reduce((sum, p) => sum + p.x, 0) / normalizedPositions.length;
        const avgNY = normalizedPositions.reduce((sum, p) => sum + p.y, 0) / normalizedPositions.length;
        const normalizedDeviations = normalizedPositions.map(p =>
            Math.sqrt((p.x - avgNX) ** 2 + (p.y - avgNY) ** 2)
        );
        normalizedJitter = normalizedDeviations.reduce((a, b) => a + b, 0) / normalizedDeviations.length;
    }

    const gesture = {
        // Identificación
        id: gestureCounter++,
        gestureId: gestureState.currentGestureId,
        gestureType: gestureState.gestureType,
        sceneId: sceneId,
        sessionId: getUser(),

        // Temporal
        startTime: firstEvent.timestamp,
        endTime: lastEvent.timestamp,
        duration,
        eventCount: events.length,

        // Eventos (resumen para el servidor)
        trajectory: trajectory,

        // Información del dispositivo
        deviceInfo: firstEvent.deviceInfo,

        // Métricas espaciales ABSOLUTAS
        startPosition: { x: firstEvent.clientX, y: firstEvent.clientY },
        endPosition: { x: lastEvent.clientX, y: lastEvent.clientY },
        displacement: { x: deltaX, y: deltaY },
        totalDistance,
        straightDistance,
        curvature: totalDistance > 0 ? straightDistance / totalDistance : 1,
        direction,
        jitter,

        // Métricas espaciales NORMALIZADAS
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
        elementId: firstEvent.elementId,
        eventName: firstEvent.eventName,
        pointerType: firstEvent.pointerType,
        targetInfo: firstEvent.targetInfo,

        // Datos específicos del gesto
        ...gestureSpecificData
    };

    // Resetear estado
    const preservedTapData = {
        lastTapTime: gestureState.lastTapTime,
        lastTapPosition: gestureState.lastTapPosition,
        lastTapData: gestureState.lastTapData,
        tapCount: gestureState.tapCount
    };

    gestureState = {
        currentGestureId: null,
        gestureType: null,
        startTime: null,
        startPositions: {},
        ...preservedTapData,
        eventsInGesture: [],
        pinchStartDistance: null,
        lockedDirection: null
    };

    // Registrar el gesto
    registerGesture(gesture);

    return gesture;
}

function registerGesture(gesture) {
    if (!trackingOn) return;

    console.log('Gesto detectado:', gesture.gestureType, gesture);
    gestureList.push(gesture);

    if (gestureList.length >= TOP_LIMIT) {
        var deliverPackage = gestureList;
        gestureList = [];
        deliverGestureData(deliverPackage);
    }
}

// ================= MANEJADORES DE EVENTOS POINTER =================

function handlePointerDown(e) {
    if (!trackingOn) return;

    const eventData = captureEventData(e, 'pointerdown');
    pointerCache.push({
        pointerId: e.pointerId,
        startX: e.clientX,
        startY: e.clientY,
        startTime: Date.now(),
        downEventData: eventData
    });

    // Guardar posición inicial
    gestureState.startPositions[e.pointerId] = {
        x: e.clientX,
        y: e.clientY,
        time: Date.now()
    };

    if (pointerCache.length === 2) {
        // Pinch gesture
        const p1 = pointerCache[0];
        const p2 = pointerCache[1];
        const initialDistance = distance(p1.startX, p1.startY, p2.startX, p2.startY);
        gestureState.pinchStartDistance = initialDistance;
        startGesture(GESTURE_PINCH, eventData);
    } else {
        startGesture('tap_potential', eventData);
    }
}

function handlePointerMove(e) {
    if (!trackingOn) return;

    const eventData = captureEventData(e, 'pointermove');
    const startPos = gestureState.startPositions[e.pointerId];
    if (!startPos) return;

    const dist = distance(startPos.x, startPos.y, e.clientX, e.clientY);

    // Si es un pinch, añadir al gesto existente
    if (gestureState.gestureType === GESTURE_PINCH) {
        addEventToGesture(eventData);
        return;
    }

    // Si es tap_potential y se mueve más de 10px, determinar el tipo de movimiento
    if (gestureState.gestureType === 'tap_potential' && dist > 10) {
        const dx = e.clientX - startPos.x;
        const dy = e.clientY - startPos.y;
        const velocity = calculateVelocity(dist, Date.now() - startPos.time);

        // Detectar dirección dominante (direction lock)
        if (!gestureState.lockedDirection) {
            gestureState.lockedDirection = Math.abs(dx) > Math.abs(dy) ? 'horizontal' : 'vertical';
        }

        // Swipe: velocidad > 0.5 px/ms
        // Drag: horizontal y velocidad < 0.5 px/ms
        // Scroll: vertical
        gestureState.gestureType =
            gestureState.lockedDirection === 'horizontal'
                ? velocity >= 0.5 ? GESTURE_SWIPE : GESTURE_DRAG
                : GESTURE_SCROLL;

        addEventToGesture(eventData);
        return;
    }

    // Si ya es un gesto de movimiento, añadir eventos
    if (gestureState.currentGestureId) {
        addEventToGesture(eventData);
    }
}

function handlePointerUp(e) {
    if (!trackingOn) return;

    const eventData = captureEventData(e, 'pointerup');
    const pointerInfo = pointerCache.find(p => p.pointerId === e.pointerId);
    if (!pointerInfo) return;

    const duration = Date.now() - pointerInfo.startTime;
    const dist = distance(pointerInfo.startX, pointerInfo.startY, e.clientX, e.clientY);

    // Finalizar gesto existente (scroll, drag, swipe, pinch)
    if (gestureState.currentGestureId && gestureState.gestureType !== 'tap_potential') {
        let gestureSpecificData = {};

        // Métricas específicas de pinch
        if (gestureState.gestureType === GESTURE_PINCH && pointerCache.length === 2) {
            const p1 = pointerCache[0];
            const p2 = pointerCache[1];
            const p1Current = gestureState.startPositions[p1.pointerId];
            const p2Current = gestureState.startPositions[p2.pointerId];

            if (p1Current && p2Current) {
                const finalDistance = distance(p1Current.x, p1Current.y, p2Current.x, p2Current.y);
                const initialDistance = gestureState.pinchStartDistance || finalDistance;
                const scaleFactor = initialDistance > 0 ? finalDistance / initialDistance : 1;

                gestureSpecificData = {
                    pinchInitialDistance: initialDistance,
                    pinchFinalDistance: finalDistance,
                    pinchScaleFactor: scaleFactor,
                    pinchType: scaleFactor > 1 ? 'zoom_in' : 'zoom_out'
                };
            }
        }

        // Métricas específicas de swipe
        if (gestureState.gestureType === GESTURE_SWIPE) {
            const events = gestureState.eventsInGesture;
            if (events.length > 0) {
                const lastEvents = events.slice(-5);
                let finalVelocity = 0;
                if (lastEvents.length >= 2) {
                    const lastE = lastEvents[lastEvents.length - 1];
                    const prevE = lastEvents[lastEvents.length - 2];
                    const d = distance(prevE.clientX, prevE.clientY, lastE.clientX, lastE.clientY);
                    const t = lastE.timestamp - prevE.timestamp;
                    finalVelocity = calculateVelocity(d, t);
                }
                gestureSpecificData = {
                    swipeFinalVelocity: finalVelocity,
                    swipeDirection: gestureState.lockedDirection === 'horizontal'
                        ? (e.clientX - pointerInfo.startX > 0 ? 'right' : 'left')
                        : (e.clientY - pointerInfo.startY > 0 ? 'down' : 'up')
                };
            }
        }

        // Métricas específicas de scroll
        if (gestureState.gestureType === GESTURE_SCROLL) {
            gestureSpecificData = {
                scrollDeltaY: e.clientY - pointerInfo.startY,
                scrollDeltaX: e.clientX - pointerInfo.startX,
                scrollDirection: e.clientY - pointerInfo.startY > 0 ? 'down' : 'up'
            };
        }

        // Métricas específicas de drag
        if (gestureState.gestureType === GESTURE_DRAG) {
            gestureSpecificData = {
                dragDeltaX: e.clientX - pointerInfo.startX,
                dragDeltaY: e.clientY - pointerInfo.startY,
                dragDirection: e.clientX - pointerInfo.startX > 0 ? 'right' : 'left'
            };
        }

        finalizeGesture(eventData, gestureSpecificData);
    }
    // Si es tap_potential, determinar qué tipo de tap fue
    else if (gestureState.gestureType === 'tap_potential') {
        const now = Date.now();
        const timeSinceLastTap = now - gestureState.lastTapTime;
        const lastPos = gestureState.lastTapPosition;

        const isNearLastTap = lastPos ?
            distance(lastPos.x, lastPos.y, e.clientX, e.clientY) < 30 : false;

        addEventToGesture(eventData);

        // Long tap: duración > 500ms
        if (duration > 500) {
            gestureState.gestureType = GESTURE_LONG_TAP;
            finalizeGesture(null, {
                longTapDuration: duration,
                longTapPressure: eventData.pressure
            });
            gestureState.tapCount = 0;
            gestureState.lastTapData = null;
        }
        // Double tap: dos taps rápidos (< 300ms)
        else if (timeSinceLastTap < 300 && isNearLastTap && gestureState.lastTapData) {
            gestureState.tapCount++;
            if (gestureState.tapCount === 2) {
                const firstTapData = gestureState.lastTapData;

                gestureState.gestureType = GESTURE_DOUBLE_TAP;
                finalizeGesture(null, {
                    doubleTapInterval: timeSinceLastTap,
                    firstTapDuration: firstTapData.duration,
                    secondTapDuration: duration,
                    firstTapPressure: firstTapData.averagePressure || 0,
                    secondTapPressure: eventData.pressure,
                    tapDistance: distance(
                        firstTapData.startPosition.x,
                        firstTapData.startPosition.y,
                        e.clientX,
                        e.clientY
                    )
                });
                gestureState.tapCount = 0;
                gestureState.lastTapData = null;
            }
        }
        // Single tap
        else {
            gestureState.tapCount = 1;
            gestureState.lastTapTime = now;
            gestureState.lastTapPosition = { x: e.clientX, y: e.clientY };

            gestureState.gestureType = GESTURE_TAP;
            const firstTapGesture = finalizeGesture(null, {
                tapDuration: duration,
                tapPressure: eventData.pressure,
                tapJitter: dist
            });

            gestureState.lastTapData = firstTapGesture;

            // Esperar para confirmar que no es doble tap
            setTimeout(() => {
                if (gestureState.tapCount === 1 && gestureState.lastTapData) {
                    // El tap ya fue registrado, limpiar estado
                    gestureState.tapCount = 0;
                    gestureState.lastTapData = null;
                }
            }, 310);
        }
    }

    // Limpiar cache
    pointerCache = pointerCache.filter(p => p.pointerId !== e.pointerId);
    delete gestureState.startPositions[e.pointerId];
}

function handlePointerCancel(e) {
    if (!trackingOn) return;

    const eventData = captureEventData(e, 'pointercancel');
    if (gestureState.currentGestureId) {
        finalizeGesture(eventData, { cancelled: true });
    }
    pointerCache = pointerCache.filter(p => p.pointerId !== e.pointerId);
    delete gestureState.startPositions[e.pointerId];
}

// ================= INICIALIZACIÓN Y TRACKING =================

function initializeGlobalListeners() {
    // Pointer events para detección de gestos
    document.addEventListener('pointerdown', handlePointerDown, { passive: false });
    document.addEventListener('pointermove', handlePointerMove, { passive: false });
    document.addEventListener('pointerup', handlePointerUp, { passive: false });
    document.addEventListener('pointercancel', handlePointerCancel, { passive: false });

    // Prevenir comportamiento por defecto en touch para mejor detección
    document.addEventListener('touchstart', (e) => {
        // No prevenir por defecto para permitir scroll nativo en algunos casos
    }, { passive: true });

    // Keyboard events
    document.addEventListener('keydown', function (event) {
        trackKeyboardEvent(EVENT_KEY_DOWN, event);
    });

    document.addEventListener('keyup', function (event) {
        trackKeyboardEvent(EVENT_KEY_UP, event);
    });
}

function trackKeyboardEvent(eventType, event) {
    if (!trackingOn) return;

    const gesture = {
        id: gestureCounter++,
        gestureId: generateGestureId(),
        gestureType: eventType === EVENT_KEY_DOWN ? 'key_down' : 'key_up',
        sceneId: sceneId,
        sessionId: getUser(),
        startTime: Date.now(),
        endTime: Date.now(),
        duration: 0,
        eventCount: 1,
        keyValue: event.key,
        keyCode: event.keyCode,
        elementId: detectElementByName(event.target.id),
        deviceInfo: {
            userAgent: navigator.userAgent,
            platform: navigator.platform,
            screenWidth: window.screen.width,
            screenHeight: window.screen.height,
            devicePixelRatio: window.devicePixelRatio
        }
    };

    registerGesture(gesture);
}

function trackFocusEvent(event) {
    if (!trackingOn) return;
    trackInteractionEvent(EVENT_FOCUS, event);
}

function trackBlurEvent(event) {
    if (!trackingOn) return;
    trackInteractionEvent(EVENT_BLUR, event);
}

function trackOnChangeSelectionEvent(event) {
    if (!trackingOn) return;
    trackInteractionEvent('selection_change', event);
}

function trackInteractionEvent(eventType, event) {
    const gesture = {
        id: gestureCounter++,
        gestureId: generateGestureId(),
        gestureType: eventType === EVENT_FOCUS ? 'focus' : eventType === EVENT_BLUR ? 'blur' : 'selection_change',
        sceneId: sceneId,
        sessionId: getUser(),
        startTime: Date.now(),
        endTime: Date.now(),
        duration: 0,
        eventCount: 1,
        elementId: detectElementByName(event.target.id),
        deviceInfo: {
            userAgent: navigator.userAgent,
            platform: navigator.platform,
            screenWidth: window.screen.width,
            screenHeight: window.screen.height,
            devicePixelRatio: window.devicePixelRatio
        }
    };

    registerGesture(gesture);
}

function initTracking(_sceneId) {
    if (activeScene === _sceneId) return;
    activeScene = _sceneId;
    trackingOn = true;
    getExperimentStatus();
    sceneId = _sceneId;
    console.log("Initializing gesture tracking for scene " + _sceneId);

    if (!listenersInitialized) {
        initializeGlobalListeners();
        listenersInitialized = true;
    }

    // Registrar evento de inicio
    const initGesture = {
        id: gestureCounter++,
        gestureId: generateGestureId(),
        gestureType: 'tracking_init',
        sceneId: sceneId,
        sessionId: getUser(),
        startTime: Date.now(),
        endTime: Date.now(),
        duration: 0,
        eventCount: 1,
        deviceInfo: {
            userAgent: navigator.userAgent,
            platform: navigator.platform,
            screenWidth: window.screen.width,
            screenHeight: window.screen.height,
            devicePixelRatio: window.devicePixelRatio
        }
    };
    registerGesture(initGesture);
}

function finishTracking(_newPage) {
    activeScene = null;

    // Registrar evento de fin
    const endGesture = {
        id: gestureCounter++,
        gestureId: generateGestureId(),
        gestureType: 'tracking_end',
        sceneId: sceneId,
        sessionId: getUser(),
        startTime: Date.now(),
        endTime: Date.now(),
        duration: 0,
        eventCount: 1,
        deviceInfo: {
            userAgent: navigator.userAgent,
            platform: navigator.platform,
            screenWidth: window.screen.width,
            screenHeight: window.screen.height,
            devicePixelRatio: window.devicePixelRatio
        }
    };
    registerGesture(endGesture);

    trackingOn = false;

    // Tomar snapshot
    takeSnapshot(sceneId);

    deliverGestureData(gestureList);
    gestureList = [];
    newPage = _newPage;
    checkReadyToLeave();
}

function finishSubsceneTracking() {
    const endGesture = {
        id: gestureCounter++,
        gestureId: generateGestureId(),
        gestureType: 'tracking_end',
        sceneId: sceneId,
        sessionId: getUser(),
        startTime: Date.now(),
        endTime: Date.now(),
        duration: 0,
        eventCount: 1
    };
    registerGesture(endGesture);

    trackingOn = false;
    takeSnapshot(sceneId);
}

// ================= ENVÍO DE DATOS =================

function deliverGestureData(list) {
    if (!list.length) return;
    var i = 0;
    var chunk = [];
    var chunkCounter = 0;

    list.forEach(function (item) {
        chunk[i] = item;
        i++;
        if (i >= TOP_LIMIT) {
            i = 0;
            deliverGestureChunk(chunk);
            chunkCounter++;
            chunk = [];
        }
    });

    if (chunk.length > 0) {
        deliverGestureChunk(chunk);
        chunkCounter++;
    }
}

function deliverGestureChunk(chunk) {
    var parametros = {
        "timezone": (new Date()).getTimezoneOffset() / 60 * (-1),
        "version": VERSION,
        "list": chunk,
        "idExperiment": idExperiment,
        "sessionId": getUser()
    };

    console.log("Delivering chunk of " + chunk.length + " gestures");

    if (emittingData) {
        $.ajax({
            data: JSON.stringify(parametros),
            url: url, // Usa la misma URL que scriptTest por compatibilidad
            type: 'post',
            contentType: 'application/json',
            beforeSend: function () {
                pendingRequest++;
                sentRequest++;
            },
            success: function (response) {
                console.log('Gestures delivered successfully');
            },
            complete: function (jqXHR, textStatus) {
                pendingRequest--;
                if (pendingRequest == 0) {
                    eventsDelivered = true;
                }
                checkReadyToLeave();
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                console.error("Error delivering gestures:", textStatus, errorThrown);
            }
        });
    }
}

// ================= FUNCIONES DE EXPERIMENTO =================

function startExperiment() {
    var user = createUser();
    console.log("Creating user session " + user);
}

function finishExperiment() {
    finishedExperiment = true;
}

function takeSnapshot(sceneId) {
    html2canvas(document.body).then(canvas => {
        console.log("Delivering background for scene " + sceneId);
        deliverSnapshot(sceneId, canvas);
    });
}

function deliverSnapshot(sceneId, canvas) {
    var parametros = {
        "timezone": (new Date()).getTimezoneOffset() / 60 * (-1),
        "experiment": idExperiment,
        "sceneId": sceneId,
        "canvas": canvas.toDataURL("image/png"),
        "timeStamp": Date.now(),
        "sessionId": getUser()
    };

    if (emittingData) {
        $.ajax({
            data: JSON.stringify(parametros),
            url: urlBackgroundTracker,
            type: 'post',
            contentType: 'application/json',
            beforeSend: function () {
                pendingBackgroundsDelivered++;
            },
            success: function (response) {
                pendingBackgroundsDelivered--;
                backgroundsDelivered++;
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                console.error("Error delivering snapshot:", textStatus);
            }
        });
    }
}

function registerUserData() {
    var parametros = {
        "timezone": (new Date()).getTimezoneOffset() / 60 * (-1),
        "timeOpened": new Date(),
        "pageon": window.location.pathname,
        "referrer": document.referrer,
        "previousSites": history.length,
        "browserName": navigator.appName,
        "browserEngine": navigator.product,
        "browserVersion1a": navigator.appVersion,
        "browserVersion1b": navigator.userAgent,
        "browserLanguage": navigator.language,
        "browserOnline": navigator.onLine,
        "browserPlatform": navigator.platform,
        "javaEnabled": navigator.javaEnabled(),
        "dataCookiesEnabled": navigator.cookieEnabled,
        "dataCookies1": document.cookie,
        "dataCookies2": decodeURIComponent(document.cookie.split(";")),
        "sizeScreenW": screen.width,
        "sizeScreenH": screen.height,
        "sizeDocW": document.body.clientWidth,
        "sizeDocH": document.body.clientHeight,
        "sizeInW": innerWidth,
        "sizeInH": innerHeight,
        "sizeAvailW": screen.availWidth,
        "sizeAvailH": screen.availHeight,
        "scrColorDepth": screen.colorDepth,
        "scrPixelDepth": screen.pixelDepth,
        "idExperiment": idExperiment,
        "sessionId": getUser()
    };

    if (emittingData) {
        $.ajax({
            data: JSON.stringify(parametros),
            url: urlRegisterUserData,
            type: 'post',
            contentType: 'application/json',
            success: function (response) {
                console.log("User data registered");
            },
            async: false
        });
    }
    registerid(getUser());
}

function registerComponent(sceneId, componentId, x, y, xF, yF, typeId, componentAssociated) {
    registerElement(componentId, x, y, xF, yF, typeId, sceneId);
    var parametros = {
        "timezone": (new Date()).getTimezoneOffset() / 60 * (-1),
        "sceneId": sceneId,
        "componentId": componentId,
        "x": Math.round(x),
        "y": Math.round(y),
        "xF": Math.round(xF),
        "yF": Math.round(yF),
        "timeStamp": Date.now(),
        "idExperiment": idExperiment,
        "typeId": typeId,
        "componentAssociated": componentAssociated,
        "sessionId": getUser()
    };

    if (emittingData) {
        $.ajax({
            data: JSON.stringify(parametros),
            url: urlRegisterComponent,
            type: 'post',
            contentType: 'application/json',
            success: function (response) {
                console.log("Component registered: " + componentId + "(" + x + ", " + y + "), type " + typeId + " in scene " + sceneId);
            }
        });
    }
}

function checkReadyToLeave() {
    if (eventsDelivered == false || pendingRequest > 0) {
        // Events still pending
    } else {
        if (pendingBackgroundsDelivered > 0) {
            setTimeout(() => {
                checkReadyToLeave();
            }, 2000);
            return;
        }

        if (finishedExperiment) {
            if (typeof window !== "undefined" && typeof localStorage !== "undefined") {
                localStorage.removeItem("user");
            }
        }
        if (newPage != null) {
            window.location.href = newPage;
        }
    }
}

function getExperimentStatus() {
    $.ajax({
        url: urlExperimentStatus,
        type: 'get',
        success: function (response) {
            if (response === 'OPEN') {
                emittingData = true;
            } else {
                emittingData = false;
            }
        },
        error: function () { }
    });
}

// ================= DATOS DEMOGRÁFICOS =================

function postNumberDD(id, value) {
    var parametros = {
        "timezone": (new Date()).getTimezoneOffset() / 60 * (-1),
        "id": id,
        "numberValue": value,
        "idExperiment": idExperiment,
        "sessionId": getUser()
    };
    postAJAXDemographicData(parametros);
}

function postStringDD(id, value) {
    var parametros = {
        "timezone": (new Date()).getTimezoneOffset() / 60 * (-1),
        "id": id,
        "stringValue": value,
        "idExperiment": idExperiment,
        "sessionId": getUser()
    };
    postAJAXDemographicData(parametros);
}

function postDateDD(id, value) {
    var parametros = {
        "timezone": (new Date()).getTimezoneOffset() / 60 * (-1),
        "id": id,
        "dateValue": value,
        "idExperiment": idExperiment,
        "sessionId": getUser()
    };
    postAJAXDemographicData(parametros);
}

function postAJAXDemographicData(parametros) {
    if (emittingData) {
        $.ajax({
            data: JSON.stringify(parametros),
            url: urlDemographicData,
            type: 'post',
            contentType: 'application/json',
            success: function (response) { },
            error: function () { }
        });
    }
}

function registerid(value) {
    console.log("Registering id: ", value);
    postNumberDD(158, value);
}

// ================= EXPORTACIONES =================
export {
    startExperiment,
    finishExperiment,
    initTracking,
    finishTracking,
    finishSubsceneTracking,
    registerUserData,
    registerComponent,
    registerid,
    postNumberDD,
    postStringDD,
    postDateDD,
    getCurrentSceneId,
    getUser,
    idExperiment,
    // Constantes de tipos de componentes
    COMPONENT_TEXT_FIELD,
    COMPONENT_COMBOBOX,
    COMPONENT_OPTION,
    COMPONENT_RADIO_BUTTON,
    COMPONENT_CHECK_BOX,
    COMPONENT_BUTTON,
    COMPONENT_CARD,
    COMPONENT_RATE,
    COMPONENT_IMAGE,
    COMPONENT_STEPPER,
    COMPONENT_CAROUSEL,
    COMPONENT_LINK,
    COMPONENT_BANNER,
    // Tipos de gestos
    GESTURE_TAP,
    GESTURE_DOUBLE_TAP,
    GESTURE_LONG_TAP,
    GESTURE_SCROLL,
    GESTURE_DRAG,
    GESTURE_SWIPE,
    GESTURE_PINCH
};
