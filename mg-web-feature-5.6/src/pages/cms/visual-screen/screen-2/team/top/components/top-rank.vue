<template>
  <div :class="['top-rank', `rank-${rank}`]">
    <div class="header">
      <img class="head" :src="model.logo" alt="" />
      <div class="name">{{ rank + ' ' + model.user_name }}</div>
      <div class="score">
        {{ model.sum_score }}
        <span class="unit">分</span>
      </div>
    </div>
    <div class="body">
      <AttackType
        :model="model.attack_count"
        :flow="model.flow"
        :count="model.count"
      />
    </div>
  </div>
</template>
<script>
import { defineComponent } from '@vue/composition-api';
import AttackType from './attack-type.vue';
export default defineComponent({
  name: 'TopRank',
  components: { AttackType },
  props: {
    rank: [Number, String],
    model: {
      type: Object,
      default: () => ({
        data: [],
      }),
    },
  },
  setup() {},
});
</script>
<style lang="scss" scoped>
.top-rank {
  --size: calc(100vw / 120);
  font-size: var(--size);
  display: flex;
  flex-direction: column;
  width: 100%;
  .header {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;
    top: 1em;
    .head {
      display: block;
      width: 5.4em;
      height: 5.4em;
      border-radius: 50%;
      overflow: hidden;
      position: relative;
      top: 0.625em;
      z-index: 1;
    }

    .name {
      position: relative;
      z-index: 2;
      height: 1.5em;
      border-radius: 0.75em;
      font-size: 1em;
      font-family: PingFangSC-Medium, PingFang SC;
      color: #ffffff;
      line-height: 1.375em;
      padding: 0 0.625em;
    }

    .score {
      font-size: 1.875em;
      font-family: Arial-BoldItalicMT, Arial;
      .unit {
        font-size: calc(var(--size) * 0.75);
        font-family: PingFangSC-Semibold, PingFang SC;
        font-weight: 600;
        color: #ffffff;
      }
    }
  }
  .body {
    flex: 2;
    background-size: 100% 100%;
    background-repeat: no-repeat;
    background-position: center 0;
    display: flex;
    padding: 0.625em;
  }

  &.rank-1 {
    .head {
      border: 1px solid #e9c17b;
    }

    .name {
      background: #e9c17b;
    }

    .score {
      color: #e9c17b;
    }
    .body {
      background-image: url(~@/assets/img/visual-screen/screen-2/stage_first.png);
    }
  }
  &.rank-2 {
    .head {
      border: 1px solid #98c0c1;
    }
    .name {
      background: #98c0c1;
    }

    .score {
      color: #98c0c1;
    }
    .body {
      background-image: url(~@/assets/img/visual-screen/screen-2/stage_second.png);
    }
  }
  &.rank-3 {
    .head {
      border: 1px solid #d88948;
    }

    .name {
      background: #d88948;
    }

    .score {
      color: #d88948;
    }

    .body {
      background-image: url(~@/assets/img/visual-screen/screen-2/stage_third.png);
    }
  }
}
</style>
