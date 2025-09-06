import { request } from '@cyber/helper';

//审计日志模块
//后端返回审计日志模块分类
export function getAudioLogModels() {
  return request.get('/devops/log/operate/modules', null, {
    baseURL: '/api/mp',
  });
}

//后端返回审计日志类型
export function getAudioLogTypes() {
  return request.get('/devops/log/operate/types', null, {
    baseURL: '/api/mp',
  });
}

// 后端返回审计日志列表数据
export function getAudioList(data) {
  return request.get('/devops/log/operate/page', data, {
    baseURL: '/api/mp',
  });
}

// 后端返回日志其它字段消息 avatar name等 传入user_id数组
export function getAudioLogMessage(data) {
  return request.post('/auth/users/no_restrict/by_ids', data, {
    baseURL: '/api/mp',
  });
}

//运行日志模块
//后端返回运行日志类型
export function getRunLogTypes() {
  return request.get('/devops/log/runtime_log/types', null, {
    baseURL: '/api/mp',
  });
}

// 用户登录获取权限
export function getUserPermissions() {
  return request.get('/auth/user_permissions/menuidents/byloginuser', null, {
    baseURL: '/api/mp',
  });
}
