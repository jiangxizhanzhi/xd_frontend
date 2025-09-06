import { getI18N } from '@cyber/helper';
let i18n = getI18N();
export function gettext(str) {
  return i18n.t(str);
}

// function gettext(str) {
//   let data = i18n.messages[i18n.locale];
//   for (const key of str.split('.')) {
//     data = data[key];
//   }
//   if (!data) {
//     data = str;
//   }

//   return data;
// }

export default {
  stashedExerciseIdKey: 'stashed-exercise-ids-key',
};

export const TaskType = {
  SINGLE: 0,
  MULTIPLE: 1,
  JUDGE: 2,
  BLANK: 3,
  SHORTQUES: 4,
  OPERATE: 5,
};

export const SCENE_SHOW = {
  PRIVATE: 1,
  SHARED: 2,
};

export const DIFF = {
  INTRODUCTION: 0,
  INCREASE: 1,
  EXPERT: 2,
};

export const EXERTYPE = {
  EXAM: 0,
  CTF: 1,
  CHECK: 2,
};

export const DEVICE = {
  IMAGETYPE: {
    VM: 'vm',
    CONTAINER: 'container',
    ENTITY: 'entity',
  },
};

export const COURSES = {
  SHARE: {
    ALL: 1, // 分享全部
    PART: 2, // 自定义分享
  },
  SHARE_TEACHER: {
    ALL: 1, // 已分享
    PART: 0, // 未分享
  },
  AUTH: {
    ALL: 1, // 授权全部
    PART: 2, // 自定义授权
  },
  TYPE: {
    THEORY: 0,
    LABSTYPE: 1,
  },
  LEARN_TYPE: {
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
  STAGE: {
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
    ONEHUNDREDTWENTY: 120, // 选秀
  },
  // 课程编排 tree 类型
  TREENODE: {
    CLASS: 2,
    CHAPTER: 1,
    COURSE: 0,
  },
};

export const SCENE = {
  STATUS: {
    DELETED: 0,
    INITIAL: 1,
    RUNNING: 2,
    ON_EVENT: 3,
  },
  EVENT: {
    WAIT: 0,
    INITIATE: 1,
    CREATE: 2,
    START: 3,
    STOP: 4,
    RESTART: 5,
    PAUSE: 6,
    UNPAUSE: 7,
    SNAPSHOT: 8,
    DELETE: 9,
    MODIFY: 10,
  },
  EVENTSTATUS: {
    START: 0,
    IN_PROGRESS: 1,
    OVER: 2,
    ABNORMAL: 3,
  },
  SHAREMODEL: {
    PRIVATE: 1,
    SHARED: 2,
    GROUP: 3,
  },
};

export const SCENE_STATUS = {
  DELETED: 0, //'删除'
  NORMAL: 1, //'正常'
  RECOVERY: 1, //'恢复'
  PAUSE: 3, //'暂停'
};

export const FLAG_TYPE = {
  static: 0, // 静态flag
  dynamic: 1, // 动态flag
  random: 2, // 随机flag
};
export const FLAG_TYPE_ARR_HAVE_SCENE = [
  {
    label: gettext('flags.staticFlag'),
    value: FLAG_TYPE.static,
  },
  {
    label: gettext('flags.dynamicFlag'),
    value: FLAG_TYPE.dynamic,
  },
  {
    label: gettext('flags.randomFlag'),
    value: FLAG_TYPE.random,
  },
];
export const FLAG_TYPE_ARR_NO_SCENE = [
  {
    label: gettext('flags.staticFlag'),
    value: FLAG_TYPE.static,
  },
  {
    label: gettext('flags.randomFlag'),
    value: FLAG_TYPE.random,
  },
];

// 理论习题 难度
export const THEORY_DIFF = {
  PRIMARY: 0, // 初级
  MIDDLE: 1, // 中级
  ADVANCE: 2, // 高级
};
