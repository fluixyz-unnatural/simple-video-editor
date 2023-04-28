import { useSelector } from "react-redux";
import { saveAsMp4 } from "../../../domains/ffmpeg/save";
import { EditorState, Item, Material } from "../../../models/editor/editor";

export const Control = () => {
  const { items, materials } = useSelector<
    EditorState,
    { items: Item[]; materials: Material[] }
  >((state) => ({
    items: state.timeline.items,
    materials: state.materials,
  }));
  return (
    <div className="control">
      <button onClick={() => saveAsMp4(items, materials)}>output</button>
    </div>
  );
};
