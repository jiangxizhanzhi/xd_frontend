```html
<template>
  <div>
    <cb-progress
      :percentage="5"
      strokeLinecap="round"
      bgColor="red"
    ></cb-progress>
    <cb-progress :percentage="10"></cb-progress>
    <cb-progress :percentage="20"></cb-progress>
    <cb-progress :percentage="30"></cb-progress>
    <cb-progress :percentage="40"></cb-progress>
    <cb-progress :percentage="50"></cb-progress>
    <cb-progress :percentage="60"></cb-progress>
    <cb-progress :percentage="70"></cb-progress>
    <cb-progress :percentage="80"></cb-progress>
    <cb-progress :percentage="90"></cb-progress>
    <cb-progress :percentage="100"></cb-progress>
    <p>状态的</p>
    <cb-progress :percentage="100" :format="format"></cb-progress>
    <p>状态的</p>
    <cb-progress :percentage="90" status="success"></cb-progress>
    <cb-progress :percentage="100" status="warning"></cb-progress>
    <cb-progress :percentage="50" status="exception"></cb-progress>
    <p>百分比内显</p>
    <cb-progress
      :percentage="50"
      strokeLinecap="round"
      status="exception"
      textInside
    ></cb-progress>
    <cb-progress
      :percentage="5"
      strokeLinecap="round"
      status="exception"
      :stroke-width="24"
      textInside
    ></cb-progress>
  </div>
</template>
<script>
  export default {
    methods: {
      format(percentage) {
        return percentage === 100 ? '满' : `${percentage}%`;
      },
    },
  };
</script>
<style lang="scss">
  .cb-progress {
    margin: 10px 0;
  }
</style>
<!-- live-progress.vue -->
```

## 环形进度条

```html
<template>
  <div>
    <cb-progress type="circle" :percentage="0"></cb-progress>
    <cb-progress type="circle" :percentage="25"></cb-progress>
    <cb-progress type="circle" :percentage="100" status="success"></cb-progress>
    <cb-progress type="circle" :percentage="70" status="warning"></cb-progress>
    <cb-progress
      type="circle"
      :percentage="50"
      status="exception"
    ></cb-progress>
    <cb-progress
      type="circle"
      :percentage="percentage"
      :color="colors"
      status="success"
    ></cb-progress>
    <cb-progress type="circle" :percentage="percentage" :color="colors">
      <template v-slot:circle-text> 拥有插槽的环形进度条 </template>
    </cb-progress>
    <cb-progress
      type="circle"
      :percentage="percentage"
      :color="colors"
      status="success"
      titleTop="0"
      circleTitle="标标题标题标题标题标题题"
    >
    </cb-progress>

    <!-- <cb-button @click="increase">+</cb-button>
    <cb-button @click="decrease">-</cb-button> -->
  </div>
</template>
<script>
  export default {
    data() {
      return {
        percentage: 10,
        colors: [
          { color: '#f56c6c', percentage: 20 },
          { color: '#e6a23c', percentage: 40 },
          { color: '#5cb87a', percentage: 60 },
          { color: '#1989fa', percentage: 80 },
          { color: '#6f7ad3', percentage: 100 },
        ],
      };
    },
    methods: {
      increase() {
        this.percentage += 10;
        if (this.percentage > 100) {
          this.percentage = 100;
        }
      },
      decrease() {
        this.percentage -= 10;
        if (this.percentage < 0) {
          this.percentage = 0;
        }
      },
    },
  };
</script>
<!-- live-progress2.vue -->
```

## 仪表盘

```html
<template>
  <div>
    <cb-progress
      type="dashboard"
      :percentage="percentage"
      :color="colors"
      status="success"
      circleTitle="标题"
    ></cb-progress>
    <cb-progress type="dashboard" :percentage="percentage" :color="colors">
      <template v-slot:circle-text> 拥有插槽的环形进度条 </template>
    </cb-progress>
    <cb-button-group>
      <cb-button @click="increase">+</cb-button>
      <cb-button @click="decrease">-</cb-button>
    </cb-button-group>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        percentage: 10,
        colors: [
          { color: '#f56c6c', percentage: 20 },
          { color: '#e6a23c', percentage: 40 },
          { color: '#5cb87a', percentage: 60 },
          { color: '#1989fa', percentage: 80 },
          { color: '#6f7ad3', percentage: 100 },
        ],
      };
    },
    methods: {
      increase() {
        this.percentage += 10;
        if (this.percentage > 100) {
          this.percentage = 100;
        }
      },
      decrease() {
        this.percentage -= 10;
        if (this.percentage < 0) {
          this.percentage = 0;
        }
      },
    },
  };
</script>
<!-- live-progress3.vue -->
```

## 插槽

```html
<template>
  <div>
    <cb-progress :percentage="5">
      <template v-slot:line-left> 这是左边 </template>
    </cb-progress>
    <cb-progress :percentage="10">
      <template v-slot:line-right> 这是右边 </template>
    </cb-progress>
  </div>
</template>
<script>
  export default {
    methods: {
      format(percentage) {
        return percentage === 100 ? '满' : `${percentage}%`;
      },
    },
  };
</script>
<style lang="scss">
  .cb-progress {
    margin: 10px 0;
  }
</style>
<!-- live-progress5.vue -->
```
