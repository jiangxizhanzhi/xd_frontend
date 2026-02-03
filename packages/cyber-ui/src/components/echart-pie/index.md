```html
<template>
  <div style="width: 800px; height: 500px;">
    <cb-echart-pie
      :pieData="pieData"
      :pieName="pieName"
      :titleText="titleText"
      :titleShow="titleShow"
      :legendLocation="legendLocation"
      :labelShow="labelShow"
      :gapShow="gapShow"
      :color="color"
    ></cb-echart-pie>
  </div>
</template>
<script>
  export default {
    name: 'pie',
    data() {
      return {
        color: ['primary-color', 'green-color', 'yellow-color', 'orange-color'],
        labelShow: false,
        double: true,
        gapShow: false,
        legendLocation: 'right',
        //仪表盘上的数据
        // label:{
        //         normal: {
        //           padding: [0, -80, 0, -80],
        //           formatter: '{c|{c}}\n{a|{b}}',
        //           rich: {
        //             c: {
        //               fontSize: 22,
        //               // color: '#555',
        //               padding: [-10, 0, 10, 0],
        //             },
        //             a: {
        //               fontSize: 14,
        //               textAlign: 'left',
        //             },

        //           },
        //         },
        //       },
        // legendShow: false,
        radius: ['60%', '70%'],
        // //自定义饼状图的颜色,也可以在series的data 中的itemStyle中定义,
        // color:["#ff0", "#f0f"],
        /**
         *标题设置
         */
        titleText: '1268',
        subTitleText: '场景统计',
        titleShow: true,
        // color:['yellow'],
        pieData: [30, 30, 40, 40],
        pieName: ['运行中', '已停止', '未sdfqe上线', '待上线'],
      };
    },
  };
</script>
<!-- live-pie-charts.vue -->
```
