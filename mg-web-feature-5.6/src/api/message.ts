import { request } from '@cyber/helper';

// 获取消息
export function getNoticeApi(data) {
  return request.get('/sys/notice/currentuser/page', data, {
    baseURL: '/api/mp',
  });
}

// 读消息
export function readNotice(resource_id) {
  return request.post(`sys/notice/read/${resource_id}`, null, {
    baseURL: '/api/mp',
  });
}

// 删除消息
export function deleteNoticeApi(data) {
  return request.post('/sys/notice/unpush/', data, {
    baseURL: '/api/mp',
  });
}

// 获取未读消息
export function getUnreadNoticeApi() {
  return request.get('/sys/notice/unread_count', null, {
    baseURL: '/api/mp',
  });
}

// 延期提醒或不再提醒
export function postponeNotice(data) {
  return request.post('/sys/notice/delay_notice', data, {
    baseURL: '/api/mp',
  });
}

// 获取场景
export function getSceneListApi(data) {
  return request.get('/cscene/cscene_instances/list_stat/front', data, {
    baseURL: '/api/mp',
  });
}

// 删除场景
export function deleteSceneApi(data) {
  return request.delete(`/cscene/cscene_instances/?id=${data}`, null, {
    baseURL: '/api/mp',
  });
}

//批量刪除場景
export function deleteManySceneApi(data) {
  return request.delete('/cscene/cscene_instances/bulk_delete', data, {
    baseURL: '/api/mp',
  });
}

//获取场景类型
export function getSceneType() {
  return request.get('/cscene/cscene_instances/types', null, {
    baseURL: '/api/mp',
  });
}

// 红蓝获取角色信息
export function getRedSceneRole(data) {
  return request.get('/cr/red_vs_blue/red_vs_blue/get_role', data, {
    baseURL: '/api/ojj',
  });
}
