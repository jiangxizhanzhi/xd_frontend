import { request } from '@cyber/helper';

// 攻击手法Top5
export function queryAttackType(data) {
  return request.get('/cscene/monitor/flow/attack_type_count', data, {
    baseURL: '/api/mp',
  });
}

//攻击动态接口
// 3D拓扑真实攻击动态展示接口
export function dynamicAttack(data) {
  return request.get('/situation/dynamic/attack', data, {
    baseURL: '/api/ojj',
  });
}
//是否保留todo
//获取节点链路状态
export function nodeLinkStatus(data) {
  return request.get('/situation/link_status', data, {
    baseURL: '/api/ojj',
  });
}

//态势大屏根据接口返回时间请求间隔时间
//获取态势场景配置
export function getSituFn(data) {
  return request.get('/situation/scene_config', data, {
    baseURL: '/api/ojj',
  });
}
//刷新态势场景配置
export function refreshSituFn(data) {
  return request.get('/situation/refresh_data', data, {
    baseURL: '/api/ojj',
  });
}

// 攻击日志
export function queryAttackLog(data) {
  return request.get('/cscene/monitor/flow/page', data, {
    baseURL: '/api/mp',
  });
}

// 攻击趋势攻击流量
export function queryAttackTrend(data) {
  return request.get('/cscene/monitor/flow/scene_trend', data, {
    baseURL: '/api/mp',
  });
}

// 主机状态
export function queryHostStatus(data) {
  return request.get('/cscene/monitor/flow/scene_target_status', data, {
    baseURL: '/api/mp',
  });
}

// 受攻击端口
export function queryAttackPort(data) {
  return request.get('/cscene/monitor/flow/scene_attacked_port', data, {
    baseURL: '/api/mp',
  });
}

// 受攻击主机
export function queryAttackHost(data) {
  return request.get('/cscene/monitor/flow/attack_ip_count', data, {
    baseURL: '/api/mp',
  });
}

// 资产统计
export function queryAssets(data) {
  return request.get('/cscene/monitor/flow/assets_statistics', data, {
    baseURL: '/api/mp',
  });
}
