import { request as request1 } from '@cyber/helper';

//学员登录获取任务方案信息

export function getUserTaskList(url, query) {
  return request1.get('/cr/red_vs_blue/user/get_mission_info', query, {
    baseURL: '/api/ojj',
  });
}

// 学员登录开始答题
export function beginMission(url, query) {
  return request1.post('/cr/red_vs_blue/user/begin_mission', query, {
    baseURL: '/api/ojj',
  });
}

//学员答题后点击上报
export function submitAnswer(url, query) {
  return request1.post('/cr/red_vs_blue/user/submit_missions', query, {
    baseURL: '/api/ojj',
  });
}
