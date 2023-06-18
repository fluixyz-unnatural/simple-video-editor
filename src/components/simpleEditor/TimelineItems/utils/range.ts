export const range = (to: number) => {
  return [...Array(to).keys()];
};

export const range2 = (from: number, to: number) => {
  return range(to - from).map((e) => e + from);
};
