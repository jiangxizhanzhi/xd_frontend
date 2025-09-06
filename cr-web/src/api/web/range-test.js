import { request } from '@cyber/helper';

// 获取测评类型
const getCategory = (data) => {
  return request.get(`/cr/common/constants_config`, data, {
    baseURL: '/api/ojj',
  });
};

// 获取测评列表数据
const getAllTest = (data) => {
  return request.get(`/cr/eval/template/list`, data, {
    baseURL: '/api/ojj',
  });
};

// 增加测评
const addTest = (data) => {
  return request.post(`/cr/eval/template`, data, {
    baseURL: '/api/ojj',
  });
};

// 删除测评
const deleteCurrentTest = (data) => {
  return request.delete(`/cr/eval/template`, data, {
    baseURL: '/api/ojj',
  });
};

// 查询当前测评回显数据

const getEditBackData = (data) => {
  return request.get(`/cr/eval/template/`, data, {
    baseURL: '/api/ojj',
  });
};

// 修改测评
const editTest = (data) => {
  return request.patch(`/cr/eval/template`, data, {
    baseURL: '/api/ojj',
  });
};

function getSceneData(data) {
  return request.get(`/cscene/cscene_instances/`, data, {
    baseURL: '/api/mp',
  });
}

const templateList = (data) => {
  return request.get(`/cr/eval/template/task_list`, data, {
    baseURL: '/api/ojj',
  });
};
//获取所有采集类别
const getEventType = (data) => {
  return request.get(`cscene/collection/type/list/`, data, {
    baseURL: '/api/mp',
  });
};

// 修改评估算法
const editRef = (data) => {
  return request.patch(`/cr/eval/index/ref/`, data, {
    baseURL: '/api/ojj',
  });
};
// 评估接口
const recordStart = (data) => {
  return request.post(`/cr/eval/record/start/`, data, {
    baseURL: '/api/ojj',
  });
};
// 评估详情
const recordDetail = (data) => {
  return request.get(`/cr/eval/record/result/`, data, {
    baseURL: '/api/ojj',
  });
};
// 评估任务结果-5轮评估记录
const recordHistory = (data) => {
  return request.get(`/cr/eval/record/result/list/`, data, {
    baseURL: '/api/ojj',
  });
};
// 编辑算法
const editAlgorithm = (data) => {
  return request.put(`/cr/eval/algorithm/ref/`, data, {
    baseURL: '/api/ojj',
  });
};
// 查询算法
const queryAlgorithm = (data) => {
  return request.get(`/cr/eval/algorithm/ref/`, data, {
    baseURL: '/api/ojj',
  });
};
export {
  getCategory,
  getAllTest,
  addTest,
  deleteCurrentTest,
  getEditBackData,
  editTest,
  getSceneData,
  templateList,
  getEventType,
  editRef,
  recordStart,
  recordDetail,
  recordHistory,
  editAlgorithm,
  queryAlgorithm,
};
