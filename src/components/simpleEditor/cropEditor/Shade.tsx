import { AreaSize, DisplayPx } from "../../../domains/unit";

type Props = {
  canvas: AreaSize<DisplayPx>;
  crops: {
    left: DisplayPx;
    right: DisplayPx;
    top: DisplayPx;
    bottom: DisplayPx;
  };
};

export const Shade: React.FC<Props> = ({ canvas, crops }) => {
  const { left, right, top, bottom } = crops;
  return (
    <g>
      <rect
        x={0}
        width={left}
        y={0}
        height={bottom}
        fill="black"
        opacity={0.5}
      />
      <rect
        x={0}
        y={bottom}
        width={right}
        height={canvas.height - bottom}
        fill="black"
        opacity={0.5}
      />
      <rect
        x={right}
        width={canvas.width - right}
        y={top}
        height={canvas.height - top}
        fill="black"
        opacity={0.5}
      />
      <rect
        x={left}
        width={canvas.width - left}
        y={0}
        height={top}
        fill="black"
        opacity={0.5}
      />
    </g>
  );
};
