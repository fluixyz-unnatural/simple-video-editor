type Props = {
  playing: boolean;
  disabled: boolean;
  onClick: () => void;
};
export const PlayButton: React.FC<Props> = ({ playing, disabled, onClick }) => {
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      className="w-24 rounded-lg border-2 border-solid border-teal-500 p-2 px-4 text-teal-800 hover:border-teal-800 active:bg-teal-50 disabled:pointer-events-none disabled:opacity-30"
    >
      {playing ? "⏸" : "▶"}
    </button>
  );
};
