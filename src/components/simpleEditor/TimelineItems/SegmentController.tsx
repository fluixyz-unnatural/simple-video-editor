import { useCallback, useState } from "react";
import { useDispatch } from "react-redux";
import { Segment, Second, DisplayPx } from "../../../domains/unit";
import { segmentMoved } from "../../../models/simpleEditor/editor";
import { DragHandlers, useDrag } from "../../utils/useDrag";
import { TimelineItemProps } from "./type";
import { width2dur, second2px, dur2width } from "./utils/convert";

type SegmentControllerProps = {
  segment: Segment<Second>;
  duration: Second;
} & TimelineItemProps;
export const SegmentController: React.FC<SegmentControllerProps> = ({
  canvas,
  segment,
  duration,
  tlConst,
}) => {
  // onMouseLeaveの範囲をカーソルではなくもっと広い範囲にしたいので、この階層でonDragを扱う
  const dispatch = useDispatch();
  const onDrag = useCallback(
    (e: React.MouseEvent<unknown, MouseEvent>, type: "start" | "end") => {
      const deltaSecond = width2dur(e.movementX as DisplayPx, canvas, duration);
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
        y={tlConst.TIMELINE_PY + 3+16}
        height={tlConst.TIMELINE_HEIGHT - tlConst.TIMELINE_PY * 2 - 6 - 16}
        strokeWidth={2}
        strokeOpacity={0.6}
        stroke="#fff"
        fill="rgba(0,0,0,0)" // currentTimeの当たり判定を上書きするために透明で塗る
      />
      {/* shadow */}
      <rect
        x={second2px(0 as Second, canvas, duration)}
        y={tlConst.TIMELINE_PY+16}
        height={tlConst.TIMELINE_HEIGHT - tlConst.TIMELINE_PY * 2-16}
        width={dur2width(segment.start, canvas, duration)}
        fill="#000"
        opacity={0.32}
        rx={8}
        ry={8}
      />
      <rect
        x={second2px(segment.end, canvas, duration)}
        y={tlConst.TIMELINE_PY+16}
        height={tlConst.TIMELINE_HEIGHT - tlConst.TIMELINE_PY * 2-16}
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
        tlConst={tlConst}
      />
      <DraggableCursor
        pos={segment.end}
        canvas={canvas}
        duration={duration}
        handlers={endHandlers}
        tlConst={tlConst}
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
  tlConst,
}) => {
  const [hover, setHover] = useState<boolean>(false);
  return (
    <rect
      className="cursor-col-resize"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onMouseDown={handlers.onMouseDown}
      fill="#fff"
      width={16}
      y={tlConst.TIMELINE_PY - 4+16}
      height={tlConst.TIMELINE_HEIGHT - tlConst.TIMELINE_PY * 2 + 8-16}
      x={second2px(pos, canvas, duration) - 8}
      strokeWidth={hover ? 2 : 1}
      rx={8}
      ry={8}
      stroke={hover ? "#ccc" : "#ddd"}
    />
  );
};
