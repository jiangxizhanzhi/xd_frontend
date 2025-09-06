import { getToken, request } from '@cyber/helper';
import _ from 'lodash';
import dayjs from 'dayjs';
import allZhList from '@/locales/zh-CN/index.js';

const formatDate = (time, format = 'YYYY-MM-DD HH:mm:ss') => {
  if (!time) {
    return '';
  }
  return dayjs(time).format(format);
};
let requestURL = '/unauth/event_tracking/record';
let action = 'post';
const config = {
  baseURL: '/api/mp',
  intercept: true,
};

export function webTrack(event, type, route) {
  let token = getToken();
  let userInfo = {};
  if (token) {
    let arr = token && token.split('.');
    userInfo = JSON.parse(window.atob(arr[1]));
  }
  // let innerText =
  //   event && event.target
  //     ? event.target.innerText || event.target.innerHTML
  //     : route.name;
  let innerText = '';
  if (event) {
    if (event.target.nodeName === 'svg') {
      innerText = event.target.nextElementSibling.innerText;
    } else if (event.target.nodeName === 'use') {
      innerText = event.target.parentElement.nextElementSibling.innerText;
    } else {
      innerText = event.target.innerText;
    }
  } else {
    // val.charCodeAt()小于等于255是英文字符，大于255是中文
    if (route.meta.title.charCodeAt() <= 255) {
      const data = route.meta.title.split('.');
      innerText = allZhList[data[0]][data[1]];
    } else {
      innerText = route.meta.title;
    }
  }
  // let baseURI = event.target?.baseURI;
  let routeName = route.name;
  const data = {
    //触发类型
    operation_type: type,
    // 当前url
    currentUrl: route.fullPath,
    //按钮文本
    title: innerText,
    //携带参数
    parameter: JSON.stringify(route.params),
    // 操作时间
    create_time: formatDate(new Date()),
    // 当前模块名称
    module: route.meta.module,
    // 用户id
    user_id: userInfo.id || '',
    // 用户名称
    user_name: userInfo.username || '',
  };
  // 暂时注释埋点接口
  // return request[action](requestURL, data, config);
}
