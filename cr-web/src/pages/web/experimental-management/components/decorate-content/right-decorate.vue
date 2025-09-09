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
  width: 5px;
  display: flex;
  flex-direction: column;
  height: 100%;
  &-left {
    border-top-right-radius: 4px;
    height: 24px;
    width: 5px;
    background: var(--bg-color-2);
    // border-bottom: 1px solid var(--primary-color-2);
    margin-bottom: -1px;
  }
  &-middle {
    height: 102px;
    width: 5px;
    display: flex;
    flex-direction: column;

    &-1 {
      width: 0;
      height: 0;
      border-color: transparent var(--bg-color-2);
      border-width: 0 0 5px 5px;
      border-style: solid;
    }
    &-1-bg {
      height: 2px;
      width: 5px;
      // background: var(--primary-color-2);
      transform: skew(-45deg);
      position: relative;
      left: -3px;
    }
    &-2 {
      height: 16px;
      width: 5px;
      // border-top: 1px solid var(--primary-color-2);
    }
    &-3 {
      width: 0;
      height: 0;
      border-color: transparent var(--primary-color-2);
      border-width: 5px 0 0 5px;
      border-style: solid;
    }
    &-4 {
      height: 72px;
      width: 5px;
      background: var(--primary-color-2);
      border-right: 1px solid var(--primary-color-2);
    }
    &-5 {
      width: 0;
      height: 0;
      border-color: transparent var(--primary-color-2);
      border-width: 0 0 5px 5px;
      border-style: solid;
    }

    &-6 {
      border-color: transparent var(--bg-color-2);
    }
    &-6-bg {
      height: 2px;
      width: 5px;
      // background: var(--primary-color-2);
      transform: skew(45deg);
      position: relative;
      left: -5px;
    }
  }
  &-right {
    border-bottom-right-radius: 4px;
    height: calc(100% - 122px);
    width: 5px;
    background: var(--bg-color-2);
    // border-bottom: 1px solid var(--primary-color-2);
    margin-top: -2px;
  }
}
</style>
