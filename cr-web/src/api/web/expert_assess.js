import { request as request1 } from '@cyber/helper';

//裁判登录点击历史任务获取学员评估记录
export function getTaskList(url, query) {
  return request1.get('/cr/red_vs_blue/referee/mission_evaluation', query, {
    baseURL: '/api/ojj',
  });
}

//裁判裁定评判任务评估人工评估
export function evaluationSubmit(url, query) {
  return request1.post('/cr/red_vs_blue/referee/submit_evaluation', query, {
    baseURL: '/api/ojj',
  });
}
// 裁判登录获取统计数据
export function getTaskCount(url, query) {
  return request1.get('/cr/red_vs_blue/referee/get_statistical_info', query, {
    baseURL: '/api/ojj',
  });
}
