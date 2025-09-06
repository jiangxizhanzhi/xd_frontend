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
    flex: 1;
    width: 0;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    height: 20px;
    .long-box {
      width: 60%;
      height: 4px;
      background: linear-gradient(to right, transparent, var(--neutral5));
      margin-right: 6px;
    }
    .short-box {
      width: 4px;
      height: 4px;
      background: var(--neutral5);
    }
  }
  .title-name {
    text-align: center;
    font-size: 14px;
    font-weight: 400;
    color: var(--neutral8);
    padding: 0 5px;
  }
  .right-wing {
    flex: 1;
    width: 0;
    display: flex;
    align-items: center;
    .long-box {
      width: 60%;
      height: 4px;
      background: linear-gradient(to left, transparent, var(--neutral5));
    }
    .short-box {
      width: 4px;
      height: 4px;
      background: var(--neutral5);
      margin-right: 6px;
    }
  }
}
</style>
