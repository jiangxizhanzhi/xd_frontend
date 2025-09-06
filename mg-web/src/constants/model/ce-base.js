import { V, N, Constant } from '@/constants/base';

Constant.add({
  EventType: {
    TRAINING_SINGLE: V(1, N('crEvent.trainingSingle')),
    VULNERABILITY_VERIFICATION: V(2, N('crEvent.vulnerabilityVerification')),
    TRAINING_TEAM: V(3, N('crEvent.trainTeam')),
    RED_AND_BLUE_CONFRONTATION: V(4, N('crEvent.redAndBlueConfrontation')),
    MY_SHOOTING_RANGE: V(5, N('crEvent.myShootingRange')),
    WEAPON_RESEARCH: V(6, N('crEvent.weaponResearch')),
    SYSTEM_EVALUATION: V(7, N('crEvent.systemEvaluation')),
  },
  CeBase: {
    Difficult: {
      LOW: V(1, N('crEvent.primary')),
      MIDDLE: V(2, N('crEvent.middleLevel')),
      HIGH: V(3, N('crEvent.advanced')),
    },
    Category: {
      PENETRATION_TEST: V(1, N('crEvent.penetrationTest')),
      OPERATION_AND_MAINTENANCE_PROTECTION: V(
        2,
        N('crEvent.operationProtection'),
      ),
      OTHERS: V(5, N('crEvent.ceOthers')),
    },
  },
});
