import { generateUUID, isJSON } from '../../../../utils/common';
import { zIndex } from '../../../../types/z-index';

/**
 * 新增区块
 */
export const addBlockConfig = (
  id: string,
  startPosition: { x: number; y: number },
  endPosition: { x: number; y: number },
  label: string,
  children?: any,
  isTemporary?: boolean,
  attrs?: any,
) => {
  const blockAttrs = attrs && gerBlockAttrs(attrs);
  let width = endPosition.x - startPosition.x;
  let height = endPosition.y - startPosition.y;
  let bodyFill = blockAttrs?.body?.fill || 'var(--neutral0)';
  let bodyStroke = blockAttrs?.body?.stroke || 'var(--neutral1)';
  let labelFill = blockAttrs?.label?.fill || 'var(--neutral9)';

  let originalLabelClass =
    labelFill === 'var(--neutral9)' ? 'label-fill original' : 'label-fill';
  let originalClassArr = updateBlockClassName(blockAttrs);

  return {
    shape: 'html',
    id: id || generateUUID(),
    x: startPosition.x,
    y: startPosition.y,
    width,
    height,
    data: {
      parent: true,
      isTemporary: isTemporary,
      fillPic: blockAttrs?.fillPic || '',
      animation: blockAttrs?.animation || '',
    },
    angle: blockAttrs?.angle || 0,
    // html: () => {
    //   const wrap = document.createElement('div')
    //   wrap.style.width = '100%'
    //   wrap.style.height = '100%'
    //   return wrap
    // },
    resizing: true,
    attrs: {
      body: {
        // fill: 'var(--neutral0)',
        // stroke: 'var(--neutral1)',
        fill: bodyFill,
        refPoints: `0,0 ${width},0 ${width},${height} 0,${height}`,
        class: originalClassArr,
        strokeWidth: blockAttrs?.body?.strokeWidth || '1px',
        transform: blockAttrs?.body?.transform || 'rotate(0)',
        rx: blockAttrs?.body?.rx || 0,
        strokeDasharray: blockAttrs?.body?.strokeDasharray || 0,
        style: {
          animation:
            blockAttrs?.animation === 'flow'
              ? 'running-line 30s infinite linear'
              : '',
        },
        stroke: bodyStroke,
        // filter: 'blur(5px)'
        // stroke: {
        //   type: 'linearGradient',
        //   stops: [
        //     { offset: '0%', color: '#ccc' },
        //     { offset: '50%', color: '#73d13d' },
        //     { offset: '100%', color: 'var(--primary-color)' },
        //   ],
        // },
      },
      label: {
        text: label,
        fontSize: parseFloat(blockAttrs?.label?.fontSize) || 14,
        refY: blockAttrs?.label?.refY || 15,
        refX: blockAttrs?.label?.refX || 10,
        // fill: 'var(--neutral9)',
        fill: labelFill,
        class: originalLabelClass,
        textAnchor: 'left', // 左对齐
        textVerticalAnchor: 'top', // 上对齐
        transform: blockAttrs?.label?.transform || 'rotate(0)',
        transformOrigin: '-10px -15px',
        fontWeight: blockAttrs?.label?.fontWeight || 400,
      },
    },
    children,
    zIndex: blockAttrs?.zIndex || zIndex['block'],
  };
};
/**
 * 解析群组区块多样化属性
 * @param attrs
 */
export function gerBlockAttrs(attrs: any) {
  if (attrs && isJSON(attrs)) {
    return JSON.parse(attrs);
  }
}
// 更新className
export const updateBlockClassName = (attrs: any) => {
  let originalClassName = '';
  if (attrs?.body?.fill === 'var(--neutral0)') {
    originalClassName += 'body-fill body-fill-original';
  } else {
    originalClassName += 'body-fill';
  }
  if (attrs?.body?.stroke === 'var(--neutral1)') {
    originalClassName += ' body-stroke body-stroke-original';
  } else {
    originalClassName += ' body-stroke';
  }
  if (!attrs) {
    originalClassName +=
      'body-fill body-fill-original body-stroke body-stroke-original';
  }
  return originalClassName;
};
