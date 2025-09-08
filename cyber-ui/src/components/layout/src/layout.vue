<template>
  <div class="cb-layout" :class="judgeClass">
    <div class="layout-container" :style="{ background: backgroundColor }">
      <!-- iframe对话框的遮罩 -->
      <div class="cb-layout-full-screen-mask"></div>
      <div v-show="!fullscreen" class="navi-header">
        <div v-if="$slots.header">
          <slot name="header"></slot>
        </div>
        <!-- 前台菜单-->
        <cb-navi
          v-bind="$attrs"
          v-on="$listeners"
          :data="naviHeaderData"
          :active="active"
          :user-info="userInfo"
          :lang-switch="langSwitch"
          :theme-switch="themeSwitch"
          :talentObj="talentObj"
          :showQuickEntry="showQuickEntry"
          @select="menuSelect"
          @on-lang-switch="emitLangSwitch"
          @on-theme-switch="emitThemeSwitch"
        >
          <!-- <template v-slot:logo>
            <slot name="logo"></slot>
          </template> -->
        </cb-navi>
      </div>
      <div
        class="left-accordion"
        v-show="!fullscreen"
        :class="{ 'left-accordion-collapse': collapse }"
      >
        <div v-if="$slots.accordion">
          <slot name="accordion"></slot>
        </div>
        <!-- 手风琴后台菜单-->
        <cb-accordion
          ref="cbAccordionRef"
          v-if="!$slots.accordion && currentLeftMenu"
          v-bind="$attrs"
          v-on="$listeners"
          :data="currentLeftMenu"
          :active="active"
          :show-flag="showFlag"
          :user-info="userInfo"
          @setCollapse="setCollapse"
          @select="menuSelectAccordion"
        >
          <template v-slot:logo>
            <slot name="logo"></slot>
          </template>
        </cb-accordion>
      </div>
      <div
        :style="computedStyle"
        ref="cbLayoutContentRef"
        :class="[
          collapse ? 'content-page-collapse' : 'content-page',
          'cb-layout-content-page',
        ]"
      >
        <!--没有面包屑彻底删除占位-->
        <div class="cb-layout-header" v-if="showBreadcrumb">
          <div class="cb-layout-breadcrumbs" :style="breadcrumbStyle">
            <cb-breadcrumb
              :pre-items="breadcrumbPreItems"
              :data="naviData"
              :active="active"
              @select="select"
            ></cb-breadcrumb>
            <div class="cb-layout-breadcrumbs-right">
              <slot name="breadcrumbsRightArea"></slot>
            </div>
          </div>
        </div>
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script>
import CbNavi from '../../navigation';
import CbAccordion from '../../accordion';
import CbBreadcrumb from '../../breadcrumb';
import UserDropdown from './components/user-dropdown.vue';
import _ from 'lodash';
import { bus } from '../../../utils/bus';
import {
  getDynamicRouter,
  isSubFrame,
  getMainWin,
  setLanguage,
  getLanguage,
} from '@cyber/helper';

import { getAllPath, getTopMenu } from '../../../utils/navi';
import { setTheme, getCurrentTheme } from '../../../utils/themes';
import { clearMemory } from '../../../utils/memory';
/**
 * @displayName cb-layout
 * @classify Layout/布局
 */
