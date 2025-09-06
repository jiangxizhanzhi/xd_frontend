// 获取组织
import { request } from '@cyber/helper';
export function getOrganization() {
  return request.get('/auth/orgs/tree/', null, { baseURL: '/api/mp' });
}
// 删除公告
export function deleteSelectNotice(data) {
  return request.delete('/sys/notice/', data, { baseURL: '/api/mp' });
}

// 获取角色接口
export function roleData() {
  return request.get('/auth/roles/all/', null, { baseURL: '/api/mp' });
}

//获取类型数据
export function typeData() {
  return request.get('sys/notice/types', null, {
    baseURL: '/api/mp',
  });
}
