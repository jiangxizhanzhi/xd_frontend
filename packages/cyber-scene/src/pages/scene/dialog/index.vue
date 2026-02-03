<template>
  <div class="cb-scene-dialog">
    <cb-dialog
      v-if="visibleValue"
      custom-class="scene-all cb-scene-editor cb-scene-dialog"
      :visible="visibleValue"
      append-to-body
      :top="topNumber"
      :width="dialogSize.width"
      :destroy-on-close="true"
      :height="dialogSize.height"
      @close="closeFunc('cancel')"
      :class="{ 'no-padding': dialogType == 5 }"
    >
      <template slot="title">
        <div class="cb-scene-dialog-header">
          {{ title }}
        </div>
      </template>
      <div class="cb-scene-dialog-content">
        <component
          ref="dialogContent"
          v-bind="$attrs"
          :is="isWho"
          :lang="lang"
          :form-data="formData"
          :node-info="nodeInfo"
          :topology-edges="edges"
          :topology-nodes="nodes"
          @formCheck="formCheck"
          @update-node-data="updateNodeData"
          @update-name="updateNameFunc"
          @update-icon="updateIconFunc"
          @update-port-name="updatePortName"
        ></component>
      </div>
      <template slot="footer">
        <div class="cb-scene-dialog-footer">
          <cb-button-group>
            <cb-button button-type="confirm" @click="confirmFunc(true)">
              {{ $tt('global.sure') }}
            </cb-button>
            <cb-button button-type="cancel" hollow @click="confirmFunc(false)">
              {{ $tt('global.cancel') }}
            </cb-button>
          </cb-button-group>
        </div>
      </template>
    </cb-dialog>
  </div>
</template>
<script>
import t from '../../../utils/i18n';
import {
  computed,
  getCurrentInstance,
  inject,
  onMounted,
  onUnmounted,
  ref,
} from '@vue/composition-api';
import { DialogTitle, DialogTypes } from '../../../types/dialog';
import SFirewallValidator from './firewall/simple-firewall';
import SRouterValidator from './router/simple-router';
import getNodeCategory from '../../../types/get-node-category';
import SSwitchValidator from './switch/simple-switch';
import KRouterValidator from './router/core-router';
import SwitchValidator from './switch/vm-container-switch';
import RouterValidator from './router/vm-container-router';
import FirewallValidator from './firewall/vm-container-firewall';
import ChangeName from './change-name';
import ProbeSingleNode from './probe-collection/single/probe-single-node';
import vmContainerTerminal from './terminal-node/vm-container-terminal';
import Npc from './terminal-node/npc';
import Entity from './entity';
import Dynamips from './dynamips';
import { topoEdgesToConnections } from "../../../utils/port-processing/port-generation";
import { setEdgeLabels } from "../../../utils/connection/connection-rule";
import sceneStore from "../../../store/scene-store";
import { subStr } from "../../../utils/common";
import {singleNodeToExternalNode} from "../../../utils/data-conversion/scene-to-external/x6-to-external";
import {updateIcon, updateName} from "../painter/common";

