<template>
  <div class="rank-list">
    <div class="index">
      <span v-for="(item, i) in model" :class="`rank-${item.rank}`" :key="i">
        {{ [1, 2, 3, '1', '2', '3'].includes(item.rank) ? '' : item.rank }}
      </span>
    </div>
    <div class="name">
      <span v-for="(item, i) in model" :key="i">
        {{ item.user_name }}
      </span>
    </div>
    <div class="score">
      <div v-for="(item, i) in model" :key="i">
        {{ item.sum_score }}
        <span class="unit">分</span>
      </div>
    </div>
  </div>
</template>
<script>
import { defineComponent } from '@vue/composition-api';
export default defineComponent({
  name: 'RankList',
  props: {
    model: {
      type: Array,
      default: () => [],
    },
  },
  setup() {},
});
</script>
<style lang="scss" scoped>
.rank-list {
  width: 100%;
  height: 100%;
  display: flex;
  font-size: calc(100vw / 120);

  .index {
    width: 2.5em;
  }

  .index,
  .name,
  .score {
    display: flex;
    flex-direction: column;
    font-size: 0.875em;
    color: #ffffff;
    & > * {
      height: 12.5%;
      display: flex;
      align-items: center;
    }
    .unit {
      font-size: 0.75em;
      margin-left: 0.5em;
    }
  }

  .score {
    color: #ffffff;
    div {
      align-self: flex-end;
      text-align: right;
    }
  }
  .name {
    font-size: 0.875em;
    color: #ffffff;
    flex: 1;
    span:nth-child(-n + 3) {
      font-weight: bold;
      font-size: 0.875em;
    }
  }
  .index {
    span {
      background-size: 80%;
      background-position: 0 center;
      background-repeat: no-repeat;
    }
    span.rank-1 {
      background-image: url(~@/assets/img/visual-screen/screen-2/rank_first.png);
    }
    span.rank-2 {
      background-image: url(~@/assets/img/visual-screen/screen-2/rank_second.png);
    }
    span.rank-3 {
      background-image: url(~@/assets/img/visual-screen/screen-2/rank_third.png);
    }
  }

  .score {
    div:nth-child(1) {
      color: #e9c17b;
      font-size: 1.5em;
      font-family: Arial-BoldItalicMT, Arial;
    }
    div:nth-child(2) {
      color: #c1dfdf;
      font-size: 1.5em;
      font-family: Arial-BoldItalicMT, Arial;
    }
    div:nth-child(3) {
      color: #d88948;
      font-size: 1.5em;
      font-family: Arial-BoldItalicMT, Arial;
    }
  }
}
</style>
