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
      <cb-form-item
        prop="resource_id"
        :label="$t('careerSystem.jobDutyNumber')"
      >
        <cb-input
          :disabled="id ? true : false"
          v-model="model.resource_id"
          :placeholder="$t('careerSystem.plzEnterjobDutyNumber')"
        ></cb-input>
      </cb-form-item>
      <cb-form-item prop="content" :label="$t('careerSystem.content')">
        <cb-input
          v-model="model.content"
          :placeholder="$t('careerSystem.plzEnterjobDutyContent')"
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
  addJobResponsibility,
  editBackData,
  editJobResponsibility,
} from '@/api/career-framework';
export default {
  name: 'JobDataBaseForm',
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
        resource_id: '',
        content: '',
      },
      rules: {
        resource_id: [
          {
            required: true,
            message: this.$t('careerSystem.enterNumber'),
            trigger: 'blur',
          },
        ],
        content: [
          {
            required: true,
            message: this.$t('careerSystem.enterContent'),
            trigger: 'blur',
          },
        ],
      },
    };
  },
  mounted() {
    if (this.id) {
      editBackData(this.id).then((res) => {
        let resource_id = _.get(res, 'data.data.resource_id', ''),
          content = _.get(res, 'data.data.content', '');
        this.model = {
          resource_id,
          content,
        };
      });
    }
  },
  methods: {
    fetchForm() {
      const model = _.cloneDeep(this.model);
      if (this.id) {
        return editJobResponsibility(model).then(() => {
          this.back();
        });
      } else {
        return addJobResponsibility(model).then(() => {
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
        path: '/admin/course-mod/career-system/career-job-database/job-database-list',
      });
    },
    resetForm() {
      this.back();
    },
  },
};
</script>
