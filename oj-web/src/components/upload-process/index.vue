<template>
  <div v-if="isShowProgress" class="popContainer">
    <div class="progress-area">
      <div class="progress">
        <div class="progress-outer">
          <div
            class="progress-inner"
            :style="{
              width: percentage + '%',
            }"
          ></div>
        </div>
        <div class="tip">{{ format(percentage) }}</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    percentage: {
      type: Number,
      default: 0,
    },
    isShowProgress: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      uploading: false,
    };
  },
  created() {},
  mounted() {},
  methods: {
    format(percentage) {
      if (percentage == 100) {
        return this.$t('common.plzWaitUpload');
      } else {
        return (
          this.$t('common.uploading') +
          this.$t('common.process') +
          `${percentage}%`
        );
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.popContainer {
  position: absolute;
  z-index: 9;
  background-color: var(--mask-color);
  margin: 0;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  transition: opacity 0.3s;
  .progress-area {
    position: relative;
    width: 100%;
    height: 100%;
    .progress {
      position: absolute;
      width: 40%;
      z-index: 10;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      .progress-outer {
        width: 100%;
        height: 18px;
        border-radius: 14px;
        background-color: var(--neutral0);
        .progress-inner {
          height: 18px;
          border-radius: 14px;
          background-color: var(--primary-color);
        }
      }
    }
    .tip {
      font-size: 14px;
      color: var(--green-color);
      text-align: center;
    }
  }
}
</style>
