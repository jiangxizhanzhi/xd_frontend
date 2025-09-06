<template>
  <!-- 排行榜-->
  <cb-scroll
    ref="table"
    :data="listData"
    class="seamless-warp"
    :class-option="optionSingleHeight"
  >
    <ul class="item">
      <li v-for="(item, i) in listData">
        <span
          class="number"
          :class="{
            number1: i === 0,
            number2: i === 1,
            number3: i === 2,
            numbers: i !== 0 && i !== 1 && i !== 2,
          }"
          v-text="i + 1"
        ></span>
        <span
          :class="{
            comma1: i === 0,
            comma2: i === 1,
            comma3: i === 2,
            commas: i !== 0 && i !== 1 && i !== 2,
          }"
        ></span>
        <span class="name" v-text="item.name"></span>
        <span class="role_name" v-text="item.role_name"></span>
        <span>完成任务</span
        ><span class="finished" v-text="item.finished"></span>
        <span
          class="score"
          v-text="item.score"
          :class="{
            score1: i === 0,
            score2: i === 1,
            score3: i === 2,
            scores: i !== 0 && i !== 1 && i !== 2,
          }"
        ></span
        ><span> 分</span>
      </li>
    </ul>
  </cb-scroll>
</template>
<script>
export default {
  name: 'AttackGrandScroll',
  props: {
    listData: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {};
  },
  created() {},
  mounted() {},
  methods: {},
  watch: {
    listData: {
      immediate: true,
      deep: true,
      handler(newVal, oldVal) {
        this.$refs.table && this.$refs.table.reset();
      },
    },
  },
  computed: {
    // 控制滚动方向，时间停顿等 公告
    optionSingleHeight() {
      return {
        // 滚动方向
        direction: 1,
        limitMoveNum: 3,
      };
    },
  },
};
</script>

<style scoped lang="scss">
.seamless-warp {
  width: 100%;
  overflow: hidden;
  li {
    list-style-type: none;
    font-size: var(--font-size-14);
    font-family: Microsoft YaHei;
    font-weight: 400;
    color: var(--white-color);
    line-height: var(--li-line-height);
    text-shadow: var(--li-text-shadow);
    .name,
    .role_name {
      display: inline-block;
      width: var(--role_name-width);
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
      position: relative;
      top: var(--role_name-top);
    }
    .role_name {
      margin: var(--role_name-mg);
    }
    .finished {
      margin-left: var(--finished-mg-lf);
    }
    .number2 {
      color: var(--number2-color);
    }
    .numbers {
      margin-right: var(--numbers-mg-rg);
    }
    .comma1,
    .comma2,
    .comma3 {
      display: inline-block;
      width: var(--comma-width);
      height: var(--comma-height);
      margin-right: var(--comma-mg-rg);
    }
    .comma1 {
      background: var(--comma1-color);
    }
    .comma2 {
      background: var(--comma2-color);
    }
    .comma3 {
      background: var(--comma3-color);
    }
    .score1,
    .score2,
    .score3,
    .number1,
    .number2,
    .number3 {
      font-size: var(--font-size-20);
      font-family: Heiti SC;
      font-weight: bold;
      font-style: italic;
    }
    .score1,
    .score2,
    .score3 {
      margin-left: var(--score-mg-lf);
    }
    .scores {
      margin-left: var(--scores-mg-lf);
    }
    .score1,
    .number1 {
      color: var(--scores-color);
    }
    .score2 {
      color: var(--scores2-color);
    }
    .score3,
    .number3 {
      color: var(--numbers-color);
    }
  }
}
</style>
