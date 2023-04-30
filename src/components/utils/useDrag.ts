import React, { useCallback, useRef } from "react";

export type DragHandlers = {
  onMouseDown: () => void;
  onMouseMove: (e: React.MouseEvent<unknown, MouseEvent>) => void;
  onMouseLeave: () => void;
  onMouseUp: () => void;
};

export type DragHandler = (e: React.MouseEvent<unknown, MouseEvent>) => void;

export const useDrag = (onDragging: DragHandler) => {
  const dragging = useRef<boolean>(false);

  const onMouseDown = useCallback(() => {
    if (!dragging.current) dragging.current = true;
  }, []);
  const onMouseLeave = useCallback(() => {
    if (dragging.current) dragging.current = false;
  }, []);

  const onMouseMove = useCallback(
    (e: React.MouseEvent<unknown, MouseEvent>) => {
      if (dragging.current) {
        onDragging(e);
      }
    },
    [dragging, onDragging]
  );

  return {
    handlers: {
      onMouseDown,
      onMouseLeave,
      onMouseMove,
      onMouseUp: onMouseLeave,
    },
    dragging: dragging,
  };
};
