import { V, N, Constant } from '../base';
Constant.add({
  Personal: {
    StudyType: {
      Elective: V(false, N('m.elective')), // 选修
      Compulsory: V(true, N('m.compulsory')), // 必修
    },
    CareerGoals: {
      Basis: V(0, N('m.basis')), // '基础'basis
      Intermediate: V(1, N('m.intermediate')), // '进阶'Advanced
      Advanced: V(2, N('m.advanced')), // '高级'
    },
    OccupationLevel: {
      Primary: V(1, N('m.lowLevel')), // 初级
      Medium: V(2, N('m.middleLevel')), // 中级
      Advanced: V(3, N('m.highLevel')), // 高级
    },
  },
});

export default Constant;
