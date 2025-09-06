import axios from 'axios';
import qs from 'qs';
import _ from 'lodash';
import { ss } from './storage.js';

const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API || '/api/oj/api',

  withCredentials: true,
  crossDomain: true,
  timeout: 1200000, // 20 mins
  paramsSerializer(params) {
    return qs.stringify(params, { indices: false });
  },
});

function apiAxios(method = 'GET', url, params, opt = {}) {
  const { headers = {}, onUploadProgress, responseType = '' } = opt;
  if (opt.jsonData) {
    headers['Content-Type'] = 'application/json;charset=UTF-8';
  }
  method = method.toUpperCase();
  const httpDefault = {
    method,
    baseURL: process.env.VUE_APP_BASE_API || '/api/oj/api',
    url: url,
    params: method === 'GET' ? params : null,
    data:
      method === 'POST' ||
      method === 'PUT' ||
      method === 'PATCH' ||
      method === 'DELETE' ||
      opt.jsonData
        ? params
        : null,
    headers,
    responseType,
    onUploadProgress,
  };

  return new Promise((resolve, reject) => {
    service(httpDefault)
      .then(resolve)
      .catch((response) => {
        const buildMockResponse = (data) => {
          return {
            data,
            headers,
          };
        };
        if (opt && opt.mock && ss.get('mock')) {
          const statusCode = _.get(response, 'response.status');
          let mocker = opt.mock[`${statusCode}`];
          if (!mocker) {
            if (statusCode >= 300) {
              mocker = opt.mock.error;
            }
          }
          if (mocker) {
            if (typeof mocker === 'function') {
              const mockerResult = mocker(params, response);
              if (
                mockerResult.then &&
                typeof mockerResult.then === 'function'
              ) {
                mockerResult.then((data) => {
                  resolve(buildMockResponse(data));
                });
              } else {
                resolve(buildMockResponse(mockerResult));
              }
            } else {
              resolve(buildMockResponse(mocker));
            }
          }
        }
        reject(response);
      });
  });
}

export default {
  service,
  apiAxios,
  getAxios: (url, params, opt) => apiAxios('GET', url, params, opt),
  postAxios: (url, params, opt) => apiAxios('POST', url, params, opt),
  putAxios: (url, params, opt) => apiAxios('PUT', url, params, opt),
  deleteAxios: (url, params, opt) => apiAxios('DELETE', url, params, opt),
  patchAxios: (url, params, opt) => apiAxios('PATCH', url, params, opt),

  registerRequestInterceptor(onSuccess, onError) {
    service.interceptors.request.use(
      (config) => onSuccess(config),
      (error) => onError(error),
    );
  },
  registerResponseInterceptor(onSuccess, onError) {
    service.interceptors.response.use(
      (config) => onSuccess(config),
      (error) => onError(error),
    );
  },
};
