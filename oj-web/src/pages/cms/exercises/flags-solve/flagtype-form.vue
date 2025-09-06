<template>
  <cb-inner-page :background="false">
    <div class="form-box">
      <cb-form
        ref="formRef"
        :model.sync="model"
        :baseURL="baseURL"
        :url="url"
        :id="id && { resource_id: id }"
        :rules="rules"
        label-width="120px"
        :isBgColor="true"
      >
        <cb-form-item :label="$t('m.courseName')" prop="name">
          <cb-input v-model="model.name"></cb-input>
        </cb-form-item>
        <div class="form-button-bar">
          <cb-button-group space="middle">
            <cb-button
              @click="addtype"
              button-type="confirm"
              mr="mr"
            ></cb-button>
            <cb-button button-type="cancel" @click="back"></cb-button>
          </cb-button-group>
        </div>
      </cb-form>
    </div>
  </cb-inner-page>
</template>
<script>
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
      url: '/oj/admin/practice/category/',
      model: {
        name: '',
        practice_type: 2,
      },
      rules: {
        name: [
          { required: true, trigger: 'blur', message: this.$t('m.namePh') },
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
      this.$router.push({ name: 'flags-to-type' });
    },
    addtype() {
      const that = this;
      const formData = new FormData();
      formData.append('name', this.model.name);
      formData.append('resource_id', this.id);
      formData.append('practice_type', 2);
      that.$refs.formRef.submit(formData).then(() => {
        that.$router.push({
          name: 'flags-to-type',
        });
      });
    },
  },
};
</script>
<style scoped lang="scss"></style>
