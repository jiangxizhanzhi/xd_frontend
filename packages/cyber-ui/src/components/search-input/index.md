```html
<template>
  <div>
    <cb-search-input v-model="value" v-if="status"></cb-search-input>
    {{value}}
    <cb-search-input v-model="value1" v-if="!status"></cb-search-input>
    {{value1}}
    <br />

    <cb-button @click="status=!status">切换</cb-button>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        value: '',
        value1: '',
        status: true,
      };
    },
    methods: {
      change(val) {
        console.log(val);
      },
    },
  };
</script>
<!--cb-search.vue-->
```
