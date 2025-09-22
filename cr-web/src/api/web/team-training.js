import { request } from '@cyber/helper';
const baseMpURL = '/api/mp';

//  训练类型
const getTrainingCategoryApi = (data) => {
  return request.get(`/cr/common/constants_config`, data, {
    baseURL: '/api/ojj',
  });
};

// 训练难度
const getDifficultListsApi = (data) => {
  return request.get(`/cr/common/constants_config`, data, {
    baseURL: '/api/ojj',
  });
};

// 获取综合演训教员列表
const getTrainListApi = (data) => {
  return request.get(`/cr/team_train/room/list`, data, {
    baseURL: '/api/ojj',
  });
};

// 获取综合演训模板列表
const getTemplateListApi = (data) => {
  return request.get(`/cr/team_train/template/list`, data, {
    baseURL: '/api/ojj',
  });
};
// 封面上传
const uploadImageApi = (data) => {
  return request.post('/common/web/image_upload', data, {
    baseURL: '/api/ojj',
  });
};

// 综合演训新增训练
const createTrainingApi = (data) => {
  return request.post('/cr/team_train/room', data, {
    baseURL: '/api/ojj',
  });
};
// 团队编辑训练新增
const editTrainingCreateApi = (data) => {
  return request.put('/cr/team_train/room', data, {
    baseURL: '/api/ojj',
  });
};

//综合演训查询单个,训练详情
const getEditBackApi = (data) => {
  return request.get('/cr/team_train/room', data, {
    baseURL: '/api/ojj',
  });
};

//综合演训编辑训练
const editTrainingApi = (data) => {
  return request.put('/cr/team_train/room', data, {
    baseURL: '/api/ojj',
  });
};
// 综合演训教员删除训练
const deleteTrainingApi = (data) => {
  return request.delete('/cr/team_train/room', data, {
    baseURL: '/api/ojj',
  });
};

//团队教员获取训练状态
const getSceneStatusApi = (data) => {
  return request.get('/cr/team_train/room/start_end_team', data, {
    baseURL: '/api/ojj',
  });
};
// 团队教员结束训练
const endTrainingApi = (data) => {
  return request.post('/cr/team_train/room/start_end_team', data, {
    baseURL: '/api/ojj',
  });
};
// 团队教员开始训练
const startTrainingApi = (data) => {
  return request.post('/cr/team_train/room/start_end_team', data, {
    baseURL: '/api/ojj',
  });
};
// 教员获取时间轴数据
const getTimeLineApi = (data) => {
  return request.get('/cr/team_train/room/get_time_line', data, {
    baseURL: '/api/ojj',
  });
};
// 教员屏幕监控点击添加屏幕获取靶机列表,
const getMachineListApi = (data) => {
  return request.get('/cr/training_team/training_team_teacher/sessions', data, {
    baseURL: '/api/ojj',
  });
};
// 教员探针采集主机信息,获取机器基本信息
const getBasicInfoApi = (data) => {
  return request.get('/cscene/monitor/scene/element/os', data, {
    baseURL: '/api/mp',
  });
};
// 教员探针采集主机信息,获取CPU,内存,磁盘占用率,
const getChartPercentApi = (data) => {
  return request.get('/cscene/monitor/hoststate/element_trend', data, {
    baseURL: '/api/mp',
  });
};
// 教员探针采集主机信息,获取CPU,内存,磁盘主频,大小等数据
const getChartDataApi = (data) => {
  return request.get('/cscene/monitor/hoststate', data, {
    baseURL: '/api/mp',
  });
};
// 教员探针采集采集数据,获取所有事件类型
const getAllCollectTypeApi = (data) => {
  return request.get('/cscene/collection/type/list/', data, {
    baseURL: '/api/mp',
  });
};
// 初始化报告数据
const trainingReportApi = (data) => {
  return request.get(
    '/cr/training_team/training_team/get_training_report/',
    data,
    {
      baseURL: '/api/ojj',
    },
  );
};
// 获取训练手册
const trainManualApi = (data) => {
  return request.get('/cr/team_train/room/manual/', data, {
    baseURL: '/api/ojj',
  });
};
// 获取训练报告
const trainReportApi = (data) => {
  return request.get('/cr/team_train/room/mission/getTrainReports/', data, {
    baseURL: '/api/ojj',
  });
};
// 攻击事件
const attackMethodsApi = (data) => {
  return request.get('/cscene/monitor/flow/attack_type_count/', data, {
    baseURL: '/api/mp',
  });
};
// 攻击趋势
const attackTrendApi = (data) => {
  return request.get('/cscene/monitor/flow/scene_trend/', data, {
    baseURL: '/api/mp',
  });
};

