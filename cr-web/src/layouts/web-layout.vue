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
    :noticeCount="notificationCount"
    theme-switch
    @command="handleCommand"
    @routeChange="routeChange"
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
      logo,
      defaultAvatar,
      noNavi: false,
      breadcrumb: true,
      padding: '0 16px 24px 16px',
      defaultSidePadding: '5%',
      userCommands: [
        {
          label: this.$t('m.toBackstage'),
          command: 'admin',
        },
        {
          label: this.$t('m.logOut'),
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
      return this.$store.state.user || {};
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
  watch: {},
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
    systemNotices() {
      getUnreadNoticeApi()
        .then((res) => {
          const data = _.get(res, 'data', null);
          const cnt = _.get(data, 'unread_count', '') || 0;
          this.notificationCount = cnt > 99 ? '99+' : cnt;
        })
        .catch((err) => {
          that.$serverError(err);
        });
    },
    handleCommand(command) {
      if (command === 'logout') {
        logout();
      }
      if (command === 'admin') {
        const base = this.$router.options.base;
        window.open(`${base}/admin/`, '_self');
      }
    },
  },
};
</script>

<style lang="scss"></style>
