<template>
  <div class="third-box">
    <div class="line-div">
      <cb-echart-line
        :xData="xData"
        :name="name"
        :lineData="lineData"
        :legendShow="false"
        :axisLineShow="axisLineShow"
        :color="color"
        :grid="grid"
        symbol="none"
        :xAxisLabel="xAxisLabel"
        :yAxisLabel="yAxisLabel"
      ></cb-echart-line>
    </div>

    <div class="footer">
      <div class="footer-center">
        <div class="attack">
          <div class="icon" :style="{ background: iconColor[0] }"></div>
          攻击
        </div>
        <div class="defense">
          <div class="icon" :style="{ background: iconColor[1] }"></div>
          防御
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { onMounted, watch, ref, reactive } from '@vue/composition-api';
import { getScreenInfo } from '@/hooks';
export default {
  name: 'AttackEchartLine',
  components: {},
  props: {
    iconColor: {
      type: Array,
      default: function () {
        return ['#f15e5f', '#116eff'];
      },
    },
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
        top: 5,
        left: '6%',
        right: '15%',
        bottom: '2',
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
    onMounted(() => {});
    watch(screen, (val) => {
      // console.log('屏幕尺寸在变化');
      // console.log(val, 'val');
    });
    const xAxisLabel = ref({
      color: '#fff',
      fontSize: 12,
    });
    const yAxisLabel = ref({
      color: '#fff',
      fontSize: 12,
    });
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
      xAxisLabel,
      yAxisLabel,
    };
  },
};
</script>

<style scoped lang="scss">
.third-box {
  width: 100%;
  height: 100%;
  flex: 1;
  display: flex;
  flex-direction: column;
  .line-div {
    flex: 1;
  }
  .footer {
    width: 100%;
    height: 40px;
    display: flex;
    font-size: var(--font-size-12);
    justify-content: center;
    &-center {
      width: 80%;
      display: flex;
      justify-content: center;
      .attack,
      .defense {
        width: 20%;
        position: relative;
        display: flex;
        align-items: center;
      }
      .icon {
        position: absolute;
        content: '';
        width: 6px;
        height: 6px;
        border-radius: 50%;
        background: #f3b16c;
        left: -25%;
        top: 50%;
        transform: translateY(-50%);
      }
      .attack::before {
        background: #f15e5f;
      }
      .defense::before {
        background: #116eff;
      }
    }
  }
}
</style>
