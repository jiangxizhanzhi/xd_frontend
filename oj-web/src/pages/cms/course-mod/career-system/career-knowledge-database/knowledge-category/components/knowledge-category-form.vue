<template>
  <cb-inner-page :background="false">
    <cb-form
      ref="formRef"
      label-position="right"
      label-width="120px"
      :model.sync="model"
      :rules="rules"
      :fetchPromise="fetchForm"
      :isBgColor="true"
    >
      <cb-form-item prop="content" :label="$t('careerSystem.name')">
        <cb-input
          v-model="model.content"
          :placeholder="$t('careerSystem.enterKnowledgeCategory')"
        ></cb-input>
      </cb-form-item>
      <div class="form-button-bar">
        <cb-button-group space="middle">
          <cb-button buttonType="confirm" @click="submitForm"></cb-button>
          <cb-button button-type="cancel" @click="resetForm"></cb-button>
        </cb-button-group>
      </div>
    </cb-form>
  </cb-inner-page>
</template>
<script>
import {
  addKnowledgeCategory,
  editBackCategory,
  editKnowledgeCategory,
} from '@/api/career-framework';
export default {
  name: 'KnowledgeCategoryAdd',
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
        content: '',
      },
      rules: {
        content: [
          {
            required: true,
            message: this.$t('careerSystem.enterName'),
            trigger: 'blur',
          },
        ],
      },
    };
  },
  mounted() {
    if (this.id) {
      editBackCategory(this.id).then((res) => {
        let content = _.get(res, 'data.data.content', '');
        this.model.content = content;
      });
    }
  },
  methods: {
    fetchForm() {
      const model = _.cloneDeep(this.model);
      if (this.id) {
        const params = {
          resource_id: this.id,
          ...model,
        };
        return editKnowledgeCategory(params).then(() => {
          this.back();
        });
      } else {
        return addKnowledgeCategory(model).then(() => {
          this.back();
        });
      }
    },
    // 新增、编辑的提交
    submitForm() {
      this.$refs.formRef.submit();
    },
    back() {
      this.$router.push({
        name: 'knowledge-category-list',
      });
    },
    resetForm() {
      this.back();
    },
  },
};
</script>
