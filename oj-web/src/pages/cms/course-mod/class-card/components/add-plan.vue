<template>
  <div>
    <cb-form
      ref="formRef"
      label-position="right"
      label-width="130px"
      :model.sync="planModel"
      :rules="rulesPlan"
      :id="id && { resource_id: id }"
      baseURL="/api/ojj"
      :url="url"
      :method="postMethod"
      json
    >
      <cb-form-item :label="$t('classSchedule.teachingCourseName')" prop="name">
        <cb-input
          v-model="planModel.name"
          :placeholder="$t('classSchedule.plzEnterPlanName')"
        />
      </cb-form-item>
      <div class="form-button-bar">
        <cb-button-group space="middle">
          <cb-button buttonType="confirm" @click="submitPlanForm"></cb-button>
          <cb-button buttonType="cancel" @click="resetPlanForm"></cb-button>
        </cb-button-group>
      </div>
    </cb-form>
  </div>
</template>
<script>
import Utils from '@/utils/util';
export default {
  props: {
    id: {
      type: [String, Number],
      default: '',
    },
  },
  data() {
    const validateName = (rule, value, callback) => {
      const len = Utils.getByteLen(value);
      if (len < 1 || len > 255) {
        callback(this.$t('classSchedule.validatePlanName'));
      } else {
        callback();
      }
    };
    return {
      url: '/oj/admin/train/plan/train_plan',
      planModel: {
        name: '',
      },
      rulesPlan: {
        name: [
          {
            required: true,
            message: this.$t('classSchedule.plzEnterPlanName'),
            trigger: 'blur',
          },
          {
            required: true,
            validator: validateName,
            trigger: ['blur', 'change'],
          },
        ],
      },
      postMethod: '',
    };
  },
  mounted() {
    const that = this;
    if (that.id) {
      this.postMethod = 'put';
      that.$refs.formRef.getModelData();
    }
  },
  methods: {
    // 新增 编辑 计划 提交
    submitPlanForm() {
      let params = {};
      params.name = this.planModel.name;
      params.resource_id = this.planModel.resource_id;
      this.$refs.formRef.submit(params).then(() => {
        this.$emit('closeDialog', 'refresh');
      });
    },
    // 计划弹窗取消
    resetPlanForm() {
      this.$emit('closeDialog');
    },
  },
};
</script>
