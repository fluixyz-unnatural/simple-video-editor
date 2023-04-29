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
} from "./TimelineItems/utils/convert";
import { CurrentTimeVerticalLine } from "./TimelineItems/CurrentTimeVerticalLine";
import { VideoItem } from "./TimelineItems/VideoItem";
import { SegmentController } from "./TimelineItems/SegmentController";

type Props = {
  duration: Second;
  current: Second;
  segment: Segment<Second>;
};

const TIMELINE_HEIGHT = 120;
const TIMELINE_PY = 12;
const tlConst = { TIMELINE_HEIGHT, TIMELINE_PY } as const;

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
          </svg>
        )}
      </div>
    </>
  );
};
