<template>
  <div class="empty_page">
    <div style="text-align: center">
      <cb-iconfont
        type="icon-zanwuziyuan"
        themedColor="font-color-primary"
        :size="80"
      ></cb-iconfont>
      <div class="no-data-text">{{ $t('personStatistics.noRanking') }}</div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {};
  },
  computed: {},
};
</script>
<style lang="scss" scoped>
.empty_page {
  width: 100%;
  height: 100%;
  display: flex;
  box-sizing: border-box;
  justify-content: center;
  align-items: center;
  .no-data-text {
    text-align: center;
    color: var(--neutral7);
  }
}
</style>
