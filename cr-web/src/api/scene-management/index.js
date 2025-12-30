import { request } from '@cyber/helper';

export function getSceneTemplateListApi(data) {
  return request.get('/admin/ceBase/crEvents/list', data, {
    baseURL: '/api/ojj',
  });
}

// 复制模板接口
export function copySceneTemplateApi(data) {
  return request.post('/cr/team_train/template/copy', data, {
    baseURL: '/api/ojj',
  });
}

// 创建单兵训练
export function copySingleTrainApi(data) {
  return request.post('/cr/team_train/template/copy_to_single_train', data, {
    baseURL: '/api/ojj',
  });
}
