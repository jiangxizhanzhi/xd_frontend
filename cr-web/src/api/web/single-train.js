import { request } from '@cyber/helper';
const baseURL = '/api/ojj';
const baseMpURL = '/api/mp';
//  训练类型
const getTrainingCategory = (data) => {
  return request.get(`/cr/common/constants_config/`, data, {
    baseURL: baseURL,
  });
};

// 训练难度
const getDifficultLists = (data) => {
  return request.get(`/cr/common/constants_config/`, data, {
    baseURL: baseURL,
  });
};

// 获取单兵训练列表
const getTrainList = (data) => {
  return request.get(`/cr/single_train/room/list/`, data, {
    baseURL: baseURL,
  });
};

// 获取场景数据
const getSceneData = (data) => {
  return request.get(`/cr/single_train/room/scene/`, data, {
    baseURL: baseURL,
  });
};
/**
 * 场景启动
 */
const sceneStart = (data) => {
  return request.post(`/cr/single_train/room/`, data, {
    baseURL: baseURL,
  });
};

/**
 * 场景关闭
 */
const sceneClose = (data) => {
  return request.delete(`/cr/single_train/room/`, data, {
    baseURL: baseURL,
  });
};
/**
 * 重启
 * @returns
 */
const nodeRestart = (data) => {
  return request.post(`/cr/single_train/room/scene/node/restart/`, data, {
    baseURL: baseURL,
  });
};
/**
 * 重建
 * @returns
 */
const nodeRecreate = (data) => {
  return request.post(`/cr/single_train/room/scene/node/recreate/`, data, {
    baseURL: baseURL,
  });
};
// 关机
const nodeShutDown = (data) => {
  return request.post(`/cs/scene/node/stop/`, data, {
    baseURL: baseURL,
  });
};
// 开机
const nodeShutUp = (data) => {
  return request.post(`/cs/scene/node/start/`, data, {
    baseURL: baseURL,
  });
};
/**
 * 时间轴接口
 * @param {} data
 * @returns
 */
const timeLine = (data) => {
  return request.get(`/cr/single_train/room/time_line/`, data, {
    baseURL: baseURL,
  });
};
/**
 * 获取详情接口
 * @param {*} data
 * @returns
 */
const singleDetail = (data) => {
  return request.get(`/cr/single_train/room/`, data, {
    baseURL: baseURL,
  });
};
/**
 * 接入方式
 * @returns
 */
const getConnection = (data) => {
  return request.post(`/cscene/cscene_instances/get_connection/`, data, {
    baseURL: baseMpURL,
  });
};
/**
 * 训练记录
 */
const trainHistory = (data) => {
  return request.get(`/cr/single_train/room/train_history/`, data, {
    baseURL: baseURL,
  });
};
// 任务详情
const trainMission = (data) => {
  return request.get(`/cr/single_train/room/mission/`, data, {
    baseURL: baseURL,
  });
};
// 上报任务 /cr/single_train/room/mission_submit
const missionSubmit = (data) => {
  return request.post(`/cr/single_train/room/mission_submit/`, data, {
    baseURL: baseURL,
  });
};
// 获取记录详情
const recordDetail = (data) => {
  return request.get(`/cr/single_train/single_train/record/detail/`, data, {
    baseURL: baseURL,
  });
};
// 获取任务矩阵和训练进度
const missionMatrix = (data) => {
  return request.get(`/cr/single_train/room/mission/matrix/`, data, {
    baseURL: baseURL,
  });
};
// 导出pdf
const exportPdf = (data) => {
  return request.binaryDownload(
    'get',
    `/cr/single_train/single_train/train2pdf/`,
    data,
    {
      baseURL: baseURL,
    },
  );
};
// 训练手册
const trainManual = (data) => {
  return request.get(`/cr/single_train/room/train_manual/`, data, {
    baseURL: baseURL,
  });
};
// 资产清单查询
const assetList = (data) => {
  return request.get(`/cr/single_train/room/asset/list/`, data, {
    baseURL: baseURL,
  });
};
// 查询操作系统
const osList = (data) => {
  return request.get(`/cr/single_train/room/os/list/`, data, {
    baseURL: baseURL,
  });
};
export {
  getTrainingCategory,
  getDifficultLists,
  getTrainList,
  getSceneData,
  sceneStart,
  sceneClose,
  nodeRestart,
  nodeRecreate,
  nodeShutDown,
  nodeShutUp,
  timeLine,
  singleDetail,
  getConnection,
  trainHistory,
  trainMission,
  missionSubmit,
  recordDetail,
  missionMatrix,
  exportPdf,
  trainManual,
  assetList,
  osList,
};
