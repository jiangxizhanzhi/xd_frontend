<template>
  <div
    class="node-frame"
    id="canvas-toolbar-wrapper"
    oncontextmenu="javascript: return false;"
    ref="nodeFrameDivRef"
  >
    <iframe ref="nodeIframeRef" :src="frameUrl" scrolling="auto"></iframe>

    <!-- 顶部操作工具 -->
    <!-- <top-tool
      v-if="showTool"
      @screenshot="clickScreen"
      @clipboard="clipboardTh"
      @fileTransfer="fileTransferTh"
      @ctrlAltDel="ctrlAltDelTh"
      :protocol="protocol"
    /> -->
    <!-- v-resize="resize" -->
    <div
      v-if="showTool"
      class="top-tool"
      id="top-tool"
      v-dragg
      v-resize="resize"
      ref="topToolRef"
    >
      <div class="top-tool-list">
        <div
          class="top-tool-list-item"
          @click="clickTool('clickScreen', $event)"
        >
          <cb-iconfont type="icon-jietu"></cb-iconfont> {{ $t('m.screenshot') }}
        </div>
        <div
          v-if="protocol !== 'console'"
          class="top-tool-list-item"
          @click="clickTool('clipboard', $event)"
        >
          <cb-iconfont type="icon-fuzhi"></cb-iconfont>
          {{ $t('course.clipboard') }}
        </div>
        <div
          v-if="protocol !== 'console'"
          class="top-tool-list-item"
          @click="clickTool('fileTransfer', $event)"
        >
          <cb-iconfont type="icon-chuanshu"></cb-iconfont>
          {{ $t('course.fileTransfer') }}
        </div>
        <div
          v-if="protocol !== 'ssh'"
          class="top-tool-list-item"
          @click="clickTool('ctrlAltDel', $event)"
        >
          <cb-iconfont type="icon-tuceng"></cb-iconfont>
          {{ $t('course.ctrlAltDel') }}
        </div>
      </div>
    </div>
    <div class="frame-mask-node"></div>
  </div>
</template>

<script>
import { NOTE_TYPE, RESOURCE_TYPE } from '@/pages/web/course/constant.js';
import { triggerJmsEvent } from '@/api/remote/remote';
import TopTool from './top-tool.vue';

