<template>
  <div class="container-box" ref="container">
    <div class="content" ref="content">
      <template v-for="(item, index) in dataVisible">
        <div
          class="content-item"
          :key="'visible-item' + index"
          v-if="item !== '...'"
          :title="item"
        >
          {{ item.length > 6 ? item.slice(0, 6) + '...' : item }}
        </div>
        <cb-popover
          :key="'visible-item' + index"
          popper-class="overflow-hide-realize knowledge-points-list-overflow"
          trigger="hover"
          placement="bottom-start"
          v-else
        >
          <div class="hidden-content">
            <div
              class="hidden-content-item"
              v-for="(itemHide, indexHide) in dataHidden"
              :key="'hide-item' + indexHide"
              :title="itemHide"
            >
              {{
                itemHide.length > 6 ? itemHide.slice(0, 6) + '...' : itemHide
              }}
            </div>
          </div>
          <div slot="reference" class="content-item">
            {{ item }}
          </div>
        </cb-popover>
      </template>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    dataList: {
      type: Array,
      default: () => [],
    },
  },
  created() {
    window.addEventListener('resize', this.debounce);
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.debounce);
  },
  mounted() {
    this.dataVisible = _.cloneDeep(this.dataList);
    this.$nextTick(() => {
      this.getNewDataList();
    });
  },
  data() {
    return {
      dataVisible: [],
      dataHidden: [],
      timer: null,
    };
  },
  watch: {
    dataList() {
      this.dataVisible = _.cloneDeep(this.dataList);
    },
  },
  methods: {
    // 裁剪数组并渲染数据的方法，必须在回调中使用该方法
    getNewDataList() {
      const containerBoxWidth = this.$refs.container.offsetWidth;
      const contentBoxWidth = this.$refs.content.offsetWidth;
      if (contentBoxWidth > containerBoxWidth) {
        // 需要裁剪数组，并重新渲染dom; 当前dataVisible - 1, 当前dataHidden + 1
        if (this.dataVisible.indexOf('...') === this.dataVisible.length - 1) {
          this.dataVisible.pop();
        }
        const item = this.dataVisible.pop();
        this.dataHidden.unshift(item);
        this.dataVisible.push('...');
      } else {
        return;
      }
      this.$nextTick(() => {
        this.getNewDataList();
      });
    },

    // handlerResize resize绑定事件
    handlerResize() {
      this.dataVisible = _.cloneDeep(this.dataList);
      this.dataHidden = [];
      this.$nextTick(() => {
        this.getNewDataList();
      });
    },

    // debounce 节流
    debounce(delay) {
      const delays = delay || 500;
      if (this.timer) {
        clearTimeout(this.timer);
      } else {
        this.timer = setTimeout(() => {
          this.timer = null;
          this.handlerResize();
        }, delays);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.container-box {
  width: 100%;
  height: 100%;
  overflow: hidden;
  position: relative;
  .content {
    height: 100%;
    // margin-left: -2px;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    position: absolute;
    .content-item {
      height: 22px;
      margin: 4px 2px;
      padding: 0 5px;
      line-height: 22px;
      text-align: center;
      font-size: 12px;
      color: var(--neutral8);
      white-space: nowrap;
      background: var(--neutral0);
      border-radius: 2px;
    }
  }
}
</style>
<style lang="scss">
.knowledge-points-list-overflow.overflow-hide-realize {
  padding: 8px 10px;
  .hidden-content {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    .hidden-content-item {
      height: 22px;
      margin: 4px 2px;
      padding: 0 5px;
      line-height: 22px;
      text-align: center;
      font-size: 12px;
      color: var(--neutral8);
      white-space: nowrap;
      background: var(--neutral0);
      border-radius: 2px;
    }
  }
  ::v-deep .el-popover {
    min-width: none;
  }
}
.knowledge-points-list-overflow.overflow-hide-realize.el-popover {
  min-width: 20px;
}
</style>
