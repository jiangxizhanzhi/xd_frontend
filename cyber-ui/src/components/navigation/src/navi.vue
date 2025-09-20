<template>
  <div class="cb-navi">
    <div class="navi-content">
      <div class="navi-logo" @click="logoClick">
        <div v-if="$slots.logo" class="logo-icon-slot">
          <!-- @slot logo插槽，可在头部自定义展示图片或其他内容 -->
          <slot name="logo"></slot>
        </div>
        <div v-else class="logo-icon">
          <img :src="logo" draggable="false" v-if="logo" />
        </div>
        <div class="name-wrapper">
        <div
          v-if="system_name"
          class="name-logo"
          style="font-size: 22px"
        >
          {{ system_name }}
        </div>
        <div
          v-if="sub_system_name"
          class="name-logo"
          style="font-size: 16px"
        >
          {{ sub_system_name }}
        </div>
          </div>
      </div>

      <div class="nav-items">
        <navi-item
          v-for="(item, index) of data"
          :key="`nav-item-${index}`"
          :active="active"
          :item="item"
          :all-routes="allRoutes"
          :name-field="nameField"
          :is-expand="item[nameField] === curExpand"
          @hideSubMenu="hideSubMenu"
          @setExpand="setExpand"
          @setSelect="setSelect"
          @navi-menu-hover="handleNaviMenuHover"
          @navi-menu-leave="handleNaviMenuLeave"
        />
      </div>
    </div>
    <div class="navi-footer">
      <slot name="footer"></slot>
      <span v-if="showQuickEntry" @click="goQuickEntry" class="bell-boxs">
        <cb-tooltip :content="$t('g.quickEntry')">
          <cb-iconfont type="icon-kuaisurumen" size="20" />
        </cb-tooltip>
      </span>
      <span v-if="talentObj && talentObj.show" class="bell-boxs">
        <cb-tooltip :content="talentObj.title">
          <cb-iconfont
            :type="talentObj.icon"
            size="20"
            @click="talentClick"
          ></cb-iconfont>
        </cb-tooltip>
      </span>
      <span v-if="showBell" @click="showMessage" class="bell-boxs">
        <cb-iconfont type="icon-xiaoxi" size="20" />
        <span v-if="noticeCount" class="count-span">{{ noticeCount }}</span>
      </span>
      <span class="bell-boxs" v-if="themeSwitch">
        <cb-iconfont :type="themeIcon" size="20" @click="onThemeSwitch">
        </cb-iconfont>
      </span>
      <span class="bell-boxs" v-if="langSwitch">
        <cb-iconfont
          :type="langIcon"
          size="20"
          @click="onLangSwitch"
        ></cb-iconfont>
      </span>
      <user-dropdown
        v-if="avatar || userCommands.length > 0"
        :avatar="avatar"
        :user-info="userInfo"
        :user-commands="userCommands"
        @command="handleCommand"
      ></user-dropdown>
    </div>
  </div>
</template>

<script>
import _ from 'lodash';
import NaviItem from './components/navi-item.vue';
import UserDropdown from './components/user-dropdown.vue';
import CbIconfont from '../../iconfont';
import { getAllPath, getNameLength } from '../../../utils/navi';
import { setLanguage, getLanguage } from '@cyber/helper';
import { setTheme, getCurrentTheme } from '../../../utils/themes';

/**
 * 顶部导航菜单示例
 * @displayName cb-navi 导航菜单
 * @classify Navigation/导航
 */
