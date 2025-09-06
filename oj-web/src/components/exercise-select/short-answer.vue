<template>
  <div class="short-answer">
    <cb-form
      :model="formData"
      :rules="rules"
      ref="formShortAnswer"
      :label-width="'65px'"
    >
      <cb-form-item prop="shortAnswer" :label="$t('m.examAnswer') + '：'">
        <cb-input
          type="textarea"
          class="message-info elc-input"
          :disabled="isSolved"
          v-model="formData.shortAnswer"
          :rows="5"
          @change="itemChange"
        ></cb-input>
      </cb-form-item>
    </cb-form>
  </div>
</template>
<script>
import Validate from '@/utils/validate.js';
export default {
  name: 'SearchInput',
  props: {
    value: {
      type: String,
      default: '',
    },
    data: {
      type: String,
      default: '',
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
    // 数据修改了，立马传给父组件
    changeTransfer: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      length: 200,
      formData: {
        shortAnswer: this.data,
      },
      rule: {
        shortAnswer: [
          {
            validator: Validate.checkShortAnswer,
            trigger: ['blur', 'change'],
          },
        ],
      },
      debounceChange: undefined,
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
        this.formData.shortAnswer = val;
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
        'sendShortAnswer',
        this.formData.shortAnswer,
        this.exerciseId,
        4,
      );
    }, 500);
  },
  beforeDestroy() {
    this.debounceChange = undefined;
  },
  methods: {
    itemChange(val) {
      this.formData.shortAnswer = val;
      this.$emit('sendShortAnswer', val, this.exerciseId, 4);
    },
    validateShortAnswer() {
      let flag = null;
      this.$refs['formShortAnswer'].validate((valid) => {
        if (valid) {
          flag = true;
        } else {
          flag = false;
        }
      });
      return flag;
    },
    resetShortAnswer() {
      if (this.$refs['formShortAnswer'] !== undefined) {
        this.$refs['formShortAnswer'].resetFields();
      }
    },
  },
};
</script>
<style lang="scss" scoped>
::v-deep .el-form {
  padding-right: 0 !important;
}
.short-answer {
  margin-top: 15px;
  max-width: calc(100% - 65px);
  ::v-deep .el-textarea {
    .el-form-item__content {
      width: 100%;
    }
  }
  .message-info {
    width: 100%;
  }
}
</style>
