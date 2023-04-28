import { Segment } from "../../domains/unit";
import { Item } from "../../models/editor/editor";

export const inSegment = <T extends number>(
  segment: Segment<T>,
  at: T
): boolean => {
  return segment.start <= at && at < segment.end;
};
