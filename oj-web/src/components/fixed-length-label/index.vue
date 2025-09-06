<template>
  <div
    class="fixed-length-label"
    ref="wrapper"
    :style="fixedLengthLabelContainerStyle"
  >
    <div v-if="selectable" class="content" :title="title">
      {{ str }}
    </div>
    <div
      class="label html-content"
      v-else-if="html && html.length > 0"
      :style="inputStyle"
      :title="title"
      v-html="html"
    ></div>
    <div class="label str-content" v-else :style="inputStyle" :title="title">
      {{ str }}
    </div>
  </div>
</template>

<script>
import { debounce } from '@/utils/common';

export default {
  name: 'FixedLengthLabel',
  props: {
    selectable: {
      type: Boolean,
      default() {
        return false;
      },
    },
    stylePassed: {
      type: Object,
      default() {
        return {};
      },
    },
    width: {
      type: Number,
      default: 100,
    },
    str: {
      type: String,
      default: '',
    },
    html: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      wrapperWidth: 0,
    };
  },

  computed: {
    title() {
      const { str, html } = this;
      if (str.length > 0) {
        return str;
      } else if (html.length > 0) {
        const container = document.createElement('div');
        container.innerHTML = html;
        return container.innerText;
      }
      return '';
    },
    fixedLengthLabelContainerStyle() {
      const { width } = this;

      return {
        width: width < 0 ? '100%' : `${width}px`,
      };
    },
    inputStyle() {
      let width = this.width;
      const { stylePassed, wrapperWidth } = this;
      if (width < 0) {
        width = wrapperWidth;
      }
      const obj = Object.assign(
        {
          width: '100%',
          height: '100%',
        },
        stylePassed,
      );
      return obj;
    },
  },

  mounted() {
    const that = this;
    that.wrapperWidth = that.$refs.wrapper.offsetWidth;
    that.__resizeHandler = debounce(() => {
      that.wrapperWidth = that.$refs.wrapper.offsetWidth;
    }, 50);
    window.addEventListener('resize', that.__resizeHandler);
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.__resizeHandler);
  },
};
</script>

<style scoped lang="scss">
.fixed-length-label {
  display: inline-block;
  & > .label {
    width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .content {
    width: 100%;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    font-size: 14px;
    font-weight: 400;
    padding: 0px 20px 0px 10px;
  }
}
</style>
