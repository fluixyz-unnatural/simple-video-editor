import { Branded } from "../components/utils/type";

// unit
export type Second = Branded<number, "_second">;

// pixel
export type VideoPx = Branded<number, "video_pixel">;
export type PreviewPx = Branded<number, "preview_pixel">;
export type TlDisplayPx = Branded<number, "timeline display pixel">;
export type TlSvgPx = Branded<number, "timeline svg pixel">;

// geometry
export type AxisX<T extends number> = Branded<T, "_axisX">;
export type AxisY<T extends number> = Branded<T, "_axisX">;

export type Position<T extends number> = {
  x: AxisX<T>;
  y: AxisY<T>;
};

export type Segment<T> = {
  start: T;
  end: T;
};

export type Area<T extends number> = Segment<Position<T>>;
export type AreaSize<T extends number> = {
  width: AxisX<T>;
  height: AxisY<T>;
};
