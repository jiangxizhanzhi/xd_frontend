import { getI18N } from '@cyber/helper';
let i18n = getI18N();

export const DIFFICULTY = {
  PRIMARY: 0, //初级
  MEDIUM: 1, // 中级
  ADVANCED: 2, // 高级
};

export const LESSON_TYPE = {
  THEORY: 0, //理论课
  EXPERIMENT: 1, //实验课
};

export const HTML_TYPE = {
  AllNot: 0, // 都不是
  MARKDOWN: 1, // Markdown
  PPT: 2, // ppt
};
export const STUDY_TYPE = {
  DEPLOY_NOT: 0, // 未配置
  ELECTIVE: 1, // 选修
  COMPILSORY: 2, // 必修
};

export const NOTE_TYPE = {
  NOTE: 1, // 笔记
  REPORT: 2, // 报告
};

export const RESOURCE_TYPE = {
  COURSE: 1, // 课程
  LESSON: 2, // 课时
  PRACTICE: 3, // 练习
  THEORY: 5, // 前台理论题笔记
};
export const COMMENT_TYPE = {
  // 评论资源类型
  COURSE: 1, // 课程
  LESSON: 2, // 课时
  PRACTICE: 3, // 夺旗习题
};
export const SHARE_MODEL = {
  PRIVATE: 1, // 私有场景
  SHARED: 2, //共享场景
  GROUP: 3, //小组场景
};

export const SCENE_STATUS = {
  DELETED: 0, //'删除'
  NORMAL: 1, //'正常'
  PAUSE: 1, //'暂停'
  RECOVERY: 3, //'恢复'
};

export const LEARN_TYPE = {
  NOSET: 0, // 未设置
  COMPULSORY: 2, // 必修
  ELECTIVE: 1, // 选修
};

export const TRARN_STATUE = {
  NOT_START: 0,
  RUNNING: 1,
  END: 2,
  PAUSE: 3,
  RECOVERY: 4,
};

export const TRARN_DIFFICULTY = {
  PRIMARY: 1, //初级
  MEDIUM: 2, // 中级
  ADVANCED: 3, // 高级
};
export const TRAIN_TYPE = {
  SINGLE: 1, //单兵
  TEAM: 3, // 团队
  RED: 4, // 红蓝
};
export const TRAIN_TYPE_LIST = [
  {
    code: TRAIN_TYPE.SINGLE,
    name: i18n.t('trainType.single'),
  },
  {
    code: TRAIN_TYPE.TEAM,
    name: i18n.t('trainType.team'),
  },
  {
    code: TRAIN_TYPE.RED,
    name: i18n.t('trainType.red'),
  },
];
export const REDVSBLUE = {
  ADMIN: 1, //管理员
  DIRECTOR: 2, //导演
  REFEREE: 3, // 裁判
  REDUSER: 4, // 红方
  BLUEUSER: 5, //蓝方
};

export const HELP_STATUS = {
  NOT_REQUEST: 0, //0=未请求协助
  REQUEST: 1, //1=请求协助
  REQUESTING: 2, //2=协助中
  END_REQUEST: 3, //3=协助已结束
};

export const BUSINESS_TYPE = {
  OJ_CMS_COURSE: 1, // 后台课程
  OJ_CMS_EXERCISE_GATHER: 2, //后台习题集
  CR_WEB_TEAM: 3, //前台团队训练
  CR_CMS_TEAM: 4, //后台团队训练
  CR_WEB_RED: 5, //前台红蓝对抗
  CR_CMS_RED: 6, //后台红蓝对抗
  CR_CMS_SINGLE: 7, //后台单兵训练
  CR_CMS_TOOL: 8, //后台工具库
  CR_WEB_SINGLE: 9, //前台单兵训练
  CR_WEB_TEST: 10, //前台靶场测评
  OJ_WEB_EXERCISE_FLAG: 11, // 前台实操习题
  OJ_WEB_COURSE: 12, // 前台课程
  OJ_CMS_THEROR: 13, // 后台理论习题
  OJ_CMS_FLAG: 14, // 后台实操习题
  OJ_WEB_THEORY: 15, // 前台理论题
};
