<template>
  <nightingale-circle :pieData="pieData" class="gather"></nightingale-circle>
</template>

<script>
import NightingaleCircle from '../../components/nightingale-circle.vue';
export default {
  name: 'EventTypeTop5',
  props: {
    pieData: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {};
  },
  computed: {},
  created() {},
  mounted() {},
  watch: {},
  methods: {},
  components: { NightingaleCircle },
};
</script>

<style lang="scss" scoped>
.gather {
  height: calc(100% - 32px);
}
</style>
