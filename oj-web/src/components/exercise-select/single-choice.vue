<template>
  <div class="elc-radio-group">
    <cb-form :model="formData" :rules="rules" ref="formData">
      <cb-form-item prop="singleAnswer">
        <cb-radio-group
          v-model="formData.singleAnswer"
          @change="radioChange"
          :disabled="isSolved"
          direction="vertical"
        >
          <cb-radio v-for="item in data" :key="item.label" :label="item.label">
            <CbMarkdown v-model="item.name" type="viewer"></CbMarkdown>
          </cb-radio>
        </cb-radio-group>
      </cb-form-item>
    </cb-form>
  </div>
</template>
<script>
export default {
  name: 'SearchInput',
  props: {
    value: {
      type: String,
      default: '',
    },
    data: {
      type: Array,
      default: () => [],
    },
    isSolved: {
      type: Boolean,
      default: false,
    },
    isRule: {
      type: Boolean,
      default: false,
    },
    exerciseId: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      formData: {
        singleAnswer: this.value,
      },
      rule: {
        singleAnswer: [
          {
            required: true,
            message: this.$t('m.exercise.chooseAnswer'),
            trigger: ['blur', 'change'],
          },
        ],
      },
    };
  },
  computed: {
    rules() {
      let currentRule = {};
      this.isRule ? (currentRule = this.rule) : (currentRule = {});
      return currentRule;
    },
  },
  watch: {
    value: {
      handler(val, oldval) {
        this.formData.singleAnswer = val;
      },
      immediate: true,
      deep: true,
    },
  },
  methods: {
    radioChange(val) {
      this.formData.singleAnswer = val;
      this.$emit('sendSingleChoice', val, this.exerciseId, 0);
    },
    validateSingleAnswer() {
      let flag = null;
      this.$refs['formData'].validate((valid) => {
        if (valid) {
          flag = true;
        } else {
          flag = false;
        }
      });
      return flag;
    },
    resetSingleAnswer() {
      if (this.$refs['formData'] !== undefined) {
        this.$refs['formData'].resetFields(); // 如果只是清除表单验证用   this.$refs[formName].clearValidate();
      }
    },
  },
};
</script>
<style lang="scss" scoped>
::v-deep .el-form {
  width: 100%;
  padding: 0;
}
::v-deep .el-radio-group {
  width: 100%;
}
::v-deep .el-radio {
  white-space: normal;
}
.elc-radio-group {
  display: flex;
  word-break: break-word;
  ::v-deep .el-radio {
    padding-top: 5px;
    display: flex;
    align-items: center;
  }
  ::v-deep .el-radio__input {
    position: relative;
    top: 1px;
  }
  ::v-deep .el-radio__label {
    height: auto;
    .cb-markdown .markdown-body,
    .cb-markdown .markdown-body p {
      margin: 0;
    }
    .cb-markdown {
      .markdown-body {
        padding: 0 !important;
      }
    }
  }
}
</style>
