<template>
  <!-- 攻防战报/演练动态 -->
  <div class="ag-scroll">
    <cb-scroll
      ref="table"
      :data="listData"
      class="seamless-warp"
      :class-option="optionSingleHeight"
    >
      <ul class="item">
        <li v-for="(item, index) in listData" :key="index">
          <span class="date" v-text="item.action_time"></span>
          <span class="title" v-text="item.mission_name"></span>
        </li>
      </ul>
    </cb-scroll>
  </div>
</template>
<script>
export default {
  name: 'AttackGrandScroll',
  props: {
    agTitle: {
      type: String,
      default: '',
    },
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
        limitMoveNum: 1,
      };
    },
  },
};
</script>

<style scoped lang="scss">
.ag-scroll {
  height: 100%;
}
.seamless-warp {
  width: 100%;
  overflow: hidden;
  flex: 1;
  height: 100%;
  ul {
    padding-left: var(--ag-scroll-left);
    li {
      list-style: none;
      color: var(--white-color);
      font-size: var(--font-size-14);
      font-family: Microsoft YaHei;
      font-weight: 400;
      // line-height: var(-ag-line-height);
      span:last-child {
        margin-left: var(--ag-span-left);
      }
    }
  }
}
</style>
