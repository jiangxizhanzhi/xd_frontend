<template>
  <div class="root-container">
    <cb-layout
      ref="layoutRef"
      :current-menu="currentMenu"
      :logo="logo"
      :system_name="system_name"
      :sub_system_name="sub_system_name"
      :avatar="avatar"
      :user-info="userInfo"
      :user-commands="userCommands"
      :show-bell="showBell"
      :notice-count="notificationCount"
      padding="0px 3% 20px 3%"
      bg-color="none"
      accordion
      :theme-switch="themeSwitch"
      :lang-switch="langSwitch"
      :showToggle="false"
      @command="handleCommand"
      @routeChange="routeChange"
      @bellMessage="showMessage"
      @onLangSwitch="onLangSwitch"
      @logoClick="logoClick"
    >
      <transition name="fade-transform" mode="out-in">
        <router-view :key="routeKey" v-if="userInfoReady" />
      </transition>
    </cb-layout>
<!--    <message ref="noticeMessageRef" />-->
    <!-- <running-scene ref="sceneRef" />
    <AI-chat :userInfo="userInfo" ref="AIRef" /> -->
<!--    <convenient-operation :showAI="supportAI"></convenient-operation>-->
    <cb-dialog
      v-if="showChangePwd"
      :title="$t('changePwd.changePassword')"
      :visible.sync="showChangePwd"
      class="change-pwd-dialog"
      :width="language === 'en-US' ? '780px' : '480px'"
    >
      <change-password
        :type="pwdType"
        ref="changePasswordRef"
        @cancel="cancelPwd"
      />
    </cb-dialog>
  </div>
</template>

<script>
import defaultAvatar from '../assets/default-avatar.png';
import { getSystemSettingAllConfig } from '@/api/system';
import _ from 'lodash';
import {
  logout,
  initLayout,
  getUserInfo,
  getSysSettings,
  startHeartbeat,
  clearHeartbeat,
  getLanguage,
  setLanguage,
} from '@cyber/helper';
import Message from './components/message';
import RunningScene from './components/running-scene';
import AIChat from './components/AI-chat';
import ConvenientOperation from './components/convenient-operation';
import { getUnreadNoticeApi } from '@/api/message.ts';
import { defaultLogo } from '@/api/personal';

import wsutil from '@/utils/websocket';

