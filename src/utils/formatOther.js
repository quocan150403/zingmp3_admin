export function renderArray(arr) {
  if (!Array.isArray(arr)) return '';

  return arr
    .map((item, index) => {
      if (index > 0) {
        return `, ${item}`;
      }

      return item;
    })
    .join('');
}
