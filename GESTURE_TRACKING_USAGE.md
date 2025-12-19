# Guía de Uso: Integración de Tracking de Gestos

## Resumen de la Integración

Se ha integrado exitosamente el sistema de detección de gestos táctiles (`GestureDetectorHook.js`) con el sistema de tracking de experimentos (`scriptTest.js`). Ahora el sistema captura y envía al servidor:

- **7 tipos de gestos**: tap, double-tap, long-tap, swipe, drag, scroll, pinch
- **Métricas avanzadas**: velocidad, aceleración, presión, curvatura de trayectoria
- **Coordenadas normalizadas**: comparables entre diferentes dispositivos
- **Información de precisión**: distancia del toque al centro del elemento

## Cambios Implementados

### 1. scriptTest.js

✅ **Nuevas constantes de eventos** (líneas 23-29):
```javascript
const EVENT_GESTURE_TAP = 30;
const EVENT_GESTURE_DOUBLE_TAP = 31;
const EVENT_GESTURE_LONG_TAP = 32;
const EVENT_GESTURE_SWIPE = 33;
const EVENT_GESTURE_DRAG = 34;
const EVENT_GESTURE_SCROLL = 35;
const EVENT_GESTURE_PINCH = 36;
```

✅ **Función `sampleTrajectory()`**: Muestrea trayectorias a máximo 10 puntos para reducir volumen de datos

✅ **Función `trackGestureEvent(gesture)`**: Convierte gestos detectados al formato del sistema de tracking

✅ **Capacidades táctiles en `registerUserData()`**:
```javascript
"touchSupport": 'ontouchstart' in window,
"pointerSupport": 'PointerEvent' in window,
"maxTouchPoints": navigator.maxTouchPoints || 0
```

✅ **Exposición global**: `window.trackGestureEvent` disponible para componentes React

### 2. GestureDetectorHook.js

✅ **Callback `onGestureDetected`**: El hook ahora acepta una función callback que se ejecuta al finalizar cada gesto

## Cómo Usar en Componentes React

### Ejemplo Básico

```javascript
import React from 'react';
import useGestureDetector from '@/metrics/GestureDetectorHook';

function MyComponent() {
  // Callback que se ejecuta cuando se detecta un gesto
  const handleGestureDetected = (gesture) => {
    console.log('Gesto detectado:', gesture.gestureType);
    
    // Enviar al sistema de tracking (si está cargado scriptTest.js)
    if (window.trackGestureEvent) {
      window.trackGestureEvent(gesture);
    }
  };

  // Inicializar el detector con el callback
  const gestureDetector = useGestureDetector(handleGestureDetected);

  return (
    <div
      onPointerDown={gestureDetector.handlePointerDown}
      onPointerMove={gestureDetector.handlePointerMove}
      onPointerUp={gestureDetector.handlePointerUp}
      onPointerCancel={gestureDetector.handlePointerCancel}
      style={{ touchAction: 'none' }} // Importante para evitar gestos del navegador
    >
      <h1>Contenido con tracking de gestos</h1>
      <p>Toca, arrastra, pellizca aquí...</p>
    </div>
  );
}

export default MyComponent;
```

### Ejemplo Avanzado con Data Attributes

Para identificar mejor los elementos tocados, usa `data-event-name`:

```javascript
function ProductCard({ product }) {
  const gestureDetector = useGestureDetector(window.trackGestureEvent);

  return (
    <div
      data-event-name={`product-${product.id}`}
      onPointerDown={gestureDetector.handlePointerDown}
      onPointerMove={gestureDetector.handlePointerMove}
      onPointerUp={gestureDetector.handlePointerUp}
      onPointerCancel={gestureDetector.handlePointerCancel}
      style={{ touchAction: 'none' }}
    >
      <img src={product.image} alt={product.name} />
      <h3>{product.name}</h3>
      
      <button 
        data-event-name={`add-to-cart-${product.id}`}
        style={{ touchAction: 'none' }}
      >
        Añadir al carrito
      </button>
    </div>
  );
}
```

### Aplicar a Toda la Aplicación

Para capturar gestos en toda la app, aplícalo en el componente raíz:

