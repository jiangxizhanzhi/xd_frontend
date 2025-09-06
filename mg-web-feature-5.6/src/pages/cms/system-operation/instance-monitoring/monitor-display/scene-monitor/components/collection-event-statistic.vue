<template>
  <div class="collection">
    <div class="collection-top">
      <bar-chart :barData="barData"></bar-chart>
    </div>
    <div class="collection-bottom">
      <nightingale :pieData="pieData"></nightingale>
    </div>
  </div>
</template>

<script>
import BarChart from '../../components/bar-chart.vue';
import nightingale from '../../components/nightingale.vue';
export default {
  props: {
    barData: {
      type: Object,
      default() {
        return {};
      },
    },
    twoData: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  data() {
    return {
      // barData: {
      //   xData: ['节点1', '节点2', '节点3', '节点4', '节点5'],
      //   yData: [25, 37, 48, 80, 88],
      // },

      pieData: [
        {
          value: 0,
          name: this.$t('systemOperation.monitorScene.process'),
          key: 'process',
        },
        {
          value: 0,
          name: this.$t('systemOperation.monitorScene.file'),
          key: 'file',
        },
        {
          value: 0,
          name: this.$t('systemOperation.monitorScene.port'),
          key: 'port',
        },
        {
          value: 0,
          name: this.$t('systemOperation.monitorScene.networkConnection'),
          key: 'network',
        },
        {
          value: 0,
          name: this.$t('systemOperation.monitorScene.users'),
          key: 'user',
        },
      ],
    };
  },
  computed: {},
  components: {
    BarChart,
    nightingale,
  },
  watch: {
    twoData: {
      handler: function (val) {
        if (val) {
          Object.keys(val).map((key) => {
            this.pieData.map((item) => {
              if (item.key === key) {
                item.value = val[key];
              }
            });
          });
        }
      },
      deep: true,
    },
  },
};
</script>

<style lang="scss" scoped>
.collection {
  height: calc(100% - 32px);
  .collection-top {
    height: 50%;
  }
  .collection-bottom {
    height: 50%;
  }
}
</style>
