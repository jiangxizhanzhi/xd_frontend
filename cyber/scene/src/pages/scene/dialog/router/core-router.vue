<template>
  <cb-form
    ref="formRef"
    :model.sync="nodeForm"
    :rules="rules"
    id="id"
    :json="true"
    label-position="right"
    :label-width="labelWidth"
    :inline="false"
  >
    <!--内容-->
    <cb-tabs type="border-card" v-model="activeName" class="firewall-node-wrapper">
      <cb-tab-pane :label="$tt('target.deviceInfo')" name="basicInfo">
        <!--端口展示-->
        <net-topology
          v-if="showNet"
          :nodeInfo="nodeInfo"
          :network="nodeForm.network"
          :edges="topologyEdges"
          net-type="whole"
          :is_build_in_router="true"
        ></net-topology>
        <!--节点名称、设备类型、节点图标-->
        <name-category-icon
          :Name.sync="nodeForm.name"
          :category="nodeForm.category"
          :Icon2.sync="nodeForm.icon"
          :Icon3.sync="nodeForm.icon3"
          :lang="lang"
          :nodeInfo="nodeInfo"
        ></name-category-icon>
        <!--电口数、光口数-->
        <electrical-light-port
          :nodeInfo="nodeInfo"
          type="core-router"
          :wan-count.sync="nodeForm.wan.count"
          :wan-unit.sync="nodeForm.wan.unit"
          :original-count="nodeForm.originalCount"
          @changeCount="handleChangeCount"
          @changeUnit="handleChangeUnit"
        ></electrical-light-port>
      </cb-tab-pane>
      <cb-tab-pane :label="$tt('target.networkConfig')" name="networkConfig" class="network-config-container">
        <network-config
          :show-mode="true"
          :lang="lang"
          :is_build_in="nodeForm.is_build_in"
          :nodeInfo="nodeInfo"
          :network.sync="nodeForm.network"
          :topology-edges="topologyEdges"
          @delete-port="handleDeletePort"
          @change-ip="changeIp"
        ></network-config>
      </cb-tab-pane>
      <cb-tab-pane :label="$tt('target.routerConfigTab')" name="routerConfig" class="router-config-container">
        <route-config
          :lang="lang"
          :nodeInfo="nodeInfo"
          :static_routes.sync="nodeForm.routerConfig"
          :ospfRouterId.sync="nodeForm.ospfRouterId"
          :BGP.sync="nodeForm.route.BGP"
          :OSPF.sync="nodeForm.route.OSPF"
          :ripLoopback.sync="nodeForm.ripLoopback"
          :RIP.sync="nodeForm.route.RIP"
          :network.sync="nodeForm.network"
          :active-route-name.sync="activeRouteName"
          :is_build_in="nodeForm.is_build_in"
        ></route-config>
      </cb-tab-pane>
    </cb-tabs>
  </cb-form>
</template>

<script>
import t from '../../../../utils/i18n';
import _ from 'lodash';
import {computed, ref, reactive, nextTick, watch} from '@vue/composition-api';
import {
  clearConnectionPortUsable,
  generatePorts,
  getConsole,
  transferNull,
  updatePortUnit
} from '../../../../utils/port-processing/port-generation';
import NameCategoryIcon from "../components/device-info/name-category-icon";
import ElectricalLightPort from "../components/device-info/electrical-light-port";
import NetworkConfig from "../components/netwrok-config/network-config";
import NetTopology from "../components/device-info/net-topology";
import {errorConversion} from "../../../../utils/form/error-conversion";
import RouteConfig from "../components/netwrok-config/route-config";
import {useResetForm, useSubmitForm} from "../../../../utils/form/submit";
import {getShortcutList} from "../../../../api";

/**
 * 防火墙-简易型
 */
