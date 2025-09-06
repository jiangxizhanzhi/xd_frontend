import { request } from '@cyber/helper';
export function getSceneInfo(id) {
  return request.get(`/cscene/monitor/scene/info/${id}`, null, {
    baseURL: '/api/mp',
  });
}
export function getAggrTop(data) {
  return request.get(`/cscene/monitor/event/aggr_top/`, data, {
    baseURL: '/api/mp',
  });
}
export function getAggr(data) {
  return request.get(`/cscene/monitor/event/aggr/`, data, {
    baseURL: '/api/mp',
  });
}
export function getHost(data) {
  return request.get(`/cscene/cscene_instances/list_host_events/`, data, {
    baseURL: '/api/mp',
  });
}

export function getFlow(data) {
  return request.get(`/cscene/monitor/flow/page/`, data, {
    baseURL: '/api/mp',
  });
}

export function getFlowRisk(data) {
  return request.get(`/cscene/monitor/flow/risk_count/`, data, {
    baseURL: '/api/mp',
  });
}

export function getSceneData(data) {
  return request.get(`/cscene/cscene_instances/`, data, {
    baseURL: '/api/mp',
  });
}

export function getFlowTrend(data) {
  return request.get(`/cscene/monitor/flow/scene_trend/`, data, {
    baseURL: '/api/mp',
  });
}

export function getSceneTrend(data) {
  return request.get(`/cscene/monitor/hoststate/scene_trend/`, data, {
    baseURL: '/api/mp',
  });
}
export function getSceneStates(id) {
  return request.get(`/cscene/monitor/scene/all_elements/${id}`, null, {
    baseURL: '/api/mp',
  });
}

//导出全部流量文件
export function exportAllTraffic(data) {
  return request.get(`/cscene/monitor/flow/export/`, data, {
    baseURL: '/api/mp',
  });
}

//查询全部流量
export function getAllTraffic(data) {
  return request.get(`/cscene/monitor/flow/page/`, data, {
    baseURL: '/api/mp',
  });
}

//查询导出流量文件生成进度
export function getTrafficFileGenerateProgress(data) {
  return request.get(`/cscene/monitor/flow/export/process`, data, {
    baseURL: '/api/mp',
  });
}
