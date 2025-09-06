import { getI18N } from '@cyber/helper';
const i18n = getI18N();
export const SceneStatus = {
  CREATEING: 1, //'正在创建'
  // ALIGNMENT: 2, //'队列中'
  RUNNING: 3, //'运行中'
  PAUSE: 4, //'暂停'
  DELETE: 0, //'已删除'
  ERROR: 5, //'错误'
  HANG: 6, //挂起
};
export const SceneStatusList = [
  {
    label: i18n.t('systemOperation.scene.creating'),
    value: SceneStatus.CREATEING,
  },
  // {
  //   label: i18n.t('scene.queue'),
  //   value: SceneStatus.ALIGNMENT,
  // },
  {
    label: i18n.t('systemOperation.scene.running'),
    value: SceneStatus.RUNNING,
  },
  {
    label: i18n.t('systemOperation.scene.pause'),
    value: SceneStatus.PAUSE,
  },
  {
    label: i18n.t('systemOperation.scene.deleted'),
    value: SceneStatus.DELETE,
  },
  {
    label: i18n.t('systemOperation.scene.error'),
    value: SceneStatus.ERROR,
  },
  {
    label: i18n.t('systemOperation.scene.hang'),
    value: SceneStatus.HANG,
  },
];
// 流量类型
export const protocolsList = [
  {
    label: 'ICMP',
    value: 'icmp',
  },
  {
    label: 'IGMP',
    value: 'igmp',
  },
  {
    label: 'TCP',
    value: 'tcp',
  },
  {
    label: 'UDP',
    value: 'udp',
  },
  {
    label: 'GRE',
    value: 'gre',
  },
  {
    label: 'ESP',
    value: 'esp',
  },
  {
    label: 'ICMP6',
    value: 'icmp6',
  },
  {
    label: 'ICMPV6',
    value: 'icmpv6',
  },
  {
    label: 'OSPF',
    value: 'ospf',
  },
  {
    label: 'PIM',
    value: 'pim',
  },
  {
    label: 'SCTP',
    value: 'sctp',
  },
];
// 场景状态
export const SceneStatusTable = {
  DELETED: 0, //'已删除'
  INITIALIZE: 1, //'初始化'
  RUNNING: 2, //'运行中'
  // 执行事件中
};

// event 场景事件
// 创建、启动、重启、恢复、快照、修改完成都改成运行中
export const Event = {
  NORUNNING: -1, //未运行
  DEFAULT: 0, // 默认
  INITIALIZE: 1, //'初始化'
  CREATE: 2, //创建
  START: 3, //启动
  STOP: 4, //停止
  RESTART: 5, //重启
  PAUSE: 6, //暂停
  RECOVERY: 7, //从暂停恢复
  PHOTO: 8, // 快照
  DELETE: 9, //删除
  UPDATE: 10, //修改
  HANG: 12, //挂起
  RESTORE: 13, //从挂起状态恢复
};

// event_status: 场景事件状态
export const EventStatus = {
  NORUNNING: -1, //未运行
  INITIAL: 0, //初始化
  START: 1, //开始
  RUNNING: 2, //进行中
  FINISH: 4, //完成
  PAUSE: 3, //暂停
  ERROR: 5, //异常
};

// 场景属性
export const SceneProps = {
  NULL: 0, // 无隔离
  SINGLE: 1, // 个人隔离
  TEAM: 2, // 团队隔离
};

export const ScenePropsLists = [
  {
    value: SceneProps.NULL,
    label: i18n.t('systemOperation.scene.noIsolation'),
  },
  {
    value: SceneProps.SINGLE,
    label: i18n.t('systemOperation.scene.individualIsolation'),
  },
  {
    value: SceneProps.TEAM,
    label: i18n.t('systemOperation.scene.teamIsolated'),
  },
];

const creating = i18n.t('systemOperation.scene.creating');
const running = i18n.t('systemOperation.scene.running');
const stop = i18n.t('systemOperation.scene.pause');
const deleted = i18n.t('systemOperation.scene.deleted');
const deleting = i18n.t('systemOperation.scene.deleting');
const error = i18n.t('systemOperation.scene.error');
const noRunning = i18n.t('systemOperation.scene.noRunning');
const hang = i18n.t('systemOperation.scene.hang'); //挂起

