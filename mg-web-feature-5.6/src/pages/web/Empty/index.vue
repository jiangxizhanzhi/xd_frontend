<template>
  <div class="empty_page">
    <div class="not-data">
      <cb-iconfont :size="'70'" type="icon-zanwuziyuan"></cb-iconfont>
      <div class="text-data">{{ $t('personal.noData') }}</div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      // aa: {
      //   name: 'zs',
      //   age: 18,
      // },
    };
  },
  // computed: {
  //   language() {
  //     return this.$store.getters.language
  //   },
  // },
};
</script>
<style lang="scss">
.empty_page {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  position: relative;
  .not-data {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    text-align: center;
  }
  .text-data {
    text-align: center;
    font-size: 16px;
    font-weight: 400;
  }
  // .no-data:after{
  //   content: '暂无数据';

  // }
}
</style>
