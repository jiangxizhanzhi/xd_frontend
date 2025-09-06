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

    TrafficCategory: {
      BACKGROUND: V(0, N('traffic.staticTraffic')),
      INTELLIGENT: V(1, N('traffic.dynamicTraffic')),
      MIXED: V(2, N('traffic.mixedTraffic')),
    },

    ParamTypesNew: {
      IP: V(1, 'IP'),
      NUMBER: V(2, 'Number'),
      STRING: V(0, 'String'),
      BOOL: V(3, 'Bool'),
    },
  },
});

export default Constant;
