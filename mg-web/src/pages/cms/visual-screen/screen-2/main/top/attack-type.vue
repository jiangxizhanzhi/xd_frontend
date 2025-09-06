<template>
  <div class="chart-wrapper">
    <div class="index">
      <span v-for="(_, i) in model" :key="i">{{ i + 1 }}</span>
    </div>
    <div class="name">
      <span v-for="(item, i) in model" :key="i">{{ item.name }}</span>
    </div>
    <div class="progress">
      <div v-for="(item, i) in width" :key="i">
        <div class="bar">
          <div :style="{ width: item }" class="slide"></div>
        </div>
      </div>
    </div>
    <div class="score">
      <span v-for="(item, i) in model" :key="i">{{ item.count }}</span>
    </div>
  </div>
</template>
<script>
import { defineComponent, watch, ref, nextTick } from '@vue/composition-api';
export default defineComponent({
  name: 'AttackType',
  props: {
    model: {
      type: Array,
      default: () => [],
    },
  },
  setup(prop) {
    const width = ref([0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);

    watch(
      () => prop.model,
      (val) => {
        nextTick(() => {
          width.value = val.map((el) => computeWidth(el.count));
        });
      },
      {
        immediate: true,
        deep: true,
      },
    );

    const computeWidth = (count) => {
      let max = Math.max(...prop.model.map((el) => el.count)) * 1.2;
      return parseFloat((count / max) * 100).toFixed(2) + '%';
    };

    return {
      width,
      computeWidth,
    };
  },
});
</script>
<style lang="scss" scoped>
.chart-wrapper {
  display: flex;
  font-size: calc(120vw / 120);
  .index,
  .name,
  .progress,
  .score {
    display: flex;
    flex-direction: column;
    & > * {
      height: 10%;
      display: flex;
      align-items: center;
    }
  }

  .index {
    width: 1.25em;
    font-size: 0.875em;
    color: #ffffff;

    span:nth-child(1) {
      color: #e9c17b;
      font-size: 1.125em;
    }
    span:nth-child(2) {
      color: #c1dfdf;
      font-size: 1.125em;
    }
    span:nth-child(3) {
      font-size: 1.125em;
      color: #d88948;
    }
  }

  .name {
    color: #ffffff;
    font-size: 0.75em;
    line-height: 1em;
    min-width: 2.5em;
  }

  .progress {
    flex: 1;
    width: 0;
    margin: 0 1em;

    .bar {
      width: 100%;
      height: 0.5em;
      background: rgba(27, 70, 185, 0.14);
      border-radius: 0.25em;
      overflow: hidden;
      .slide {
        width: 0;
        height: 0.5em;
        background: linear-gradient(90deg, #3e86f7 0%, #6dc5e9 100%),
          linear-gradient(270deg, #17f1fc 0%, #10affb 100%);
        border-radius: 0.25em;
        transition: width 1s cubic-bezier(0.89, 0.39, 0.31, 0.66);
      }
    }
  }

  .score {
    font-size: 0.75em;
    color: #ffffff;

    span:nth-child(1) {
      color: #e9c17b;
    }
    span:nth-child(2) {
      color: #c1dfdf;
    }
    span:nth-child(3) {
      color: #d88948;
    }
  }
}
</style>