```javascript
// pages/_app.js
import { useEffect } from 'react';
import useGestureDetector from '@/metrics/GestureDetectorHook';

function MyApp({ Component, pageProps }) {
  const gestureDetector = useGestureDetector(window.trackGestureEvent);

  useEffect(() => {
    // Aplicar listeners al document
    document.addEventListener('pointerdown', gestureDetector.handlePointerDown);
    document.addEventListener('pointermove', gestureDetector.handlePointerMove);
    document.addEventListener('pointerup', gestureDetector.handlePointerUp);
    document.addEventListener('pointercancel', gestureDetector.handlePointerCancel);

    return () => {
      document.removeEventListener('pointerdown', gestureDetector.handlePointerDown);
      document.removeEventListener('pointermove', gestureDetector.handlePointerMove);
      document.removeEventListener('pointerup', gestureDetector.handlePointerUp);
      document.removeEventListener('pointercancel', gestureDetector.handlePointerCancel);
    };
  }, [gestureDetector]);

  return <Component {...pageProps} />;
}

export default MyApp;
```

## Estructura de Datos Enviados

Cada gesto capturado genera un objeto con esta estructura:

```javascript
{
  id: 123,                          // ID único del evento
  sceneId: 1,                       // ID de la escena actual
  eventType: 30,                    // 30-36 según tipo de gesto
  timeStamp: 1671456789012,         // Timestamp del fin del gesto
  x: 250,                           // Posición X final (píxeles)
  y: 400,                           // Posición Y final (píxeles)
  keyValueEvent: -1,
  keyCodeEvent: -1,
  elementId: "product-123",         // ID del elemento tocado
  
  gestureData: {
    gestureId: "gesture_1671456789012_0.123",
    gestureType: "swipe",           // tap, double_tap, long_tap, swipe, drag, scroll, pinch
    duration: 450,                  // Duración en milisegundos
    eventCount: 25,                 // Número de eventos del gesto
    
    // Posiciones absolutas (píxeles)
    startX: 100,
    startY: 200,
    endX: 250,
    endY: 400,
    
    // Posiciones normalizadas (0-1, comparables entre dispositivos)
    normalizedStartX: 0.125,
    normalizedStartY: 0.25,
    normalizedEndX: 0.3125,
    normalizedEndY: 0.5,
    
    // Métricas de velocidad (píxeles/ms)
    averageVelocity: 0.8,
    maxVelocity: 1.5,
    minVelocity: 0.2,
    averageAcceleration: 0.05,
    
    // Métricas de presión (0-1)
    averagePressure: 0.45,
    maxPressure: 0.67,
    minPressure: 0.23,
    
    // Métricas de contacto (píxeles)
    averageContactWidth: 15.5,
    averageContactHeight: 18.2,
    maxContactWidth: 22,
    maxContactHeight: 25,
    
    // Métricas espaciales normalizadas
    totalDistance: 0.28,            // Distancia total recorrida (0-1)
    straightDistance: 0.25,         // Distancia en línea recta (0-1)
    curvature: 0.89,                // Curvatura (1 = línea recta)
    direction: "down-right",        // up, down, left, right
    jitter: 0.012,                  // Variación en la posición
    
    pointerType: "touch",           // touch, pen, mouse
    
    // Trayectoria muestreada (máx 10 puntos)
    trajectorySample: [
      { x: 0.125, y: 0.25, t: 1671456789012 },
      { x: 0.145, y: 0.28, t: 1671456789030 },
      { x: 0.165, y: 0.31, t: 1671456789048 },
      // ... hasta 10 puntos
    ],
    
    // Información del elemento tocado
    targetInfo: {
      tagName: "button",
      id: "add-to-cart-123",
      className: "btn btn-primary",
      ariaLabel: "Añadir al carrito",
      eventName: "add-to-cart-123",
      elementWidth: 120,
      elementHeight: 40,
      distanceFromCenter: 8.5,      // Distancia del toque al centro (píxeles)
      normalizedDistanceFromCenter: 0.12,  // Normalizada (0-1)
      quadrant: "top-right"         // Cuadrante del toque
    },
    
    // Datos específicos de pinch (solo para gestos pinch)
    pinchInitialDistance: 150,
    pinchFinalDistance: 300,
    pinchScaleFactor: 2.0,
    pinchType: "zoom_in",           // zoom_in o zoom_out
    
    // Datos específicos de double tap
    doubleTapInterval: 250,
    doubleTapDistance: 5.2,
    
    // Datos específicos de long tap
    longTapDuration: 650,
    longTapPressure: 0.55
  }
}
```

