import _ from 'lodash';
import axios from 'axios';
import qs from 'qs';

import { getToken, getRouter, removeToken, logout } from '@cyber/helper';

// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // api 的 base_url
  withCredentials: true, // 跨域请求时发送 cookies
  crossDomain: true,
  timeout: 5000, // request timeout
  paramsSerializer(params) {
    return qs.stringify(params, { indices: false });
  },
});

// request interceptor
service.interceptors.request.use(
  (config) => {
    const jwtToken = getToken();
    if (jwtToken) {
      config.headers['Authorization'] = 'JWT ' + jwtToken;
    }
    return config;
  },
  (error) => {
    Promise.reject(error);
  },
);

// response interceptor
service.interceptors.response.use(
  (response) => response,

  (error) => {
    //没有认证时跳到login页面
    if (!_.isEmpty(error.response) && error.response.status === 401) {
      getRouter().push('/login');
    }
    if (!_.isEmpty(error.response) && error.response.status === 302) {
      getRouter().push({
        path: '/unauthorized',
      });
    }
    if (
      _.has(error, 'response.data.__global.message') &&
      error.response.data.__global.message === 'Signature has expired.'
    ) {
      removeToken();
      getRouter().push('/login');
    }
    if (!_.isEmpty(error.response) && error.response.status === 403) {
      logout();
    }
    return Promise.reject(error);
  },
);

export const request = (options) => {
  return service(options);
};

export const requestForm = (options) => {
  const formData = new FormData();
  _.forEach(options.data || {}, (value, key) => {
    if (Array.isArray(value)) {
      _.forEach(value, (val) => {
        formData.append(key, val);
      });
    } else {
      formData.append(key, value);
    }
  });
  options.data = formData;

  return request(options);
};
