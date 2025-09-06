<template>
  <!-- 攻防战报/演练动态 -->
  <div class="ag-scroll">
    <cb-scroll
      ref="refScroll"
      :data="listData"
      class="seamless-warp"
      :class-option="optionSingleHeight"
    >
      <ul class="item">
        <li v-for="(item, index) in listData" :key="index">
          <span class="date">{{
            item.action_time.split(' ')[1].split(':').slice(0, 2).join(':')
          }}</span>
          <span class="title" v-text="item.user"></span>
          <span>{{ dataType[item.action_type - 1] }}</span>
        </li>
      </ul>
    </cb-scroll>
  </div>
</template>
<script>
import { watch, ref, computed } from '@vue/composition-api';
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
  setup(props) {
    const refScroll = ref(null);
    const dataType = [
      '下发任务',
      '开放解题',
      '关闭解题',
      '上报任务',
      '机评成功',
      '机评失败',
      '人评成功',
      '人评失败',
      '人评驳回',
    ];
    const optionSingleHeight = computed(() => {
      return {
        // 滚动方向
        direction: 1,
        limitMoveNum: 4,
      };
    });
    watch(
      () => props.listData,
      (newVal, oldVal) => {
        if (refScroll.value) {
          refScroll.value.reset();
        }
      },
      {
        immediate: true,
        deep: true,
      },
    );
    return { refScroll, optionSingleHeight, dataType };
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
      height: var(--li-height);
      // line-height: var(-ag-line-height);
      span:last-child {
        margin-left: var(--ag-span-left);
      }
      span {
        display: inline-block;
        height: 100%;
        line-height: var(--li-height);
        overflow: hidden;
      }
      .title {
        display: inline-block;
        width: var(--li-name-width);
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
    }
  }
}
</style>
