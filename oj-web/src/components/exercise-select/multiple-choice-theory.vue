<template>
  <cb-form
    :model="formData"
    :rules="rules"
    ref="formData"
    class="multiple-choice-theory"
  >
    <cb-form-item prop="mulAnswer">
      <cb-checkbox-group
        class="multiple-choice"
        v-model="formData.mulAnswer"
        @change="optionChange"
        direction="vertical"
        :disabled="isSolved || (!isSolved && isDisabled)"
        v-if="reload"
      >
        <cb-checkbox
          v-for="item in data"
          :key="item.label"
          :label="item.label"
          :class="getClass(item)"
        >
          <div class="option-div">{{ item.label }}</div>
          <CbMarkdown v-model="item.name" type="viewer"></CbMarkdown>
        </cb-checkbox>
      </cb-checkbox-group>
    </cb-form-item>
  </cb-form>
</template>
<script>
export default {
  name: 'MultipleChoiceTheory',
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
    // 正确答案
    correctData: {
      type: String,
      default: '',
    },
    // 是否禁止答题
    isDisabled: {
      type: Boolean,
      default: false,
    },
    // 是否 组卷详情进来
    isGroupDetail: {
      type: Boolean,
      default: false,
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
      reload: true,
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
    correctData: {
      handler(val, oldval) {
        if (val) {
          this.reload = false;
          setTimeout(() => {
            this.reload = true;
          }, 50);
        }
      },
      immediate: true,
      deep: true,
    },
  },
  methods: {
    getClass(item) {
      const classObj = {};
      if (this.correctData.indexOf(item.label) !== -1 && this.isSolved) {
        classObj['correct-multiple'] = true;
      }
      if (
        this.isGroupDetail &&
        !this.isSolved &&
        this.formData.mulAnswer &&
        this.formData.mulAnswer.indexOf(item.label) > 0
      ) {
        classObj['wrong-multiple'] = true;
      }
      return classObj;
    },
    getCorrect(item) {
      return this.correctData.indexOf(item.label) !== -1 && this.isSolved;
    },
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
.multiple-choice-theory {
  .cb-checkbox-group .el-checkbox {
    .el-checkbox__label {
      position: relative;
    }
  }
  .cb-markdown {
    padding: 4px 0 5px 0;
  }
}
.el-form {
  padding: 0;
}
.multiple-choice-theory {
  .option-div {
    position: absolute;
    top: 1px;
    left: -31.5px;
    font-size: 16px;
    z-index: 1;
    width: 32px;
    height: 32px;
    text-align: center;
    line-height: 32px;
    border-radius: 4px;
  }
  .el-checkbox {
    padding: 8px;
    &:hover {
      background: var(--neutral0);
      border-radius: 4px;
    }
  }
  .el-checkbox.is-disabled:hover {
    background: transparent;
  }
  .el-checkbox .el-checkbox__input {
    width: 32px;
    height: 32px;
    flex-basis: 32px;
    border-radius: 4px;
    position: relative;
    z-index: 2;
  }
  .el-checkbox .el-checkbox__input .el-checkbox__inner::after {
    display: none;
  }
  .el-checkbox .el-checkbox__input .el-checkbox__inner {
    border-radius: 4px;
  }
  .el-checkbox .el-checkbox__input.is-checked .el-checkbox__inner {
    border: 1px solid transparent;
    background: transparent;
  }
  .el-checkbox .el-checkbox__input.is-checked + .el-checkbox__label {
    .option-div {
      color: var(--white-color) !important;
      background: var(--primary-color);
    }
  }
  .correct-multiple {
    .option-div {
      background: var(--green-color-8) !important;
    }
  }
  // 组卷详情-错误选项样式
  .wrong-multiple {
    .option-div {
      background: var(--red-color) !important;
    }
  }
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
    .cb-markdown {
      p {
        line-height: 24px;
      }
    }
  }
}
::v-deep .el-checkbox {
  white-space: normal;
}
</style>
