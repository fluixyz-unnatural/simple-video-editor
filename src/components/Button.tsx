import { ButtonHTMLAttributes, PropsWithChildren } from "react";

type Props = ButtonHTMLAttributes<unknown> & {
  className?: string;
  fill?: boolean;
};

export const Button: React.FC<PropsWithChildren<Props>> = ({
  children,
  className,
  fill,
  ...otherProps
}) => {
  if (fill)
    return (
      <button
        className={
          "w-32 select-none rounded-lg border-2 border-solid border-teal-500 bg-teal-500 p-2 px-4 text-white hover:border-teal-800 active:bg-teal-700 disabled:pointer-events-none disabled:opacity-30 " +
          className
        }
        {...otherProps}
      >
        {children}{" "}
      </button>
    );
  return (
    <button
      className={
        "w-32 select-none rounded-lg border-2 border-solid border-teal-500 p-2 px-4 text-teal-800 hover:border-teal-800 active:bg-teal-50 disabled:pointer-events-none disabled:opacity-30 " +
        className
      }
      {...otherProps}
    >
      {children}{" "}
    </button>
  );
};
