import { request } from '@cyber/helper';

//  训练类型
const getTrainingCategory = (data) => {
  return request.get(`/cr/common/constants_config`, data, {
    baseURL: '/api/ojj',
  });
};

// 训练难度
const getDifficultLists = (data) => {
  return request.get(`/cr/common/constants_config`, data, {
    baseURL: '/api/ojj',
  });
};

// 获取红蓝对抗训练列表
const getTrainList = (data) => {
  return request.get(`/cr/red_vs_blue/red_vs_blue/list`, data, {
    baseURL: '/api/ojj',
  });
};

// 获取红蓝对抗模板列表
const getTemplateList = (data) => {
  return request.get(`/cr/red_vs_blue/red_vs_blue_templates/list`, data, {
    baseURL: '/api/ojj',
  });
};
// 封面上传
const uploadImage = (data) => {
  return request.post('/common/web/image_upload', data, {
    baseURL: '/api/ojj',
  });
};
// 查询模版详情
const getTemplateDetail = (data) => {
  return request.get('/cr/admin/red_vs_blue/red_vs_blue_templates/', data, {
    baseURL: '/api/ojj',
  });
};

// 获取组织
const getOrganization = (data) => {
  return request.get('/auth/orgs/tree', data, {
    baseURL: '/api/mp',
  });
};

// 红蓝对抗新增训练
const createTraining = (data) => {
  return request.post('/cr/red_vs_blue/red_vs_blue/', data, {
    baseURL: '/api/ojj',
  });
};

//红蓝对抗查询单个
const getEditBack = (data) => {
  return request.get('/cr/red_vs_blue/red_vs_blue/', data, {
    baseURL: '/api/ojj',
  });
};

//红蓝对抗编辑训练
const editTraining = (data) => {
  return request.put('/cr/red_vs_blue/red_vs_blue/', data, {
    baseURL: '/api/ojj',
  });
};

// 红蓝管理员删除靶场
const deleteTraining = (data) => {
  return request.delete('/cr/red_vs_blue/red_vs_blue/', data, {
    baseURL: '/api/ojj',
  });
};

// 设备统计
const deviceCount = (data) => {
  return request.get('/cr/red_vs_blue/scene/device/count', data, {
    baseURL: '/api/ojj',
  });
};

// 设备清单
const getEquipment = (data) => {
  return request.get('/cr/red_vs_blue/scene/device/list', data, {
    baseURL: '/api/ojj',
  });
};

// 接入方式
const openTap = (data) => {
  return request.post('/cscene/cscene_instances/get_connection', data, {
    baseURL: '/api/mp',
  });
};

// 红蓝任务矩阵
const getRedBlueMatrix = (data) => {
  return request.get('/cr/red_vs_blue/user/task/matrix', data, {
    baseURL: '/api/ojj',
  });
};

// 红蓝拓扑监控请选择角色获取场景数据
const getSceneData = (data) => {
  return request.get('/cr/red_vs_blue/scene/', data, {
    baseURL: '/api/ojj',
  });
};
// 红蓝拓扑监控请选择角色获取场景数据(同上)
const getSceneDataRedBlue = (data) => {
  return request.get('/cr/red_vs_blue/scene/', data, {
    baseURL: '/api/ojj',
  });
};

// 红蓝场景启动
const startScene = (data) => {
  return request.post('/cr/red_vs_blue/scene/', data, {
    baseURL: '/api/ojj',
  });
};

// 红蓝关闭场景
const closeScene = (data) => {
  return request.delete('/cr/red_vs_blue/scene/', data, {
    baseURL: '/api/ojj',
  });
};

// 红蓝重启节点
const restartNode = (data) => {
  return request.post('/cr/red_vs_blue/scene/node/restart', data, {
    baseURL: '/api/ojj',
  });
};

// 红蓝节点重建
const recreateNode = (data) => {
  return request.post('/cr/red_vs_blue/scene/node/recreate', data, {
    baseURL: '/api/ojj',
  });
};

