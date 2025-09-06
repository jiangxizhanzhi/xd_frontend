<template>
  <!-- 场景录屏 -->
  <div
    class="console"
    :style="'height:' + iframeHeight + 'px;width:' + iframeWidth + 'px'"
  >
    <iframe
      ref="iframeConsole"
      :src="$route.query.connection_url"
      scrolling="auto"
      width="100%"
      height="100%"
      style="border: none"
    />
  </div>
</template>

<script>
export default {
  name: 'ScreenRecording',
  data() {
    return {
      iframeHeight: '',
      iframeWidth: '',
    };
  },

  mounted() {
    this.$refs.iframeConsole.focus();
    this.iframeHeight = document.documentElement.clientHeight;
    this.iframeWidth = document.documentElement.clientWidth;
    // 添加监听浏览器窗口关闭的
    window.addEventListener('unload', (e) => this.recordScreen());
  },
  beforeDestroy() {
    window.removeEventListener('unload', (e) => this.recordScreen());
  },
  methods: {
    // 关闭此窗口时录屏
    recordScreen() {
      this.$request
        .post(
          '/cscene/cscene_instances/disable_recording',
          {
            connection_id: this.$route.query.connection_id,
            context: {
              access_user_id: this.$route.query.user_id,
              pass_through: {},
            },
            id: this.$route.query.scene_id,
            node_id: this.$route.query.node_id,
          },
          {
            baseURL: '/api/mp',
          },
        )
        .then((res) => {});
    },
  },
};
</script>

<style lang="scss" scoped>
.console {
  position: absolute;
}
</style>
