<template>
  <div class="user-dropdown">
    <cb-dropdown
      v-if="userCommands.length > 0"
      class="navi-user"
      @command="handleCommand"
    >
      <div class="navi-avatar">
        <Avatar v-if="avatar !== false && userHead" :src="userHead"></Avatar>
        <div class="navi-avatar__name">
          <div v-if="userName" class="navi-avatar__name-user">
            {{ userName }}
          </div>
          <div v-if="roleName" class="navi-avatar__name-role">
            {{ roleName }}
          </div>
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
    <div class="navi-avatar navi-user" v-else>
      <Avatar v-if="avatar !== false && userHead" :src="userHead"></Avatar>
      <div class="navi-avatar__name">
        <div v-if="userName" class="navi-avatar__name-user">
          {{ userName }}
        </div>
        <div v-if="roleName" class="navi-avatar__name-role">
          {{ roleName }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import defaultUserHead from '../../../../assets/img/userhead.png';
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
      type: Object,
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
      return this.userInfo.username;
    },
    roleName() {
      return this.userInfo.name;
    },
    userHead() {
      return this.avatar;
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
