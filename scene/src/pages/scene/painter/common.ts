import { subStr } from '../../../utils/common';

/**
 * 绘制节点名称
 * @param name
 * @param nodeCls
 */
export const updateName = (name: any, nodeCls: any) => {
  let label = name ? subStr(name, 40) : '';
  nodeCls.setAttrByPath('text/text', label);
};

/**
 * 绘制节点图标
 * @param icon
 * @param nodeCls
 */
export const updateIcon = (icon: any, nodeCls: any) => {
  nodeCls.attr('image/xlinkHref', icon);
};
