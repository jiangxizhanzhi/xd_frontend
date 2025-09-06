```html
<template>
  <div style="width: 500px; height: 400px;background: var(--bg-color-2);">
    <cb-echart-line
      :xData="xData"
      :name="name"
      :lineData="lineData"
      :legendShow="true"
      :yAxisName="yAxisName"
    ></cb-echart-line>
  </div>
</template>

<script>
  export default {
    name: 'line',
    data() {
      return {
        chartSize: {
          width: '500px',
          height: '400px',
        },
        color: ['primary-color', 'green-color'],
        legendShow: true,
        axisLineShow: true,
        smooth: true,
        // xType: 'time',
        //legend的显示位置
        legendLocation: 'center',
        ySplitLineShow: true,
        legendIcon: '',
        name: ['销量', '库存量', '进货量'],
        areaStyle: true,
        /**
         * 每种柱子的颜色和值
         */
        xData: ['衬衫', '羊毛衫', '雪纺衫', '裤子', '高跟鞋', '袜子'],
        // yAxisIndex: [0, 1],
        yAxisName: '11111',
        // yAxisName: ['1111', '22222'],
        lineData: [
          [5, 20, 36, 50, 90, 100],
          [10, 20, 46, 40, 80, 90],
        ],
      };
    },
  };
</script>

<!-- live-line-charts.vue -->
```

## TC190

```html
<template>
  <div style="width: 800px; height: 400px;background:#252525">
    <cb-echart-line
      :xData="xData"
      :name="name"
      :lineData="lineData"
      :color="color"
      :symbol="symbol"
      :areaStyle="true"
      :axisLineShow="true"
      :xAxisLine="xAxisLine"
      :yAxisLine="yAxisLine"
      :ySplitLineShow="true"
      :xSplitLineShow="true"
      :yAxisLabel="yAxisLabel"
      :xAxisLabel="xAxisLabel"
      :tooltip="tooltip"
    ></cb-echart-line>
  </div>
</template>

<script>
  export default {
    name: 'line',
    data() {
      return {
        chartSize: {
          width: '500px',
          height: '400px',
        },
        color: ['red-color'],
        legendShow: true,
        axisLineShow: true,
        smooth: true,
        symbol: 'none',
        // xType: 'time',
        //legend的显示位置
        legendLocation: 'center',
        ySplitLineShow: true,
        legendIcon: '',
        name: ['销量', '库存量', '进货量'],
        areaStyle: true,
        xAxisLine: {
          show: true,
          lineStyle: {
            //x轴线的颜色设置 ，暂不支持修改
            color: '#697AA0',
          },
        },
        yAxisLine: {
          show: true,
          lineStyle: {
            //x轴线的颜色设置 ，暂不支持修改
            color: '#697AA0',
          },
        },
        xAxisLabel: {
          color: '#A9B7D6',
          fontSize: 12,
        },
        yAxisLabel: {
          color: '#A9B7D6',
          fontSize: 12,
        },
        tooltip: {
          //鼠标移动到坐标轴触发时提示框是否有虚线
          trigger: 'axis',
          //背景颜色
          backgroundColor: 'rgba(20, 30, 54, 0)',
          borderWidth: 0,
          show: true,
          formatter: (params) => {
            var relVal = '';
            for (var i = 0, l = params.length; i < l; i++) {
              relVal += params[i].value + '  ' + 'kbps';
            }
            return relVal;
          },
          //阴影设置
          extraCssText:
            'box-shadow: inset 0px 0px 30px 0px rgba(222, 35, 16, 0.2), inset  0px 0px 15px 2px rgba(222, 35, 16, 0.6); width: 131px; height:39px;text-align: center;background: linear-gradient(0deg, #FF6744 0%, #FF2020 100%);-webkit-background-clip: text;-webkit-text-fill-color: transparent;',
          //tooltip的文本颜色
          textStyle: {
            fontSize: 16,
            fontWeight: 'bold',
          },
          // 位置设置
          position: function (pos, params, dom, rect, size) {
            //距离图标上方的位置
            let yPos = '15%';
            let xPos = 0;
            if (pos[0] < size.viewSize[0] / 2) {
              xPos = pos[0];
            } else {
              xPos = pos[0] - dom.offsetWidth;
            }
            return [xPos, yPos];
          },
          //toolTip显示时,线的显示样式
          axisPointer: {
            type: 'line',
            lineStyle: {
              color: {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [
                  {
                    offset: 0,
                    color: '#FF2020', // 0% 处的颜色
                  },
                  {
                    offset: 1,
                    color: 'rgba(255, 103, 68, 0.3)', // 100% 处的颜色
                  },
                ],
                global: false, // 缺省为 false
              },
              width: 4,
              type: 'solid',
            },
          },
        },
        /**
         * 每种柱子的颜色和值
         */
        xData: [
          '20-12-12',
          '20-12-12',
          '20-12-12',
          '20-12-12',
          '20-12-12',
          '20-12-12',
        ],
        lineData: [[2, 3, 4, 3, 2, 1]],
      };
    },
  };
</script>

<!-- live-line-charts1.vue -->
```
