// manualScrollEngine.js

// Motor de scroll manual basado en Pointer Events
// Usa transforms en el contenido interno en vez del scroll nativo.

const DEFAULT_OPTIONS = {
  axis: "y",             // "y" o "x"
  scrollFactor: 1,       // sensibilidad
  minOffset: -Infinity,  // límite mínimo (en px)
  maxOffset: Infinity,   // límite máximo (en px)
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
    this.container.removeEventListener("pointerdown", this._pointerDown);
    this.container.removeEventListener("pointermove", this._pointerMove);
    this.container.removeEventListener("pointerup", this._pointerUp);
    this.container.removeEventListener("pointercancel", this._pointerCancel);
    this.container.removeEventListener("pointerleave", this._pointerUp);
  }

  _pointerDown(e) {
    // Capturamos el puntero para seguir recibiendo eventos aunque salga del elemento. [web:20]
    if (this.container.setPointerCapture) {
      this.container.setPointerCapture(e.pointerId);
    }
    this.isDragging = true;
    this.lastPointerPos = { x: e.clientX, y: e.clientY };
  }

  _pointerMove(e) {
    if (!this.isDragging) return;

    // NO generamos pointermove manualmente: dejamos que el sistema nativo dispare el evento
    // y tus listeners globales de tracking lo capturarán.

    const dx = e.clientX - this.lastPointerPos.x;
    const dy = e.clientY - this.lastPointerPos.y;

    this.lastPointerPos = { x: e.clientX, y: e.clientY };

    const factor = this.options.scrollFactor;

    if (this.options.axis === "y" || this.options.axis === "both") {
      let nextY = this.currentOffset.y + dy * factor; // invertimos sentido para que arrastrar hacia arriba suba contenido
      nextY = Math.max(this.options.minOffset, Math.min(this.options.maxOffset, nextY));
      this.currentOffset.y = nextY;
    }

    if (this.options.axis === "x" || this.options.axis === "both") {
      let nextX = this.currentOffset.x + dx * factor;
      nextX = Math.max(this.options.minOffset, Math.min(this.options.maxOffset, nextX));
      this.currentOffset.x = nextX;
    }

    this._applyTransform();
  }

  _pointerUp(e) {
    this.isDragging = false;
    if (this.container.releasePointerCapture) {
      try {
        this.container.releasePointerCapture(e.pointerId);
      } catch (_) {}
    }
    // Aquí podrías añadir inercia si lo necesitas (requestAnimationFrame con velocidad). [web:22][web:26]
  }

  _pointerCancel(e) {
    this._pointerUp(e);
  }

  _applyTransform() {
    const x = this.options.axis === "y" ? 0 : this.currentOffset.x;
    const y = this.options.axis === "x" ? 0 : this.currentOffset.y;
    this.content.style.transform = `translate(${x}px, ${y}px)`;
    this.content.style.willChange = "transform";
  }
}
