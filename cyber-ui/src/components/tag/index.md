## 基本使用

```html
<template>
  <div>
    <cb-tag size="small">小标签</cb-tag>
    <cb-tag>标签一</cb-tag>
    <cb-tag type="success">标签二</cb-tag>
    <cb-tag type="info">标签三</cb-tag>
    <cb-tag type="warning">标签四</cb-tag>
    <cb-tag type="danger">标签五</cb-tag>
  </div>
</template>
<script>
  export default {
    methods: {},
  };
</script>
<style lang="scss">
  .cb-tag {
    margin-right: 10px;
  }
</style>
<!-- live-tag.vue -->
```

## 可移除标签

```html
<template>
  <div>
    <cb-tag
      v-for="tag in tags"
      :key="tag.name"
      closable
      :type="tag.type"
      @close="close(tag)"
      :size="tag.size"
    >
      {{tag.name}}
    </cb-tag>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        tags: [
          { name: '小标签', type: '', size: 'small' },
          { name: '标签一', type: '' },
          { name: '标签二', type: 'success' },
          { name: '标签三', type: 'info' },
          { name: '标签四', type: 'warning' },
          {
            name: '标签五标签五标签五标签五标签五标签五标签五标签五',
            type: 'danger',
          },
        ],
      };
    },
    methods: {
      close(tag) {
        this.tags.splice(this.tags.indexOf(tag), 1);
      },
    },
  };
</script>
<!-- live-tag-delete.vue -->
```

## 自由宽度

```html
<template>
  <div>
    <cb-tag
      v-for="tag in tags"
      :key="tag.name"
      :omit="false"
      closable
      :type="tag.type"
    >
      {{tag.name}}
    </cb-tag>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        tags: [
          { name: '标签一', type: '' },
          { name: '标签二', type: 'success' },
          { name: '标签三', type: 'info' },
          { name: '标签四', type: 'warning' },
          {
            name: '标签五标签五标签五标签五标签五标签五标签五标签五',
            type: 'danger',
          },
          {
            name: '小标签小标签小标签小标签小标签小标签小标签小标签',
            type: 'danger',
            size: 'small',
          },
        ],
      };
    },
  };
</script>
<!-- live-tag-full.vue -->
```
