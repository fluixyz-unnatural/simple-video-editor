import { useCallback, useEffect } from "react";

export const useShortcut = (
  callback: () => void,
  key: KeyboardEvent["key"]
) => {
  const onKeydown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === key) {
        e.preventDefault();
        callback();
      }
    },
    [callback, key]
  );
  useEffect(() => {
    window.addEventListener("keydown", onKeydown);
    return () => {
      window.removeEventListener("keydown", onKeydown);
    };
  }, [onKeydown]);
};
