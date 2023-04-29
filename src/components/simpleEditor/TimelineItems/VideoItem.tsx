import { Second } from "../../../domains/unit";
import { TimelineItemProps } from "./type";
import { second2px, dur2width } from "./utils/convert";

type VideoItemProps = { duration: Second } & TimelineItemProps;

export const VideoItem: React.FC<VideoItemProps> = ({
  canvas,
  duration,
  tlConst,
}) => {
  return (
    <rect
      x={second2px(0 as Second, canvas, duration)}
      y={tlConst.TIMELINE_PY}
      width={dur2width(duration as Second, canvas, duration)}
      height={tlConst.TIMELINE_HEIGHT - tlConst.TIMELINE_PY * 2}
      rx={8}
      ry={8}
      fill={"#99f6e4"}
    />
  );
};
