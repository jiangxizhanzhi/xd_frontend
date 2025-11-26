<template>
  <div class="cb-scene-editor">
    <div class="cb-scene-dialog">
      <div class="probe-params-setting-wrapper">
        <cb-dialog
          width="500px"
          :visible="visibleValue"
          :append-to-body="true"
          @close="handleClose"
        >
          <template slot="title">
            <div>{{ $tt('global.setting') }}</div>
          </template>
          <div class="probe-params-setting-content">
            <cb-form
              ref="formRef"
              :model.sync="paramsForm"
              id="id"
              :json="true"
              label-position="right"
              :label-width="labelWidth"
              :inline="false"
            >
              <cb-row>
                <cb-col :span="24">
                  <cb-form-item :label="$tt('menu.dialog.probe.paramSetting')[0] + ' ：'" prop="name"
                                :rules="FORM_RULES.probe.require">
                    <cb-select
                      class="cb-scene-dialog-params-setting"
                      :placeholder="$tt('global.placeSelect')"
                      v-model="active"
                      :options="params_options"
                      @change="changeOptions($event)"
                      :disabled="!paramsForm.default_value || validateError"
                      :popper-append-to-body="false"
                    >
                    </cb-select>
                  </cb-form-item>
                </cb-col>
                <cb-col :span="24">
                  <cb-form-item :label="$tt('menu.dialog.probe.paramSetting')[1] + ' ：'" prop="type">
                    {{ paramsForm.type }}
                  </cb-form-item>
                </cb-col>
                <cb-col :span="24">
                  <cb-form-item :label="$tt('menu.dialog.probe.paramSetting')[2] + ' ：'" prop="default_value"
                                :rules="rules">
                    <cb-input v-if="paramsForm.type.toLowerCase() != 'bool'" size="small"
                              v-model="paramsForm.default_value" type="text"
                              :placeholder="$tt('global.placeInput')"></cb-input>
                    <cb-select
                      class="cb-scene-dialog-params-setting"
                      v-else
                      size="small"
                      :placeholder="$tt('global.placeSelect')"
                      v-model="paramsForm.default_value"
                      :options="bool_params_options"
                    >
                    </cb-select>
                  </cb-form-item>
                </cb-col>
              </cb-row>

            </cb-form>
          </div>
          <template slot="footer">
            <div class="cb-scene-dialog-footer">
              <cb-button-group>
                <cb-button button-type="confirm" @click="submit">
                  {{ $tt('global.sure') }}
                </cb-button>
                <cb-button button-type="confirm" hollow @click="handleClose">
                  {{ $tt('global.cancel') }}
                </cb-button>
              </cb-button-group>
            </div>
          </template>
        </cb-dialog>
      </div>
    </div>
  </div>
</template>

<script>
import t from '../../../../../utils/i18n';
import {computed, inject, ref, getCurrentInstance} from '@vue/composition-api';
import {
  CATEGORY_PARAMS,
  CATEGORY_PROB_OBJECT,
} from "../../components/constant/probe";
import _ from "lodash";
import {FORM_RULES} from "../../components/constant/form-rules";
import {useSubmitForm} from "../../../../../utils/form/submit";

export default {
  name: "params-setting",
  components: {},
  props: {
    /**
     * 是否弹窗
     */
    visible: {
      type: Boolean,
      default: false,
    },
    system_type: {
      type: String,
      default: '',
    },
    paramsData: {
      type: Object,
      default: () => {
      },
    },
  },
  setup(props, {emit}) {
    const formRef = ref(null);
    const $tt = t;
    const {proxy} = getCurrentInstance();
    const {$message} = proxy;
    const lang = inject('lang');
    const labelWidth = computed(() => {
      return lang === 'zh-CN' ? '100px' : '120px';
    });
    const cloneParams = ref(_.cloneDeep(props.paramsData.params));
    let active = ref(props.paramsData.params[0].name);

    let visibleValue = computed(
      {
        get: () => {
          return props.visible;
        },
        set: (val) => {
          emit('update:visible', val);
          return val;
        }
      }
    );
    const paramsForm = computed({
      get: () => {
        return cloneParams.value.filter(param => param.name == active.value)[0];
      },
    })

    const validateError = computed({
      get: () => {
        if (formRef.value) {
          let result = useSubmitForm(formRef.value, cloneParams.value);
          return !result.status;
        }
      },
    })

    const params_options = computed({
      get: () => {
        return props.paramsData.params.map(param => {
          return {
            label: param.name,
            value: param.name,
          }
        })
      },
    })
    const bool_params_options = [
      {label: 'true', value: 'true'},
      {label: 'false', value: 'false'}
    ]

    // 参数默认值校验
    const rules = computed(() => {
      switch (paramsForm.value.type.toLowerCase()) {
        case 'number':
          return [...FORM_RULES.probe.require, ...FORM_RULES.probe.number];
        case 'string':
          return FORM_RULES.probe.require;
        case 'bool':
          return [...FORM_RULES.probe.require, ...FORM_RULES.probe.bool];
        case 'ip':
          return [...FORM_RULES.probe.require, ...FORM_RULES.probe.ip];
        default:
          break
      }
    })

    const changeOptions = ($event, index) => {
      active.value = $event;
    }

    const handleClose = () => {
      visibleValue.value = false;
      emit('close', {type: 'close'})
    }
    const handleClick = () => {
      emit('click')
    }

    const submit = () => {
      let result = useSubmitForm(formRef.value, cloneParams.value);
      if (result.status) {
        $message.info($tt('menu.dialog.validator.editParamInfo'))
        emit('save', {type: 'save', data: {params: cloneParams.value, index: props.paramsData.index}})
        handleClose();
      }
    }

    return {
      FORM_RULES,
      CATEGORY_PARAMS,
      CATEGORY_PROB_OBJECT,
      formRef,
      $tt,
      rules,
      visibleValue,
      paramsForm,
      labelWidth,
      params_options,
      active,
      validateError,
      bool_params_options,
      changeOptions,
      handleClose,
      handleClick,
      submit,
    }
  }
}
</script>
<style lang="scss" scoped>
.probe-params-setting-wrapper {
  .cb-select {
    width: 100% !important;
    ::v-deep .el-select-dropdown .el-select-dropdown__wrap {
      margin: 0 !important;
    }
  }
}
</style>
