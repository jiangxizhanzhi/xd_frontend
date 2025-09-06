<template>
  <div class="bar-chart-container">
    <div class="switch">
      <tabs :tabs="tabs" @tabClick="tabClick"></tabs>
    </div>

    <bar-chart
      :isRed="true"
      :showTab="true"
      :barData="barData"
      :tabs="tabs"
    ></bar-chart>
  </div>
</template>

<script>
import BarChart from '../../components/bar-chart.vue';
import Tabs from '../../components/tabs.vue';

export default {
  name: 'NodeStatusTop5',
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
      tabName: ['cpu', 'memory', 'disk'],

      barDataAll: {
        cpu: [],
        disk: [],
        memory: [],
      },
      barData: {
        xData: [],
        yData: [],
      },
      timer: null,
    };
  },
  computed: {},
  created() {
    this.getCollectionEvent();
  },
  mounted() {
    this.timer = setInterval(() => {
      this.getCollectionEvent();
    }, 30000);
  },
  beforeDestroy() {
    clearInterval(this.timer);
  },
  watch: {},
  methods: {
    tabClick(i) {
      this.getDdata(this.tabName[i], this.barDataAll[this.tabName[i]]);
    },
    //节点状态Top5
    getCollectionEvent() {
      this.$request
        .get(
          `/cscene/monitor/scene/elements/top_by_states/${this.sceneId}`,
          {},
          { baseURL: '/api/mp' },
        )
        .then((res) => {
          const data = _.get(res, 'data.data', {});
          this.barDataAll.cpu = _.get(data, 'cpu', []);
          this.barDataAll.disk = _.get(data, 'disk', []);
          this.barDataAll.memory = _.get(data, 'memory', []);
          this.getDdata('cpu', this.barDataAll.cpu);
        });
    },
    getDdata(flag, arr) {
      const xData = [];
      const yData = [];
      arr.forEach((element) => {
        xData.push(element.name);
        yData.push(_.get(element, `host_state.${flag}_percent`) ?? 0);
      });
      this.barData.xData = xData.reverse();
      this.barData.yData = yData.reverse();
    },
  },
  components: { BarChart, Tabs },
};
</script>

<style lang="scss" scoped>
.bar-chart-container {
  height: calc(100% - 32px);

  .switch {
    padding-top: 10px;
  }
}
</style>
