import _ from 'lodash';

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
const guid = () =>
  'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = (Math.random() * 16) | 0;
    var v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });

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

// 获取组织列表的最后一组组织
const getLastOrgList = (data) => {
  let arrTmp = [],
    orgList = _.get(data, 'orgpaths', []);
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
/**
 * 数组去重
 * @param {Array || Array(Object)} arr
 * @param {String} prop
 * @returns Array
 */
const arrayRepeatItemFilter = (arr, prop) => {
  const newArr = [],
    tArr = [];
  if (arr.length === 0) {
    return arr;
  }
  if (prop) {
    for (let i = 0; i < arr.length; i++) {
      if (!tArr[arr[i][prop]]) {
        newArr.push(arr[i]);
        tArr[arr[i][prop]] = true;
      }
    }
    return newArr;
  } else {
    return Array.from(new Set(arr));
  }
};

/**
 *
 * @param {String cookie的key} cookieName
 * @returns String cookie的value
 */
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

/**
 * 条件过滤
 * @param {Object 条件} condition
 * @param {Array(Object) 原始数据} data
 * @returns Array(Object) 过滤后的数据
 */
function conditionFilterData(condition, data) {
  return data.filter((item) => {
    return Object.keys(condition).every((key) => {
      return String(item[key])
        .toLowerCase()
        .includes(String(condition[key]).trim().toLowerCase());
    });
  });
}

const whiteList = {
  default: [],
};
const registerWhiteList = (wl, ctg = 'default') => {
  whiteList[ctg] = whiteList[ctg] || [];
  for (const w of wl) {
    whiteList[ctg].push(w);
  }
};
export default {
  guid,
  formatString,
  getLastOrgList,
  setDifferentColor,
  arrayRepeatItemFilter,
  conditionFilterData,
  getCookie,
  debounce,
  registerWhiteList,
};
