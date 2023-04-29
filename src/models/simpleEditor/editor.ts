import { configureStore, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Area, Second, Segment, VideoPx } from "../../domains/unit";

export type SimpleEditorState = {
  input?: {
    link: string;
    duration: Second;
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
      state.input = action.payload.input;
      state.options.segment.end =
        action.payload.input?.duration ?? (0 as Second);
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
  },
});

export const { inputAdded, currentChanged, segmentMoved } =
  simpleEditorSlice.actions;
export const simpleEditorStore = configureStore(simpleEditorSlice);
