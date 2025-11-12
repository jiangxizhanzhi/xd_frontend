import { request } from '@cyber/helper';
// 接口管理
// 新增
export function addInterfaceApi(data) {
  return request.post('/devops/cluster/interface', data, {
    baseURL: '/api/mp',
  });
}

// 编辑
export function editInterfaceApi(data) {
  return request.post('/devops/cluster/interface/modify', data, {
    baseURL: '/api/mp',
  });
}

// 查询详情
export function getInterfaceApiDetail(id) {
  return request.get(`/devops/cluster/interface/${id}`, null, {
    baseURL: '/api/mp',
  });
}

// 删除
export function deleteInterface(id) {
  return request.delete(`/devops/cluster/interface/${id}`, null, {
    baseURL: '/api/mp',
  });
}
