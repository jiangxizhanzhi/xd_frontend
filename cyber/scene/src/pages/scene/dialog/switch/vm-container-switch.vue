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
          netType="whole"
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
        <!--镜像信息-->
        <image-lang-architecture-snapshot
          :image_type="nodeForm.image_type"
          :image.sync="nodeForm.image"
          :image_uuid="nodeForm.image_uuid"
          :system_language="nodeForm.system_language"
          :system_architecture="nodeForm.system_architecture"
          :quick_create_params.sync="nodeForm.quick_create_params"
          @default-protocols="getDefaultProtocolsHandler"
        ></image-lang-architecture-snapshot>
        <!--网卡、cpu、内存、硬盘-->
        <card-cpu-ram-disk
          :image_type="nodeForm.image_type"
          :role="nodeForm.role"
          :cpu.sync="nodeForm.cpu"
          :ram.sync="nodeForm.ram"
          :disk.sync="nodeForm.disk"
          :system_type="nodeForm.system_type"
        ></card-cpu-ram-disk>
        <!--wan口数、lan口数-->
        <electrical-light-port
          type="image-switcher"
          :nodeInfo="nodeInfo"
          :lan-count.sync="nodeForm.lan.count"
          :lan-unit.sync="nodeForm.lan.unit"
          @changeCount="handleChangeCount"
          @changeUnit="handleChangeUnit"
        ></electrical-light-port>
        <!--cloud-init 虚拟机显示-->
        <cloud-init :image_type="nodeForm.image_type" :init_support="nodeForm.init_support"></cloud-init>
      </cb-tab-pane>
      <cb-tab-pane :label="$tt('target.networkConfig')" name="networkConfig" class="network-config-container">
        <network-config
          ref="networkConfigRef"
          :show-mode="true"
          :lang="lang"
          :nodeInfo="nodeInfo"
          :network.sync="nodeForm.network"
          :console_config.sync="console_config"
          :topology-edges="topologyEdges"
          @delete-port="handleDeletePort"
          :active-protocol-name.sync="activeProtocolName"
        ></network-config>
      </cb-tab-pane>
      <cb-tab-pane :label="$tt('target.otherConfig')" v-if="showOtherConfig">
        <other-config-validator
          :image_type="nodeForm.image_type"
          :init_support="nodeForm.init_support"
          :order.sync="nodeForm.order"
          :node_command.sync="nodeForm.node_command"
          :file.sync="nodeForm.file"
        ></other-config-validator>
      </cb-tab-pane>
    </cb-tabs>
  </cb-form>
</template>

<script>
import t from '../../../../utils/i18n';
import _ from 'lodash';
import {inject, computed, ref, reactive, nextTick, watch} from '@vue/composition-api';
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
import NetworkConfigDhcp from "../components/netwrok-config/network-config-dhcp";
import {errorConversion} from "../../../../utils/form/error-conversion";
import ImageLangArchitectureSnapshot from "../components/device-info/image-lang-architecture-snapshot";
import otherConfigValidator from "../components/other-config/other-config-validator";
import {useResetForm, useSubmitForm} from "../../../../utils/form/submit";
import CardCpuRamDisk from "../components/device-info/card-cpu-ram-disk";
import CloudInit from "../components/device-info/cloud-init";

/**
 * 防火墙-简易型
 */
export default {
  name: 'SwitchValidator',
  components: {
    NetworkConfig,
    NetTopology,
    NameCategoryIcon,
    ElectricalLightPort,
    NetworkConfigDhcp,
    ImageLangArchitectureSnapshot,
    otherConfigValidator,
    CardCpuRamDisk,
    CloudInit,
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
    let activeProtocolName = ref('protocol-access');

    // 表单数据，用于页面展示，保存时更新到nodeFormData
    let networkForm = reactive(_.cloneDeep(nodeFormData.value.networkConfig || {network: []}));
    let nodeForm = reactive(_.cloneDeep(Object.assign(
      {},
      nodeFormData.value.basicConfig,
      nodeFormData.value.otherConfig,
      nodeFormData.value.routerConfig,
      {...networkForm}
    )));
    // 不支持Cloud-init的虚拟机主机，应该无自定义命令和上传文件功能，删除其他配置Tab页
    const showOtherConfig = computed({
      get: () => {
        return !(
          props.nodeInfo.image_type === 'vm' && !nodeForm.init_support
        )
      },
    });

    /**
     * 拆分成 协议接入 和 直接接入
     * 处理console协议接入信息，将原console协议拆到单独变量里
     * 此方法暂不支持表单校验，后续再考虑添加
     */
    let console_config = ref(getConsole(networkForm.network))
    let protocolsDefaultConsole = ref({});
    /**
     * 默认console接入协议
     * @param protocol
     */
    const getDefaultProtocolsHandler = (protocol) => {
      if (!protocol || !protocol.length) {
        return
      }
      let {ext_gateway = {console_config: []}} = protocol[0];
      if (!_.isEmpty(ext_gateway?.console_config)) {
        protocolsDefaultConsole.value = ext_gateway?.console_config;
      }
    }

    let showNet = ref(false);
    let deletePorts = ref([]); // 已经删除的port的集合
    let activeName = ref('basicInfo');
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
      if (_.isEmpty(nodeForm?.network)) {
        console_config.value = protocolsDefaultConsole.value;
      }
      let {
        total,
        deleted
      } = generatePorts(count, type, props.nodeInfo.id, nodeForm[type].unit, nodeForm?.network, props.topologyEdges, console_config.value, false, true);
      nodeForm.network = total;
      deletePorts.value = deleted;
      activeProtocolName.value = 'protocol-access';
      showNetTopo();
    }

    // 更新 电口数 光口数
    const handleDeletePort = (portId, index) => {
      deletePorts.value.push(portId);
      let splitArr = portId.split('_');
      if (splitArr.length >= 4) {
        nodeForm[splitArr[splitArr.length - 2]].count--;
      }
    }

    watch(activeName, (val) => {
      showNetTopo();
    }, {immediate: true})

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
      showOtherConfig,
      console_config,
      activeProtocolName,
      getDefaultProtocolsHandler,
      handleChangeCount,
      handleDeletePort
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

        // 处理直接接入
        network?.forEach((item, index) => {
          let new_access_modes = [];
          item.access_modes?.forEach((protocol, idx) => {
            if (!(protocol && protocol.protocol && (protocol.protocol == 'console' || protocol.protocol == 'COM'))) {
              new_access_modes.push(protocol)
            }
          })
          network[index]['access_modes'] = new_access_modes;
        })
        if (this.console_config && Object.keys(this.console_config).length) {
          network[0]?.access_modes?.unshift(this.console_config);
        }
        _.set(this.nodeFormData, 'networkConfig.network', transferNull(network));
        // 同时需要清空对端连接端口的usable属性
        this.deletePorts?.forEach(portId => {
          clearConnectionPortUsable(portId, this.topologyEdges);
        })
        this.$emit('update-node-data', this.nodeFormData);
      } else {
        this.$message.info(errorConversion(result.error))
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
