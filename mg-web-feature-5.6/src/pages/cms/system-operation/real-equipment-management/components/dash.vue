<template>
  <div class="dash-wrapper">
    <div class="dash-boxs">
      <div class="arrows-wrapper">
        <cb-iconfont
          :type="item.icon"
          class="arrows"
          :class="getColor(item.count)"
          :style="'transform: rotate(' + getRotate(item.count) + 'deg)'"
          size="22"
        />
      </div>
      <span class="count-span" :class="getColor(item.count)">
        {{ item.count }}%
      </span>
    </div>
    <div class="info-desc">{{ item.text }}</div>
  </div>
</template>
<script>
export default {
  props: {
    item: {
      type: Object,
      default: () => {},
    },
  },
  components: {},
  data() {
    return {};
  },
  computed: {},
  watch: {},
  mounted() {},
  methods: {
    getColor(val) {
      const classObj = {};
      if (val >= 0 && val < 33) {
        classObj['green-arrow'] = true;
      } else if (val >= 33 && val < 66) {
        classObj['yellow-arrow'] = true;
      } else if (val >= 66 && val <= 100) {
        classObj['red-arrow'] = true;
      }
      return classObj;
    },
    getRotate(val) {
      // -112  108
      const init = -112;
      const rotateCount = init + val * 2.2;
      return rotateCount;
    },
  },
};
</script>
<style lang="scss">
.dash-wrapper {
  .dash-boxs {
    background: url('../assets/img/dash-bg.png');
    background-size: 100% 100%;
    width: 94px;
    height: 84px;
    position: relative;
    .arrows-wrapper {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }
    .arrows {
      transform-origin: 50% 100%;
    }
    .count-span {
      display: block;
      position: absolute;
      bottom: -2px;
      left: 50%;
      transform: translateX(-50%);
      font-size: 18px;
      font-weight: bold;
    }
  }
  .info-desc {
    width: 92px;
    height: 28px;
    line-height: 28px;
    text-align: center;
    box-shadow: var(--blue-color-4) 0px 0px 10px inset;
    color: var(--neutral8);
  }
}
</style>
<style lang="scss" scoped>
.green-arrow {
  color: var(--green-color);
}
.yellow-arrow {
  color: var(--orange-color);
}
.red-arrow {
  color: var(--red-color);
}
</style>
