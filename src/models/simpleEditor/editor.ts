import { configureStore, createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  Area,
  AreaSize,
  AxisX,
  AxisY,
  Position,
  Second,
  Segment,
  VideoPx,
} from "../../domains/unit";
import { Dim } from "../../components/simpleEditor/cropEditor/CropBar";

export type SimpleEditorState = {
  input?: {
    link: string;
    duration: Second;
    size: AreaSize<VideoPx>;
  };
  options: {
    segment: Segment<Second>;
    crop: Area<VideoPx>;
    output: `output.${"mp4" | "gif"}`;
  };
  editor: {
    current: Second;
  };
};

const simpleEditorSlice = createSlice({
  name: "simple-editor",
  initialState: {
    input: undefined,
    options: {
      segment: { start: 0, end: 0 } as Segment<Second>,
      crop: { start: { x: 0, y: 0 }, end: { x: 0, y: 0 } } as Area<VideoPx>,
      output: "output.gif",
    },
    editor: { current: 0 as Second },
  } as SimpleEditorState,
  reducers: {
    inputAdded: (
      state,
      action: PayloadAction<{ input: SimpleEditorState["input"] }>
    ) => {
      const { input } = action.payload;
      state.input = input;
      if (input === undefined) return;
      const bottomRight = {
        x: input.size.width,
        y: input.size.height,
      };
      state.options.segment.end = input.duration;
      state.options.crop = {
        start: { x: 0, y: 0 } as Position<VideoPx>,
        end: bottomRight,
      };
    },
    currentChanged: (state, action: PayloadAction<{ current: Second }>) => {
      const next = Math.max(
        0,
        Math.min(state.input?.duration ?? 0, action.payload.current)
      ) as Second;
      state.editor.current = next;
    },
    segmentMoved: (
      state,
      action: PayloadAction<{ type: "start" | "end"; delta: Second }>
    ) => {
      const { type, delta } = action.payload;
      state.options.segment[type] = (state.options.segment[type] +
        delta) as Second;
    },
    segmentChanged: (
      state,
      action: PayloadAction<{ type: "start" | "end"; time: Second }>
    ) => {
      const { type, time } = action.payload;
      state.options.segment[type] = time;
    },
    cropBarDragged: (
      state,
      action: PayloadAction<{ dim: Dim; delta: VideoPx }>
    ) => {
      const { dim, delta } = action.payload;
      switch (dim) {
        case "left":
          state.options.crop.start.x = (state.options.crop.start.x +
            delta) as AxisX<VideoPx>;
          break;
        case "top":
          state.options.crop.start.y = (state.options.crop.start.y +
            delta) as AxisY<VideoPx>;
          break;
        case "bottom":
          console.log(delta);
          state.options.crop.end.y = (state.options.crop.end.y +
            delta) as AxisY<VideoPx>;
          break;
        case "right":
          state.options.crop.start.x = (state.options.crop.end.x +
            delta) as AxisX<VideoPx>;
          break;
      }
    },
  },
});

export const {
  inputAdded,
  currentChanged,
  segmentMoved,
  segmentChanged,
  cropBarDragged,
} = simpleEditorSlice.actions;
export const simpleEditorStore = configureStore(simpleEditorSlice);
