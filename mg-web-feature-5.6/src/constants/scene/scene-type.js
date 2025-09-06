import { getI18N } from '@cyber/helper';

export const sceneType = {
  110: {
    type: 'PRACTICE',
    label: getI18N().t('constants.sceneType.PRACTICE'),
  },
  120: {
    type: 'LESSON',
    label: getI18N().t('constants.sceneType.LESSON'),
  },
  121: {
    type: 'CLASS',
    label: getI18N().t('constants.sceneType.CLASS'),
  },
  130: {
    type: 'EXAM',
    label: getI18N().t('constants.sceneType.EXAM'),
  },
  140: {
    type: 'LESSON_PRACTICE',
    label: getI18N().t('constants.sceneType.LESSON_PRACTICE'),
  },
  211: {
    type: 'INDIVIDUAL_TRAINING',
    label: getI18N().t('constants.sceneType.INDIVIDUAL_TRAINING'),
  },
  213: {
    type: 'TEAM_TRAINING',
    label: getI18N().t('constants.sceneType.TEAM_TRAINING'),
  },
  214: {
    type: 'READ_VS_BLUE',
    label: getI18N().t('constants.sceneType.READ_VS_BLUE'),
  },
  236: {
    type: 'SOFT_TEST',
    label: getI18N().t('constants.sceneType.SOFT_TEST'),
  },
  300: {
    type: 'ADCOMM',
    label: getI18N().t('constants.sceneType.ADCOMM'),
  },
  301: {
    type: 'OPSRACE',
    label: getI18N().t('constants.sceneType.OPSRACE'),
  },
  302: {
    type: 'JEOPARDY',
    label: getI18N().t('constants.sceneType.JEOPARDY'),
  },
  303: {
    type: 'AD',
    label: getI18N().t('constants.sceneType.AD'),
  },
  304: {
    type: 'CFS',
    label: getI18N().t('constants.sceneType.CFS'),
  },
  310: {
    type: 'LIVE_VULNERABILITY',
    label: getI18N().t('constants.sceneType.LIVE_VULNERABILITY'),
  },
};
// ADCOMM = opt.IntOption(300, "AD通用")
// OPSRACE = opt.IntOption(301, "运维赛")
// JEOPARDY = opt.IntOption(302, "解题赛")
// AD = opt.IntOption(303, "攻防赛")
// PRACTICE = 110;
// LESSON = 120;
// EXAM = 130;
// LESSON_PRACTICE = 140;
// INDIVIDUAL_TRAINING = 211;
// LIVE_VULN = 212;
// TEAM_TRAINING = 213;
// READ_VS_BLUE = 214;
// WEAPON_TEST = 216;
// SYSTEM_TEST = 217;
// SOFT_TEST = 221;

// INFILTRATION = 310;
// COURSE_TRAINING = 150;
// SKILLS_ASSESSMENT = 231;
// TACTICAL_ASSESSMENT = 232;
// COMPREHENSIVE_ASSESSMENT = 233;
// TACTICAL_TRAINING = 234;
// COMPREHENSIVE_TRAINING = 235;
