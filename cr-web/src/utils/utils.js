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

/**
 * 注册到String对象上的函数
 *
 * @param size 字号
 * @param family 字体类型
 *
 * @return 字符串实际绘制宽度
 */
// eslint-disable-next-line no-extend-native
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
const guid = () =>
  'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = (Math.random() * 16) | 0;
    var v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
import dayjs from 'dayjs';
const formatDate = (time, format = 'YYYY-MM-DD HH:mm:ss') => {
  if (!time) {
    return '';
  }
  return dayjs(time).format(format);
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
function getValueName(list, mark) {
  let name = '';
  _.forEach(list, (item) => {
    if (item.value === mark) {
      name = item.name.toString();
    }
  });
  return name;
}

export default {
  truncStringByWidth,
  guid,
  debounce,
  formatDate,
  formatString,
  getCookie,
  getValueName,
};
