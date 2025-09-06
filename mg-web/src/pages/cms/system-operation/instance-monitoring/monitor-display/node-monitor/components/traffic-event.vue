<template>
  <div class="traffic-event">
    <div class="get-event-wrap traffic-event-div">
      <scroll-table
        class="calculate-div-中"
        :data="listData"
        :cols="colsTraffic"
        :limitNum="6"
        @scrollEndEvent="getNewData"
      >
        <template v-slot:type="scope">
          <span>{{ scope.data.attack_info.attack_type }}</span>
        </template>
        <template v-slot:level="scope">
          <span :class="getLevel(scope.data)">
            {{ getLevelLabel(scope.data) }}
          </span>
        </template>
      </scroll-table>
    </div>
  </div>
</template>
<script>
import ScrollTable from '../../components/scroll-table.vue';
export default {
  components: {
    ScrollTable,
  },
  props: {
    list: {
      type: Array,
      default: () => [],
    },
  },
  name: 'trafficEvent',
  data() {
    const that = this;
    return {
      listData: this.list,
      colsTraffic: [
        {
          label: this.$t('systemOperation.nodeMonitoring.sourceHost'),
          prop: 'source_ip',
        },
        {
          label: this.$t('systemOperation.nodeMonitoring.destinationHost'),
          prop: 'target_ip',
        },
        {
          label: this.$t('systemOperation.nodeMonitoring.types'),
          slot: 'type',
        },
        {
          label: this.$t('systemOperation.nodeMonitoring.alarmLevel'),
          class: 'level',
          slot: 'level',
        },
        {
          label: this.$t('systemOperation.nodeMonitoring.times'),
          prop: 'time',
        },
      ],
    };
  },
  watch: {
    list: {
      handler(nv, ov) {
        this.listData = nv;
      },
      immediate: true,
      deep: true,
    },
  },
  methods: {
    getNewData() {
      this.$emit('getNewData');
    },
    getLevel(row) {
      const classObj = {};
      if (row.attack_info && row.attack_info.severity === 1) {
        classObj.high = true;
      } else if (row.attack_info && row.attack_info.severity === 2) {
        classObj.middle = true;
      } else if (
        (row.attack_info && row.attack_info.severity === 4) ||
        (row.attack_info && row.attack_info.severity === 3)
      ) {
        classObj.low = true;
      }
      return classObj;
    },
    getLevelLabel(row) {
      let levelLabel = '';
      if (row.attack_info && row.attack_info.severity === 1) {
        levelLabel = this.$t('systemOperation.nodeMonitoring.high');
      } else if (row.attack_info && row.attack_info.severity === 2) {
        levelLabel = this.$t('systemOperation.nodeMonitoring.middle');
      } else if (
        (row.attack_info && row.attack_info.severity === 4) ||
        (row.attack_info && row.attack_info.severity === 3)
      ) {
        levelLabel = this.$t('systemOperation.nodeMonitoring.low');
      }
      return levelLabel;
    },
  },
};
</script>
<style scoped lang="scss" scoped>
.traffic-event {
  padding: 10px 0px;
  .high {
    color: rgba(253, 58, 44, 1);
  }
  .middle {
    color: rgba(253, 118, 44, 1);
  }
  .low {
    color: rgba(57, 255, 178, 1);
  }
}
</style>
