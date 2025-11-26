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
    <cb-tabs
      type="border-card"
      v-model="activeName"
      class="firewall-node-wrapper"
    >
      <cb-tab-pane :label="$tt('target.deviceInfo')" name="basicInfo">
        <!--端口展示-->
        <net-topology
          v-if="showNet"
          :nodeInfo="nodeInfo"
          :network="nodeForm.network"
          :edges="topologyEdges"
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
          :electrical-count.sync="nodeForm.electrical.count"
          :electrical-unit.sync="nodeForm.electrical.unit"
          :light-count.sync="nodeForm.light.count"
          :light-unit.sync="nodeForm.light.unit"
          :original-count="nodeForm.originalCount"
          @changeCount="handleChangeCount"
          @changeUnit="handleChangeUnit"
        ></electrical-light-port>
      </cb-tab-pane>
      <cb-tab-pane
        :label="$tt('target.networkConfig')"
        name="networkConfig"
        class="network-config-container"
      >
        <network-config-dhcp
          :lang="lang"
          :address.sync="nodeForm.address"
          :gateway.sync="nodeForm.gateway"
          :vlanId.sync="nodeForm.vlanId"
          :DNS.sync="nodeForm.DNS"
          :dhcp.sync="nodeForm.dhcp"
          :addressRange.sync="nodeForm.addressRange"
          :nodeInfo="nodeInfo"
          @delete-tag="useFormValidate"
        ></network-config-dhcp>
      </cb-tab-pane>
    </cb-tabs>
  </cb-form>
</template>

<script>
import t from '../../../../utils/i18n';
import _ from 'lodash';
import {
  inject,
  computed,
  ref,
  reactive,
  nextTick,
  watch,
  onMounted,
} from '@vue/composition-api';
import {
  clearConnectionPortUsable,
  generatePorts,
  transferNull,
  updatePortUnit
} from '../../../../utils/port-processing/port-generation';
import NameCategoryIcon from '../components/device-info/name-category-icon';
import ElectricalLightPort from '../components/device-info/electrical-light-port';
import NetworkConfig from '../components/netwrok-config/network-config';
import NetTopology from '../components/device-info/net-topology';
import NetworkConfigDhcp from '../components/netwrok-config/network-config-dhcp';
import { errorConversion } from '../../../../utils/form/error-conversion';
import { useResetForm, useSubmitForm } from '../../../../utils/form/submit';

/**
 * 交换机-简易型
 */
export default {
  name: 'SSwitchValidator',
  components: {
    NetworkConfig,
    NetTopology,
    NameCategoryIcon,
    ElectricalLightPort,
    NetworkConfigDhcp,
  },
  props: {
    nodeInfo: {
      type: Object,
      default: () => {},
    },
    /* 节点的data数据 */
    formData: {
      type: Object,
      default: () => {},
    },
    lang: {
      type: String,
      default: 'zh-CN',
    },
    topologyEdges: {
      type: Array,
      default: () => [],
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
    let networkForm = reactive(
      _.cloneDeep(nodeFormData.value.networkConfig || { network: [] }),
    );
    let nodeForm = reactive(
      _.cloneDeep(
        Object.assign(
          {},
          nodeFormData.value.basicConfig,
          nodeFormData.value.otherConfig,
          nodeFormData.value.routerConfig,
          { ...networkForm },
        ),
      ),
    );
    let showNet = ref(false);
    let deletePorts = ref([]); // 已经删除的port的集合
    let activeName = ref('basicInfo');
    // 端口信息图的展示
    const showNetTopo = () => {
      if (activeName.value === 'basicInfo') {
        showNet.value = false;
        nextTick(() => {
          showNet.value = true;
        });
      }
    };
    const handleChangeCount = (count, type) => {
      let { total, deleted } = generatePorts(
        count,
        type,
        props.nodeInfo.id,
        nodeForm[type].unit,
        nodeForm?.network,
        props.topologyEdges,
      );
      nodeForm.network = total;
      deletePorts.value = deleted;
      showNetTopo();
    };

    // 更新 电口数 光口数
    const handleDeletePort = (portId, index) => {
      deletePorts.value.push(portId);
      let splitArr = portId.split('_');
      if (splitArr.length >= 4) {
        nodeForm[splitArr[splitArr.length - 2]].count--;
      }
    };

    // 调用表单校验
    const useFormValidate = () => {
      useSubmitForm(formRef.value, nodeForm);
    }

    watch(
      activeName,
      (val) => {
        showNetTopo();
      },
      { immediate: true },
    );

    onMounted(() => {
      useFormValidate();
    })

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
      handleChangeCount,
      handleDeletePort,
      useFormValidate,
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
        const {
          file,
          order,
          node_command,
          addressRange,
          dhcp,
          DNS,
          vlanId,
          address,
          gateway,
          network,
          ...basic
        } = this.nodeForm;
        updatePortUnit(network, basic, this.nodeFormData.basicConfig, this);
        this.nodeFormData.basicConfig = basic;
        this.nodeFormData.otherConfig = { file, order, node_command };

        _.set(this.nodeFormData, 'networkConfig.address', address);
        _.set(this.nodeFormData, 'networkConfig.gateway', gateway);
        _.set(this.nodeFormData, 'networkConfig.vlanId', vlanId);
        _.set(this.nodeFormData, 'networkConfig.DNS', DNS);
        _.set(this.nodeFormData, 'networkConfig.dhcp', dhcp);
        _.set(this.nodeFormData, 'networkConfig.addressRange', addressRange);
        _.set(this.nodeFormData, 'networkConfig.network', transferNull(network));

        this.$emit('update-node-data', this.nodeFormData);
        // 同时需要清空对端连接端口的usable属性
        this.deletePorts?.forEach(portId => {
          clearConnectionPortUsable(portId, this.topologyEdges);
        })
      } else {
        this.$message.info(errorConversion(result.error));
      }
      this.$emit('formCheck', result);
    },
    // 重置表单
    resetForm() {
      this.$emit('formCheck', useResetForm(this.formRef));
    },
  },
};
</script>
