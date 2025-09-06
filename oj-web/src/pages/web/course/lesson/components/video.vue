<template>
  <div class="guide-video" oncontextmenu="javascript: return false;">
    <video
      id="course-video"
      controls="controls"
      controlsList="nodownload"
      @timeupdate="videoTimeUpdate"
    >
      <source :src="frameUrl" type="video/mp4" />
    </video>
  </div>
</template>

<script>
import { videoCheckpointReport } from '@/api/course.js';
export default {
  name: 'Video',
  props: {
    isSingle: {
      type: Boolean,
      default: null,
    },
    frameUrl: {
      type: String,
      default: '',
    },
    // 检查点列表
    checkPoints: {
      type: Object,
      default: {},
    },
    // 课时ID
    businessId: {
      type: String,
      default: '',
    },
  },
  methods: {
    videoTimeUpdate(e) {
      this.paused = e?.target?.paused;
      const currentTime = e?.srcElement?.currentTime || 0;
      this.currentSecond = Math.floor(currentTime);
    },
  },
  data() {
    return {
      currentSecond: 0,
      paused: true, // 是否正在播放
      video: null,
    };
  },
  mounted() {
    this.video = document.getElementById('course-video');
  },
  watch: {
    currentSecond: {
      handler(nv, ov) {
        let checkpoints = [
          ...this.checkPoints.custom_points,
          ...this.checkPoints.points,
        ];
        // 当用户拖拽或者点击进度条时paused值为true，此时不计为播放状态
        if (this.paused) return;
        const currentPoint = checkpoints?.find((item) => item.time === nv);
        if (currentPoint) {
          const params = {
            business_id: this.businessId,
            path: this.frameUrl,
            progress: currentPoint.progress,
            time: currentPoint.time,
          };
          videoCheckpointReport(params);
          // 视频互动
          if (currentPoint.pop_up) {
            this.video?.pause();
            this.$confirm(this.$t('course.confirmWatch'), {
              type: 'warning',
            }).then(() => {
              this.video?.play();
            });
          }
        }
      },
      immediate: true,
    },
  },
};
</script>

<style scoped lang="scss">
.guide-video {
  width: 100%;
  height: 100%;
  video {
    width: 100%;
    height: 100%;
    display: block;
    background: var(--font-color-third);
  }
}
</style>
