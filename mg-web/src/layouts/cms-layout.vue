<template>
  <div class="root-container">
    <!-- :logoName="logoName" -->
    <cb-layout
      ref="cbLayoutRef"
      show-flag
      :current-menu="currentMenu"
      :show-bell="false"
      :logo="logo"
      :name-logo="nameLogo"
      :avatar="avatar"
      :user-info="userInfo"
      :user-commands="userCommands"
      :no-navi="noNavi"
      :show-toggle="true"
      :talentObj="talentObj"
      @talentClick="talentClick"
      padding="0px 16px 24px 16px"
      :theme-switch="themeSwitch"
      :lang-switch="langSwitch"
      accordion
      @collapse="collapse"
      @command="handleCommand"
      @routeChange="beforeRouteChange"
      @onLangSwitch="onLangSwitch"
      :showQuickEntry="true"
      @quick-entry="goQuickEntry"
    >
      <transition name="fade-transform" mode="out-in">
        <router-view v-if="userInfoReady" :key="routeKey" />
      </transition>
    </cb-layout>
    <about ref="aboutRef" />
    <!-- <AI-chat :userInfo="userInfo" ref="AIRef" /> -->
    <convenient-operation
      :showRunningScene="false"
      :showAI="supportAI"
    ></convenient-operation>
    <cb-dialog
      v-if="showChangePwd"
      :title="$t('changePwd.changePassword')"
      :visible.sync="showChangePwd"
      class="change-pwd-dialog"
      :width="language === 'en-US' ? '780px' : '480px'"
    >
      <change-password
        type="normal"
        ref="changePasswordRef"
        @cancel="cancelPwd"
      />
    </cb-dialog>
  </div>
</template>

<script>
import defaultAvatar from '../assets/default-avatar.png';
import _ from 'lodash';
import {
  logout,
  initLayout,
  getUserInfo,
  getSysSettings,
  startHeartbeat,
  clearHeartbeat,
  setLanguage,
} from '@cyber/helper';
import utils from '@/utils/utils';
import { getAppByPath, emitCurrentApp } from '@/frame/apps.js';
import { defaultLogo } from '@/api/personal';
import { getLanguage } from '@cyber/helper';
import { getSystemSettingAllConfig } from '@/api/system';
import About from './components/about';
import ChangePassword from '@/pages/change-password';
import { currentMenu } from '@/api/role';
import AIChat from './components/AI-chat';
import ConvenientOperation from './components/convenient-operation';

