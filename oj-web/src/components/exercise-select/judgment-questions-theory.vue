<template>
  <div class="elc-radio-group judgment-questions-theory">
    <cb-form :model="formData" :rules="rules" ref="formData">
      <cb-form-item prop="judgmentAnswer">
        <cb-radio-group
          v-model="formData.judgmentAnswer"
          @change="radioChange"
          :disabled="isSolved || (!isSolved && isDisabled)"
          direction="vertical"
          v-if="reload"
        >
          <cb-radio
            v-for="item in data"
            :key="item.label"
            :label="item.label"
            :class="{
              'correct-radio': isSolved && item.label === correctData,
              'wrong-radio':
                isGroupDetail &&
                !isSolved &&
                item.label === formData.judgmentAnswer,
            }"
          >
            <div class="option-div">{{ item.label }}</div>
            {{ item.name }}
          </cb-radio>
        </cb-radio-group>
      </cb-form-item>
    </cb-form>
  </div>
</template>
<script>
export default {
  name: 'JudgmentQuestionsTheory',
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
    // 是否 组卷详情进来  记录错误 样式
    isGroupDetail: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      formData: {
        judgmentAnswer: this.value,
      },
      rule: {
        judgmentAnswer: [
          {
            required: true,
            message: this.$t('m.exercise.chooseAnswer'),
            trigger: ['blur', 'change'],
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
        this.formData.judgmentAnswer = val;
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
    radioChange(val) {
      this.formData.judgmentAnswer = val;
      this.$emit('sendJudgment', val, this.exerciseId, 2);
    },
    validateJudgmentAnswer() {
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
    resetJudgmentAnswer() {
      if (this.$refs['formData'] !== undefined) {
        this.$refs['formData'].resetFields();
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.elc-radio-group {
  ::v-deep .el-form {
    padding: 0;
    width: 100%;
    ::v-deep .el-radio-group {
      width: 100%;
    }
    .cb-radio-group {
      // display: flex;
      .el-radio {
        display: block;
        // padding-top: 5px;
      }
    }
  }
}
</style>
<style lang="scss">
.judgment-questions-theory {
  .el-radio__inner {
    width: 32px;
    height: 32px;
    position: relative;
    z-index: 2;
    border-radius: 50%;
  }
  .option-div {
    position: absolute;
    top: 8.6px;
    left: 8.6px;
    font-size: 16px;
    z-index: 1;
    width: 32px;
    height: 32px;
    text-align: center;
    line-height: 32px;
    border-radius: 50%;
  }
  .el-radio {
    padding: 8px;
  }
  .el-radio:hover {
    background: var(--neutral0);
    border-radius: 4px;
  }
  .el-radio.is-disabled:hover {
    background: transparent;
  }
  .el-radio.is-checked .el-radio__input.is-checked .el-radio__inner:after {
    display: none;
  }

  .el-radio__input:hover + .el-radio__label {
    .option-div {
      color: var(--primary-color);
    }
  }

  .el-radio.is-disabled {
    .option-div {
      // color: var(--neutral8) !important;
      cursor: not-allowed;
    }
  }
  .is-checked {
    .option-div {
      color: var(--white-color) !important;
      background: var(--primary-color);
    }
    .el-radio__input:hover + .el-radio__label {
      .option-div {
        color: var(--white-color) !important;
      }
    }
  }
  .el-radio .el-radio__input.is-disabled.is-checked .el-radio__inner {
    border-color: transparent !important;
  }
  // 正确选项样式
  .correct-radio {
    .option-div {
      background: var(--green-color-8);
    }
  }
  // 组卷详情-错误选项样式
  .wrong-radio {
    .option-div {
      background: var(--red-color);
    }
  }
  .el-radio__label {
    font-size: 16px;
  }

  .el-radio__input.is-disabled + span.el-radio__label {
    color: var(--neutral8) !important;
  }
  .el-radio.is-disabled .option-div {
    color: var(--neutral4) !important;
  }
  .el-radio.correct-radio .option-div,
  .el-radio.wrong-radio .option-div {
    color: var(--white-color) !important;
  }
}
</style>
