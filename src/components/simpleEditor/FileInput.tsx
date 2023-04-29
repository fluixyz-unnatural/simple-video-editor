import { useDispatch } from "react-redux";
import { inputAdded } from "../../models/simpleEditor/editor";
import { Second } from "../../domains/unit";

export const FileInput = () => {
  const dispatch = useDispatch();

  return (
    <input
      type="file"
      onChange={({ target }) => {
        if (!target.files) return;
        const url = URL.createObjectURL(target.files[0]);
        const video = document.createElement("video");
        video.src = url;
        video.ondurationchange = (e) => {
          const duration = (e.target as HTMLVideoElement).duration as Second;
          dispatch(
            inputAdded({
              input: { link: url, duration: duration },
            })
          );
        };
      }}
    />
  );
};
