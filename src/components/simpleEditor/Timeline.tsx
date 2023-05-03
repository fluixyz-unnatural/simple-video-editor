import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { AreaSize, Second, Segment, DisplayPx } from "../../domains/unit";
import { currentChanged } from "../../models/simpleEditor/editor";
import { useDispatch } from "react-redux";
import { calcOffset, px2second } from "./TimelineItems/utils/convert";
import { CurrentTimeVerticalLine } from "./TimelineItems/CurrentTimeVerticalLine";
import { VideoItem } from "./TimelineItems/VideoItem";
import { SegmentController } from "./TimelineItems/SegmentController";
import { useDomSize } from "../utils/useDomSize";

type Props = {
  duration: Second;
  current: Second;
  segment: Segment<Second>;
};

const TIMELINE_HEIGHT = 120;
const TIMELINE_PY = 12;
const tlConst = { TIMELINE_HEIGHT, TIMELINE_PY } as const;

export type Canvas = AreaSize<DisplayPx> & { scale: number; offset: Second };

export const Timeline: React.FC<Props> = ({ current, duration, segment }) => {
  const dispatch = useDispatch();

  const { ref: parent, size } = useDomSize<HTMLDivElement>();
  const [scale, setScale] = useState<number>(1);
  const [offset, setOffset] = useState<Second>(0 as Second);

  const canvas = useMemo(
    () => (size ? { ...size, scale, offset } : undefined),
    [offset, scale, size]
  );

  const onWheel = useCallback(
    (e: WheelEvent) => {
      e.preventDefault();
      const deltaY = e.deltaY / 100;
      if (e.ctrlKey) {
        // zoom
        if (!parent.current) return;
        if (!canvas) return;

        const rect = parent.current.getBoundingClientRect();
        const x = (e.pageX - rect.x) as DisplayPx;

        const nextScale = Math.pow(1.1, -deltaY) * scale;
        // 同じpxが同じsecになるよう offset を調整する
        const nextOffset = calcOffset(
          x,
          px2second(x, canvas, duration),
          { ...canvas, scale: nextScale },
          duration
        ) as Second;

        setScale(nextScale);
        setOffset(nextOffset);
      } else {
        // offset
        const delta = (duration * deltaY) / 20;
        setOffset((prev) => (prev + delta) as Second);
      }
    },
    [canvas, duration, parent, scale]
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
      <div
        ref={parent}
        className={"relative w-full bg-gray-200"}
        style={{ height: TIMELINE_HEIGHT }}
      >
        {canvas !== undefined && (
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
                  current: px2second(pos.x as DisplayPx, canvas, duration),
                })
              );
            }}
          >
            <VideoItem canvas={canvas} tlConst={tlConst} duration={duration} />
            <CurrentTimeVerticalLine
              canvas={canvas}
              current={current}
              duration={duration}
              tlConst={tlConst}
            />
            <SegmentController
              tlConst={tlConst}
              canvas={canvas}
              duration={duration}
              segment={segment}
            />
            <text
              x={0}
              y={TIMELINE_HEIGHT}
              fontSize="256"
              className="pointer-events-none selection:bg-opacity-0"
              fill="transparent"
            >
              dummy_text_to_prevent_text_selection_with_double_click
            </text>
          </svg>
        )}
      </div>
    </>
  );
};
