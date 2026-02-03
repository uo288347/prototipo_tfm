import { useRef } from "react";

export const LongPressWrapper = ({onLongPressHold=() => {}, onLongPressRelease=() => {}, onClick=() => {}, delay = 500, children }) => {
  const timerRef = useRef(null);
  const longPressTriggered = useRef(false);

  const start = () => {
    longPressTriggered.current = false;
    timerRef.current = setTimeout(() => {
      longPressTriggered.current = true;
      onLongPressHold?.(); 
    }, delay);
  };

  const clear = () => {
    clearTimeout(timerRef.current);
    if (longPressTriggered.current) {
      onLongPressRelease?.(); 
    }
  };

  return (
    <div
      onMouseDown={start}
      onTouchStart={start}
      onMouseUp={clear}
      onTouchEnd={clear}
      onMouseLeave={clear}
      onClick={(e) => {
        if (!longPressTriggered.current) {
          onClick?.();
        }
      }}
    >
      {children}
    </div>
  );
};


