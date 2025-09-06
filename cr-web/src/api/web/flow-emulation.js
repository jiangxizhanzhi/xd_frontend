import { request } from '@cyber/helper';

// 主机信息
const getMainInfoList = (id) => {
  return request.get(
    `/cscene/monitor/scene/all_elements/${id}/?realTimeHostState=false`,
    null,
    {
      baseURL: '/api/mp',
    },
  );
};

// 流量回放
const getFlowRecordData = (data) => {
  return request.post(`/cscene/cscene_instances/query_flow_records`, data, {
    baseURL: '/api/mp',
  });
};

// 全部启动
const allStartFlow = (data) => {
  return request.post(`/cr/eval/task/flow/all_start`, data, {
    baseURL: '/api/ojj',
  });
};

// 下载流量
const downloadFlow = (data) => {
  return request.get(`/cr/eval/task/flow/download`, data, {
    baseURL: '/api/ojj',
  });
};

// 启动
const batchStart = (data) => {
  return request.post(`/cr/eval/task/flow/batch_start`, data, {
    baseURL: '/api/ojj',
  });
};

// 修改源IP
const editSourceIp = (data) => {
  return request.post(`/cr/eval/task/flow/source_ip`, data, {
    baseURL: '/api/ojj',
  });
};

// 保持运行状态接口
const keepRunning = (data) => {
  return request.get(`/cr/eval/task/flow/list/running`, data, {
    baseURL: '/api/ojj',
  });
};

export {
  getMainInfoList,
  getFlowRecordData,
  allStartFlow,
  downloadFlow,
  batchStart,
  editSourceIp,
  keepRunning,
};
