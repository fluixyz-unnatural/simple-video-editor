import { configureStore, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Area, Position, Second, Segment, VideoPx } from "../../domains/unit";
import { v4 as uuidv4 } from "uuid";
import { Dim } from "../../components/simpleEditor/cropEditor/CropBar";

export type Material = {
  link: string; // materialAdded により追加される
  // previewにVideoElementとして追加された後に書き込まれる
  videoInfo?: {
    duration: Second;
  };
};

// 素材の位置情報
type ItemPosition = {
  todo: never;
};

// タイムライン上の素材
export type Item = {
  id: string;
  materialId: number;
  timelineSegment: {
    start: Second;
    end: Second;
  };
  videoOffset: Second;
  position: ItemPosition;
};

export type EditorState = {
  materials: Material[];
  timeline: {
    items: Item[];
    current: Second;
    crop: Area<VideoPx>;
  };
};

const superEditorSlice = createSlice({
  name: "materials",
  initialState: {
    materials: [],
    timeline: {
      items: [],
      current: 0 as Second,
      crop: {
        start: { x: 0, y: 0 } as Position<VideoPx>,
        end: { x: 1920, y: 1080 } as Position<VideoPx>,
      },
    },
  } as EditorState,
  reducers: {
    materialAdded: (state, action: PayloadAction<{ url: string }>) => {
      const link = action.payload.url;
      state.materials.push({ link });
    },
    durationChanged: (
      state,
      action: PayloadAction<{ index: number; duration: Second }>
    ) => {
      const { index, duration } = action.payload;
      state.materials[index].videoInfo = { duration };
    },
    newMaterialItemAdded: (
      state,
      action: PayloadAction<{ materialId: number }>
    ) => {
      const last = state.timeline.items.reduce((prev, val) => {
        return Math.max(prev, val.timelineSegment.end);
      }, 0);
      const { materialId } = action.payload;
      const material = state.materials[materialId];
      if (!material.videoInfo) return;
      state.timeline.items.push({
        id: uuidv4(),
        materialId: materialId,
        position: {} as ItemPosition,
        timelineSegment: {
          start: last,
          end: last + material.videoInfo.duration,
        } as Segment<Second>,
        videoOffset: 0 as Second,
      });
    },
    itemAdded: (state, action: PayloadAction<{ item: Item }>) => {
      state.timeline.items.push(action.payload.item);
    },
    currentChanged: (state, action: PayloadAction<{ current: Second }>) => {
      state.timeline.current = action.payload.current;
    },
    currentProceeded: (state, action: PayloadAction<{ delta: Second }>) => {
      state.timeline.current = (state.timeline.current +
        action.payload.delta) as Second;
    },
  },
});

export const {
  materialAdded,
  durationChanged,
  newMaterialItemAdded,
  currentChanged,
  currentProceeded,
} = superEditorSlice.actions;
export const superEditorStore = configureStore(superEditorSlice);
