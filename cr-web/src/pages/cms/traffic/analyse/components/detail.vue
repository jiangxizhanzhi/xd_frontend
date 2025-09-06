<template>
  <cb-inner-page :background="false">
    <cb-form
      ref="formRef"
      label-position="right"
      label-width="120px"
      :model.sync="model"
      :rules="rules"
      :url="url"
      :id="id"
      :isBgColor="true"
      baseURL="/api/mp"
    >
      <cb-form-item :label="$t('analyse.agreement')" prop="agreement">
        <cb-select
          v-model="model.agreement"
          :options="categoryOptions"
          :placeholder="$t('analyse.plzSelectAgreement')"
        />
      </cb-form-item>
      <div style="display: flex; justify-content: space-between">
        <cb-form-item :label="$t('analyse.sourceIP')" prop="sourceIP">
          <cb-select
            v-model="model.sourceIP"
            :options="categoryOptions"
            :placeholder="$t('analyse.plzSelectSourceIp')"
          />
        </cb-form-item>
        <cb-form-item :label="$t('analyse.sourcePort')" prop="sourcePort">
          <cb-select
            v-model="model.sourcePort"
            :options="categoryOptions"
            :placeholder="$t('analyse.plzSelectSourcePort')"
          />
        </cb-form-item>
        <cb-form-item :label="$t('analyse.destIP')" prop="destIP">
          <cb-select
            v-model="model.destIP"
            :options="categoryOptions"
            :placeholder="$t('analyse.plzSelectDestIp')"
          />
        </cb-form-item>
        <cb-form-item :label="$t('analyse.destPort')" prop="destPort">
          <cb-select
            v-model="model.destPort"
            :options="categoryOptions"
            :placeholder="$t('analyse.plzSelectDestPort')"
          />
        </cb-form-item>
      </div>
      <cb-form-item :label="$t('analyse.trafficCategory')" prop="category">
        <cb-select
          v-model="model.category"
          :options="categoryOptions"
          :placeholder="$t('analyse.plzSelectTrafficCategory')"
        />
      </cb-form-item>
      <cb-form-item :label="$t('analyse.attackTech')" prop="attack">
        <cb-select
          v-model="model.attack"
          filterable
          :options="categoryOptions"
          :placeholder="$t('analyse.plzSelectAttack')"
        />
      </cb-form-item>
      <cb-form-item :label="$t('analyse.regularBody')" prop="rule">
        <cb-input
          v-model="model.rule"
          :placeholder="$t('analyse.plzEnterRule')"
        />
      </cb-form-item>
      <div slot="fixedBottom">
        <cb-button-group space="middle">
          <cb-button button-type="confirm" @click="submitForm"> </cb-button>
          <cb-button button-type="cancel" @click="resetForm"> </cb-button>
        </cb-button-group>
      </div>
    </cb-form>
  </cb-inner-page>
</template>

<script>
import { getOptionList } from '@/api/traffic/traffic';
import Utils from '@/utils/util';
export default {
  name: 'AnalyseDetail',
  props: ['id'],
  data() {
    var validateRule = (rule, value, callback) => {
      if (value) {
        const len = Utils.getByteLen(value);
        if (len < 1 || len > 2048) {
          callback(new Error(this.$t('analyse.ruleValidate2048')));
        } else {
          callback();
        }
      } else {
        callback();
      }
    };
    return {
      url: '/flow/info/background',
      model: {
        agreement: '',
        sourceIP: '',
        sourcePort: '',
        destIP: '',
        destPort: '',
        category: '',
        attack: '',
        rule: '',
      },
      categoryOptions: [],
      rules: {
        agreement: [
          {
            required: true,
            message: this.$t('analyse.plzSelectAgreement'),
            trigger: 'blur',
          },
        ],
        sourceIP: [
          {
            required: true,
            message: this.$t('analyse.plzSelectSourceIp'),
            trigger: 'blur',
          },
        ],
        sourcePort: [
          {
            required: true,
            message: this.$t('analyse.plzSelectSourcePort'),
            trigger: 'blur',
          },
        ],
        destIP: [
          {
            required: true,
            message: this.$t('analyse.plzSelectDestIp'),
            trigger: 'blur',
          },
        ],
        destPort: [
          {
            required: true,
            message: this.$t('analyse.plzSelectDestPort'),
            trigger: 'blur',
          },
        ],
        category: [
          {
            required: true,
            message: this.$t('analyse.plzSelectTrafficCategory'),
            trigger: 'blur',
          },
        ],
        rule: [
          {
            required: true,
            message: this.$t('analyse.plzEnterRule'),
            trigger: 'blur',
          },
          { validator: validateRule, trigger: 'blur' },
        ],
      },
    };
  },
  mounted() {
    if (this.id) {
      this.$refs.formRef.getModelData().then((res) => {});
    }
    this.getOptionsList();
  },
  computed: {},
  methods: {
    submitForm() {
      this.$refs.formRef.submit().then(() => {
        this.$router.push({ path: '/admin/traffic/analyse' });
      });
    },
    resetForm() {
      this.$router.push({ path: '/admin/traffic/analyse' });
    },
    //获取下拉选框options列表数据
    getOptionsList() {
      getOptionList().then((res) => {
        const tempList = (this.options = _.get(res, 'data.data', []));
        this.categoryOptions = tempList.map((item) => {
          return {
            label: item.name,
            value: item.code,
          };
        });
      });
    },
  },
};
</script>
