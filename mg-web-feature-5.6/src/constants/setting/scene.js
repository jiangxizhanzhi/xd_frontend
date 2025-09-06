import { Constant } from '@/constants/base';

const defaultDeviceLogoDir = 'scene/device_logo/default_logo/';

Constant.addSetting({
  DEFAULT_DEVICE_LOGO_ABSOLUTE_DIR: `${Constant.SETTING.MEDIA_URL}${defaultDeviceLogoDir}`,
});

export default Constant;
