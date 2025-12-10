const BiometricDataCollector = () => {
  // Estructura de datos para cada tipo de evento
  const captureEventData = (e, eventType, customData = {}) => {
    const timestamp = Date.now();
    const baseData = {
      eventId: `${eventType}_${timestamp}_${Math.random()}`,
      timestamp,
      eventType,
      
      // Datos del pointer
      pointerId: e.pointerId,
      pointerType: e.pointerType, // mouse, pen, touch
      isPrimary: e.isPrimary,
      
      // Posición
      clientX: e.clientX,
      clientY: e.clientY,
      screenX: e.screenX,
      screenY: e.screenY,
      pageX: e.pageX,
      pageY: e.pageY,
      offsetX: e.offsetX,
      offsetY: e.offsetY,
      
      // Dimensiones del contacto (móviles)
      width: e.width || 0,
      height: e.height || 0,
      
      // Presión y ángulo
      pressure: e.pressure || 0,
      tangentialPressure: e.tangentialPressure || 0,
      tiltX: e.tiltX || 0,
      tiltY: e.tiltY || 0,
      twist: e.twist || 0,
      
      // Botones (para mouse)
      button: e.button,
      buttons: e.buttons,
      
      // Modificadores
      altKey: e.altKey,
      ctrlKey: e.ctrlKey,
      shiftKey: e.shiftKey,
      metaKey: e.metaKey,
      
      ...customData
    };

    return baseData;
  };

  // Calcular métricas derivadas
  const calculateDerivedMetrics = (currentEvent, previousEvent) => {
    if (!previousEvent) return {};

    const timeDelta = currentEvent.timestamp - previousEvent.timestamp;
    const distanceX = currentEvent.clientX - previousEvent.clientX;
    const distanceY = currentEvent.clientY - previousEvent.clientY;
    const distance = Math.sqrt(distanceX ** 2 + distanceY ** 2);
    
    return {
      timeDelta,
      distanceX,
      distanceY,
      distance,
      velocity: timeDelta > 0 ? distance / timeDelta : 0,
      velocityX: timeDelta > 0 ? distanceX / timeDelta : 0,
      velocityY: timeDelta > 0 ? distanceY / timeDelta : 0,
      acceleration: 0, // Se calcularía con 3 puntos
      angle: Math.atan2(distanceY, distanceX) * (180 / Math.PI),
      pressureChange: currentEvent.pressure - previousEvent.pressure
    };
  };

  const handlePointerDown = (e) => {
    if (!isRecording) return;
    
    const eventData = captureEventData(e, 'pointerdown', {
      description: 'Inicio de interacción'
    });
    
    lastPointerData.current[e.pointerId] = eventData;
    pointerCache.current.push({ pointerId: e.pointerId, startTime: Date.now() });
    
    setEvents(prev => [...prev, eventData]);
  };

  const handlePointerMove = (e) => {
    if (!isRecording) return;
    
    const previousEvent = lastPointerData.current[e.pointerId];
    const derivedMetrics = calculateDerivedMetrics(
      captureEventData(e, 'pointermove'),
      previousEvent
    );
    
    const eventData = captureEventData(e, 'pointermove', {
      description: 'Movimiento del pointer',
      ...derivedMetrics
    });
    
    lastPointerData.current[e.pointerId] = eventData;
    setEvents(prev => [...prev, eventData]);
  };

  const handlePointerUp = (e) => {
    if (!isRecording) return;
    
    const startData = pointerCache.current.find(p => p.pointerId === e.pointerId);
    const duration = startData ? Date.now() - startData.startTime : 0;
    
    const eventData = captureEventData(e, 'pointerup', {
      description: 'Fin de interacción',
      interactionDuration: duration
    });
    
    setEvents(prev => [...prev, eventData]);
    
    // Limpiar cache
    pointerCache.current = pointerCache.current.filter(p => p.pointerId !== e.pointerId);
    delete lastPointerData.current[e.pointerId];
  };

  const handlePointerCancel = (e) => {
    if (!isRecording) return;
    
    const eventData = captureEventData(e, 'pointercancel', {
      description: 'Interacción cancelada'
    });
    
    setEvents(prev => [...prev, eventData]);
    
    pointerCache.current = pointerCache.current.filter(p => p.pointerId !== e.pointerId);
    delete lastPointerData.current[e.pointerId];
  };
}