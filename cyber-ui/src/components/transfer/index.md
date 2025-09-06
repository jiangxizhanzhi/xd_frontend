## 基本使用

```html
<template>
  <div>
    <cb-transfer v-model="value" :data="data"></cb-transfer>
  </div>
</template>

<script>
  import { themed } from '../../utils/themes';
  export default {
    data() {
      const generateData = (_) => {
        const data = [];
        for (let i = 1; i <= 15; i++) {
          data.push({
            key: i,
            label: `备选项 ${i}`,
            disabled: i % 4 === 0,
          });
        }
        return data;
      };
      return {
        data: generateData(),
        value: [1, 4],
      };
    },
    methods: {
      themed: themed,
    },
  };
</script>
<!--live-transfer.vue-->
```
