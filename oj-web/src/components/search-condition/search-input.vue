<template>
  <div class="search-wrapper-box">
    <cb-input
      v-model="sceneName"
      class="search-input"
      :size="size"
      :placeholder="placeholderName"
      @change="handleInput"
      @input="handleInput"
    >
      <i slot="suffix" class="el-input__icon el-icon-search search-icon" />
    </cb-input>
  </div>
</template>
<script>
import debounce from '@/utils/debounce.js';

export default {
  name: 'SearchInput',
  model: {
    prop: 'value',
    event: 'search',
  },
  props: {
    placeholderName: {
      type: String,
      default: '',
    },
    size: {
      type: String,
      default: 'mini',
    },
    value: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      sceneName: this.value,
    };
  },

  watch: {
    value(nv) {
      this.sceneName = nv;
    },
  },
  methods: {
    handleInput(val) {
      debounce(() => {
        this.$emit('search', this.sceneName);
        // 兼容之前的写法
        this.$emit('sendSearchName', this.sceneName);
      }, 500);
    },
  },
};
</script>
<style lang="scss" scoped>
.el-input--mini .el-input__inner {
  border-radius: 15px;
  height: 30px;
  line-height: 30px;
}
</style>
