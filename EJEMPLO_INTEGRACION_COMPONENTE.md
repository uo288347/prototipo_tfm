# Ejemplo de Integración en un Componente Existente

## Modificar ProductCard.js para Tracking de Gestos

Este ejemplo muestra cómo integrar el tracking de gestos en el componente ProductCard existente.

### Antes (Sin Tracking de Gestos)

```javascript
// src/components/homeComponent/ProductCard.js
import React from 'react';

export default function ProductCard({ product, onClick }) {
  return (
    <div 
      className="product-card"
      onClick={() => onClick(product)}
    >
      <img src={product.image} alt={product.name} />
      <h3>{product.name}</h3>
      <p>{product.price}€</p>
    </div>
  );
}
```

### Después (Con Tracking de Gestos)

```javascript
// src/components/homeComponent/ProductCard.js
import React from 'react';
import useGestureDetector from '@/metrics/GestureDetectorHook';

export default function ProductCard({ product, onClick }) {
  // Inicializar el detector de gestos con callback al sistema de tracking
  const gestureDetector = useGestureDetector((gesture) => {
    // Esta función se ejecuta automáticamente cuando se detecta un gesto
    if (window.trackGestureEvent) {
      window.trackGestureEvent(gesture);
    }
    
    // También puedes ejecutar lógica adicional según el tipo de gesto
    console.log(`Gesto ${gesture.gestureType} en producto ${product.id}`);
  });

  // Manejador de click tradicional (se mantiene para compatibilidad)
  const handleClick = () => {
    onClick(product);
  };

  return (
    <div 
      className="product-card"
      // Identificador único para rastrear este elemento específico
      data-event-name={`product-card-${product.id}`}
      
      // Prevenir gestos del navegador (zoom, scroll)
      style={{ touchAction: 'none' }}
      
      // Handlers de pointer events para detección de gestos
      onPointerDown={gestureDetector.handlePointerDown}
      onPointerMove={gestureDetector.handlePointerMove}
      onPointerUp={gestureDetector.handlePointerUp}
      onPointerCancel={gestureDetector.handlePointerCancel}
      
      // Click tradicional (se mantiene)
      onClick={handleClick}
    >
      <img 
        src={product.image} 
        alt={product.name}
        data-event-name={`product-image-${product.id}`}
      />
      <h3 data-event-name={`product-name-${product.id}`}>
        {product.name}
      </h3>
      <p data-event-name={`product-price-${product.id}`}>
        {product.price}€
      </p>
    </div>
  );
}
```

## Modificar HomeComponent.js para Tracking Global

Si prefieres capturar gestos en toda la vista Home:

```javascript
// src/components/homeComponent/HomeComponent.js
import React, { useEffect } from 'react';
import useGestureDetector from '@/metrics/GestureDetectorHook';
import ProductCard from './ProductCard';
import CategoryFilter from './CategoryFilter';

export default function HomeComponent({ products, categories }) {
  // Detector de gestos para toda la vista
  const gestureDetector = useGestureDetector((gesture) => {
    if (window.trackGestureEvent) {
      window.trackGestureEvent(gesture);
    }
  });

  return (
    <div 
      className="home-container"
      data-event-name="home-view"
      style={{ touchAction: 'none', minHeight: '100vh' }}
      onPointerDown={gestureDetector.handlePointerDown}
      onPointerMove={gestureDetector.handlePointerMove}
      onPointerUp={gestureDetector.handlePointerUp}
      onPointerCancel={gestureDetector.handlePointerCancel}
    >
      <CategoryFilter 
        categories={categories}
        data-event-name="category-filter"
      />
      
      <div 
        className="products-grid"
        data-event-name="products-grid"
      >
        {products.map(product => (
          <ProductCard 
            key={product.id} 
            product={product}
            onClick={handleProductClick}
          />
        ))}
      </div>
    </div>
  );
}
```

## Integración en _app.js (Nivel Aplicación)

Para capturar TODOS los gestos en toda la aplicación:

```javascript
// src/pages/_app.js
import { useEffect } from 'react';
import useGestureDetector from '@/metrics/GestureDetectorHook';
import '../styles/globals.css';

function MyApp({ Component, pageProps }) {
  // Detector de gestos a nivel global
  const gestureDetector = useGestureDetector((gesture) => {
    if (window.trackGestureEvent) {
      window.trackGestureEvent(gesture);
    }
  });

  useEffect(() => {
    // Verificar que el tracking esté inicializado
    if (typeof window !== 'undefined' && window.trackGestureEvent) {
      console.log('✅ Sistema de tracking de gestos inicializado');
    }

    // Agregar listeners al document para capturar todos los gestos
    const handlePointerDown = (e) => gestureDetector.handlePointerDown(e);
    const handlePointerMove = (e) => gestureDetector.handlePointerMove(e);
    const handlePointerUp = (e) => gestureDetector.handlePointerUp(e);
    const handlePointerCancel = (e) => gestureDetector.handlePointerCancel(e);

    document.addEventListener('pointerdown', handlePointerDown);
    document.addEventListener('pointermove', handlePointerMove);
    document.addEventListener('pointerup', handlePointerUp);
    document.addEventListener('pointercancel', handlePointerCancel);

    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
      document.removeEventListener('pointermove', handlePointerMove);
      document.removeEventListener('pointerup', handlePointerUp);
      document.removeEventListener('pointercancel', handlePointerCancel);
    };
  }, [gestureDetector]);

  return <Component {...pageProps} />;
}

export default MyApp;
```

## Cargar scriptTest.js en _document.js

