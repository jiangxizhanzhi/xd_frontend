<template>
  <!--设备信息-->
  <div class="device-information">
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
      <cb-tabs type="border-card" class="terminal-node-wrapper">
        <cb-tab-pane :label="$tt('target.deviceInfo')">
          <!--节点名称、设备类型、节点图标-->
          <name-category-icon
            :Name.sync="nodeForm.name"
            :category="nodeForm.category"
            :Icon2.sync="nodeForm.icon"
            :Icon3.sync="nodeForm.icon3"
            :lang="lang"
            :nodeInfo="nodeInfo"
          ></name-category-icon>
        </cb-tab-pane>
        <cb-tab-pane
          :label="$tt('target.networkConfig')"
          name="networkConfig"
          class="network-config-container"
        >
          <entity-access-config :network.sync="nodeForm.network" :lang="lang"></entity-access-config>
        </cb-tab-pane>
        <!--采集协议配置-->
        <cb-tab-pane
          v-if="showSnmpConfig"
          :label="$tt('target.protocolAcquisitionConfig')"
          name="protocolAcquisitionConfig"
          class="network-config-container"
        >
          <protocol-acquisition-config
            :snmp_config.sync="nodeForm.snmp_config"
            :mib_data.sync="nodeForm.mib_data"
            :result.sync="nodeForm.snmp_config.result"
            :eid="nodeForm.eid"
            :role="nodeForm.role"
          ></protocol-acquisition-config>
        </cb-tab-pane>
        <!--实体防火墙虚拟设备组业务配置 TODO 延后做-->
<!--        <cb-tab-pane-->
<!--          v-if="nodeInfo.role === ROLE['firewall']"-->
<!--          :label="$tt('target.businessConfig')"-->
<!--          name="businessConfig"-->
<!--          class="network-config-container"-->
<!--        >-->
<!--          虚系统资源分配-->
<!--        </cb-tab-pane>-->
      </cb-tabs>
    </cb-form>
  </div>
</template>

<script>
import {computed, inject, reactive, ref} from '@vue/composition-api';
import _ from 'lodash';
import t from '../../../../utils/i18n';
import {FORM_RULES} from "../components/constant/form-rules";
import {useResetForm, useSubmitForm} from "../../../../utils/form/submit";
import NameCategoryIcon from "../components/device-info/name-category-icon";
import EntityAccessConfig from "../components/device-info/entity-access-config";
import protocolAcquisitionConfig from "../components/protocol-acquisition-config/protocol-acquisition-config";
import {ROLE} from "../../../../types/role";
import {errorConversion} from "../../../../utils/form/error-conversion";

export default {
  name: 'ChangeName',
  components: {
    NameCategoryIcon,
    EntityAccessConfig,
    protocolAcquisitionConfig,
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
    topology: {
      type: Object,
      default: () => {
      },
    },
    // 节点的实例id
    eid: {
      type: String,
      default: ''
    },
    /**
     * 角色信息
     */
    role: {
      type: Number,
      default: 0,
    },
  },
  setup(props) {
    const labelWidth = computed(() => {
      if (props.lang === 'zh-CN') {
        return '140px'
      } else {
        return '200px'
      }
    });
    const nodeFormData = computed(() => {
      return props.formData;
    });
    const showSnmpConfig = computed(() => {
      return [ROLE['switch'], ROLE['router'], ROLE['firewall']].includes(props.nodeInfo.role);
    });
    const formRef = ref(null);
    const rules = {};
    let networkForm = reactive(_.cloneDeep(nodeFormData.value.networkConfig || {network: []}));
    let nodeForm = reactive(_.cloneDeep(Object.assign(
      {},
      nodeFormData.value.basicConfig,
      { snmp_config: nodeFormData.value.snmp_config },
      { mib_data: nodeFormData.value.mib_data },
      {...networkForm}
    )));
    return {
      ROLE,
      rules,
      FORM_RULES,
      labelWidth,
      formRef,
      nodeForm,
      nodeFormData,
      showSnmpConfig,
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
        const {name, icon, icon3, snmp_config, mib_data} = this.nodeForm;
        this.nodeFormData.basicConfig.name = name;
        this.nodeFormData.basicConfig.icon = icon;
        this.nodeFormData.basicConfig.icon3 = icon3;

        // snmp协议采集配置树结构不为空的时候，保存
        if (!this.nodeForm.snmp_config.result || this.nodeForm.snmp_config.result === 'success') {
          this.nodeFormData.snmp_config = this.clearUpUselessFields(snmp_config);
          this.nodeFormData.mib_data = mib_data;
        }

        _.set(this.nodeFormData, 'networkConfig.network', this.nodeForm.network);
        this.$emit('update-node-data', this.nodeFormData);
      } else {
        this.$message.info(errorConversion(result.error));
      }
      this.$emit("formCheck", result);
    },
    // 重置表单
    resetForm() {
      this.$emit("formCheck", useResetForm(this.formRef));
    },
    // 清理SNMP无用字段
    clearUpUselessFields(data) {
      if (data.version === 'V3') {
        data.community_name = null;
      } else {
        data.priv_key = null;
        data.username = null;
        data.auth_key = null;
      }
      return data;
    },
  },
};
</script>
