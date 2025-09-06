import { V, N, Constant } from '@/constants/base';

Constant.add({
  Traffic: {
    TrafficType: {
      BACKGROUND: V(1, N('traffic.staticTraffic')),
      INTELLIGENT: V(2, N('traffic.dynamicTraffic')),
    },
    Intelligent: {
      ScriptType: {
        PYTHON: V(0, N('python')),
        SHELL: V(1, N('shell')),
      },
    },

    ParamType: {
      IP: V('IP', 'IP'),
      NUMBER: V('Number', 'Number'),
      STRING: V('String', 'String'),
      BOOL: V('Bool', 'Bool'),
    },
  },
});

export default Constant;
