<template>
  <div class="traffic-event-table">
    <div class="header">
      <div
        v-for="item in cols"
        :key="item.label"
        class="header-item item-wrapper one-overflow"
        :title="item.label"
      >
        {{ item.label }}
      </div>
    </div>
    <div class="scroll-warp flex-fill-col" ref="test">
      <cb-scroll
        v-if="data.length !== 0"
        ref="table"
        :data="data"
        class="scroll-box"
        :class-option="optionSingleHeight"
      >
        <div
          v-for="(item, index) in data"
          :key="index"
          class="com-wrapper"
          :style="{ height: lineHeight + 'px', lineHeight: lineHeight + 'px' }"
        >
          <div
            v-for="(col, i) in cols"
            :key="i"
            class="item-wrapper one-overflow"
            :class="col.class"
            :title="item[col.prop]"
          >
            <slot
              v-if="col.slot"
              :name="col.slot"
              :col="col"
              :data="item"
            ></slot>
            <template v-else>
              {{ item[col.prop] }}
            </template>
          </div>
        </div>
        <!-- <div class="space"></div> -->
      </cb-scroll>
    </div>
  </div>
</template>
<script>
export default {
  components: {},
  props: {
    data: {
      type: Array,
      default: () => [],
    },
    cols: {
      type: Array,
      default: () => [],
    },
  },
  computed: {},
  watch: {
    data: {
      immediate: true,
      deep: true,
      handler(newVal, oldVal) {
        if (this.$refs.table) {
          this.$refs.table.reset();
        }
      },
    },
  },
  mounted() {
    let height = this.$refs.test.offsetHeight / 4;
    this.lineHeight = height;
    this.optionSingleHeight.singleHeight = this.data.length * height;
  },
  data() {
    return {
      optionSingleHeight: {
        direction: 1,
        // 单行一次滚动高度,这个高度是一条公告的2倍，一条公告的高度在
        //  这个高度最好事动态的，设置为表格的body高度，tr的倍数
        singleHeight: this.data.length * 44,
        // 等待时间
        waitTime: 2500,
        limitMoveNum: 4,
      },
      lineHeight: 44,
    };
  },
};
</script>
<style lang="scss" scoped>
.one-overflow {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.traffic-event-table {
  height: 100%;
  color: var(--scroll-table-color);
  display: flex;
  flex-direction: column;
  font-size: var(--font-size-12);
  .header {
    height: var(--log-table-header);
    line-height: var(--log-table-header);
    background: var(--scroll-table-header-bg);
    display: flex;
    .item-wrapper {
      flex: 1;
      text-align: center;
      position: relative;
    }
  }
  .com-wrapper {
    display: flex;
    height: var(--log-table-tr);
    line-height: var(--log-table-tr);
    &:nth-child(2n) {
      background: var(--scroll-table-tr-bg);
    }
    .item-wrapper {
      flex: 1;
      text-align: center;
      position: relative;
    }
  }
  .scroll-warp {
    .scroll-box {
      height: 100%;
      overflow: hidden;
    }
  }
  // 留白高度为一个tr的高度
  .space {
    height: var(--log-table-tr);
  }
}
</style>
