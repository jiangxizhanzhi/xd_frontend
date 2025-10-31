<template>
  <div class="entity-access-wrapper">
    <cb-search-table
      :cols="ENTITY_ACCESS_TABLE"
      row-key="key"
      :dataSource="accessDataForm"
      :hidePaginOnDemand="true"
      class="access-table"
    >
      <template v-slot:entity_access_type="scope">
        <slot name="thumbNoData">
          <span>{{ENTITY_ACCESS_TYPE[scope.data.entity_access_type]}}</span>
        </slot>
      </template>
      <template v-slot:switch_port="scope">
        <slot name="thumbNoData">
          <span :title="switch_port_name(scope.data)">{{switch_port_name(scope.data)}}</span>
        </slot>
      </template>
      <template v-slot:access_modes="scope">
        <slot name="thumbNoData">
          <div class="protocol-box">
            <span class="add-icon" @click="addProtocol(scope.index)">
              <cb-iconfont type="icon-xinzeng" :size="'16'"></cb-iconfont></span>
            <div class="scene-tag-wrapper" v-if="accessDataForm && accessDataForm[scope.index] && accessDataForm[scope.index].access_modes">
              <template v-for="(protocol, index) in accessDataForm[scope.index].access_modes">
                <cb-tag
                  class="scene-tag-item"
                  v-if="protocol && protocol.protocol && protocol.protocol!='console'"
                  :omit="false"
                  closable
                  @click="editProtocol(protocol, index, scope.index)"
                  @close="deleteProtocol(protocol, index, scope.index)"
                >
                  {{ protocol.protocol }}
                </cb-tag>
              </template>
            </div>
          </div>
        </slot>
      </template>
    </cb-search-table>
    <entity-protocol-dialog
      v-if="accessDataForm && accessDataForm[editPortIndex] && accessDataForm[editPortIndex]['access_modes'][editProtocolIndex] || visibleValue"
      :type="protocolType"
      :visible-value.sync="visibleValue"
      :lang="lang"
      :access-modes.sync="accessDataForm[editPortIndex].access_modes[editProtocolIndex]"
      :all-access-modes="network"
      @add-protocol="handleAddProtocol">
    </entity-protocol-dialog>
  </div>
</template>

<script>
import t from '../../../../../utils/i18n';
import {computed, getCurrentInstance, ref} from '@vue/composition-api';
import {ENTITY_ACCESS_PROTOCOL, ENTITY_ACCESS_TABLE, ENTITY_ACCESS_TYPE} from "../constant/device-info";
import {FORM_RULES} from "../constant/form-rules";
import EntityProtocolDialog from "./entity-protocol-dialog";

export default {
  name: "entity-access-config",
  components: {
    EntityProtocolDialog,
  },
  props: {
    /**
     * 接入配置数据
     */
    network: {
      type: Array,
      default: () => ([]),
    },
    lang: {
      type: String,
      default: 'zh-CN',
    }
  },
  setup(props, {emit}) {
    const formRef = ref(null);
    const {proxy} = getCurrentInstance();
    const {$message, $confirm} = proxy;
    let protocolType = ref('add');
    let editProtocolIndex = ref(0);
    let editPortIndex = ref(0);
    const rules = {};
    const labelWidth = computed(() => {
      return props.lang === 'zh-CN' ? '100px' : '130px';
    });
    let visibleValue = ref(false);
    let accessDataForm = computed({
      get: () => {
        return props.network
      },
      set: (val) => {
        emit('update:network', val);
        return val
      }
    })

    const switch_port_name = (data) => {
      return `${data && data.entity_switch_name || '--'}/${data && data.entity_switch_port || '--'}`
    }
    const addProtocol = (index) => {
      editPortIndex.value = index;
      protocolType.value = 'add';
      visibleValue.value = true;
    }

    const handleAddProtocol = (data) => {
      accessDataForm.value[editPortIndex.value]['access_modes'].push(data);
    }

    const editProtocol = (protocol, protocolIndex, portIndex) => {
      editProtocolIndex.value = protocolIndex;
      editPortIndex.value = portIndex;
      visibleValue.value = true;
      protocolType.value = 'edit';
    }
    const deleteProtocol = (protocol, protocolIndex, portIndex) => {
      accessDataForm.value[portIndex]['access_modes'].splice(protocolIndex, 1);
    }
    return {
      $tt: t,
      formRef,
      rules,
      labelWidth,
      visibleValue,
      accessDataForm,
      editProtocolIndex,
      editPortIndex,
      protocolType,
      ENTITY_ACCESS_TYPE,
      FORM_RULES,
      ENTITY_ACCESS_TABLE,
      ENTITY_ACCESS_PROTOCOL,
      switch_port_name,
      addProtocol,
      editProtocol,
      deleteProtocol,
      handleAddProtocol,
    }
  }
}
</script>
