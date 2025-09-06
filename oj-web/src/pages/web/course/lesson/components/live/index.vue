<template>
  <cb-dialog
    v-if="dialogLive"
    :visible.sync="dialogLive"
    :modal="false"
    class="live-dialog"
    :before-close="beforeClose"
  >
    <template slot="title">
      <div>{{ $t('course.watchLive') }}</div>
    </template>
    <web-rtc :rtcUrl="rtcUrlLocal"></web-rtc>
  </cb-dialog>
</template>

<script>
import webRtc from './web-rtc';
import { getPublishUrl } from '../../../../../../api/course';

export default {
  name: 'index',
  components: { webRtc },
  props: {
    rtcUrl: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      dialogLive: false,
      rtcUrlLocal: '',
    };
  },
  watch: {
    dialogLive: {
      handler(nv, ov) {
        if (nv) {
          if (!this.rtcUrl) {
            this.watchLive();
          } else {
            this.rtcUrlLocal = this.rtcUrl;
          }
        }
      },
    },
  },
  methods: {
    beforeClose() {
      this.$emit('before-close', 'live');
      this.dialogLive = false;
    },
    // 观看直播
    watchLive() {
      getPublishUrl({ room_id: this.$route.query?.room_id })
        .then((res) => {
          if (res?.data?.data?.on_live) {
            this.rtcUrlLocal =
              window.location.protocol + '//' + res?.data?.data?.url || '';
          }
        })
        .catch((err) => {
          this.$message.error(err?.data?.message);
        });
    },
  },
};
</script>

<style lang="scss" scoped>
.live-dialog {
  ::v-deep .el-dialog {
    width: 940px;
    margin-right: 0;
  }
}
</style>
<style lang="scss">
.live-dialog {
  .el-dialog__wrapper {
    pointer-events: none;
    .el-dialog {
      pointer-events: auto;
    }
  }
}
</style>
