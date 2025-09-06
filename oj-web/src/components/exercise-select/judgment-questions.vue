<template>
  <div class="elc-radio-group">
    <cb-form :model="formData" :rules="rules" ref="formData">
      <cb-form-item prop="judgmentAnswer">
        <cb-radio-group
          v-model="formData.judgmentAnswer"
          @change="radioChange"
          :disabled="isSolved"
          direction="vertical"
        >
          <cb-radio
            v-for="item in data"
            :key="item.label"
            :label="item.label"
            >{{ item.name }}</cb-radio
          >
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
/* @import '@cyber/ui/lib/style/themify'; */
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
        padding-top: 5px;
      }
    }
  }
}
</style>
