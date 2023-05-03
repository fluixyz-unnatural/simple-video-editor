import { useDispatch } from "react-redux";
import { Second } from "../../domains/unit";
import { Button } from "../Button";
import { segmentChanged } from "../../models/simpleEditor/editor";

type Props = { current: Second };
export const SetSegmentButton: React.FC<Props> = ({ current }) => {
  const dispatch = useDispatch();
  return (
    <>
      <Button
        onClick={() => {
          dispatch(segmentChanged({ type: "start", time: current }));
        }}
      >
        開始地点
        <br />
        指定
      </Button>
      <Button
        onClick={() => {
          dispatch(segmentChanged({ type: "end", time: current }));
        }}
      >
        終了地点
        <br />
        指定
      </Button>
    </>
  );
};
