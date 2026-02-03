import background_dark from '../../../../assets/images/dark/background.png';
import background2_dark from '../../../../assets/images/dark/background2.png';
import background3_dark from '../../../../assets/images/dark/background3.png';
import background_light from '../../../../assets/images/light/background.png';
import background2_light from '../../../../assets/images/light/background2.png';
import background3_light from '../../../../assets/images/light/background3.png';
import PageStatus from '../../../store/page-status';
/**
 * 获取背景图
 */
export function getBackground(basicConfig: any, theme: string) {
  let backgroundList;
  if (theme === 'dark') {
    backgroundList = {
      background: background_dark,
      background2: background2_dark,
      background3: background3_dark,
    };
  } else {
    backgroundList = {
      background: background_light,
      background2: background2_light,
      background3: background3_light,
    };
  }
  if (basicConfig && basicConfig.active) {
    if (
      ['background', 'background2', 'background3'].includes(basicConfig.active)
    ) {
      // @ts-ignore
      return backgroundList[basicConfig.active];
    } else {
      return basicConfig.active;
    }
  } else {
    return backgroundList['background'];
  }
}
