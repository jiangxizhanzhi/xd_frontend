<template>
  <div class="cb-block">
    <div class="cb-block-title-container">
      <div class="cb-block-left-border"></div>
      <div
        v-if="title"
        class="cb-block-title"
        :style="{
          fontSize: fontSize + 'px',
        }"
      >
        {{ title }}
      </div>
    </div>
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'index',
  props: {
    title: {
      type: String,
    },
    fontSize: {
      type: [String, Number],
      default: 16,
    },
  },
};
</script>

<style lang="scss" scoped>
.cb-block {
  &-left-border {
    background: var(--primary-color);
  }
  &-title {
    color: var(--neutral8);
  }
}

.cb-block {
  &-title-container {
    display: flex;
    align-items: center;
    margin-bottom: 20px;
  }
  &-left-border {
    width: 6px;
    height: 8px;
  }
  &-title {
    padding-left: 8px;
    font-weight: bold;
  }
}
</style>
