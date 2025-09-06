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
    bg-color="var(--bg-color-1)"
    :theme-switch="true"
    :noticeCount="notificationCount"
    :showBell="false"
    @command="handleCommand"
    @routeChange="routeChange"
  >
    <router-view :key="routeKey" v-if="userInfoReady" />
  </cb-layout>
</template>
<script>
import logo from '../assets/small_logo.png';
import defaultAvatar from '../assets/default-avatar.png';
import {
  logout,
  isSubFrame,
  initLayout,
  getUserInfo,
  getSysSettings,
} from '@cyber/helper';
import _ from 'lodash';
export default {
  inject: ['title'],
  data() {
    return {
      logo,
      defaultAvatar,
      noNavi: false,
      breadcrumb: true,
      padding: undefined,
      defaultSidePadding: '5%',
      userCommands: [
        {
          label: '进入后台',
          command: 'admin',
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
    currentUser() {
      return this.$store.getters.user_data;
    },
    userInfo() {
      return this.$store.state.user;
    },
    avatar() {
      return this.userInfo.avatar || defaultAvatar;
    },
    userInfoReady() {
      return this.userInfo.id;
    },
  },
  created() {
    console.log('sub frame create');
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
  mounted() {},
  methods: {
    routeChange(name, item, params) {
      if (!item.path || !item.name) {
        return;
      }
      if (_.get(item, 'meta.new_tab') && item.path.match(/^\w+:\/\//)) {
        window.open(item.path);
        return;
      }
      this.$router.push({ name, params });
    },
    handleCommand(command) {
      if (command === 'logout') {
        logout();
      } else if (command === 'admin') {
        const base = this.$router.options.base;
        window.open(`${base}/admin/`, '_self');
      }
    },
  },
};
</script>
