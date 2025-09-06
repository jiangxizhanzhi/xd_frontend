<template>
  <div class="elc-left-border-title">
    <slot>
      {{ title }}
    </slot>
  </div>
</template>

<script>
export default {
  name: 'ElcLeftBorderTitle',
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
.elc-left-border-title {
  line-height: 36px;
  font-weight: bold;
  &:before {
    content: ' ';
    display: inline-block;
    vertical-align: sub;
    margin-right: 6px;
    width: 2px;
    height: 20px;
    background-color: #000000;
  }
}
</style>
