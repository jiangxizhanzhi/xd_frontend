<template>
  <div class="wing-title">
    <div class="left-wing">
      <div class="long-box"></div>
      <div class="short-box"></div>
    </div>
    <div class="title-name">{{ title }}</div>
    <div class="right-wing">
      <div class="short-box"></div>
      <div class="long-box"></div>
    </div>
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
  display: flex;
  justify-content: center;
  .left-wing {
    width: calc(50% - 45px);
    display: flex;
    justify-content: flex-end;
    align-items: center;
    height: 20px;
    .long-box {
      width: 60%;
      height: 4px;
      background: linear-gradient(to right, transparent, var(--bg-color-sixth));

      margin-right: 6px;
    }
    .short-box {
      width: 4px;
      height: 4px;
      background: var(--bg-color-sixth);
    }
  }
  .title-name {
    width: 90px;
    text-align: center;
    font-size: 14px;
    font-weight: 400;
    color: var(--font-color-primary);
  }
  .right-wing {
    width: calc(50% - 45px);
    display: flex;
    justify-content: flex-start;
    align-items: center;
    .long-box {
      width: 60%;
      height: 4px;
      background: linear-gradient(to left, transparent, var(--bg-color-sixth));
    }
    .short-box {
      width: 4px;
      height: 4px;
      background: var(--bg-color-sixth);
      margin-right: 6px;
    }
  }
}
</style>
