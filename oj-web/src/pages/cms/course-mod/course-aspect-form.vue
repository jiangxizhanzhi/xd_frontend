<template>
  <cb-inner-page :background="false">
    <cb-form
      @submit.native.prevent
      ref="formRef"
      label-width="100px"
      :rules="rules"
      :model.sync="model"
      :url="url"
      :id="id && { resource_id: id }"
      baseURL="/api/ojj"
      json
      :isBgColor="true"
    >
      <cb-form-item prop="name" :label="$t('views.course.aspect.Name')">
        <div class="input-length">
          <cb-input v-model="model.name"></cb-input>
        </div>
      </cb-form-item>
      <div class="form-button-bar">
        <cb-button-group space="middle">
          <cb-button
            class="mr"
            @click="apply"
            button-type="confirm"
          ></cb-button>
          <cb-button
            @click="$router.push({ name: 'courses-aspect' })"
            button-type="cancel"
          ></cb-button>
        </cb-button-group>
      </div>
    </cb-form>
  </cb-inner-page>
</template>
<script>
export default {
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
      url: '/oj/admin/course/direction',
      model: {
        name: '',
      },
      rules: {
        name: [
          { required: true, message: this.$t('m.namePh'), trigger: 'blur' },
        ],
      },
    };
  },
  mounted() {
    if (this.id) {
      this.$refs['formRef'].getModelData();
    }
  },
  methods: {
    apply() {
      const that = this;
      that.$refs['formRef'].submit().then(() => {
        that.$router.push({
          name: 'courses-aspect',
        });
      });
    },
  },
};
</script>
