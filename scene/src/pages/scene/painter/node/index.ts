import {
  getNodeStatus,
  NODE_STATUS_MAKEUP,
} from '../../../../types/node-status';
import sceneStore from '../../../../store/scene-store';
import { zIndex } from '../../../../types/z-index';
import { isJSON, subStr } from '../../../../utils/common';
import t from '../../../../utils/i18n';
// import cloud from './cloud.svg';
/**
 * 新增节点自定义配置
 *
 * @param id
 * @param imageUrl 靶标图片
 * @param label 默认为靶标名称
 * @param data 靶标业务数据
 * @param temp 是否是临时节点，拖拽模板默认生成临时节点，临时节点不需要生成端口
 * @param position 节点位置
 * @param parent 父区块
 * @param attrs
 * @param isUpperNode
 */
export const addNodeConfig = (
  id: string,
  imageUrl: string,
  label: string,
  data: object,
  temp?: boolean,
  position?: { x: number; y: number },
  parent?: any,
  attrs?: any,
  isUpperNode?: boolean,
) => {
  // @ts-ignore
  let status =
    sceneStore.state.sceneStatus === 'display'
      ? getNodeStatus(
          data.basicConfig?.process_status,
          data.basicConfig?.event,
          data.basicConfig?.event_status,
        )
      : '';
  // @ts-ignore
  let image_type = data.basicConfig?.image_type;
  // @ts-ignore
  let cloudInit = data.basicConfig?.init_support;
  const NODE_SIZE = 40;
  const NODE_OFFSET = 0; // 节点偏移量

  const nodeAttrs = attrs && gerAttrs(attrs);
  let textFill = nodeAttrs?.text?.fill || 'var(--neutral9)';
  let originalClass =
    textFill === 'var(--neutral9)' ? 'node-label original' : 'node-label';
  return {
    id,
    shape: temp ? 'path' : 'rect',
    width: nodeAttrs?.size || NODE_SIZE,
    height: nodeAttrs?.size || NODE_SIZE,
    x: position && position.x,
    y: position && position.y,
    options: {
      relative: false,
    },
    angle: nodeAttrs?.angle || 0,
    attrs: {
      body: {
        fill: 'var(--blue-color-8)', // 背景颜色
        stroke: 'none', // 边框颜色
        refX: 20,
        refY: 20,
        r: 26,
        class: 'start',
        // opacity: status === 'toBeStarted' ? 1 : 0,
      },
      entity: {
        refWidth: '100%',
        refHeight: '100%',
        refDKeepOffset:
          'M20,0L0.1,10.9v16L20,40l20-13.1v-16L20,0z M39,25.8L20.5,15.5V1.4L39,11.5V25.8z M19.5,1.4v14.1L1.1,25.7V11.5L19.5,1.4z   M1.6,26.6L20,16.4l18.5,10.3L20,38.8L1.6,26.6z',
        style: {
          display: image_type === 'entity' ? 'inline-block' : 'none',
        },
        fill: '#999999',
        stroke: '#999999',
      },
      image: {
        xlinkHref: isBase64(imageUrl)
          ? imageUrl
          : sceneStore.state.iconPoolData?.get(imageUrl)?.data ||
            data?.basicConfig?.logoData ||
            imageUrl,
        refWidth: '100%',
        refHeight: '100%',
        refY: NODE_OFFSET,
        refX: NODE_OFFSET,
        opacity:
          status === 'error' || status === 'loading' || status === 'shutdown'
            ? 0.5
            : status === 'toBeStarted'
            ? 0.15
            : 1,
      },
      text: {
        fontSize: 12,
        fill: 'var(--neutral9)',
        // fill:
        //   PageStatus.state.theme === 'dark'
        //     ? 'rgba(255, 255, 255, 1)'
        //     : 'rgba(0, 0, 0, 1)',
        refY: 53,
        refX: undefined,
        transform: 'rotate(0)',
        fontWeight: 400,
        // filter: 'blur(4px)' // 模糊滤镜
        ...nodeAttrs?.text,
        text: label ? subStr(label, 40) : '',
        opacity:
          status === 'error' || status === 'loading' || status === 'shutdown'
            ? 0.5
            : 1,
        class: originalClass,
      },
      edited: {
        refY: NODE_SIZE + 20,
        refX: NODE_SIZE / 2 - 11,
        transform: 'scale(0.5)',
        fontFamily: 'iconfont',
        style: {
          visibility: 'hidden',
          display: 'none',
        },
      },
      // cloudInit: {
      //   refX: NODE_SIZE / 2,
      //   refY: ((NODE_SIZE * 3) / 6).toFixed(0),
      //   xlinkHref: cloud,
      //   refWidth: '50%',
      //   refHeight: '50%',
      //   style: {
      //     display: cloudInit ? 'inline-block' : 'none',
      //   },
      // },
      upperNode: {
        fill: 'rgba(153,204,255,0.3)', // 背景颜色
        stroke: 'none', // 边框颜色
        refY: NODE_OFFSET,
        refX: NODE_OFFSET,
        refWidth: '100%',
        refHeight: '100%',
        rx: 4,
        ry: 4,
      },
      error: {
        fontFamily: 'iconfont',
        refY: 10,
        refX: 12,
      },
      loading: {
        fontFamily: 'iconfont',
        refY: 10,
        refX: 12,
      },
      startText: {
        text: t('target.start'),
        fontSize: 14,
        fontWeight: 'bold',
        fill: 'var(--neutral9)',
        refY: 15,
        refX: 6,
        opacity: status === 'toBeStarted' ? 1 : 0,
        class: 'start',
        cursor: 'pointer',
        event: 'node:start-click',
      },
      circle: {
        magnet: true,
        strokeWidth: 2,
        event: 'node:port-click',
        refX: nodeAttrs?.size ? nodeAttrs?.size / 2 : 20,
        refY: nodeAttrs?.size ? nodeAttrs?.size / 2 : 20,
        class: 'port-circle',
        r: 6,
        fill: '#fff',
        stroke: 'var(--green-color)',
        style: {
          visibility: 'hidden',
        },
      },
    },
    markup:
      sceneStore.state.sceneStatus === 'display'
        ? NODE_STATUS_MAKEUP(status, image_type, isUpperNode)
        : [
            NODE_STATUS_MAKEUP('', image_type, isUpperNode)[0], // 实装设备
            NODE_STATUS_MAKEUP('', image_type, isUpperNode)[1], // 图片
            NODE_STATUS_MAKEUP('', image_type, isUpperNode)[2], // 节点名称
            NODE_STATUS_MAKEUP('', image_type, isUpperNode)[4], // edited编辑图标
            NODE_STATUS_MAKEUP('', image_type, isUpperNode)[5], // cloud-init图标
            NODE_STATUS_MAKEUP('', image_type, isUpperNode)[6], // cloud-init图标
            NODE_STATUS_MAKEUP('', image_type, isUpperNode)[3], // 链接桩
          ],
    data, // @ts-ignore
    ports:
      !temp &&
      getPorts(data?.networkConfig?.network, image_type, nodeAttrs?.size, id),
    parent,
    zIndex: nodeAttrs?.zIndex || zIndex['node'],
  };
};

/* 端口生成 */
const getPorts = (
  network: Array<any>,
  image_type: any,
  size: any,
  id?: string,
) => {
  let items = network?.map((port) => ({
    id: port.id,
    group: 'bottom',
    args: {
      x: size ? size / 2 : 20,
      y: size ? size / 2 : 20,
    },
  }));
  if (!network.some((item) => item.id == `port_${id}_layer_1`)) {
    items.push({
      id: `port_${id}_layer_1`,
      group: 'bottom',
      args: {
        x: size ? size / 2 : 20,
        y: size ? size / 2 : 20,
      },
    });
  }
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

/**
 * 解析节点属性
 * @param attrs
 */
function gerAttrs(attrs: any) {
  if (attrs && isJSON(attrs)) {
    let result = JSON.parse(attrs);
    result.text.fontSize = parseFloat(result.text.fontSize);
    return result;
  }
}
// 判断节点imageUrl是不是base64类型
export function isBase64(str: string) {
  return str.indexOf('data:') != -1 && str.indexOf('base64') != -1;
}
