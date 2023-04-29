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
import { saveAsMp4 } from "../../domains/ffmpeg/save";
import { SetSegmentButton } from "./SetSegmentButton";

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

  const togglePlay = useCallback(async () => {
    console.log("effect");
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
    <div className="m-auto mt-8 flex w-[640px] flex-col items-center gap-4">
      <div className="relative aspect-video w-full bg-gray-200">
        {state.input && <Preview ref={video} src={state.input.link} />}
      </div>
      <div className="flex gap-4">
        <PlayButton
          disabled={!state.input}
          playing={playing}
          onClick={() => setPlaying((prev) => !prev)}
        />
        <SetSegmentButton current={state.editor.current} />
      </div>
      {state.input ? (
        <Timeline
          current={state.editor.current}
          duration={state.input.duration}
          segment={state.options.segment}
        />
      ) : (
        <FileInput />
      )}
      <pre>ffmpeg {option2ffmpegCommand(state.options).join(" ")}</pre>
      <button
        onClick={() =>
          state.input && saveAsMp4(state.options, state.input.link)
        }
        disabled={state.input === undefined}
        className="rounded-lg bg-teal-500 p-2 px-4 text-white hover:bg-teal-600 active:bg-teal-700 disabled:pointer-events-none disabled:opacity-30"
      >
        output
      </button>
    </div>
  );
};

const option2ffmpegCommand = (
  options: SimpleEditorState["options"]
): string[] => {
  /*
    使えるようにしたいオプション

    範囲 -ss x -to or -ss x -t
    -ss [duration] : 出力に含める動画の開始時間
    -to [duration] : 出力に含める動画の終了時間
    -t [duration] : 動画の長さ

    -r: フレームレート
    -s: サイズ 640x480など
    -croptop, -cropbottom, -cropleft, -cropright
      : クロップ
    -an: ミュート
    -crf: 品質

    オプションじゃないけどgif出力もあったほうがいい
  */
  return [
    "-i",
    "[input]",
    "-ss",
    `${chottoRounded(options.segment.start)}`,
    "-to",
    `${chottoRounded(options.segment.end)}`,
    options.output,
  ];
};

const chottoRounded = (a: number) => {
  return Math.round(a * 100) / 100;
};
