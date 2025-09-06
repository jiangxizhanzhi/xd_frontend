<template>
  <cb-form :model="formData" :rules="rules" ref="formData">
    <cb-form-item prop="mulAnswer">
      <cb-checkbox-group
        class="multiple-choice"
        v-model="formData.mulAnswer"
        @change="optionChange"
        direction="vertical"
        :disabled="isSolved"
      >
        <cb-checkbox v-for="item in data" :key="item.label" :label="item.label">
          <CbMarkdown v-model="item.name" type="viewer"></CbMarkdown>
        </cb-checkbox>
      </cb-checkbox-group>
    </cb-form-item>
  </cb-form>
</template>
<script>
export default {
  name: 'SearchInput',
  props: {
    data: {
      type: Array,
      default: () => [],
    },
    value: {
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
        mulAnswer: this.value,
      },
      rule: {
        mulAnswer: [
          {
            type: 'array',
            required: true,
            message: this.$t('m.exercise.chooseLessOne'),
            trigger: ['change'],
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
        this.formData.mulAnswer = val;
      },
      immediate: true,
      deep: true,
    },
  },
  methods: {
    optionChange(val) {
      this.formData.mulAnswer = val;
      this.$emit('sendMultiple', val.join('|'), this.exerciseId, 1);
    },
    validateMultipleAnswer() {
      let flag = null;
      if (this.$refs['formData'] !== undefined) {
        this.$refs['formData'].validate((valid) => {
          if (valid) {
            flag = true;
          } else {
            flag = false;
          }
        });
      }
      return flag;
    },
    resetMultipleAnswer() {
      if (this.$refs['formData'] !== undefined) {
        this.$refs['formData'].resetFields();
      }
    },
  },
};
</script>
<style lang="scss">
.cb-checkbox-group .el-checkbox {
  padding: 8px 0;
  .el-checkbox__label {
    position: relative;
  }
}
.el-form {
  padding: 0;
}
</style>
<style lang="scss" scoped>
.multiple-choice {
  word-break: break-word;
}
::v-deep .cb-checkbox-group .el-checkbox {
  display: flex;
  align-items: flex-start;
  .el-checkbox__label {
    height: auto;
    .cb-markdown .markdown-body,
    .cb-markdown .markdown-body p {
      margin: 0;
      padding: 0;
    }
  }
}
::v-deep .el-checkbox {
  white-space: normal;
}
</style>
