<template>
  <div class="elc-bg-title">
    <slot>
      {{ title }}
    </slot>
  </div>
</template>

<script>
export default {
  name: 'ElcBgTitle',
  props: {
    title: {
      type: String,
      default() {
        return '';
      },
    },
  },
};
</script>

<style lang="scss" scoped>
.elc-bg-title {
  line-height: 36px;
  background-color: #f6f7fb;
  padding: 0 10px;
}
</style>
