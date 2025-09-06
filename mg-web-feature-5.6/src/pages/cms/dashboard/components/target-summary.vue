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
    targetSummary: {
      Type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      textMap: {
        vm: this.$t('dashboard.vmTarget'),
        entity: this.$t('dashboard.physicalTarget'),
        container: this.$t('dashboard.containerTarget'),
        other: this.$t('dashboard.npcTarget'),
      },
      textMapFlag: {
        vm: false,
        entity: false,
        container: false,
        other: false,
      },

      sceneData: {},
      labelShow: false,
      double: true,
      gapShow: true,
      legendLocation: 'right',
      radius: ['65%', '85%'],
      titleText: '',
      subTitleText: this.$t('dashboard.targetCount'),
      titleShow: true,
      pieData: [],
      pieName: [],
    };
  },
  created() {
    if (this.targetSummary) {
      this.sceneData = this.targetSummary;
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
  width: 95%;
  height: 100%;
  margin: 0 auto;
}
</style>
