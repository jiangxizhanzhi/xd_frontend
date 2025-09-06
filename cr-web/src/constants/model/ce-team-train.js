import { V, N, Constant } from '@/constants/base';

Constant.add({
  TrainCategory: {
    PENETRATION_TEST: V(1, N('crEvent.penetrationTest')),
    OPERATION_AND_MAINTENANCE_PROTECTION: V(
      2,
      N('crEvent.operationProtection'),
    ),

    OTHERS: V(5, N('crEvent.ceOthers')),
  },
  TeamTrain: {
    Permission: {
      TEACHER: V(1, N('crEvent.teacher')),
      STUDENT: V(2, N('crEvent.student')),
    },
    Difficult: {
      LOW: V(1, N('crEvent.primary')),
      MIDDLE: V(2, N('crEvent.middleLevel')),
      HIGH: V(3, N('crEvent.advanced')),
    },
  },
  ValidateErrorType: {
    // 标签组件中的错误类型
    inputRoleNameErrorType: {
      RoleNameError: V(1, N('crEvent.inputRoleNameError')),
      RoleNameLengthError: V(2, N('crEvent.inputRoleNameLength')),
      RoleNameExistError: V(3, N('crEvent.roleExist')),
      RoleNameEmptyError: V(4, N('crEvent.trainSkillIsNullInfo')),
    },
    inputRoleDescErrorType: {
      DescError: V(1, N('crEvent.inputRoleDescError')),
      DescLengthError: V(2, N('crEvent.inputRoleDescLength')),
      DescEmptyError: V(3, N('crEvent.trainSkillIsNullInfo')),
    },
  },
});
