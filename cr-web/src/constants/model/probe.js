import { V, N, Constant } from '@/constants/base';

Constant.add({
  Probe: {
    ParamType: {
      NUMBER: V(0, 'Number'),
      STRING: V(1, 'String'),
      BOOL: V(2, 'Bool'),
      IP: V(3, 'IP'),
    },
  },

  ProbesNew: {
    ParamType: {
      NUMBER: V(2, 'Number'),
      STRING: V(0, 'String'),
      BOOL: V(3, 'Bool'),
      IP: V(1, 'IP'),
    },
  },
});
