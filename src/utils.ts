export const groupBy = (arr, groupBy) => {
  return arr.reduce((a, c) => {
    const key = c[groupBy];

    if (!a[key]) {
      a[key] = [];
    }

    a[key].push(c);
    return a;
  }, {});
};
