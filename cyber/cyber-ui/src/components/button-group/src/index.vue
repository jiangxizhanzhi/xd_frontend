
<template>
  <div class="cb-button-group">
    <div :class="[{ 'cb-button-group-circle': shape == 'circle' }, spaceClass]">
      <slot></slot>
    </div>
  </div>
</template>

<script>
/**
 * @displayName cb-button-group 按钮组
 * @classify Basic/基础
 */
export default {
  name: 'CbButtonGroup',
  props: {
    /**
     * 按钮组类型
     * @values circle,normal
     * 
     */
    shape: {
      type: String,
      default: 'normal',
    },
    /**
     * button间距
     *  @values large，middle， small
     * 
     *
     */
    space: {
      type: String,
      default: 'small',
    },
  },
  data() {
    return {};
  },
  computed: {
    spaceClass() {
      return 'cb-button-group-' + this.space;
    },
  },
  created() {},
  mounted() {},
  watch: {},
  methods: {},
  components: {},
};
</script>
