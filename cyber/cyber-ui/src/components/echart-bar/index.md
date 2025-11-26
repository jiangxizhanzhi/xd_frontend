```html
<template>
  <div>
    <div style="width: 800px; height: 400px">
      <cb-chart-bar
        :name="name"
        :barData="barData"
        :xData="xData"
        :xAxisLineShow="xAxisLineShow"
      ></cb-chart-bar>
    </div>
  </div>
</template>

<script>
  import { themed } from '../../utils/themes';
  export default {
    name: 'bar',
    data() {
      return {
        x2y: false,
        xAxisLineShow: true,
        ySplitLineShow: true,
        legendShow: true,
        barWidth: '20px',
        color: ['neutral8'],
        name: ['销量'],
        /**
         * x轴刻度显示值，类目数据
         */
        xData: ['衬衫', '羊毛衫', '雪纺衫', '裤子', '高跟鞋', '袜子'],
        /**
         * 每种柱子的颜色和值
         */
        barData: [
          [5, 20, 36, 10, 10, 20],
          [5, 20, 36, 10, 10, 20],
        ],
      };
    },
    components: {},
  };
</script>
<!-- live-charts.vue -->
```

## TC190 柱状图

```html
<template>
  <div>
    <div style="width: 800px; height: 400px;background:var(--bg-color-2); ">
      <cb-chart-bar
        :name="name"
        :barData="barData"
        :xData="xData"
        :barWidth="barWidth"
        :xAxisLineShow="xAxisLineShow"
        :xAxisLabel="xAxisLabel"
        :yAxisLabel="yAxisLabel"
        :yAxisLineShow="yAxisLineShow"
        :yOffset="yOffset"
        :borderOutside="true"
        :color="color"
      ></cb-chart-bar>
    </div>
  </div>
</template>

<script>
  // import { themed } from '../../utils/themes';
  export default {
    name: 'bar',
    data() {
      return {
        x2y: false,
        xAxisLineShow: true,
        yAxisLineShow: true,
        ySplitLineShow: true,
        legendShow: true,
        barWidth: '20px',
        color: [['#FF6744', '#FF2020']],
        xAxisLabel: {
          color: this.$themed('neutral5'),
          fontSize: 12,
          //label 标签斜着显示
          rotate: 45,
        },
        yAxisLabel: {
          color: this.$themed('neutral5'),
          fontSize: 12,
        },
        yOffset: 0,
        /**
         * x轴刻度显示值，类目数据
         */
        name: ['攻击次数'],
        xData: [
          'Reduser001',
          'Reduser002',
          'Reduser003',
          'Reduser004',
          'Reduser005',
          'Reduser006',
          'Reduser003',
          'Reduser004',
          'Reduser005',
          'Reduser006',
        ],
        /**
         * 每种柱子的颜色和值
         */
        barData: [
          [100, 200, 300, 400, 600, 950, 300, 400, 600, 950],
          // [5, 20, 36, 10, 10, 20]
        ],
      };
    },
    components: {},
  };
</script>
<!-- live-charts2.vue -->
```
