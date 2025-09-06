interface Index<T> {
  [key: string]: T;
}
export function dateFormat(date: Date, fmt = 'yyyy-MM-dd') {
  let o: Index<number | string> = {
    'M+': date.getMonth() + 1,
    'd+': date.getDate(),
    'H+': date.getHours(),
    'm+': date.getMinutes(),
    's+': date.getSeconds(),
    'q+': Math.floor((date.getMonth() + 3) / 3),
    S: date.getMilliseconds(),
  };
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(
      RegExp.$1,
      (date.getFullYear() + '').substr(4 - RegExp.$1.length),
    );
  }
  for (let k in o) {
    if (new RegExp('(' + k + ')').test(fmt)) {
      fmt = fmt.replace(
        RegExp.$1,
        RegExp.$1.length == 1
          ? (o[k] as string)
          : ('00' + o[k]).substr(('' + o[k]).length),
      );
    }
  }
  return fmt;
}