export default {
  name: 'scene-dialog',
  props: {
    /**
     * 弹窗是否显示
     */
    visible: {
      type: Boolean,
      default: false,
    },
    /**
     * 弹窗大小
     * large/middle/small
     */
    size: {
      type: String,
      default: 'middle',
    },
    /**
     * 节点信息
     * role、image_type、nodeId
     */
    nodeInfo: {
      type: Object,
      default: () => {},
    },
    /**
     * 菜单编号
     */
    menuIndex: {
      type: Number,
      default: null,
    },
    currentNode: {},
    topology: {
      type: Array,
      default: () => [],
    },
    // 场景的eid，可以用于场景实例更新
    sceneEid: {
      type: String,
      default: '',
    },
    mpSceneId: {
      type: String,
      default: '',
    },
  },
  components: {
    vmContainerTerminal,
    SFirewallValidator,
    SRouterValidator,
    SSwitchValidator,
    KRouterValidator,
    SwitchValidator,
    RouterValidator,
    FirewallValidator,
    ChangeName,
    Npc,
    ProbeSingleNode,
    Entity,
    Dynamips,
  },
  setup(props, { emit }) {
    const $tt = t;
    const lang = inject('lang');
    const dialogContent = ref(null);
    let formData = props.currentNode.data;
    let topNumber = ref('50px');
    let visibleValue = computed({
      get: () => {
        return props.visible;
      },
      set: (val) => {
        emit('update:visible', val);
      },
    });
    let topologyEdges = props.topology?.filter((cell) => cell.shape === 'edge');
    let edges = topoEdgesToConnections(topologyEdges);
    let nodes = props.topology.filter((cell) => cell.shape === 'rect');

    let dialogType = [0, 5, 6, 7, 8, 9, 10, 11, 12, 13, 15].includes(
      props.menuIndex,
    )
      ? getNodeCategory(
          props.nodeInfo.role,
          props.nodeInfo.image_type,
          formData?.basicConfig?.is_build_in,
        ).typeNumber
      : props.menuIndex === 1
      ? 5
      : null;

    const title = computed(() => {
      return DialogTitle[dialogType];
    });
    // 弹窗关闭事件
    // 当前展示的表单
    const isWho = computed(() => {
      switch (dialogType) {
        case DialogTypes.AddRole:
          return 'RoleAssets';
        case DialogTypes.BaseConfig:
          return 'BaseConfig';
        case DialogTypes.CreateTemplate:
          return 'CreateTemplate';
        case DialogTypes.Import:
          return 'Import';
        case DialogTypes.FireWallSimple:
          return 'SFirewallValidator';
        case DialogTypes.FireWallVMware:
        case DialogTypes.FireWallContainer:
          return 'FirewallValidator';
        case DialogTypes.FireWallDynamips:
          return 'Dynamips';
        case DialogTypes.TerminalNodeContainer:
        case DialogTypes.TerminalNodeVMware:
          return 'vmContainerTerminal';
        case DialogTypes.PhysicalDevice:
          return 'Entity';
        case DialogTypes.ExternalNetWork:
          return 'ChangeName';
        case DialogTypes.SwitchSimple:
          return 'SSwitchValidator';
        case DialogTypes.SwitchVMware:
        case DialogTypes.SwitchContainer:
          return 'SwitchValidator';
        case DialogTypes.SwitchDynamips:
          return 'Dynamips';
        case DialogTypes.RouterSimple:
          return 'SRouterValidator';
        case DialogTypes.RouterVMware:
        case DialogTypes.RouterContainer:
          return 'RouterValidator';
        case DialogTypes.RouterDynamips:
          return 'Dynamips';
        case DialogTypes.RouterCore:
          return 'KRouterValidator';
        case DialogTypes.DataCollection:
          return 'ProbeSingleNode';
        case DialogTypes.FlowOccurs:
          return 'FlowOccurs';
        case DialogTypes.Npc:
          return 'Npc';
        default:
          return '';
      }
    });

    /**
     * 更新节点业务data
     * @param data
     */
    const updateNodeData = (data) => {
      props.currentNode.setData(data);
      let portsItems = data?.networkConfig?.network;
      let currentNodePorts = props.currentNode.getPorts();
      let size = props.currentNode.size()?.size || 20;
      // 新增端口
      portsItems?.forEach((item, index) => {
        if (!currentNodePorts.some((port) => port.id === item.id)) {
          props.currentNode.addPort({
            id: item.id,
            name: item.name,
            connected: false,
            group: 'bottom',
            args: { x: size, y: size },
          });
        }
      });
      // 删除端口
      currentNodePorts?.forEach((item) => {
        // 不删除层端口
        if (!portsItems.some((port) => port.id === item.id) && item.id.indexOf('layer') < 0) {
          props.currentNode.removePort({
            id: item.id,
          });
        }
      });
      // 处理场景实例更新-单节点配置更新
      if (sceneStore.state.sceneStatus === 'display') {
        if (props.currentNode.data.basicConfig.eid) {
          let params = singleNodeToExternalNode(props.currentNode, 'single-update', props.mpSceneId, props.currentNode?.getPosition());
          emit('update-node-data', params);
        }
      }
    };

    /**
     * 绘制节点名称
     * @param name
     */
    const updateNameFunc = (name) => {
      updateName(name, props.currentNode);
    };

    /**
     * 绘制节点图标
     * @param icon
     */
    const updateIconFunc = (icon) => {
      updateIcon(icon, props.currentNode);
    };

    /**
     * 更新连线端口名称
     * @param data
     */
    const updatePortName = (data) => {
      // 获取连线 名称 根据端口id获取到连线id
      sceneStore.state.graph.getConnectedEdges(props.currentNode)?.forEach(cls => {
        data?.forEach(item => {
          if (cls.source.port === item.id) {
            setEdgeLabels(cls, item.name, cls.labels[1].attrs.text.text, sceneStore.state.basicConfig.showLineLabels);
          }
          if (cls.target.port === item.id) {
            setEdgeLabels(cls, cls.labels[0].attrs.text.text, item.name, sceneStore.state.basicConfig.showLineLabels);
          }
        })
      })
    }

    //关闭事件
    let closeFunc = (type) => {
      formData = null;
      // topology = null;
      visibleValue.value = false;
      /**
       * visible:弹窗状态
       * data:组件数据
       * type:确认?取消
       */
      emit('close', { visible: visibleValue.value, type, dialogType });
      document
        .querySelectorAll('.el-popover.disk-help-content')
        ?.forEach((item) => item.remove());
    };
    //弹窗确认/取消按钮事件
    let confirmFunc = (value) => {
      if (value) {
        //  确认
        // closeFunc("sure");
        // 节点变动事件
        emit('on-change-nodes');
        dialogContent.value.submitForm();
      } else {
        //  取消
        dialogContent.value.resetForm();
        // closeFunc("cancel");
      }
    };
    let formCheck = (value) => {
      // data.value = value.data;
      if (value.status && value.type == 'sure') {
        closeFunc('sure');
      }
      if (value.status && value.type == 'cancel') {
        closeFunc('cancel');
      }
    };
    /**
     * 处理弹窗三个大小
     * @type {ComputedRef<{width: string, height: string}>}
     */
    let dialogSize = computed(() => {
      let obj = {
        width: '1400px',
        height: '600px',
      };
      switch (props.size) {
        // 节点配置弹窗（网关节点）
        case 'large':
          obj.width = '1400px';
          obj.height = '640px';
          topNumber.value = '70px';
          break;
        // 节点配置弹窗（终端节点）
        case 'largeMedium':
          obj.width = '1400px';
          obj.height = '600px';
          topNumber.value = '70px';
          break;
        // 数据采集
        case 'middle':
          obj.width = '960px';
          obj.height = '450px';
          topNumber.value = '100px';
          break;
        // npc、外部网络
        case 'small':
          obj.width = '800px';
          obj.height = null;
          topNumber.value = '240px';
          break;
          // npc、外部网络
        case 'npc':
          obj.width = '800px';
          obj.height = null;
          topNumber.value = '140px';
          break;
        default:
          obj.width = '1400px';
          obj.height = '500px';
          topNumber.value = '100px';
          break;
      }
      return obj;
    });
    return {
      $tt,
      confirmFunc,
      closeFunc,
      lang,
      dialogType,
      visibleValue,
      title,
      dialogSize,
      topNumber,
      isWho,
      dialogContent,
      formData,
      edges,
      nodes,
      formCheck,
      updateNameFunc,
      updateIconFunc,
      updateNodeData,
      updatePortName,
    };
  },
};
</script>
