import _ from 'lodash';
const util = {
  getByteLen(str) {
    let len = 0;
    if (!str) return len;
    for (let i = 0; i < str.length; i++) {
      const a = str.charAt(i);
      if (a.match(/[^\x00-\xff]/gi) != null) {
        len += 1;
      } else {
        len += 1;
      }
    }
    return len;
  },

  // 获取组织列表的最后一组组织
  getLastOrgList(data) {
    let arrTmp = [],
      orgList = _.get(data, 'orgpaths', []);
    if (orgList.length > 0) {
      arrTmp = orgList[orgList.length - 1];
    }
    return arrTmp;
  },
  // 设置组织层级的颜色
  setDifferentColor(arr, index) {
    if (index < arr.length) {
      return arr[index];
    }
  },
};

export default util;
