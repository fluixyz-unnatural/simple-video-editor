import { AreaSize, DisplayPx, VideoPx } from "../../../domains/unit";

export const video2display = (
  px: VideoPx,
  canvas: AreaSize<DisplayPx>,
  video: AreaSize<VideoPx>
) => {
  return (px * (video.width / canvas.width)) as DisplayPx;
};

export const display2video = (
  px: DisplayPx,
  canvas: { width: DisplayPx; height: DisplayPx },
  video: { width: DisplayPx; height: DisplayPx }
) => {
  return (px * (canvas.width / video.width)) as VideoPx;
};
