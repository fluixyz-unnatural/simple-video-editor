import { Second } from "../../../domains/unit";
import { Item } from "../../../models/editor/editor";
import { TimelineViewBox, time2svg, dur2svgWidth } from "./Timeline";

type Props = {
  item: Item;
  viewBox: TimelineViewBox;
};
export const TimelineItem: React.FC<Props> = ({ item, viewBox }) => {
  const dur = (item.timelineSegment.end - item.timelineSegment.start) as Second;
  return (
    <rect
      x={time2svg(item.timelineSegment.start, viewBox)}
      y={30}
      width={dur2svgWidth(dur, viewBox)}
      height={30}
      fill="#3333ff"
      stroke="white"
    ></rect>
  );
};
