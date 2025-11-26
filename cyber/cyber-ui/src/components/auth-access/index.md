## 基本演示

```html
<template>
  <div>
    <cb-auth-access :auth-data="authData" :org-data="orgData"></cb-auth-access>
  </div>
</template>
<script>
  const arrayData = [];
  for (let i = 0; i < 60; i++) {
    arrayData.push({
      value: i,
      label: `这是名字${i}`,
    });
  }
  import { themed } from '../../utils/themes';
  export default {
    data() {
      return {
        authData: {
          auth_mode: 1,
        },
        orgData: arrayData,
      };
    },
    methods: {
      themed: themed,
    },
  };
</script>
<!-- live-auth-access.vue -->
```
