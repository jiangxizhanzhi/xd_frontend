<template>
  <div :class="['frosted-block', border ? 'corner-border' : '']">
    <slot></slot>
  </div>
</template>

<script>
export default {
  props: {
    border: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {};
  },
  computed: {},
  created() {},
  mounted() {},
  watch: {},
  methods: {},
  components: {},
};
</script>
<style lang="scss" scoped>
.frosted-block {
  $bgColor: var(--bg-color-3);
  width: 100%;
  height: 100%;
  background: $bgColor;
  position: relative;
  overflow: hidden;
  &.corner-border {
    $borderColor: var(--primary-color);
    background: linear-gradient(to left, $borderColor, $borderColor) left top
        no-repeat,
      linear-gradient(to bottom, $borderColor, $borderColor) left top no-repeat,
      linear-gradient(to left, $borderColor, $borderColor) right top no-repeat,
      linear-gradient(to bottom, $borderColor, $borderColor) right top no-repeat,
      linear-gradient(to left, $borderColor, $borderColor) left bottom no-repeat,
      linear-gradient(to bottom, $borderColor, $borderColor) left bottom
        no-repeat,
      linear-gradient(to left, $borderColor, $borderColor) right bottom
        no-repeat,
      linear-gradient(to left, $borderColor, $borderColor) right bottom
        no-repeat,
      $bgColor;
    background-size: 2px 20px, 20px 2px, 2px 20px, 20px 2px, 2px 20px, 20px 2px,
      2px 20px, 20px 2px, 100%;
  }
}
</style>