export default {
  name: 'KRouterValidator',
  components: {
    NetworkConfig,
    NetTopology,
    NameCategoryIcon,
    ElectricalLightPort,
    RouteConfig,
  },
  props: {
    nodeInfo: {
      type: Object,
      default: () => {
      },
    },
    formData: {
      type: Object,
      default: () => {
      },
    },
    lang: {
      type: String,
      default: 'zh-CN',
    },
    topologyEdges: {
      type: Array,
      default: () => []
    },
    topologyNodes: {
      type: Array,
      default: () => []
    },
  },
  setup(props) {
    const formRef = ref(null);
    const labelWidth = computed(() => {
      return props.lang === 'zh-CN' ? '140px' : '200px';
    });
    const nodeFormData = computed(() => {
      return props.formData;
    });

    // 表单数据，用于页面展示，保存时更新到nodeFormData
    let networkForm = reactive(_.cloneDeep(nodeFormData.value.networkConfig || {network: []}));
    let nodeForm = reactive(_.cloneDeep(Object.assign(
      {},
      nodeFormData.value.basicConfig,
      nodeFormData.value.otherConfig,
      nodeFormData.value.routerConfig,
      {...networkForm}
    )));

    /**
     * 拆分成 协议接入 和 直接接入
     * 处理console协议接入信息，将原console协议拆到单独变量里
     */
    let console_config = ref(getConsole(networkForm.network))
    /**
     * 查询核心路由器数据，获取默认console接入协议
     */
    const getDefaultProtocolsHandler = () => {
      getShortcutList({role: 21, image_type: 'VM'}).then((res) => {
        if (_.isEmpty(res.data.data?.list) || !res.data) {
          return null
        }
        let {ext_gateway = {console_config: []}} = res.data.data?.list.length && res.data.data?.list[0];
        if (_.isEmpty(console_config.value) && !_.isEmpty(ext_gateway?.console_config)) {
          console_config.value = _.cloneDeep(ext_gateway?.console_config);
        }
      })
    }
    getDefaultProtocolsHandler()

    let showNet = ref(false);
    let deletePorts = ref([]); // 已经删除的port的集合
    let activeName = ref('basicInfo');
    let activeRouteName = ref('staticRouter');
    // 端口信息图的展示
    const showNetTopo = () => {
      if (activeName.value === 'basicInfo') {
        showNet.value = false;
        nextTick(() => {
          showNet.value = true;
        })
      }
    }

    const handleChangeCount = (count, type) => {
      let {
        total,
        deleted
      } = generatePorts(count, type, props.nodeInfo.id, nodeForm[type].unit, nodeForm?.network, props.topologyEdges, console_config.value,true, true);

      nodeForm.network = total;
      deletePorts.value = deleted;
      nodeForm.routerConfig?.forEach((item, index) => {
        if (!nodeForm.network?.some(port => port.id == item.nexthop_port_id)) {
          nodeForm.routerConfig[index]['nexthop_port_id'] = null
        }
      })
      nodeForm.route?.BGP?.forEach((item, index) => {
        if (!nodeForm.network?.some(port => port.id == item.portId)) {
          nodeForm.route.BGP[index]['portId'] = null
        }
      })
      nodeForm.route?.OSPF?.forEach((item, index) => {
        if (!nodeForm.network?.some(port => port.id == item.portId)) {
          nodeForm.route.OSPF[index]['portId'] = null
        }
      })
      nodeForm.route?.RIP?.forEach((item, index) => {
        if (!nodeForm.network?.some(port => port.id == item.portId)) {
          nodeForm.route.RIP[index]['portId'] = null
        }
      })
      showNetTopo();
    }

    // 更新 端口数 和路由配置tab项
    const handleDeletePort = (portId, index) => {
      deletePorts.value.push(portId);
      let splitArr = portId.split('_');
      activeRouteName.value = 'staticRouter';
      if (splitArr.length >= 4) {
        nodeForm[splitArr[splitArr.length - 2]].count--;
        nodeForm.routerConfig?.forEach((item, index) => {
          if (item.nexthop_port_id == portId) {
            nodeForm.routerConfig[index]['nexthop_port_id'] = null
          }
        })
        nodeForm.route?.BGP?.forEach((item, index) => {
          if (item.portId == portId) {
            nodeForm.route.BGP[index]['portId'] = null
          }
        })
        nodeForm.route?.OSPF?.forEach((item, index) => {
          if (item.portId == portId) {
            nodeForm.route.OSPF[index]['portId'] = null
          }
        })
        nodeForm.route?.RIP?.forEach((item, index) => {
          if (item.portId == portId) {
            nodeForm.route.RIP[index]['portId'] = null
          }
        })
      }
    }
    watch(activeName, (val) => {
      showNetTopo();
    }, {immediate: true})

    watch(() => nodeForm.network, (val) => {
      activeRouteName.value = "staticRouter"
    }, {immediate: true, deep: true})

    const rules = {};
    return {
      labelWidth,
      nodeForm,
      networkForm,
      rules,
      formRef,
      nodeFormData,
      showNet,
      deletePorts,
      activeName,
      activeRouteName,
      getDefaultProtocolsHandler,
      handleChangeCount,
      handleDeletePort,
      showNetTopo,
    };
  },
  methods: {
    $tt: t,
    handleChangeUnit(data) {
      this.nodeForm.network?.forEach((port, index) => {
        if (port.id.includes(data.type) && port.name.includes('0/')) {
          this.nodeForm.network[index].name = data.unit + '0/' + port.name.split('0/')[1]
        }
        return port;
      });
    },
    changeIp(data) {
      this.nodeForm.route?.RIP?.forEach((item, index) => {
        if (item.portId == data.id) {
          this.nodeForm.route.RIP[index].ripIp = data.ip;
        }
      })
      this.nodeForm.route?.BGP?.forEach((item, index) => {
        if (item.portId == data.id) {
          this.nodeForm.route.BGP[index].bgpIp = data.ip;
        }
      })
      this.nodeForm.route?.OSPF?.forEach((item, index) => {
        if (item.portId == data.id) {
          this.nodeForm.route.OSPF[index].ospfIp = data.ip;
        }
      })
    },
    submitForm() {
      let result = useSubmitForm(this.formRef, this.nodeForm);
      if (result.status) {
        if (this.nodeForm.name !== this.nodeFormData.basicConfig.name) {
          this.$emit('update-name', this.nodeForm.name);
        }
        if (this.nodeForm.icon !== this.nodeFormData.basicConfig.icon) {
          this.$emit('update-icon', this.nodeForm.icon);
        }

        const {file, order, node_command, network, ...basic} = this.nodeForm;
        updatePortUnit(network, basic, this.nodeFormData.basicConfig, this);
        this.nodeFormData.basicConfig = basic;
        this.nodeFormData.otherConfig = {file, order, node_command};
        _.set(this.nodeFormData, 'networkConfig.network', transferNull(network));
        _.set(this.nodeFormData, 'routerConfig.routerConfig', this.nodeForm.routerConfig);
        _.set(this.nodeFormData, 'routerConfig.route.OSPF', this.nodeForm.route.OSPF);
        _.set(this.nodeFormData, 'routerConfig.route.BGP', this.nodeForm.route.BGP);
        _.set(this.nodeFormData, 'routerConfig.route.RIP', this.nodeForm.route.RIP);
        // 同时需要清空对端连接端口的usable属性
        this.deletePorts?.forEach(portId => {
          clearConnectionPortUsable(portId, this.topologyEdges);
        })
        this.$emit('update-node-data', this.nodeFormData)
      } else {
        this.$message.info(errorConversion(result.error, true))
      }
      this.$emit("formCheck", result);
    },
    // 重置表单
    resetForm() {
      this.$emit("formCheck", useResetForm(this.formRef));
    },
  },
};
</script>
