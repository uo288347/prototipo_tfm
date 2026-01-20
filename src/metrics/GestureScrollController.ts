export type GestureSample = {
  x: number;
  y: number;
  t: number;
  pointerId: number;
  pressure: number;
  width: number;
  height: number;
  scrollY: number;
};

export class GestureScrollController {
  private el: HTMLElement;
  private lastY = 0;
  private offsetY = 0;
  private onSample?: (s: GestureSample) => void;

  constructor(el: HTMLElement, onSample?: (s: GestureSample) => void) {
    this.el = el;
    this.onSample = onSample;

    this.el.style.touchAction = "none";

    this.el.addEventListener("pointerdown", this.onDown);
    this.el.addEventListener("pointermove", this.onMove);
    this.el.addEventListener("pointerup", this.onUp);
    this.el.addEventListener("pointercancel", this.onCancel);
  }

  private onDown = (e: PointerEvent) => {
    this.lastY = e.clientY;
    this.el.setPointerCapture(e.pointerId);
  };

  private onMove = (e: PointerEvent) => {
    const dy = e.clientY - this.lastY;
    this.offsetY += dy;

    this.onSample?.({
      x: e.clientX,
      y: e.clientY,
      t: performance.now(),
      pointerId: e.pointerId,
      pressure: e.pressure,
      width: e.width,
      height: e.height,
      scrollY: this.offsetY
    });

    // Scroll visual (opcional, desacoplable)
    this.el.style.transform = `translateY(${-this.offsetY}px)`;

    this.lastY = e.clientY;
  };

  private onUp = (e: PointerEvent) => {
    this.el.releasePointerCapture(e.pointerId);
  };

  private onCancel = (e: PointerEvent) => {
    this.el.releasePointerCapture(e.pointerId);
  };

  destroy() {
    this.el.removeEventListener("pointerdown", this.onDown);
    this.el.removeEventListener("pointermove", this.onMove);
    this.el.removeEventListener("pointerup", this.onUp);
    this.el.removeEventListener("pointercancel", this.onCancel);
  }
}
