import { useEffect, useRef, useState } from "react";
import { AreaSize, DisplayPx } from "../../domains/unit";

export const useDomSize = <T extends Element>() => {
  const ref = useRef<T>(null);
  const [size, setSize] = useState<AreaSize<DisplayPx>>();
  useEffect(() => {
    if (ref.current) {
      const rect = ref.current.getBoundingClientRect();
      setSize({
        width: rect.width,
        height: rect.height,
      } as AreaSize<DisplayPx>);
    }
  }, [ref]);
  return { ref, size };
};