export default {
  name: 'CbLayout',
  inheritAttrs: false,
  components: {
    CbNavi,
    CbBreadcrumb,
    CbAccordion,
    UserDropdown,
  },
  props: {
    /**
     * 头部logo以及name
     *
     */
    showFlag: {
      type: Boolean,
      default: false,
    },
    /**
     * 顶部icon列表
     */
    hotkeys: {
      type: Array,
      default: () => [],
    },
    /**
     * 是否无菜单
     */
    noNavi: {
      type: Boolean,
      default: false,
    },
    /**
     * 是否为左侧手风琴模式
     * 默认顶部菜单模式
     */
    accordion: {
      type: Boolean,
      default: false,
    },
    bgColor: {
      type: String,
      default: '',
    },
    padding: {
      type: String,
      default: '0px 3% 16px 3%', //上下padding暂只支持px
    },
    sidePadding: {
      type: String,
      default: '',
    },
    breadcrumb: {
      type: Boolean,
      default: true,
    },
    breadcrumbStyle: {
      type: Object,
      default: () => {},
    },
    userInfo: {
      type: [Object, String],
      default: null,
    },
    minSize: {
      type: Array,
      default: () => [1336, 600],
    },
    /**
     * 配置菜单
     */
    currentMenu: {
      type: Object,
      default: null,
    },
    /**
     * 人才态势按钮
     */
    talentObj: {
      type: Object,
      default: null,
    },
    /**
     * 国际化按钮
     */
    langSwitch: {
      type: Boolean,
      default: false,
    },
    /**
     * 主题切换按钮
     */
    themeSwitch: {
      type: Boolean,
      default: false,
    },
    /**
     * 快速入门手册按钮
     */
    showQuickEntry: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      lang: getLanguage() || 'zh-CN',
      theme: getCurrentTheme() || 'theme-dark',
      naviHeaderData: [],
      naviData: [],
      routeData: [],
      active: {},
      newActive: {},
      collapse: false,
      viewPortSizeEvent: null,

      breadcrumbPreItems: [],
      backgroundColor: '',
      fullscreen: false,
      currentLeftMenu: [],
    };
  },
  computed: {
    showBreadcrumb() {
      return !this.metaBreadcrumb && this.breadcrumb && !_.get(this.active, 'meta.breadcrumb.hide');
    },
    metaBreadcrumb() {
      return _.get(this.active, 'meta.breadcrumb') === false;
    },
    computedPadding() {
      if (!this.sidePadding) {
        return this.padding;
      }
      const arr = this.padding.split(' ');
      const result = [];
      arr.map((i, index) => {
        if (index % 2 === 0) {
          result.push(i);
        } else {
          result.push(this.sidePadding);
        }
      });
      return result.join(' ');
    },
    computedStyle() {
      const { computedPadding, accordion, collapse, noNavi, fullscreen } = this;
      const paddingArr = computedPadding.split(' ');
      const [
        paddingTop = '0px',
        paddingRight = '0px',
        paddingBottom = '0px',
        paddingLeft = '0px',
      ] = paddingArr;
      let accWidth = '200';
      let naviHeight = '60';

      if (fullscreen) {
        return {
          margin: '0px',
          padding: '0px',
          width: `100%`,
          height: `100%`,
          overflow: 'hidden',
        };
      }
      if (noNavi) {
        //不显示菜单
        accWidth = '0';
        naviHeight = '0';
      } else if (!accordion || !this.currentLeftMenu) {
        //顶部导航
        accWidth = '0';
        naviHeight = '60';
      } else if (accordion && collapse) {
        //收缩手风琴
        accWidth = '64';
        naviHeight = '0';
      } else if (accordion && !collapse) {
        //展开手风琴
        accWidth = '200';
        naviHeight = '0';
      }

      return {
        padding: computedPadding,
        width: `calc(100% - ${accWidth}px - ${paddingLeft} - ${paddingRight})`,
        height: `calc(100% - ${naviHeight}px - ${paddingBottom} - ${paddingTop})`,
        marginLeft: this.currentLeftMenu? '200px' : '0'
      };
    },
    computedLineStyle() {
      const { computedPadding } = this;
      const paddingArr = computedPadding.split(' ');
      const [
        paddingTop = '0px',
        paddingRight = '0px',
        paddingBottom = '0px',
        paddingLeft = '0px',
      ] = paddingArr;
      const lineWidth = `calc(100% + ${paddingLeft} + ${paddingRight})`;
      return {
        width: lineWidth,
        left: `-${paddingLeft}`,
      };
    },
    customSelect() {
      return (
        this.$listeners &&
        (this.$listeners['routeChange'] || this.$listeners['route-change'])
      );
    },
    langIcon() {
      const langMap = {
        'en-US': 'icon-zhongwen',
        'zh-CN': 'icon-yingwen',
      };
      return _.get(langMap, this.lang);
    },
    themeIcon() {
      const themeMap = {
        'theme-dark': 'icon-zhutiqianse',
        'theme-light': 'icon-zhutishense2',
      };
      return _.get(themeMap, this.theme);
    },
    judgeClass() {
      return this.accordion ? 'cb-back-layout' : 'cb-front-layout';
    },
  },
  watch: {
    '$route.path': {
      handler() {
        let nameArray = this.routeData.map((item) => {
          return item.name;
        });
        if (nameArray.indexOf(this.$route.name) > -1) {
          let index = nameArray.indexOf(this.$route.name);
          this.active = this.routeData[index];
        } else {
          this.active = this.$route;
        }
        const topMenu = getTopMenu(this.active, this.routeData);
        this.$emit('active', this.active, topMenu);
      },
      immediate: true,
    },
    newActive: {
      handler(val) {
        if (val) {
          this.active = val;
        }
      },
      immediate: true,
      deep: true,
    },
    currentMenu: {
      handler(val) {
        if (val) {
          this.handleMenuData();
        }
      },
      immediate: true,
      deep: true,
    },
    showBreadcrumb: {
      handler() {
        this.setContentSize();
      },
    },
  },
  created() {
    this.initRoutes();
    bus.$on('navi_active_name', (name) => {
      // 子项目内路由触发
      const active = _.find(this.routeData, { name });
      if (active) {
        this.active = active;
        window.scrollTo({
          top: 0,
          behavior: 'smooth',
        });
      }
    });

    bus.$on('full_screen', (bool) => {
      this.fullscreen = bool;
    });
  },
  mounted() {
    this.backgroundColor = this.bgColor;
    this.setViewPortSize();
    const cls = this.accordion ? ['accordion', 'navi'] : ['navi'];
    if (!isSubFrame()) {
      document.body.classList.remove('accordion');
      document.body.classList.remove('navi');
      cls.forEach((i) => {
        document.body.classList.add(i);
      });
      this.setContentSize();
    }
    window.addEventListener('resize', this.resizeHandler, true);
  },

  beforeDestroy() {
    window.removeEventListener('resize', this.resizeHandler, true);
    bus.$off('navi_active_name');
    bus.$off('full_screen');
  },
  methods: {
    // 处理菜单数据
    handleMenuData() {
      var ids = this.routeData.map((item) => {
        return item.name;
      });
      var parents = this.routeData.map((item) => {
        return item.meta._parentName;
      });
      const newArray = [];
      const compareArrays = (curMenu, ids) => {
        curMenu.map((menu) => {
          if (ids.indexOf(menu.id) > -1) {
            let route_index = ids.indexOf(menu.id);
            this.routeData[route_index].meta.title = menu.name;
            menu.meta = this.routeData[route_index].meta;
            menu.path = this.routeData[route_index].path;
            menu.meta.title = menu.name;
            delete menu.name;
            menu.name = this.routeData[route_index].name;
            menu.component = this.routeData[route_index].component;
            if (menu.parent !== 'front_all' && menu.parent !== 'back_all') {
              if (!menu.meta.breadcrumb) {
                menu.meta.breadcrumb = true;
              }
            }
            if (menu.parent === 'front_all' || menu.parent === 'back_all') {
              if (!menu.children) {
                menu.meta.breadcrumb = false;
                menu.meta._folderName = [];
                if (this.active.name === menu.name) {
                  this.newActive = menu;
                }
              }
            }
          }
          parents.map((parent, index) => {
            if (parent.includes(menu.id)) {
              newArray.push(this.routeData[index]);
            }
          });
          if (menu.children) {
            compareArrays(menu.children, ids);
          }
        });
        return [...curMenu, ...newArray];
      };

      if (this.currentMenu && this.routeData.length) {
        const cloneData = _.cloneDeep(this.currentMenu);
        const data = compareArrays(cloneData.children, ids);
        // if (this.accordion && !this.noNavi) {
        //   this.naviHeaderData = [];
        //   this.naviData = data;
        // } else {
          this.naviHeaderData = data;
          this.naviData = data;
        // }
      }
    },
    isLayout(item) {
      return item.name === 'layout' || _.get(item, 'meta.layout') === true;
    },
    initRoutes() {
      if (this.$slots.header) {
        return;
      }
      let isDynamic = this.$router.options.routes.some((item) => {
        return this.isLayout(item);
      });
      let routes = isDynamic ? this.$router.options.routes : getDynamicRouter();
      if (!routes) {
        return;
      }
      const matchRoute = (arr, _root, layout) => {
        const root = _root || arr;
        arr.map((i) => {
          if (i.name === this.$route.name) {
            if (this.accordion && !this.noNavi) {
              this.naviHeaderData = [];
            } else {
              this.naviHeaderData = root;
            }
            this.naviData = root;
            this.routeData = getAllPath(this.naviData);
            this.active = i;
            this.breadcrumbPreItems = _.get(
              layout,
              'meta.breadcrumb.preItems',
              [],
            );
          }
          if (i.children) {
            matchRoute(i.children, root, layout);
          }
        });
      };
      routes.map((i) => {
        if (!_.isArray(i.children)) {
          return;
        }
        const layout = this.isLayout(i) ? i : null;
        matchRoute(i.children, null, layout);
      });
    },
    hotKeyClick(item) {
      /**
       * 热键点击事件
       *
       * @event hotKeyClick
       * @property {item} content content of the first prop passed to the event
       * @property {object} example the demo example
       */
      this.$emit('hotKeyClick', item);
      this.$emit('hot-key-click', item);
    },

    setCollapse(status) {
      this.collapse = status;
      /**
       * 手风琴收缩展开事件
       *
       * @event collapse
       * @property {item} status status
       * @property {object} example the demo example
       */
      this.$emit('collapse', status);
      window.dispatchEvent(new Event('resize'));
    },

    menuSelect(name, item, params) {
      this.currentLeftMenu = params;
      if (this.active !== name) {
        clearMemory();
        this.select(params[0].name, params[0], params);
      }
    },
    menuSelectAccordion(name, item, params) {
      if (this.active !== name) {
        clearMemory();
        this.select(name, item, params);
      }
    },
    select(name, item, params) {
      if (this.customSelect) {
        this.$emit('routeChange', name, item, params);
        this.$emit('route-change', name, item, params); //兼容
      } else {
        this.$router.push({ name, params });
      }
    },

    setContentSize() {
      const paddingArr = this.computedPadding.split(' ');
      const [
        paddingTop = '0px',
        paddingRight = '0px',
        paddingBottom = '0px',
        paddingLeft = '0px',
      ] = paddingArr;
      const layoutContent =
        this.$refs.cbLayoutContentRef.getBoundingClientRect();
      //前后台面包屑高度调整
      let headerHeight;
      if (this.showBreadcrumb) {
        headerHeight = '48px';
        document.body.style.setProperty('--breadcrumb-height', '48px');
      } else {
        headerHeight = '0px';
      }
      const contentWidth = `calc(${layoutContent.width}px - ${paddingLeft} - ${paddingRight})`;
      let contentHeight =
        layoutContent.height -
        parseInt(paddingTop) -
        parseInt(paddingBottom) -
        parseInt(headerHeight);
      contentHeight = `calc(${Math.max(this.minSize[1], contentHeight)}px)`;
      // 是否存在面包屑
      if (this.showBreadcrumb && document.body.classList.contains('navi')) {
        document.body.classList.add('has-breadcrumb');
      } else {
        document.body.classList.remove('has-breadcrumb');
      }
      document.body.style.setProperty('--content-height', contentHeight);
      document.body.style.setProperty('--content-width', contentWidth);
    },

    setViewPortSize() {
      document.body.style.setProperty(
        '--content-min-width',
        this.minSize[0] + 'px',
      );
      const mainWin = getMainWin();
      const setVarProperty = () => {
        const vw = mainWin.innerWidth / 100;
        const vh = mainWin.innerHeight / 100;
        document.body.style.setProperty('--vh', vh + 'px');
        document.body.style.setProperty('--vw', vw + 'px');
      };
      setVarProperty();
      this.viewPortSizeEvent = _.debounce(() => {
        this.$emit('viewport-resize', {
          width: mainWin.innerWidth,
          height: mainWin.innerHeight,
        });
        setVarProperty();
      }, 200);
    },
    setAccCollapse(bool) {
      this.$refs.cbAccordionRef && this.$refs.cbAccordionRef.setCollapse(bool);
    },
    resizeHandler() {
      this.viewPortSizeEvent();
      if (!isSubFrame()) {
        this.setContentSize();
      }
    },
    emitLangSwitch(lang) {
      this.$emit('onLangSwitch', lang);
      this.$emit('on-lang-switch', lang); //兼容
    },
    emitThemeSwitch(theme) {
      this.$emit('onThemeSwitch', theme);
      this.$emit('on-theme-switch', theme); //兼容
    },
    onLangSwitch() {
      this.lang = this.lang === 'zh-CN' ? 'en-US' : 'zh-CN';
      if (
        this.$listeners &&
        (this.$listeners['onLangSwitch'] || this.$listeners['on-lang-switch'])
      ) {
        this.$emit('onLangSwitch', this.lang);
        this.$emit('on-lang-switch', this.lang);
      } else {
        setLanguage(this.lang, true);
      }
    },
    onThemeSwitch() {
      this.theme = this.theme === 'theme-dark' ? 'theme-light' : 'theme-dark';
      if (
        this.$listeners &&
        (this.$listeners['onThemeSwitch'] || this.$listeners['on-theme-switch'])
      ) {
        this.$emit('onThemeSwitch', this.theme);
        this.$emit('on-theme-switch', theme); //兼容
      } else {
        setTheme(this.theme);
      }
    },
    handleCommand(command) {
      this.$emit('command', command);
    },
  },
};
</script>
