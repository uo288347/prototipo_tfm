import React, { useState, useRef, useEffect } from 'react';
import { Download, Activity, Trash2, Hand } from 'lucide-react';

const GestureDetector = () => {
  const [rawEvents, setRawEvents] = useState([]);
  const [gestures, setGestures] = useState([]);
  const [isRecording, setIsRecording] = useState(true);
  const targetRef = useRef(null);
  
  // Cache para detección de gestos
  const pointerCache = useRef([]);
  const gestureState = useRef({
    currentGestureId: null,
    gestureType: null,
    startTime: null,
    startPositions: {},
    lastTapTime: 0,
    lastTapPosition: null,
    lastTapData: null, // Para guardar info del primer tap en double tap
    tapCount: 0,
    eventsInGesture: [],
    pinchStartDistance: null // Para calcular zoom en pinch
  });

  // Generar ID único para cada gesto
  const generateGestureId = () => `gesture_${Date.now()}_${Math.random()}`;

  // Capturar datos básicos del evento
  const captureEventData = (e, eventType, eventName = null) => {
    return {
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
      buttons: e.buttons
    };
  };

  // Calcular distancia entre dos puntos
  const distance = (x1, y1, x2, y2) => {
    return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
  };

  // Calcular velocidad
  const calculateVelocity = (dist, time) => {
    return time > 0 ? dist / time : 0;
  };

  // Iniciar un nuevo gesto
  const startGesture = (gestureType, eventData) => {
    const gestureId = generateGestureId();
    gestureState.current.currentGestureId = gestureId;
    gestureState.current.gestureType = gestureType;
    gestureState.current.startTime = eventData.timestamp;
    gestureState.current.eventsInGesture = [eventData];
    
    return gestureId;
  };

  // Añadir evento al gesto actual
  const addEventToGesture = (eventData) => {
    if (gestureState.current.currentGestureId) {
      gestureState.current.eventsInGesture.push(eventData);
    }
  };

  // Finalizar gesto y calcular métricas
  const finalizeGesture = (finalEventData = null, gestureSpecificData = {}) => {
    if (!gestureState.current.currentGestureId) return null;

    const events = [...gestureState.current.eventsInGesture];
    if (finalEventData) events.push(finalEventData);

    const firstEvent = events[0];
    const lastEvent = events[events.length - 1];
    const duration = lastEvent.timestamp - firstEvent.timestamp;

    // Calcular trayectoria
    const trajectory = events.map(e => ({ x: e.clientX, y: e.clientY, t: e.timestamp }));
    
    // Calcular distancia total
    let totalDistance = 0;
    for (let i = 1; i < trajectory.length; i++) {
      totalDistance += distance(
        trajectory[i-1].x, trajectory[i-1].y,
        trajectory[i].x, trajectory[i].y
      );
    }

    // Distancia directa (inicio a fin)
    const straightDistance = distance(
      firstEvent.clientX, firstEvent.clientY,
      lastEvent.clientX, lastEvent.clientY
    );

    // Calcular velocidades
    const velocities = [];
    for (let i = 1; i < events.length; i++) {
      const dist = distance(
        events[i-1].clientX, events[i-1].clientY,
        events[i].clientX, events[i].clientY
      );
      const time = events[i].timestamp - events[i-1].timestamp;
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
    let jitter = 0;
    if (events.length > 1) {
      const positions = events.map(e => ({ x: e.clientX, y: e.clientY }));
      const avgX = positions.reduce((sum, p) => sum + p.x, 0) / positions.length;
      const avgY = positions.reduce((sum, p) => sum + p.y, 0) / positions.length;
      const deviations = positions.map(p => distance(p.x, p.y, avgX, avgY));
      jitter = deviations.reduce((a, b) => a + b, 0) / deviations.length;
    }

    const gesture = {
      gestureId: gestureState.current.currentGestureId,
      gestureType: gestureState.current.gestureType,
      startTime: firstEvent.timestamp,
      endTime: lastEvent.timestamp,
      duration,
      eventCount: events.length,
      events: events,
      
      // Métricas espaciales
      startPosition: { x: firstEvent.clientX, y: firstEvent.clientY },
      endPosition: { x: lastEvent.clientX, y: lastEvent.clientY },
      displacement: { x: deltaX, y: deltaY },
      totalDistance,
      straightDistance,
      curvature: totalDistance > 0 ? straightDistance / totalDistance : 1,
      direction,
      jitter, // Estabilidad del gesto
      
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
    if (!isRecording) return;
    
    const eventData = captureEventData(e, 'pointerdown');
    setRawEvents(prev => [...prev, eventData]);
    
    pointerCache.current.push({
      pointerId: e.pointerId,
      startX: e.clientX,
      startY: e.clientY,
      startTime: Date.now(),
      downEventData: eventData // Guardar el evento down
    });

    // Guardar posición inicial
    gestureState.current.startPositions[e.pointerId] = {
      x: e.clientX,
      y: e.clientY,
      time: Date.now()
    };

    // Si hay múltiples pointers, es un pinch
    if (pointerCache.current.length === 2) {
      const p1 = pointerCache.current[0];
      const p2 = pointerCache.current[1];
      const initialDistance = distance(p1.startX, p1.startY, p2.startX, p2.startY);
      gestureState.current.pinchStartDistance = initialDistance;
      startGesture('pinch', eventData);
    } else {
      // Iniciar un gesto de tap potencial
      startGesture('tap_potential', eventData);
    }
  };

  const handlePointerMove = (e) => {
    if (!isRecording) return;
    
    const eventData = captureEventData(e, 'pointermove');
    setRawEvents(prev => [...prev, eventData]);

    const startPos = gestureState.current.startPositions[e.pointerId];
    if (!startPos) return;

    const dist = distance(startPos.x, startPos.y, e.clientX, e.clientY);

    // Si es un pinch o tap_potential, añadir al gesto existente
    if (gestureState.current.gestureType === 'pinch' || gestureState.current.gestureType === 'tap_potential') {
      addEventToGesture(eventData);
      
      // Si se mueve más de 10px, cambiar de tap_potential a scroll/swipe
      if (gestureState.current.gestureType === 'tap_potential' && dist > 10) {
        const timeSinceStart = Date.now() - startPos.time;
        const velocity = calculateVelocity(dist, timeSinceStart);
        
        // Cambiar el tipo de gesto
        const gestureType = velocity > 0.5 ? 'swipe' : 'scroll';
        gestureState.current.gestureType = gestureType;
      }
      return;
    }

    // Detectar si es scroll o swipe
    if (dist > 10 && !gestureState.current.currentGestureId) {
      const timeSinceStart = Date.now() - startPos.time;
      const velocity = calculateVelocity(dist, timeSinceStart);
      
      // Swipe: movimiento rápido (>0.5 px/ms)
      // Scroll: movimiento más lento
      const gestureType = velocity > 0.5 ? 'swipe' : 'scroll';
      startGesture(gestureType, eventData);
    } else if (gestureState.current.currentGestureId) {
      addEventToGesture(eventData);
    }
  };

  const handlePointerUp = (e) => {
    if (!isRecording) return;
    
    const eventData = captureEventData(e, 'pointerup');
    setRawEvents(prev => [...prev, eventData]);

    const pointerInfo = pointerCache.current.find(p => p.pointerId === e.pointerId);
    
    if (pointerInfo) {
      const duration = Date.now() - pointerInfo.startTime;
      const dist = distance(pointerInfo.startX, pointerInfo.startY, e.clientX, e.clientY);

      // Finalizar gesto existente (scroll, swipe, pinch)
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
          setGestures(prev => [...prev, gesture]);
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
          if (gesture) setGestures(prev => [...prev, gesture]);
          gestureState.current.tapCount = 0;
          gestureState.current.lastTapData = null;
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
            if (gesture) setGestures(prev => [...prev, gesture]);
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
              setGestures(prev => [...prev, tapGesture]);
              gestureState.current.tapCount = 0;
              gestureState.current.lastTapData = null;
            }
          }, 310);
        }
      }
    }

    // Limpiar cache
    pointerCache.current = pointerCache.current.filter(p => p.pointerId !== e.pointerId);
    delete gestureState.current.startPositions[e.pointerId];
  };

  const handlePointerCancel = (e) => {
    if (!isRecording) return;
    
    const eventData = captureEventData(e, 'pointercancel');
    setRawEvents(prev => [...prev, eventData]);

    if (gestureState.current.currentGestureId) {
      const gesture = finalizeGesture(eventData);
      if (gesture) {
        gesture.cancelled = true;
        setGestures(prev => [...prev, gesture]);
      }
    }

    pointerCache.current = pointerCache.current.filter(p => p.pointerId !== e.pointerId);
    delete gestureState.current.startPositions[e.pointerId];
  };

  const downloadGestures = () => {
    const data = {
      metadata: {
        recordingDate: new Date().toISOString(),
        totalGestures: gestures.length,
        totalRawEvents: rawEvents.length,
        gestureTypes: [...new Set(gestures.map(g => g.gestureType))]
      },
      gestures: gestures,
      rawEvents: rawEvents
    };
    
    const dataStr = JSON.stringify(data, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `gestures_data_${Date.now()}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const clearData = () => {
    setRawEvents([]);
    setGestures([]);
    pointerCache.current = [];
    gestureState.current = {
      currentGestureId: null,
      gestureType: null,
      startTime: null,
      startPositions: {},
      lastTapTime: 0,
      lastTapPosition: null,
      lastTapData: null,
      tapCount: 0,
      eventsInGesture: [],
      pinchStartDistance: null
    };
  };

  const gestureColors = {
    tap: 'bg-blue-100 border-blue-300 text-blue-900',
    double_tap: 'bg-purple-100 border-purple-300 text-purple-900',
    long_tap: 'bg-orange-100 border-orange-300 text-orange-900',
    scroll: 'bg-green-100 border-green-300 text-green-900',
    swipe: 'bg-red-100 border-red-300 text-red-900',
    pinch: 'bg-pink-100 border-pink-300 text-pink-900'
  };

  const gestureIcons = {
    tap: '👆',
    double_tap: '👆👆',
    long_tap: '👇',
    scroll: '📜',
    swipe: '👉',
    pinch: '🤏'
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-xl p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Hand className="text-purple-600" size={32} />
              <h1 className="text-3xl font-bold text-gray-800">
                Detector de Gestos Biométricos
              </h1>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setIsRecording(!isRecording)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  isRecording
                    ? 'bg-red-500 hover:bg-red-600 text-white'
                    : 'bg-green-500 hover:bg-green-600 text-white'
                }`}
              >
                {isRecording ? 'Detener' : 'Iniciar'} Grabación
              </button>
              <button
                onClick={downloadGestures}
                disabled={gestures.length === 0}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                <Download size={20} />
                Descargar JSON
              </button>
              <button
                onClick={clearData}
                className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                <Trash2 size={20} />
                Limpiar
              </button>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-semibold text-blue-900 mb-1">Gestos Detectados</h3>
              <p className="text-3xl font-bold text-blue-700">{gestures.length}</p>
            </div>
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h3 className="font-semibold text-green-900 mb-1">Eventos Raw</h3>
              <p className="text-3xl font-bold text-green-700">{rawEvents.length}</p>
            </div>
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <h3 className="font-semibold text-purple-900 mb-1">Estado</h3>
              <p className="text-lg font-bold text-purple-700">
                {isRecording ? '🔴 Grabando' : '⏸️ Pausado'}
              </p>
            </div>
          </div>

          <div
            ref={targetRef}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerCancel}
            className="bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg p-8 border-4 border-dashed border-blue-400 touch-none"
            style={{ touchAction: 'none', minHeight: '400px' }}
          >
            <div className="text-center mb-8">
              <p className="text-xl font-semibold text-gray-700 mb-2">
                Área de Interacción
              </p>
              <p className="text-gray-600 mb-4">
                Prueba todos los gestos aquí
              </p>
              <div className="flex flex-wrap justify-center gap-2 text-sm">
                <span className="px-3 py-1 bg-white rounded-full">👆 Tap</span>
                <span className="px-3 py-1 bg-white rounded-full">👆👆 Doble Tap</span>
                <span className="px-3 py-1 bg-white rounded-full">👇 Tap Largo</span>
                <span className="px-3 py-1 bg-white rounded-full">📜 Scroll</span>
                <span className="px-3 py-1 bg-white rounded-full">👉 Swipe</span>
                <span className="px-3 py-1 bg-white rounded-full">🤏 Pinch</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button
                data-event-name="boton-comprar"
                className="bg-green-500 text-white px-6 py-4 rounded-lg font-semibold hover:bg-green-600 active:scale-95 transition-transform"
              >
                🛒 Comprar
              </button>

              <button
                data-event-name="boton-favorito"
                className="bg-red-500 text-white px-6 py-4 rounded-lg font-semibold hover:bg-red-600 active:scale-95 transition-transform"
              >
                ❤️ Favorito
              </button>

              <div
                data-event-name="tarjeta-producto"
                className="col-span-2 bg-white p-6 rounded-lg shadow-md"
              >
                <div className="text-center">
                  <div className="text-6xl mb-3">📱</div>
                  <p className="font-bold text-xl">Producto Demo</p>
                  <p className="text-gray-500">$599.99</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-xl p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Activity size={24} />
              Gestos Recientes
            </h2>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {gestures.slice().reverse().slice(0, 10).map((gesture, idx) => (
                <div
                  key={idx}
                  className={`p-3 rounded-lg border-2 ${gestureColors[gesture.gestureType]}`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-lg">
                      {gestureIcons[gesture.gestureType]} {gesture.gestureType.replace('_', ' ').toUpperCase()}
                    </span>
                    <span className="text-xs opacity-75">
                      {gesture.duration}ms
                    </span>
                  </div>
                  {gesture.eventName && (
                    <div className="text-xs font-semibold mb-1">
                      🏷️ {gesture.eventName}
                    </div>
                  )}
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>Eventos: {gesture.eventCount}</div>
                    <div>Distancia: {gesture.totalDistance.toFixed(1)}px</div>
                    {gesture.direction && <div>Dirección: {gesture.direction}</div>}
                    {gesture.averageVelocity > 0 && (
                      <div>Vel: {gesture.averageVelocity.toFixed(2)} px/ms</div>
                    )}
                    {gesture.doubleTapInterval !== undefined && (
                      <div className="col-span-2 font-semibold text-purple-700">
                        Intervalo: {gesture.doubleTapInterval}ms
                      </div>
                    )}
                    {gesture.longTapDuration !== undefined && (
                      <div className="col-span-2 font-semibold text-orange-700">
                        Duración: {gesture.longTapDuration}ms
                      </div>
                    )}
                    {gesture.pinchScaleFactor !== undefined && (
                      <div className="col-span-2 font-semibold text-pink-700">
                        Escala: {gesture.pinchScaleFactor.toFixed(2)}x ({gesture.pinchType})
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {gestures.length === 0 && (
                <p className="text-gray-500 text-center py-8">
                  No hay gestos detectados aún
                </p>
              )}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-xl p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Estructura de Datos del Gesto
            </h2>
            <div className="space-y-3 text-sm">
              <div className="bg-gray-50 rounded p-3">
                <h3 className="font-semibold mb-2">📊 Información General</h3>
                <ul className="space-y-1 ml-4 text-gray-700">
                  <li>• gestureId: Identificador único</li>
                  <li>• gestureType: tap, double_tap, long_tap, scroll, swipe, pinch</li>
                  <li>• duration: Duración total del gesto</li>
                  <li>• eventCount: Número de eventos incluidos</li>
                  <li>• events[]: Array con todos los eventos raw</li>
                </ul>
              </div>

              <div className="bg-gray-50 rounded p-3">
                <h3 className="font-semibold mb-2">📍 Métricas Espaciales</h3>
                <ul className="space-y-1 ml-4 text-gray-700">
                  <li>• startPosition / endPosition</li>
                  <li>• displacement: Desplazamiento x,y</li>
                  <li>• totalDistance: Distancia recorrida</li>
                  <li>• straightDistance: Distancia directa</li>
                  <li>• curvature: Ratio de curvatura</li>
                  <li>• direction: up, down, left, right</li>
                </ul>
              </div>

              <div className="bg-gray-50 rounded p-3">
                <h3 className="font-semibold mb-2">⚡ Métricas de Velocidad</h3>
                <ul className="space-y-1 ml-4 text-gray-700">
                  <li>• averageVelocity: Velocidad promedio</li>
                  <li>• maxVelocity: Velocidad máxima</li>
                  <li>• minVelocity: Velocidad mínima</li>
                  <li>• averageAcceleration: Aceleración promedio</li>
                </ul>
              </div>

              <div className="bg-gray-50 rounded p-3">
                <h3 className="font-semibold mb-2">🔍 Métricas de Contacto</h3>
                <ul className="space-y-1 ml-4 text-gray-700">
                  <li>• averagePressure / maxPressure / minPressure</li>
                  <li>• averageContactWidth / maxContactWidth</li>
                  <li>• averageContactHeight / maxContactHeight</li>
                  <li>• jitter: Variación de posición (estabilidad)</li>
                </ul>
              </div>

              <div className="bg-blue-50 rounded p-3 border border-blue-300">
                <h3 className="font-semibold mb-2 text-blue-900">👆 Métricas Específicas de TAP</h3>
                <ul className="space-y-1 ml-4 text-blue-800">
                  <li>• tapDuration: Duración del tap</li>
                  <li>• tapPressure: Presión aplicada</li>
                  <li>• tapJitter: Estabilidad del dedo</li>
                </ul>
              </div>

              <div className="bg-purple-50 rounded p-3 border border-purple-300">
                <h3 className="font-semibold mb-2 text-purple-900">👆👆 Métricas de DOUBLE TAP</h3>
                <ul className="space-y-1 ml-4 text-purple-800">
                  <li>• doubleTapInterval: Tiempo entre taps</li>
                  <li>• firstTapDuration / secondTapDuration</li>
                  <li>• firstTapPressure / secondTapPressure</li>
                  <li>• tapDistance: Distancia entre taps</li>
                </ul>
              </div>

              <div className="bg-orange-50 rounded p-3 border border-orange-300">
                <h3 className="font-semibold mb-2 text-orange-900">👇 Métricas de LONG TAP</h3>
                <ul className="space-y-1 ml-4 text-orange-800">
                  <li>• longTapDuration: Duración total</li>
                  <li>• longTapPressure: Presión mantenida</li>
                </ul>
              </div>

              <div className="bg-pink-50 rounded p-3 border border-pink-300">
                <h3 className="font-semibold mb-2 text-pink-900">🤏 Métricas de PINCH</h3>
                <ul className="space-y-1 ml-4 text-pink-800">
                  <li>• pinchInitialDistance: Distancia inicial</li>
                  <li>• pinchFinalDistance: Distancia final</li>
                  <li>• pinchScaleFactor: Factor de escala</li>
                  <li>• pinchType: zoom_in o zoom_out</li>
                </ul>
              </div>
            </div>

            <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded p-3">
              <p className="text-xs text-yellow-900">
                <strong>💡 Ventaja:</strong> Cada gesto agrupa automáticamente todos sus eventos relacionados, 
                facilitando el análisis de patrones biométricos únicos por tipo de interacción.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GestureDetector;