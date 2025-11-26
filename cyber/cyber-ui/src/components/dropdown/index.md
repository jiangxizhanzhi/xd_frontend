## 基本使用

```html
<template>
  <div>
    <cb-dropdown>
      <span class="cb-dropdown-link">
        下拉菜单<i class="cb-icon-arrow-down cb-icon--right"></i>
      </span>
      <cb-dropdown-menu slot="dropdown">
        <cb-dropdown-item>黄金糕</cb-dropdown-item>
        <cb-dropdown-item>狮子头</cb-dropdown-item>
        <cb-dropdown-item>螺蛳粉</cb-dropdown-item>
        <cb-dropdown-item disabled>双皮奶</cb-dropdown-item>
        <cb-dropdown-item divided>蚵仔煎</cb-dropdown-item>
      </cb-dropdown-menu>
    </cb-dropdown>
  </div>
</template>
<style>
  .cb-dropdown-link {
    cursor: pointer;
    color: #409eff;
  }
  .cb-icon-arrow-down {
    font-size: 12px;
  }
</style>
<!-- live-dropdown.vue -->
```

## 触发方式

```html
<template>
  <div>
    <span class="demonstration">hover 激活</span>
    <cb-dropdown>
      <span class="cb-dropdown-link">
        下拉菜单<i class="cb-icon-arrow-down cb-icon--right"></i>
      </span>
      <cb-dropdown-menu slot="dropdown">
        <cb-dropdown-item icon="cb-icon-plus">黄金糕</cb-dropdown-item>
        <cb-dropdown-item icon="cb-icon-circle-plus">狮子头</cb-dropdown-item>
        <cb-dropdown-item icon="cb-icon-circle-plus-outline"
          >螺蛳粉</cb-dropdown-item
        >
        <cb-dropdown-item icon="cb-icon-check">双皮奶</cb-dropdown-item>
        <cb-dropdown-item icon="cb-icon-circle-check">蚵仔煎</cb-dropdown-item>
      </cb-dropdown-menu>
    </cb-dropdown>
    <br />
    <cb-dropdown trigger="click">
      <span class="cb-dropdown-link">
        下拉菜单<i class="cb-icon-arrow-down cb-icon--right"></i>
      </span>
      <cb-dropdown-menu slot="dropdown">
        <cb-dropdown-item icon="cb-icon-plus">黄金糕</cb-dropdown-item>
        <cb-dropdown-item icon="cb-icon-circle-plus">狮子头</cb-dropdown-item>
        <cb-dropdown-item icon="cb-icon-circle-plus-outline"
          >螺蛳粉</cb-dropdown-item
        >
        <cb-dropdown-item icon="cb-icon-check">双皮奶</cb-dropdown-item>
        <cb-dropdown-item icon="cb-icon-circle-check">蚵仔煎</cb-dropdown-item>
      </cb-dropdown-menu>
    </cb-dropdown>
  </div>
</template>

<script>
  export default {
    methods: {
      handleClick() {
        alert('button click');
      },
    },
  };
</script>
<style>
  .cb-dropdown-link {
    cursor: pointer;
    color: #409eff;
  }
  .cb-icon-arrow-down {
    font-size: 12px;
  }
</style>
<!-- live-dropdown3.vue -->
```

## 菜单隐藏方式

```html
<template>
  <div>
    <cb-dropdown :hide-on-click="false">
      <span class="cb-dropdown-link">
        下拉菜单<i class="cb-icon-arrow-down cb-icon--right"></i>
      </span>
      <cb-dropdown-menu slot="dropdown">
        <cb-dropdown-item>黄金糕</cb-dropdown-item>
        <cb-dropdown-item>狮子头</cb-dropdown-item>
        <cb-dropdown-item>螺蛳粉</cb-dropdown-item>
        <cb-dropdown-item disabled>双皮奶</cb-dropdown-item>
        <cb-dropdown-item divided>蚵仔煎</cb-dropdown-item>
      </cb-dropdown-menu>
    </cb-dropdown>
  </div>
</template>
<style>
  .cb-dropdown-link {
    cursor: pointer;
    color: #409eff;
  }
  .cb-icon-arrow-down {
    font-size: 12px;
  }
</style>
<!-- live-dropdown4.vue -->
```

## 指令事件

```html
<template>
  <div>
    <cb-dropdown>
      <span class="cb-dropdown-link">
        下拉菜单<i class="cb-icon-arrow-down cb-icon--right"></i>
      </span>
      <cb-dropdown-menu slot="dropdown">
        <cb-dropdown-item command="a">黄金糕</cb-dropdown-item>
        <cb-dropdown-item command="b">狮子头</cb-dropdown-item>
        <cb-dropdown-item command="c">螺蛳粉</cb-dropdown-item>
        <cb-dropdown-item command="d" disabled>双皮奶</cb-dropdown-item>
        <cb-dropdown-item command="e" divided>蚵仔煎</cb-dropdown-item>
      </cb-dropdown-menu>
    </cb-dropdown>
  </div>
</template>
<style>
  .cb-dropdown-link {
    cursor: pointer;
    color: #409eff;
  }
  .cb-icon-arrow-down {
    font-size: 12px;
  }
</style>
<!-- live-dropdown5.vue -->
```
