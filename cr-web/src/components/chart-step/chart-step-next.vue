<template>
  <div v-show="show" class="chart-step" @click="clicked">
    <img :src="nextImg" />
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
    len: {
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
      nextImg: require('@/assets/img/redVsBlue/director/arrow-right.png')
        .default,
    };
  },
  computed: {
    show() {
      const { len = 0, step, idx } = this;
      return step * (idx + 1) < len;
    },
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
