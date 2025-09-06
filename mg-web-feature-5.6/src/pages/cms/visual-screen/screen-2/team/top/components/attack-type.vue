<template>
  <div class="attack-type">
    <div class="top">
      <div>流量: {{ unit(model.total_traffic_size) || 0 }}M</div>
      <div>攻击: {{ model.total_attack_number || 0 }}次</div>
    </div>
    <div class="body">
      <div class="title">攻击手法占比TOP5</div>
      <div class="chart">
        <div class="name">
          <span v-for="(item, i) in model.attack_way_list" :key="i">{{
            item.type
          }}</span>
        </div>
        <div class="progress">
          <div v-for="(item, i) in width" :key="i">
            <div class="bar">
              <div :style="{ width: item }" class="slide"></div>
            </div>
          </div>
        </div>
        <div class="score">
          <span v-for="(item, i) in model.attack_way_list" :key="i"
            >{{ item.attack_traffic_percent }}%</span
          >
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { defineComponent, watch, ref, nextTick } from '@vue/composition-api';
export default defineComponent({
  name: 'AttackType',
  props: {
    model: {
      type: Object,
      default: () => ({
        attack_way_list: [],
      }),
    },
  },
  setup(prop) {
    const width = ref(['0', '0', '0', '0', '0']);

    watch(
      () => prop.model,
      (val) => {
        nextTick(() => {
          width.value = val.attack_way_list.map(
            (el) => el.attack_traffic_percent + '%',
          );
        });
      },
      {
        immediate: true,
        deep: true,
      },
    );

    const unit = (num) => {
      return (num / 1024 / 1024).toFixed(2);
    };

    return {
      width,
      unit,
    };
  },
});
</script>
<style lang="scss" scoped>
.attack-type {
  --size: calc(100vw / 120);
  font-size: calc(100vw / 120);
  width: 100%;
  height: 100%;
  max-height: 12.5em;
  display: flex;
  flex-direction: column;
  align-self: flex-end;
  .top {
    padding: calc(var(--size) * 0.625) 0;
    display: flex;
    justify-content: space-around;
    font-size: 0.75em;
    color: #ffffff;
  }

  .body {
    background: rgba(7, 31, 80, 0.3);
    display: flex;
    flex-direction: column;
    flex: 1;
    height: 0;
    padding-top: 0.5em;
    .title {
      position: relative;
      padding: 0 calc(var(--size) * 0.5);
      font-size: 0.75em;
      font-weight: bold;
      color: #ffffff;
      margin-bottom: calc(var(--size) * 0.5);

      &::before {
        position: absolute;
        content: '';
        height: 100%;
        width: 0.125em;
        top: 0;
        left: 0;
        background: #55b7ff;
      }
    }

    .chart {
      flex: 1;
      height: 0;
      display: flex;
      padding: 0 0.625em;

      .name,
      .progress,
      .score {
        display: flex;
        flex-direction: column;
        font-size: 0.75em;

        & > * {
          height: 20%;
          display: flex;
          align-items: center;
        }
      }

      .name {
        color: #ffffff;
        font-size: 0.875em;
        line-height: var(--size);
        min-width: calc(var(--size) * 2.5);
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
            transition: all 1s cubic-bezier(0.89, 0.39, 0.31, 0.66);
          }
        }
      }

      .name,
      .score {
        span:nth-child(1) {
          color: #4ca0eb;
        }
        span:nth-child(2) {
          color: #0cd39c;
        }
        span:nth-child(3) {
          color: #d88948;
        }
        span:nth-child(4) {
          color: #5564e6;
        }
        span:nth-child(5) {
          color: #f25549;
        }
      }
    }
  }
}
</style>
