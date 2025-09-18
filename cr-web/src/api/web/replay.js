import { request } from '@cyber/helper';

//团队获取复盘条件及scendId
export function getTeamReplayEnable(data) {
  return request.get(
    '/cr/training_team/training_team_teacher/replay/enable',
    data,
    {
      baseURL: '/api/ojj',
    },
  );
}

//红蓝获取复盘条件及scendId
export function getRedBlueReplayEnable(data) {
  return request.get(
    '/cr/director/red_vs_blue/red_vs_blue/replay/enable',
    data,
    {
      baseURL: '/api/ojj',
    },
  );
}

//获取复盘所有节点
export function getAllNodes(id) {
  return request.get(
    `/cscene/monitor/scene/all_elements/${id}/?includeDeleting=true`,
    null,
    {
      baseURL: '/api/mp',
    },
  );
}

//获取复盘设备的操作系统信息、版本信息等
export function getDeviceInfo(data) {
  return request.get('/cscene/monitor/scene/element/os', data, {
    baseURL: '/api/mp',
  });
}

//获取团队复盘所有用户
export function getTeamTrainAllUsers(data) {
  return request.get('/cr/team_train/room/get_user_list', data, {
    baseURL: '/api/ojj',
  });
}

//团队获取用户训练任务
export function getTeamUserTasks(data) {
  return request.get(
    '/cr/training_team/training_team_students/task/replayUserTaskInfo',
    data,
    {
      baseURL: '/api/ojj',
    },
  );
}

//红蓝获取用户训练任务
export function getRedBlueUserTasks(data) {
  return request.get('/cr/red_vs_blue/user/task/replayUserTaskInfo', data, {
    baseURL: '/api/ojj',
  });
}

//获取红蓝复盘所有用户
export function getRedBlueAllUsers(data) {
  return request.get('/cr/red_vs_blue/referee/get_user_list', data, {
    baseURL: '/api/ojj',
  });
}

//获取设备CPU和内存使用率
export function getDeviceOccupy(data) {
  return request.get('/cscene/monitor/hoststate/element_trend', data, {
    baseURL: '/api/mp',
  });
}

//获取设备事件趋势
export function getDeviceEventTrend(data) {
  return request.get('/cscene/monitor/event/event_trend', data, {
    baseURL: '/api/mp',
  });
}

//获取设备流量趋势
export function getDeviceFlowTrend(data) {
  return request.get('/cscene/monitor/flow/scene_trend', data, {
    baseURL: '/api/mp',
  });
}

// 团队-用户复盘获取设备录屏
export function getRecordScreenByUserTeam(data) {
  return request.get(
    '/cr/training_team/training_team_teacher/screenrecord/list',
    data,
    {
      baseURL: '/api/ojj',
    },
  );
}

//红蓝-用户复盘获取设备录屏
export function getRecordScreenByUserRedBlue(data) {
  return request.get('/cr/red_vs_blue/scene/screenrecord/list', data, {
    baseURL: '/api/ojj',
  });
}

//红蓝对抗设备复盘获取用户录屏
export function getRecordScreenByDevice(data) {
  return request.get('/cr/red_vs_blue/user/task/replayUserTimeInfo', data, {
    baseURL: '/api/ojj',
  });
}

//综合演训设备复盘获取用户录屏
export function getTeamRecordScreenByDevice(data) {
  return request.get('/cr/team_train/room/task/replayUserTimeInfo', data, {
    baseURL: '/api/ojj',
  });
}

//红蓝对抗复盘时间轴数据
export function getRedBlueTimeLineData(data) {
  return request.get(
    '/cr/director/red_vs_blue/red_vs_blue/replay/timeline',
    data,
    {
      baseURL: '/api/ojj',
    },
  );
}

//综合演训复盘时间轴数据
export function getTeamTrainTimeLineData(data) {
  return request.get(
    '/cr/training_team/training_team_teacher/replay/timeline',
    data,
    {
      baseURL: '/api/ojj',
    },
  );
}

