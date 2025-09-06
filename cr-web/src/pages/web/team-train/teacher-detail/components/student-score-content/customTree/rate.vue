<template lang="">
  <div class="block">
    <cb-rate @change="handleSelectChange" v-model="value" :max="5"></cb-rate>
  </div>
</template>

<script>
export default {
  props: {
    scoreData: {
      type: Number,
    },
  },
  data() {
    return {
      value: this.scoreData / 4,
    };
  },
  mounted() {},
  methods: {
    handleSelectChange(data) {
      // this.$emit('rateChange', data * 4);
      if (this.oldValue === 1 && data === 1) {
        this.$emit('rateChange', data * 0);
        this.value = 0;
      } else {
        this.$emit('rateChange', data * 4);
      }
    },
  },
  watch: {
    scoreData(newValue) {
      this.value = newValue / 4;
    },
    value(newValue) {
      this.oldValue = newValue;
    },
  },
};
</script>
<style lang="scss" scoped>
::v-deep.block {
  .el-rate {
    .el-icon-star-off {
      color: var(--neutral3) !important;
    }

    .el-icon-star-on {
      color: var(--primary-color) !important;
    }
  }
}
</style>