export default {
  inject: ['title'],
  components: { About, ChangePassword, AIChat, ConvenientOperation },
  data() {
    return {
      isCollapse: false,
      language: getLanguage(),
      defaultAvatar,
      systemLogo: '',
      systemSmallLogo: '',
      noNavi: false,
      currentMenu: {},
      talentObj: {
        show: false,
        icon: 'icon-changjingguanli',
        title: this.$t('personTrainingScreen.cyberPersonTraing'),
      },
      userCommands: [
        {
          label: this.$t('mgRoutes.intoFront'),
          command: 'front',
        },
        {
          label: this.$t('mgRoutes.changePassword'),
          command: 'changePassword',
        },
        {
          label: this.$t('mgRoutes.versionInfo'),
          command: 'about',
        },
        {
          label: this.$t('mgRoutes.logOut'),
          command: 'logout',
        },
      ],
      originSystemName: '', // 初始系统名称
      showChangePwd: false,
      supportAI: false, // 是否支持ai
    };
  },
  computed: {
    routeKey() {
      const paramStr = _.values(this.$route.params || {}).join('/');
      //只有query不同时不刷新路由
      return this.$route.name + '/' + paramStr;
    },
    avatar() {
      if (this.userInfo?.id) {
        return this.userInfo.avatar || defaultAvatar;
      }
    },
    userInfo() {
      return this.$store.state.user;
    },
    userInfoReady() {
      return this.userInfo.id;
    },
    nameLogo() {
      return this.logo
        ? ''
        : _.get(this.$store.state.user, 'system_setting.system_name');
    },
    logo() {
      return this.isAmend
        ? _.get(this.$store.state.user, 'system_setting.logo')
        : this.systemLogo;
      // if (this.isAmend) {
      //   return this.isCollapse
      //     ? ''
      //     : _.get(this.$store.state.user, 'system_setting.logo');
      // } else {
      //   // 未修改过，则使用默认
      //   return this.isCollapse ? this.systemSmallLogo : this.systemLogo;
      // }
    },
    logoName() {
      return this.logo
        ? ''
        : this.isCollapse
        ? ''
        : _.get(this.$store.state.user, 'system_setting.system_name');
    },
    system_name() {
      return _.get(this.$store.state.user, 'system_setting.system_name');
    },
    CurrentSystemLogo() {
      return _.get(this.$store.state.user, 'system_setting.logo');
    },
    isAmend() {
      // 若系统名称和原始系统名称不一致 || logo有值，
      // 则代表在系统配置页面修改了系统名称或者上传了新logo
      // originSystemName: '', // 初始系统名称
      // CurrentSystemLogo: '', // 当前系统logo
      if (
        this.originSystemName !== this.system_name ||
        this.CurrentSystemLogo
      ) {
        return true;
      } else {
        return false;
      }
    },
    themeSwitch() {
      return _.get(this.$store.state.user, 'system_setting.system_theme') ===
        '1'
        ? true
        : false;
    },
    langSwitch() {
      return _.get(this.$store.state.user, 'system_setting.system_lang') ===
        '1' && !_.get(this.$store.state.config.configData, 'language')
        ? true
        : false;
    },
  },
  watch: {
    system_name(val) {
      if (val) {
        document.title = val;
      }
    },
  },
  created() {
    this.checkIsActived()
      .then(() => {
        initLayout().then(() => {
          getUserInfo();
          if (!_.get(this.$store, 'state.user.system_setting.copyright')) {
            getSysSettings();
          }
          startHeartbeat();
        });
      })
      .catch(() => {
        logout();
      });
    this.getCurrentMenu();
  },
  mounted() {
    // utils.loadCss('dark');
    utils.loadCss('light');
    if (window.innerWidth < 1580) {
      this.$refs.cbLayoutRef.setAccCollapse(true);
    }
    this.getOriginSystemName();
    this.getDefaultLogo();
  },
  destroyed() {
    clearHeartbeat();
  },
  methods: {
    goQuickEntry() {
      // 跳转 快速入门手册
      window.open('/manual/', '_blank');
    },
    async getCurrentMenu() {
      await currentMenu().then((res) => {
        const data = _.get(res, 'data.data', []);
        const backData = data.filter((item) => item.id === 'back_all');
        const frontData = data.filter((item) => item.id === 'front_all');
        this.currentMenu = backData[0];
        if (
          frontData[0]?.children?.some(
            (item) => item.id === 'intelligence-center',
          )
        ) {
          this.supportAI = true;
        }
      });
    },
    getOriginSystemName() {
      getSystemSettingAllConfig().then((res) => {
        const data = _.get(res, 'data.data', []);
        const filterSystemName = data.filter((item) => {
          return item.key_name === 'system_name';
        });
        if (filterSystemName) {
          this.originSystemName = filterSystemName[0].init_value;
        }
      });
    },
    getDefaultLogo() {
      defaultLogo().then((res) => {
        const data = _.get(res, 'data.data');
        let dataLogo;
        let singleLogo;
        for (const key in data) {
          if (key.includes(this.language)) {
            dataLogo = data[key];
          }
          if (key.includes('fold')) {
            singleLogo = data[key];
          }
        }
        this.systemLogo = `${dataLogo}`;
        this.systemSmallLogo = `${singleLogo}`;
      });
    },
    talentClick() {
      const displayUrl = this.$router.resolve({
        name: 'person-training-screen',
      });
      window.open(displayUrl.href, '_blank');
    },
    onLangSwitch(lang) {
      setLanguage(lang, true);
    },
    checkIsActived() {
      return new Promise((resolve, reject) => {
        this.$request
          .get('/sys/activation/status', null, { baseURL: '/api/mp' })
          .then((res) => {
            const data = _.get(res, 'data.data', {});
            const isActived = data.is_actived === 1;
            const items = _.get(res, 'data.data.items', []);
            this.handleItems(items);
            if (isActived) {
              resolve(data);
            } else {
              reject();
            }
          })
          .catch(() => {
            reject();
          });
      });
    },
    handleItems(data) {
      data.map((item) => {
        if (item.key === 'LCS-FUNC-CR-SHIXUN' && item.value === '1') {
          this.talentObj.show = true;
        }
      });
    },
    routeChange(name, item, params) {
      const activeApp = getAppByPath(item.path).name;
      const oldApp = getAppByPath(this.$route.path).name;
      if (!item.path || !item.name) {
        return;
      }
      if (_.get(item, 'meta.new_tab') && item.path.match(/^\w+:\/\//)) {
        window.open(item.path);
        return;
      }

      if (activeApp !== oldApp || (!activeApp && !oldApp)) {
        this.$router.push({ name, params });
      } else {
        emitCurrentApp('pushRoute', { name, params });
      }
    },
    beforeRouteChange(name, item, params) {
      if (this.isShowConfirm()) {
        this.$confirm(this.$t('course.quitTip'), '', {
          confirmButtonText: this.$t('course.goOn'),
          cancelButtonText: this.$t('course.cancel'),
          type: 'warning',
        }).then(() => {
          this.routeChange(name, item, params);
        });
      } else {
        this.routeChange(name, item, params);
      }
    },
    handleCommand(command) {
      // 添加直播跳转二次确认
      if (this.isShowConfirm()) {
        this.$confirm(this.$t('course.quitTip'), '', {
          confirmButtonText: this.$t('course.goOn'),
          cancelButtonText: this.$t('course.cancel'),
          type: 'warning',
        }).then(() => {
          this.handleCommandItem(command);
        });
      } else {
        this.handleCommandItem(command);
      }
    },
    handleCommandItem(command) {
      if (command === 'logout') {
        this.$request.get('/auth/logout', undefined, { baseURL: '/api/mp' });
        logout();
      } else if (command === 'front') {
        const base = this.$router.options.base;
        window.open(`${base}/`, '_self');
      } else if (command === 'changePassword') {
        this.showChangePwd = true;
        // this.$router.push({
        //   name: 'change-password',
        //   params: {
        //     type: 'normal',
        //   },
        // });
      } else if (command === 'about') {
        this.$refs.aboutRef.dialogAbout = true;
      }
    },
    isShowConfirm() {
      // 添加直播跳转二次确认
      let showConfirm =
        JSON.parse(sessionStorage.getItem('is-live')) &&
        (window.location.href?.indexOf('classroom-manage') >= 0 ||
          window.location.href?.indexOf('theory-classroom-manage') >= 0);
      return showConfirm;
    },
    collapse(value) {
      this.isCollapse = value;
      window.dispatchEvent(new CustomEvent('acc-collapse'));
    },
    cancelPwd() {
      this.showChangePwd = false;
    },
  },
};
</script>

<style lang="scss" scoped>
.root-container {
  width: 100%;
  height: 100%;
}
</style>

<style lang="scss">
.el-tooltip:focus.focusing {
  outline-width: 0;
}
/* fade-transform */
.fade-transform-leave-active,
.fade-transform-enter-active {
  transition: all 0s;
}

.fade-transform-enter {
  opacity: 0;
}

.fade-transform-leave-to {
  opacity: 0;
}
.cb-accordion__logo-icon {
  justify-content: center;
  img {
    overflow: hidden;
    margin-left: 10px;
  }
}
.cb-accordion__logo-name {
  text-align: center;
  font-family: logoName !important;
  margin-left: 10px;
  margin-right: 10px;
  word-break: break-word;
}
.cb-layout-user {
  .el-avatar,
  .el-avatar--circle {
    height: 48px !important;
    width: 48px !important;
    line-height: 48px !important;
    img {
      object-fit: fill !important;
      width: 48px;
    }
  }
}
</style>
<style lang="scss">
.root-container {
  .navi-logo {
    width: 170px;
    .name-logo {
      text-align: center;
      overflow: hidden;
      font-family: logoName !important;
      word-break: break-word;
    }
    .logo-icon {
      img {
        width: 100%;
      }
    }
  }
}
</style>
