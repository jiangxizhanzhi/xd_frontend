<template>
  <div class="cyberpeace-textarea-container">
    <cb-input
      :type="type"
      :rows="rows"
      :disabled="disabled"
      :placeholder="placeholder"
      v-model="valueComputed"
      show-word-limit="show-word-limit"
      @input="inputChange"
    ></cb-input
    ><span v-if="length" class="tips">{{ count }}/{{ length }}</span>
  </div>
</template>

<script>
// import CommonUtil from '../../utils/utils.js'
export default {
  props: {
    type: {
      type: String,
      default: 'textarea',
    },
    length: {
      type: Number,
      default() {
        return 0;
      },
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    placeholder: {
      type: String,
      default() {
        return null;
      },
    },
    rows: {
      type: Number,
      default() {
        return 3;
      },
    },
    value: {
      type: String,
      default() {
        return '';
      },
    },
  },
  data() {
    return {
      count: this.getByteLen(this.value),
      valueComputed: this.value,
    };
  },
  watch: {
    value: {
      handler(val, oldval) {
        this.valueComputed = val;
        this.count = this.getByteLen(val);
      },
      immediate: true,
      deep: true,
    },
  },
  methods: {
    inputChange(val1) {
      let val = val1;
      var l = this.getByteLen(val) >= 0 && this.getByteLen(val) <= this.length;
      if (!l) {
        val = this.countCharacters(val, this.length);
      }
      this.count = this.getByteLen(val);
      this.valueComputed = val;
      this.$emit('change', val);
    },
    getByteLen(str) {
      let len = 0;
      for (let i = 0; i < str.length; i++) {
        const a = str.charAt(i);
        if (a.match(/[^\x00-\xff]/gi) != null) {
          len += 1;
        } else {
          len += 1;
        }
      }
      return len;
    },
    countCharacters(str, size) {
      var totalCount = 0;
      var newStr = '';
      for (var i = 0; i < str.length; i++) {
        const a = str.charAt(i);
        if (a.match(/[^\x00-\xff]/gi) != null) {
          totalCount += 1;
        } else {
          totalCount += 1;
        }
        if (totalCount <= size) {
          newStr = str.substring(0, i + 1);
        } else {
          return newStr;
        }
      }
      return newStr;
    },
  },
};
</script>

<style scoped lang="scss">
.cyberpeace-textarea-container {
  position: relative;
  & > .tips {
    position: absolute;
    line-height: 20px;
    bottom: 10px;
    right: 20px;
    color: #909399;
  }
}
</style>
<style lang="scss">
.cyberpeace-textarea-container {
  .el-input__inner {
    padding-right: 75px !important;
    // background: #293651 !important
  }
}
</style>
