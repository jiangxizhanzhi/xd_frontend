import { request } from '@cyber/helper';
//告警监控模块 --start
//告警监控警告信息
export function getSystemAlarmInfo() {
  return request.get('/devops/cluster/system_alarm/statistics', null, {
    baseURL: '/api/mp',
  });
}
// 近一周分布
export function getNearWeeklyAlarm(data) {
  return request.get('/devops/cluster/system_alarm/distribution', data, {
    baseURL: '/api/mp',
  });
}
//设备运行监控
export function getDeviceMonitorInfo(data) {
  return request.get('/devops/cluster/monitor/server/state', data, {
    baseURL: '/api/mp',
  });
}
//告警监控模块 --end

//超融合平台管理模块 --start
export function getNodeList() {
  return request.get(
    '/devops/cluster/monitor/hypervisor/page/?page=1&per_page=999',
    null,
    {
      baseURL: '/api/mp',
    },
  );
}
// 设备运行监控添加参数
export function getNewNodeList() {
  return request.get(
    '/devops/cluster/monitor/hypervisor/page/?only_hostname=true&page=1&per_page=999',
    null,
    {
      baseURL: '/api/mp',
    },
  );
}
//超融合平台管理模块 --end

//系统资源模块 --start
// 资源统计
export function getResource() {
  return request.get('/devops/cluster/monitor/resources/statistics/', null, {
    baseURL: '/api/mp',
  });
}
//删除已失效节点
export function releaseInvalidResources() {
  return request.get('/devops/cluster/monitor/release_resource', null, {
    baseURL: '/api/mp',
  });
}
// 节点管理
// 关机重启
export function poweroff(data) {
  return request.get(
    '/devops/cluster/monitor/hypervisor/reboot-poweroff/',
    data,
    {
      baseURL: '/api/mp',
    },
  );
}
//服务状态监控
//服务重启
export function restart(data) {
  return request.post('/devops/cluster/monitor/restart', data, {
    baseURL: '/api/mp',
  });
}

//系统资源模块 --end
// 系统运维-串口服务器
export function serIalPortList() {
  return request.get('/devops/cluster/types/serial-port-list/', null, {
    baseURL: '/api/mp',
  });
}
// 串口服务器获取实体装备
export function realEquipment(data) {
  return request.get('/devops/cluster/real-equipment/by-serial-port/', data, {
    baseURL: '/api/mp',
  });
}
// 虚拟机
export function getVm(data) {
  return request.get('/devops/cluster/instance/page/', data, {
    baseURL: '/api/mp',
  });
}

// 容器
export function getContainer(data) {
  return request.get('/devops/cluster/container/page/', data, {
    baseURL: '/api/mp',
  });
}

// vpc
export function getVpc(data) {
  return request.get('/sv_sys/npc_ports/', data);
}

// 网络
export function getNetwork(data) {
  return request.get('/devops/cluster/network/page/', data, {
    baseURL: '/api/mp',
  });
}

// 路由
export function getRoute(data) {
  return request.get('/devops/cluster/router/page/', data, {
    baseURL: '/api/mp',
  });
}

// 弹性Ip
export function getFloatIp(data) {
  return request.get('/devops/cluster/elasticip/page/', data, {
    baseURL: '/api/mp',
  });
}

// 生命周期管理
// 删除场景
export function deleteSceneApi(data) {
  return request.delete('/cscene/cscene_instances', data, {
    baseURL: '/api/mp',
  });
}

export function clearSceneApi(data) {
  return request.delete(`/cscene/cscene_instances/clear?id=${data}`, null, {
    baseURL: '/api/mp',
  });
}
// 批量关闭场景
export function deleteMultipleSceneApi(data) {
  return request.delete('/cscene/cscene_instances/bulk_delete', data, {
    baseURL: '/api/mp',
  });
}
// 批量清除场景数据
export function clearMultipleSceneApi(data) {
  return request.delete(`cscene/cscene_instances/bulk_clear`, data, {
    baseURL: '/api/mp',
  });
}
//后端获取全部场景状态
export function getSceneStatus() {
  return request.get('cscene/cscene_instances/status', null, {
    baseURL: '/api/mp',
  });
}
//后端获取场景类型
export function getSceneType() {
  return request.get('/cscene/cscene_instances/types', null, {
    baseURL: '/api/mp',
  });
}

//实装设备管理
//后端获取在位状态
export function getPlaceStatus() {
  return request.get('/devops/cluster/real-equipment/position', null, {
    baseURL: '/api/mp',
  });
}

//后端获取使用状态
export function getUsageStatus() {
  return request.get('/devops/cluster/real-equipment/use', null, {
    baseURL: '/api/mp',
  });
}

// 实训练习
export function sceneDelPractice(data) {
  // data = this.resourceId 练习实例resourceId
  return request.delete(
    `/practice_exercise/practice_exercises/${data}/scene/`,
    null,
    {
      baseURL: '/api/oj/api',
    },
  );
}
// 实训课程
export function sceneDelCourse(data) {
  // data this.lessonId  课时id
  return request.delete(`/course/lessons/${data}/scene/`, null, {
    baseURL: '/api/oj/api',
  });
}
// 考试
export function sceneDelExam(data) {
  //data == this.examResource 当前题目的resourceid
  return request.delete(
    `/practice_exercise/exam_practice_exercises/${data}/scene/`,
    null,
    {
      baseURL: '/api/oj/api',
    },
  );
}
// 课后练习
export function sceneDelHomeWork(data) {
  // data == this.examResource 当前题目的resourceid
  return request.delete(`/course/lesson_exercises/${data}/scene/`, null, {
    baseURL: '/api/oj/api',
  });
}
// 红蓝对抗
export function sceneDelRedVsBlue(data) {
  // data = this.crEventDatas.data.resource_id;
  return request.delete(
    `/red_vs_blue/red_vs_blue_commons/${data}/scene/`,
    null,
    {
      baseURL: '/api/cr/api',
    },
    data,
  );
}
//查询流量攻击协议列表
export function getFlowProtocols() {
  return request.get('/cscene/monitor/flow/flow_protocols', undefined, {
    baseURL: '/api/mp',
  });
}
