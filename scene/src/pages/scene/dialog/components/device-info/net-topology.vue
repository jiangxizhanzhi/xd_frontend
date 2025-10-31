<template>
  <div class="net">
    <div id="net-container" class="net-container"></div>
    <div class="net-bottom">
      <div class="left">
        <div style="margin-left: 20px">
          <cb-iconfont
            type="icon-diankou"
            :color="is_build_in_router ? '#F2900F' : 'var(--primary-color)'"
          ></cb-iconfont>
          <span>{{ $tt('target.notConnected') }}</span>
        </div>
        <div>
          <cb-iconfont
            type="icon-diankou-shixin"
            :color="is_build_in_router ? '#F2900F' : 'var(--primary-color)'"
          ></cb-iconfont>
          <span>{{ $tt('target.connected') }}</span>
        </div>
        <div>
          <cb-iconfont type="icon-diankou" color="#7988A6"></cb-iconfont>
          <span>{{ $tt('target.notOpened') }}</span>
        </div>
      </div>
      <!--右边-->
      <div class="right">
        <div v-if="showWanIcon" style="margin-right: 30px">
          <cb-iconfont type="icon-diankou" color="#F2900F"></cb-iconfont>
          <span>{{ $tt('target.wanInterface') }}</span>
        </div>
        <div v-if="nodeInfo.image_type == 'simple'">
          <cb-iconfont type="icon-diankou" color="#7988A6"></cb-iconfont>
          <span>{{ $tt('target.powerInterface') }}</span>
        </div>
        <div v-if="nodeInfo.image_type == 'simple'" style="margin-right: 20px">
          <cb-iconfont type="icon-guangkou" color="#7988A6"></cb-iconfont>
          <span>{{ $tt('target.fiberInterface') }}</span>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import t from '../../../../../utils/i18n';
import {
  watch,
  onMounted,
  onUnmounted,
  computed,
  ref,
} from '@vue/composition-api';
import {
  edgesToMap,
  getPortsIndexList,
  networkToMap,
} from '../../../../../utils/port-processing/port-generation';
import { ICON_GROUP, PORT_TYPE } from '../constant/icon';
import { ROLE } from '../../../../../types/role';
import { Graph } from '@antv/x6';

