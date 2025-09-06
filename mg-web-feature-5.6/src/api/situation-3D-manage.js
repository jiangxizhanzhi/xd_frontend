import { request } from '@cyber/helper';

// 分类列表
export function getEffectCategory(data) {
  return request.get('/situation/effect/category/list', data, {
    baseURL: '/api/ojj',
  });
}

// 删除分类
export function deleteEffectCategory(data) {
  return request.delete('/situation/effect/category', data, {
    baseURL: '/api/ojj',
  });
}

// 动效列表
export function getEffectList(data) {
  return request.get('/situation/effect/page', data, {
    baseURL: '/api/ojj',
  });
}
