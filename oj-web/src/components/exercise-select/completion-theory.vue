<template>
  <div
    class="completion-groups completion-groups-theory"
    style="margin-bottom: 16px"
  >
    <cb-form
      v-if="!isSolved"
      :disabled="isDisabled"
      :model="formData"
      ref="formData"
    >
      <cb-form-item
        v-for="(value, key, index) in formData"
        :rules="rules"
        :key="key"
        label=""
        :prop="key"
        :label-width="'0'"
      >
        <cb-input
          class="message-info elc-input"
          :disabled="isDisabled"
          type="text"
          v-model="formData[key]"
          show-word-limit
          @change="itemChange(arguments, key)"
          :placeholder="$t('practice.plzEnterAnswer')"
        ></cb-input>
      </cb-form-item>
    </cb-form>
    <div v-else class="answer-box">{{ answerData }}</div>
  </div>
</template>
<script>
import Validate from '@/utils/validate.js';
export default {
  name: 'completionTheory',
  props: {
    data: {
      type: Object,
      default: () => {},
    },
    // 是否已解出
    isSolved: {
      type: Boolean,
      default: false,
    },
    // 是否禁止答题
    isDisabled: {
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
    // 数据修改了，立马传给父组件
    changeTransfer: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      formData: {},
      debounceChange: undefined,
    };
  },

  computed: {
    rules() {
      let currentRule = {};
      const rule = [
        {
          required: true,
          message: this.$t('m.searchPlaceholder'),
          trigger: ['blur', 'change'],
        },
        {
          validator: Validate.checkCompletion,
          trigger: ['blur', 'change'],
        },
      ];
      this.isRule ? (currentRule = rule) : (currentRule = {});
      return currentRule;
    },
    answerData() {
      const answerList = Object.values(this.formData);
      return this.$t('m.examAnswer') + '：' + answerList.join('、');
    },
  },
  watch: {
    data: {
      handler(val, oldval) {
        this.formData = Object.assign({}, this.data);
      },
      immediate: true,
      deep: true,
    },
    formData: {
      handler(val, oldval) {
        if (this.changeTransfer) {
          this.$nextTick(() => {
            this.debounceChange();
          });
        }
      },
      immediate: true,
      deep: true,
    },
  },
  mounted() {
    this.debounceChange = _.debounce(() => {
      this.$emit(
        'sendCompletion',
        JSON.stringify(this.formData),
        this.exerciseId,
        3,
      );
    }, 500);
  },
  beforeDestroy() {
    this.debounceChange = undefined;
  },
  methods: {
    getIndex(index) {
      return `${++index}、`;
    },
    itemChange(val, key) {
      this.formData[key] = val[0];
      this.$emit(
        'sendCompletion',
        JSON.stringify(this.formData),
        this.exerciseId,
        3,
      );
    },
    validateCompletionAnswer() {
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
    resetCompletionAnswer() {
      if (this.$refs['formData'] !== undefined) {
        this.$refs['formData'].resetFields();
      }
    },
  },
};
</script>
<style lang="scss" scoped>
::v-deep .el-form {
  padding: 8px 0;
  .el-form-item.is-required:not(.is-no-asterisk) > .el-form-item__label:before {
    content: '';
  }
  .el-form-item {
    display: flex;
    margin-bottom: 20px;
    .el-form-item__label {
      padding: 0;
      width: 50px;
      text-align: left;
      font-size: 14px;
      font-family: Microsoft YaHei;
      font-weight: 400;
    }
    .el-input__inner {
      width: 520px;
      height: 40px;
      border-radius: 2px;
      // border: 0px;
      // color: rgba(237,242,255,1);
    }
    .el-form-item__content {
      margin-left: 3px !important;
    }
    .el-input__count .el-input__count-inner {
      background: transparent;
    }
  }
}
.completion-groups-theory {
  .answer-box {
    background: var(--neutral0);
    padding: 16px;
    width: 100%;
    font-size: 16px;
    color: var(--neutral8);
    line-height: 22px;
  }
}
</style>
