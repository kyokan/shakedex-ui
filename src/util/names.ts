export const ellipsify = (name = '', first = 6, last = 6): string => {
  return `${name.slice(0, first)}...${name.slice(-last)}`;
};
