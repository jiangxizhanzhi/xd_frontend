import { V, N, Constant } from '@/constants/base';

Constant.add({
  Tools: {
    Platforms: {
      LINUX: V('Linux'),
      WINDOWS: V('Windows'),
      MAC: V('macOS'),
      ANDROID: V('Android'),
      IOS: V('iOS '),
      OTHERS: V('Others'),
    },

    Language: {
      ENGLISH: V('en', N('toolLanguage.english')),
      CHINESE: V('cn', N('toolLanguage.chinese')),
    },
    ToolTypes: {
      OFFLINE_TOOL: V(0, N('tools.offlineTool')),
      /* ONLINE_TOOL: V(1, N('tools.onlineTool')), */
    },
  },
});

export default Constant;
