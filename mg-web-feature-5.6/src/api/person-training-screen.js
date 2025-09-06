import { request } from '@cyber/helper';
// 组织、个人、复合排名
export function rankCollect() {
  return request.get('/rtks/situation/ranking/', null, { baseURL: '/api/ojj' });
}
// 动态
export function talentNews() {
  return request.get('/rtks/situation/news/', null, { baseURL: '/api/ojj' });
}
// 人才发展趋势
export function talentTrend() {
  return request.get('/rtks/situation/trend/', null, { baseURL: '/api/ojj' });
}
// 人才岗位态势
export function talentPosition() {
  return request.get('/rtks/situation/situation/', null, {
    baseURL: '/api/ojj',
  });
}
