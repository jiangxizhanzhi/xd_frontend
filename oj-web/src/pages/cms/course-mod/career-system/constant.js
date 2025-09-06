import { getI18N } from '@cyber/helper';

export const DIFFICULTY = {
  ADVANCED: 2,
  MEDIUM: 1,
  PRIMARY: 0,
};
export const sceneType = {
  211: {
    type: 'INDIVIDUAL_TRAINING',
    label: getI18N().t('sceneType.INDIVIDUAL_TRAINING'),
  },
  213: {
    type: 'TEAM_TRAINING',
    label: getI18N().t('sceneType.TEAM_TRAINING'),
  },
  214: {
    type: 'READ_VS_BLUE',
    label: getI18N().t('sceneType.READ_VS_BLUE'),
  },
};

export const TASK_DIFFICULTY = {
  primary: 1,
  middle: 2,
  advanced: 3,
};

export const TASK_DIFFICULTY_LIST = [
  {
    label: getI18N().t('careerSystem.primary'),
    value: TASK_DIFFICULTY.primary,
  },
  {
    label: getI18N().t('careerSystem.middle'),
    value: TASK_DIFFICULTY.middle,
  },
  {
    label: getI18N().t('careerSystem.advanced'),
    value: TASK_DIFFICULTY.advanced,
  },
];
