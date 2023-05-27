import { Suspense } from "react";
import { DisplayPx, Second } from "../../../domains/unit";
import { TimelineItemProps } from "./type";
import { dur2width, second2px } from "./utils/convert";
import { range, range2 } from "./utils/range";
import { sec2string } from "./utils/string";

type Props = { duration: Second } & TimelineItemProps;
export const Ruler: React.FC<Props> = ({ canvas, tlConst, duration }) => {
  canvas;
  tlConst;
  const sec2px = (sec: Second) => second2px(sec, canvas, duration);
  const onesec = dur2width(1 as Second, canvas, duration);
  const mode = onesec < 8 ? "1min" : onesec < 42 ? "10sec" : "5sec";
  const properties = {
    "1min": {
      big: 60,
      min: 10,
      small: 5,
    },
    "10sec": {
      big: 10,
      min: 5,
      small: 1,
    },
    "5sec": {
      big: 5,
      min: 2,
      small: 1,
    },
  };
  const big = properties[mode].big;
  const start = Math.floor(canvas.offset / big);
  const end = Math.floor(start + duration / canvas.scale / big) + 2;
  console.log(start, end);
  return (
    <>
      <Suspense>
        <text>{canvas.scale}</text>
        <text>{canvas.offset}</text>
        {/* 1分 */}
        {range2(start, end).map(
          (e) =>
            e >= 0 && (
              <g key={e}>
                <line
                  x1={sec2px((e * properties[mode].big) as Second)}
                  x2={sec2px((e * properties[mode].big) as Second)}
                  y1={0}
                  y2={8}
                  strokeWidth={1}
                  stroke="#222"
                />
                <text
                  x={sec2px((e * properties[mode].big) as Second)}
                  y={22}
                  fontSize={12}
                >
                  {sec2string(e * properties[mode].big)}
                </text>
                <Suspense>
                  <MinutesMemory
                    sec2px={sec2px}
                    offset={e * properties[mode].big}
                    count={Math.floor(
                      properties[mode].big / properties[mode].min
                    )}
                    interval={properties[mode].min as Second}
                    height={6}
                    width={1}
                    stroke="#666"
                  />
                  <MinutesMemory
                    sec2px={sec2px}
                    offset={e * properties[mode].big}
                    count={Math.floor(
                      properties[mode].big / properties[mode].small
                    )}
                    interval={properties[mode].small as Second}
                    height={4}
                    width={1}
                    stroke="#666"
                  />
                </Suspense>
              </g>
            )
        )}
      </Suspense>
    </>
  );
};

// 1分→20秒→5秒

export const MinutesMemory: React.FC<{
  sec2px: (sec: Second) => DisplayPx;
  offset: number;
  count: number;
  interval: Second;
  width: number;
  height: number;
  stroke: string;
}> = ({ sec2px, offset, count, interval, width, height, stroke }) => {
  return (
    <>
      {range(count).map((e) => (
        <line
          key={e}
          x1={sec2px((offset + e * interval) as Second)}
          x2={sec2px((offset + e * interval) as Second)}
          y1={0}
          y2={height}
          strokeWidth={width}
          stroke={stroke}
        />
      ))}
    </>
  );
};
