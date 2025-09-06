// 难度
import { gettext } from '@/utils/lang.js';
export const DIFFICULY = {
  PRIMARY: 0, // 初级
  MEDIUM: 1, // 中级
  ADVANCED: 2, // 高级
};

// 修改职业目标
export const OCCUPATIONALLEVEL = {
  PRIMARY: 1, // 初级
  MEDIUM: 2, // 中级
  ADVANCED: 3, // 高级
};

// 最新动态-内容-operation_type
export const OPERATION_tYPE = {
  CREATE: 0,
  UPDATE: 1,
  DELETE: 2,
  LOGIN: 3,
};
export const OPERATION_tYPE_lIST = [
  { value: OPERATION_tYPE.CREATE, label: '创建' },
  { value: OPERATION_tYPE.UPDATE, label: '更新' },
  { value: OPERATION_tYPE.DELETE, label: '删除' },
  { value: OPERATION_tYPE.LOGIN, label: '登录登出' },
];

// 我的收藏
// 课程-3 课时-4 理论题-0 实操题-2
export const CLOOECTION_TYPE = [
  {
    label: gettext('personal.course'),
    value: '3',
  },
  {
    label: gettext('personal.lesson'),
    value: '4',
  },
  {
    label: gettext('route.theoryTopic'),
    value: '0',
  },
  {
    label: gettext('route.fieldProblem'),
    value: '2',
  },
];

// THEORY(1, "理论赛"),
// OM(2, "运维赛"),
// CTF(3, "夺旗赛"),
// AD(4, "攻防赛"),
// PERMEATE(5, "渗透赛"),
// AWDP(6, "沙盒攻防赛"),
// CLASS(8, "课程表"),
// TEAM(9, "团队训练"),
// RB(10, "红蓝对抗");

export const TASK_TYPE = {
  THEORY: 1,
  OM: 2,
  CTF: 3,
  AD: 4,
  PERMEATE: 5,
  AWDP: 6,
  AI: 7,
  CLASS: 8,
  TEAM: 9,
  RB: 10,
};
// export const COLOR_TYPE = {
// green:
// };

export const TASK_TYPE_LIST = [
  {
    name: gettext('personal.contestTask'),
    value: TASK_TYPE.THEORY,
    color: 'orange',
  },
  {
    name: gettext('personal.contestTask'),
    value: TASK_TYPE.OM,
    color: 'orange',
  },
  {
    name: gettext('personal.contestTask'),
    value: TASK_TYPE.CTF,
    color: 'orange',
  },
  {
    name: gettext('personal.contestTask'),
    value: TASK_TYPE.AD,
    color: 'orange',
  },
  {
    name: gettext('personal.contestTask'),
    value: TASK_TYPE.PERMEATE,
    color: 'orange',
  },
  {
    name: gettext('personal.contestTask'),
    value: TASK_TYPE.AWDP,
    color: 'orange',
  },
  {
    name: gettext('personal.contestTask'),
    value: TASK_TYPE.AI,
    color: 'orange',
  },
  {
    name: gettext('personal.studyTask'),
    value: TASK_TYPE.CLASS,
    color: 'green',
  },
  {
    name: gettext('routes.group-training'),
    value: TASK_TYPE.TEAM,
    color: 'cyan',
  },
  {
    name: gettext('routes.red-vs-blue-web-folder'),
    value: TASK_TYPE.RB,
    color: 'red',
  },
];

export const REDVSBLUE = {
  ADMIN: 1, //管理员
  DIRECTOR: 2, //导演
  REFEREE: 3, // 裁判
  REDUSER: 4, // 红方
  BLUEUSER: 5, //蓝方
};

// 技能体系清单完成状态
export const SKILL_COMPLETE_STATUS = {
  unfinished: 0, // 未完成
  completed: 1, // 已完成
};
