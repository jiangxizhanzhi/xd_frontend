<template>
  <div
    :class="
      color === 'red'
        ? 'attack-score-redComponent'
        : 'attack-score-blueComponent'
    "
  >
    <span class="acc-title">攻击得分</span>
    <span class="acc-number">{{ score }}</span>
    <span class="acc-score">分</span>
  </div>
</template>

<script>
export default {
  name: 'AttackScore',
  props: {
    color: {
      type: String,
      default: 'red',
    },

    score: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {};
  },
  created() {},
  mounted() {},
  methods: {},
  watch: {},
};
</script>

<style scoped lang="scss">
.attack-score-redComponent,
.attack-score-blueComponent {
  flex: 1;
  width: 100%;
  height: 70px;
  line-height: 70px;
  //todo 背景图
  .acc-title {
    font-size: var(--font-size-14);
    font-family: Microsoft YaHei;
    font-weight: bold;
    color: #ffffff;
    margin-left: 71px;
  }
  .acc-number {
    font-size: 24px;
    font-weight: bold;

    margin: 0px 0px 0px 5px;
  }
  .acc-score {
    font-size: var(--font-size-12);
    font-weight: 400;
    color: #ffffff;
  }
}
.attack-score-redComponent {
  .acc-number {
    color: var(--red-color);
  }
}
.attack-score-blueComponent {
  .acc-number {
    color: var(--blue-color);
  }
}
</style>
