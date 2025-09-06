import { V, N, Constant } from '@/constants/base';

Constant.add({
  CrEventScene: {
    TimeStatus: {
      STOP: V(0, N('m.stop')),
      PAUSE: V(1, N('m.pause')),
      START: V(2, N('m.startUpTime')),
      RECOVERY: V(3, N('m.recoveryTime')),
    },
  },
});

export default Constant;
