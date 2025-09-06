<template>
  <div class="third-box">
    <cb-echart-line
      :xData="xData"
      :name="name"
      :lineData="lineData"
      :legendShow="false"
      :axisLineShow="axisLineShow"
      :color="color"
      :grid="grid"
    ></cb-echart-line>
  </div>
</template>

<script>
import { getScreenInfo } from '@/hooks';
export default {
  name: 'AttackEchartLine',
  props: {
    color: {
      type: Array,
      default: function () {
        return [' '];
      },
    },
    xData: {
      type: Array,
      default: () => [],
    },
    name: {
      type: Array,
      default: () => [],
    },
    lineData: {
      type: Array,
      default: () => [],
    },
  },
  setup(props) {
    const grid = {
        top: 20,
        left: '3%',
        right: '15%',
        bottom: '6%',
        containLabel: true,
      },
      legendShow = true,
      axisLineShow = true,
      smooth = true,
      legendLocation = 'center',
      ySplitLineShow = true,
      legendIcon = '',
      areaStyle = true,
      chartSize = {
        width: '100%',
        height: '100%',
      };
    let screen = getScreenInfo();

    return {
      screen,
      grid,
      axisLineShow,
      chartSize,
      legendShow,
      smooth,
      legendLocation,
      ySplitLineShow,
      legendIcon,
      areaStyle,
    };
  },
};
</script>

<style scoped lang="scss">
.third-box {
  width: 100%;
  height: 100%;
}
</style>