// 学员角色相关接口
const baseURL = '/api/ojj';
// 获取场景信息接口
const getTopologyApi = (data) => {
  return request.get('/cr/team_train/room/scene/', data, {
    baseURL: baseURL,
  });
};
//  获取任务说明信息
const studentInfoApi = (data) => {
  return request.get('/cr/training_team/training_team_students/', data, {
    baseURL: baseURL,
  });
};
//  获取学员任务
const studentTaskApi = (data) => {
  return request.get(
    '/cr/training_team/training_team_students/get_mission_scheme/',
    data,
    {
      baseURL: baseURL,
    },
  );
};

//  [前台]学员-获取任务时间轴
const studentTimeLineApi = (data) => {
  return request.get(
    '/cr/training_team/training_team_students/get_time_line/',
    data,
    {
      baseURL: baseURL,
    },
  );
};
//  团队学员节点重启
const nodeStartApi = (data) => {
  return request.post('/cr/team_train/room/scene/node/restart/', data, {
    baseURL: baseURL,
  });
};
//团队学员节点重建
const nodeBuildApi = (data) => {
  return request.post('/cr/team_train/room/scene/node/recreate/', data, {
    baseURL: baseURL,
  });
};
/**
 * 接入方式
 * @returns
 */
const getConnectionApi = (data) => {
  return request.post(`/cscene/cscene_instances/get_connection/`, data, {
    baseURL: baseMpURL,
  });
};

// 教员任务裁决获取任务概览数据
const getTaskCountApi = (data) => {
  return request.get(
    '/cr/training_team/training_team_teacher/get_statistical_info',
    data,
    {
      baseURL: '/api/ojj',
    },
  );
};
// 教员任务裁决获取任务裁决评估列表
const getAssessListApi = (data) => {
  return request.get(
    '/cr/training_team/training_team/scene_mission_evaluations',
    data,
    {
      baseURL: '/api/ojj',
    },
  );
};

// 教员任务裁决获取角色列表
const getRoleApi = (data) => {
  return request.get('/cr/training_team/training_team_teacher/roles', data, {
    baseURL: '/api/ojj',
  });
};
// 教员任务裁决获取用户列表
const getUserApi = (data) => {
  return request.get('/cr/team_train/room/get_user_list', data, {
    baseURL: '/api/ojj',
  });
};
//教员评判任务评估人工评估
const evaluationSubmitApi = (data) => {
  return request.post(
    '/cr/training_team/training_team/submit_evaluation',
    data,
    {
      baseURL: '/api/ojj',
    },
  );
};
//教员获取任务裁决的评估列表
const getEvaluationApi = (data) => {
  return request.get(
    '/cr/training_team/training_team_teacher/evaluation/list',
    data,
    {
      baseURL: '/api/ojj',
    },
  );
};

//教员任务导调获取任务进度
const getTaskProgressApi = (data) => {
  return request.get('/cr/team_train/room/mission/progress', data, {
    baseURL: '/api/ojj',
  });
};

// 教员任务裁决重评
const getAssessDetailApi = (data) => {
  return request.get(
    '/cr/training_team/training_team_teacher/evaluation/detail',
    data,
    {
      baseURL: '/api/ojj',
    },
  );
};

