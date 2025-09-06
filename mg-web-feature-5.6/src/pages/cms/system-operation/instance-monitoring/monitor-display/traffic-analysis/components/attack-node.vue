<template>
  <div class="attack-node">
    <attack-barchart
      :barData="barData"
      :color="'#FF5964'"
      :isRed="true"
    ></attack-barchart>
  </div>
</template>
<script>
import AttackBarchart from './attack-barchart.vue';
export default {
  name: 'attackNode',
  props: {
    barData: {
      type: Object,
      default: () => [],
    },
  },
  components: {
    AttackBarchart,
  },
  data() {
    return {};
  },
};
</script>
<style scoped lang="scss" scoped>
.attack-node {
  margin-bottom: 10px;
  height: calc(100% - 32px - 10px);
}
</style>