// 部分节点启动
const startNode = (data) => {
  return request.post('/cr/red_vs_blue/scene/node/create', data, {
    baseURL: '/api/ojj',
  });
};

// 获取靶机列表
const getMachineList = (data) => {
  return request.get('/cr/red_vs_blue/referee/sessions', data, {
    baseURL: '/api/ojj',
  });
};

// 学员角色查询训练得分信息（管理员页面）
const getRoleScoreInfo = (data) => {
  return request.get('/cr/red_vs_blue/red_vs_blue/get_role_score_info', data, {
    baseURL: '/api/ojj',
  });
};
// 初始化时间 当前时间
const getCurrentTime = (data) => {
  return request.get('/cr/common/current_time', data, {
    baseURL: '/api/ojj',
  });
};

// 探针采集 获取主机信息
const getHostList = (id) => {
  return request.get(
    `/cscene/monitor/scene/all_elements/${id}?is_collect=true`,
    null,
    {
      baseURL: '/api/mp',
    },
  );
};

// 探针采集 获取系统架构及版本信息
const getMachineOs = (data) => {
  return request.get('/cscene/monitor/scene/element/os', data, {
    baseURL: '/api/mp',
  });
};

// 探针采集 获取cpu、内存、磁盘
const getCpuMemoryDisk = (data) => {
  return request.get('/cscene/monitor/hoststate/element_trend', data, {
    baseURL: '/api/mp',
  });
};

// 探针采集 获取占用率
const getOccupyRate = (data) => {
  return request.get('/cscene/monitor/hoststate', data, {
    baseURL: '/api/mp',
  });
};

// 探针采集 获取所有事件类型
const getAllEventType = (data) => {
  return request.get('/cscene/collection/type/list/', data, {
    baseURL: '/api/mp',
  });
};

// 探针采集 文件变更柱状图
const getDocChangeChart = (data) => {
  return request.get(
    '/cscene/monitor/scene/element/file_modify_histogram',
    data,
    {
      baseURL: '/api/mp',
    },
  );
};

// 探针采集 注册表变更柱状图
const getRegChangeChart = (data) => {
  return request.get(
    '/cscene/monitor/scene/element/registry_modify_histogram',
    data,
    {
      baseURL: '/api/mp',
    },
  );
};

const getTrafficHostList = (id) => {
  return request.get(`/cscene/monitor/scene/all_elements/${id}`, null, {
    baseURL: '/api/mp',
  });
};

// 原始日志下载
const originalLogDownload = (data) => {
  return request.get('/cscene/logfile/download_urls', data, {
    baseURL: '/api/mp',
  });
};

// 获取应用名称
const getApplyName = (data) => {
  return request.get('/cscene/collection/type/apps', data, {
    baseURL: '/api/mp',
  });
};

// 获取角色列表
const getRole = (data) => {
  return request.get('/cr/red_vs_blue/referee/roles', data, {
    baseURL: '/api/ojj',
  });
};
// 获取用户列表
const getUser = (data) => {
  return request.get('/cr/red_vs_blue/referee/get_user_list', data, {
    baseURL: '/api/ojj',
  });
};

// 获取学员的评估列表 裁判(任务裁决)
const getAssessList = (data) => {
  return request.get('/cr/red_vs_blue/referee/evaluation/list', data, {
    baseURL: '/api/ojj',
  });
};

// 获取学员的评估列表 裁判(任务裁决)
const getScoreList = (data) => {
  return request.get('/cr/red_vs_blue/referee/score/list', data, {
    baseURL: '/api/ojj',
  });
};

