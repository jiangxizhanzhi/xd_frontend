import { V, N, Constant } from '@/constants/base';
Constant.add({
  Condition: {
    Category: {
      ALL: V('', N('m.all')),
      PenetrationTest: V(1, N('m.penetrationTest')),
      OperationalProtection: V(2, N('m.operationalProtection')),
      SimulationSystem: V(3, N('m.simulationSystem')),
      AdversarialTraining: V(4, N('m.adversarialTraining')),
      Others: V(5, N('m.others')),
    },
    Difficult: {
      ALL: V('', N('m.all')),
      Low: V(1, N('m.lowLevel')),
      Middle: V(2, N('m.middleLevel')),
      High: V(3, N('m.highLevel')),
    },
  },
  Training: {
    TrainingStatus: {
      NoBegin: V(0, N('m.noBegin')),
      VsNoBegin: V(4, N('m.noBegin')),
      Already: V(1, N('m.already')),
      Already2: V(2, N('m.already')),
      Already3: V(3, N('m.already')),
      HasEnded: V(2, N('m.hasEnded')),
    },
  },

  FlowType: {
    attack: V(1, N('m.attackTraffic')),
    background: V(0, N('m.backgroundTraffic')),
  },
});
export default Constant;
