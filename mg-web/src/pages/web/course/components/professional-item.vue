<template>
  <div>
    <div class="contain">
      <div
        class="professional-item"
        v-for="(item, index) in professinalArr5"
        :key="professinalArr5.resource_id"
      >
        <div
          class="professional-item-left"
          :class="[index + 1 <= taskData.length ? 'TColor' : 'KColor']"
        >
          <div class="icon" v-if="index + 1 <= taskData.length">T</div>
          <div class="icon" v-else>K</div>
          <div class="text">{{ item.resource_id }}</div>
        </div>
        <div class="professional-item-right">
          <div class="text" :title="item.content">{{ item.content }}</div>
        </div>
      </div>
      <template v-if="showall">
        <div
          class="professional-item"
          v-for="(item, index) in professinalArrMore"
          :key="professinalArrMore.resource_id"
        >
          <div
            class="professional-item-left"
            :class="[index + 6 <= taskData.length ? 'TColor' : 'KColor']"
          >
            <div class="icon" v-if="index + 6 <= taskData.length">T</div>
            <div class="icon" v-else>K</div>
            <div class="text">{{ item.resource_id }}</div>
          </div>
          <div class="professional-item-right">
            <div class="text" :title="item.content">{{ item.content }}</div>
          </div>
        </div>
      </template>
    </div>
    <div class="iconDiv">
      <div class="iconBgc">
        <cb-iconfont
          class="icon"
          v-if="!showall"
          type="icon-xiala"
          themedColor="font-color-primary"
          @click="expand"
          :size="14"
        ></cb-iconfont>

        <cb-iconfont
          class="icon"
          v-else
          type="icon-shouqi"
          themedColor="font-color-primary"
          @click="shrink"
          :size="14"
        ></cb-iconfont>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'professionalItem',
  props: {
    taskData: {
      type: Array,
      default: () => [],
    },
    professinalArr: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      showall: false,
    };
  },
  created() {},
  computed: {
    professinalArr5() {
      return this.professinalArr.slice(0, 5);
    },
    professinalArrMore() {
      return this.professinalArr.slice(5);
    },
  },
  methods: {
    expand() {
      if (this.professinalArr.length > 5) {
        this.showall = true;
      }
    },
    shrink() {
      if (this.professinalArr.length > 5) {
        this.showall = false;
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.iconDiv {
  display: flex;
  justify-content: flex-end;
  .iconBgc {
    background-color: var(--condition-bg);
    height: 16px;
    width: 16px;
    display: flex;
    justify-content: center;
    align-items: center;
    .icon {
      cursor: pointer;
    }
  }
}
.TColor {
  color: var(--primary-color);
  position: relative;
}
.TColor::before {
  content: '';
  position: absolute;
  inset: 0;
  background: var(--primary-color);
  opacity: 0.1;
}
.KColor {
  position: relative;
  color: var(--orange-color);
}
.KColor::before {
  content: '';
  position: absolute;
  inset: 0;
  background: var(--orange-color);
  opacity: 0.1;
}
.contain {
  display: flex;
  flex-wrap: wrap;
  & > div {
    width: calc((100% - 64px) / 5);
    margin: 0 16px 16px 0;
    background-color: var(--bg-color-secondary);
    height: 71px;
  }
  & > div:nth-child(5n + 5) {
    margin-right: 0 !important;
  }
  .professional-item {
    display: flex;
    &-left {
      width: 71px;
      height: 71px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      .icon {
        font-family: Arial-BoldMT, Arial;

        font-size: 32px;
      }
    }
    &-right {
      display: flex;
      align-items: center;
      margin: 8px;
      font-size: 14px;
      flex: 1;
      .text {
        line-height: 20px;
        max-height: 40px;
        display: -webkit-box;
        /*! autoprefixer: off */
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
        overflow: hidden;
      }
    }
  }
}
</style>
