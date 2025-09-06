<template>
  <div class="wing-title">
    <div class="title-name">{{ title }}</div>
  </div>
</template>
<script>
export default {
  props: {
    title: {
      type: String,
      default: '',
    },
  },
};
</script>
<style lang="scss" scoped>
.wing-title {
  width: 100%;
  height: 30px;
  display: flex;
  justify-content: flex-start;
  flex-direction: row;
  flex-wrap: nowrap;
  .title-name {
    // min-width: 90px;
    // max-width: 20%;
    text-align: center;
    line-height: 30px;
    font-size: 14px;
    font-weight: 400;
    color: var(--neutral8);
    padding: 0 5px;
    flex-basis: auto;
  }
}
</style>
