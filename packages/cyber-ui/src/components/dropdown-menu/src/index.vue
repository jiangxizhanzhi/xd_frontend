
<template>
  <transition name="el-zoom-in-top" @after-leave="doDestroy">
    <ul
      class="el-dropdown-menu el-popper cb-dropdown-menu"
      :class="dropdownClass"
      v-show="showPopper"
    >
      <slot></slot>
    </ul>
  </transition>
</template>

<script>
import Popper from 'element-ui/lib/utils/vue-popper';

/**
 * @displayName  cb-dropdown-menu
 * @ignore
 */
export default {
  name: 'CbDropdownMenu',

  componentName: 'ElDropdownMenu',

  mixins: [Popper],

  props: {
    visibleArrow: {
      type: Boolean,
      default: true,
    },
    arrowOffset: {
      type: Number,
      default: 0,
    },
  },

  data() {
    return {
      size: this.dropdown.dropdownSize,
      theme: this.dropdown.theme,
    };
  },

  inject: ['dropdown'],
  computed: {
    dropdownClass() {
      let className = '';
      if (this.size) {
        className = className + ` el-dropdown-menu--${this.size} `;
      }
      if (this.dropdown.theme) {
        className = className + ` cb-dropdown--${this.dropdown.theme} `;
      }
      return className;
    },
  },
  created() {
    this.$on('updatePopper', () => {
      if (this.showPopper) this.updatePopper();
    });
    this.$on('visible', (val) => {
      this.showPopper = val;
    });
  },

  mounted() {
    this.dropdown.popperElm = this.popperElm = this.$el;
    this.referenceElm = this.dropdown.$el;
    // compatible with 2.6 new v-slot syntax
    // issue link https://github.com/ElemeFE/element/issues/14345
    this.dropdown.initDomOperation();
  },

  watch: {
    'dropdown.placement': {
      immediate: true,
      handler(val) {
        this.currentPlacement = val;
      },
    },
  },
};
</script>
