<template>
  <div class="outer">
    <div class="inner">
      <div class="top-line">
        <span>{{ $t('course.uncorrected') }}</span>
      </div>
    </div>
  </div>
</template>
<script>
export default {};
</script>
<style lang="scss" scoped>
.outer {
  width: 84px;
  height: 84px;
  border: 6px solid var(--orange-color);
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  .inner {
    width: 65px;
    height: 65px;
    border: 2px solid var(--orange-color);
    border-radius: 50%;
    position: relative;
  }
  .top-line {
    width: 28px;
    padding: 0 6px;
    border-top: 1px solid var(--orange-color);
    border-bottom: 1px solid var(--orange-color);
    color: var(--orange-color);
    position: absolute;
    top: 32%;
    left: 28%;
    transform: rotate(332deg);
    white-space: nowrap;
    font-size: 13px;
    height: 26px;
    line-height: 26px;
    span {
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
    }
  }
}
</style>
