<template>
  <div class="count-top mr-bottom flex-fill-col">
    <div class="count-top-item" v-for="item in assetItem" :key="item.name">
      <!-- //四个角 -->
      <div class="left-top"></div>
      <div class="right-top"></div>
      <div class="right-bottom"></div>
      <div class="left-bottom"></div>
      <div class="container">
        <div class="number">
          <span>{{ item.num }}</span>
        </div>
        <div class="desName">
          <span>{{ item.name }}</span>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  components: {},
  props: {
    assetItem: {
      type: Array,
      default: () => {
        return [];
      },
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
};
</script>
<style lang="scss" scoped>
.count-top {
  display: flex;
  flex-wrap: wrap;

  &-item {
    position: relative;
    flex: 1;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0 10px;
    margin: 0 var(--margin-size);

    //四个角
    .left-top {
      position: absolute;
      border-top: var(--asset-sharp-border-width) var(--asset-sharp-color) solid;
      border-left: var(--asset-sharp-border-width) var(--asset-sharp-color)
        solid;
      width: var(--asset-sharp-width);
      height: var(--asset-sharp-height);
      top: 0;
      left: 0;
    }
    .right-top {
      position: absolute;
      border-top: var(--asset-sharp-border-width) var(--asset-sharp-color) solid;
      border-right: var(--asset-sharp-border-width) var(--asset-sharp-color)
        solid;
      width: var(--asset-sharp-width);
      height: var(--asset-sharp-height);
      top: 0;
      right: 0;
    }
    .right-bottom {
      position: absolute;
      border-bottom: var(--asset-sharp-border-width) var(--asset-sharp-color)
        solid;
      border-right: var(--asset-sharp-border-width) var(--asset-sharp-color)
        solid;
      width: var(--asset-sharp-width);
      height: var(--asset-sharp-height);
      bottom: 0;
      right: 0;
    }
    .left-bottom {
      position: absolute;
      border-bottom: var(--asset-sharp-border-width) var(--asset-sharp-color)
        solid;
      border-left: var(--asset-sharp-border-width) var(--asset-sharp-color)
        solid;
      width: var(--asset-sharp-width);
      height: var(--asset-sharp-height);
      bottom: 0;
      left: 0;
    }
    .container {
      width: calc(100% - var(--asset-sharp-distance));
      height: calc(100% - var(--asset-sharp-distance));
      .number {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 70%;
        background-color: var(--asset-up-bg-color);
        font-size: var(--font-size-20);
        font-weight: bold;
        color: var(--font-gree-color);
      }
      .desName {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 30%;
        font-size: var(--font-size-12);

        background: var(--asset-up-2-bg-color);
      }
    }
  }
}
</style>
