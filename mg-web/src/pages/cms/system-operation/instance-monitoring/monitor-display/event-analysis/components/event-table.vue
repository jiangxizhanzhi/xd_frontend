<template>
  <scroll-table
    class="calculate-div-中"
    :data="listData"
    :indexFlag="true"
    :cols="colsGather"
    :limitNum="3"
    @scrollEndEvent="getNewData"
  />
</template>

<script>
import ScrollTable from '../../components/scroll-table.vue';

export default {
  name: 'EventTable',
  props: {
    sceneId: {
      type: String,
      default: '',
    },
    listData: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      colsGather: [
        {
          label: this.$t('systemOperation.eventAnalysis.nodeName'),
          prop: 'node_name',
        },
        {
          label: this.$t('systemOperation.eventAnalysis.eventType'),
          prop: 'type',
        },
        {
          label: this.$t('systemOperation.eventAnalysis.eventDes'),
          prop: 'description',
        },
        {
          label: this.$t('systemOperation.eventAnalysis.times'),
          prop: 'time',
        },
      ],
    };
  },
  computed: {},
  created() {},
  mounted() {},
  watch: {},
  methods: {
    getNewData() {
      this.$emit('getNewData');
    },
  },
  components: { ScrollTable },
};
</script>

<style lang="scss" scoped>
.traffic-event-table {
  height: calc(100% - 32px);
  overflow: hidden;
  padding-top: 10px;
}
</style>
