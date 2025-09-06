<template>
  <div class="form-error-cls">
    <transition name="el-zoom-in-top">
      <div class="el-form-item__error" v-if="error">
        {{ error }}
      </div>
    </transition>
  </div>
</template>
<script>
export default {
  props: {
    error: {
      type: String,
      default: '',
    },
  },
  data() {
    return {};
  },
};
</script>
<style lang="scss"></style>
