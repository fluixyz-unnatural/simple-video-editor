import { useDispatch, useSelector } from "react-redux";
import {
  SimpleEditorState,
  currentChanged,
} from "../../models/simpleEditor/editor";
import { Second } from "../../domains/unit";
import { useCallback, useEffect, useRef, useState } from "react";
import { useRequestAnimationFrame } from "../utils/requestAnimationFrame";
import { FileInput } from "./FileInput";
import { Timeline } from "./Timeline";
import { PlayButton } from "./PlayButton";
import { Preview } from "./Preview";
import { options2command, saveAsMp4 } from "../../domains/ffmpeg/save";
import { SetSegmentButton } from "./SetSegmentButton";
import { CropEditor } from "./cropEditor/CropEditor";
import { Settings } from "./Settings";
import { Button } from "../Button";

export const SimpleEditor = () => {
  const state = useSelector<SimpleEditorState, SimpleEditorState>(
    (state) => state
  );
  const dispatch = useDispatch();

  // プレイヤーがどうあるべきかを示す状態
  const [playing, setPlaying] = useState<boolean>(false);
  // 再生操作が非同期であることに対処するため、実際再生中 or 再生準備中かを示す変数
  const playingRef = useRef<boolean>(false);
  const video = useRef<HTMLVideoElement>(null);

  const [processing, setProcessing] = useState<boolean>(false);

  const togglePlay = useCallback(async () => {
    if (video.current) {
      if (playing && !playingRef.current) {
        playingRef.current = true;
        await video.current.play();
      } else if (!playing) {
        video.current.currentTime = state.editor.current;
        video.current.pause();
        playingRef.current = false;
      }
    }
  }, [playing, video, playingRef, state.editor]);
  useEffect(() => {
    togglePlay();
  }, [togglePlay]);

  const trackCurrentTime = useCallback(() => {
    if (video.current && playing) {
      dispatch(
        currentChanged({ current: video.current.currentTime as Second })
      );
    }
  }, [dispatch, playing]);
  useRequestAnimationFrame(trackCurrentTime);

  return (
    <div className="m-auto mt-8 flex w-[640px] flex-col items-center gap-8 pb-32">
      <FileInput />
      <div className="relative  bg-gray-200">
        {state.input && <Preview ref={video} src={state.input.link} />}
        <CropEditor />
      </div>
      <div className="flex gap-4">
        <PlayButton
          disabled={!state.input}
          playing={playing}
          onClick={() => setPlaying((prev) => !prev)}
        />
        <SetSegmentButton current={state.editor.current} />
      </div>
      {state.input && (
        <Timeline
          current={state.editor.current}
          duration={state.input.duration}
          segment={state.options.segment}
        />
      )}
      <Settings />
      <pre className="overflow-auto border-2 border-solid border-slate-300 p-4 text-slate-700">
        {state.input
          ? "ffmpeg " + options2command(state.options, "[input]").join(" ")
          : "commands will display here"}
      </pre>
      <Button
        onClick={async () => {
          if (!state.input) return;
          setProcessing(true);
          try {
            await saveAsMp4(state.options, state.input.link);
          } catch (e) {
            alert("encode failed");
          }
          setProcessing(false);
        }}
        disabled={state.input === undefined || processing}
        fill
      >
        {processing ? "processing..." : "OUTPUT"}
      </Button>
    </div>
  );
};
