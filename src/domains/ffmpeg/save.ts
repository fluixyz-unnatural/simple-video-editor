import { createFFmpeg, fetchFile } from "@ffmpeg/ffmpeg";
import { SimpleEditorState } from "../../models/simpleEditor/editor";

export const saveAsMp4 = async (
  options: SimpleEditorState["options"],
  input: string
) => {
  const ffmpeg = createFFmpeg({ log: true });
  await ffmpeg.load();
  const inputFileName = "input";
  await ffmpeg.FS("writeFile", inputFileName, await fetchFile(input));

  const commands = options2command(options, inputFileName);
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

export const options2command = (
  options: SimpleEditorState["options"],
  filename: string
): string[] => {
  const commands = ["-i", filename];

  // segment
  commands.push("-ss", `${chottoRounded(options.segment.start)}`);
  commands.push("-to", `${chottoRounded(options.segment.end)}`);

  // copy
  if (options.copy && !options.mute)
    commands.push("-c:v", "copy", "-c:a", "copy");
  else if (options.copy) commands.push("-vcodec", "copy", "-an");
  else if (options.mute) commands.push("-an");

  // rate
  if (options.rate) commands.push("-r", `${options.rate}`);

  // width
  let scale = undefined;
  if (options.width) scale = `scale=${options.width}:-1`;

  const c = options.crop;
  const crop = `crop=${c.end.x - c.start.x}:${c.end.y - c.start.y}:${
    c.start.x
  }:${c.start.y}`;
  commands.push("-vf");
  commands.push([crop, scale].filter((e) => e).join(","));

  commands.push(options.output);

  return commands;
};

/*
    使えるようにしたいオプション

    -croptop, -cropbottom, -cropleft, -cropright
      : クロップ
    -an: ミュート
    -crf: 品質

    オプションじゃないけどgif出力もあったほうがいい
  */
const chottoRounded = (a: number) => {
  return Math.round(a * 100) / 100;
};
