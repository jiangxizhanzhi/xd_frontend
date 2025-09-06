<template>
  <div class="attack-event-list">
    <scroll-table
      :indexFlag="true"
      :data="listData"
      :cols="colsTraffic"
      :limitNum="3"
      @scrollEndEvent="getNewData"
    >
      <template v-slot:type="scope">
        <span :title="scope.data.attack_info.attack_type">{{
          scope.data.attack_info.attack_type
        }}</span>
      </template>
      <template v-slot:level="scope">
        <span :class="getLevel(scope.data)">
          <span
            v-if="level(scope.data) == '4'"
            :title="$t('systemOperation.monitorReplay.low')"
          >
            {{ $t('systemOperation.monitorReplay.low') }}
          </span>
          <span
            v-else-if="level(scope.data) == '3'"
            :title="$t('systemOperation.monitorReplay.middleLow')"
          >
            {{ $t('systemOperation.monitorReplay.low') }}
          </span>
          <span
            v-else-if="level(scope.data) == '2'"
            :title="$t('systemOperation.monitorReplay.middle')"
          >
            {{ $t('systemOperation.monitorReplay.middle') }}
          </span>
          <span
            v-else-if="level(scope.data) == '1'"
            :title="$t('systemOperation.monitorReplay.high')"
          >
            {{ $t('systemOperation.monitorReplay.high') }}
          </span>
          <span v-else>{{ $t('systemOperation.monitorReplay.none') }}</span>
        </span>
      </template>
    </scroll-table>
  </div>
</template>
<script>
import ScrollTable from '../../components/scroll-table.vue';
export default {
  props: {
    listData: {
      type: Array,
      default: () => [],
    },
  },
  components: {
    ScrollTable,
  },
  name: 'attackEventList',
  data() {
    return {
      colsTraffic: [
        {
          label: this.$t('systemOperation.trafficAnalysis.sourceHost'),
          prop: 'source_ip',
        },
        {
          label: this.$t('systemOperation.trafficAnalysis.destinationHost'),
          prop: 'target_ip',
        },
        {
          label: this.$t('systemOperation.trafficAnalysis.types'),
          prop: 'attack_type',
          slot: 'type',
        },
        {
          label: this.$t('systemOperation.trafficAnalysis.alarmLevel'),
          prop: 'severity',
          class: 'level',
          slot: 'level',
        },
        {
          label: this.$t('systemOperation.trafficAnalysis.times'),
          prop: 'time',
        },
      ],
    };
  },
  created() {},
  computed: {
    level(data) {
      return function (data) {
        const tmp = data.attack_info;
        if (tmp) {
          return tmp.severity;
        }
      };
    },
  },
  methods: {
    getNewData() {
      this.$emit('getNewData');
    },
    getLevel(row) {
      const classObj = {};
      const tmp = row.attack_info;
      if (tmp) {
        if (tmp.severity == '1') {
          classObj.high = true;
        } else if (tmp.severity == '2') {
          classObj.middle = true;
        } else if (tmp.severity == '3') {
          classObj.low = true;
        } else {
          classObj.low = true;
        }
        return classObj;
      }
    },
  },
};
</script>
<style scoped lang="scss" scoped>
.attack-event-list {
  height: calc(100% - 32px);
  padding-top: 10px;
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
