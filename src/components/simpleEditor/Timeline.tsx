import { Second } from "../../domains/unit";

type Props = {
  current: Second;
};
export const Timeline: React.FC<Props> = ({ current }) => {
  return (
    <div className="relative h-16 w-full bg-gray-200">
      <svg className="absolute inset-0 h-full w-full bg-red-50"></svg>
      <span className="absolute bottom-0 right-0">{current}</span>
    </div>
  );
};
