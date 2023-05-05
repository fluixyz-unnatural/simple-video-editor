import { useDispatch } from "react-redux";
import { inputAdded } from "../../models/simpleEditor/editor";
import { AxisX, AxisY, Second, VideoPx } from "../../domains/unit";

export const FileInput = () => {
  const dispatch = useDispatch();

  return (
    <input
      type="file"
      accept="video/*"
      onChange={({ target }) => {
        if (!target.files) return;
        const url = URL.createObjectURL(target.files[0]);
        const video = document.createElement("video");
        video.src = url;
        video.ondurationchange = (e) => {
          const duration = (e.target as HTMLVideoElement).duration as Second;
          const size = {
            width: video.videoWidth as AxisX<VideoPx>,
            height: video.videoHeight as AxisY<VideoPx>,
          };
          dispatch(
            inputAdded({
              input: { link: url, duration: duration, size },
            })
          );
        };
      }}
    />
  );
};
