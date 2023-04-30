import { useCallback, useEffect, useRef, useState } from "react";
import { AreaSize, DisplayPx } from "../../domains/unit";

export const useDomSize = <T extends Element>() => {
  const ref = useRef<T>(null);
  const [size, setSize] = useState<AreaSize<DisplayPx>>();
  const onResize = useCallback(() => {
    if (ref.current) {
      const rect = ref.current.getBoundingClientRect();
      setSize({
        width: rect.width,
        height: rect.height,
      } as AreaSize<DisplayPx>);
    }
  }, [ref]);
  useEffect(() => {
    if (!ref.current) return;
    const observer = new ResizeObserver(onResize);
    observer.observe(ref.current);
    return () => {
      observer.disconnect();
    };
  }, [onResize]);
  return { ref, size };
};
