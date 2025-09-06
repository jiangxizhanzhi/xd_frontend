import _ from 'lodash';

export function pickDiff(target, compare) {
  return _.pickBy(target, (value, key) => {
    if (Array.isArray(value) && Array.isArray(compare[key])) {
      const sorted = value.slice().sort();
      const compareArr = compare[key];
      const arrayIsEqual =
        sorted.length === compareArr.length &&
        compareArr
          .slice()
          .sort()
          .every(function (value, index) {
            return JSON.stringify(sorted[index]) === JSON.stringify(value);
          });
      return !arrayIsEqual;
    }
    return JSON.stringify(compare[key]) !== JSON.stringify(value);
  });
}