export default {
  props: {
    frameUrl: {
      type: String,
      default: '',
    },
    sceneData: {
      type: Object,
      default: {},
    },
    nodeId: {
      type: String,
      default: '',
    },
    sceneId: {
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
    // 用于截屏保存至实验报告光标位置
    pos: {
      type: Object,
      default: {},
    },
    text: {
      type: String,
      default: '',
    },
  },
  components: {
    TopTool,
  },
  data() {
    return {
      lessonReport: '',
      // pos: {},
      // text: '',
      iframeImgUrl: '',
      lessonId: this.$route.params.lesson_id,
      passed: null,
      resetVal: '',
    };
  },
  watch: {},
  computed: {
    iframeContent() {
      return this.$refs.nodeIframeRef;
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
  directives: {
    resize: {
      // 指令的名称
      bind(el, binding) {
        // el为绑定的元素，binding为绑定给指令的对象
        let width = '',
          height = '';
        function isReize() {
          const style = document.defaultView.getComputedStyle(el);
          if (width !== style.width || height !== style.height) {
            binding.value(); // 关键
          }
          width = style.width;
          height = style.height;
        }
        el.__vueSetInterval__ = setInterval(isReize, 300);
      },
      unbind(el) {
        clearInterval(el.__vueSetInterval__);
      },
    },

    dragg: {
      bind(el) {
        let dragDom = el; //获取当前元素
        let firstTime = '',
          lastTime = '';
        el.onmousedown = function (e) {
          let maskDiv = el.nextElementSibling;
          var disx = e.pageX - el.offsetLeft;
          var disy = e.pageY - el.offsetTop;
          // // 给当前元素添加属性，用于元素状态的判断
          dragDom.setAttribute('ele-flag', false);
          dragDom.setAttribute('draging-flag', true);
          firstTime = new Date().getTime();
          document.onmousemove = function (e) {
            if (maskDiv) {
              maskDiv.style.display = 'block';
            }
            // 鼠标位置-鼠标相对元素位置=元素位置
            let left = e.clientX - disx;
            let top = e.clientY - disy;
            // 限制拖拽范围不超出可视区
            if (left <= 0) {
              left = 5; // 设置成5,离边缘不要太近
            } else if (left > el.parentNode.offsetWidth - el.clientWidth) {
              left = el.parentNode.offsetWidth - el.clientWidth - 5;
            }
            if (top <= 0) {
              top = 5;
            } else if (top > el.parentNode.offsetHeight - el.clientHeight) {
              top = el.parentNode.offsetHeight - el.clientHeight - 5;
            }
            el.style.left = left + 'px';
            el.style.top = top + 'px';
          };
          document.onmouseup = function (event) {
            if (maskDiv) {
              maskDiv.style.display = 'none';
            }
            document.onmousemove = document.onmouseup = null;
            lastTime = new Date().getTime();
            if (lastTime - firstTime > 200) {
              dragDom.setAttribute('ele-flag', true);
              event.stopPropagation();
            }
            setTimeout(function () {
              dragDom.setAttribute('draging-flag', false);
            }, 100);
          };
        };
      },
    },
  },
  mounted() {
    this.$refs.nodeIframeRef.focus();
    this.$nextTick(() => {
      this.$refs.nodeIframeRef.addEventListener('mouseover', (e) =>
        this.$refs.nodeIframeRef.focus(),
      );
    });
  },
  methods: {
    clickTool(type, e) {
      let isDrag = false;
      const node = e.target.parentNode.parentNode;
      try {
        isDrag = node.getAttribute('ele-flag') === 'true';
      } catch (e) {}
      if (isDrag) {
        return false;
      }
      if (type === 'clickScreen') {
        this.clickScreen();
      } else if (type === 'clipboard') {
        this.clipboard();
      } else if (type === 'fileTransfer') {
        this.fileTransfer();
      } else if (type === 'ctrlAltDel') {
        this.ctrlAltDel();
      }
    },
    resize() {
      const topToolLeft = this.$refs.topToolRef.offsetLeft;
      const toolBarWidth = this.$refs.nodeFrameDivRef.offsetWidth;
      const topToolWidth2 = this.$refs.topToolRef.offsetWidth;
      if (toolBarWidth - topToolLeft <= topToolWidth2) {
        this.$refs.topToolRef.style.left = null;
      }
    },
    clipboard() {
      // 剪切板
      const that = this;
      triggerJmsEvent(
        that.iframeContent.contentWindow,
        that.frameUrl,
        'clipBoard',
        null,
        () => {},
      );
    },
    fileTransfer() {
      // 文件传输
      const that = this;
      triggerJmsEvent(
        that.iframeContent.contentWindow,
        that.frameUrl,
        'fileTransfer',
        null,
        () => {},
      );
    },
    ctrlAltDel() {
      // ctrlAltDel
      const that = this;
      triggerJmsEvent(
        that.iframeContent.contentWindow,
        that.frameUrl,
        'ctrlAltDel',
        null,
        () => {},
      );
    },
    clickScreen() {
      if (!_.isEmpty(this.sceneData.scene)) {
        this.getExport();
      }
    },
    // 获取实验报告
    getExport() {
      this.$request
        .get(
          '/oj/note',
          {
            resource_id: this.lessonId,
            note_type: NOTE_TYPE.REPORT,
            resource_type: RESOURCE_TYPE.LESSON,
          },
          {
            baseURL: '/api/ojj',
          },
        )
        .then((res) => {
          const lessonReport = res.data.data.content || '';
          this.lessonReport = lessonReport;
          this.passed = res.data.data.passed || false;
          this.webScreen(this.iframeContent, this.frameUrl);
        });
    },
    webScreen(iframeContent, iframeUrl) {
      const that = this;
      triggerJmsEvent(
        iframeContent.contentWindow,
        iframeUrl,
        'captureScreen',
        null,
        (dataUrl) => {
          if (this.passed === false) {
            that.uploadImg(dataUrl);
          }
          if (this.passed === true) {
            this.$message.error(this.$t('m.screenErrorMessage'));
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

      var formdata = new FormData();
      formdata.append('file', imgFile);
      formdata.append('scene_name', this.sceneData.scene.topology.scene.name);
      formdata.append('node_id', this.nodeId);
      formdata.append('scene', this.sceneId);
      this.$request
        .post('/devops/cluster/screenshot/upload', formdata, {
          baseURL: '/api/mp',
        })
        .then((res) => {
          that.iframeImgUrl = res.data.data.file;
          // 判断光标位置pos对象是否为空
          if (!_.isEmpty(this.pos)) {
            if (this.text) {
              const finalText = this.addStr(
                this.lessonReport,
                '\n![截图](' + this.iframeImgUrl + ')\n',
                this.text,
              );
              this.resetVal = finalText;
            } else {
              // 如果文本是空的,在某一行的首个字符
              const index = this.find(this.lessonReport, '\n', this.pos.line);
              const newText =
                this.lessonReport.slice(0, index) +
                '\n![截图](' +
                this.iframeImgUrl +
                ')\n' +
                this.lessonReport.slice(index);
              this.resetVal = newText;
            }
          } else {
            // 如果没有点击报告直接选择的截图，放在最后
            this.resetVal =
              this.lessonReport + '\n![截图](' + this.iframeImgUrl + ')\n';
          }
          this.submit(this.resetVal, this.iframeImgUrl);
        })
        .catch((res) => {});
    },
    dataURLtoFile(dataurl, filename) {
      // 将base64转换为文件，dataurl为base64字符串，filename为文件名（必须带后缀名，如.jpg,.png）
      var arr = dataurl.split(',');
      var mime = arr[0].match(/:(.*?);/)[1];
      var bstr = atob(arr[1]);
      var n = bstr.length;
      var u8arr = new Uint8Array(n);
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }
      return new File([u8arr], filename, { type: mime });
    },

    // 提交实验报告
    submit(val, imgUrl) {
      this.$request
        .post(
          '/oj/note',
          {
            business_id: this.lessonId,
            note_type: NOTE_TYPE.REPORT,
            business_type: RESOURCE_TYPE.LESSON,
            content: val,
            scene_screenshot: imgUrl,
          },
          {
            baseURL: '/api/ojj',
          },
        )
        .then((res) => {
          this.$message.success(this.$t('m.saveSuccessful'));
        });
    },
    // 查找字符出现位置
    find(str, cha, num) {
      var x = str.indexOf(cha);
      for (var i = 0; i < num; i++) {
        x = str.indexOf(cha, x + 1);
      }
      return x;
    },

    addStr(oldStr, addItem, afterWhich) {
      // 在指定字符串后面添加指定字符串
      var strArr = oldStr.split('');
      strArr.splice(oldStr.indexOf(afterWhich) + afterWhich.length, 0, addItem);
      return strArr.join('');
    },
    // getPos(pos, text) {
    //   this.pos = pos;
    //   this.text = text;
    // },
  },
};
</script>

<style lang="scss" scoped>
.node-frame {
  width: 100%;
  height: 100%;
  position: relative;
  iframe {
    width: 100%;
    height: 100%;
    background: var(--font-color-primary);
  }
  .canvas-toolbar-wrapper {
    // width: 40px;
    position: absolute;
    right: 0;
    top: 0;
  }
  .frame-mask-node {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    display: none;
  }
}
</style>
<style lang="scss" scoped>
.top-tool {
  position: absolute;
  right: 0;
  top: 0;
  z-index: 222;
  background: var(--bg-color-3);
  color: var(--neutral8);
  font-size: 14px;
  display: inline-flex;
  height: 32px;
  line-height: 32px;
  width: fit-content;
  .cb-iconfont {
    color: var(--neutral8);
  }
  &-list {
    transition: 2s;
    background: var(--bg-color-2);
    display: inline-flex;
    &-item {
      margin: 0 4px;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
    }
  }
  &-btn {
    cursor: pointer;
    margin-right: 4px;
  }
}
</style>
