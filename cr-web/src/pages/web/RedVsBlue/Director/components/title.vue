<template>
  <div class="common-title">
    <div class="common-square" :class="squareColor" />
    <div class="fl name-div">
      <span class="one-overflow" :title="name">{{ name }}</span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Title',
  props: {
    name: {
      type: String,
      default: '',
    },
    squareColor: {
      type: String,
      default: '',
    },
  },
};
</script>

<style scoped lang="scss">
.common-title {
  width: 100%;
  height: 25px;
  // line-height: 25px;
  position: relative;
  .common-square {
    width: 6px;
    height: 8px;
    // background:rgba(30,163,254,1);
    position: absolute;
    top: 6px;
    // transform: translateY(-50%);
  }
  .name-div {
    padding-left: 16px;
    font-size: 14px;
    font-family: Microsoft YaHei;
    font-weight: 400;
    text-align: left;
    width: 100%;
    span {
      display: inline-block;
      width: 100%;
    }
  }
}
</style>
