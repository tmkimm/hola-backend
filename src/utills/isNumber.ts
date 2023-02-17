export const isNumber = (value: string | null | undefined): boolean => {
  if (typeof value !== 'string') {
    return false;
  }

  if (value.trim() === '') {
    return false;
  }

  return !Number.isNaN(Number(value));
};
