export default {
  stashedCourseIdKey: 'course.batchAuthSet.courseIds',
  SPLITSCREEN: {
    // 分屏
    ONE: 1,
    FOUR: 4,
    NINE: 9,
    TWELVE: 12,
  },
  COURSES: {
    SHARE: {
      ALL: 1, // 分享全部
      PART: 2, // 自定义分享
    },
    AUTH: {
      ALL: 1, // 授权全部
      PART: 2, // 自定义授权
    },
    TYPE: {
      THEORY: 0,
      LABS_TYPE: 1,
    },
    LEARNTYPE: {
      NOSET: 0, // 未设置
      COMPULSORY: 2, // 必修
      ELECTIVE: 1, // 选修
    },
    DIFFICULTY: {
      // 难度级别
      ADVANCED: 2,
      MEDIUM: 1,
      PRIMARY: 0,
    },
    LEARNTIME: {
      FIVE: 5, // 未设置
      TEN: 10, // 必修
      FIFTEEN: 15, // 选秀
      THIRTY: 30, // 未设置
      SIXTY: 60, // 必修
      ONE_HUNDRED_TWENTY: 120, // 选修
    },
    // 课程编排 tree 类型
    TREE_NODE: {
      CLASS: 2, //   课时
      CHAPTER: 1, //章节
      COURSE: 0, // 课程
    },
  },
  DEVICE: {
    IMAGE_TYPE: {
      VM: 'vm',
      CONTAINER: 'container',
      ENTITY: 'entity',
    },
  },
  SCENE: {
    SHARE_MODEL: {
      PRIVATE: 1,
      SHARED: 2,
      GROUP: 3,
    },
  },
  SCENE_STATUS: {
    DELETED: 0, //'删除'
    NORMAL: 1, //'正常'
    PAUSE: 1, //'暂停'
    RECOVERY: 3, //'恢复'
  },
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
};
