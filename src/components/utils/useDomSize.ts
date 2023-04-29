import { useEffect, useRef, useState } from "react";
import { AreaSize, TlDisplayPx } from "../../domains/unit";

export const useDomSize = <T extends Element>() => {
  const ref = useRef<T>(null);
  const [size, setSize] = useState<AreaSize<TlDisplayPx>>({
    width: 0,
    height: 0,
  } as AreaSize<TlDisplayPx>);
  useEffect(() => {
    if (ref.current) {
      const rect = ref.current.getBoundingClientRect();
      setSize({
        width: rect.width,
        height: rect.height,
      } as AreaSize<TlDisplayPx>);
    }
  }, [ref]);
  return { ref, size };
};
