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
      <cb-form-item prop="content" :label="$t('careerSystem.name')">
        <div class="input-length">
          <cb-input
            v-model="model.content"
            :placeholder="$t('careerSystem.inputSkillCategory')"
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
            link-name="skill-category-list"
            button-type="cancel"
          ></cb-button>
        </cb-button-group>
      </div>
    </cb-form>
  </cb-inner-page>
</template>
<script>
import { putSkillCategory, getSkillCategory } from '@/api/career-skill';
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
      url: '/rtks/skill-category',
      model: {
        content: '',
        resource_id: '',
      },
      rules: {
        content: [
          {
            required: true,
            message: this.$t('careerSystem.inputSkillCategory'),
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
      getSkillCategory(that.id).then((res) => {
        const data = res.data.data;
        this.model.content = data.content;
      });
    }
  },
  methods: {
    putApply() {
      const that = this;
      that.model.resource_id = that.id;
      putSkillCategory(that.model).then(() => {
        that.$router.push({
          name: 'skill-category-list',
        });
      });
    },
    apply() {
      const that = this;
      that.$refs.formRef.submit().then(() => {
        that.$router.push({
          name: 'skill-category-list',
        });
      });
    },
  },
};
</script>
