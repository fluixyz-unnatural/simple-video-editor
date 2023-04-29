import { forwardRef } from "react";

type Props = {
  src: string;
};

export const Preview = forwardRef<HTMLVideoElement, Props>(function Preview(
  props,
  ref
) {
  return <video ref={ref} src={props.src} className="aspect-video w-full" />;
});
