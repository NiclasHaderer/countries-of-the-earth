import { useEffect } from "react";

export function useGlobalEvent<T extends keyof WindowEventMap>(
  type: T,
  listener: (event: WindowEventMap[T]) => any,
  filter?: (event: WindowEventMap[T]) => boolean,
  options?: boolean | AddEventListenerOptions
) {
  useEffect(() => {
    const handler = (event: WindowEventMap[T]) => {
      if (!filter) return listener(event);
      if (filter(event)) {
        listener(event);
      }
    };

    window.addEventListener(type, handler, options);
    return () => window.removeEventListener(type, handler, options);
  }, [type, listener, filter, options]);
}
