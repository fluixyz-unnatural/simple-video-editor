import { useDispatch, useSelector } from "react-redux";
import {
  SimpleEditorState,
  optionsChanged,
} from "../../models/simpleEditor/editor";
import { PropsWithChildren, useState } from "react";

const OptionTitle: React.FC<PropsWithChildren> = ({ children }) => (
  <h3 className="my-6 inline-block h-fit w-24 font-bold">{children}</h3>
);

export const Settings = () => {
  const { output, copy, rate, width, mute } = useSelector<
    SimpleEditorState,
    SimpleEditorState["options"]
  >((state) => state.options);

  const dispatch = useDispatch();
  const [open, setOpen] = useState<boolean>(false);

  return (
    <div className="w-full">
      {/* accessibility.... */}
      <button
        className="w-full text-left"
        onClick={() => setOpen((state) => !state)}
      >
        <h2 className="mb-3 w-full border-b-2 border-solid py-2 text-lg font-bold">
          詳細設定 {open ? "🔺" : "🔻"}
        </h2>
      </button>
      <div
        className={open ? "flex flex-col divide-y divide-solid px-4" : "hidden"}
      >
        <div className="flex items-center">
          <OptionTitle>出力形式</OptionTitle>
          <label className="p-3 hover:bg-gray-50">
            <input
              onChange={() => {
                dispatch(
                  optionsChanged({ type: "output", value: "output.mp4" })
                );
              }}
              checked={output === "output.mp4"}
              className="mr-1"
              type="radio"
              name="format"
            />
            MP4
          </label>
          <label className="p-3 hover:bg-gray-50">
            <input
              checked={output === "output.gif"}
              className="mr-1"
              type="radio"
              name="format"
              onChange={() => {
                dispatch(
                  optionsChanged({ type: "output", value: "output.gif" })
                );
              }}
            />
            GIF
          </label>
        </div>
        <div className="flex items-center">
          <OptionTitle>エンコード</OptionTitle>
          <label className="p-3">
            <input
              onChange={(e) => {
                dispatch(
                  optionsChanged({
                    type: "copy",
                    value: e.target.checked,
                  })
                );
              }}
              checked={copy}
              className="mr-1"
              type="checkbox"
            />
            コピー
          </label>
          <p className="ml-auto text-sm text-red-600">
            ※適切に使わないと出力に失敗します
          </p>
        </div>
        <div className="flex items-center">
          <OptionTitle>ミュート</OptionTitle>
          <label className="p-3">
            <input
              onChange={(e) => {
                dispatch(
                  optionsChanged({
                    type: "mute",
                    value: e.target.checked,
                  })
                );
              }}
              checked={mute}
              className="mr-1"
              type="checkbox"
            />
            ミュート
          </label>
        </div>
        <div className="flex items-center">
          <label>
            <OptionTitle>フレームレート</OptionTitle>
            <input
              onChange={(e) => {
                if (e.target.value === "") return;
                const val = parseInt(e.target.value);
                dispatch(optionsChanged({ type: "rate", value: val }));
              }}
              className="ml-2 rounded-md border-2 border-solid border-teal-200 p-1"
              type="number"
              value={rate ?? ""}
            ></input>
            <button
              onClick={() => {
                dispatch(optionsChanged({ type: "rate", value: undefined }));
              }}
              className="ml-4 rounded-sm bg-slate-100 px-2 py-1 text-sm text-slate-600"
            >
              クリア
            </button>
          </label>
          <p className="ml-auto text-sm text-slate-500">
            未設定なら入力ファイル通り
          </p>
        </div>
        <div className="flex items-center">
          <label>
            <OptionTitle>画面の幅</OptionTitle>
            <input
              onChange={(e) => {
                if (e.target.value === "") return;
                const val = parseInt(e.target.value);
                dispatch(optionsChanged({ type: "width", value: val }));
              }}
              className="ml-2 mr-1 rounded-md border-2 border-solid border-teal-200 p-1"
              type="number"
              value={width ?? ""}
            ></input>
            px
            <button
              onClick={() => {
                dispatch(optionsChanged({ type: "width", value: undefined }));
              }}
              className="ml-4 rounded-sm bg-slate-100 px-2 py-1 text-sm text-slate-600"
            >
              クリア
            </button>
          </label>
          <p className="ml-auto text-sm text-slate-500">
            未設定なら入力ファイル通り
          </p>
        </div>
      </div>
    </div>
  );
};
