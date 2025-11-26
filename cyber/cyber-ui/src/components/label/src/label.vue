<template>
  <div class="cb-label" ref="cbLabelWrapperRef" :style="labelContainerStyle">
    <input
      v-if="selectable"
      :value="str"
      :style="inputStyle"
      readonly
      :title="title"
    />
    <div
      class="cb-label__label"
      v-else-if="html && html.length > 0"
      :style="inputStyle"
      :title="title"
      v-html="html"
    ></div>
    <div class="cb-label__label" v-else :style="inputStyle" :title="title">
      {{ str }}
    </div>
  </div>
</template>

<script>
/**
 * @displayName cb-label 固长标签
 * @classify View/视图
 */
export default {
  name: 'CbLabel',
  props: {
    /**
     * 是否可选中
     *
     */
    selectable: {
      type: Boolean,
      default() {
        return false;
      },
    },
    /**
     * 标签样式
     *
     */
    stylePassed: {
      type: Object,
      default() {
        return {};
      },
    },
    /**
     * 宽度
     *
     */
    width: {
      type: Number,
      default: 100,
    },
    /**
     * 纯文本内容
     *
     */
    str: {
      type: String,
      default: '',
    },
    /**
     * html内容
     *
     */
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
    labelContainerStyle() {
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
    this.wrapperWidth = this.$refs.cbLabelWrapperRef.offsetWidth;
  },
  beforeDestroy() {},
};
</script>
