import { useSelector, useDispatch } from "react-redux";
import { EditorState, materialAdded } from "../../../models/editor/editor";

export const Toolbar = () => {
  const materials = useSelector<EditorState, EditorState["materials"]>(
    (state) => state.materials
  );
  const dispatch = useDispatch();

  return (
    <div className="toolbar">
      <ul>
        <li>
          <input
            type="file"
            onInput={(e) => {
              if (materials.length > 0) return; // とりあえずファイル一つのみで
              const files = (e.target as HTMLInputElement).files;
              if (files && files[0])
                dispatch(materialAdded({ url: URL.createObjectURL(files[0]) }));
            }}
          />
        </li>
      </ul>
    </div>
  );
};
