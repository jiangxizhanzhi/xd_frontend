<template>
  <div
    class="console"
    :style="'height:' + iframeHeight + 'px;width:' + iframeWidth + 'px'"
  >
    <iframe
      ref="iframeConsole"
      :src="url"
      scrolling="auto"
      width="100%"
      height="100%"
    ></iframe>
    <div class="countdown-box" v-show="times && url">
      <div class="time">{{ times }}</div>
      <div class="text">{{ $t('m.startHelp') }}</div>
    </div>
    <div class="close-btn" v-show="url">
      <cb-button @click="endRemoteHelp">{{ $t('m.endRemoteHelp') }}</cb-button>
    </div>
  </div>
</template>

<script>
import _ from 'lodash';
export default {
  name: 'ojcms-course-console',
  data() {
    return {
      iframeHeight: '',
      iframeWidth: '',
      url: '',
      timer: null,
      times: 3,
    };
  },
  mounted() {
    this.$refs.iframeConsole.focus();
    this.iframeHeight = document.documentElement.clientHeight;
    this.iframeWidth = document.documentElement.clientWidth;
    this.getHelpUrl();
  },
  methods: {
    // 获取远程url
    getHelpUrl() {
      this.$request
        .get(
          '/oj/admin/course/classroom/get_help',
          {
            resource_id: this.$route.params.lessonId,
            user_id: this.$route.params.userId,
          },
          {
            baseURL: '/api/ojj',
          },
        )
        .then((res) => {
          this.url = _.get(res, 'data.data');
          this.getTime();
        });
    },
    getTime() {
      this.timer = setInterval(() => {
        this.times--;
        if (this.times === 0) {
          clearInterval(this.timer);
        }
      }, 1000);
    },

    // 结束远程协助
    endRemoteHelp() {
      this.$confirm(this.$t('m.confirmEndRemoteHelp'), '', {
        type: 'warning',
      }).then(() => {
        this.$request
          .get(
            '/oj/admin/course/classroom/end_help',
            {
              resource_id: this.$route.params.lessonId,
              user_id: this.$route.params.userId,
            },
            {
              baseURL: '/api/ojj',
            },
          )
          .then((res) => {
            window.close();
          });
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.console {
  position: relative;
  .countdown-box {
    width: 286px;
    height: 214px;
    background: var(--bg-color-2);
    box-shadow: 8px 8px 30px 0px var(--box-shadow-color);
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    text-align: center;
    color: var(--neutral8);
    .time {
      width: 72px;
      height: 72px;
      border: 4px solid var(--orange-color);
      border-radius: 36px;
      font-size: 32px;
      line-height: 60px;
      color: var(--orange-color);
      margin: 48px auto 24px;
    }
  }
  .close-btn {
    position: absolute;
    right: 24px;
    bottom: 24px;
  }
}
</style>
