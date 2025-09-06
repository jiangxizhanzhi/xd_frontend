import axios, { AxiosRequestConfig, Method } from 'axios';
import qs from 'qs';
import _ from 'lodash';
// @ts-ignore
import download from 'downloadjs';
import { getToken, removeToken, getHelper } from '../frame/utils/';

interface RequestConfig extends AxiosRequestConfig {
  silent: Boolean;
}
const axiosInstance = axios.create({
  baseURL: process.env.REQUEST_BASE_API || '/api',
  withCredentials: true,
  timeout: 1000 * 60 * 10,
  paramsSerializer(params) {
    return qs.stringify(params, { indices: false });
  },
});

function axiosRequest(
  method: Method,
  url: string,
  params?: any,
  data?: any,
  config: RequestConfig = { headers: {}, silent: false },
) {
  const jwtToken = getToken();

  if (jwtToken) {
    _.set(config, 'headers.Authorization', 'JWT ' + jwtToken);
  }
  const axiosConfig = {
    method,
    url: url,
    params,
    data,
    ...config,
  };
  const vm = getHelper().vm;

  return axiosInstance(axiosConfig)
    .then((res) => ({
      data: res.data,
      res,
    }))
    .catch((error) => {
      if (axiosConfig.silent) {
        return;
      }
      const infoCode = _.get(error.response, 'data.__global.code');
      const authentication_failed = infoCode === 'authentication_failed';

      if (error.response.status === 401 || authentication_failed) {
        removeToken();
        location.hash = 'login';
        location.reload();
      }
      if (error.response.status === 403) {
        vm.prototype.$error('没有执行该操作的权限');
        throw error;
      }
      throw error;
    });
}

export default {
  axiosInstance,
  get: (url: string, params?: any, config?: RequestConfig) =>
    axiosRequest('GET', url, params, null, config),
  delete: (url: string, data?: any, config?: RequestConfig) =>
    axiosRequest('DELETE', url, null, data, config),
  post: (url: string, data?: any, config?: RequestConfig) =>
    axiosRequest('POST', url, null, data, config),
  patch: (url: string, data?: any, config?: RequestConfig) =>
    axiosRequest('PATCH', url, null, data, config),
  put: (url: string, data?: any, config?: RequestConfig) =>
    axiosRequest('PUT', url, null, data, config),
  download,
};