//团队教员获取学员评分左侧数据
const getStudentScoreApi = (data) => {
  return request.get(
    '/cr/training_team/training_team_teacher/score/list',
    data,
    {
      baseURL: '/api/ojj',
    },
  );
};
//获取点击学员评分详情训练概况等的数据
const getStudentDetailApi = (data) => {
  return request.get('cr/training_team/training_team/student_score', data, {
    baseURL: '/api/ojj',
  });
};
//教员开放关闭题解
const isOpenUpApi = (data) => {
  return request.post('/cr/team_train/room/update_show_write_up', data, {
    baseURL: '/api/ojj',
  });
};
// 任务导调-任务列表
const getMissionListApi = (data) => {
  return request.get('/cr/team_train/room/mission/list', data, {
    baseURL: '/api/ojj',
  });
};
// 教员获取学员评分的技能雷达评分数据
const getRadarScoreApi = (data) => {
  return request.get('/cr/admin/mission/missions/radar', data, {
    baseURL: '/api/ojj',
  });
};
// 教员获取学员雷达标签
const getRadarLabelsApi = (data) => {
  return request.get('/cr/admin/mission/missions/radar_labels', data, {
    baseURL: '/api/ojj',
  });
};

// 流量仿真概况,环境总速率,top5实时速率,top5流量协议,流量仿真统计
const totalFlowListApi = (id) => {
  return request.get(`/cscene/cscene_flow/statistics_all?id=${id}`, null, {
    baseURL: '/api/mp',
  });
};

// 行为导调流量仿真概况
const getHostListApi = (data) => {
  return request.get(`/cscene/cscene_flow/summary`, data, {
    baseURL: '/api/mp',
  });
};
// 行为导调top5流量协议
const getFlowDataApi = (data) => {
  return request.get(`/cscene/cscene_flow/top5_protocols`, data, {
    baseURL: '/api/mp',
  });
};
// 行为导调top5实时速率
const getRealDataApi = (data) => {
  return request.get(`/cscene/cscene_flow/top5_node_txbps`, data, {
    baseURL: '/api/mp',
  });
};
// 行为导调流量仿真统计
const getFlowRealApi = (data) => {
  return request.get(`/cscene/cscene_flow/statistics`, data, {
    baseURL: '/api/mp',
  });
};
// 仿真任务列表
const getFlowListApi = (data) => {
  return request.get(`/cscene/cscene_flow/task/list`, data, {
    baseURL: '/api/mp',
  });
};

// 任务仿真列表单个启动流量
const openFlowListApi = (id) => {
  return request.post(`/cscene/cscene_flow/task/start/?taskId=${id}`, null, {
    baseURL: '/api/mp',
  });
};

// 任务仿真列表单个停止流量
const stopOneFlowListApi = (id) => {
  return request.post(`/cscene/cscene_flow/task/stop/?taskId=${id}`, null, {
    baseURL: '/api/mp',
  });
};
// 任务仿真列表删除流量任务
const deleteFlowListApi = (id) => {
  return request.delete(`/cscene/cscene_flow/task/delete/?id=${id}`, null, {
    baseURL: '/api/mp',
  });
};
// 任务仿真列表流量批量启动
const manyFlowListApi = (data) => {
  return request.post(`/cscene/cscene_flow/task/batch_start`, data, {
    baseURL: '/api/mp',
  });
};

// 任务仿真列表流量批量停止
const stopFlowListApi = (data) => {
  return request.post(`/cscene/cscene_flow/task/batch_stop`, data, {
    baseURL: '/api/mp',
  });
};

// 任务仿真列表获取设备
const getTargetApi = (id) => {
  return request.get(`cscene/cscene_flow/node_option?id=${id}`, null, {
    baseURL: '/api/mp',
  });
};

// 仿真任务列表新增任务左侧主机信息
// const getMainInfoListApi = (id, name) => {
//   return request.get(
//     `/cscene/monitor/scene/all_elements/${id}/?realTimeHostState=false&name=${name}`,
//     null,
//     {
//       baseURL: '/api/mp',
//     },
//   );
// };
// 仿真任务列表新增任务左侧主机信息加true
const getMainInfoListApi = (id, name) => {
  return request.get(
    `/cscene/monitor/scene/all_elements/${id}/?isAll=true&realTimeHostState=false&name=${name}`,
    null,
    {
      baseURL: '/api/mp',
    },
  );
};
// 仿真任务列表环境总速率
const getEnvironmentListApi = (id) => {
  return request.get(`/cscene/cscene_flow/total_rate/?id=${id}`, null, {
    baseURL: '/api/mp',
  });
};

