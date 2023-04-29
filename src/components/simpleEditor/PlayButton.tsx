import { useCallback } from "react";
import { useShortcut } from "../utils/useShortcut";
import { Button } from "../Button";

type Props = {
  playing: boolean;
  disabled: boolean;
  onClick: () => void;
};
export const PlayButton: React.FC<Props> = ({ playing, disabled, onClick }) => {
  const onSpace = useCallback(() => {
    onClick();
  }, [onClick]);
  useShortcut(onSpace, " ");

  return (
    <Button disabled={disabled} onClick={onClick}>
      {playing ? "⏸" : "▶"}
    </Button>
  );
};
