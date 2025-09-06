<template>
  <div v-show="idx > 0" class="chart-step" @click="clicked">
    <img :src="preImg" />
  </div>
</template>
<script>
export default {
  props: {
    idx: {
      type: Number,
      default() {
        return 0;
      },
    },
    step: {
      type: Number,
      default() {
        return 10;
      },
    },
  },
  data() {
    return {
      preImg: require('@/assets/img/redVsBlue/director/arrow-left.png').default,
    };
  },
  methods: {
    clicked() {
      this.$emit('click');
    },
  },
};
</script>

<style scoped lang="scss">
.chart-step {
  position: absolute;
}
</style>
