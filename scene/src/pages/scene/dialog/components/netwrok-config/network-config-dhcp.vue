<template>
  <div class="network-config-dhcp-wrapper">
    <cb-row class="dhcp-item">
      <cb-col :span="2" :class="{'label': true, 'label-dhcp-en': lang == 'en-US'}"><span>{{ $tt('target.addresses') }} ：</span></cb-col>
      <cb-col :span="6">
        <cb-form-item prop="address" class="address-form"
                      :rules="FORM_RULES.networkConfig.address">
          <cb-input :disabled="uneditableBySceneStatus" size="small" v-model="addressForm" type="text" :placeholder="$tt('global.placeInput')"></cb-input>
        </cb-form-item>
      </cb-col>
      <cb-col :span="8">
        <cb-form-item :label="$tt('target.gatewayAddress') + ' ：'" prop="gateway"
                      :rules="FORM_RULES.networkConfig.gateway">
          <cb-input :disabled="uneditableBySceneStatus" size="small" v-model="gatewayForm" type="text" :placeholder="$tt('global.placeInput')"></cb-input>
        </cb-form-item>
      </cb-col>
      <cb-col :span="7">
        <cb-form-item label="Vlan ID ：" prop="vlanId" :rules="FORM_RULES.networkConfig.vlanId"  :class="{'label-vlanId': lang == 'en-US'}">
          <cb-input :disabled="uneditableBySceneStatus" size="small" v-model="vlanIdForm" type="text" :placeholder="$tt('target.supportRange')"></cb-input>
        </cb-form-item>
      </cb-col>
    </cb-row>
    <cb-row class="dhcp-item dns">
      <cb-col :span="2" class="label"><span>DNS ：</span></cb-col>
      <cb-col :span="22">
        <form-tags-validator
          ref="dnsTag"
          v-model="DNSForm"
          titleField="dns"
          @deleteTag="handleDeleteTag"
        />
      </cb-col>
    </cb-row>
    <cb-row class="dhcp-switch">
      <cb-form-item :label="$tt('target.openDHCP') + ' ：'" prop="dhcp" :label-width="lang == 'en-US' ? '130px' : '100px'">
        <cb-switch
          size="small"
          v-model="dhcpForm"
          @change="changeDhcp"
          :disabled="uneditableBySceneStatus"
        >
        </cb-switch>
      </cb-form-item>
    </cb-row>
    <cb-row v-for="(item, index) in addressRangeForm" :class="{'dhcp-item': true, 'dhcp-item-first': index === 0}" :key="JSON.stringify(item + index)">
      <cb-col :span="7">
        <cb-form-item :label="label['startIp']" :prop="'addressRange.' + index + '.startIp'"
                      :rules="FORM_RULES.networkConfig.ip">
          <cb-input :disabled="uneditableBySceneStatus" size="small" v-model="item.startIp" type="text"
                    :placeholder="$tt('global.placeInput')"></cb-input>
        </cb-form-item>
      </cb-col>
      <cb-col :span="7">
        <cb-form-item :label="label['endIp']" :prop="'addressRange.' + index + '.endIp'"
                      :rules="FORM_RULES.networkConfig.ip">
          <cb-input :disabled="uneditableBySceneStatus" size="small" v-model="item.endIp" type="text" :placeholder="$tt('global.placeInput')"></cb-input>
        </cb-form-item>
      </cb-col>
      <cb-col :span="2">
        <div class="btn-box">
          <cb-button :disabled="uneditableBySceneStatus" type="text" icon="icon-jianshao"
                     @click="deleteTable(index, item)"></cb-button>
          <cb-button :disabled="uneditableBySceneStatus" v-if="index == addressRangeForm.length - 1" type="text" icon="icon-xinzeng" @click="addTable()" class="add-btn"></cb-button>
        </div>
      </cb-col>
    </cb-row>
    <template v-if="dhcpForm && (!addressRangeForm || !addressRangeForm.length)">
      <cb-row>
        <empty-box
          tab="address_range"
          :nodeInfo="nodeInfo"
          @click="addTable()"
        ></empty-box>
      </cb-row>
    </template>
  </div>
</template>

<script>
import t from '../../../../../utils/i18n';
import {computed} from "@vue/composition-api";
import {FORM_RULES} from "../constant/form-rules";
import EmptyBox from "../empty-box/empty-box";
import sceneStore from "../../../../../store/scene-store";
import formTagsValidator from "./form-tags-validator";

export default {
  name: "network-config-dhcp",
  components: {
    EmptyBox,
    formTagsValidator,
  },
  props: {
    nodeInfo: {
      type: Object,
      default: () => {
      }
    },
    DNS: {
      type: Array,
      default: () => [],
    },
    addressRange: {
      type: Array,
      default: () => [],
    },
    address: {
      type: String,
      default: '',
    },
    gateway: {
      type: String,
      default: '',
    },
    vlanId: {
      type: String | Number,
      default: '',
    },
    dhcp: {
      type: Boolean,
      default: true,
    },
    lang: {
      type: String,
      default: '',
    },
  },
  setup(props, {emit}) {
    const $tt = t;
    const label = {
      startIp: `${$tt('target.startIp')} ：`,
      endIp: `${$tt('target.endIp')} ：`,
    }
    // 场景状态
    const uneditableBySceneStatus = computed({
      get: () => {
        return (sceneStore.state.sceneStatus === 'display' || sceneStore.state.sceneStatus === 'update');
      },
    });
    let addressRangeForm = computed({
      get: () => {
        return props.addressRange
      },
      set: (val) => {
        emit('update:addressRange', val);
        return val;
      }
    })
    let DNSForm = computed({
      get: () => {
        return props.DNS
      },
      set: (val) => {
        emit('update:DNS', val);
        return val;
      }
    })
    let addressForm = computed({
      get: () => {
        return props.address
      },
      set: (val) => {
        emit('update:address', val);
        return val;
      }
    })
    let gatewayForm = computed({
      get: () => {
        return props.gateway
      },
      set: (val) => {
        emit('update:gateway', val);
        return val;
      }
    })
    let vlanIdForm = computed({
      get: () => {
        return props.vlanId
      },
      set: (val) => {
        emit('update:vlanId', val);
        return val;
      }
    })
    let dhcpForm = computed({
      get: () => {
        return props.dhcp
      },
      set: (val) => {
        emit('update:dhcp', val);
        return val;
      }
    })

    /**
     * 改变dhcp
     * @param data
     */
    const changeDhcp = (data) => {
      if (!data) {
        addressRangeForm.value = [];
      }
    }
    const addTable = () => {
      let addData = {
        startIp: null,
        endIp: null,
      }
      addressRangeForm.value.push(addData);
    }
    const deleteTable = (index) => {
      addressRangeForm.value.splice(index, 1);
    }
    const handleDeleteTag = () => {
      emit('delete-tag');
    }
    return {
      $tt,
      label,
      uneditableBySceneStatus,
      FORM_RULES,
      dhcpForm,
      DNSForm,
      addressForm,
      gatewayForm,
      vlanIdForm,
      addressRangeForm,
      addTable,
      deleteTable,
      changeDhcp,
      handleDeleteTag,
    }
  }
}
</script>
