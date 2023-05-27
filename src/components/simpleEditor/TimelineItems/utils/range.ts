export const range = (to: number) => {
  console.log(to);
  return [...Array(to).keys()];
};

export const range2 = (from: number, to: number) => {
  return range(to - from).map((e) => e + from);
};
