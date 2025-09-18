import { getI18N } from '@cyber/helper';
const i18n = getI18N();
export const TYPE = {
  // 0:登入 1:登出 2:创建 3:更新 4:删除 5:学习 6:练习 7:考试 8:训练 9:测评 10:参赛
  // 11:停止 12.暂停 13.启动 14:恢复
  LOGIN: 0,
  LOGOUT: 1,
  CREATE: 2,
  UPDATE: 3,
  DELETE: 4,
  STUDY: 5,
  PRACTICE: 6,
  EXAM: 7,
  TRAIN: 8,
  EVAL: 9,
  COMPETE: 10,
  STOP: 11,
  PAUSE: 12,
  START: 13,
  RECOVER: 14,
};
export const TypeList = [
  {
    label: i18n.t('systemManagement.system.login'),
    value: TYPE.LOGIN,
  },
  {
    label: i18n.t('systemManagement.system.logOut'),
    value: TYPE.LOGOUT,
  },
  {
    label: i18n.t('systemManagement.system.create'),
    value: TYPE.CREATE,
  },
  {
    label: i18n.t('systemManagement.system.update'),
    value: TYPE.UPDATE,
  },
  {
    label: i18n.t('systemManagement.system.delete'),
    value: TYPE.DELETE,
  },
  {
    label: i18n.t('systemManagement.system.study'),
    value: TYPE.STUDY,
  },
  {
    label: i18n.t('systemManagement.system.exercise'),
    value: TYPE.PRACTICE,
  },
  {
    label: i18n.t('systemManagement.system.exam'),
    value: TYPE.EXAM,
  },
  {
    label: i18n.t('systemManagement.system.train'),
    value: TYPE.TRAIN,
  },
  {
    label: i18n.t('systemManagement.system.evaluation'),
    value: TYPE.EVAL,
  },
  {
    label: i18n.t('systemManagement.system.compete'),
    value: TYPE.COMPETE,
  },

  {
    label: i18n.t('systemManagement.system.stop'),
    value: TYPE.STOP,
  },
  {
    label: i18n.t('systemManagement.system.pause'),
    value: TYPE.PAUSE,
  },
  {
    label: i18n.t('systemManagement.system.start'),
    value: TYPE.START,
  },
  {
    label: i18n.t('systemManagement.system.recover'),
    value: TYPE.RECOVER,
  },
];

// 模块
export const ModuleType = {
  SYS: 0, // _('x_system'))  # 系统
  TOOL: 1, // _('x_tool'))  # 工具
  COURSE: 2, // _('x_course'))  # 课程
  RESOURCE: 3, // _('x_resource'))  # 资源
  ACCOUNT: 4, // _('x_account'))  # 账号
  SCENE: 5, // _('x_scene'))  # 场景
  OCCUPATION: 6, // _('x_occupation'))  # 职业体系
  EXAM: 7, // _('x_exam'))  # 考试
  PRACTICE: 8, // _('x_practice'))  # 习题集管理
  PRACTICE_EXERCISE: 9, // _('x_practice_exercise'))  # 夺旗解题
  PRACTICE_THEORY: 10, // _('x_practice_theory'))  # 理论基础
  TEST_PAPER: 11, // _('x_test_paper'))  # 试卷
  MISSION: 12, // _('x_mission'))  # 任务
  FLOW: 13, // _('x_flow'))  # 流量
  PROBE: 14, // _('x_probe'))  # 探针
  DEVICE: 15, // _('x_device'))  # 靶标
  RED_VS_BLUE: 16, // 红蓝对抗
  TRANING_SINGLE: 17, // 单兵训练
  TRANING_TEAM: 18, // 综合演训
  ARENA: 19, //赛场
  THEORY_CONTEST: 20, //理论赛
  Q_M_CONTEST: 21, //运维赛
  CTF_CONTEST: 22, //夺旗赛
  A_D_CONTEST: 23, //攻防赛
  CFS_CONTEST: 24, //渗透赛
  TEAM: 25, //战队
  AWDP_CONTEST: 26, //沙盒攻防赛
};

