import React, { useCallback, useEffect } from "react";
import { DragHandler, useDrag } from "../../utils/useDrag";
import { useDispatch } from "react-redux";
import { DisplayPx } from "../../../domains/unit";

type Voids = (() => void)[];

const dims = ["left", "top", "right", "bottom"] as const;

type LinePos = "x1" | "x2" | "y1" | "y2";
type Props = Omit<React.SVGAttributes<SVGLineElement>, LinePos> & {
  type: (typeof dims)[number];
  setters: {
    setDragLeaves: React.Dispatch<React.SetStateAction<Voids>>;
    setDragUps: React.Dispatch<React.SetStateAction<Voids>>;
    setDragMoves: React.Dispatch<React.SetStateAction<DragHandler[]>>;
  };
  crop: { [key in (typeof dims)[number]]: DisplayPx };
};

export const CropBar: React.FC<Props> = ({ crop, type, setters, ...props }) => {
  const dispatch = useDispatch();
  const onDragging: DragHandler = useCallback((e) => {
    type;
  }, []);
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
    setters.setDragLeaves((prev) => [handlers.onMouseLeave, ...prev]);
  }, [handlers.onMouseLeave, setters]);
  useEffect(() => {
    setters.setDragUps((prev) => [handlers.onMouseUp, ...prev]);
  }, [handlers.onMouseUp, setters]);
  useEffect(() => {
    setters.setDragMoves((prev) => [handlers.onMouseMove, ...prev]);
  }, [handlers.onMouseMove, setters]);

  return (
    <g
      onMouseDown={handlers.onMouseDown}
      className={`${
        ["left", "right"].includes(type)
          ? "cursor-col-resize"
          : "cursor-row-resize"
      }`}
    >
      <line {...linePos} {...props} />
      <circle cx={cx} cy={cy} r={8} fill="#000" stroke="#fff" strokeWidth={2} />
    </g>
  );
};
