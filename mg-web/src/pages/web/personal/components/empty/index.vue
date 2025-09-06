<template>
  <div class="cb-table-no-data">
    <div class="cb-table-no-data-icon">
      <cb-iconfont type="icon-zanwuziyuan" :size="56"></cb-iconfont>
      <div>{{ $t('personal.noData') }}</div>
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
<style lang="scss">
.cb-table-no-data {
  text-align: center;
  height: 80px;
  padding-top: 55px;
  box-sizing: border-box;
  color: var(--neutral7);
}
</style>
