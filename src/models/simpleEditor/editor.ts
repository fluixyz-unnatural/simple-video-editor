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
      output: "output.mp4",
    },
    editor: { current: 0 as Second },
  } as SimpleEditorState,
  reducers: {
    inputAdded: (
      state,
      action: PayloadAction<{ input: SimpleEditorState["input"] }>
    ) => {
      state.input = action.payload.input;
    },
    currentChanged: (state, action: PayloadAction<{ current: Second }>) => {
      state.editor.current = action.payload.current;
    },
    currentProceeded: (state, action: PayloadAction<{ delta: Second }>) => {
      state.editor.current = (state.editor.current +
        action.payload.delta) as Second;
    },
  },
});

export const { inputAdded, currentChanged } = simpleEditorSlice.actions;
export const simpleEditorStore = configureStore(simpleEditorSlice);
