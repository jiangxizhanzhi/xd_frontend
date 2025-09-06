import { getI18N } from '@cyber/helper';
import _ from 'lodash';

/**
 * @description: 创建常量
 * @param {Array|Object} orig - 原始数据
 * @return {Object} 常量对象
 */
export function constant(orig) {
  const result = {
    orig,
    list: [],
    type: {},
  };
  if (Array.isArray(orig)) {
    orig.map((key) => {
      result[key] = key;
      result.list.push({
        label: key,
        value: key,
      });
    });
    return result;
  }
  Object.keys(orig).map((key) => {
    result[key] = getI18N().t(orig[key]);
    result.list.push({ label: getI18N().t(orig[key]), value: parseInt(key) });
    const name = _.last(orig[key].split('.'));
    result[name] = parseInt(key);
    result.type[key] = name;
  });
  return result;
}
