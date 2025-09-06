<template>
  <div class="cb-block">
    <div class="cb-block-title-container">
      <div class="cb-block-left-border"></div>
      <div v-if="title" class="cb-block-title">{{ title }}</div>
      <div class="cb-block-suffix-slot">
        <slot name="suffix"></slot>
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
  },
};
</script>

<style lang="scss" scoped>
.cb-block {
  &-title-container {
    display: flex;
    align-items: center;
    margin-bottom: 20px;
  }
  &-left-border {
    width: 6px;
    height: 8px;
    background: var(--primary-color);
  }
  &-title {
    font-size: 16px;
    padding-left: 8px;
    color: var(--neutral8);
    font-weight: bold;
  }
  &-suffix-slot {
    margin-left: auto;
  }
}
</style>