// 获取学员单个评估和任务详情
const getAssessDetail = (data) => {
  return request.get('/cr/red_vs_blue/referee/evaluation/detail', data, {
    baseURL: '/api/ojj',
  });
};
// 任务导调-任务进度
const getMissionProgress = (data) => {
  return request.get(
    '/cr/director/red_vs_blue/red_vs_blue/mission/progress',
    data,
    {
      baseURL: '/api/ojj',
    },
  );
};
// 任务导调-任务列表
const getMissionList = (data) => {
  return request.get(
    '/cr/director/red_vs_blue/red_vs_blue/mission/list',
    data,
    {
      baseURL: '/api/ojj',
    },
  );
};
// 题解开放关闭
const isWriteUp = (data) => {
  return request.post(
    '/cr/director/red_vs_blue/red_vs_blue/update_show_write_up',
    data,
    {
      baseURL: '/api/ojj',
    },
  );
};
// 任务删除
const deleteMission = (data) => {
  return request.post(
    '/cr/director/red_vs_blue/red_vs_blue/mission_delete',
    data,
    {
      baseURL: '/api/ojj',
    },
  );
};

//导演任务下发和批量下发
const deliveryStatus = (data) => {
  return request.post(
    '/cr/director/red_vs_blue/red_vs_blue/batchMissions',
    data,
    {
      baseURL: '/api/ojj',
    },
  );
};
//导演查询任务详情
const getTaskDetail = (data) => {
  return request.get('/cr/admin/mission/detail', data, {
    baseURL: '/api/ojj',
  });
};

// 编辑任务
const updateMission = (data) => {
  return request.put('/cr/admin/mission/mission_update', data, {
    baseURL: '/api/ojj',
  });
};

// 关机
const nodeShutDown = (data) => {
  return request.post(`/cs/scene/node/stop/`, data, {
    baseURL: '/api/ojj',
  });
};
// 开机
const nodeShutUp = (data) => {
  return request.post(`/cs/scene/node/start/`, data, {
    baseURL: '/api/ojj',
  });
};

// 红蓝训练手册
const getTrainingManual = (data) => {
  return request.get(`/cr/red_vs_blue/red_vs_blue/manual`, data, {
    baseURL: '/api/ojj',
  });
};

//提交演习文书
const exercisePaper = (data) => {
  return request.post(
    '/cr/director/red_vs_blue/red_vs_blue/add_exercise_paper',
    data,
    {
      baseURL: '/api/ojj',
    },
  );
};

// 获取演习文书
const getExercisePaper = (data) => {
  return request.get(
    '/cr/director/red_vs_blue/red_vs_blue/get_exercise_paper',
    data,
    {
      baseURL: '/api/ojj',
    },
  );
};

// 红蓝裁判训练报告
const getTrainingReport = (data) => {
  return request.get(
    '/cr/red_vs_blue/red_vs_blue/mission/getTrainReports',
    data,
    {
      baseURL: '/api/ojj',
    },
  );
};

// 查询学员评分
const getStudentScore = (data) => {
  return request.get('/cr/red_vs_blue/red_vs_blue/student_score', data, {
    baseURL: '/api/ojj',
  });
};

//学员登录获取任务列表
const getUserTaskList = (data) => {
  return request.get('/cr/red_vs_blue/user/get_mission_info', data, {
    baseURL: '/api/ojj',
  });
};

// 获取可添加的常用资产(学员)
const getCanAddList = (data) => {
  return request.get(
    '/cr/red_vs_blue/scene/device/common_device/not_yet',
    data,
    {
      baseURL: '/api/ojj',
    },
  );
};

// 获取已添加的常用资产
const getAddedList = (data) => {
  return request.get(
    '/cr/red_vs_blue/scene/device/common_device/already',
    data,
    {
      baseURL: '/api/ojj',
    },
  );
};

// 添加常用资产
const postCommonDevice = (data) => {
  return request.post('/cr/red_vs_blue/scene/device/common_device', data, {
    baseURL: '/api/ojj',
  });
};

// 删除常用资产
const deleteCommonDevice = (data) => {
  return request.delete('/cr/red_vs_blue/scene/device/common_device', data, {
    baseURL: '/api/ojj',
  });
};

