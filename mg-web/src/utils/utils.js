const debounce = (func, wait, immediate) => {
  let timeout, args, context, timestamp, result;

  const later = function () {
    // 据上一次触发时间间隔
    const last = +new Date() - timestamp;

    // 上次被包装函数被调用时间间隔last小于设定时间间隔wait
    if (last < wait && last > 0) {
      timeout = setTimeout(later, wait - last);
    } else {
      timeout = null;
      // 如果设定为immediate===true，因为开始边界已经调用过了此处无需调用
      if (!immediate) {
        result = func.apply(context, args);
        if (!timeout) context = args = null;
      }
    }
  };

  return function (...args) {
    context = this;
    timestamp = +new Date();
    const callNow = immediate && !timeout;
    // 如果延时不存在，重新设定延时
    if (!timeout) timeout = setTimeout(later, wait);
    if (callNow) {
      result = func.apply(context, args);
      context = args = null;
    }

    return result;
  };
};

function formatString(message) {
  if (!message) return null;
  var ss = message.split(/\{\d+?\}/);
  for (var i = 0; i < ss.length; i++) {
    if (arguments[i + 1] !== undefined) {
      ss[i] += arguments[i + 1];
    }
  }
  return ss.join('');
}

// 获取cookie
function getCookie(cookieName) {
  let strCookie = document.cookie;
  let arrCookie = strCookie.split('; ');
  for (let i = 0; i < arrCookie.length; i++) {
    let arr = arrCookie[i].split('=');
    if (cookieName === arr[0]) {
      return arr[1];
    }
  }
  return '';
}

/* 主题配置化 */
function loadCss(file) {
  const head = document.getElementsByTagName('head')[0];
  // Creating link element
  const style = document.createElement('link');
  style.setAttribute('id', 'style-id-' + file);
  style.href = '/page/mg/public' + '/' + file + '.css';
  style.type = 'text/css';
  style.rel = 'stylesheet';
  head.append(style);
}
// 后台相关
import _ from 'lodash';
import dayjs from 'dayjs';
import { getI18N } from '@cyber/helper';
const i18n = getI18N();
const formatDate = (time, format = 'YYYY-MM-DD HH:mm:ss') => {
  if (!time) {
    return '';
  }
  return dayjs(time).format(format);
};

const buildCascaderValue = (
  nodesPassed,
  value,
  iterKey = 'children',
  valueKey = 'id',
) => {
  const found = getNodeInTree(nodesPassed, value, iterKey, valueKey);
  if (found) {
    let curr = found;
    const path = [curr[valueKey]];
    while (curr.parent) {
      path.push(curr.parent[valueKey]);
      curr = curr.parent;
    }
    return path.reverse();
  }
  return [];
};
const getNodeInTree = (
  nodesPassed,
  value,
  iterKey = 'children',
  valueKey = 'id',
) => {
  const nodes = JSON.parse(JSON.stringify(nodesPassed));
  const mountParent = (ns, parent) => {
    if (ns && ns instanceof Array) {
      for (const node of ns) {
        node.parent = parent;
        mountParent(node[iterKey], node);
      }
    }
  };
  mountParent(nodes);

  const findNode = (collections) => {
    if (collections && collections instanceof Array) {
      for (const node of collections) {
        if (node[valueKey] === value) {
          return node;
        } else {
          const found = findNode(node[iterKey]);
          if (found) {
            return found;
          }
        }
      }
    }
  };
  const found = findNode(nodes);
  return found;
};

// 获取组织列表的最后一组组织
const getLastOrgList = (data) => {
  let arrTmp = [],
    orgList = data.orgpaths;
  if (orgList.length > 0) {
    arrTmp = orgList[orgList.length - 1];
  }
  return arrTmp;
};

// 设置组织层级的颜色
const setDifferentColor = (arr, index) => {
  if (index < arr.length) {
    return arr[index];
  }
};

// 求次幂
function pow1024(num) {
  return Math.pow(1024, num);
}
// 文件大小处理，四舍五入保留两位小数
const filterSize = (size) => {
  if (!size) return '';
  if (size < pow1024(1)) return size + ' B';
  if (size < pow1024(2)) return (size / pow1024(1)).toFixed(2) + ' KB';
  if (size < pow1024(3)) return (size / pow1024(2)).toFixed(2) + ' MB';
  if (size < pow1024(4)) return (size / pow1024(3)).toFixed(2) + ' GB';
  return (size / pow1024(4)).toFixed(2) + ' TB';
};

/* 验证title字符串的长度(包含'_','-') */
const validateLength = (str) => {
  let sum = 0;
  const value = str.trim();
  const cn_re = /[\u4e00-\u9fa5]/;
  const re = /^[_a-zA-Z0-9\s]/;
  for (let s = 0; s < value.length; s++) {
    if (re.test(value[s]) || value[s] === '-') {
      sum = sum + 1;
    } else if (cn_re.test(value[s])) {
      sum = sum + 1;
    } else {
      return false;
    }
  }
  return sum;
};
/* 验证系统名称的长度在[4，40]之间 */
const validateTitleLength = (rule, value, callback) => {
  const sum = validateLength(value);
  if (!sum) {
    callback(new Error(i18n.t('systemManagement.userManage.errorInput')));
  } else if (sum < 4 || sum > 40) {
    callback(new Error(i18n.t('systemManagement.system.inputNameLength')));
  } else {
    callback();
  }
};
// 验证简介1000字
const validateDescLength = (rule, value, callback) => {
  var sum = getByteLen(value) <= 1000;
  if (!sum) {
    callback(new Error(i18n.t('systemManagement.userManage.signatureLength')));
  } else {
    callback();
  }
};
const visualLength = (string, size, family) => {
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
};

/**
 * @param str 原始字符串
 * @param family 字体类型
 * @param size 字号
 * @param width 最大允许宽度
 *
 * @return 小于最大宽度的截断后的字符串
 */
function truncStringByWidth(str, family, size, width) {
  let processed = '';
  for (var ch of str) {
    processed += ch;
    if (visualLength(processed, size, family) > width) {
      return processed;
    }
  }
  return str;
}
function getByteLen(str) {
  let len = 0;
  for (let i = 0; i < str.length; i++) {
    const a = str.charAt(i);
    if (a.match(/[^\x00-\xff]/gi) != null) {
      len += 1;
    } else {
      len += 1;
    }
  }
  return len;
}
// 校验留言
function checkReplyComment(rule, value, callback) {
  const i18n = getI18N();
  if (!value) {
    return callback(new Error(i18n.t('systemManagement.message.emptyComment')));
  }
  var l = getByteLen(value) >= 0 && getByteLen(value) <= 250;
  if (!l) {
    callback(new Error(i18n.t('systemManagement.message.maxComment')));
  } else {
    callback();
  }
}
// 是否是json
function isJSON(str) {
  if (typeof str == 'string') {
    try {
      let obj = JSON.parse(str);
      if (typeof obj == 'object' && obj) {
        return true;
      } else {
        return false;
      }
    } catch (e) {
      return false;
    }
  }
}
export default {
  isJSON,
  debounce,
  formatString,
  getCookie,
  loadCss,
  truncStringByWidth,
  formatDate,
  buildCascaderValue,
  getNodeInTree,
  getLastOrgList,
  setDifferentColor,
  filterSize,
  validateLength,
  validateTitleLength,
  validateDescLength,
  checkReplyComment,
};
