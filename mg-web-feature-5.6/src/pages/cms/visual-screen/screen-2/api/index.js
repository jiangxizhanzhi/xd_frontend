import { request } from '@cyber/helper';

// export function queryAttackFlow(data) {
//   return request.get('/cscene/monitor/flow/scene_trend', data, {
//     baseURL: '/api/mp',
//   });
// }

// export function queryAttackKind(data) {
//   return request.get('/cscene/monitor/flow/attack_type_count', data, {
//     baseURL: '/api/mp',
//   });
// }

export function queryAttackDynamic(data) {
  return request.get('/cr/report_statistics/attack/dy', data, {
    baseURL: '/api/ojj',
  });
}

export function queryMissionScore(data) {
  return request.get('/cr/report_statistics/subject/ranking', data, {
    baseURL: '/api/ojj',
  });
}

export function queryMissionComplete(data) {
  return request.get('/cr/report_statistics/subject/st', data, {
    baseURL: '/api/ojj',
  });
}

export function queryRank(data) {
  return request.get('/cr/report_statistics/ranking', data, {
    baseURL: '/api/ojj',
  });
}

export function querySubRank(data) {
  return request.get('/cr/report_statistics/subject/ranking', data, {
    baseURL: '/api/ojj',
  });
}

export function querySystem(data) {
  return request.get('/cr/report_statistics/system', data, {
    baseURL: '/api/ojj',
  });
}

export function queryAttackLog(data) {
  return request.get('/cr/report_statistics/attack/log', data, {
    baseURL: '/api/ojj',
  });
}

export function queryAttackCount(data) {
  return request.get('/cr/report_statistics/sttack/st', data, {
    baseURL: '/api/ojj',
  });
}

export function queryAttackDevice(data) {
  return request.get('/cr/report_statistics/attack/attack_ip_count', data, {
    baseURL: '/api/ojj',
  });
}
export function queryAttackFlow(data) {
  return request.get('/cr/report_statistics/attack/scene_trend', data, {
    baseURL: '/api/ojj',
  });
}

export function queryAttackKind(data) {
  return request.get('/cr/report_statistics/attack/attack_type_count', data, {
    baseURL: '/api/ojj',
  });
}
