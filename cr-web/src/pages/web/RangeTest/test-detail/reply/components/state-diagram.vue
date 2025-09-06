<template>
  <div class="com-wrapper icon-wrapper">
    <div class="icon-bg">
      <div class="icon-content">
        <cb-iconfont :type="iconfontType"></cb-iconfont>
      </div>
    </div>
    <div class="right-wrapper">
      <div class="number">{{ number }}</div>
      <div class="desc">
        {{ type }}
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'StateDiagram',
  props: {
    iconfontType: String,
    number: Number,
    type: String,
  },
};
</script>
<style lang="scss" scoped>
.icon-wrapper {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  text-align: center;
  padding-right: 8px;
  .icon-bg {
    width: 50px;
    height: 50px;
    border: 1px solid var(--primary-color-8);
    line-height: 50px;
    text-align: center;
    margin-right: 4px;
    .icon-content {
      background: var(--primary-color-8);
      width: 40px;
      height: 40px;
      margin: 4px auto;
    }
    .cb-iconfont {
      color: var(--white-color);
      font-size: 30px !important;
    }
  }
  .number {
    font-size: 18px;
    font-weight: bold;
    color: var(--neutral8);
  }
  .desc {
    color: var(--neutral8);
    font-size: 12px;
    font-family: Microsoft YaHei;
    font-weight: 400;
  }
}
</style>
