<template>
  <div class="cb-user-dropdown">
    <cb-dropdown v-if="userCommands.length > 0" @command="handleCommand">
      <div class="cb-user-dropdown__avatar">
        <Avatar v-if="avatar !== false" :size="40" :src="userHead"></Avatar>
        <div v-if="userName || role" class="cb-user-dropdown__info">
          <span> {{ userName }} </span>
          <span> {{ role }} </span>
        </div>
        <i class="el-icon-arrow-down"></i>
      </div>
      <cb-dropdown-menu slot="dropdown">
        <cb-dropdown-item
          v-for="c in userCommands"
          :key="c.label"
          :command="c.command"
        >
          {{ c.label }}
        </cb-dropdown-item>
      </cb-dropdown-menu>
    </cb-dropdown>
    <div class="cb-user-dropdown__avatar" v-else>
      <Avatar v-if="avatar !== false" :size="40" :src="userHead"></Avatar>
      <div v-if="userName" class="cb-user-dropdown__name">
        {{ userName }}
      </div>
    </div>
  </div>
</template>

<script>
import defaultUserHead from '../../../../assets/img/userhead.png';
import _ from 'lodash';
import { Avatar } from 'element-ui';

export default {
  components: {
    Avatar,
  },
  props: {
    /**
     * 用户头像图
     */
    avatar: {
      type: String,
      default: null,
    },
    /**
     * 用户信息
     */
    userInfo: {
      type: Object | String,
      default: null,
    },
    /**
     * 用户下拉菜单项数据
     */
    userCommands: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {};
  },
  computed: {
    userName() {
      return _.get(this.userInfo, 'username');
    },
    userHead() {
      return this.avatar || defaultUserHead;
    },
    role() {
      return _.get(this.userInfo, 'name');
    },
  },
  mounted() {},
  beforeDestroy() {},
  methods: {
    handleCommand(command) {
      this.$emit('command', command);
      if (typeof command === 'function') {
        command();
      }
    },
  },
};
</script>
