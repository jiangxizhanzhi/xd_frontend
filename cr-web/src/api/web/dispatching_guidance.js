import { request as request1 } from '@cyber/helper';

//导演停止靶场
export function TimeManagement(url, query) {
  return request1.post('/cr/director/red_vs_blue/red_vs_blue/stop', query, {
    baseURL: '/api/ojj',
  });
}

// 导演暂停靶场
export function pauseScene(url, query) {
  return request1.post('/cr/red_vs_blue/scene/pause', query, {
    baseURL: '/api/ojj',
  });
}

// 导演恢复靶场
export function resumeScene(url, query) {
  return request1.post('/cr/red_vs_blue/scene/unpause', query, {
    baseURL: '/api/ojj',
  });
}
