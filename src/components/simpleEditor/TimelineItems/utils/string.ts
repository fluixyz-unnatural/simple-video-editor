export const sec2string = (time: number) => {
  const min = Math.floor(time / 60);
  const sec = time % 60;
  return `${zeroPadding(min, 2)}:${zeroPadding(sec, 2)}`;
};

function zeroPadding(num: number, len: number) {
  return (Array(len).join("0") + num).slice(-len);
}