export default {
  name: 'CbNavi',
  inheritAttrs: false,
  components: {
    NaviItem,
    UserDropdown,
    CbIconfont,
  },
  props: {
    /**
     * 人才态势按钮
     */
    talentObj: {
      type: Object,
      default: null,
    },
    /**
     * 头部logo图片
     *
     */
    logo: {
      type: null,
      default: null,
    },
    /**
     * 头部字体logo
     *
     */
    nameLogo: {
      type: String,
      default: '',
    },
    system_name: {
      type: String,
      default: '',
    },
    sub_system_name: {
      type: String,
      default: '',
    },
// :system_name="system_name"
// :sub_system_name="sub_system_name"
    /**
     * 用户头像图
     *
     */
    avatar: {
      type: String,
      default: null,
    },
    /**
     * 用户信息, 用户名(username)，组织(name)
     *
     */
    userInfo: {
      type: Object,
      default: () => null,
    },
    /**
     * 用户下拉菜单项数据
     *
     */
    userCommands: {
      type: Array,
      default: () => [],
    },
    /**
     * 菜单项数据
     *
     */
    data: {
      type: Array,
      default: () => {
        return [];
      },
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
    nameField: {
      type: String,
      default: 'name',
    },
    indexPage: {
      type: Object,
      default: () => null,
    },
    /**
     * 是否展示铃铛-消息列表
     *
     */
    showBell: {
      type: Boolean,
      default: true,
    },
    /**
     * 出现在按钮、图标旁的数字或状态标记
     *
     */
    noticeCount: {
      type: [String, Number],
      default: '',
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
      curExpand: null,
      lang: getLanguage() || 'zh-CN',
      theme: getCurrentTheme() || 'theme-dark',
    };
  },
  computed: {
    allRoutes() {
      return getAllPath(this.data);
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
  },
  methods: {
    goQuickEntry() {
      this.$emit('quickEntry');
      this.$emit('quick-entry');
    },
    // 获取name长度
    getTextLogoLength(str) {
      return getNameLength(str);
    },
    showMessage() {
      /**
       * 查看消息
       *
       */
      this.$emit('bellMessage');
      this.$emit('bell-message');
    },
    talentClick() {
      this.$emit('talentClick');
      this.$emit('talent-click');
    },
    logoClick() {
      if (this.indexPage) {
        this.$emit('select', this.indexPage.name, this.indexPage);
        return;
      }
      this.$emit('logoClick');
      this.$emit('logo-click');
    },
    hideSubMenu() {
      this.setExpand(null);
    },
    setExpand(val) {
      this.curExpand = val;
    },
    setSelect(name, item, children) {
      if (item.path !== this.active.path || item.name !== this.active.name) {
        /**
         * 菜单激活回调
         *
         * @property {String} name 对应的name
         * @property {Object} item 当前的菜单项
         */
        this.$emit('select', name, item, children);
      }

      this.hideSubMenu();
    },
    handleCommand(command) {
      /**
       * 用户下拉选项
       *
       * @event command
       * @type {object}
       * @property {String} command 对应的选项名称
       */
      this.$emit('command', command);
    },
    onLangSwitch() {
      this.lang = this.lang === 'zh-CN' ? 'en-US' : 'zh-CN';
      setLanguage(this.lang);
      /**
       * 切换语言
       *
       * @type {string}
       * @property {String} lang  zh-CN || en-US
       */
      this.$emit('onLangSwitch', this.lang);
      this.$emit('on-lang-switch', this.lang);
    },
    onThemeSwitch() {
      this.theme = this.theme === 'theme-dark' ? 'theme-light' : 'theme-dark';

      setTheme(this.theme);

      /**
       * 切换主题
       *
       * @type {string}
       * @property {String} theme  theme-dark  || theme-light
       */
      this.$emit('onThemeSwitch', this.theme);
      this.$emit('on-theme-switch', this.theme);
    },
    handleNaviMenuHover(data) {
      this.$emit('navi-menu-hover', data);
    },
    handleNaviMenuLeave(data) {
      this.$emit('navi-menu-leave', data);
    },
  },
};
</script>
<style scoped lang="scss">
.name-wrapper {
  display: flex;
  flex-direction: column;
  text-align: left;
  justify-content: flex-start;
  align-items: flex-start;
}
</style>
