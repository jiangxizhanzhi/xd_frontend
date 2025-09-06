<template>
  <div class="by-attack-node">
    <attack-barchart :barData="barData" :color="'#FF5964'"></attack-barchart>
  </div>
</template>
<script>
import AttackBarchart from './attack-barchart.vue';
export default {
  name: 'byAttackNode',
  components: {
    AttackBarchart,
  },
  props: {
    barData: {
      type: Object,
      default: () => [],
    },
  },
  data() {
    return {};
  },
  methods: {},
};
</script>
<style scoped lang="scss" scoped>
.by-attack-node {
  margin-bottom: 10px;
  height: calc(100% - 32px - 10px);
}
</style>
