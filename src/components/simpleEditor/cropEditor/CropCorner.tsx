import React, { useCallback, useEffect, useMemo } from "react";
import {
  AreaSize,
  AxisX,
  AxisY,
  DisplayPx,
  VideoPx,
} from "../../../domains/unit";
import { DragHandler, useDrag } from "../../utils/useDrag";
import { CropInfo, Dim } from "./CropBar";
import { useDispatch } from "react-redux";
import { display2video } from "./convert";
import { cropCornerDraggedWithoutLockAspect } from "../../../models/simpleEditor/editor";

type YDim = "top" | "bottom";
type XDim = "left" | "right";
type Handlers<T> = { [key in Dim]?: T };
type Props = {
  yDim: YDim;
  xDim: XDim;
  setters: {
    setDragLeaves: React.Dispatch<React.SetStateAction<Handlers<() => void>>>;
    setDragUps: React.Dispatch<React.SetStateAction<Handlers<() => void>>>;
    setDragMoves: React.Dispatch<React.SetStateAction<Handlers<DragHandler>>>;
  };
  crop: CropInfo;
  canvas: AreaSize<DisplayPx>;
  video: AreaSize<VideoPx>;
};

export const CropCorner: React.FC<Props> = ({
  canvas,
  video,
  crop,
  yDim,
  xDim,
  setters,
  ...props
}) => {
  const dispatch = useDispatch();
  const cx = xDim == "left" ? crop.left : crop.right;
  const cy = yDim == "top" ? crop.top : crop.bottom;
  const d2v = useMemo(() => {
    return (px: DisplayPx): VideoPx => {
      return display2video(px, canvas, video);
    };
  }, [canvas, video]);
  const onDragging: DragHandler = useCallback(
    (e) => {
      const vx = d2v(e.movementX as DisplayPx) as AxisX<VideoPx>;
      const vy = d2v(e.movementY as DisplayPx) as AxisY<VideoPx>;
      dispatch(
        cropCornerDraggedWithoutLockAspect({
          delta: { x: vx, y: vy },
          dim: [xDim, yDim],
        })
      );
    },
    [d2v, dispatch, xDim, yDim]
  );
  const { handlers } = useDrag(onDragging);

  useEffect(() => {
    setters.setDragLeaves((prev) => ({
      ...prev,
      [yDim + xDim]: handlers.onMouseLeave,
    }));
  }, [handlers.onMouseLeave, setters, xDim, yDim]);
  useEffect(() => {
    setters.setDragUps((prev) => ({
      ...prev,
      [yDim + xDim]: handlers.onMouseUp,
    }));
  }, [handlers.onMouseUp, setters, xDim, yDim]);
  useEffect(() => {
    setters.setDragMoves((prev) => ({
      ...prev,
      [yDim + xDim]: handlers.onMouseMove,
    }));
  }, [handlers.onMouseMove, setters, xDim, yDim]);

  return (
    <g
      onMouseDown={handlers.onMouseDown}
      className={`${
        (xDim === "left" && yDim === "top") ||
        (xDim === "right" && yDim === "bottom")
          ? "cursor-nwse-resize"
          : "cursor-nesw-resize"
      }`}
    >
      <circle
        cx={cx}
        cy={cy}
        r={8}
        fill="#000"
        stroke="#fff"
        strokeWidth={2}
        {...props}
      />
    </g>
  );
};