//信息类网络端口表格数据
export function getNetworkPortTableData(data) {
  return request.get('/cscene/monitor/hoststate/element_netifaces', data, {
    baseURL: '/api/mp',
  });
}

//信息类端口表格数据
export function getPortTableData(data) {
  return request.get('/cscene/monitor/hoststate/element_port', data, {
    baseURL: '/api/mp',
  });
}

//信息类进程表格数据
export function getProcessTableData(data) {
  return request.get('/cscene/monitor/hoststate/element_process', data, {
    baseURL: '/api/mp',
  });
}

//事件类文件变更表格数据
export function getFileModifyTableData(data) {
  return request.get('/cscene/monitor/scene/element/file_modify', data, {
    baseURL: '/api/mp',
  });
}

//事件类注册表变更表格数据
export function getRegisterModifyTableData(data) {
  return request.get('/cscene/monitor/scene/element/registry_modify', data, {
    baseURL: '/api/mp',
  });
}

//日志类表格数据，操作系统日志、应用系统日志、安全软件日志共用此接口,catagories筛选
export function getLogTableData(data) {
  return request.get('/cscene/cscene_instances/list_host_events', data, {
    baseURL: '/api/mp',
  });
}

//日志类，获取操作系统日志、应用系统日志、安全软件日志所有分类
export function getLogALLCatagories(data) {
  return request.get('/cscene/collection/type/list/', data, {
    baseURL: '/api/mp',
  });
}

//日志类原始日志表格数据
export function getOriginLogTableData(data) {
  return request.get('/cscene/logfile/page', data, {
    baseURL: '/api/mp',
  });
}

//流量类表格数据
export function getFlowTableData(data) {
  return request.get('/cscene/monitor/flow/page', data, {
    baseURL: '/api/mp',
  });
}

//获取红蓝天文时间、作战时间数据
export function getRedBlueTimeData(data) {
  return request.get('/cr/red_vs_blue/red_vs_blue/get_time_management', data, {
    baseURL: '/api/ojj',
  });
}

//获取复盘期间各类别探针采集的总数目
export function getProbeTotal(data) {
  return request.get('/cscene/cscene_instances/query_data_count', data, {
    baseURL: '/api/mp',
  });
}

// 态势复盘模块
// 团队-返回态势回放所有下拉框选项
export function teamPlaybackOption(data) {
  return request.get(
    '/cr/training_team/training_team_teacher/playback/option',
    data,
    {
      baseURL: '/api/ojj',
    },
  );
}
// 红蓝-返回态势回放所有下拉框选项
export function redBluePlaybackOption(data) {
  return request.get(
    '/cr/director/red_vs_blue/red_vs_blue/playback/option',
    data,
    {
      baseURL: '/api/ojj',
    },
  );
}

// 团队-态势回放时间轴
export function teamPlaybackTimeLine(data) {
  return request.get(
    '/cr/training_team/training_team_teacher/playback/event/time',
    data,
    {
      baseURL: '/api/ojj',
    },
  );
}
// 团队-态势回放时间轴
export function redBluePlaybackTimeLine(data) {
  return request.get(
    '/cr/director/red_vs_blue/red_vs_blue/playback/event/time',
    data,
    {
      baseURL: '/api/ojj',
    },
  );
}

// 时间轴
export function playbackTimeLine(data) {
  return request.post('/situation/playback/playback/event/time', data, {
    baseURL: '/api/ojj',
  });
}

// 刷新
// /ojj/situation/playback/refresh
export function playbackRefresh(data) {
  return request.post('/situation/playback/refresh', data, {
    baseURL: '/api/ojj',
  });
}

// 单点执行
export function postExecution(data) {
  return request.post('/situation/playback/execute', data, {
    baseURL: '/api/ojj',
  });
}
