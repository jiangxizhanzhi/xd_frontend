<template>
  <div class="blue-label">
    <div class="mark"></div>
    <div class="label">{{ label }}</div>
  </div>
</template>

<script>
export default {
  props: {
    label: {
      type: String,
      default() {
        return '';
      },
    },
  },
};
</script>

<style lang="scss">
.blue-label {
  & > .mark {
    background-color: var(--primary-color);
  }
  & > .label {
    color: var(--primary-color);
  }
}
</style>
<style scoped lang="scss">
.blue-label {
  display: flex;
  align-items: center;

  & > .mark {
    width: 6px;
    height: 8px;
    margin-right: 10px;
  }
  & > .label {
    font-size: 16px;
    font-family: Microsoft YaHei;
    font-weight: 400;
  }
}
</style>
