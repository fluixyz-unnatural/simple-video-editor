import { useRef, useEffect } from "react";

export const useRequestAnimationFrame = (callback: (time: number) => void) => {
  const requestRef = useRef<number>(0);
  const previousTimeRef = useRef<number>(0);

  useEffect(() => {
    const animate = (time: number) => {
      if (previousTimeRef.current) {
        const deltaTime = time - previousTimeRef.current;
        callback(deltaTime);
      }
      previousTimeRef.current = time;
      requestRef.current = requestAnimationFrame(animate);
    };
    requestRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(requestRef.current);
  }, [callback]);
};