export const SceneMap = {
  [`${Event.NORUNNING}-${EventStatus.NORUNNING}`]: noRunning,
  [`${Event.DEFAULT}-${EventStatus.INITIAL}`]: creating,
  [`${Event.DEFAULT}-${EventStatus.START}`]: creating,
  [`${Event.DEFAULT}-${EventStatus.RUNNING}`]: creating,
  [`${Event.DEFAULT}-${EventStatus.FINISH}`]: creating,
  [`${Event.DEFAULT}-${EventStatus.PAUSE}`]: stop,
  [`${Event.DEFAULT}-${EventStatus.ERROR}`]: error,
  [`${Event.INITIALIZE}-${EventStatus.INITIAL}`]: creating,
  [`${Event.INITIALIZE}-${EventStatus.START}`]: creating,
  [`${Event.INITIALIZE}-${EventStatus.RUNNING}`]: creating,
  [`${Event.INITIALIZE}-${EventStatus.FINISH}`]: creating,
  [`${Event.INITIALIZE}-${EventStatus.PAUSE}`]: stop,
  [`${Event.INITIALIZE}-${EventStatus.ERROR}`]: error,
  [`${Event.CREATE}-${EventStatus.INITIAL}`]: creating,
  [`${Event.CREATE}-${EventStatus.START}`]: creating,
  [`${Event.CREATE}-${EventStatus.RUNNING}`]: creating,
  [`${Event.CREATE}-${EventStatus.FINISH}`]: running,
  [`${Event.CREATE}-${EventStatus.PAUSE}`]: stop,
  [`${Event.CREATE}-${EventStatus.ERROR}`]: error,
  [`${Event.START}-${EventStatus.INITIAL}`]: running,
  [`${Event.START}-${EventStatus.START}`]: running,
  [`${Event.START}-${EventStatus.RUNNING}`]: running,
  [`${Event.START}-${EventStatus.FINISH}`]: running,
  [`${Event.START}-${EventStatus.PAUSE}`]: stop,
  [`${Event.START}-${EventStatus.ERROR}`]: error,
  [`${Event.STOP}-${EventStatus.INITIAL}`]: stop,
  [`${Event.STOP}-${EventStatus.START}`]: stop,
  [`${Event.STOP}-${EventStatus.RUNNING}`]: stop,
  [`${Event.STOP}-${EventStatus.FINISH}`]: stop,
  [`${Event.STOP}-${EventStatus.PAUSE}`]: stop,
  [`${Event.STOP}-${EventStatus.ERROR}`]: error,
  [`${Event.RESTART}-${EventStatus.INITIAL}`]: running,
  [`${Event.RESTART}-${EventStatus.START}`]: running,
  [`${Event.RESTART}-${EventStatus.RUNNING}`]: running,
  [`${Event.RESTART}-${EventStatus.FINISH}`]: running,
  [`${Event.RESTART}-${EventStatus.PAUSE}`]: stop,
  [`${Event.RESTART}-${EventStatus.ERROR}`]: error,
  [`${Event.PAUSE}-${EventStatus.INITIAL}`]: stop,
  [`${Event.PAUSE}-${EventStatus.START}`]: stop,
  [`${Event.PAUSE}-${EventStatus.RUNNING}`]: stop,
  [`${Event.PAUSE}-${EventStatus.FINISH}`]: stop,
  [`${Event.PAUSE}-${EventStatus.PAUSE}`]: stop,
  [`${Event.PAUSE}-${EventStatus.ERROR}`]: error,
  [`${Event.RECOVERY}-${EventStatus.INITIAL}`]: stop,
  [`${Event.RECOVERY}-${EventStatus.START}`]: stop,
  [`${Event.RECOVERY}-${EventStatus.RUNNING}`]: stop,
  [`${Event.RECOVERY}-${EventStatus.FINISH}`]: running,
  [`${Event.RECOVERY}-${EventStatus.PAUSE}`]: stop,
  [`${Event.RECOVERY}-${EventStatus.ERROR}`]: error,
  [`${Event.PHOTO}-${EventStatus.INITIAL}`]: running,
  [`${Event.PHOTO}-${EventStatus.START}`]: running,
  [`${Event.PHOTO}-${EventStatus.RUNNING}`]: running,
  [`${Event.PHOTO}-${EventStatus.FINISH}`]: running,
  [`${Event.PHOTO}-${EventStatus.PAUSE}`]: stop,
  [`${Event.PHOTO}-${EventStatus.ERROR}`]: error,
  [`${Event.DELETE}-${EventStatus.INITIAL}`]: deleting,
  [`${Event.DELETE}-${EventStatus.START}`]: deleting,
  [`${Event.DELETE}-${EventStatus.RUNNING}`]: deleting,
  [`${Event.DELETE}-${EventStatus.FINISH}`]: deleted,
  [`${Event.DELETE}-${EventStatus.PAUSE}`]: stop,
  [`${Event.DELETE}-${EventStatus.ERROR}`]: error,
  [`${Event.UPDATE}-${EventStatus.INITIAL}`]: running,
  [`${Event.UPDATE}-${EventStatus.START}`]: running,
  [`${Event.UPDATE}-${EventStatus.RUNNING}`]: running,
  [`${Event.UPDATE}-${EventStatus.FINISH}`]: running,
  [`${Event.UPDATE}-${EventStatus.PAUSE}`]: stop,
  [`${Event.UPDATE}-${EventStatus.ERROR}`]: error,
  // 新增挂起event=12
  [`${Event.HANG}-${EventStatus.INITIAL}`]: hang,
  [`${Event.HANG}-${EventStatus.START}`]: hang,
  [`${Event.HANG}-${EventStatus.RUNNING}`]: hang,
  [`${Event.HANG}-${EventStatus.FINISH}`]: hang, //挂起
  [`${Event.HANG}-${EventStatus.PAUSE}`]: stop,
  [`${Event.HANG}-${EventStatus.ERROR}`]: error,
  // 新增从挂起状态恢复event=13
  [`${Event.RESTORE}-${EventStatus.INITIAL}`]: hang,
  [`${Event.RESTORE}-${EventStatus.START}`]: hang,
  [`${Event.RESTORE}-${EventStatus.RUNNING}`]: hang,
  [`${Event.RESTORE}-${EventStatus.FINISH}`]: running, //恢复
  [`${Event.RESTORE}-${EventStatus.PAUSE}`]: stop,
  [`${Event.RESTORE}-${EventStatus.ERROR}`]: error,
};

