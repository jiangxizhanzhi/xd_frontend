/*
 * 大文件上传、分片上传
 */
import { request } from '@cyber/helper';

// 校验
export function getUploadStatus(data) {
  return request.get('/chunk/upload/check', data, {
    baseURL: '/api/ojj',
  });
}

// 上传
export function sliceUpload(data) {
  return request.post('/chunk/upload', data, {
    baseURL: '/api/ojj',
  });
}

// 合并
export function mergeUpload(data) {
  return request.post('/chunk/upload/merge', data, {
    baseURL: '/api/ojj',
  });
}

export default { getUploadStatus, sliceUpload, mergeUpload };