//查询红蓝导演对抗时间轴
const timeLine = (data) => {
  return request.get(
    '/cr/director/red_vs_blue/red_vs_blue/mission_timeline',
    data,
    {
      baseURL: '/api/ojj',
    },
  );
};
// 查询红蓝学员时间轴
const studentTimeLine = (data) => {
  return request.get('/cr/red_vs_blue/user/get_time_line', data, {
    baseURL: '/api/ojj',
  });
};

// 学员接入操作机任务矩阵红点提示
const getRedBlueMatrixBadge = (data) => {
  return request.get('/cr/red_vs_blue/user/task/matrix/badge', data, {
    baseURL: '/api/ojj',
  });
};

// 红蓝学员点击任务矩阵取消红点提示
const cancelRedBlueMatrixBadge = (data) => {
  return request.get('/cr/red_vs_blue/user/matrix/badge/click', data, {
    baseURL: '/api/ojj',
  });
};

// 红蓝学员详情页任务矩阵开始答题
const beginMission = (data) => {
  return request.post('/cr/red_vs_blue/user/begin_mission', data, {
    baseURL: '/api/ojj',
  });
};

// 红蓝学员详情页任务矩阵答题任务弹窗
const getMeissionDetail = (data) => {
  return request.get('/cr/red_vs_blue/user/get_mission_detail', data, {
    baseURL: '/api/ojj',
  });
};

//学员答题后点击上报
const submitAnswer = (data) => {
  return request.post('/cr/red_vs_blue/user/submit_missions', data, {
    baseURL: '/api/ojj',
  });
};

// 学员训练说明
const trainingInstruction = (data) => {
  return request.get('/cr/red_vs_blue/red_vs_blue/train_introduction', data, {
    baseURL: '/api/ojj',
  });
};

// 裁判任务裁决获取红点提示
const getRefereeBadge = (data) => {
  return request.get('/cr/red_vs_blue/referee/evaluation/badge', data, {
    baseURL: '/api/ojj',
  });
};

// 裁判任务裁决取消红点提示
const cancelRefereeBadge = (data) => {
  return request.get('/cr/red_vs_blue/referee/evaluation/badge/click', data, {
    baseURL: '/api/ojj',
  });
};

// 创建训练时校验用户是否拥有模板权限
const getTemplatePermission = (data) => {
  return request.get('/admin/ceBase/crEvents/check/template/permission', data, {
    baseURL: '/api/ojj',
  });
};

export {
  getTrainingCategory,
  getDifficultLists,
  getTrainList,
  getTemplateList,
  uploadImage,
  getTemplateDetail,
  getOrganization,
  createTraining,
  getEditBack,
  editTraining,
  deleteTraining,
  deviceCount,
  getEquipment,
  openTap,
  getRedBlueMatrix,
  getSceneData,
  getSceneDataRedBlue,
  startScene,
  closeScene,
  restartNode,
  recreateNode,
  startNode,
  getMachineList,
  getRoleScoreInfo,
  getCurrentTime,
  getHostList,
  getTrafficHostList,
  getMachineOs,
  getCpuMemoryDisk,
  getOccupyRate,
  getAllEventType,
  getDocChangeChart,
  getRegChangeChart,
  originalLogDownload,
  getApplyName,
  getRole,
  getUser,
  getAssessList,
  getScoreList,
  getAssessDetail,
  getMissionProgress,
  getMissionList,
  isWriteUp,
  deleteMission,
  deliveryStatus,
  getTaskDetail,
  updateMission,
  nodeShutDown,
  nodeShutUp,
  getTrainingManual,
  exercisePaper,
  getExercisePaper,
  getTrainingReport,
  getStudentScore,
  getUserTaskList,
  getCanAddList,
  getAddedList,
  postCommonDevice,
  deleteCommonDevice,
  timeLine,
  studentTimeLine,
  getRedBlueMatrixBadge,
  cancelRedBlueMatrixBadge,
  beginMission,
  getMeissionDetail,
  submitAnswer,
  trainingInstruction,
  getRefereeBadge,
  cancelRefereeBadge,
  getTemplatePermission,
};
