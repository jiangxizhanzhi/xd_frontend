<template>
  <div class="top-tool" id="top-tool" v-dragg ref="topToolRef">
    <div class="top-tool-list" v-show="showTopTool">
      <div class="top-tool-list-item" @click="screenshot">
        <cb-iconfont type="icon-jietu"></cb-iconfont> {{ $t('m.screenshot') }}
      </div>
      <div class="top-tool-list-item" @click="clipboard">
        <cb-iconfont type="icon-fuzhi"></cb-iconfont>
        {{ $t('course.clipboard') }}
      </div>
      <div
        v-if="protocol !== 'console'"
        class="top-tool-list-item"
        @click="fileTransfer"
      >
        <cb-iconfont type="icon-chuanshu"></cb-iconfont>
        {{ $t('course.fileTransfer') }}
      </div>
      <div
        v-if="protocol !== 'ssh'"
        class="top-tool-list-item"
        @click="ctrlAltDel"
      >
        <cb-iconfont type="icon-tuceng"></cb-iconfont>
        {{ $t('course.ctrlAltDel') }}
      </div>
    </div>
    <div class="top-tool-btn" @click="handleToolClick">
      <cb-iconfont type="icon-moxing"></cb-iconfont>
      {{ $t('course.singleTool') }}
    </div>
  </div>
</template>

<script>
export default {
  props: {
    protocol: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      showTopTool: false,
    };
  },
  directives: {
    dragg(el) {
      let dragDom = el; //获取当前元素
      let firstTime = '',
        lastTime = '';
      el.onmousedown = function (e) {
        var disx = e.pageX - el.offsetLeft;
        var disy = e.pageY - el.offsetTop;
        // // 给当前元素添加属性，用于元素状态的判断
        dragDom.setAttribute('ele-flag', false);
        dragDom.setAttribute('draging-flag', true);
        firstTime = new Date().getTime();
        document.onmousemove = function (e) {
          // 鼠标位置-鼠标相对元素位置=元素位置
          let left = e.clientX - disx;
          let top = e.clientY - disy;
          // 限制拖拽范围不超出可视区
          if (left <= 0) {
            left = 5; // 设置成5,离边缘不要太近
          } else if (
            left >
            document.getElementById('canvas-toolbar-wrapper').offsetWidth -
              el.clientWidth
          ) {
            left =
              document.getElementById('canvas-toolbar-wrapper').offsetWidth -
              el.clientWidth -
              5;
          }
          if (top <= 0) {
            top = 5;
          } else if (
            top >
            document.getElementById('canvas-toolbar-wrapper').offsetHeight -
              el.clientHeight
          ) {
            top =
              document.getElementById('canvas-toolbar-wrapper').offsetHeight -
              el.clientHeight -
              5;
          }
          el.style.left = left + 'px';
          el.style.top = top + 'px';
        };
        document.onmouseup = function (event) {
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
  methods: {
    // 截屏
    screenshot() {
      this.$emit('screenshot');
    },
    // 剪切板
    clipboard() {
      this.$emit('clipboard');
    },
    // 文件传输
    fileTransfer() {
      this.$emit('fileTransfer');
    },
    // ctrlAltDel
    ctrlAltDel() {
      this.$emit('ctrlAltDel');
    },
    handleToolClick(e) {
      let isDrag = false;
      const node = e.target.parentNode;
      try {
        isDrag = node.getAttribute('ele-flag') === 'true';
      } catch (e) {}
      if (isDrag) {
        return;
      }
      const topToolLeft = document.getElementById('top-tool').offsetLeft;
      const toolBarWidth = document.getElementById(
        'canvas-toolbar-wrapper',
      ).offsetWidth;
      this.showTopTool = !this.showTopTool;
      setTimeout(() => {
        const topToolWidth2 = document.getElementById('top-tool').offsetWidth;
        if (toolBarWidth - topToolLeft <= topToolWidth2) {
          node.style.left = null;
        }
      }, 50);
    },
  },
};
</script>

<style lang="scss" scoped>
.top-tool {
  position: absolute;
  right: 0;
  top: 0;
  z-index: 999;
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
