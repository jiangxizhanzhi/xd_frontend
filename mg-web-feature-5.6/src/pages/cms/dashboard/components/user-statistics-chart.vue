<template>
  <div style="width: 100%; height: 100%">
    <div class="pieContainDiv">
      <cb-echart-pie
        :titleText="titleText"
        :subTitleText="subTitleText"
        :gapShow="gapShow"
        :radius="radius"
        :pieData="pieData"
        :pieName="pieName"
        :legendLocation="legendLocation"
      ></cb-echart-pie>
    </div>
  </div>
</template>
<script>
export default {
  name: 'pie',
  props: {
    list: {
      Type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      sceneData: {},
      labelShow: false,
      double: true,
      gapShow: true,
      legendLocation: 'right',
      radius: ['65%', '85%'],
      titleText: '',
      subTitleText: this.$t('dashboard.totalUsers'),
      titleShow: true,
      pieData: [],
      pieName: [],
    };
  },
  created() {
    if (this.list) {
      let total = 0;
      _.forEach(this.list, (item) => {
        this.pieName.push(item.name);
        this.pieData.push(item.value);
        total += item.value;
      });
      this.titleText = total + '';
    }
  },
};
</script>
<style lang="scss" scoped>
.pieContainDiv {
  width: 95%;
  height: 100%;
  margin: 0 auto;
}
</style>
