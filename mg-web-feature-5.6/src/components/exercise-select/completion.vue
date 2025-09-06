<template>
  <div class="completion-groups" style="margin-bottom: 16px">
    <cb-form :disabled="isSolved" :model="formData" ref="formData">
      <cb-form-item
        v-for="(value, key, index) in formData"
        :rules="rules"
        :key="key"
        :label="getIndex(index)"
        :prop="key"
        :label-width="'20px'"
      >
        <cb-input
          class="message-info elc-input"
          :disabled="isSolved"
          type="text"
          v-model="formData[key]"
          show-word-limit
          @change="itemChange(arguments, key)"
        ></cb-input>
      </cb-form-item>
    </cb-form>
  </div>
</template>
<script>
import Validate from '@/utils/validate.js';
export default {
  props: {
    data: {
      type: Object,
      default: () => {},
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
      formData: {},
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
  },
  watch: {
    data: {
      handler(val, oldval) {
        this.formData = Object.assign({}, this.data);
      },
      immediate: true,
      deep: true,
    },
  },
  methods: {
    getIndex(index) {
      return `${++index}、`;
    },
    itemChange(val, key) {
      // console.log(val, '---------', key, 'ddddddddddddd');
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
</style>
