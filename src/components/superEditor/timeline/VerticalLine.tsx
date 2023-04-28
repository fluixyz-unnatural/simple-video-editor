import { TlSvgPx } from "../../../domains/unit";

type Props = Omit<
  Omit<Omit<Omit<React.SVGProps<SVGLineElement>, "x1">, "x2">, "y1">,
  "y2"
> & {
  x: TlSvgPx;
};

export const VerticalLine: React.FC<Props> = ({ x, ...props }) => {
  return <line x1={x} x2={x} y1={-9999} y2={9999} {...props} />;
};
