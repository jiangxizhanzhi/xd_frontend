import { V, N, Constant } from '@/constants/base';

Constant.add({
  Mission: {
    Difficulty: {
      INTRODUCTION: V(0, N('m.simple')),
      INCREASE: V(1, N('m.general')),
      EXPERT: V(2, N('m.difficult')),
    },
    TastType: {
      JUDGE: V(0, N('m.judge')),
      SINGLE: V(1, N('m.radio')),
      MULTIPLE: V(2, N('m.multipleSelection')),
      FILBLANK: V(3, N('m.fillPosition')),
      QUESTIONSANSWER: V(4, N('m.questionAnswer')),
      ATTACK: V(5, N('m.attack')),
      DEFENSE: V(6, N('m.defense')),
      FILE: V(7, N('m.files')),
    },
    FinishedCondition: {
      TOEVALUATE: V(0, N('m.toEvaluate')),
      SUCCESS: V(1, N('m.success')),
      FAIL: V(2, N('m.fail')),
      REJECT: V(3, N('m.reject')),
      HASISSUED: V(11, N('hasIssued')),
    },
  },
  Action: {
    ActionType: {
      Issued: V(1, N('m.issued')),
      Report: V(4, N('m.report')),
      Success: V(7, N('m.success')),
      Fail: V(8, N('m.fail')),
      Reject: V(9, N('m.reject')),
    },
  },
  Statistical: {
    StatisticalState: {
      HasReport: V(0, N('m.hasReport')),
      Report: V(1, N('m.trainRunning')),
      NoBegin: V(2, N('m.notIssued')),
    },
  },
});

export default Constant;
