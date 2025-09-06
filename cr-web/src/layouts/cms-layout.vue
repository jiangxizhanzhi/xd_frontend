<template>
  <cb-layout
    :avatar="avatar"
    :user-info="userInfo"
    :showToggle="false"
    :user-commands="userCommands"
    :no-navi="noNavi"
    :breadcrumb="breadcrumb"
    :padding="padding"
    theme-switch
    accordion
    @command="handleCommand"
    @routeChange="routeChange"
  >
    <router-view :key="routeKey" />
  </cb-layout>
</template>
<script>
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
  components: {},
  data() {
    return {
      defaultAvatar,
      noNavi: false,
      breadcrumb: true,
      padding: '0 20px 24px 20px',
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
      // getSysSettings();
    });
    if (isSubFrame()) {
      this.noNavi = true;
      this.breadcrumb = false;
      this.padding = '0';
    }
  },
  watch: {},
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
      }
      if (command === 'front') {
        const base = this.$router.options.base;
        window.open(`${base}`, '_self');
      }
    },
  },
};
</script>
