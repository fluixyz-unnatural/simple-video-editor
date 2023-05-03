import { useDispatch, useSelector } from "react-redux";
import {
  SimpleEditorState,
  optionsChanged,
} from "../../models/simpleEditor/editor";
import { PropsWithChildren } from "react";

const OptionTitle: React.FC<PropsWithChildren> = ({ children }) => (
  <h3 className="my-6 inline-block h-fit w-24 font-bold">{children}</h3>
);

export const Settings = () => {
  const { output, copy, rate, width } = useSelector<
    SimpleEditorState,
    SimpleEditorState["options"]
  >((state) => state.options);

  const dispatch = useDispatch();

  return (
    <div className="w-full">
      <h2 className="mb-3 text-lg font-bold">詳細設定</h2>
      <div className="flex flex-col divide-y divide-solid px-4 ">
        <div className="flex items-center">
          <OptionTitle>出力形式</OptionTitle>
          <label className="p-3 hover:bg-gray-50">
            <input
              onChange={(e) => {
                const val = e.target.value;
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
              onChange={(e) => {
                const val = e.target.value;
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
                console.log(e.target.value);
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
        </div>
        <div>
          <label>
            <OptionTitle>フレームレート</OptionTitle>
            <input
              onChange={(e) => {
                const val = parseInt(e.target.value);
                dispatch(optionsChanged({ type: "rate", value: val }));
              }}
              className="ml-2 rounded-md border-2 border-solid border-teal-200 p-1"
              type="number"
              value={rate ?? "--"}
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
        </div>
        <div>
          <label>
            <OptionTitle>映像サイズ</OptionTitle>
            <input
              onChange={(e) => {
                const val = parseInt(e.target.value);
                dispatch(optionsChanged({ type: "width", value: val }));
              }}
              className="ml-2 rounded-md border-2 border-solid border-teal-200 p-1"
              type="number"
              value={width ?? "--"}
            ></input>
            <button
              onClick={(e) => {
                dispatch(optionsChanged({ type: "width", value: undefined }));
              }}
              className="ml-4 rounded-sm bg-slate-100 px-2 py-1 text-sm text-slate-600"
            >
              クリア
            </button>
          </label>
        </div>
      </div>
    </div>
  );
};
