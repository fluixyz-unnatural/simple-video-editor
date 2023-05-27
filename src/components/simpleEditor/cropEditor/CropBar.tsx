import React, { useCallback, useEffect, useMemo } from "react";
import { DragHandler, useDrag } from "../../utils/useDrag";
import { useDispatch } from "react-redux";
import { AreaSize, DisplayPx, VideoPx } from "../../../domains/unit";
import { cropBarDragged } from "../../../models/simpleEditor/editor";
import { display2video } from "./convert";

type Handlers<T> = { [key in Dim]?: T };

const dims = ["left", "top", "right", "bottom"] as const;
export type Dim = (typeof dims)[number];
export type CropInfo = { [key in (typeof dims)[number]]: DisplayPx };

type LinePos = "x1" | "x2" | "y1" | "y2";
type Props = Omit<React.SVGAttributes<SVGLineElement>, LinePos> & {
  type: (typeof dims)[number];
  setters: {
    setDragLeaves: React.Dispatch<React.SetStateAction<Handlers<() => void>>>;
    setDragUps: React.Dispatch<React.SetStateAction<Handlers<() => void>>>;
    setDragMoves: React.Dispatch<React.SetStateAction<Handlers<DragHandler>>>;
  };
  crop: CropInfo;
  canvas: AreaSize<DisplayPx>;
  video: AreaSize<VideoPx>;
};

export const CropBar: React.FC<Props> = ({
  canvas,
  video,
  crop,
  type,
  setters,
  ...props
}) => {
  const dispatch = useDispatch();

  const d2v = useMemo(() => {
    return (px: DisplayPx): VideoPx => {
      return display2video(px, canvas, video);
    };
  }, [canvas, video]);

  const onDragging: DragHandler = useCallback(
    (e) => {
      const vx = d2v(e.movementX as DisplayPx);
      const vy = d2v(e.movementY as DisplayPx);
      if (type === "left" || type === "right") {
        dispatch(
          cropBarDragged({
            dim: type,
            delta: vx,
          })
        );
      } else {
        dispatch(
          cropBarDragged({
            dim: type,
            delta: vy,
          })
        );
      }
    },
    [d2v, dispatch, type]
  );
  const { handlers } = useDrag(onDragging);

  const linePos = { x1: 0, x2: 0, y1: 0, y2: 0 };
  if (type === "left") {
    linePos.x1 = crop.left;
    linePos.x2 = crop.left;
  } else if (type === "right") {
    linePos.x1 = crop.right;
    linePos.x2 = crop.right;
  } else if (type === "top") {
    linePos.y1 = crop.top;
    linePos.y2 = crop.top;
  } else if (type === "bottom") {
    linePos.y1 = crop.bottom;
    linePos.y2 = crop.bottom;
  }

  if (type === "top" || type === "bottom") {
    linePos.x1 = crop.left;
    linePos.x2 = crop.right;
  } else {
    linePos.y1 = crop.top;
    linePos.y2 = crop.bottom;
  }
  const cy = (Number(linePos.y1) + Number(linePos.y2)) / 2;
  const cx = (Number(linePos.x1) + Number(linePos.x2)) / 2;

  useEffect(() => {
    setters.setDragLeaves((prev) => ({
      ...prev,
      [type]: handlers.onMouseLeave,
    }));
  }, [handlers.onMouseLeave, setters, type]);
  useEffect(() => {
    setters.setDragUps((prev) => ({
      ...prev,
      [type]: handlers.onMouseUp,
    }));
  }, [handlers.onMouseUp, setters, type]);
  useEffect(() => {
    setters.setDragMoves((prev) => ({
      ...prev,
      [type]: handlers.onMouseMove,
    }));
  }, [handlers.onMouseMove, setters, type]);

  return (
    <g
      onMouseDown={handlers.onMouseDown}
      className={`${
        ["left", "right"].includes(type)
          ? "cursor-ew-resize"
          : "cursor-ns-resize"
      }`}
    >
      <line {...linePos} {...props} />
      <circle cx={cx} cy={cy} r={8} fill="#000" stroke="#fff" strokeWidth={2} />
    </g>
  );
};
