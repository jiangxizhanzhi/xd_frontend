import { Constant } from '@/constants/base';

const defaultUserLogDir = 'event_logo/default_event_logo/';

Constant.addSetting({
  DEFAULT_USER_LOGO_DIR: defaultUserLogDir,
  DEFAULT_USER_LOGO_ABSOLUTE_DIR: `${Constant.SETTING.MEDIA_URL}${defaultUserLogDir}`,
});

export default Constant;
