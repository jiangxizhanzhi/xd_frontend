<template>
  <cb-dialog
    width="650px"
    :visible.sync="visibleValueForm"
    :append-to-body="true"
    :modal-append-to-body="true"
    @close="handleClose"
    :rules="rules"
  >
    <template slot="title">
      <div>{{ $tt('target.accessProtocol') }}</div>
    </template>
    <cb-form
      ref="formRef"
      :model.sync="accessModesForm"
      label-position="right"
      :label-width="labelWidth"
    >
      <cb-form-item :label="$tt('target.protocol') + ' ：'" prop="protocol"
                    :rules="FORM_RULES.networkConfig.protocol">
        <cb-select
          width="100%"
          size="small"
          v-model="accessModesForm.protocol"
          :options="access_protocol_list"
          :popper-append-to-body="false"
          :placeholder="$tt('target.selectAccessProtocol')"
          :disabled="type == 'edit'"
        ></cb-select>
      </cb-form-item>
      <cb-form-item :label="$tt('target.portName') + ' ：'" prop="port"
                    :rules="FORM_RULES.networkConfig.port">
        <cb-input
          size="small"
          v-model="accessModesForm.port"
        ></cb-input>
      </cb-form-item>
      <cb-form-item :label="$tt('target.access_ip') + ' ：'" prop="access_ip"
                    :rules="FORM_RULES.networkConfig.ip">
        <cb-input
          size="small"
          v-model="accessModesForm.access_ip"
        ></cb-input>
      </cb-form-item>
      <cb-form-item :label="$tt('global.userName') + ' ：'" prop="username">
        <cb-input
          size="small"
          v-model="accessModesForm.username"
        ></cb-input>
      </cb-form-item>
      <cb-form-item :label="$tt('global.password') + ' ：'" prop="password">
        <cb-input
          size="small"
          v-model="accessModesForm.password"
        ></cb-input>
      </cb-form-item>
      <cb-form-item :label="$tt('target.allowDirectAccess') + ' ：'" prop="proxy">
        <cb-switch v-model="accessModesForm.proxy" active-color="#13ce66">
        </cb-switch>
      </cb-form-item>
    </cb-form>
    <template slot="footer">
      <div class="cb-scene-dialog-footer">
        <cb-button-group>
          <cb-button button-type="confirm" @click="submitForm()">
            {{ $tt('global.sure') }}
          </cb-button>
          <cb-button button-type="cancel" hollow @click="handleClose()">
            {{ $tt('global.cancel') }}
          </cb-button>
        </cb-button-group>
      </div>
    </template>
  </cb-dialog>
</template>

<script>
import t from '../../../../../utils/i18n';
import {computed, getCurrentInstance, ref, watch} from '@vue/composition-api';
import {ENTITY_ACCESS_PROTOCOL, ENTITY_ACCESS_TABLE} from "../constant/device-info";
import {FORM_RULES} from "../constant/form-rules";
import {useResetForm, useSubmitForm} from "../../../../../utils/form/submit";
import _ from "lodash";

export default {
  name: "entity-protocol-dialog",
  components: {},
  props: {
    /**
     * 接入配置数据
     */
    accessModes: {
      type: Object,
      default: () => ({}),
    },
    editProtocolIndex: {
      type: String | Number,
      default: '',
    },
    lang: {
      type: String,
      default: 'zh-CN',
    },
    visibleValue: {
      type: Boolean,
      default: false,
    },
    type: {
      type: String,
      default: 'add',
    },
    allAccessModes: {
      type: Array,
      default: () => ([]),
    }
  },
  setup(props, {emit}) {
    const formRef = ref(null);
    const {proxy} = getCurrentInstance();
    const {$message, $confirm} = proxy;
    let isEdit = ref(false);
    const rules = {};
    const labelWidth = computed(() => {
      return props.lang === 'zh-CN' ? '120px' : '170px';
    });
    let accessModesForm = props.type === 'add' ? ref({
      password: '',
      port: null,
      protocol: '',
      username: '',
      path: '',
      hostname: '',
      proxy: true,
      access_ip: '',
      private_key_enable: null,
      private_key_path: null,
    }) : ref(_.cloneDeep(props.accessModes));
    let visibleValueForm = computed({
      get: () => {
        return props.visibleValue
      },
      set: (val) => {
        emit('update:visibleValue', val)
        return val
      }
    })

    const access_protocol_list = computed(() => {
      let all_modes = props.allAccessModes?.map(item => item.access_modes)?.flat();
      return ENTITY_ACCESS_PROTOCOL.map(item => {
        return {
          ...item,
          disabled: all_modes.some(mode => mode.protocol == item.value)
        }
      })
    })

    watch(() => props.visibleValue, (val) => {
      if (val) {
        if (props.type === 'edit') {
          accessModesForm.value = _.cloneDeep(props.accessModes)
        } else {
          accessModesForm.value = {
            password: '',
            port: null,
            protocol: '',
            username: '',
            path: '',
            hostname: '',
            proxy: true,
            access_ip: '',
            private_key_enable: null,
            private_key_path: null,
          }
        }
      }
    })
    const handleClose = () => {
      isEdit.value = false;
      visibleValueForm.value = false;
    }
    const submitForm = () => {
      let result = useSubmitForm(formRef.value, accessModesForm.value);
      if (result.status) {
        if (props.type == 'edit') {
          emit('update:access-modes', accessModesForm.value)
        } else {
          emit('add-protocol', accessModesForm.value)
        }
        handleClose()
      } else {
        $message.info(t('global.checkFormFailed'))
      }
    }
    // 重置表单
    const resetForm = () => {
      emit("formCheck", useResetForm(formRef.value));
    }
    return {
      $tt: t,
      formRef,
      rules,
      labelWidth,
      visibleValueForm,
      isEdit,
      accessModesForm,
      FORM_RULES,
      ENTITY_ACCESS_TABLE,
      ENTITY_ACCESS_PROTOCOL,
      access_protocol_list,
      handleClose,
      submitForm,
      resetForm,
    }
  }
}
</script>