// 在位状态
export const PlaceStatus = [
  {
    value: 1,
    label: i18n.t('systemOperation.realEquipmentManagement.inPlace'),
  },
  {
    value: 0,
    label: i18n.t('systemOperation.realEquipmentManagement.notInPlace'),
  },
];

// 使用状态
export const UsageStatus = [
  {
    value: 0,
    label: i18n.t('systemOperation.realEquipmentManagement.free'),
  },
  {
    value: 1,
    label: i18n.t('systemOperation.realEquipmentManagement.use'),
  },
];

// 节点实例类型
// 1: 交换机, 2: 路由器, 3: 防火墙, 4: 虚拟机, 5: 容器, 6: 实体设备, 7: Npc, 8: Dynamips
export const VIRTUAL_TYPE = [
  {
    value: 1,
    label: i18n.t('systemOperation.cloudPlatform.switch'),
  },
  {
    value: 2,
    label: i18n.t('systemOperation.cloudPlatform.router'),
  },
  {
    value: 3,
    label: i18n.t('systemOperation.cloudPlatform.firewall'),
  },
  {
    value: 4,
    label: i18n.t('systemOperation.cloudPlatform.vm'),
  },
  {
    value: 5,
    label: i18n.t('systemOperation.cloudPlatform.container'),
  },
  {
    value: 6,
    label: i18n.t('systemOperation.monitorScene.physicalEquipment'),
  },
  {
    value: 7,
    label: i18n.t('systemOperation.monitorScene.npc'),
  },
  {
    value: 8,
    label: i18n.t('systemOperation.monitorScene.dynamips'),
  },
];
