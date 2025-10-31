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
        <!--镜像信息-->
        <image-lang-architecture-snapshot
          :platform="nodeForm.platform"
          :image_type="nodeForm.image_type"
          :image.sync="nodeForm.image"
          :image_uuid="nodeForm.image_uuid"
          :system_language="nodeForm.system_language"
          :system_architecture="nodeForm.system_architecture"
          :quick_create_params.sync="nodeForm.quick_create_params"
          @default-protocols="getDefaultProtocolsHandler"
        ></image-lang-architecture-snapshot>
        <!--wan口数量-->
        <dynamips-port
          :nodeInfo="nodeInfo"
          type="dynamips"
          :platform="nodeForm.platform"
          :image="nodeForm.image"
          :wan-count.sync="nodeForm.wan.count"
          :wan-unit.sync="nodeForm.wan.unit"
          @changeCount="handleChangeCount"
          @changeDynamipsCount="handleChangeCount"
        ></dynamips-port>
      </cb-tab-pane>
      <cb-tab-pane :label="$tt('target.networkConfig')" name="networkConfig" class="network-config-container">
        <network-config
          :lang="lang"
          :is_build_in="nodeForm.is_build_in"
          :nodeInfo="nodeInfo"
          :network.sync="nodeForm.network"
          :topology-edges="topologyEdges"
          :telnet_config.sync="telnet_config"
        ></network-config>
      </cb-tab-pane>
      <cb-tab-pane
        :label="$tt('target.staticRouterConfig')"
        name="staticRouterConfig"
      >
        <!--静态路由表-->
        <static-router-table
          :nodeInfo="nodeInfo"
          :static_routes.sync="nodeForm.routerConfig"
        >
        </static-router-table>
      </cb-tab-pane>
    </cb-tabs>
  </cb-form>
</template>

<script>
import t from '../../../../utils/i18n';
import _ from 'lodash';
import {computed, ref, reactive, nextTick, watch} from '@vue/composition-api';
import {clearConnectionPortUsable, generatePorts, getTelnet} from '../../../../utils/port-processing/port-generation';
import NameCategoryIcon from "../components/device-info/name-category-icon";
import NetworkConfig from "../components/netwrok-config/network-config";
import NetTopology from "../components/device-info/net-topology";
import {errorConversion} from "../../../../utils/form/error-conversion";
import {useResetForm, useSubmitForm} from "../../../../utils/form/submit";
import ImageLangArchitectureSnapshot from "../components/device-info/image-lang-architecture-snapshot";
import dynamipsPort from "../components/device-info/dynamips-port";
import StaticRouterTable from "../components/static-router-config/static-router-table";

/**
 * dynamips 配置
 */
export default {
  name: 'index',
  components: {
    NetworkConfig,
    NetTopology,
    NameCategoryIcon,
    ImageLangArchitectureSnapshot,
    dynamipsPort,
    StaticRouterTable,
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
     * 处理telnet协议接入信息，将原telnet协议拆到单独变量里
     */
    let telnet_config = ref(getTelnet(networkForm.network))

    /**
     * 查询核心路由器数据，获取默认console接入协议
     */
    const getDefaultProtocolsHandler = (data) => {
      let targetProtocol = data?.length && data[0]?.ext_vm?.access_protocols;
      if (_.isEmpty(telnet_config.value) && !_.isEmpty(targetProtocol)) {
        telnet_config.value = _.cloneDeep(targetProtocol[0]);
      }
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

    const handleChangeCount = (count, type, nameArr) => {
      let {
        total,
        deleted
      } = generatePorts(count, type, props.nodeInfo.id, nodeForm[type].unit, nodeForm?.network, props.topologyEdges, telnet_config.value,false, false, true, nameArr);
      nodeForm.network = total;
      deletePorts.value = deleted;
      showNetTopo();
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
      telnet_config,
      getDefaultProtocolsHandler,
      handleChangeCount,
      showNetTopo,
    };
  },
  methods: {
    $tt: t,
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
        // 处理直接接入
        network?.forEach((item, index) => {
          let new_access_modes = [];
          item.access_modes?.forEach((protocol, idx) => {
            if (!(protocol && protocol.protocol && (protocol.protocol == 'telnet'))) {
              new_access_modes.push(protocol);
            }
          });
          network[index]['access_modes'] = new_access_modes;
        });
        if (this.telnet_config && Object.keys(this.telnet_config).length && this.telnet_config.isTelnet) {
          if (this.telnet_config.isTelnet) {
            this.telnet_config['protocol'] = 'telnet';
          }
          network[0]?.access_modes?.unshift(this.telnet_config);
        }
        this.nodeFormData.basicConfig = basic;
        _.set(this.nodeFormData, 'networkConfig.network', network);
        _.set(this.nodeFormData, 'routerConfig.routerConfig', this.nodeForm.routerConfig);
        // 同时需要清空对端连接端口的usable属性
        this.deletePorts?.forEach(portId => {
          clearConnectionPortUsable(portId, this.topologyEdges);
        })
        this.$emit('update-node-data', this.nodeFormData);
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
