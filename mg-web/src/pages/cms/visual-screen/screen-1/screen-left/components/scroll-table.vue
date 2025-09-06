<template>
  <div class="traffic-event-table">
    <div class="header com-wrapper">
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
  data() {
    return {
      optionSingleHeight: {
        direction: 1,
        singleHeight: this.data.length * 44,
        waitTime: 2500,
        limitMoveNum: 4,
      },
      lineHeight: 44,
    };
  },
  computed: {},
  mounted() {
    let height = this.$refs.test.offsetHeight / 4;
    this.lineHeight = height;
    this.optionSingleHeight.singleHeight = this.data.length * height;
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
  .header {
    height: var(--scroll-table-theader-height) !important;
    line-height: var(--scroll-table-theader-height) !important;
    background: var(--scroll-table-header-bg);
    color: var(--scroll-table-font-header-color);
    font-size: var(--font-size-12);

    .header-item {
      &:first-child {
        padding-left: var(--scroll-table-tr-pd-left);
      }
    }
  }

  .com-wrapper {
    display: flex;
    // height: var(--scroll-table-tr-height);
    // height: calc(100% / 4);
    // line-height: var(--scroll-table-tr-height);
    color: var(--scroll-table-font-header-color);
    font-size: var(--font-size-12);

    &:nth-child(2n) {
      background: var(--scroll-table-tr-2n-bg);
    }

    .item-wrapper {
      flex: 1;
      text-align: center;

      &:first-child {
        padding-left: var(--scroll-table-tr-pd-left);
      }
    }
  }

  .scroll-warp {
    overflow: hidden;

    .scroll-box {
      height: 100%;
    }
  }
}
</style>
