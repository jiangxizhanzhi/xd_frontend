<template>
  <div
    class="top-tool"
    v-dragg
    v-resize="resize"
    id="top-tool"
    ref="topToolRef"
  >
    <div class="top-tool-list">
      <div class="top-tool-list-item" @click="clickTool('screenshot', $event)">
        <cb-iconfont type="icon-jietu"></cb-iconfont> {{ $t('m.screenshot') }}
      </div>
      <div
        class="top-tool-list-item"
        @click="clickTool('clipboard', $event)"
        v-if="protocol !== 'console'"
      >
        <cb-iconfont type="icon-fuzhi"></cb-iconfont> {{ $t('m.clipboard') }}
      </div>
      <div
        class="top-tool-list-item"
        v-if="protocol !== 'console'"
        @click="clickTool('fileTransfer', $event)"
      >
        <cb-iconfont type="icon-chuanshu"></cb-iconfont>
        {{ $t('m.fileTransfer') }}
      </div>
      <div
        class="top-tool-list-item"
        v-if="protocol !== 'ssh'"
        @click="clickTool('ctrlAltDel', $event)"
      >
        <cb-iconfont type="icon-tuceng"></cb-iconfont>
        {{ $t('m.ctrlAltDel') }}
      </div>
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
    return {};
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
    dragg(el) {
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
          // if (left <= 0) {
          //   left = 5; // 设置成5,离边缘不要太近
          // } else if (left > el.parentNode.offsetWidth - el.clientWidth) {
          //   // document.documentElement.clientWidth屏幕可视区宽度
          //   left = el.parentNode.offsetWidth - el.clientWidth - 5;
          // }
          if (top <= 0) {
            top = 5;
          } else if (top > el.parentNode.offsetHeight - el.clientHeight) {
            top = el.parentNode.offsetHeight - el.clientHeight - 5;
          }
          if (e.clientX < 0) {
            el.style.left = 0;
          } else {
            if (e.clientX <= window.innerWidth - el.offsetWidth) {
              el.style.left = e.clientX + 'px';
            } else {
              el.style.left = e.clientX + el.offsetWidth;
            }
          }
          // el.style.left = e.clientX <= (window.innerWidth - el.offsetWidth) ? e.clientX + 'px' : e.clientX + el.offsetWidth;
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
    clickTool(type, e) {
      let isDrag = false;
      const node = e.target.parentNode.parentNode;
      try {
        isDrag = node.getAttribute('ele-flag') === 'true';
      } catch (e) {}
      if (isDrag) {
        return false;
      }
      if (type === 'screenshot') {
        this.screenshot();
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
      const toolBarWidth = this.$parent.$refs.nodeFrameDivRef.offsetWidth;
      const topToolWidth2 = this.$refs.topToolRef.offsetWidth;
      if (toolBarWidth - topToolLeft <= topToolWidth2) {
        this.$refs.topToolRef.style.left = null;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.top-tool {
  position: fixed;
  top: 32px;
  right: 0;
  z-index: 999;
  width: fit-content;
  background: var(--bg-color-3);
  color: var(--neutral8);
  font-size: 14px;
  display: flex;
  height: 32px;
  line-height: 32px;
  .cb-iconfont {
    color: var(--neutral8);
  }
  &-list {
    transition: 2s;
    background: var(--bg-color-2);
    display: flex;
    &-item {
      margin: 0 4px;
      cursor: pointer;
    }
  }
  &-btn {
    cursor: pointer;
    margin-right: 4px;
  }
}
</style>
