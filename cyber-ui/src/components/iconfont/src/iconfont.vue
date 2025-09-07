
<template>
  <svg
    @click="iconClick"
    class="cb-iconfont"
    aria-hidden="true"
    :style="{ 'font-size': size + 'px', color: fontColor }"
  >
    <use :xlink:href="`#${type}`"></use>
  </svg>
</template>

<script>
import '../../../assets/iconfont/index';
import { themed } from '../../../utils/themes';
import ListenDomChange from '../../../utils/listen-dom';
/**
 * @displayName cb-iconfont 字体图标
 * @classify Basic/基础
 */
export default {
  name: 'CbIconfont',
  props: {
    /**
     * 图标类型
     *
     */
    type: {
      type: String,
      default: '',
    },
    /**
     * 图标大小
     *
     */
    size: {
      type: [String, Number],
      default: '16',
    },
    /**
     * 图标颜色
     *
     */
    color: {
      type: String,
      default: '',
    },
    /**
     * 颜色变量
     *
     */
    themedColor: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      fontColor: '',
      listen: new ListenDomChange({
        dom: document.body,
        callback: this.listenFunc,
      }),
    };
  },
  computed: {},
  mounted() {
    this.themedColor
      ? (this.fontColor = themed(this.themedColor))
      : (this.fontColor = this.color);
    this.listen.createListen();
  },
  beforeDestroy() {
    this.listen.destroyListen();
  },
  methods: {
    listenFunc() {
      this.themedColor
        ? (this.fontColor = themed(this.themedColor))
        : (this.fontColor = this.color);
    },
    iconClick() {
      this.$emit('click');
    },
  },
};
</script>
