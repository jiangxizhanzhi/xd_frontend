<template>
  <div class="verify">
    <span class="circle" :class="className"></span>
    <span>{{ verifyName }}</span>
  </div>
</template>

<script>
export default {
  props: {
    is_verify: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    className() {
      return this.is_verify ? 'success-color' : 'danger-color';
    },
    verifyName() {
      return this.is_verify
        ? this.$t('higherInfo.verified')
        : this.$t('higherInfo.verify');
    },
  },
};
</script>

<style lang="scss" scoped>
.verify {
  display: flex;
  align-items: center;
  .circle {
    height: 8px;
    width: 8px;
    border-radius: 50%;
    margin-right: 8px;
    margin-top: 1px;
  }
  .danger-color {
    background-color: var(--red-color);
  }
  .success-color {
    background-color: var(--green-color);
  }
}
</style>
