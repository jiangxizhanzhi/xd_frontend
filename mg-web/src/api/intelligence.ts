// @ts-ignore
import { request } from '@cyber/helper';

// 获取智能体列表数据
export function getKnapsackData(data: any) {
  return request.get('/info/v1/gpts_info', data, {
    baseURL: '/knapsack',
  });
}
// 根据报告ID获取用户画像报告详情
export function getProfileReportDetail(data: any) {
  return request.get('/ai/user_profile/report/detail', data, {
    baseURL: '/api/ojj',
  });
}
// 获取用户画像报告列表
export function getProfileReportList(data: any) {
  return request.get('/ai/user_profile/report/list', data, {
    baseURL: '/api/ojj',
  });
}
