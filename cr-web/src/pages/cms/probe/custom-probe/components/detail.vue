<template>
  <cb-inner-page :background="false">
    <div class="custom-page">
      <cb-form
        class="custom-form"
        ref="formRef"
        :label-width="getI18Nn().locale == 'en-US' ? '150px' : '100px'"
        :model.sync="model"
        :rules="rules"
        :id="id"
        :url="url"
        baseURL="/api/mp"
        :contentType="contentType"
      >
        <div class="info-area">
          <div class="title">{{ $t('probes.basicInfo') }}</div>
          <cb-form-item :label="$t('probes.probeName')" prop="name">
            <cb-input
              v-model="model.name"
              :placeholder="$t('probes.inputProbeName')"
            />
          </cb-form-item>

          <cb-form-item :label="$t('probes.probeDesc')" prop="description">
            <cb-input
              type="textarea"
              :placeholder="$t('probes.inputDescInfo')"
              v-model="model.description"
            />
          </cb-form-item>

          <cb-form-item :label="$t('probes.probeType')">
            <cb-radio-group v-model="model.probe_category">
              <cb-radio
                v-for="option in probesTypes"
                :key="option.value"
                :label="option.value"
              >
                {{ option.label }}
              </cb-radio>
            </cb-radio-group>
          </cb-form-item>

          <cb-form-item :label="$t('probes.applicableSystem')" prop="os_types">
            <cb-checkbox-group v-model="model.os_types">
              <cb-checkbox
                v-for="option in applicableSystems"
                :key="option.value"
                :label="option.value"
              >
                {{ option.label }}
              </cb-checkbox>
            </cb-checkbox-group>
          </cb-form-item>
        </div>
        <div class="code-area">
          <div class="title">{{ $t('probes.code') }}</div>
          <cb-form-item :label="$t('probes.codeLang')">
            <cb-radio-group v-model="model.script_type">
              <cb-radio
                v-for="option in scriptTypes"
                :key="option.value"
                :label="option.value"
              >
                {{ option.label }}
              </cb-radio>
            </cb-radio-group>
          </cb-form-item>
          <cb-form-item :label="$t('probes.scriptCode')" prop="script_content">
            <script-code
              :code.sync="model.script_content"
              :suffix.sync="model.script_type"
            />
          </cb-form-item>
        </div>
        <div class="param-area">
          <div class="title">{{ $t('probes.params') }}</div>
          <cb-form-item class="param-list">
            <param-list
              :addDefault="false"
              ref="params"
              @saveParam="saveParameter"
            />
          </cb-form-item>
        </div>
        <div slot="fixedBottom">
          <cb-button-group space="middle">
            <cb-button button-type="confirm" @click="submit"> </cb-button>
            <cb-button button-type="cancel" @click="cancel"> </cb-button>
          </cb-button-group>
        </div>
      </cb-form>
    </div>
  </cb-inner-page>
</template>

<script>
import { getI18N } from '@cyber/helper';
import ScriptCode from './codemirror';
import ParamList from './param-list';
import TitleLeft from '@/components/Title/BgTitle';
import {
  PROBESTYPES,
  APPLICABLESYSTEMS,
  SCRIPTTYPELISTS,
} from '../../constant';
import { validateProbeName, validateProbeDesc } from '@/utils/rules-cms';
export default {
  props: ['id'],
  components: {
    ScriptCode,
    ParamList,
    TitleLeft,
  },
  data() {
    return {
      url: '/probes/',
      contentType: 'application/json',
      disable: false,
      visible: false,
      probesTypes: PROBESTYPES,
      applicableSystems: APPLICABLESYSTEMS,
      scriptTypes: SCRIPTTYPELISTS,
      model: {
        name: '',
        description: '',
        probe_category: 0,
        os_types: [],
        script_type: 0,
        script_content: '',
        suffix: 0,
        parameter: '',
      },
      rules: {
        name: [
          {
            required: true,
            message: this.$t('probes.inputProbeName'),
            trigger: 'blur',
          },
          { validator: validateProbeName, trigger: 'blur' },
        ],
        description: [{ validator: validateProbeDesc, trigger: 'blur' }],
        os_types: [
          {
            required: true,
            message: this.$t('probes.selectSys'),
            trigger: 'blur',
          },
        ],
        script_content: [
          {
            required: true,
            message: this.$t('probes.codeNull'),
            trigger: 'blur',
          },
        ],
      },
    };
  },

  watch: {},

  created() {},
  mounted() {
    if (this.id) {
      this.$refs.formRef.getModelData().then((data) => {
        this.$refs.params.params = data.parameter
          ? JSON.parse(data.parameter)
          : '';
      });
    }
  },
  methods: {
    getI18Nn() {
      return getI18N();
    },
    saveParameter(param) {
      this.model.parameter = param;
    },
    submit() {
      this.$refs.formRef.submit(this.model).then(() => {
        this.$router.push({ name: 'custom-probe' });
      });
    },
    cancel() {
      this.$confirm(this.$t('probes.leaveWarning')).then(() => {
        this.$router.push({ name: 'custom-probe' });
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.custom-page {
  margin-right: 20px;
  .custom-form {
    ::v-deep .el-form {
      padding: 0px 0px 20px 0px;
    }
    .info-area {
      background: var(--bg-color-2);
      padding: 20px 20px 1px 20px;
      margin-bottom: 20px;
    }
    .code-area {
      background: var(--bg-color-2);
      padding: 20px 20px 1px 20px;
      margin-bottom: 20px;
    }
    .param-area {
      background: var(--bg-color-2);
      padding: 20px;
      margin-bottom: 10px;
    }
    .title {
      font-size: 16px;
      line-height: 24px;
      color: var(--neutral8);
      margin-bottom: 20px;
      &::before {
        content: '';
        display: inline-block;
        width: 6px;
        height: 8px;
        vertical-align: middle;
        background: var(--primary-color);
        margin: -2px 8px 0 16px;
      }
    }
    .param-list {
      ::v-deep .el-form-item__content {
        margin-left: 15px !important;
      }
    }
  }
}
</style>
