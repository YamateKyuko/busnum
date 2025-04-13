export const secondToHHMMString = (second: number) => {
  return `${Math.floor(second / 3600).toString().padStart(2, "0")}:${Math.floor((second % 3600) / 60).toString().padStart(2, "0")}`;
};