//团队任务下发和批量下发
const deliveryStatusApi = (data) => {
  return request.post('/cr/team_train/room/batchMissions', data, {
    baseURL: '/api/ojj',
  });
};
// 团队任务删除
const deleteMissionApi = (data) => {
  return request.post('/cr/team_train/room/mission_delete', data, {
    baseURL: '/api/ojj',
  });
};

//团队查询任务详情
const getTaskDetailApi = (data) => {
  return request.get('/cr/admin/mission/detail', data, {
    baseURL: '/api/ojj',
  });
};

// 团队任务
const updateMissionApi = (data) => {
  return request.put('/cr/admin/mission/mission_update', data, {
    baseURL: '/api/ojj',
  });
};
// 查询模版详情
const getTemplateDetailApi = (data) => {
  return request.get('/cr/team_train/template', data, {
    baseURL: '/api/ojj',
  });
};
// 团队任务矩阵
const getRedBlueMatrixApi = (data) => {
  return request.get(
    '/cr/training_team/training_team_students/task/matrix',
    data,
    {
      baseURL: '/api/ojj',
    },
  );
};

// 获取任务裁决流量分析类型下拉框数据
const getTypeListDataApi = (data) => {
  return request.get('/cscene/monitor/flow/attack_types', data, {
    baseURL: '/api/mp',
  });
};
// 任务裁决流量分析,探针采集获取主机信息
const getHostListDataApi = (id) => {
  return request.get(`/cscene/monitor/scene/all_elements/${id}`, null, {
    baseURL: '/api/mp',
  });
};
// 获取任务裁决探针采集全部类别下拉框数据
const getTypeAllDataApi = (data) => {
  return request.get('/cscene/cscene_instances/list_host_events_type', data, {
    baseURL: '/api/mp',
  });
};
// 仿真任务列表新增任务
const addTaskFlowApi = (data) => {
  return request.post('/cscene/cscene_flow/task/add', data, {
    baseURL: '/api/mp',
  });
};

// 仿真任务列表点击配置查询
const getCheckDataApi = (taskId) => {
  return request.get(
    `/cscene/cscene_flow/task/conf/detail/?taskId=${taskId}`,
    null,
    {
      baseURL: '/api/mp',
    },
  );
};
// 仿真任务列表点击配置设置确定
const configFlowApi = (data) => {
  return request.post('/cscene/cscene_flow/task/conf/edit', data, {
    baseURL: '/api/mp',
  });
};

// 环境导调设备清单关机
const nodeShutDownApi = (data) => {
  return request.post(`/cs/scene/node/stop/`, data, {
    baseURL: '/api/ojj',
  });
};
// 环境导调设备清单开机
const nodeShutUpApi = (data) => {
  return request.post(`/cs/scene/node/start/`, data, {
    baseURL: '/api/ojj',
  });
};

// 设备统计
const deviceCountApi = (data) => {
  return request.get(
    '/cr/training_team/training_team_teacher/device/statistics',
    data,
    {
      baseURL: '/api/ojj',
    },
  );
};

// 设备清单
const getEquipmentApi = (data) => {
  return request.get(
    '/cr/training_team/training_team_teacher/device/list',
    data,
    {
      baseURL: '/api/ojj',
    },
  );
};
// 资产清单查询操作系统
const osListApi = (data) => {
  return request.get(`/cr/scene/os/list`, data, {
    baseURL: baseURL,
  });
};
//拓扑详情启动场景
const sceneStartApi = (data) => {
  return request.post(`/cr/team_train/room/scene`, data, {
    baseURL: baseURL,
  });
};
// 拓扑详情关闭场景
const sceneCloseApi = (data) => {
  return request.delete(`/cr/team_train/room/scene`, data, {
    baseURL: baseURL,
  });
};
//
// 拓扑获取场景数据
const getSceneDataApi = (data) => {
  return request.get(`/cr/team_train/room/scene`, data, {
    baseURL: baseURL,
  });
};
// 获取组织
const getOrganizationApi = (data) => {
  return request.get('/auth/orgs/tree', data, {
    baseURL: '/api/mp',
  });
};

// 态势导调是否隐藏
const getIsShowApi = (data) => {
  return request.get('/system_property/list', data, {
    baseURL: '/api/ojj',
  });
};

