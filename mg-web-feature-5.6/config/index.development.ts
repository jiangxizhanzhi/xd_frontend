import { ICyberConfig } from '@cyber/cli';

export default {
  mode: 'history',
  base: '/dev/mg',
  // 调试nodel_models/@cyber
  // 正常情况设为alse,以免影响本地环境开启速度
  cacheExcludeCyber: false,
} as ICyberConfig;
