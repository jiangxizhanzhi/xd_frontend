<template>
  <div class="bar-chart-container">
    <div class="choose">
      <tabs :tabs="tabs" @tabClick="tabClick"></tabs>
    </div>

    <bar-chart
      :isRed="false"
      :showTab="true"
      :barData="barData"
      :tabs="tabs"
    ></bar-chart>
  </div>
</template>

<script>
import BarChart from '../../components/bar-charts.vue';
import Tabs from '../../components/tabs.vue';

export default {
  name: 'EventTypeTop5',
  props: {
    tabs: {
      type: Array,
      default: () => [],
    },
    sceneId: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      barData: {
        xData: [],
        yData: [],
      },
      timer: null,
    };
  },
  computed: {},
  created() {
    this.getCollectionEventTop5(0);
  },
  mounted() {
    this.timer = setInterval(() => {
      this.getCollectionEventTop5(0);
    }, 30000);
  },
  watch: {},
  beforeDestroy() {
    clearInterval(this.timer);
  },
  methods: {
    tabClick(i) {
      this.getCollectionEventTop5(i);
    },
    //采集事件类型top5
    getCollectionEventTop5(type) {
      this.barData.xData = [];
      this.barData.yData = [];
      const xData = [];
      const yData = [];
      this.$request
        .get(
          `/cscene/monitor/event/aggr_top`,
          {
            sceneId: this.sceneId,
            type: type,
          },
          { baseURL: '/api/mp' },
        )
        .then((res) => {
          const data = _.get(res, 'data.data', []);
          data.forEach((element) => {
            xData.push(element.element_name);
            yData.push(element.sum);
          });
          this.barData.xData = xData.reverse();
          this.barData.yData = yData.reverse();
        });

      const data = [
        {
          element_id: '',
          element_name: 'nihao',
          percent: 90,
          sum: 0,
          type: 0,
        },
        {
          element_id: '',
          element_name: '',
          percent: 0,
          sum: 0,
          type: 0,
        },
        {
          element_id: '',
          element_name: 'hehe',
          percent: 5,
          sum: 0,
          type: 0,
        },
      ];
    },
  },
  components: { BarChart, Tabs },
};
</script>

<style lang="scss" scoped>
.bar-chart-container {
  height: calc(100% - 32px);
  .choose {
    padding-top: 10px;
  }
}
</style>
