<template>
  <cb-inner-page :background="false">
    <cb-form
      ref="fromRef"
      :model.sync="model"
      :rules="rules"
      label-width="150px"
      class="demo-model"
      :url="url"
      :baseURL="baseURL"
      :id="id && { resource_id: id }"
      :contentType="contentType"
      :isBgColor="true"
    >
      <cb-form-item :label="$t('trafficCategory.cn_name')" prop="cn_name">
        <cb-input v-model="model.cn_name" />
      </cb-form-item>
      <cb-form-item :label="$t('trafficCategory.en_name')" prop="en_name">
        <cb-input v-model="model.en_name" />
      </cb-form-item>
      <div class="form-button-bar">
        <cb-button buttonType="confirm" @click="submitForm($event)" mr>
          {{ $t('common.submit') }}
        </cb-button>
        <cb-button buttonType="cancel" @click="goBack">
          {{ $t('common.cancel') }}
        </cb-button>
      </div>
    </cb-form>
  </cb-inner-page>
</template>

<script>
import { validateCategoryLength } from '@/utils/rules-cms';
export default {
  name: 'TrafficCategoryDetail',
  props: {
    id: {
      type: [String, Number],
      default: '',
    },
  },
  data() {
    return {
      url: '/cr/admin/tool/category',
      baseURL: '/api/ojj',
      contentType: 'application/json',
      model: {
        cn_name: null,
        en_name: null,
      },
      rules: {
        cn_name: [
          {
            required: true,
            message: this.$t('categoryRules.pleaseInputName'),
            trigger: 'blur',
          },
          { validator: validateCategoryLength, trigger: 'blur' },
        ],
        en_name: [
          {
            required: true,
            message: this.$t('categoryRules.pleaseInputName'),
            trigger: 'blur',
          },
          { validator: validateCategoryLength, trigger: 'blur' },
        ],
      },
    };
  },
  mounted() {
    if (this.id) {
      this.$refs.fromRef.getModelData();
    }
  },
  methods: {
    goBack() {
      this.$router.push('/admin/tool/category');
    },
    submitForm(done) {
      this.$refs.fromRef
        .submit(this.model)
        .then((res) => {
          this.goBack();
        })
        .catch((err) => {});
    },
  },
};
</script>