Asegúrate de que scriptTest.js se carga antes:

```javascript
// src/pages/_document.js
import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="es">
      <Head>
        {/* jQuery necesario para scriptTest.js */}
        <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
        
        {/* html2canvas para capturas de pantalla */}
        <script src="https://html2canvas.hertzen.com/dist/html2canvas.min.js"></script>
        
        {/* Sistema de tracking */}
        <script src="/metrics/scriptTest.js"></script>
        
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Inicializar tracking cuando carga la página
              if (typeof startExperiment === 'function') {
                startExperiment();
              }
              if (typeof registerUserData === 'function') {
                registerUserData();
              }
            `,
          }}
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
```

## Iniciar/Finalizar Tracking por Página

```javascript
// src/pages/home.js
import { useEffect } from 'react';
import HomeComponent from '@/components/homeComponent/HomeComponent';

export default function HomePage({ products, categories }) {
  useEffect(() => {
    // Iniciar tracking para esta escena
    if (typeof initTracking === 'function') {
      initTracking(1); // sceneId = 1 para home
      console.log('📊 Tracking iniciado para Home (sceneId: 1)');
    }

    // Cleanup: finalizar tracking al salir de la página
    return () => {
      if (typeof finishSubsceneTracking === 'function') {
        finishSubsceneTracking();
        console.log('📊 Tracking finalizado para Home');
      }
    };
  }, []);

  return <HomeComponent products={products} categories={categories} />;
}
```

## Ejemplo Completo con Múltiples Escenas

```javascript
// src/pages/index.js - Página inicial (sceneId: 0)
export default function IndexPage() {
  useEffect(() => {
    if (typeof initTracking === 'function') {
      initTracking(0);
    }
    return () => {
      if (typeof finishTracking === 'function') {
        finishTracking('/home'); // Ir a home después
      }
    };
  }, []);
  // ...
}

// src/pages/home.js - Página home (sceneId: 1)
export default function HomePage() {
  useEffect(() => {
    if (typeof initTracking === 'function') {
      initTracking(1);
    }
    return () => {
      if (typeof finishSubsceneTracking === 'function') {
        finishSubsceneTracking();
      }
    };
  }, []);
  // ...
}

// src/pages/detailProduct/[id].js - Detalle producto (sceneId: 2)
export default function ProductDetailPage() {
  useEffect(() => {
    if (typeof initTracking === 'function') {
      initTracking(2);
    }
    return () => {
      if (typeof finishSubsceneTracking === 'function') {
        finishSubsceneTracking();
      }
    };
  }, []);
  // ...
}

// src/pages/shoppingCart.js - Carrito (sceneId: 3)
export default function ShoppingCartPage() {
  useEffect(() => {
    if (typeof initTracking === 'function') {
      initTracking(3);
    }
    return () => {
      if (typeof finishSubsceneTracking === 'function') {
        finishSubsceneTracking();
      }
    };
  }, []);
  // ...
}

// src/pages/checkout.js - Checkout (sceneId: 4)
export default function CheckoutPage() {
  useEffect(() => {
    if (typeof initTracking === 'function') {
      initTracking(4);
    }
    return () => {
      if (typeof finishSubsceneTracking === 'function') {
        finishSubsceneTracking();
      }
    };
  }, []);
  // ...
}

// src/pages/end.js - Fin experimento (sceneId: 5)
export default function EndPage() {
  useEffect(() => {
    if (typeof initTracking === 'function') {
      initTracking(5);
    }
    return () => {
      if (typeof finishTracking === 'function') {
        finishTracking(null); // null = no redirigir
      }
      if (typeof finishExperiment === 'function') {
        finishExperiment(); // Marca fin del experimento
      }
    };
  }, []);
  // ...
}
```

## Verificar que Funciona

### 1. Consola del Navegador
Deberías ver:
```
✅ Sistema de tracking de gestos inicializado
📊 Tracking iniciado para Home (sceneId: 1)
Gesto detectado: {gestureType: "tap", duration: 150, ...}
Gesto tap en producto 123
```

### 2. Network Tab
Verifica requests POST a:
```
https://interactionlab.hci.uniovi.es:8443/TrackerServer/restws/track
```

Payload debe incluir:
```json
{
  "list": [
    {
      "eventType": 30,
      "gestureData": {
        "gestureType": "tap",
        "duration": 150,
        ...
      }
    }
  ]
}
```

### 3. localStorage
Verifica que existe el usuario:
```javascript
localStorage.getItem("user") // "ABC123456789012..."
```

## Debugging

Si no funciona:

```javascript
// Verificar que scriptTest.js cargó
console.log(typeof trackGestureEvent); // "function"

// Verificar que tracking está activo
console.log(trackingOn); // true

// Verificar sceneId actual
console.log(sceneId); // 1, 2, 3, etc.

// Forzar envío de datos
if (list.length > 0) {
  deliverData(list);
  list = [];
}
```

## Resumen de Pasos

1. ✅ **Integración completada** en scriptTest.js y GestureDetectorHook.js
2. ⏳ **Siguiente**: Aplicar `useGestureDetector` en componentes clave
3. ⏳ **Siguiente**: Cargar scriptTest.js en _document.js
4. ⏳ **Siguiente**: Inicializar tracking en cada página con `initTracking(sceneId)`
5. ⏳ **Siguiente**: Probar en dispositivos táctiles reales
6. ⏳ **Siguiente**: Actualizar backend para aceptar `gestureData`

¡La integración del sistema de gestos está lista para usar! 🎉
