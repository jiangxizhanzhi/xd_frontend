import _ from 'lodash';
const util = {
  getByteDescLen(str) {
    let len = 0;
    for (let i = 0; i < str.length; i++) {
      const a = str.charAt(i);
      if (a.match(/[^\x00-\xff]/gi) != null) {
        len += 2;
      } else {
        len += 1;
      }
    }
    return len;
  },

  //验证描述长度不是必填项
  getByteDescLength(str) {
    let len = 0;
    if (str && str.length) {
      for (let i = 0; i < str.length; i++) {
        const a = str.charAt(i);
        if (a.match(/[^\x00-\xff]/gi) != null) {
          len += 2;
        } else {
          len += 1;
        }
      }
    }
    return len;
  },
  // 校验红蓝团队标签
  getByteLen(str) {
    var sum = 0;
    const value = str.trim();
    const cn_re = /[\u4e00-\u9fa5]/;
    const re = /^[_a-zA-Z0-9\s]/;
    for (var s = 0; s < value.length; s++) {
      if (re.test(value[s]) || value[s] === '-') {
        sum = sum + 1;
      } else if (cn_re.test(value[s])) {
        sum = sum + 2;
      } else {
        return false;
      }
    }
    return sum;
  },

  /* 计算场景描述长度, 包含特殊字符 */
  getLenByDesc(str) {
    var length = 0;
    const value = str.trim();
    const re = /[\u4e00-\u9fa5]/;
    for (var i = 0; i < value.length; i++) {
      if (re.test(value[i])) {
        length = length + 2;
      } else {
        length = length + 1;
      }
    }
    return length;
  },

  parseJsonStr(jsonStr, empty) {
    if (empty === undefined) {
      empty = {};
    }

    let result;
    try {
      if (jsonStr instanceof Array) {
        result = jsonStr || empty;
      } else {
        result = jsonStr ? JSON.parse(jsonStr) : empty;
      }
    } catch (e) {
      result = empty;
    }

    return result;
  },

  /**
   * 注册到String对象上的函数
   *
   * @param size 字号
   * @param family 字体类型
   *
   * @return 字符串实际绘制宽度
   */
  // eslint-disable-next-line no-extend-native
  visualLength(string, size, family) {
    const rulerId = 'trulerid2004170934';
    const ruler = document.createElement('div');

    ruler.id = rulerId;
    document.querySelector('body').append(ruler);
    ruler.style.fontFamily = family;
    ruler.style.fontSize = size;
    ruler.style.display = 'inline-block';
    ruler.innerText = string;
    const w = ruler.offsetWidth;
    document.querySelector('#' + rulerId).remove();
    return w;
  },

  getMd5Model(model) {
    const result = {};
    _.forEach(model, (value, key) => {
      result[key] = this.md5Value(value);
    });
    return result;
  },
  getDiffFields(md5Model1, md5Model2) {
    const fields = [];
    _.forEach(md5Model1, (value, key) => {
      if (value !== md5Model2[key]) {
        fields.push(key);
      }
    });
    return fields;
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
