import _ from 'lodash';
import { request } from '@cyber/helper';
// 超融合平台管理
// 新增
export function addPlatformApi(data) {
  return request.post('/devops/cluster/platform', data, {
    baseURL: '/api/mp',
  });
}

// 编辑
export function editPlatformApi(data) {
  return request.post('/devops/cluster/platform/modify', data, {
    baseURL: '/api/mp',
  });
}

// 查询详情
export function getPlatformApiDetail(id) {
  return request.get(`/devops/cluster/platform/${id}`, null, {
    baseURL: '/api/mp',
  });
}

// 删除
export function deletePlatform(id) {
  return request.delete(`/devops/cluster/platform/${id}`, null, {
    baseURL: '/api/mp',
  });
}
