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

// frame内弹窗和消息框时，外层框架显示遮罩,id为了适配dialog外有message的情况
// export function setParentMask(val, id = 'dialog') {
//   if (!isSubFrame()) {
//     return;
//   }
//   const ele = window.parent.document.querySelector(
//     '.cb-layout .cb-layout-full-screen-mask',
//   );
//   if (!ele) {
//     return;
//   }
//   if (val) {
//     ele.classList.add('show-mask-' + id);
//   } else {
//     ele.classList.remove('show-mask-' + id);
//   }
// }

export function getScrollbarWidth() {
  let inner = document.createElement('p');
  inner.style.width = '100%';
  inner.style.height = '200px';

  let outer = document.createElement('div');
  outer.style.position = 'absolute';
  outer.style.top = '0px';
  outer.style.left = '0px';
  outer.style.visibility = 'hidden';
  outer.style.width = '100px';
  outer.style.height = '150px';
  outer.style.overflow = 'hidden';
  outer.appendChild(inner);

  document.body.appendChild(outer);
  let w1 = inner.offsetWidth;
  outer.style.overflow = 'scroll';
  let w2 = inner.offsetWidth;
  if (w1 == w2) w2 = outer.clientWidth;

  document.body.removeChild(outer);

  return w1 - w2;
}

export default { debounce, getScrollbarWidth };
