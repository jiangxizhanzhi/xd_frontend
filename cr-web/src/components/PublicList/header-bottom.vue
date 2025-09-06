<template>
  <div class="header-bottom">
    <div class="header-bottom-left"></div>
    <div class="header-bottom-middle">
      <div class="header-bottom-middle-1"></div>
      <div class="header-bottom-middle-1-bg"></div>
      <div class="header-bottom-middle-2"></div>
      <div class="header-bottom-middle-3"></div>
      <div class="header-bottom-middle-4"></div>
      <div class="header-bottom-middle-5"></div>
      <div class="header-bottom-middle-2"></div>
      <div class="header-bottom-middle-3 header-bottom-middle-6"></div>
      <div class="header-bottom-middle-6-bg"></div>
    </div>
    <div class="header-bottom-right"></div>
  </div>
</template>

<script>
export default {
  components: {},
  props: {},
  data() {
    return {};
  },
  watch: {},
  computed: {},
  methods: {},
  created() {},
  mounted() {},
};
</script>
<style lang="scss" scoped>
.header-bottom {
  height: 8px;
  display: flex;
  &-left {
    width: calc(100% - 214px);
    height: 7px;
    background: var(--bg-color-2);
    // border-bottom: 1px solid var(--primary-color-2);
    margin-right: -1px;
  }
  &-middle {
    width: 216px;
    height: 7px;
    display: flex;

    &-1 {
      width: 0;
      height: 0;
      border-color: transparent var(--bg-color-2);
      border-width: 0 0 7px 7px;
      border-style: solid;
    }
    &-1-bg {
      width: 2px;
      height: 7px;
      // background: var(--primary-color-2);
      transform: skew(-45deg);
      position: relative;
      left: -3px;
    }
    &-2 {
      width: 72px;
      height: 7px;
      // border-top: 1px solid var(--primary-color-2);
    }
    &-3 {
      width: 0;
      height: 0;
      border-color: transparent var(--primary-color-2);
      border-width: 0 8px 8px 0;
      border-style: solid;
    }
    &-4 {
      width: 72px;
      height: 7px;
      background: var(--primary-color-2);
      border-top: 1px solid var(--primary-color-2);
    }
    &-5 {
      width: 0;
      height: 0;
      border-color: transparent var(--primary-color-2);
      border-width: 0 0 8px 8px;
      border-style: solid;
    }

    &-6 {
      border-color: transparent var(--bg-color-2);
    }
    &-6-bg {
      width: 2px;
      height: 7px;
      // background: var(--primary-color-2);
      transform: skew(45deg);
      position: relative;
      left: -5px;
    }
  }
  &-right {
    width: calc(100% - 214px);
    height: 7px;
    background: var(--bg-color-2);
    // border-bottom: 1px solid var(--primary-color-2);
    margin-left: -2px;
  }
}
</style>
