// manualScrollEngine.js

// Motor de scroll manual basado en Pointer Events
// Usa transforms en el contenido interno en vez del scroll nativo.

const DEFAULT_OPTIONS = {
  axis: "y",             // "y" o "x"
  scrollFactor: 1,       // sensibilidad
  minOffset: -Infinity,  // límite mínimo (en px)
  maxOffset: Infinity,   // límite máximo (en px)
  stopPropagation: false, // detener propagación de eventos (para scrolls anidados)
  onPointerEvent: null,  // callback para notificar eventos de pointer (para tracking)
  friction: 0.97,        // Factor de fricción (0.9-0.98)
  velocityThreshold: 0.1, // Velocidad mínima para detener la inercia
  rubberBanding: true,        // Activar/desactivar efecto elástico
  rubberBandingStrength: 3,   // Factor de resistencia (2-5 recomendado)
  snapBackSpeed: 0.15
};

export class ManualScrollEngine {
  /**
   * @param {HTMLElement} container  Elemento que recibe los pointer events.
   * @param {HTMLElement} content    Elemento que se desplaza dentro del contenedor.
   * @param {Partial<typeof DEFAULT_OPTIONS>} options
   */
  constructor(container, content, options = {}) {
    this.container = container;
    this.content = content;
    this.options = { ...DEFAULT_OPTIONS, ...options };

    this.isDragging = false;
    this.lastPointerPos = { x: 0, y: 0 };
    this.currentOffset = { x: 0, y: 0 };

    this.velocity = { x: 0, y: 0 };
    this.lastMoveTime = 0;
    this.momentumRAF = null;

    // Control de múltiples toques (para detectar pinch)
    this.activePointers = new Set();
    this.isPaused = false;

    // Control de bloqueo de dirección de scroll
    this.lockedAxis = null; // 'x' o 'y' una vez detectada la dirección dominante
    this.scrollThreshold = 5; // píxeles mínimos para determinar dirección

    this._pointerDown = this._pointerDown.bind(this);
    this._pointerMove = this._pointerMove.bind(this);
    this._pointerUp = this._pointerUp.bind(this);
    this._pointerCancel = this._pointerCancel.bind(this);

    this._init();
  }

  _init() {
    if (!this.container || !this.content) return;

    // Cancelamos comportamiento táctil nativo (scroll, zoom) sobre el contenedor. [web:4][web:23]
    this.container.style.touchAction =
      this.options.axis === "y" ? "pan-x" :
        this.options.axis === "x" ? "pan-y" : "none";

    this.container.addEventListener("pointerdown", this._pointerDown);
    this.container.addEventListener("pointermove", this._pointerMove);
    this.container.addEventListener("pointerup", this._pointerUp);
    this.container.addEventListener("pointercancel", this._pointerCancel);
    this.container.addEventListener("pointerleave", this._pointerUp);
  }

  destroy() {
    if (!this.container) return;

    // Cancelar animación de inercia si existe
    if (this.momentumRAF) {
      cancelAnimationFrame(this.momentumRAF);
      this.momentumRAF = null;
    }

    this.container.removeEventListener("pointerdown", this._pointerDown);
    this.container.removeEventListener("pointermove", this._pointerMove);
    this.container.removeEventListener("pointerup", this._pointerUp);
    this.container.removeEventListener("pointercancel", this._pointerCancel);
    this.container.removeEventListener("pointerleave", this._pointerUp);
  }

  _pointerDown(e) {
    // Registrar pointer activo
    this.activePointers.add(e.pointerId);

    // Si hay múltiples toques (pinch), pausar el scroll
    if (this.activePointers.size > 1) {
      this.isPaused = true;
      this.isDragging = false;
      return; // No procesar el evento cuando hay pinch
    }

    // Si está pausado manualmente, no procesar
    if (this.isPaused) {
      return;
    }

    // Notificar evento para tracking antes de stopPropagation
    if (this.options.onPointerEvent) {
      this.options.onPointerEvent('pointerdown', e);
    }
    // Detener propagación si está configurado (para scrolls anidados)
    if (this.options.stopPropagation) {
      e.stopPropagation();
    }

    // Detener inercia si está activa
    if (this.momentumRAF) {
      cancelAnimationFrame(this.momentumRAF);
      this.momentumRAF = null;
    }
    this.velocity = { x: 0, y: 0 };

    // Resetear bloqueo de dirección
    this.lockedAxis = null;

    // Capturamos el puntero para seguir recibiendo eventos aunque salga del elemento. [web:20]
    if (this.container.setPointerCapture) {
      this.container.setPointerCapture(e.pointerId);
    }
    this.isDragging = true;
    this.lastPointerPos = { x: e.clientX, y: e.clientY };
  }

