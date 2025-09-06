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
    sceneSummary: {
      Type: Object,
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
      subTitleText: this.$t('dashboard.sceneTotal'),
      titleShow: true,
      pieData: [],
      pieName: [
        this.$t('dashboard.trainScene'),
        this.$t('dashboard.vsScene'),
        this.$t('dashboard.ctScene'),
        this.$t('dashboard.otherScene'),
      ],
    };
  },
  created() {
    if (this.sceneSummary) {
      this.sceneData = this.sceneSummary;
    } else {
      this.sceneData = [];
    }
    let sceneDataBackup = _.cloneDeep(this.sceneData);

    sceneDataBackup = sceneDataBackup.map((item) => {
      return {
        type: item.reference_type,
        total: item.total,
        key: [
          120, 110, 121, 130, 140, 211, 213, 214, 301, 302, 303, 304, 305,
        ].includes(item.reference_type)
          ? this.getKey(item.reference_type)
          : 'other',
      };
    });
    const keyOj = {
      course: 0,
      redBlue: 0,
      contest: 0,
      other: 0,
    };
    const keyArr = ['course', 'redBlue', 'contest', 'other'];
    let _keys = sceneDataBackup.map((item) => item.key);
    keyArr.forEach((item, index) => {
      if (!_keys.some((key) => key === item)) {
        sceneDataBackup.push({
          total: 0,
          key: item,
        });
      }
    });
    sceneDataBackup.forEach((item) => {
      keyOj[item.key] += item.total;
    });
    let pieDataBakup = Object.values(keyOj);
    this.pieData = pieDataBakup;
    let total = this.pieData.reduce((prev, num) => {
      return prev + num;
    });
    this.titleText = total + '';
  },
  methods: {
    getKey(type) {
      let obj = {
        120: 'course',
        110: 'course',
        121: 'course',
        130: 'course',
        140: 'course',
        211: 'course',
        213: 'course',
        305: 'course', //理论赛是考试，算到训练里
        301: 'contest',
        302: 'contest',
        303: 'contest',
        304: 'contest',
        214: 'redBlue',
      };
      return obj[type];
    },
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
