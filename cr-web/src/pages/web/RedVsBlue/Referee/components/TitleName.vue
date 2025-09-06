<template>
  <div class="host-title">
    <div class="fl common-square bg-color-sky-blue"></div>
    <div class="fl name-div color-white">
      <span>{{ name }}</span>
    </div>
  </div>
</template>
<script>
export default {
  name: 'HostTitle',
  props: {
    name: {
      type: String,
      default: '',
    },
  },
};
</script>
<style lang="scss" scoped>
.host-title {
  width: 100%;
  height: 42px;
  line-height: 42px;
  position: relative;
  font-size: 16px;
  padding-left: 20px;
  box-sizing: border-box;
  .common-square {
    width: 6px;
    height: 8px;
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
  }
  .name-div {
    padding-left: 16px;
  }
}
</style>
