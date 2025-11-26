## 基本演示

```html
<template>
  <div><cb-calendar :data="data" width="400px" @select="select" /></div>
</template>
<script>
  export default {
    data() {
      return {
        data: [
          {
            date: '2021-7-28',
          },
          {
            date: '2021-8-1',
          },
          {
            date: '2021-7-24',
          },
        ],
      };
    },
    methods: {
      select(value) {
        console.log(value);
      },
    },
  };
</script>

<!-- calendar-panel.vue -->
```
