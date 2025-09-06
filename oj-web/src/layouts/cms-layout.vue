<template>
  <cb-layout
    :logo="logo"
    :name-logo="title"
    :avatar="avatar"
    :user-info="userInfo"
    :user-commands="userCommands"
    :no-navi="noNavi"
    :breadcrumb="breadcrumb"
    :padding="padding"
    accordion
    theme-switch
    :noticeCount="notificationCount"
    @command="handleCommand"
    @routeChange="beforeRouteChange"
  >
    <router-view :key="routeKey" />
  </cb-layout>
</template>
<script>
import logo from '../assets/small_logo.png';
import defaultAvatar from '../assets/default-avatar.png';
import {
  logout,
  isSubFrame,
  getUserInfo,
  initLayout,
  getSysSettings,
} from '@cyber/helper';
import _ from 'lodash';
export default {
  inject: ['title'],
  components: {},
  data() {
    return {
      logo,
      defaultAvatar,
      noNavi: false,
      breadcrumb: true,
      padding: '0 16px 24px 16px',
      userCommands: [
        {
          label: '进入前台',
          command: 'front',
        },
        {
          label: '退出登录',
          command: 'logout',
        },
      ],
      notificationCount: null,
    };
  },
  computed: {
    routeKey() {
      return this.$route.fullPath;
    },
    userInfo() {
      return this.$store.state.user;
    },
    avatar() {
      return this.userInfo.avatar || defaultAvatar;
    },
  },
  created() {
    initLayout().then(() => {
      getUserInfo(undefined, undefined, { baseURL: '/api/mp' });
      getSysSettings();
    });
    if (isSubFrame()) {
      this.noNavi = true;
      this.breadcrumb = false;
      this.padding = '0';
    }
  },
  mounted() {
    getUserInfo(undefined, undefined, { baseURL: '/api/mp' });
  },
  methods: {
    beforeRouteChange(name, item) {
      if (this.isShowConfirm()) {
        this.$confirm(this.$t('live.quitTip'), '', {
          confirmButtonText: this.$t('live.goOn'),
          cancelButtonText: this.$t('live.cancel'),
          type: 'warning',
        }).then(() => {
          this.routeChange(name, item);
        });
      } else {
        this.routeChange(name, item);
      }
    },
    routeChange(name, item) {
      if (!item.path || !item.name) {
        return;
      }
      if (_.get(item, 'meta.new_tab') && item.path.match(/^\w+:\/\//)) {
        window.open(item.path);
        return;
      }
      this.$router.push({ name });
    },
    handleCommand(command) {
      // 添加直播跳转二次确认
      if (this.isShowConfirm()) {
        this.$confirm(this.$t('live.quitTip'), '', {
          confirmButtonText: this.$t('live.goOn'),
          cancelButtonText: this.$t('live.cancel'),
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
        logout();
      } else if (command === 'front') {
        const base = this.$router.options.base;
        window.open(`${base}`, '_self');
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
  },
};
</script>
