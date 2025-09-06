import { request } from '@cyber/helper';

export const getRoleData = () => {
  return request.get('/auth/roles/all', null, {
    baseURL: '/api/mp',
  });
};
export function getSystemSettingAllConfig() {
  return request.get('/sys/config/common', null, {
    baseURL: '/api/mp',
  });
}
export function getSystemSettingSystemConfig() {
  return request.get('/sys/config/all', null, {
    baseURL: '/api/mp',
  });
}
export function uploadImgageMp(data) {
  return request.post('/base/file/upload', data, {
    baseURL: '/api/mp',
  });
}
// 系统logo
export function uploadSystemImgageMp(data) {
  return request.post('/sys/config/logo/upload', data, {
    baseURL: '/api/mp',
  });
}
// VPN文件
export function uploadSystemVPNMp(data) {
  return request.post('/sys/config/vpn/upload', data, {
    baseURL: '/api/mp',
  });
}
// 系统公告-上传图片
export function uploadNoticeImage(data) {
  return request.post('/common/markdown/image_upload', data, {
    baseURL: '/api/mp',
  });
}
// 系统公告-上传文件
export function uploadNoticeFile(data) {
  return request.post('/common/markdown/file_upload', data, {
    baseURL: '/api/mp',
  });
}
// md解析包上传

export function uploadMd(data) {
  return request.post('/common/parse/md/', data, {
    baseURL: '/api/ojj',
  });
}
//  删除留言
export function deleteMessage(data) {
  return request.delete('/oj/admin/comment', data, {
    baseURL: '/api/ojj',
  });
}

// 版本信息模块
export function getAuthorizationModule() {
  return request.get('/sys/activation/module_infos', null, {
    baseURL: '/api/mp',
  });
}

// 版本信息模块
export function getSysVersion() {
  return request.get('/sys/version/list', null, {
    baseURL: '/api/mp',
  });
}

// 获取授权模块信息
export function getModulesActivedApi() {
  return request.get('/sys/activation/status', null, {
    baseURL: '/api/mp',
  });
}
