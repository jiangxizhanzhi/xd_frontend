<template>
  <cb-inner-page :background="false">
    <cb-form
      ref="formRef"
      :model="model"
      :url="url"
      :baseURL="baseURL"
      :rules="rules"
      :label-width="labelWidthForm"
      json
    >
      <cb-form-item prop="name" :label="$t('careerSystem.name')">
        <div class="input-length">
          <cb-input
            v-model="model.name"
            :placeholder="$t('careerSystem.InputFrameName')"
          ></cb-input>
        </div>
      </cb-form-item>
      <div class="form-button-bar">
        <cb-button-group space="middle">
          <cb-button
            v-if="id"
            class="mr"
            @click="putApply"
            button-type="confirm"
          ></cb-button>
          <cb-button
            v-else
            class="mr"
            @click="apply"
            button-type="confirm"
          ></cb-button>
          <cb-button
            link-name="framework-management-list"
            button-type="cancel"
          ></cb-button>
        </cb-button-group>
      </div>
    </cb-form>
  </cb-inner-page>
</template>
<script>
import { getFrame, putFrame } from '@/api/career-framework';
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
      baseURL: '/api/ojj',
      url: '/rtks/frame',
      model: {
        name: '',
      },
      rules: {
        name: [
          {
            required: true,
            message: this.$t('careerSystem.InputFrameName'),
            trigger: 'blur',
          },
        ],
      },
    };
  },
  computed: {
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
      getFrame(that.id).then((res) => {
        const data = res.data.data;
        this.model = data;
      });
    }
  },
  methods: {
    putApply() {
      const that = this;
      that.model.resource_id = that.id;
      putFrame(that.model).then(() => {
        that.$router.push({
          name: 'framework-management-list',
        });
      });
    },
    apply() {
      const that = this;
      that.$refs.formRef.submit().then(() => {
        that.$router.push({
          name: 'framework-management-list',
        });
      });
    },
  },
};
</script>
