import { DisplayPx, Second } from "../../../../domains/unit";
import { Canvas } from "../../Timeline";

export const px2second = (px: DisplayPx, canvas: Canvas, duration: Second) => {
  return ((px / canvas.width / canvas.scale) * duration +
    canvas.offset) as Second;
};

export const width2dur = (
  width: DisplayPx,
  canvas: Canvas,
  duration: Second
) => {
  return ((width / (canvas.scale * canvas.width)) * duration) as Second;
};

export const second2px = (sec: Second, canvas: Canvas, duration: Second) => {
  return (((sec - canvas.offset) / duration) *
    canvas.width *
    canvas.scale) as DisplayPx;
};

export const dur2width = (dur: Second, canvas: Canvas, duration: Second) => {
  return (canvas.scale * (dur / duration) * canvas.width) as DisplayPx;
};

export const calcOffset = (
  x: DisplayPx,
  sec: Second,
  canvas: Omit<Canvas, "offset">,
  duration: Second
) => {
  return (sec - (x * duration) / canvas.width / canvas.scale) as Second;
};
