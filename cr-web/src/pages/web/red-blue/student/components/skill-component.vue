<template>
  <div>
    <div
      class="skill-style"
      ref="skillStyle"
      :class="{
        'two-overflow': !animationFold,
      }"
    >
      <div
        v-for="(item, k) in skillList"
        :key="k"
        class="skill-tag one-overflow"
        :title="item"
      >
        {{ item }}
      </div>
    </div>
    <div
      class="btn-wrap"
      @click.stop="animationFold = !animationFold"
      v-if="showArrow"
    >
      <cb-iconfont
        ref="xialaRef"
        type="icon-xiala1"
        size="16"
        class="triangle-color"
        :class="{
          arrowTransform: !animationFold,
          arrowTransformReturn: animationFold,
        }"
      ></cb-iconfont>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    skillList: {
      type: Array,
      default() {
        return [];
      },
    },
  },
  data() {
    return {
      animationFold: false,
      showArrow: false,
    };
  },
  watch: {
    skillList: {
      handler(nv, ov) {
        if (nv !== ov) {
          this.$nextTick(() => {
            const scrollHeight = this.$refs.skillStyle.scrollHeight;
            const offsetHeight = this.$refs.skillStyle.offsetHeight;
            if (scrollHeight > offsetHeight) {
              this.showArrow = true;
            } else {
              this.showArrow = false;
            }
          });
        }
      },
      immediate: true,
      deep: true,
    },
  },
};
</script>

<style lang="scss" scoped>
.skill-style {
  margin-top: 10px;
  .skill-tag {
    display: inline-block;
    background-color: var(--neutral0);
    height: 22px;
    padding: 0 8px;
    line-height: 22px;
    font-size: 12px;
    color: var(--neutral8);
    border-radius: 2px;
    max-width: 100px;
    margin: 4px;
    vertical-align: middle;
  }
  .cb-tag {
    height: 24px;
    line-height: 24px;
  }
}
.btn-wrap {
  position: absolute;
  right: -10px;
  bottom: 6px;
  .triangle-color {
    color: var(--neutral7);
    cursor: pointer;
  }
}
.arrowTransform {
  transition: 0.2s;
  transform-origin: center;
  transform: rotateZ(0deg);
}

.arrowTransformReturn {
  transition: 0.2s;
  transform-origin: center;
  transform: rotateZ(180deg);
}
</style>