export default {
  name: 'net-topology',
  props: {
    // 已开放的端口
    network: {
      type: Array,
      default: () => {},
    },
    // 连线数据
    edges: {
      type: Array,
      default: () => {},
    },
    // 用于判断节点类型，进一步区分 端口数型、电口光口型、wan口lan口型
    nodeInfo: {
      type: Object,
      default: () => {},
    },
    // 用于判断端口绘图类型，whole为整体52个端口绘制
    netType: {
      type: String,
      default: '',
    },
    // 核心路由器
    is_build_in_router: {
      type: Boolean,
      default: false,
    },
  },
  setup(props) {
    let edgesMap = edgesToMap(props.edges);
    let configInfo = { nodes: [] };
    let graph;

    onMounted(() => {
      const container = document.getElementById('net-container');
      const width = container?.style.width;
      const height = container?.style.height;
      graph = new Graph({
        container,
        width,
        height,
        background: {
          color: 'var(--bg-color-3)',
          size: {
            width,
            height,
          },
        },
        interacting: {
          nodeMovable: false
        },
      });
      configInfo = initNodes(props.network, edgesMap);
      graph.fromJSON(configInfo);
    });

    watch(
      () => props.network,
      (val) => {
        configInfo = initNodes(val, edgesMap);
        graph.fromJSON(configInfo);
      },
      {
        immediate: false,
      },
    );
    const showWanIcon = computed(() => {
      return (
        props.nodeInfo.image_type != 'simple' &&
        props.nodeInfo.role != ROLE['switch'] &&
        !props.is_build_in_router
      );
    });

    /**
     * 根据节点角色和镜像信息获取端口类型
     * @param index
     * @param layoutType
     * @returns {*}
     */
    const getPortType = (index, layoutType) => {
      switch (props.nodeInfo.role) {
        // 防火墙
        case ROLE['firewall']:
          if (props.nodeInfo.image_type === 'simple') {
            if (layoutType === 'left') {
              return PORT_TYPE[0];
            } else {
              return PORT_TYPE[1];
            }
          } else {
            if (layoutType === 'left') {
              return PORT_TYPE[2];
            } else {
              return PORT_TYPE[3];
            }
          }
          break;
        // 路由器
        case ROLE['router']:
          if (props.nodeInfo.image_type === 'simple') {
            if (layoutType === 'left') {
              return PORT_TYPE[0];
            } else {
              return PORT_TYPE[1];
            }
          } else {
            if (layoutType === 'left') {
              return PORT_TYPE[2];
            } else {
              return PORT_TYPE[3];
            }
          }
          break;
        // 交换机
        case ROLE['switch']:
          if (props.nodeInfo.image_type === 'simple') {
            if (layoutType === 'left') {
              return PORT_TYPE[0];
            } else {
              return PORT_TYPE[1];
            }
          } else {
            if (layoutType === 'left') {
              return PORT_TYPE[3];
            }
            if (layoutType === 'right') {
              return PORT_TYPE[3];
            }
          }
          break;
        // 交换机
        case ROLE['simpleSwitch']:
          if (props.nodeInfo.image_type === 'simple') {
            if (layoutType === 'left') {
              return PORT_TYPE[0];
            } else {
              return PORT_TYPE[1];
            }
          }
          break;
      }
    };

    /**
     * 初始化时，根据传入的props.network和edges计算出需要展示的样式
     * @param index 端口序号
     * @param layoutType 区分是左侧还是右侧
     * @param network
     * @param edgesMap
     */
    const getNodesStatus = (index, layoutType, network, edgesMap) => {
      let port_type = getPortType(index, layoutType);
      let portId = `port_${props.nodeInfo.id}_${port_type}_${index}`;
      let portsIndex = getPortsIndexList(props.network, port_type);
      // 连接端口 且 有此端口
      if (edgesMap.has(portId) && network.has(portId) || network.has(portId) && !network.get(portId)?.usable) {
        return ICON_GROUP[port_type]['connect'];
      }
      // 开放端口
      if (portsIndex.some((item) => item == index) || network.has(portId) && network.get(portId)?.usable) {
        return ICON_GROUP[port_type]['open'];
      }
      return ICON_GROUP[port_type]['unOpen'];
    };

    /**
     * 造绘图数据
     * 初始化时，根据传入的props.network和edges计算出需要展示的样式
     * @param network
     * @param edgesMap
     * @param type 两种类型，一种是1-48 + 1-4 拼接，一种是52 --whole
     * @returns {{nodes: *[]}}
     */
    const initNodes = (network, edgesMap) => {
      let downele = -15;
      let upele = -15;
      let split = 45.5;
      let networkMap = networkToMap(network);
      // 将wan口和lan口分类
      if (props.netType) {
        split = 48;
        let wanPorts = network.filter((item) => item.id.includes('wan'));
        let lanPorts = network.filter((item) => item.id.includes('lan'));
        // 52口 wan + lan
        for (let i = 1; i <= wanPorts.length; i++) {
          if (i % 2 === 0) {
            upele = upele + split;
            configInfo.nodes.push(
              initNodeConfig(
                'E' + i,
                getNodesStatus(i, 'left', networkMap, edgesMap),
                upele,
                25,
                i.toString(),
              ),
            );
          } else {
            downele = downele + split;
            configInfo.nodes.push(
              initNodeConfig(
                'E' + i,
                getNodesStatus(i, 'left', networkMap, edgesMap),
                downele,
                90,
                i.toString(),
              ),
            );
          }
        }
        for (let i = 1; i <= lanPorts.length; i++) {
          let lanI = wanPorts.length + i;
          if (lanI % 2 === 0) {
            upele = upele + split;
            configInfo.nodes.push(
              initNodeConfig(
                'E' + lanI,
                getNodesStatus(i, 'right', networkMap, edgesMap),
                upele,
                25,
                lanI.toString(),
              ),
            );
          } else {
            downele = downele + split;
            configInfo.nodes.push(
              initNodeConfig(
                'E' + lanI,
                getNodesStatus(i, 'right', networkMap, edgesMap),
                downele,
                90,
                lanI.toString(),
              ),
            );
          }
        }

        let empty =
          52 - Number(wanPorts.length || 0) - Number(lanPorts.length || 0);
        if (empty > 0) {
          for (let i = 1; i <= empty; i++) {
            let emptyI = Number(wanPorts.length) + Number(lanPorts.length) + i;
            if (emptyI % 2 === 0) {
              upele = upele + split;
              configInfo.nodes.push(
                initNodeConfig(
                  'E' + emptyI,
                  getNodesStatus(emptyI, 'left', networkMap, edgesMap),
                  upele,
                  25,
                  emptyI.toString(),
                ),
              );
            } else {
              downele = downele + split;
              configInfo.nodes.push(
                initNodeConfig(
                  'E' + emptyI,
                  getNodesStatus(emptyI, 'left', networkMap, edgesMap),
                  downele,
                  90,
                  emptyI.toString(),
                ),
              );
            }
          }
        }
      } else {
        // 电口四十八个
        for (let i = 1; i <= 48; i++) {
          if (i % 2 === 0) {
            upele = upele + split;
            configInfo.nodes.push(
              initNodeConfig(
                'E' + i,
                getNodesStatus(i, 'left', networkMap, edgesMap),
                upele,
                25,
                i.toString(),
              ),
            );
          } else {
            downele = downele + split;
            configInfo.nodes.push(
              initNodeConfig(
                'E' + i,
                getNodesStatus(i, 'left', networkMap, edgesMap),
                downele,
                90,
                i.toString(),
              ),
            );
          }
        }
        // 光口四个
        for (let i = 1; i <= 4; i++) {
          downele = downele + split;
          configInfo.nodes.push(
            initNodeConfig(
              'L' + i,
              getNodesStatus(i, 'right', networkMap, edgesMap),
              downele,
              90,
              i.toString(),
            ),
          );
        }
      }
      return configInfo;
    };

    const initNodeConfig = (id, icon, x, y, text) => {
      return {
        id,
        x,
        y,
        width: 28,
        height: 28,
        options: {
          relative: false,
        },
        attrs: {
          body: {},
          image: {
            xlinkHref: require(`../../../../../assets/images/ports/${icon}.svg?dynamic`).default,
            width: 28,
            height: 28,
          },
          text: {
            text,
            fontSize: 12,
            fill: 'var(--neutral9)',
            refY: 35,
          },
        },
        markup: [
          {
            tagName: 'image',
            selector: 'image',
          },
          {
            tagName: 'text',
            selector: 'text',
          },
        ],
      };
    };

    onUnmounted(() => {
      graph.dispose();
    });

    return {
      $tt: t,
      showWanIcon,
      configInfo,
    };
  },
};
</script>
