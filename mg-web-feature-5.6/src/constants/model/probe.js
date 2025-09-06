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
});
