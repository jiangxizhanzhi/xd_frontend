## 基本使用

```html
<template>
  <div>
    <cb-badge :value="12" class="item">
      <cb-button size="small">评论</cb-button>
    </cb-badge>
    <cb-badge :value="3" class="item">
      <cb-button size="small">回复</cb-button>
    </cb-badge>
    <cb-badge :value="1" class="item" type="primary">
      <cb-button size="small">评论</cb-button>
    </cb-badge>
    <cb-badge :value="2" class="item" type="warning">
      <cb-button size="small">回复</cb-button>
    </cb-badge>

    <cb-dropdown trigger="click">
      <span class="cb-dropdown-link">
        点我查看<i class="cb-icon-caret-bottom cb-icon--right"></i>
      </span>
      <cb-dropdown-menu slot="dropdown">
        <cb-dropdown-item class="clearfix">
          评论
          <cb-badge class="mark" :value="12" />
        </cb-dropdown-item>
        <cb-dropdown-item class="clearfix">
          回复
          <cb-badge class="mark" :value="3" />
        </cb-dropdown-item>
      </cb-dropdown-menu>
    </cb-dropdown>
  </div>
</template>
<!-- live-badge.vue -->
```

## 最大值

```html
<template>
  <div>
    <cb-badge :value="200" :max="99" class="item">
      <cb-button size="small">评论</cb-button>
    </cb-badge>
    <cb-badge :value="100" :max="10" class="item">
      <cb-button size="small">回复</cb-button>
    </cb-badge>
  </div>
</template>
<!-- live-max.vue -->
```

## 自定义内容

```html
<template>
  <div>
    <cb-badge value="new" class="item">
      <cb-button size="small">评论</cb-button>
    </cb-badge>
    <cb-badge value="hot" class="item">
      <cb-button size="small">回复</cb-button>
    </cb-badge>
  </div>
</template>
<!-- live-slot.vue -->
```

## 小红点

```html
<template>
  <div>
    <cb-badge is-dot class="item">数据查询</cb-badge>
    <cb-badge is-dot class="item">
      <cb-button class="share-button" type="primary">红点</cb-button>
    </cb-badge>
  </div>
</template>
<style>
  .item {
    margin-top: 10px;
    margin-right: 40px;
  }
</style>
<!-- live-dot.vue -->
```
