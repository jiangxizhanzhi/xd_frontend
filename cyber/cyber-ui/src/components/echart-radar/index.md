```html
<template>
  <div style="width: 400px; height: 500px">
    <cb-echart-radar
      :radarShape="radarShape"
      :indicator="indicator"
      :radarData="radarData"
      :radarRadius="radarRadius"
    ></cb-echart-radar>
  </div>
</template>

<script>
  export default {
    name: 'radar',
    data() {
      return {
        radarRadius: ['0%', '77%'],
        color: ['primary-color'],
        /*规定雷达图有几项,需要用户传值,值得顺序是从上开始，逆时针旋转
         * 雷达图的指示器，用来指定雷达图中的多个变量（维度）
         */
        indicator: [
          { name: '杂项', max: 1000 }, //color 设置标签的颜色优先级大于axisName
          { name: '加解密', max: 100 },
          { name: '逆向', max: 100 },
          { name: '二进制', max: 1000 },
          { name: '手机应用', max: 1000 },
          { name: 'web', max: 1000 },
          { name: 'web1', max: 1000 },
          { name: 'web2', max: 1000 },
          { name: 'web3', max: 1000 },
        ],
        radarShape: 'sharp',
        //数据，区域块的颜色等
        radarData: [600, 30, 85, 390, 720, 500, 620],
      };
    },
  };
</script>

<!-- Add 'scoped' attribute to limit CSS to this component only -->
<style scoped>
  .barContainer {
    width: 800px;
  }
</style>
<!-- live-radar-charts.vue -->
```
