<template>
  <div class="cyberpeace-textarea-container-flag">
    <cb-input
      :type="type"
      :rows="rows"
      :disabled="disabled"
      :placeholder="placeholder"
      v-model="valueComputed"
      show-word-limit="show-word-limit"
      @input="inputChange"
    ></cb-input>
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
      valueComputed: this.value,
    };
  },
  watch: {
    value: {
      handler(val, oldval) {
        this.valueComputed = val;
      },
      immediate: true,
      deep: true,
    },
  },
  methods: {
    inputChange(val1) {
      let val = val1;
      this.valueComputed = val;
      this.$emit('change', val);
    },
  },
};
</script>

<style scoped lang="scss">
.cyberpeace-textarea-container-flag {
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
