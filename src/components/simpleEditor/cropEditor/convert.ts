import { AreaSize, DisplayPx, VideoPx } from "../../../domains/unit";

export const video2display = (
  px: VideoPx,
  canvas: AreaSize<DisplayPx>,
  video: AreaSize<VideoPx>
) => {
  return (px * (canvas.width / video.width)) as DisplayPx;
};

export const display2video = (
  px: DisplayPx,
  canvas: AreaSize<DisplayPx>,
  video: AreaSize<VideoPx>
) => {
  return (px * (video.width / canvas.width)) as VideoPx;
};
