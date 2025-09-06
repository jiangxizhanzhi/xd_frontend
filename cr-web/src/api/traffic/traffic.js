import { request } from '@cyber/helper';

//获取背景流量类型列表数据
export function getOptionList() {
  return request.get('/flow/info/categories', null, {
    baseURL: '/api/mp',
  });
}

// 获取demo file
export function fetchDemoFile(data) {
  const params = {};
  if (data) {
    params.type = data; //探针
  } else {
    params.type = 1; //流量
  }
  return request.get('/flow/scriptdemo/list', params, {
    baseURL: '/api/mp',
  });
}

// 删除方案集合中的流量
export function deleteSchemeTraffic(collection_id, flow_ids) {
  return request.delete(
    '/flow/collection/collection_rel',
    { collection_id, flow_ids },
    {
      baseURL: '/api/mp',
    },
  );
}

// 添加方案流量中的流量
export function importSchemeFlow(collection_id, flow_ids) {
  return request.post(
    '/flow/collection/collection_rel',
    {
      collection_id,
      flow_ids,
    },
    { baseURL: '/api/mp' },
  );
}

// 查询流量分析规则所有协议
export function getRuleProtocol(data) {
  return request.get('/suricata/rule/protocols', data, { baseURL: '/api/mp' });
}

// pcap文件导入接口,导入成功返回协议集合
export function importPcap(data) {
  return request.post('/flow/info/analyse', data, { baseURL: '/api/mp' });
}

//新增流量分类
export function addFlowCatagory(data) {
  return request.post('/flow/info/add_category', data, { baseURL: '/api/mp' });
}

//编辑流量分类
export function editFlowCatagory(data) {
  return request.post('/flow/info/edit_category', data, { baseURL: '/api/mp' });
}

//删除流量分类
export function deleteFlowCatagory(data) {
  return request.delete('/flow/info/delete_categories', data, {
    baseURL: '/api/mp',
  });
}

//查询流量分类
export function getFlowCatagory(data) {
  return request.get('/flow/info/categories/detail', data, {
    baseURL: '/api/mp',
  });
}
//查询流量攻击协议列表
export function getFlowProtocols() {
  return request.get('/cscene/monitor/flow/flow_protocols', undefined, {
    baseURL: '/api/mp',
  });
}
