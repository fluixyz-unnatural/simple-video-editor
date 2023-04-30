import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Second,
  Position,
  DisplayPx,
  TlSvgPx,
  AreaSize,
  AxisX,
  AxisY,
} from "../../../domains/unit";
import {
  EditorState,
  Item,
  currentChanged,
} from "../../../models/editor/editor";
import { TimelineItem } from "./TimelineItem";
import { VerticalLine } from "./VerticalLine";

export type TimelineViewBox = {
  dx: Second;
  ratio: number;
};

export const Timeline = () => {
  const { left, duration, canvas } = useTimelineCanvas();
  const dispatch = useDispatch();

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
        onClick={(e) => {
          const elm = e.target as HTMLDivElement;
          const { left, top } = elm.getBoundingClientRect();
          const pos = {
            x: e.pageX - left,
            y: e.pageY - top,
          } as Position<DisplayPx>;
          dispatch(currentChanged({ current: pos2time(pos.x, viewBox) }));
        }}
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

export const pos2time = (pos: DisplayPx, viewBox: TimelineViewBox) => {
  return (pos / viewBox.ratio) as Second;
};

const useTimelineCanvas = () => {
  const [left, setLeft] = useState<Second>(0 as Second);
  const [duration, setDuration] = useState<Second>(30 as Second);
  const [canvas, setCanvas] = useState<AreaSize<DisplayPx>>({
    width: 900 as AxisX<DisplayPx>,
    height: 300 as AxisY<DisplayPx>,
  });

  return { left, duration, canvas };
};
