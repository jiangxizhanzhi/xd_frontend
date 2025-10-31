import PageStatus from '../../pages/store/page-status';
import _ from 'lodash';

/**
 * 多样化公共方法
 * @param rgba
 */
export const transferRGBA = (rgba: any) => {
  return `rgba(${rgba.r},${rgba.g}, ${rgba.b}, ${rgba.a})`;
};
export const transferRGBAToObj = (rgbaStr: any) => {
  if (rgbaStr?.indexOf('rgba') >= 0) {
    let rgbaArr = rgbaStr.split('(')[1].split(')')[0]?.split(',');
    return {
      r: rgbaArr[0].replace(/\s*/g, ''),
      g: rgbaArr[1].replace(/\s*/g, ''),
      b: rgbaArr[2].replace(/\s*/g, ''),
      a: rgbaArr[3].replace(/\s*/g, ''),
    };
  } else {
    return rgbaStr;
  }
};
// 初始主题色值转换
export const initialThemeColorToRGBA = (val: any) => {
  let objToBeTransfer = _.cloneDeep(val);
  if (
    [
      'var(--neutral0)',
      'var(--neutral1)',
      'var(--neutral9)',
      'var(--neutral7)',
      'var(--primary-color)',
    ].includes(val)
  ) {
    if (PageStatus.state.theme === 'light') {
      if (val === 'var(--neutral0)') {
        objToBeTransfer = 'rgba(0, 0, 0, 0.03)';
      }
      if (val === 'var(--neutral1)') {
        objToBeTransfer = 'rgba(0, 0, 0, 0.05)';
      }
      if (val === 'var(--neutral9)') {
        objToBeTransfer = 'rgba(0, 0, 0, 1)';
      }
      if (val === 'var(--neutral7)') {
        objToBeTransfer = 'rgba(0, 0, 0, 0.7)';
      }
    }
    if (PageStatus.state.theme === 'dark') {
      if (val === 'var(--neutral0)') {
        objToBeTransfer = 'rgba(255, 255, 255, 0.05)';
      }
      if (val === 'var(--neutral1)') {
        objToBeTransfer = 'rgba(255, 255, 255, 0.1)';
      }
      if (val === 'var(--neutral9)') {
        objToBeTransfer = 'rgba(255, 255, 255, 1)';
      }
      if (val === 'var(--neutral7)') {
        objToBeTransfer = 'rgba(255, 255, 255, 0.7)';
      }
    }
  }
  return transferRGBAToObj(objToBeTransfer);
};
