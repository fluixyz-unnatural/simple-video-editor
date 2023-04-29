import React, { useCallback, useEffect, useRef, useState } from "react";
import { AreaSize, Second, Segment, TlDisplayPx } from "../../domains/unit";
import { DragHandlers, useDrag } from "../utils/useDrag";
import { currentChanged, segmentMoved } from "../../models/simpleEditor/editor";
import { useDispatch } from "react-redux";
import {
  calcOffset,
  dur2width,
  px2second,
  second2px,
  width2dur,
} from "./convert";

type Props = {
  duration: Second;
  current: Second;
  segment: Segment<Second>;
};

const TIMELINE_HEIGHT = 120;
const TIMELINE_PY = 12;

export type Canvas = AreaSize<TlDisplayPx> & { scale: number; offset: Second };

export const Timeline: React.FC<Props> = ({ current, duration, segment }) => {
  const parent = useRef<HTMLDivElement>(null);
  const [canvas, setCanvas] = useState<Canvas>();
  const dispatch = useDispatch();

  // 最外部divのサイズをもとにsvgのサイズを決定
  useEffect(() => {
    if (parent.current) {
      const viewBox = parent.current.getBoundingClientRect();
      setCanvas({
        width: viewBox.width,
        height: viewBox.height,
        scale: 1,
        offset: 0,
      } as Canvas);
    }
  }, [parent]);

  const onWheel = useCallback(
    (e: WheelEvent) => {
      e.preventDefault();
      const deltaY = e.deltaY / 100;
      if (e.ctrlKey) {
        // zoom
        if (!parent.current) return;
        if (!canvas) return;

        const rect = parent.current.getBoundingClientRect();
        const x = (e.pageX - rect.x) as TlDisplayPx;

        setCanvas((prev) => {
          if (!prev) return prev;

          const scale = Math.pow(1.1, -deltaY) * prev?.scale;
          // 同じpxが同じsecになるよう offset を調整する
          const offset = calcOffset(
            x,
            px2second(x, canvas, duration),
            { ...canvas, scale },
            duration
          ) as Second;
          return { ...prev, scale, offset };
        });
      } else {
        // offset
        setCanvas((prev) =>
          prev
            ? ({
                ...prev,
                offset: prev.offset + (duration * deltaY) / 20,
              } as Canvas)
            : undefined
        );
      }
    },
    [canvas, duration]
  );

  useEffect(() => {
    if (!parent.current) return;
    parent.current.addEventListener("wheel", onWheel);
    return () => {
      if (parent.current) parent.current.removeEventListener("wheel", onWheel);
    };
  }, [parent, onWheel]);

  return (
    <>
      <div className="flex gap-4">
        {canvas && (
          <label>
            offset
            <input
              type="number"
              className="ml-2 w-16 bg-gray-50 p-2 outline-dotted"
              value={canvas.offset}
              onChange={(e) =>
                setCanvas((prev) => {
                  const val = parseInt(e.target.value);
                  return {
                    ...prev,
                    offset: val as Second,
                  } as Canvas;
                })
              }
            />
          </label>
        )}
        {canvas && (
          <label>
            scale
            <input
              type="number"
              className="ml-2 w-16 bg-gray-50 p-2 outline-dotted"
              value={canvas.scale}
              step={0.1}
              onChange={(e) =>
                setCanvas((prev) => {
                  const val = Number(e.target.value);
                  return {
                    ...prev,
                    scale: val as Second,
                  } as Canvas;
                })
              }
            />
          </label>
        )}
      </div>
      <div
        ref={parent}
        className={"relative w-full bg-gray-200"}
        style={{ height: TIMELINE_HEIGHT }}
      >
        {canvas && (
          <svg
            viewBox={`0 0 ${canvas.width} ${canvas.height}`}
            className="absolute inset-0 h-full w-full bg-gray-200"
            onClick={(e) => {
              // currentTime変更
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
    </>
  );
};

type TimelineItemProps = {
  canvas: Canvas;
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
      className="pointer-events-none"
      x1={second2px(current, canvas, duration)}
      x2={second2px(current, canvas, duration)}
      y1={0}
      y2={canvas.height}
      strokeWidth={1}
      stroke="#888"
    />
  );
};

type VideoItemProps = { duration: Second } & TimelineItemProps;

const VideoItem: React.FC<VideoItemProps> = ({ canvas, duration }) => {
  return (
    <rect
      x={second2px(0 as Second, canvas, duration)}
      y={TIMELINE_PY}
      width={dur2width(duration as Second, canvas, duration)}
      height={TIMELINE_HEIGHT - TIMELINE_PY * 2}
      rx={8}
      ry={8}
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
  // onMouseLeaveの範囲をカーソルではなくもっと広い範囲にしたいので、この階層でonDragを扱う
  const dispatch = useDispatch();
  const onDrag = useCallback(
    (e: React.MouseEvent<unknown, MouseEvent>, type: "start" | "end") => {
      const deltaSecond = width2dur(
        e.movementX as TlDisplayPx,
        canvas,
        duration
      );
      console.log(deltaSecond);
      dispatch(segmentMoved({ type: type, delta: deltaSecond }));
    },
    [canvas, dispatch, duration]
  );
  const { dragging: startDragging, handlers: startHandlers } = useDrag((e) =>
    onDrag(e, "start")
  );
  const { dragging: endDragging, handlers: endHandlers } = useDrag((e) =>
    onDrag(e, "end")
  );
  return (
    <g
      onMouseLeave={() => {
        endHandlers.onMouseLeave();
        startHandlers.onMouseLeave();
      }}
      onMouseMove={(e) => {
        startHandlers.onMouseMove(e);
        endHandlers.onMouseMove(e);
      }}
      onClick={(e) => {
        console.log("click");
        if (startDragging.current || endDragging.current) e.stopPropagation();
        // dragging によってstopPropagationをやる。
        // マウスイベントはonUp -> onClickの順で発火する
        // よってonUpの前にdragging判定をはさみたい
        // だからしかたなく、ここでonMouseUpを発火させている
        startHandlers.onMouseUp();
        endHandlers.onMouseUp();
      }}
    >
      {/* highlight */}
      <rect
        x={second2px(segment.start, canvas, duration)}
        width={dur2width(
          (segment.end - segment.start) as Second,
          canvas,
          duration
        )}
        y={TIMELINE_PY + 3}
        height={TIMELINE_HEIGHT - TIMELINE_PY * 2 - 6}
        strokeWidth={2}
        strokeOpacity={0.6}
        stroke="#fff"
        fill="rgba(0,0,0,0)" // currentTimeの当たり判定を上書きするために透明で塗る
      />
      {/* shadow */}
      <rect
        x={second2px(0 as Second, canvas, duration)}
        y={TIMELINE_PY}
        height={TIMELINE_HEIGHT - TIMELINE_PY * 2}
        width={dur2width(segment.start, canvas, duration)}
        fill="#000"
        opacity={0.32}
        rx={8}
        ry={8}
      />
      <rect
        x={second2px(segment.end, canvas, duration)}
        y={TIMELINE_PY}
        height={TIMELINE_HEIGHT - TIMELINE_PY * 2}
        width={dur2width((duration - segment.end) as Second, canvas, duration)}
        fill="#000"
        opacity={0.32}
        rx={8}
        ry={8}
      />
      {/* cursor */}
      <DraggableCursor
        pos={segment.start}
        canvas={canvas}
        duration={duration}
        handlers={startHandlers}
      />
      <DraggableCursor
        pos={segment.end}
        canvas={canvas}
        duration={duration}
        handlers={endHandlers}
      />
    </g>
  );
};

type DraggableCursorProps = {
  duration: Second;
  pos: Second;
  handlers: Pick<DragHandlers, "onMouseDown">;
} & TimelineItemProps;

const DraggableCursor: React.FC<DraggableCursorProps> = ({
  canvas,
  duration,
  pos,
  handlers,
}) => {
  const [hover, setHover] = useState<boolean>(false);
  return (
    <rect
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onMouseDown={handlers.onMouseDown}
      fill="#fff"
      width={16}
      y={TIMELINE_PY - 4}
      height={TIMELINE_HEIGHT - TIMELINE_PY * 2 + 8}
      x={second2px(pos, canvas, duration) - 8}
      strokeWidth={hover ? 2 : 1}
      rx={8}
      ry={8}
      stroke={hover ? "#ccc" : "#ddd"}
    />
  );
};
