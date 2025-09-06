import _ from 'lodash';
import { request } from '@cyber/helper';

class Error {
  constructor(code, error) {
    _.assign(this, { code, error });
  }
}

export function saveImageCommonWeb(data) {
  return request.post('/common/web/image_upload', data, {
    baseURL: '/api/ojj',
  });
}

export function saveImageCommonAdmin(data) {
  return request.post('/common/admin/image_upload', data, {
    baseURL: '/api/ojj',
  });
}

// 任务md解析包上传

export function uploadMd(data) {
  return request.post('/common/parse/md/', data, {
    baseURL: '/api/ojj',
  });
}

export function getOrganization() {
  return request.get('/auth/orgs/tree', null, {
    baseURL: '/api/mp',
  });
}

export function getSystemSettingAllConfig() {
  return request.get('/sys/config/all', null, {
    baseURL: '/api/mp',
  });
}

export function getComConstantsConfig(data) {
  return request.get('/cr/common/constants_config', data, {
    baseURL: '/api/ojj',
  });
}

// 节点关机
export const nodeShutDown = (data) => {
  return request.post(`/cs/scene/node/stop/`, data, {
    baseURL: '/api/ojj',
  });
};
// 节点开机
export const nodeShutUp = (data) => {
  return request.post(`/cs/scene/node/start/`, data, {
    baseURL: '/api/ojj',
  });
};
