import { zIndex } from '../../../../types/z-index';
import { subStr } from '../../../../utils/common';
/**
 * 新增层节点自定义配置
 * @param id
 * @param label 层级名称
 * @param data
 * @param position 节点位置
 * @param logo
 */
export const addLayerNodeConfig = (
  id: string,
  label: string,
  data: any,
  position?: { x: number; y: number },
  logo?: string,
) => {
  const NODE_SIZE = 40;
  return {
    id,
    shape: 'image',
    width: NODE_SIZE,
    height: NODE_SIZE,
    x: position && position.x,
    y: position && position.y,
    options: {
      relative: false,
    },
    label: label ? subStr(label, 40) : '',
    data,
    attrs: {
      image: {
        xlinkHref:
          logo || require('../../../../assets/images/level-icon.svg').default,
        cursor: 'pointer',
      },
      label: {
        refY: 50,
        fill: 'var(--neutral9)',
        class: 'node-label original fill',
        fontSize: 12,
      },
      circle: {
        magnet: true,
        strokeWidth: 2,
        event: 'node:port-click',
        refX: 20,
        refY: 20,
        class: 'port-circle',
        r: 6,
        fill: '#fff',
        stroke: 'var(--green-color)',
        style: {
          visibility: 'hidden',
        },
      },
    },
    markup: [
      {
        tagName: 'image',
        selector: 'image',
      },
      {
        tagName: 'circle',
        selector: 'circle',
      },
      {
        tagName: 'text',
        selector: 'label',
      },
    ],
    zIndex: zIndex['node'],
    ports: getPorts(data?.networkConfig?.network, 40),
  };
};
/* 端口生成 */
const getPorts = (network: Array<any>, size: any) => {
  let items = network?.map((port) => ({
    id: port.id,
    group: 'bottom',
    args: {
      x: size ? size / 2 : 20,
      y: size ? size / 2 : 20,
    },
  }));
  return {
    groups: {
      bottom: {
        position: 'absolute',
        attrs: {
          circle: {
            r: 0,
            magnet: false,
            style: {
              visibility: 'hidden',
            },
          },
        },
      },
    },
    items,
  };
};
