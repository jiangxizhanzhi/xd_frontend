## 常规场景

```html
<template>
  <cb-button-group>
    <cb-button>上一步</cb-button>
    <cb-button>下一步</cb-button>
    <cb-button>下一步</cb-button>
  </cb-button-group>
</template>
<script>
  export default {
    data() {
      return {};
    },
  };
</script>
<!--live-button-group.vue-->
```

## 间距大小

```html
<template>
  <cb-button-group space="middle">
    <cb-button>上一步</cb-button>
    <cb-button>下一步</cb-button>
    <cb-button>下一步</cb-button>
  </cb-button-group>
</template>
<script>
  export default {
    data() {
      return {};
    },
  };
</script>
<!--live-button-group3.vue-->
```

## 特殊场景

```html
<template>
  <cb-button-group shape="circle">
    <cb-button button-type="delete"></cb-button>
    <cb-button button-type="add"></cb-button>
    <cb-button button-type="delete"></cb-button>
  </cb-button-group>
</template>
<script>
  export default {
    data() {
      return {};
    },
  };
</script>
<!--live-button-group2.vue-->
```
