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
    rate: number | undefined;
    copy: boolean;
    width: number | undefined;
  };
  editor: {
    current: Second;
  };
};

const initialState = {
  input: undefined,
  options: {
    segment: { start: 0, end: 0 } as Segment<Second>,
    crop: { start: { x: 0, y: 0 }, end: { x: 0, y: 0 } } as Area<VideoPx>,
    output: "output.mp4",
    copy: false,
    rate: undefined,
    width: undefined,
  },
  editor: { current: 0 as Second },
} as SimpleEditorState;

// const mockState: SimpleEditorState = {
//   input: {
//     duration: 11,
//     link: "/7seg.mp4",
//     size: { width: 1280, height: 720 },
//   },
//   options: {
//     segment: { start: 0, end: 0 },
//     crop: { start: { x: 0, y: 0 }, end: { x: 1280, y: 720 } },
//     output: "output.mp4",
//     copy: false,
//     rate: undefined,
//     width: undefined,
//   },
//   editor: { current: 0 },
// } as SimpleEditorState;

const simpleEditorSlice = createSlice({
  name: "simple-editor",
  initialState: initialState,
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
          state.options.crop.end.y = (state.options.crop.end.y +
            delta) as AxisY<VideoPx>;
          break;
        case "right":
          state.options.crop.end.x = (state.options.crop.end.x +
            delta) as AxisX<VideoPx>;
          break;
      }
    },
    cropMoved: (state, action: PayloadAction<{ dx: VideoPx; dy: VideoPx }>) => {
      if (state.input === undefined) return;
      const { dx, dy } = action.payload;
      const clampX = (x: AxisX<VideoPx>) => {
        if (state.input === undefined) return x;
        return Math.max(
          0,
          Math.min(x, state.input.size.width)
        ) as AxisX<VideoPx>;
      };
      const clampY = (y: AxisX<VideoPx>) => {
        if (state.input === undefined) return y;
        return Math.max(
          0,
          Math.min(y, state.input.size.height)
        ) as AxisY<VideoPx>;
      };
      state.options.crop.start.x = (state.options.crop.start.x +
        dx) as AxisX<VideoPx>;
      state.options.crop.start.y = (state.options.crop.start.y +
        dy) as AxisY<VideoPx>;
      state.options.crop.end.x = (state.options.crop.end.x +
        dx) as AxisX<VideoPx>;
      state.options.crop.end.y = (state.options.crop.end.y +
        dy) as AxisY<VideoPx>;

      state.options.crop.start.x = clampX(state.options.crop.start.x);
      state.options.crop.end.x = clampX(state.options.crop.end.x);
      state.options.crop.start.y = clampY(state.options.crop.start.y);
      state.options.crop.end.y = clampY(state.options.crop.end.y);
    },
    optionsChanged: (state, actions: PayloadAction<OptionPayload>) => {
      // TODO 共存不可なものを設定できないようにする
      const payload = actions.payload;
      if (payload.type === "output") {
        state.options.output = payload.value;
      }
      if (payload.type === "copy") {
        state.options.copy = payload.value;
      }
      if (payload.type === "rate") {
        state.options.rate = payload.value;
      }
      if (payload.type === "width") {
        state.options.width = payload.value;
      }
    },
  },
});

type OptionPayload =
  | {
      type: "output";
      value: SimpleEditorState["options"]["output"];
    }
  | {
      type: "copy";
      value: SimpleEditorState["options"]["copy"];
    }
  | {
      type: "rate";
      value: SimpleEditorState["options"]["rate"];
    }
  | {
      type: "width";
      value: SimpleEditorState["options"]["width"];
    };

export const {
  inputAdded,
  currentChanged,
  segmentMoved,
  segmentChanged,
  cropBarDragged,
  cropMoved,
  optionsChanged,
} = simpleEditorSlice.actions;
export const simpleEditorStore = configureStore(simpleEditorSlice);
