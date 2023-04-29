import React, { useCallback, useEffect, useRef, useState } from "react";
import { AreaSize, Second, Segment, TlDisplayPx } from "../../domains/unit";
import { useDrag } from "../utils/useDrag";
import { currentChanged, segmentMoved } from "../../models/simpleEditor/editor";
import { useDispatch } from "react-redux";

type Props = {
  duration: Second;
  current: Second;
  segment: Segment<Second>;
};
export const Timeline: React.FC<Props> = ({ current, duration, segment }) => {
  const parent = useRef<HTMLDivElement>(null);
  const [canvas, setCanvas] = useState<AreaSize<TlDisplayPx>>();
  const dispatch = useDispatch();
  useEffect(() => {
    if (parent.current) {
      const viewBox = parent.current.getBoundingClientRect();
      setCanvas({
        width: viewBox.width,
        height: viewBox.height,
      } as AreaSize<TlDisplayPx>);
    }
  }, [parent]);
  return (
    <div ref={parent} className="relative h-[64px] w-full bg-gray-200">
      {canvas && (
        <svg
          viewBox={`0 0 ${canvas.width} ${canvas.height}`}
          className="absolute inset-0 h-full w-full bg-gray-200"
          onClick={(e) => {
            if (!parent.current) return;
            const rect = parent.current.getBoundingClientRect();
            const pos = { x: e.pageX - rect.x, y: e.pageY - rect.y };
            dispatch(
              currentChanged({
                current: px2second(pos.x as TlDisplayPx, canvas, duration),
              })
            );
          }}
        >
          <VideoItem canvas={canvas} duration={duration} />
          <CurrentTimeLine
            canvas={canvas}
            current={current}
            duration={duration}
          />
          <SegmentController
            canvas={canvas}
            duration={duration}
            segment={segment}
          />
        </svg>
      )}
    </div>
  );
};

type TimelineItemProps = {
  canvas: AreaSize<TlDisplayPx>;
};
type CurrentTimeProps = {
  current: Second;
  duration: Second;
} & TimelineItemProps;

const CurrentTimeLine: React.FC<CurrentTimeProps> = ({
  canvas,
  current,
  duration,
}) => {
  return (
    <line
      x1={(canvas.width * current) / duration}
      x2={(canvas.width * current) / duration}
      y1={0}
      y2={canvas.height}
      strokeWidth={1}
      stroke="#888"
    />
  );
};

type VideoItemProps = {
  duration: Second;
} & TimelineItemProps;

const VideoItem: React.FC<VideoItemProps> = ({ duration, canvas }) => {
  return (
    <rect
      x={0}
      y={12}
      width={canvas.width}
      height={40}
      rx={4}
      ry={4}
      fill={"#99f6e4"}
    />
  );
};

type SegmentControllerProps = {
  segment: Segment<Second>;
  duration: Second;
} & TimelineItemProps;
const SegmentController: React.FC<SegmentControllerProps> = ({
  canvas,
  segment,
  duration,
}) => {
  return (
    <g>
      {/* highlight */}
      <rect
        x={(canvas.width * segment.start) / duration}
        width={((segment.end - segment.start) / duration) * canvas.width}
        y={14}
        height={36}
        strokeWidth={2}
        strokeOpacity={0.32}
        stroke="#fff"
        fill="none"
      />
      {/* shadow */}
      <rect
        x={0}
        y={12}
        height={40}
        width={second2px(segment.start, canvas, duration)}
        fill="#000"
        opacity={0.32}
      />
      <rect
        x={second2px(segment.end, canvas, duration)}
        y={12}
        height={40}
        width={canvas.width - second2px(segment.end, canvas, duration)}
        fill="#000"
        opacity={0.32}
      />
      {/* cursor */}
      <DraggableCursor
        type="start"
        pos={segment.start}
        canvas={canvas}
        duration={duration}
      />
      <DraggableCursor
        type="end"
        pos={segment.end}
        canvas={canvas}
        duration={duration}
      />
    </g>
  );
};

const px2second = (
  px: TlDisplayPx,
  canvas: AreaSize<TlDisplayPx>,
  duration: Second
) => ((duration * px) / canvas.width) as Second;

const second2px = (
  sec: Second,
  canvas: AreaSize<TlDisplayPx>,
  duration: Second
) => ((sec / duration) * canvas.width) as TlDisplayPx;

type DraggableCursorProps = {
  duration: Second;
  pos: Second;
  type: "start" | "end";
} & TimelineItemProps;

const DraggableCursor: React.FC<DraggableCursorProps> = ({
  canvas,
  duration,
  pos,
  type,
}) => {
  const dispatch = useDispatch();
  const onDrag = useCallback((e: React.MouseEvent<unknown, MouseEvent>) => {
    const deltaSecond = px2second(e.movementX as TlDisplayPx, canvas, duration);
    dispatch(segmentMoved({ type: type, delta: deltaSecond }));
  }, []);
  const { dragging, handlers } = useDrag(onDrag);

  return (
    <rect
      onMouseDown={handlers.onMouseDown}
      onMouseLeave={handlers.onMouseLeave}
      onMouseUp={handlers.onMouseUp}
      onMouseMove={handlers.onMouseMove}
      onClick={(e) => e.stopPropagation()}
      fill="#fff"
      width={16}
      height={40}
      x={second2px(pos, canvas, duration) - 8}
      y={12}
      strokeWidth={1}
      stroke={"#ddd"}
    />
  );
};
