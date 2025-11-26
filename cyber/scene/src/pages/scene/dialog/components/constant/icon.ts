// TODO  LAN 口 图标
// 电口
// @ts-ignore
import eleConnect from '../../../../../assets/images/ports/ele-connect.svg';
// @ts-ignore
import eleUnconnect from '../../../../../assets/images/ports/ele-unconnect.svg';
// @ts-ignore
import eleUnopen from '../../../../../assets/images/ports/ele-unopen.svg';
// @ts-ignore
import wanUnconnect from '../../../../../assets/images/ports/wan-unconnect.svg';
// @ts-ignore
import wanConnect from '../../../../../assets/images/ports/wan-connect.svg';
// 光口
// @ts-ignore
import lightConnect from '../../../../../assets/images/ports/light-connect.svg';
// @ts-ignore
import lightUnconnect from '../../../../../assets/images/ports/light-unconnect.svg';
// @ts-ignore
import lightUnopen from '../../../../../assets/images/ports/light-unopen.svg';

export const PORT_TYPE = ['electrical', 'light', 'wan', 'lan', 'port'];
export const ICON_GROUP = {
  electrical: {
    connect: 'ele-connect',
    open: 'ele-unconnect',
    unOpen: 'ele-unopen',
  },
  light: {
    connect: 'light-connect',
    open: 'light-unconnect',
    unOpen: 'light-unopen',
  },
  wan: {
    connect: 'wan-connect',
    open: 'wan-unconnect',
    unOpen: 'ele-unopen',
  },
  lan: {
    connect: 'ele-connect',
    open: 'ele-unconnect',
    unOpen: 'ele-unopen',
  },
};
