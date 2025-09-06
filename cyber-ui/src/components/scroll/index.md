## 基本使用

```html
<template>
  <div>
    <cb-scroll ref="table" :data="listData" class="seamless-warp">
      <ul class="item">
        <li v-for="item in listData">
          <span class="title" v-text="item.title"></span
          ><span class="date" v-text="item.date"></span>
        </li>
      </ul>
    </cb-scroll>
    <cb-button @click="add">添加</cb-button>
    <cb-button @click="reset">重置</cb-button>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        listData: [
          {
            title: '无缝滚动第一行无缝滚动第一行',
            date: '2017-12-16',
          },
          {
            title: '无缝滚动第二行无缝滚动第二行',
            date: '2017-12-16',
          },
          {
            title: '无缝滚动第三行无缝滚动第三行',
            date: '2017-12-16',
          },
          {
            title: '无缝滚动第四行无缝滚动第四行',
            date: '2017-12-16',
          },
          {
            title: '无缝滚动第五行无缝滚动第五行',
            date: '2017-12-16',
          },
          {
            title: '无缝滚动第六行无缝滚动第六行',
            date: '2017-12-16',
          },
          {
            title: '无缝滚动第七行无缝滚动第七行',
            date: '2017-12-16',
          },
          {
            title: '无缝滚动第八行无缝滚动第八行',
            date: '2017-12-16',
          },
          {
            title: '无缝滚动第九行无缝滚动第九行',
            date: '2017-12-16',
          },
        ],
      };
    },
    methods: {
      add() {
        this.listData.push({
          title: '2222222131231',
          date: '1213123123122',
        });
        this.$refs.table.reset();
      },
      reset() {
        this.listData = [
          {
            title: '31312312',
            date: '2017-12-16',
          },
          {
            title: '1412341234',
            date: '2017-12-16',
          },
          {
            title: '3464363456',
            date: '2017-12-16',
          },
          {
            title: '341234123',
            date: '2017-12-16',
          },
          {
            title: '12342134',
            date: '2017-12-16',
          },
          {
            title: '13412342',
            date: '2017-12-16',
          },
        ];
        this.$refs.table.reset();
      },
    },
  };
</script>
<style>
  .seamless-warp {
    height: 229px;
    overflow: hidden;
  }
  .list-item {
    display: inline-block;
    margin-right: 10px;
  }
  .list-enter-active,
  .list-leave-active {
    transition: all 1s;
  }
  .list-enter,
  .list-leave-to {
    opacity: 0;
    transform: translateY(30px);
  }
</style>
<!--live-scroll.vue-->
```

## 滚动方向以及滚动停顿时间

```html
<template>
  <div>
    <cb-scroll
      :data="listData"
      class="seamless-warp"
      :class-option="optionSingleHeight"
    >
      <ul class="item">
        <li v-for="item in listData">
          <span class="title" v-text="item.title"></span
          ><span class="date" v-text="item.date"></span>
        </li>
      </ul>
    </cb-scroll>
    <cb-button @click="add">添加</cb-button>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        listData: [
          {
            title: '无缝滚动第一行无缝滚动第一行',
            date: '2017-12-16',
          },
          {
            title: '无缝滚动第二行无缝滚动第二行',
            date: '2017-12-16',
          },
          {
            title: '无缝滚动第三行无缝滚动第三行',
            date: '2017-12-16',
          },
          {
            title: '无缝滚动第四行无缝滚动第四行',
            date: '2017-12-16',
          },
          {
            title: '无缝滚动第五行无缝滚动第五行',
            date: '2017-12-16',
          },
          {
            title: '无缝滚动第六行无缝滚动第六行',
            date: '2017-12-16',
          },
          {
            title: '无缝滚动第七行无缝滚动第七行',
            date: '2017-12-16',
          },
          {
            title: '无缝滚动第八行无缝滚动第八行',
            date: '2017-12-16',
          },
          {
            title: '无缝滚动第九行无缝滚动第九行',
            date: '2017-12-16',
          },
        ],
      };
    },
    computed: {
      optionSingleHeight() {
        return {
          //滚动方向
          direction: 0,
          //单行一次滚动高度
          singleHeight: 50,
          //等待时间
          waitTime: 2500,
        };
      },
    },
    methods: {
      add() {
        this.listData.push({
          title: '2222222131231',
          date: '1213123123122',
        });
      },
    },
  };
</script>
<style>
  .seamless-warp {
    height: 229px;
    overflow: hidden;
  }
</style>
<!--live-scroll-single.vue-->
```

## 横向滚动

```html
<template>
  <cb-scroll :data="listData" :class-option="classOption" class="warp">
    <ul class="ul-item">
      <li class="li-item" v-for="(item, index) in listData" :key="index">
        {{ item }}
      </li>
    </ul>
  </cb-scroll>
</template>

<script>
  export default {
    data() {
      return {
        listData: [1, 2, 3, 4, 5, 6],
        classOption: {
          limitMoveNum: 2,
          direction: 3,
        },
      };
    },
  };
</script>

<style lang="scss" scoped>
  ::v-deep.warp {
    width: 130px * 4;
    height: 120px;
    margin: 0 auto;
    overflow: hidden;
    ul {
      list-style: none;
      padding: 0;
      margin: 0 auto;
      &.ul-item {
        display: flex;
        .li-item {
          width: 120px;
          height: 120px;
          margin-right: 10px;
          line-height: 120px;
          background-color: #999;
          color: #fff;
          text-align: center;
          font-size: 30px;
        }
      }
    }
  }
</style>
<!--live-dirtion.vue-->
```
