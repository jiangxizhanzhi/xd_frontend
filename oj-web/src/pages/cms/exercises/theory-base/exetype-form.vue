<template>
  <cb-inner-page :background="false">
    <div class="form-box" :style="commonMarginRightStyle">
      <cb-form
        ref="formRef"
        :model.sync="model"
        :label-width="labelWidthForm"
        :rules="rules"
        :id="id && { resource_id: id }"
        :baseURL="baseURL"
        :url="url"
        label-widdth="200px"
        :isBgColor="true"
      >
        <cb-form-item :label="$t('m.courseName')" prop="name">
          <cb-input v-model="model.name"></cb-input>
        </cb-form-item>
        <div class="form-button-bar">
          <cb-button-group space="middle">
            <cb-button button-type="confirm" mr="mr" @click="addtype">{{
              $t('button.confirm')
            }}</cb-button>
            <cb-button button-type="cancel" @click="back">{{
              $t('button.cancel')
            }}</cb-button>
          </cb-button-group>
        </div>
      </cb-form>
    </div>
  </cb-inner-page>
</template>
<script>
import msger from '@/utils/message.js';

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
      model: {
        name: '',
        //理论基础
        practice_type: 0,
      },
      baseURL: '/api/ojj',
      url: '/oj/admin/practice/category/',
      rules: {
        name: [
          { required: true, trigger: 'blur', message: this.$t('m.namePh') },
        ],
      },
    };
  },
  computed: {
    commonMarginRightStyle() {
      return {
        marginRight: `16px`,
      };
    },
    labelWidth() {
      return this.$store.state.app.labelWidth;
    },
    labelWidthForm() {
      return `${this.labelWidth}px`;
    },
  },
  mounted() {
    const that = this;
    if (that.id) {
      that.$refs.formRef.getModelData();
    }
  },
  methods: {
    back() {
      this.$router.push({ name: 'theory-to-type' });
    },
    addtype() {
      const that = this;
      const formData = new FormData();
      formData.append('name', this.model.name);
      formData.append('resource_id', this.id);
      formData.append('practice_type', 0);
      that.$refs.formRef
        .submit(formData)
        .then(() => {
          that.$router.push({
            name: 'theory-to-type',
          });
        })
        .catch((err) => {
          msger.serverError(err, that);
        });
    },
  },
};
</script>
<style scoped lang="scss"></style>
