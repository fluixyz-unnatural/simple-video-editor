import { useDispatch, useSelector } from "react-redux";
import {
  EditorState,
  durationChanged,
  newMaterialItemAdded,
} from "../../models/editor/editor";
import { Second } from "../../domains/unit";
import { inSegment } from "../utils/time";

/*
  読み込まれたすべての動画ファイルのvideoElementを持つ
  タイムライン上でアクティブになっているItemのみを表示、ほかを隠す
  currentTimeの調整もここで担う
*/
export const Preview = () => {
  const materials = useSelector<EditorState, EditorState["materials"]>(
    (state) => state.materials
  );
  const dispatch = useDispatch();

  const viewingItemIdx = useSelector<EditorState, number>((state) => {
    let ans = -1;
    state.timeline.items.forEach((e, idx) => {
      // レイヤー機能がないのでここは全く更新されないか、一度だけ更新されるか
      if (inSegment(e.timelineSegment, state.timeline.current)) ans = idx;
    });
    return ans;
  });

  return (
    <div className="preview">
      {materials.map((e, idx) => (
        <video
          key={idx}
          src={e.link}
          className={idx === viewingItemIdx ? "block" : "hidden"}
          onDurationChange={({ target }) => {
            if (target) {
              dispatch(
                durationChanged({
                  index: idx,
                  duration: (target as HTMLVideoElement).duration as Second,
                })
              );
              dispatch(newMaterialItemAdded({ materialId: idx }));
            }
          }}
        />
      ))}
    </div>
  );
};
