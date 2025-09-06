<template>
  <div class="traffic-event-table">
    <div class="header com-wrapper">
      <div v-if="indexFlag" class="header-item item-wrapper one-overflow">
        {{ $t('monitorReplay.sort') }}
      </div>
      <div
        v-for="item in cols"
        :key="item.label"
        class="header-item item-wrapper one-overflow"
        :title="item.label"
      >
        {{ item.label }}
      </div>
    </div>
    <div class="scroll-warp">
      <template v-if="isScroll">
        <cb-scroll
          v-if="data.length !== 0"
          ref="table"
          :data="data"
          class="scroll-box"
          :classOption="optionSingleHeight"
        >
          <div v-for="(item, index) in data" :key="index" class="com-wrapper">
            <template v-if="indexFlag">
              <div class="item-wrapper one-overflow">{{ index + 1 }}</div>
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
              </div></template
            >
            <template v-else>
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
              </div></template
            >
          </div>
        </cb-scroll>
      </template>
      <template v-else>
        <div v-for="(item, index) in data" :key="index" class="com-wrapper">
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
      </template>
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
    isScroll: {
      type: Boolean,
      default: true,
    },
    indexFlag: {
      type: Boolean,
      default: false,
    },
    limitNum: {
      type: Number,
      default: 3,
    },
  },
  data() {
    return {};
  },

  computed: {
    optionSingleHeight() {
      return {
        limitMoveNum: this.limitNum,
      };
    },
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
  .header {
    height: 36px;
    line-height: 36px;
    background: var(--neutral1);
    color: var(--neutral8);
    font-size: 14px;
    .header-item {
      &:first-child {
        padding-left: 20px;
      }
    }
  }
  .com-wrapper {
    display: flex;
    height: 36px;
    line-height: 36px;
    color: var(--neutral8);
    font-size: 14px;
    &:nth-child(2n) {
      background: var(--bg-color-2);
    }
    .item-wrapper {
      flex: 1;
      text-align: center;
      &:first-child {
        padding-left: 20px;
      }
    }
  }
  .scroll-warp {
    height: calc(100% - 36px);
    .scroll-box {
      height: 100%;
      overflow: hidden;
    }
  }
}
</style>
