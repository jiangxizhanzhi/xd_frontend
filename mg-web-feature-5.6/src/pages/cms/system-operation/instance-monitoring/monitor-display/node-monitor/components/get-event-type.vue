<template>
  <div class="get-event-type">
    <nightingale-circle
      v-if="pieData.length > 0"
      :pieData="pieData"
    ></nightingale-circle>
  </div>
</template>
<script>
import NightingaleCircle from '../../components/nightingale-circle.vue';

export default {
  components: {
    NightingaleCircle,
  },
  props: {
    eventTypeList: {
      type: Array,
      default: () => [],
    },
  },
  name: 'getEventType',
  data() {
    return {
      pieData: this.eventTypeList,
    };
  },
  watch: {
    eventTypeList: {
      handler(newVal, oldVal) {
        if (newVal) {
          this.pieData = newVal;
        }
      },
      immediate: true,
      deep: true,
    },
  },
};
</script>
<style scoped lang="scss" scoped>
.get-event-type {
  margin-top: 10px;
  width: 100%;
  height: calc(100% - 32px);
}
</style>
