import { useRef, useCallback, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Second } from "../../../domains/unit";
import {
  EditorState,
  currentProceeded,
  durationChanged,
  newMaterialItemAdded,
} from "../../../models/editor/editor";
import { useRequestAnimationFrame } from "../../utils/requestAnimationFrame";
import { inSegment } from "../../utils/time";

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

  type ViewingItem = { idx: number; currentTime: Second };
  const viewing = useSelector<EditorState, ViewingItem>((state) => {
    const ans = {
      idx: -1,
      currentTime: -1,
    };
    state.timeline.items.forEach((e, idx) => {
      // レイヤー機能がないのでここは全く更新されないか、一度だけ更新されるか
      if (inSegment(e.timelineSegment, state.timeline.current)) {
        ans.idx = idx;
        ans.currentTime = state.timeline.current - e.timelineSegment.start;
      }
    });
    return ans as ViewingItem;
  });
  const activeVideo = useRef<HTMLVideoElement>(null);

  const proceedCurrentTime = useCallback(
    (delta: number) => {
      dispatch(currentProceeded({ delta: (delta / 1000) as Second }));
    },
    [dispatch]
  );
  useRequestAnimationFrame(proceedCurrentTime);

  useEffect(() => {
    const setTime = async () => {
      if (activeVideo.current) {
        activeVideo.current.currentTime = viewing.currentTime;
        await activeVideo.current.play();
      }
      return;
    };
    setTime();
  }, [activeVideo, viewing.currentTime, viewing.idx]);

  return (
    <div className="preview">
      <button className="play">play / pause</button>
      {materials.map((e, idx) => (
        <video
          ref={idx === viewing.idx ? activeVideo : undefined}
          key={idx}
          src={e.link}
          className={idx === viewing.idx ? "block" : "hidden"}
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