  _pointerMove(e) {
    // Ignorar si está pausado o hay múltiples toques
    if (this.isPaused || this.activePointers.size > 1) return;
    if (!this.isDragging) return;

    // Notificar evento para tracking antes de stopPropagation
    if (this.options.onPointerEvent) {
      this.options.onPointerEvent('pointermove', e);
    }
    // Detener propagación si está configurado (para scrolls anidados)
    if (this.options.stopPropagation) {
      e.stopPropagation();
    }

    // NO generamos pointermove manualmente: dejamos que el sistema nativo dispare el evento
    // y tus listeners globales de tracking lo capturarán.

    const now = performance.now();
    const dt = now - this.lastMoveTime || 16;

    const dx = e.clientX - this.lastPointerPos.x;
    const dy = e.clientY - this.lastPointerPos.y;

    // Detectar y bloquear dirección de scroll si aún no está bloqueada
    if (!this.lockedAxis && (this.options.axis === "both" || !this.options.axis)) {
      const absDx = Math.abs(dx);
      const absDy = Math.abs(dy);

      // Si el movimiento supera el umbral, determinar la dirección dominante
      if (absDx > this.scrollThreshold || absDy > this.scrollThreshold) {
        this.lockedAxis = absDx > absDy ? 'x' : 'y';
      }
    }

    // Calcular velocidad (normalizada a 60fps)
    this.velocity.x = (dx / dt) * 16;
    this.velocity.y = (dy / dt) * 16;

    this.lastPointerPos = { x: e.clientX, y: e.clientY };
    this.lastMoveTime = now;

    const factor = this.options.scrollFactor;

    // Determinar qué ejes están permitidos basándose en la configuración y el bloqueo
    const allowY = (this.options.axis === "y" || this.options.axis === "both") &&
      (!this.lockedAxis || this.lockedAxis === 'y');
    const allowX = (this.options.axis === "x" || this.options.axis === "both") &&
      (!this.lockedAxis || this.lockedAxis === 'x');

    if (allowY) {
      let nextY = this.currentOffset.y + dy * factor; // invertimos sentido para que arrastrar hacia arriba suba contenido
      // Aplicar rubber banding si está habilitado
      if (this.options.rubberBanding) {
        if (nextY < this.options.minOffset) {
          const overflow = this.options.minOffset - nextY;
          nextY = this.options.minOffset - Math.sqrt(overflow) * this.options.rubberBandingStrength;
        } else if (nextY > this.options.maxOffset) {
          const overflow = nextY - this.options.maxOffset;
          nextY = this.options.maxOffset + Math.sqrt(overflow) * this.options.rubberBandingStrength;
        }
      } else {
        // Sin rubber banding: límite estricto
        nextY = Math.max(this.options.minOffset, Math.min(this.options.maxOffset, nextY));
      }
      this.currentOffset.y = nextY;
    }

    if (allowX) {
      let nextX = this.currentOffset.x + dx * factor;
      // Aplicar rubber banding si está habilitado
      if (this.options.rubberBanding) {
        if (nextX < this.options.minOffset) {
          const overflow = this.options.minOffset - nextX;
          nextX = this.options.minOffset - Math.sqrt(overflow) * this.options.rubberBandingStrength;
        } else if (nextX > this.options.maxOffset) {
          const overflow = nextX - this.options.maxOffset;
          nextX = this.options.maxOffset + Math.sqrt(overflow) * this.options.rubberBandingStrength;
        }
      } else {
        // Sin rubber banding
        nextX = Math.max(this.options.minOffset, Math.min(this.options.maxOffset, nextX));
      }
      this.currentOffset.x = nextX;
    }

    this._applyTransform();
  }

  _pointerUp(e) {
    // Eliminar pointer de la lista de activos
    this.activePointers.delete(e.pointerId);

    // Si volvemos a tener 0 o 1 toques, reactivar el scroll
    if (this.activePointers.size <= 1) {
      this.isPaused = false;
    }

    // Si está pausado, no procesar el resto
    if (this.isPaused) {
      return;
    }

    // Notificar evento para tracking
    if (this.options.onPointerEvent) {
      this.options.onPointerEvent('pointerup', e);
    }
    if (this.options.stopPropagation) {
      e.stopPropagation();
    }
    this.isDragging = false;

    // Resetear bloqueo de dirección
    this.lockedAxis = null;

    if (this.container.releasePointerCapture) {
      try {
        this.container.releasePointerCapture(e.pointerId);
      } catch (_) { }
    }
    // Aquí podrías añadir inercia si lo necesitas (requestAnimationFrame con velocidad). [web:22][web:26]
    this._startMomentum();
  }

  _pointerCancel(e) {
    // Notificar evento para tracking
    if (this.options.onPointerEvent) {
      this.options.onPointerEvent('pointercancel', e);
    }
    if (this.options.stopPropagation) {
      e.stopPropagation();
    }
    this._pointerUp(e);
  }

