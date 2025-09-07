import { request } from '@cyber/helper';

export function getSceneTemplateListApi(data) {
  return request.get('/admin/ceBase/crEvents/list', data, {
    baseURL: '/api/ojj',
  });
}