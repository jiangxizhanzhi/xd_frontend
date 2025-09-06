<template>
  <div class="nightingale-container">
    <nightingale-circle :pieData="pieData"></nightingale-circle>
  </div>
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
.nightingale-container {
  margin-top: 10px;
  box-sizing: content-box;
  width: 100%;
  height: calc(100% - 32px - 10px);
}
</style>
