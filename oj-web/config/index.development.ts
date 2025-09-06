import { ICyberConfig } from '@cyber/cli';

export default {
  mode: 'history',
  // 调试nodel_models/@cyber
  // 正常情况设为false,以免影响本地环境开启速度
  cacheExcludeCyber: false,
} as ICyberConfig;