  _startMomentum() {
    const friction = this.options.friction;
    const threshold = this.options.velocityThreshold;
    const snapBackSpeed = this.options.snapBackSpeed;

    const animate = () => {
      let isSnapping = false;

      // Aplicar fricción
      this.velocity.x *= friction;
      this.velocity.y *= friction;

      // Actualizar posición con la velocidad
      if (this.options.axis === "y" || this.options.axis === "both") {
        if (this.options.rubberBanding &&
          (this.currentOffset.y < this.options.minOffset ||
            this.currentOffset.y > this.options.maxOffset)) {

          // Calcular objetivo (el límite más cercano)
          const target = this.currentOffset.y < this.options.minOffset
            ? this.options.minOffset
            : this.options.maxOffset;

          // Retorno elástico suave
          this.currentOffset.y += (target - this.currentOffset.y) * snapBackSpeed;
          this.velocity.y = 0;
          isSnapping = true;

          // Detener cuando está suficientemente cerca
          if (Math.abs(this.currentOffset.y - target) < 0.5) {
            this.currentOffset.y = target;
            isSnapping = false;
          }
        } else {
          // Inercia normal
          this.velocity.y *= friction;
          let nextY = this.currentOffset.y + this.velocity.y;
          nextY = Math.max(this.options.minOffset, Math.min(this.options.maxOffset, nextY));
          this.currentOffset.y = nextY;

          // Detener velocidad si choca con límite
          if (nextY === this.options.minOffset || nextY === this.options.maxOffset) {
            this.velocity.y = 0;
          }
        }
      }

      if (this.options.axis === "x" || this.options.axis === "both") {
        if (this.options.rubberBanding &&
          (this.currentOffset.x < this.options.minOffset ||
            this.currentOffset.x > this.options.maxOffset)) {

          const target = this.currentOffset.x < this.options.minOffset
            ? this.options.minOffset
            : this.options.maxOffset;

          this.currentOffset.x += (target - this.currentOffset.x) * snapBackSpeed;
          this.velocity.x = 0;
          isSnapping = true;

          if (Math.abs(this.currentOffset.x - target) < 0.5) {
            this.currentOffset.x = target;
            isSnapping = false;
          }
        } else {
          this.velocity.x *= friction;
          let nextX = this.currentOffset.x + this.velocity.x;
          nextX = Math.max(this.options.minOffset, Math.min(this.options.maxOffset, nextX));
          this.currentOffset.x = nextX;

          if (nextX === this.options.minOffset || nextX === this.options.maxOffset) {
            this.velocity.x = 0;
          }
        }
      }

      this._applyTransform();

      // Continuar si hay velocidad suficiente
      if (Math.abs(this.velocity.x) > threshold || Math.abs(this.velocity.y) > threshold) {
        this.momentumRAF = requestAnimationFrame(animate);
      } else {
        this.velocity = { x: 0, y: 0 };
        this.momentumRAF = null;
      }
    };

    // Iniciar animación si hay velocidad O si está fuera de límites (rubber banding)
    const needsAnimation = Math.abs(this.velocity.x) > threshold ||
      Math.abs(this.velocity.y) > threshold ||
      (this.options.rubberBanding &&
        (this.currentOffset.y < this.options.minOffset ||
          this.currentOffset.y > this.options.maxOffset ||
          this.currentOffset.x < this.options.minOffset ||
          this.currentOffset.x > this.options.maxOffset));

    if (needsAnimation) {
      this.momentumRAF = requestAnimationFrame(animate);
    }
  }

  _applyTransform() {
    const x = this.options.axis === "y" ? 0 : this.currentOffset.x;
    const y = this.options.axis === "x" ? 0 : this.currentOffset.y;
    this.content.style.transform = `translate(${x}px, ${y}px)`;
    this.content.style.willChange = "transform";
  }

  /**
   * Pausar manualmente el scroll (útil para deshabilitar temporalmente)
   */
  pause() {
    this.isPaused = true;
    this.isDragging = false;
    if (this.momentumRAF) {
      cancelAnimationFrame(this.momentumRAF);
      this.momentumRAF = null;
    }
  }

  /**
   * Reanudar el scroll después de una pausa manual
   */
  resume() {
    // Solo reanudar si no hay múltiples toques activos
    if (this.activePointers.size <= 1) {
      this.isPaused = false;
    }
  }

  // Al final de la clase ManualScrollEngine, añade:

  /**
   * Obtener el offset actual del scroll manual
   * @returns {{x: number, y: number}}
   */
  getScrollOffset() {
    return {
      x: -this.currentOffset.x,  // Negativo porque el offset va en sentido contrario al scroll
      y: -this.currentOffset.y
    };
  }
}
