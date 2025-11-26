<template>
  <div
    class="cb-accordion"
    :class="{ collapse }"
    @mousemove="setScroll(true)"
    @mouseout="setScroll(false)"
  >
    <!-- <div v-if="showFlag" class="cb-accordion__logo" @click="logoClick">
      <div v-if="$slots.logo">
        <slot name="logo"></slot>
      </div>
      <div v-else class="cb-accordion__logo-icon">
        <img :src="logo" draggable="false"   v-if="logo" />
        <span
          class="cb-accordion__logo-name"
          :class="getTextLogoLength(logoName) <= 14 ? 'ft24' : 'ft18'"
          v-show="!collapse && logoName"
          >{{ logoName }}</span
        >
      </div>
    </div> -->

    <cb-menu
      :class="{ 'cyber-scroll-bar-small': showScroll }"
      :default-active="topActive"
      unique-opened
      :collapse="collapse"
      ref="menu"
    >
      <cb-sub-menu
        v-for="(item, index) in data"
        :key="index"
        :item="item"
        :collapse="collapse"
        @set-select="setSelect"
      ></cb-sub-menu>
    </cb-menu>
    <div
      v-if="showToggle"
      class="cb-accordion__toggle"
      :class="{ 'cb-accordion__toggle--collapse': collapse }"
    >
      <span class="toggle-icon" @click="setCollapse">
        <cb-iconfont
          class="collapse-icon"
          v-if="!collapse"
          type="icon-shouqidaohang"
          size="18"
        />
        <cb-iconfont v-else type="icon-zhankaidaohang" size="18" />
      </span>
    </div>
  </div>
</template>

<script>
import CbIconfont from '../../iconfont';

import CbSubMenu from './components/menu-item.vue';
import { getAllPath, getNameLength } from '../../../utils/navi';
import _ from 'lodash';
/**
 * 手风琴示例
 * @displayName cb-accordion 手风琴
 * @classify Navigation/导航
 */
export default {
  name: 'CbAccordion',
  inheritAttrs: false,
  components: {
    CbIconfont,
    CbSubMenu,
  },
  props: {
    /**
     * 是否展示头部logo以及name
     *
     */
    showFlag: {
      type: Boolean,
      default: false,
    },
    /**
     * 头部logo图片
     *
     */
    logo: {
      type: null,
      default: '',
    },
    logoName: {
      type: String,
      default: '',
    },
    /**
     * 是否可折叠
     *
     */
    showToggle: {
      type: Boolean,
      default: true,
    },
    /**
     * 菜单数据
     *
     */
    data: {
      type: Array,
      default: () => {
        return [];
      },
    },
    /**
     * 鼠标悬停是否展示tip
     *
     */
    tooltip: {
      type: Boolean,
      default: true,
    },
    /**
     * 已选择、激活的菜单项
     *
     */
    active: {
      type: Object,
      default: () => {
        return {};
      },
    },
    indexPage: {
      type: Object,
      default: () => null,
    },
  },
  data() {
    return {
      collapse: false,
      showScroll: false,
      topActive: this.active.name,
    };
  },
  computed: {
    showLogo() {
      return (this.logo || this.$slots.logo) && !this.collapse;
    },
    allPath() {
      return getAllPath(this.data);
    },
  },
  watch: {
    active: {
      handler(val) {
        let item = val;
        let parent = _.get(item, 'meta.breadcrumb.parentName', false);

        // 针对平级路由
        while (parent) {
          item = _.find(this.allPath, { name: parent });
          parent = _.get(item, 'meta.breadcrumb.parentName', false);
        }

        if (_.get(item, 'meta.hideInMenu')) {
          const _folderName = _.get(
            _.find(this.allPath, { name: item.name }),
            '_folderName',
          );
          _folderName && (this.topActive = _folderName);
          return;
        }

        this.topActive = val.meta.module || item.name;
        this.$nextTick(() => {
          // 找到 NavMenu 实例
          const menu = this.$refs.menu;
          // 把高亮指到新的 index
          menu.activeIndex = this.topActive;
        });
      },
      immediate: true,
    },
  },
  methods: {
    // 获取name长度
    getTextLogoLength(str) {
      return getNameLength(str);
    },
    logoClick() {
      if (this.indexPage) {
        this.$emit('select', this.indexPage.name, this.indexPage);
        return;
      }
      this.$router.push('/admin');
    },
    setSelect(name, item) {
      if (item.path !== this.active.path || item.name !== this.active.name) {
        /**
         * 菜单激活回调
         *
         * @property {String} name 对应的route.name
         * @property {Object} item 当前的菜单项
         */
        this.$emit('select', name, item);
      }
    },
    setCollapse(bool) {
      if (_.isBoolean(bool)) {
        if (this.collapse === bool) {
          return;
        }
        this.collapse = bool;
      } else {
        this.collapse = !this.collapse;
      }

      /**
       * 手风琴折叠事件回调
       *
       * @property {Boolean} boolean true 折叠
       */
      this.$emit('setCollapse', this.collapse); //兼容
      this.$emit('set-collapse', this.collapse);
    },
    setScroll(visible) {
      this.showScroll = visible;
    },
  },
};
</script>
