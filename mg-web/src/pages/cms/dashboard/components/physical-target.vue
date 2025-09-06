<template>
  <div style="width: 100%; height: 100%">
    <div class="pieContainDiv">
      <cb-echart-pie
        :gapShow="gapShow"
        :radius="radius"
        :pieData="pieData"
        :pieName="pieName"
        :legendLocation="legendLocation"
        :titleText="titleText"
        :subTitleText="subTitleText"
      >
      </cb-echart-pie>
    </div>
  </div>
</template>
<script>
export default {
  name: 'pie',
  props: {
    physicalTarget: {
      Type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      textMap: {
        1: this.$t('dashboard.operateSystem'),
        2: this.$t('dashboard.application'),
        4: this.$t('dashboard.security'),
        3: this.$t('dashboard.network'),
      },
      textMapFlag: {
        1: false,
        2: false,
        4: false,
        3: false,
      },
      sceneData: {},
      gapShow: true,
      legendLocation: 'right',
      radius: ['65%', '85%'],
      titleText: '',
      subTitleText: this.$t('dashboard.PartialTarget'),
      pieData: [],
      pieName: [],
    };
  },
  created() {
    if (this.physicalTarget) {
      this.sceneData = this.physicalTarget;
    } else {
      this.sceneData = [];
    }
    let total = 0;
    for (let key in this.textMap) {
      if (key in this.sceneData) {
        this.pieName.push(this.textMap[key]);
        this.pieData.push(this.sceneData[key]);
        this.textMapFlag[key] = true;
        total += this.sceneData[key];
      }
    }

    for (let key in this.textMapFlag) {
      if (this.textMapFlag[key] == false) {
        this.pieName.push(this.textMap[key]);
        this.pieData.push(0);
      }
    }
    this.titleText = total + '';
  },
};
</script>
<style lang="scss" scoped>
.pieContainDiv {
  width: 90%;
  height: 100%;
  margin: 0 auto;
  box-sizing: border-box;
}
</style>