// 任务仿真新增任务根据集合id批量查询流量列表数据
const getListByCollectionIdsApi = (collectionIds) => {
  return request.get(
    `/flow/info/list_by_collection_ids/`,
    { collectionIds: collectionIds },
    { baseURL: '/api/mp' },
  );
};

// 团队学员获取可添加的常用资产(学员)
const getCanAddListApi = (data) => {
  return request.get(
    '/cr/training_team/training_team_students/device/common_device/not_yet',
    data,
    {
      baseURL: '/api/ojj',
    },
  );
};

// 团队学员获取已添加的常用资产
const getAddedListApi = (data) => {
  return request.get(
    '/cr/training_team/training_team_students/device/common_device/already',
    data,
    {
      baseURL: '/api/ojj',
    },
  );
};

// 团队学员添加常用资产
const postCommonDeviceApi = (data) => {
  return request.post(
    '/cr/training_team/training_team_students/device/common_device',
    data,
    {
      baseURL: '/api/ojj',
    },
  );
};

// 团队学员删除常用资产
const deleteCommonDeviceApi = (data) => {
  return request.delete(
    '/cr/training_team/training_team_students/device/common_device',
    data,
    {
      baseURL: '/api/ojj',
    },
  );
};

// 学员操作机进入任务矩阵状态标记
const getMarkApi = (data) => {
  return request.get(
    '/cr/training_team/training_team_students/task/matrix/badge',
    data,
    {
      baseURL: '/api/ojj',
    },
  );
};

// 学员操作机进入任务矩阵状态标记取消
const getMarkCancelApi = (data) => {
  return request.get(
    '/cr/training_team/training_team_students/matrix/badge/click',
    data,
    {
      baseURL: '/api/ojj',
    },
  );
};

// 团队任务裁决状态标记
const getTaskMarkApi = (data) => {
  return request.get(
    '/cr/training_team/training_team_teacher/evaluation/badge',
    data,
    {
      baseURL: '/api/ojj',
    },
  );
};

// 团队任务裁决状态标记点击取消
const getCancelMarkApi = (data) => {
  return request.get(
    '/cr/training_team/training_team_teacher/evaluation/badge/click',
    data,
    {
      baseURL: '/api/ojj',
    },
  );
};

//任务仿真全部任务id列表
const getStartStopIdsApi = (data) => {
  return request.get('/cscene/cscene_flow/task_ids/list', data, {
    baseURL: '/api/mp',
  });
};
// 态势导调页面
// 态势导调类型占比
const getSituationTypeApi = (data) => {
  return request.get('/situation/guide/guide_statistics', data, {
    baseURL: '/api/ojj',
  });
};
//攻击类型Top统计
const getAttackTypeApi = (data) => {
  return request.get('/situation/guide/attackTop5', data, {
    baseURL: '/api/ojj',
  });
};
// 态势导调时间分布
const getTimeDataApi = (data) => {
  return request.get('/situation/guide/time_distribution', data, {
    baseURL: '/api/ojj',
  });
};

// 任务导调列表
const getTaskListApi = (data) => {
  return request.get('/situation/guide/mission_guide', data, {
    baseURL: '/api/ojj',
  });
};

// 手动导调列表
const getHandListApi = (data) => {
  return request.get('/situation/guide/list', data, {
    baseURL: '/api/ojj',
  });
};

// 任务导调配置点击编辑获取所有类型    '',
const getAllTypeApi = (data) => {
  return request.get('situation/guide/guide_param_type', data, {
    baseURL: '/api/ojj',
  });
};

// 任务导调配置查看详情

const getDetailApi = (data) => {
  return request.get('/situation/guide', data, {
    baseURL: '/api/ojj',
  });
};

// 任务导调配置编辑点击确定(第一次新增)

const getConfirmApi = (data) => {
  return request.post('/situation/guide', data, {
    baseURL: '/api/ojj',
  });
};

// 任务导调配置编辑点击确定(后续编辑)

const getConfirmEditApi = (data) => {
  return request.patch('/situation/guide', data, {
    baseURL: '/api/ojj',
  });
};
// 点击攻防模型查看
const getAttackModelApi = (data) => {
  return request.get('/situation/guide/model', data, {
    baseURL: '/api/ojj',
  });
};

