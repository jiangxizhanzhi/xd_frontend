<template>
  <div :class="['rank-item', rank < 4 ? `rank-${rank}` : '']">
    <span class="index">
      {{ rank }}
    </span>
    <img class="image" :src="model.logo" alt="" />
    <span class="name">{{ model.user_name }}</span>
    <span class="score">{{ model.sum_score }}</span>
  </div>
</template>
<script>
import { defineComponent } from '@vue/composition-api';
export default defineComponent({
  name: 'RankItem',
  props: {
    rank: Number,
    model: {
      type: Object,
      default: () => ({}),
    },
  },
  setup(prop) {},
});
</script>
<style lang="scss" scoped>
.rank-item {
  display: flex;
  align-items: center;
  color: #ffffff;
  font-size: calc(100vw / 120);
  margin-bottom: 1.5em;

  .index {
    width: 2.5em;
    text-align: center;
    font-size: 0.75em;
  }

  .image {
    height: 1.5em;
    width: 1.5em;
    border: 1px solid #55b7ff;
    border-radius: 50%;
    overflow: hidden;
    margin-right: 1.25em;
  }

  .name {
    flex: 1;
    font-size: 0.75em;
    font-weight: 400;
  }

  .score {
    width: 6.25em;
    text-align: center;
    font-size: 0.75em;
  }

  &.rank-1,
  &.rank-2,
  &.rank-3 {
    .index,
    .name {
      font-size: 0.875em;
      width: 2.14em;
      font-weight: normal;
    }
    .score {
      font-family: Arial-BoldItalicMT, Arial;
      font-size: 1em;
      width: 4.6875em;
    }
  }
  &.rank-1 {
    .index,
    .score {
      color: #e9c17b;
    }
  }

  &.rank-2 {
    .index,
    .score {
      color: #c1dfdf;
    }
  }

  &.rank-3 {
    .index,
    .score {
      color: #d88948;
    }
  }
}
</style>
