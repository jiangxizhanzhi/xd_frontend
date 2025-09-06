<template>
  <div class="event-table">
    <div class="header com-wrapper">
      <div
        v-for="item in cols"
        :key="item.label"
        class="header-item item-wrapper one-overflow"
        :title="item.label"
        :style="{ width: item.width + '%' }"
      >
        {{ item.label }}
      </div>
    </div>
    <div class="scroll-warp" ref="wrapRef">
      <div v-if="data.length > 0" class="scroll-box" :key="data.length">
        <div
          v-for="(item, index) in data"
          :key="index"
          class="com-wrapper wrapper-row"
          :style="{ height: lineHeight + 'px', lineHeight: lineHeight + 'px' }"
        >
          <div
            v-for="(col, i) in cols"
            :key="i"
            class="item-wrapper one-overflow"
            :class="col.class"
            :title="item[col.prop]"
            :style="{ width: col.width + '%' }"
          >
            <slot
              v-if="col.slot"
              :name="col.slot"
              :col="col"
              :data="item"
            ></slot>
            <template v-else>
              {{ item[col.prop] || '-' }}
            </template>
          </div>
        </div>
      </div>
      <!-- 无数据 -->
      <div v-else class="no-data">
        <div class="info">
          <cb-iconfont type="icon-zanwuziyuan" size="56"></cb-iconfont>
          <div>{{ $t('m.noData') }}</div>
        </div>
      </div>
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
      lineHeight: 36,
    };
  },
  computed: {},
  mounted() {},
  watch: {},
};
</script>
<style lang="scss" scoped>
.event-table {
  width: 100%;
  height: 100%;
  font-size: 14px;
  color: #ffffff;
}

.one-overflow {
  padding: 0px 16px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.wrapper-row {
  position: relative;
  animation-name: wrapper-row;
  animation-duration: 2s;
}
@keyframes wrapper-row {
  0% {
    top: -36px;
  }
  100% {
    top: 0px;
  }
}

.com-wrapper {
  display: flex;
  padding: 0 15px;
}
.header {
  height: 40px;
  background: var(--neutral1);
  line-height: 40px;
  color: var(--neutral8);
}
.scroll-warp {
  height: calc(100% - 40px);
  overflow: auto;
}
.scroll-warp::-webkit-scrollbar {
  width: 4px;
}
.scroll-warp::-webkit-scrollbar-thumb {
  background: var(--scrollbar-color);
  border-radius: 4px;
}
.no-data {
  height: 100%;
  width: 100%;
  text-align: center;
  position: relative;
  .info {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    font-size: 14px;
  }
}
</style>
