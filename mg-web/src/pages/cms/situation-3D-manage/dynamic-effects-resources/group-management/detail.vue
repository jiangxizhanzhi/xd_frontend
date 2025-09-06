<template>
  <cb-inner-page :background="false">
    <div class="form-box">
      <cb-form
        ref="formRef"
        :model.sync="model"
        :baseURL="baseURL"
        :url="url"
        :id="id && { resourceId: id }"
        :rules="rules"
        label-width="120px"
        label-position="right"
        :json="true"
      >
        <cb-form-item :label="$t('situation3DManage.name')" prop="name">
          <cb-input
            v-model.trim="model.name"
            :placeholder="$t('situation3DManage.inputName')"
          ></cb-input>
        </cb-form-item>
        <div slot="fixedBottom">
          <cb-button-group space="middle">
            <cb-button
              button-type="confirm"
              @click="formSubmit"
              mr="mr"
            ></cb-button>
            <cb-button button-type="cancel" hollow @click="back"></cb-button>
          </cb-button-group>
        </div>
      </cb-form>
    </div>
  </cb-inner-page>
</template>

<script>
/**
 * 长度校验
 */
import { validateTitleLength255 } from '@/utils/rules-cms.js';
export default {
  components: {},
  props: {
    id: {
      type: String,
      default() {
        return null;
      },
    },
  },
  data() {
    return {
      baseURL: '/api/ojj',
      url: '/situation/effect/category',
      model: {
        name: '',
      },
      rules: {
        name: [
          {
            required: true,
            trigger: 'blur',
            message: this.$t('situation3DManage.inputName'),
          },
          { validator: validateTitleLength255, trigger: 'blur' },
        ],
      },
    };
  },
  computed: {},
  mounted() {
    if (this.id) {
      this.$refs.formRef.getModelData();
    }
  },
  methods: {
    back() {
      this.$router.push({ name: 'dynamic-effects-resources-group' });
    },
    formSubmit() {
      const that = this;
      const data = _.cloneDeep(that.model);
      if (that.id) {
        delete data.create_time;
        delete data.create_user_id;
        delete data.id;
        delete data.update_time;
      }
      that.$refs.formRef.submit(data).then(() => {
        that.$router.push({
          name: 'dynamic-effects-resources-group',
        });
      });
    },
  },
};
</script>
<style scoped lang="scss">
.form-box {
  background: var(--bg-color-2);
}
</style>