import utils from '@/utils/utils';
import { getAppByPath, emitCurrentApp } from '@/frame/apps.js';
import ChangePassword from '@/pages/change-password';
import { currentMenu } from '@/api/role';
export default {
  inject: ['title'],
  components: {
    Message,
    RunningScene,
    ChangePassword,
    AIChat,
    ConvenientOperation,
  },
  data() {
    return {
      systemLogo: '',
      cookie: '',
      downloadUrlW: '',
      downloadUrlM: '',
      language: getLanguage(),
      defaultAvatar,
      dialogVisible: false,
      notificationCount: null,
      connection: null,
      originSystemName: '', // 初始系统名称
      showChangePwd: false,
      pwdType: '',
      currentMenu: {},
      specialUserId: '3cf215471268482c88a9986283e38c27',
      supportAI: false, // 是否支持AI
    };
  },
  computed: {
    userCommands() {
      return _.get(this.$store.state.user, 'id') !== this.specialUserId
        ? [
            _.get(this.$store.state, 'user.user_cms_permission')
              ? {
                  label: this.$t('route.intoBackground'),
                  command: 'admin',
                }
              : '',
            {
              label: this.$t('route.changePassword'),
              command: 'changePassword',
            },
            {
              label: this.$t('route.logOut'),
              command: 'logout',
            },
          ]
        : [];
    },
    routeKey() {
      const paramStr = _.values(this.$route.params || {}).join('/');
      //只有query不同时不刷新路由
      return this.$route.name + '/' + paramStr;
    },
    avatar() {
      if (this.userInfo?.id) {
        if (this.userInfo.id !== this.specialUserId) {
          return this.userInfo.avatar || defaultAvatar;
        } else {
          return '';
        }
      }
    },
    logo() {
      return this.systemLogo;
    },
    sub_system_name() {
      return _.get(this.$store.state.user, 'system_setting.sub_system_name');
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
    userInfo() {
      return this.$store.state.user;
    },
    userInfoReady() {
      return this.userInfo.id;
    },
    showBell() {
      return _.get(this.$store.state.user, 'id') !== this.specialUserId
        ? true
        : false;
    },
    themeSwitch() {
      return _.get(this.$store.state.user, 'system_setting.system_theme') ===
        '1' && _.get(this.$store.state.user, 'id') !== this.specialUserId
        ? true
        : false;
    },
    langSwitch() {
      // 如果在public/config.json中设置了系统语言，则不展示语言切换按钮
      return _.get(this.$store.state.user, 'system_setting.system_lang') ===
        '1' &&
        _.get(this.$store.state.user, 'id') !== this.specialUserId &&
        !_.get(this.$store.state.config.configData, 'language')
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
    // 关闭修改密码弹窗时设置状态
    showChangePwd(val, oldVal) {
      if (oldVal === true && val === false) {
        sessionStorage.setItem('show_change_pwd_default', 'true');
      }
    },
  },
  created() {
    this.getCurrentMenu();
    //获取cookie
    this.cookie = utils.getCookie('cr_jwttoken');
    // 获取服务器地址

    this.downloadUrlW = `${window.location.protocol}//${window.location.host}/download/cpms/situation/win/SceneCity.zip`;
    this.downloadUrlM = `${window.location.protocol}//${window.location.host}/download/cpms/situation/mac/SceneCity.app.zip`;

    this.pwdType = this.$route.query && this.$route.query.type;
    this.showChangePwd = this.$route.query && this.$route.query.changePwd;

    if (sessionStorage.getItem('show_change_pwd_default') === 'true') {
      // 如果弹出过一次修改密码弹窗，就不再自动弹出
      this.showChangePwd = false;
    } else {
      this.showChangePwd = !!this.showChangePwd; // 转成boolean值
    }

    this.checkIsActived()
      .then(() => {
        initLayout().then(() => {
          getUserInfo().then((res) => {
            this.handleSpecialUser(res);
          });
          if (!_.get(this.$store, 'state.user.system_setting.copyright')) {
            getSysSettings();
          }
          startHeartbeat();
          this.systemNotices();
        });
      })
      .catch(() => {
        logout();
      });
  },
  mounted() {
    // 加载配置化主题样式文件
    // utils.loadCss('dark');
    utils.loadCss('light');
    this.sceneTipsConnection();
    this.getOriginSystemName();
    this.getDefaultLogo();
  },
  destroyed() {
    clearHeartbeat();
    if (this.connection) {
      this.connection.close();
      this.connection = null;
    }
  },
  methods: {
    handleSpecialUser(data) {
      if (data.id === this.specialUserId) {
        this.$router.push({
          path: '/cr/tool_magazine',
        });
      }
    },
    async getCurrentMenu() {
      await currentMenu().then((res) => {
        const data = _.get(res, 'data.data', []);
        const frontData = data.filter((item) => item.id === 'front_all');
        this.currentMenu = frontData[0];
        if (
          this.currentMenu?.children?.some(
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
        for (const key in data) {
          if (key.includes(this.language)) {
            dataLogo = data[key];
          }
        }
        this.systemLogo = `${dataLogo}`;
      });
    },
    sceneTipsConnection() {
      this.connection = wsutil.bind(
        `/ojj/ws/oj/classroom/scene/tips?token=${this.cookie}`,
        (data) => {
          if (data) {
            this.openTip(data);
          }
        },
      );
    },
    openTip(data) {
      const host = window.location.host;
      const protocol = window.location.protocol;
      let goUrl = `${protocol}//${host}/page/mg/oj/all-course/lesson/${data.business_id}`;
      const _this = this;
      this.$notify({
        title: _this.$t('message.warning'),
        iconClass: 'el-icon-warning',
        duration: 10000,
        customClass: 'scene-countdown-tip',
        dangerouslyUseHTMLString: true,
        message:
          '<span class="wrap-span">“<a class="a-link cursor" href="' +
          goUrl +
          '">' +
          data.scene_name +
          '</a>”</span>' +
          _this.$t('sceneTips.sceneClose15'),
      });
    },
    // 跳转大屏
    handleGoScreen() {
      const path = '/page/mg/admin/screen-3/visual-screen';
      // window.open(path, '_blank');
      window.open(
        `${path}?&name=demo&scene_id=demo&token=${this.cookie}`,
        '_blank',
      );
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
    logoClick() {
      this.$router.push('/').catch((err) => {});
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
      /* 说明：
      1、activeApp !== oldApp：不同子应用切换 或者 基座和子应用间切换
      2、!activeApp && !oldApp：基座的模块详情到基座的菜单(不属于3类子应用：实训、靶场、竞赛)，如:个人中心的详情到个人中心菜单
      3、相同子应用不同模块间切换  或者 子应用模块的详情到子应用的菜单，如：原实训的我的职业的详情到我的职业菜单 */
      if (activeApp !== oldApp || (!activeApp && !oldApp)) {
        this.$router.push({ name, params });
      } else {
        emitCurrentApp('pushRoute', { name, params });
      }

    },
    handleCommand(command) {
      if (command === 'logout') {
        this.$request.get('/auth/logout', undefined, { baseURL: '/api/mp' });
        logout();
      } else if (command === 'admin') {
        const base = this.$router.options.base;
        window.open(`${base}/admin/`, '_self');
      } else if (command === 'changePassword') {
        this.pwdType = 'normal';
        this.showChangePwd = true;
        // this.$router.push({
        //   name: 'change-password',
        //   params: {
        //     type: 'normal',
        //   },
        // });
      }
    },
    systemNotices() {
      getUnreadNoticeApi().then((res) => {
        const data = _.get(res, 'data', null);
        const cnt = _.get(data, 'data', '') || 0;
        this.notificationCount = cnt > 99 ? '99+' : cnt;
      });
    },
    showMessage() {
      this.$refs.noticeMessageRef.dialogNotice = true;
      this.$refs.noticeMessageRef.getNotice();
    },
    cancelPwd() {
      this.showChangePwd = false;
    },
  },
};
</script>

<style lang="scss" scoped>
.situational-show-btn {
  width: 96px;
  left: 842px;
}
.situational-show-btn-en {
  width: 150px;
  left: 998px;
}
.situational-show-btn,
.situational-show-btn-en {
  position: fixed;
  height: 60px;
  font-size: 16px;
  line-height: 60px;
  text-align: center;
  top: 0px;
  z-index: 1000;
  color: var(--navi-item-color);
  cursor: pointer;
  ul {
    width: 168px;
    padding: 12px 20px 12px 4px;
    background: var(--navi-item-bg);
    margin-top: 0px;
    display: none;
  }
  li {
    list-style: none;
    width: 145px;
    height: 40px;
    text-align: left;
    line-height: 40px;
    padding: 0px 16px;
    a {
      display: inline-block;
      width: 100%;
      height: 100%;
      color: var(--navi-item-color);
      text-decoration: none;
    }
  }
}

.situational-show-btn:hover,
.situational-show-btn-en:hover {
  color: var(--primary-color);
  // box-shadow: 1px 2px 6px -2px var(--box-shadow-color);
}

.situational-show-btn:hover ul,
.situational-show-btn-en:hover ul {
  display: block;
}

.situational-show-btn ul li a:hover,
.situational-show-btn-en ul li a:hover {
  color: var(--primary-color);
}
.root-container {
  width: 100%;
  height: 100%;
}
</style>
<style lang="scss">
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
.user-dropdown {
  .el-avatar,
  .el-avatar--circle {
    width: 48px !important;
    height: 48px !important;
    line-height: 48px !important;
    img {
      width: 48px !important;
      height: 48px !important;
      object-fit: fill !important;
    }
  }
}
.navi-logo {
  width: 300px;
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
</style>
