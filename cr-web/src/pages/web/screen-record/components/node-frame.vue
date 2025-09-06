<template>
  <div class="node-frame" id="canvas-toolbar-wrapper" ref="nodeFrameDivRef">
    <iframe
      ref="iframeConsole"
      :src="frameUrl"
      scrolling="auto"
      width="100%"
      height="100%"
      style="border: none"
    />
    <!-- 顶部操作工具 -->
    <top-tool
      v-if="showTool"
      @screenshot="clickScreen"
      @clipboard="clipboardTh"
      @fileTransfer="fileTransferTh"
      @ctrlAltDel="ctrlAltDelTh"
      :protocol="protocol"
    />
    <div class="frame-mask-node"></div>
  </div>
</template>

<script>
import TopTool from './top-tool.vue';
import { triggerJmsEvent } from '@/api/web/remote';
export default {
  components: {
    TopTool,
  },
  props: {
    frameUrl: {
      type: String,
      default: '',
    },
    protocol: {
      type: String,
      default: '',
    },
    imageType: {
      type: String,
      default: '',
    },
  },
  computed: {
    iframeContent() {
      return this.$refs.iframeConsole;
    },
    // 工具栏目前只能针对guacamole的ssh，rdp，console 可以实现
    // console是不支持文件传输的
    showTool() {
      if (
        this.imageType === 'vm' &&
        (this.protocol === 'ssh' ||
          this.protocol === 'rdp' ||
          this.protocol === 'console')
      ) {
        return true;
      }
      return false;
    },
  },
  mounted() {
    this.$refs.iframeConsole.focus();
    this.$nextTick(() => {
      this.$refs.iframeConsole.addEventListener('mouseover', (e) =>
        this.$refs.iframeConsole.focus(),
      );
    });
  },
  methods: {
    // 截屏
    clickScreen() {
      this.webScreen(this.iframeContent, this.frameUrl);
    },
    webScreen(iframeContent, iframeUrl) {
      const that = this;
      triggerJmsEvent(
        iframeContent.contentWindow,
        iframeUrl,
        'captureScreen',
        null,
        (dataUrl) => {
          this.$request.download(dataUrl);
          if (this.$route.query.page) {
            this.uploadImg(dataUrl);
          }
        },
      );
    },
    uploadImg(iframeImgUrl) {
      const that = this;
      const imgFile = that.dataURLtoFile(
        iframeImgUrl,
        `${this.$t('m.screenshot')}.png`,
      );
      let formdata = new FormData();
      formdata.append('file', imgFile);
      formdata.append('scene_name', this.$route.query.scene_name);
      formdata.append('node_id', this.$route.query.node_id);
      formdata.append('scene', this.$route.query.scene_id);
      this.$request
        .post('/devops/cluster/screenshot/upload', formdata, {
          baseURL: '/api/mp',
        })
        .then((res) => {})
        .catch((res) => {});
    },
    // 剪切板
    clipboardTh() {
      const that = this;
      triggerJmsEvent(
        that.iframeContent.contentWindow,
        that.frameUrl,
        'clipBoard',
        null,
        () => {},
      );
    },
    // 文件传输
    fileTransferTh() {
      const that = this;
      triggerJmsEvent(
        that.iframeContent.contentWindow,
        that.frameUrl,
        'fileTransfer',
        null,
        () => {},
      );
    },
    // ctrlAltDel
    ctrlAltDelTh() {
      const that = this;
      triggerJmsEvent(
        that.iframeContent.contentWindow,
        that.frameUrl,
        'ctrlAltDel',
        null,
        () => {},
      );
    },
    dataURLtoFile(dataurl, filename) {
      // 将base64转换为文件，dataurl为base64字符串，filename为文件名（必须带后缀名，如.jpg,.png）
      let arr = dataurl.split(',');
      let mime = arr[0].match(/:(.*?);/)[1];
      let bstr = atob(arr[1]);
      let n = bstr.length;
      let u8arr = new Uint8Array(n);
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }
      return new File([u8arr], filename, { type: mime });
    },
  },
};
</script>

<style lang="scss" scoped>
.node-frame {
  width: 100%;
  height: 100%;
  user-select: none;
  .frame-mask-node {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    display: none;
  }
}
</style>