export const ModuleList = [
  {
    label: i18n.t('systemManagement.system.system'),
    value: ModuleType.SYS,
  },
  {
    label: i18n.t('systemManagement.system.tool'),
    value: ModuleType.TOOL,
  },
  {
    label: i18n.t('systemManagement.system.course'),
    value: ModuleType.COURSE,
  },
  {
    label: i18n.t('systemManagement.system.resource'),
    value: ModuleType.RESOURCE,
  },
  {
    label: i18n.t('systemManagement.system.account'),
    value: ModuleType.ACCOUNT,
  },
  {
    label: i18n.t('systemManagement.system.scene'),
    value: ModuleType.SCENE,
  },
  {
    label: i18n.t('systemManagement.system.occupation'),
    value: ModuleType.OCCUPATION,
  },
  //考试下拉选项去除
  // {
  //   label: i18n.t('systemManagement.system.exam'),
  //   value: ModuleType.EXAM,
  // },
  {
    label: i18n.t('systemManagement.system.practice'),
    value: ModuleType.PRACTICE,
  },
  {
    label: i18n.t('systemManagement.system.practiceExercise'),
    value: ModuleType.PRACTICE_EXERCISE,
  },
  {
    label: i18n.t('systemManagement.system.practiceTheory'),
    value: ModuleType.PRACTICE_THEORY,
  },
  {
    label: i18n.t('systemManagement.system.testPaper'),
    value: ModuleType.TEST_PAPER,
  },

  {
    label: i18n.t('systemManagement.system.mission'),
    value: ModuleType.MISSION,
  },
  {
    label: i18n.t('systemManagement.system.flow'),
    value: ModuleType.FLOW,
  },
  {
    label: i18n.t('systemManagement.system.probe'),
    value: ModuleType.PROBE,
  },
  {
    label: i18n.t('systemManagement.system.device'),
    value: ModuleType.DEVICE,
  },

  {
    label: i18n.t('systemManagement.system.redVsBlue'),
    value: ModuleType.RED_VS_BLUE,
  },
  {
    label: i18n.t('systemManagement.system.individualTraining'),
    value: ModuleType.TRANING_SINGLE,
  },
  {
    label: i18n.t('systemManagement.system.teamTraining'),
    value: ModuleType.TRANING_TEAM,
  },
  {
    label: i18n.t('systemManagement.system.arena'),
    value: ModuleType.ARENA,
  },
  {
    label: i18n.t('systemManagement.system.theoryContest'),
    value: ModuleType.THEORY_CONTEST,
  },
  {
    label: i18n.t('systemManagement.system.Q_MContest'),
    value: ModuleType.Q_M_CONTEST,
  },
  {
    label: i18n.t('systemManagement.system.CTFContest'),
    value: ModuleType.CTF_CONTEST,
  },
  {
    label: i18n.t('systemManagement.system.AWDPContest'),
    value: ModuleType.AWDP_CONTEST,
  },
  {
    label: i18n.t('systemManagement.system.A_DContest'),
    value: ModuleType.A_D_CONTEST,
  },
  {
    label: i18n.t('systemManagement.system.CFSContest'),
    value: ModuleType.CFS_CONTEST,
  },
  {
    label: i18n.t('systemManagement.system.team'),
    value: ModuleType.TEAM,
  },
];

// 系统备份-协议
export const remoteList = [
  {
    label: 'SFTP',
    value: 'SFTP',
  },
  {
    label: 'FTP',
    value: 'FTP',
  },
  {
    label: 'SCP',
    value: 'SCP',
  },
];
// 系统备份-自动备份间隔
export const backupIntervalList = [
  {
    label: '60',
    value: 60,
  },
  {
    label: '120',
    value: 120,
  },
  {
    label: '1440',
    value: 1440,
  },
];
