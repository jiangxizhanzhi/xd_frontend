
<template>
  <div class="cb-tag" @click="tagClick" :class="[sizeClass]">
    <div class="cb-tag-content">
      <div
        class="cb-tag-content-title"
        :style="{ maxWidth: tagWidth }"
        :class="{ 'text-ellipsis': omit }"
        :title="titleText"
      >
        <slot></slot>
      </div>
      <div class="cb-tag-content-close" v-if="closable" @click.stop="closeFunc">
        <cb-iconfont type="icon-guanbi" size="12"></cb-iconfont>
      </div>
    </div>
  </div>
</template>

<script>
/**
 * @displayName cb-tag
 * @classify Form/表单
 */
export default {
  name: 'CbTag',
  props: {
    /**
     *title显示,前提在omit为true
     */
    title: {
      type: String,
      default: '',
    },
    /**
     * 关闭按钮
     */
    closable: {
      type: Boolean,
      default: false,
    },
    /**
     * 类型
     */
    type: {
      type: String,
      default: 'default',
    },
    /**
     * 是否控制长度显示省略号
     */
    omit: {
      type: Boolean,
      default: true,
    },
    /**
     * 最大长度
     */
    maxWidth: {
      type: String | Number,
      default: 160,
    },
    /**
     * 标签大小
     */
    size: {
      type: String,
      default: 'middle',
    },
  },
  data() {
    return {};
  },
  computed: {
    titleText() {
      return this.omit ? this.title : '';
    },
    tagWidth() {
      return this.omit ? this.maxWidth + 'px' : '100%';
    },
    sizeClass() {
      return 'cb-tag-' + this.size;
    },
  },
  created() {},
  mounted() {},
  watch: {},
  methods: {
    tagClick() {
      /**
       * 点击事件.
       *
       * @event click
       */
      this.$emit('click');
    },
    closeFunc(event) {
      /**
       * 关闭 Tag 时的回调
       * @event close
       * @property {object}
       */

      this.$emit('close', this.$slots.default[0].text);
    },
  },
  components: {},
};
</script>
