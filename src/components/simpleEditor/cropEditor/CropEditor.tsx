import { useSelector } from "react-redux";
import { useDomSize } from "../../utils/useDomSize";
import { CropBar, Dim } from "./CropBar";
import { SimpleEditorState } from "../../../models/simpleEditor/editor";
import { AreaSize, DisplayPx, VideoPx } from "../../../domains/unit";
import { video2display } from "./convert";
import { PropsWithChildren, forwardRef, useMemo, useState } from "react";
import { DragHandler } from "../../utils/useDrag";

type State = {
  video: AreaSize<VideoPx> | undefined;
  crop: SimpleEditorState["options"]["crop"];
};

const Wrapper = forwardRef<HTMLDivElement, PropsWithChildren>((props, ref) => {
  return (
    <div
      ref={ref}
      className="absolute inset-0 ml-[-16px] mt-[-16px] h-[calc(100%_+_32px)] w-[calc(100%_+_32px)]"
    >
      {props.children}
    </div>
  );
});

export const CropEditor = () => {
  const { ref, size: paddedSize } = useDomSize<HTMLDivElement>();
  const { video, crop } = useSelector<SimpleEditorState, State>((state) => {
    return {
      video: state.input?.size,
      crop: state.options.crop,
    };
  });

  const [dragLeaves, setDragLeaves] = useState<{ [key in Dim]?: () => void }>(
    {}
  );
  const [dragUps, setDragUps] = useState<{ [key in Dim]?: () => void }>({});
  const [dragMoves, setDragMoves] = useState<{ [key in Dim]?: DragHandler }>(
    {}
  );

  const setters = useMemo(
    () => ({ setDragLeaves, setDragUps, setDragMoves }),
    []
  );

  const size = useMemo(() => {
    return paddedSize
      ? ({
          width: paddedSize.width - 32,
          height: paddedSize.height - 32,
        } as AreaSize<DisplayPx>)
      : undefined;
  }, [paddedSize]);

  const crops = useMemo(() => {
    return size && video
      ? {
          left: video2display(crop.start.x, size, video),
          top: video2display(crop.start.y, size, video),
          right: video2display(crop.end.x, size, video),
          bottom: video2display(crop.end.y, size, video),
        }
      : undefined;
  }, [crop.end.x, crop.end.y, crop.start.x, crop.start.y, size, video]);

  if (
    crops === undefined ||
    size === undefined ||
    paddedSize === undefined ||
    video === undefined
  )
    return <Wrapper ref={ref} />;

  return (
    <Wrapper ref={ref}>
      <div className="pointer-events-none absolute inset-0 h-fit w-fit select-none bg-white bg-opacity-80 p-2">
        crop: {JSON.stringify(crop)}
        <br />
        canvas: {JSON.stringify(size)}
        <br />
        video: {JSON.stringify(video)}
        <br />
      </div>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="bg-red bg-opacity h-full w-full"
        viewBox={`-16 -16 ${paddedSize.width} ${paddedSize.height}`}
        onMouseMove={(ev) => {
          for (const [, val] of Object.entries(dragMoves)) {
            val(ev);
          }
        }}
        onMouseUp={() => {
          for (const [, val] of Object.entries(dragUps)) val();
        }}
        onMouseLeave={() => {
          for (const [, val] of Object.entries(dragLeaves)) val();
        }}
      >
        {(["left", "top", "bottom", "right"] as const).map((e) => (
          <CropBar
            canvas={size}
            video={video}
            key={e}
            type={e}
            crop={crops}
            stroke="#222"
            strokeWidth={4}
            strokeLinecap="square"
            setters={setters}
          />
        ))}
      </svg>
    </Wrapper>
  );
};
