import { Second } from "../../../domains/unit";
import { TimelineItemProps } from "./type";
import { second2px } from "./utils/convert";

type CurrentTimeProps = {
  current: Second;
  duration: Second;
} & TimelineItemProps;

export const CurrentTimeVerticalLine: React.FC<CurrentTimeProps> = ({
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
