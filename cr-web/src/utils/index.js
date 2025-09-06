import { getCurrentMenu } from '../api/common';
import _ from 'lodash';
/**
 * Created by jiachenpan on 16/11/18.
 */

export function debounce(func, wait, immediate) {
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
}

// 截取多少个字，一个中文2个字符
export function cutStr(str, len) {
  var char_length = 0;
  for (var i = 0; i < str.length; i++) {
    var son_str = str.charAt(i);
    encodeURI(son_str).length > 2 ? (char_length += 2) : (char_length += 1);
    if (char_length >= len) {
      var sub_len = char_length == len ? i + 1 : i;
      return str.substr(0, sub_len);
      break;
    }
  }
}

// 通过路由的name过滤出菜单名称
export async function getCurrentModuleByRouterName(routerName) {
  let moduleName = '';
  let menuData = await getCurrentMenu();
  const data = _.get(menuData, 'data.data', []);
  const frontData = data.filter((item) => item.id === 'front_all');
  let currentMenu = frontData[0];
  for (let i = 0; i < currentMenu?.children?.length; i++) {
    let item = currentMenu?.children[i];
    if (item.id === routerName) {
      moduleName = item.name;
      return moduleName;
    } else {
      for (let idx = 0; idx < item.children?.length; idx++) {
        let child = item.children[idx];
        if (child.id === routerName) {
          moduleName = child.name;
          return moduleName;
        }
      }
      if (moduleName) {
        return moduleName;
      }
    }
  }
}
