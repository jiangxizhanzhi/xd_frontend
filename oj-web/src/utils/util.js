import _ from 'lodash';
const strInArr = (str, arr = []) => {
  for (const curr of arr) {
    if (curr === str) {
      return true;
    }
  }
  return false;
};

const util = {
  // 获取cookie
  getCookie(cookieName) {
    let strCookie = document.cookie;
    let arrCookie = strCookie.split('; ');
    for (let i = 0; i < arrCookie.length; i++) {
      let arr = arrCookie[i].split('=');
      if (cookieName === arr[0]) {
        return arr[1];
      }
    }
    return '';
  },
  strInArr,

  getByteLen(str) {
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
};

export default util;
