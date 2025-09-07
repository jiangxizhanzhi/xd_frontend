## 基本使用

```html
<template>
  <div>
    <div class="block">
      <span class="demonstration">默认 Hover 指示器触发</span>
      <cb-carousel height="150px" :autoplay="false">
        <cb-carousel-item v-for="item in 4" :key="item">
          <h3 class="small">{{ item }}</h3>
        </cb-carousel-item>
      </cb-carousel>
    </div>
    <div class="block">
      <span class="demonstration">Click 指示器触发</span>
      <cb-carousel trigger="click" height="150px">
        <cb-carousel-item v-for="item in 4" :key="item">
          <h3 class="small">{{ item }}</h3>
        </cb-carousel-item>
      </cb-carousel>
    </div>
  </div>
</template>
<style>
  .cb-carousel__item h3 {
    color: #475669;
    font-size: 14px;
    opacity: 0.75;
    line-height: 150px;
    margin: 0;
  }

  .cb-carousel__item:nth-child(2n) {
    background-color: #99a9bf;
  }

  .cb-carousel__item:nth-child(2n + 1) {
    background-color: #d3dce6;
  }
</style>
<!-- live-Carousel.vue -->
```

## 指示器

```html
<template>
  <div>
    <cb-carousel indicator-position="outside">
      <cb-carousel-item v-for="item in 4" :key="item">
        <h3>{{ item }}</h3>
      </cb-carousel-item>
    </cb-carousel>
  </div>
</template>
<!-- live-Carousel1.vue -->
```

## 切换箭头

```html
<template>
  <div>
    <cb-carousel :interval="5000" arrow="always">
      <cb-carousel-item v-for="item in 4" :key="item">
        <h3>{{ item }}</h3>
      </cb-carousel-item>
    </cb-carousel>
  </div>
</template>
<style>
  .cb-carousel__item h3 {
    color: #475669;
    font-size: 18px;
    opacity: 0.75;
    line-height: 300px;
    margin: 0;
  }

  .cb-carousel__item:nth-child(2n) {
    background-color: #99a9bf;
  }

  .cb-carousel__item:nth-child(2n + 1) {
    background-color: #d3dce6;
  }
</style>
<!-- live-Carousel3.vue -->
```

## 卡片化

```html
<template>
  <div>
    <cb-carousel :interval="4000" type="card" height="200px">
      <cb-carousel-item v-for="item in 6" :key="item">
        <h3 class="medium">{{ item }}</h3>
      </cb-carousel-item>
    </cb-carousel>
  </div>
</template>
<style>
  .cb-carousel__item h3 {
    color: #475669;
    font-size: 14px;
    opacity: 0.75;
    line-height: 200px;
    margin: 0;
  }

  .cb-carousel__item:nth-child(2n) {
    background-color: #99a9bf;
  }

  .cb-carousel__item:nth-child(2n + 1) {
    background-color: #d3dce6;
  }
</style>
<!-- live-Carousel4.vue -->
```

## 方向

```html
<template>
  <div>
    <cb-carousel height="200px" direction="vertical" :autoplay="false">
      <cb-carousel-item v-for="item in 3" :key="item">
        <h3 class="medium">{{ item }}</h3>
      </cb-carousel-item>
    </cb-carousel>
  </div>
</template>
<style>
  .cb-carousel__item h3 {
    color: #475669;
    font-size: 14px;
    opacity: 0.75;
    line-height: 200px;
    margin: 0;
  }

  .cb-carousel__item:nth-child(2n) {
    background-color: #99a9bf;
  }

  .cb-carousel__item:nth-child(2n + 1) {
    background-color: #d3dce6;
  }
</style>
<!-- live-Carousel5.vue -->
```