## Tipos de Gestos Detectados

### 1. **Tap** (`EVENT_GESTURE_TAP = 30`)
- Toque rápido sin movimiento significativo
- Duración < 500ms, movimiento < 10px

### 2. **Double Tap** (`EVENT_GESTURE_DOUBLE_TAP = 31`)
- Dos taps consecutivos
- Intervalo < 300ms, distancia < 30px

### 3. **Long Tap** (`EVENT_GESTURE_LONG_TAP = 32`)
- Toque prolongado sin movimiento
- Duración > 500ms

### 4. **Swipe** (`EVENT_GESTURE_SWIPE = 33`)
- Movimiento horizontal rápido
- Velocidad ≥ 0.5 px/ms, dirección horizontal

### 5. **Drag** (`EVENT_GESTURE_DRAG = 34`)
- Movimiento horizontal lento
- Velocidad < 0.5 px/ms, dirección horizontal

### 6. **Scroll** (`EVENT_GESTURE_SCROLL = 35`)
- Movimiento vertical (cualquier velocidad)
- Dirección vertical dominante

### 7. **Pinch** (`EVENT_GESTURE_PINCH = 36`)
- Gesto con dos dedos simultáneos
- Incluye scale factor y tipo (zoom in/out)

## Ventajas de las Coordenadas Normalizadas

Las coordenadas normalizadas (0-1) permiten:

✅ **Comparar gestos entre dispositivos**: Un swipe de 0.3 normalizado es equivalente en un móvil (375px) y tablet (1024px)

✅ **Análisis de patrones**: Identificar si usuarios tocan consistentemente en el centro (0.5, 0.5) o esquinas

✅ **Machine Learning**: Entrenar modelos con datos comparables de múltiples dispositivos

## Integración con Tracking Existente

El sistema envía los datos al mismo endpoint que los eventos tradicionales:

**Endpoint**: `https://interactionlab.hci.uniovi.es:8443/TrackerServer/restws/track`

**Payload**:
```json
{
  "timezone": -5,
  "list": [
    {
      "id": 123,
      "sceneId": 1,
      "eventType": 30,
      "timeStamp": 1671456789012,
      "x": 250,
      "y": 400,
      "gestureData": { /* ... */ }
    }
  ],
  "idExperiment": 32,
  "sessionId": "ABC123456789012..."
}
```

## Consideraciones Importantes

### ⚠️ Backend
El servidor debe actualizarse para:
- Aceptar el campo `gestureData` en los eventos
- Manejar los nuevos códigos de evento (30-36)
- Almacenar las métricas adicionales en la BD

### ⚠️ CSS
Añadir `touchAction: 'none'` para prevenir gestos del navegador:
```jsx
<div style={{ touchAction: 'none' }}>
```

### ⚠️ Volumen de Datos
- Solo se envían **gestos finalizados**, no eventos raw
- Trayectorias limitadas a **máximo 10 puntos**
- Envío en lotes de **500 eventos** (igual que antes)

## Testing

Para probar que funciona:

1. Abre las DevTools del navegador
2. Activa el modo responsive/touch
3. Realiza gestos (tap, swipe, pinch)
4. Verifica en consola: "Gesto detectado: tap"
5. Verifica en Network: POST a `/TrackerServer/restws/track`

## Próximos Pasos Recomendados

1. ✅ **Actualizar el backend** para aceptar `gestureData`
2. ✅ **Aplicar el hook en componentes clave** (HomeComponent, ProductCard, etc.)
3. ✅ **Validar en dispositivos táctiles reales** (no solo simulador)
4. ✅ **Crear visualizaciones** de heatmaps de gestos
5. ✅ **Análisis de datos** para identificar patrones de uso

## Soporte

Para dudas o problemas, revisar:
- [GestureDetectorHook.js](src/metrics/GestureDetectorHook.js) - Lógica de detección
- [scriptTest.js](src/metrics/scriptTest.js) - Sistema de tracking
- Esta guía de uso
