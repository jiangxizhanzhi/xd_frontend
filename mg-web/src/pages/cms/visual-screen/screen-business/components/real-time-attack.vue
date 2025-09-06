<template>
  <div class="real-time-wrapper">
    <div
      class="real-time-wrapper-item"
      v-for="(item, index) in data"
      :key="'real-time-wrapper-item' + index"
    >
      {{ item }}
    </div>
  </div>
</template>

<script>
export default {
  props: {
    data: {
      type: Array,
      default: () => [0, 0, 0, 0, 0, 0],
    },
  },
  data() {
    return {};
  },
};
</script>

<style lang="scss" scoped>
.real-time-wrapper {
  height: 100%;
  display: flex;
  justify-content: space-around;
  align-items: center;
  .real-time-wrapper-item {
    width: 42px;
    height: 70px;
    margin-right: 6px;
    background: url('~@/assets/img/screen/gongji.png') no-repeat;
    background-size: 100% 100%;
    font-size: 32px;
    font-family: OPPOSans !important;
    font-weight: normal;
    color: #ffffff;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
</style>
