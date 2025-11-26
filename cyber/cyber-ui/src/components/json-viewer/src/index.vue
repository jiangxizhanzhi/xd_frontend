<template>
  <div ref="viewer" :class="CbClass">
    <div v-if="copyable" :class="`cb-tooltip ${copyText.align || 'right'}`">
      <span ref="clip" class="cb-button" :class="{ copied }" @click="copyFunc">
        <slot name="copy" :copied="copied">
          {{ copied ? copyText.copiedText : copyText.copyText }}
        </slot>
      </span>
    </div>
    <div class="cb-code" :class="{ open: expandCode, boxed }">
      <json-box
        ref="jsonBox"
        :value="data"
        :sort="sort"
        :preview-mode="previewMode"
      />
    </div>
    <div
      v-if="expandableCode && boxed"
      class="cb-more"
      @click="toggleExpandCode"
    >
      <cb-iconfont type="icon-xiala" v-if="!expandCode"></cb-iconfont>
      <cb-iconfont type="icon-shouqi" v-else></cb-iconfont>
    </div>
  </div>
</template>

<script>
import JsonBox from './json-box.vue';
import { Message } from 'element-ui';
import { debounce } from 'lodash';
/**
 * @displayName cb-json-viewer JSON信息查看
 * @classify View/视图
 */
export default {
  name: 'CbJsonViewer',
  components: {
    JsonBox,
  },
  props: {
    data: {
      type: [Object, Array, String, Number, Boolean, Function],
      required: true,
    },
    expanded: {
      type: Boolean,
      default: false,
    },
    expandDepth: {
      type: Number,
      default: 4,
    },
    copyable: {
      type: [Boolean, Object],
      default: () => {
        return false;
      },
    },
    sort: {
      type: Boolean,
      default: false,
    },
    boxed: {
      type: Boolean,
      default: true,
    },
    theme: {
      type: String,
      default: 'cb-light',
    },
    timeformat: {
      type: Function,
      default: (value) => value.toLocaleString(),
    },
    previewMode: {
      type: Boolean,
      default: false,
    },
  },
  provide() {
    return {
      expandDepth: this.expandDepth,
      timeformat: this.timeformat,
    };
  },
  data() {
    return {
      copied: false,
      expandableCode: false,
      expandCode: this.expanded,
    };
  },
  computed: {
    CbClass() {
      return 'cb-container ' + this.theme + (this.boxed ? ' boxed' : '');
    },
    copyText() {
      const { copyText, copiedText, timeout, align } = this.copyable;

      return {
        copyText: copyText || 'copy',
        copiedText: copiedText || 'copied!',
        timeout: timeout || 2000,
        align,
      };
    },
  },
  watch: {
    data() {
      this.onResized();
    },
  },
  mounted: function () {
    this.debounceResized = debounce(this.debResized.bind(this), 200);
    if (this.boxed && this.$refs.jsonBox) {
      this.onResized();
      this.$refs.jsonBox.$el.addEventListener('resized', this.onResized, true);
    }
    if (this.copyable) {
      console.log(this.$refs.clip);
      // const clipBoard = new Clipboard(this.$refs.clip, {
      //   container: this.$refs.viewer,
      //   text: () => {
      //     return JSON.stringify(this.data, null, 2);
      //   },
      // });
      // clipBoard.on('success', (e) => {
      //   this.onCopied(e);
      // });
    }
  },
  methods: {
    copyFunc() {
      if (this.copyable) {
        if (navigator.clipboard && window.isSecureContext) {
          navigator.clipboard
            .writeText(JSON.stringify(this.data, null, 2))
            .then(
              (e) => {
                Message({
                  message: this.copyable.copiedText,
                  type: 'success',
                });
                this.onCopied(e);
              },
              (error) => {
                Message({
                  message: this.copyable.copiedText,
                  type: 'success',
                });
              },
            );
        } else {
          // 创建text area
          let textArea = document.createElement('textarea');
          textArea.value = JSON.stringify(this.data);
          // 使text area不在viewport，同时设置不可见
          textArea.style.position = 'absolute';
          textArea.style.opacity = 0;
          textArea.style.left = '-999999px';
          textArea.style.top = '-999999px';
          document.body.appendChild(textArea);
          textArea.focus();
          textArea.select();
          return new Promise((res, rej) => {
            // 执行复制命令并移除文本框
            document.execCommand('copy') ? res() : rej();
            textArea.remove();
            Message({
              message: this.copyable.copiedText,
              type: 'success',
            });
          });
        }
      }
    },
    onResized() {
      this.debounceResized();
    },
    debResized() {
      this.$nextTick(() => {
        if (!this.$refs.jsonBox) return;
        if (this.$refs.jsonBox.$el.clientHeight >= 250) {
          this.expandableCode = true;
        } else {
          this.expandableCode = false;
        }
      });
    },
    onCopied(copyEvent) {
      if (this.copied) {
        return;
      }
      this.copied = true;
      setTimeout(() => {
        this.copied = false;
      }, this.copyText.timeout);
      this.$emit('copied', copyEvent);
    },
    toggleExpandCode() {
      this.expandCode = !this.expandCode;
    },
  },
};
</script>
