import { createFFmpeg, fetchFile } from "@ffmpeg/ffmpeg";
import { Item, Material } from "../../models/editor/editor";
import { SimpleEditorState } from "../../models/simpleEditor/editor";

export const saveAsMp4fromItems = async (
  items: Item[],
  materials: Material[]
) => {
  const ffmpeg = createFFmpeg({ log: true });
  await ffmpeg.load();

  let name = "";
  for (const item of items) {
    const material = materials[item.materialId];
    if (!material.videoInfo) throw Error("video info was not yet loaded;");
    name = `material-${item.materialId}`;
    ffmpeg.FS(
      "writeFile",
      `material-${item.materialId}`,
      await fetchFile(material.link)
    );
  }

  // ひとまずitemsが一つである前提で作る
  // itemsが複数になったら各itemからitem${}.mp4を生成 → concat -c でつなげる
  await ffmpeg.run("-i", name, "output.mp4");
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

  const data = ffmpeg.FS("readFile", "output.mp4");
  const url = URL.createObjectURL(
    new Blob([data.buffer], { type: "video/mp4" })
  );
  const link = document.createElement("a");
  link.href = url;
  const fileName = "output.mp4";
  link.download = fileName;
  link.click();
};

export const saveAsMp4 = async (
  options: SimpleEditorState["options"],
  input: string
) => {
  const ffmpeg = createFFmpeg({ log: true });
  await ffmpeg.load();
  const inputFileName = "input";
  await ffmpeg.FS("writeFile", inputFileName, await fetchFile(input));

  const commands = ["-i", inputFileName];

  commands.push("-ss", `${options.segment.start}`);
  commands.push("-to", `${options.segment.end}`);

  commands.push(options.output);
  console.log(commands);
  await ffmpeg.run(...commands);

  const data = ffmpeg.FS("readFile", options.output);
  const url = URL.createObjectURL(
    new Blob([data.buffer], { type: "video/mp4" })
  );
  const link = document.createElement("a");
  link.href = url;
  const fileName = options.output;
  link.download = fileName;
  link.click();
};
