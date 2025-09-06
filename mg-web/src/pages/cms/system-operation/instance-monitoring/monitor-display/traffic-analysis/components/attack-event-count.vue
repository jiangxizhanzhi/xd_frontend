<template>
  <div class="attack-event-count">
    <round-census
      :normalNum="(trafficLevelCount && trafficLevelCount.low_count) || 0"
      :warnNum="(trafficLevelCount && trafficLevelCount.medium_count) || 0"
      :dangerNum="(trafficLevelCount && trafficLevelCount.high_count) || 0"
    ></round-census>
  </div>
</template>
<script>
import RoundCensus from '../../components/round-census.vue';
export default {
  props: {
    trafficLevelCount: {
      type: Object,
      default: () => {},
    },
  },
  components: {
    RoundCensus,
  },
  name: 'attackEventCount',
  data() {
    return {};
  },
  methods: {},
};
</script>
<style scoped lang="scss" scoped>
.attack-event-count {
  margin-bottom: 4px;
  height: calc(100% - 38px);
}
</style>
