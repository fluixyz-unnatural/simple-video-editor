import { useState } from "react";
import {
  Area,
  AreaSize,
  AxisX,
  AxisY,
  Position,
  Second,
  TlDisplayPx,
  TlSvgPx,
} from "../../domains/unit";
import { useSelector } from "react-redux";
import { EditorState, Item } from "../../models/editor/editor";
import { VerticalLine } from "./VerticalLine";
import { TimelineItem } from "./TimelineItem";

export type TimelineViewBox = {
  dx: Second;
  ratio: number;
};

export const Timeline = () => {
  const { left, duration, canvas } = useTimelineCanvas();
  const { current, items } = useSelector<
    EditorState,
    { current: Second; items: Item[] }
  >((state) => ({
    current: state.timeline.current,
    items: state.timeline.items,
  }));
  const viewBox = {
    dx: -left,
    ratio: canvas.width / duration,
  } as TimelineViewBox;
  return (
    <div className="timeline" style={{ marginLeft: "1px" }}>
      <svg
        viewBox={`0 0 ${canvas.width} ${canvas.height}`}
        width={canvas.width}
        height={canvas.height}
        className="bg-black"
      >
        {/* overlay */}
        <g>
          <VerticalLine
            x={time2svg(current, viewBox)}
            stroke="black"
            strokeWidth={3}
          />
        </g>
        {/* items */}
        <g>
          {items.map((e) => (
            <TimelineItem key={e.id} item={e} viewBox={viewBox} />
          ))}
        </g>
      </svg>
    </div>
  );
};

export const time2svg = (time: Second, viewBox: TimelineViewBox) => {
  return (time * viewBox.ratio) as TlSvgPx;
};
export const dur2svgWidth = (dur: Second, viewBox: TimelineViewBox) => {
  return (dur * viewBox.ratio) as TlSvgPx;
};

const useTimelineCanvas = () => {
  const [left, setLeft] = useState<Second>(0 as Second);
  const [duration, setDuration] = useState<Second>(30 as Second);
  const [canvas, setCanvas] = useState<AreaSize<TlDisplayPx>>({
    width: 900 as AxisX<TlDisplayPx>,
    height: 300 as AxisY<TlDisplayPx>,
  });

  return { left, duration, canvas };
};
