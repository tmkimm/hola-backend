export const isString = (value: string | null | undefined): boolean => {
  return !!(typeof value !== 'undefined' && typeof value === 'string' && value && value.length > 0);
};
