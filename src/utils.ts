export const groupBy = (arr, field) => {
  return arr.reduce((a, c) => {
    const key = c[field];
    if (!a[key]) {
      a[key] = [];
    }
    a[key].push(c);
    return a;
  }, {});
};
