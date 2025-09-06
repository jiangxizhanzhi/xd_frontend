import { request } from '@cyber/helper';

// Top5训练得分
export function queryTrainingScore(data) {
  return request.get(`/cr/training_team/situation/score`, data, {
    baseURL: '/api/ojj',
  });
}

// 态势信息接口（左侧及底部）
export function querySituationInfo(data) {
  return request.get(`/cr/training_team/situation/info/`, data, {
    baseURL: '/api/ojj',
  });
}

// 资产统计
export function queryAssets(data) {
  return request.get('/cscene/monitor/flow/assets_statistics', data, {
    baseURL: '/api/mp',
  });
}

// 攻击趋势攻击流量
export function queryAttackTrend(data) {
  return request.get('/cscene/monitor/flow/scene_trend', data, {
    baseURL: '/api/mp',
  });
}
// 攻击日志
export function queryAttackLog(data) {
  return request.get('/cscene/monitor/flow/page', data, {
    baseURL: '/api/mp',
  });
}
// 实时攻击
export function queryAttackTimes(data) {
  return request.get('/cscene/monitor/flow/risk_count', data, {
    baseURL: '/api/mp',
  });
}
