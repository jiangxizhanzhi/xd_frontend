import { V, N, Constant } from '@/constants/base';

Constant.add({
  User: {
    Group: {
      ADMIN: V(1, N('common.admin')),
      TEACHER: V(2, N('common.teacher')),
      STUDENT: V(3, N('common.student')),
    },
  },
  Role: {
    TeamTrain: {
      TEACHER: V(1, N('common.teacher')),
      STUDENT: V(2, N('common.student')),
    },
    RedVsBlue: {
      ADMIN: V(1, N('common.admin')),
      DIRECTOR: V(2, N('common.director')),
      REFEREE: V(3, N('common.referee')),
      REDUSER: V(4, N('common.redUser')),
      BLUEUSER: V(5, N('common.blueUser')),
    },
  },
  DataDisplay: {
    REDTEAM: V(4, N('红方')),
    BLUETEAM: V(5, N('蓝方')),
  },
});

export default Constant;
