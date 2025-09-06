<template>
  <div class="resource-item">
    <div class="content">
      <div class="num">{{ value }}</div>
      <div class="name">{{ title }}</div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ResourceItem',
  props: {
    value: {
      type: Number,
      default: 0,
    },
    title: {
      type: String,
      default: '',
    },
  },
};
</script>

<style lang="scss" scoped>
.resource-item {
  width: auto;
  height: 112px;
  background-color: var(--neutral0);
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  .num {
    font-size: 24px;
  }
  .name {
    font-size: 14px;
  }
}
</style>
