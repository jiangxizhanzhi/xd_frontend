<template>
  <div class="get-event">
    <div class="get-event-wrap node-monitor-div">
      <scroll-table
        class="calculate-div-中"
        :data="listData"
        :cols="colsTraffic"
        :limitNum="6"
        @scrollEndEvent="getNewData"
      >
      </scroll-table>
    </div>
  </div>
</template>
<script>
import ScrollTable from '../../components/scroll-table.vue';
export default {
  props: {
    list: {
      type: Array,
      default: () => [],
    },
  },

  components: {
    ScrollTable,
  },
  name: 'getEvent',
  data() {
    return {
      colsTraffic: [
        {
          label: this.$t('systemOperation.nodeMonitoring.destinationHost'),
          prop: 'node_name',
        },
        {
          label: this.$t('systemOperation.nodeMonitoring.types'),
          prop: 'type',
        },

        {
          label: this.$t('systemOperation.nodeMonitoring.times'),
          prop: 'time',
        },
      ],
    };
  },
  computed: {
    listData() {
      return this.list;
    },
  },
  methods: {
    getNewData() {
      this.$emit('getNewData');
    },
  },
};
</script>
<style scoped lang="scss" scoped>
.get-event {
  height: calc(100% - 32px);
  padding-top: 10px;
}
</style>
