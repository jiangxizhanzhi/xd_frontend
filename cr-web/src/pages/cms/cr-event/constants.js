import { getI18N } from '@cyber/helper';
export default {
  stashedExerciseIdKey: 'stashed-exercise-ids-key',
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
};

export const EVENT_DIFFICULT = {
  LOW: 1,
  MIDDLE: 2,
  HIGH: 3,
};
export const EVENT_DIFFICULT_LIST = [
  {
    name: getI18N().t('crEvent.primary'),
    value: EVENT_DIFFICULT.LOW,
  },
  {
    name: getI18N().t('crEvent.middleLevel'),
    value: EVENT_DIFFICULT.MIDDLE,
  },
  {
    name: getI18N().t('crEvent.advanced'),
    value: EVENT_DIFFICULT.HIGH,
  },
];