// 点击事件模型查看数据

const getEventModelApi = (data) => {
  return request.get('/cscene/taishi/flow_classification/all', data, {
    baseURL: '/api/mp',
  });
};

// 任务导调清除配置
const deleteTaskApi = (data) => {
  return request.delete('/situation/guide', data, {
    baseURL: '/api/ojj',
  });
};
// 任务导调测试
const testTaskApi = (data) => {
  return request.post('/situation/guide/guide_test', data, {
    baseURL: '/api/ojj',
  });
};
const getSituationApi = (data) => {
  return request.get('/cr/training_team/situation/entrance', data, {
    baseURL: '/api/ojj',
  });
};

// 手动执行导调
const carryTaskApi = (data) => {
  return request.post('/situation/guide/implement', data, {
    baseURL: '/api/ojj',
  });
};

// 场景排队接口
const getSceneQueueApi = (data) => {
  return request.get('/cr/team_train/room/start_queue/list', data, {
    baseURL: '/api/ojj',
  });
};

// 取消排队
const cancelQueueApi = (data) => {
  return request.post('/cr/team_train/room/start_queue/cancel', data, {
    baseURL: '/api/ojj',
  });
};

export {
  getTrainingCategoryApi,
  getDifficultListsApi,
  getTrainListApi,
  getTemplateListApi,
  uploadImageApi,
  createTrainingApi,
  getEditBackApi,
  editTrainingApi,
  getSceneStatusApi,
  endTrainingApi,
  deleteTrainingApi,
  startTrainingApi,
  editTrainingCreateApi,
  getTimeLineApi,
  getMachineListApi,
  getBasicInfoApi,
  getChartPercentApi,
  getChartDataApi,
  getAllCollectTypeApi,
  studentTimeLineApi,
  trainingReportApi,
  trainManualApi,
  trainReportApi,
  attackMethodsApi,
  attackTrendApi,
  getTopologyApi,
  studentInfoApi,
  studentTaskApi,
  nodeStartApi,
  nodeBuildApi,
  getConnectionApi,
  getTaskCountApi,
  getAssessListApi,
  getRoleApi,
  getUserApi,
  evaluationSubmitApi,
  getEvaluationApi,
  getTaskProgressApi,
  getAssessDetailApi,
  getStudentScoreApi,
  getStudentDetailApi,
  isOpenUpApi,
  getMissionListApi,
  getRadarScoreApi,
  getRadarLabelsApi,
  getHostListApi,
  getFlowDataApi,
  getRealDataApi,
  getFlowRealApi,
  getFlowListApi,
  openFlowListApi,
  deleteFlowListApi,
  manyFlowListApi,
  getTargetApi,
  getMainInfoListApi,
  getEnvironmentListApi,
  deliveryStatusApi,
  deleteMissionApi,
  getTaskDetailApi,
  updateMissionApi,
  getTemplateDetailApi,
  getRedBlueMatrixApi,
  getTypeListDataApi,
  getHostListDataApi,
  getTypeAllDataApi,
  addTaskFlowApi,
  getCheckDataApi,
  configFlowApi,
  nodeShutDownApi,
  nodeShutUpApi,
  deviceCountApi,
  getEquipmentApi,
  osListApi,
  sceneStartApi,
  sceneCloseApi,
  getSceneDataApi,
  getOrganizationApi,
  getIsShowApi,
  stopFlowListApi,
  stopOneFlowListApi,
  getListByCollectionIdsApi,
  getCanAddListApi,
  getAddedListApi,
  postCommonDeviceApi,
  deleteCommonDeviceApi,
  getMarkApi,
  totalFlowListApi,
  getTaskMarkApi,
  getCancelMarkApi,
  getMarkCancelApi,
  getStartStopIdsApi,
  getSituationTypeApi,
  getAttackTypeApi,
  getTaskListApi,
  getTimeDataApi,
  getHandListApi,
  getAllTypeApi,
  getDetailApi,
  getConfirmApi,
  getAttackModelApi,
  getEventModelApi,
  getConfirmEditApi,
  deleteTaskApi,
  testTaskApi,
  carryTaskApi,
  getSituationApi,
  getSceneQueueApi,
  cancelQueueApi,
};
