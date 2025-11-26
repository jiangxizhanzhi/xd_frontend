```html
<template>
  <div style="width: 100%">
    <cb-navi
      :lang-switch="true"
      :theme-switch="true"
      :data="naviData"
      :logo="logo"
      :avatar="avatar"
      :user-commands="userCommands"
      :user-info="userInfo"
      name-logo="navigation"
      name-field="title"
      :show-bell="true"
      notice-count="3"
      :active="active"
      :talentObj="talentObj"
      :showQuickEntry="true"
      @command="handleCommand"
      @select="selectItem"
      @bellMessage="bellMessage"
      @onThemeSwitch="onThemeSwitch"
      @onLangSwitch="onLangSwitch"
    >
      <div slot="footer">footer</div>
    </cb-navi>
    <span class="demonstration">click 激活</span>
    <cb-dropdown trigger="click">
      <span class="el-dropdown-link">
        下拉菜单<i class="el-icon-arrow-down el-icon--right"></i>
      </span>
      <cb-dropdown-menu slot="dropdown">
        <cb-dropdown-item icon="el-icon-plus">黄金糕</cb-dropdown-item>
        <cb-dropdown-item icon="el-icon-circle-plus">狮子头</cb-dropdown-item>
        <cb-dropdown-item icon="el-icon-circle-plus-outline"
          >螺蛳粉</cb-dropdown-item
        >
        <cb-dropdown-item icon="el-icon-check">双皮奶</cb-dropdown-item>
        <cb-dropdown-item icon="el-icon-circle-check">蚵仔煎</cb-dropdown-item>
      </cb-dropdown-menu>
    </cb-dropdown>
  </div>
</template>

<script>
  import avatar from '@/assets/img/userhead.png';

  export default {
    components: {},
    name: 'navi',
    data() {
      return {
        talentObj: {
          show: true,
          icon: 'icon-changjingguanli',
          title: this.$t('personTrainingScreen.cyberPersonTraing'),
        },
        avatar,
        showFlag: true,
        showToggle: true,
        logo: 'https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f3c3c98ebfce4ae28db981dfabedc1d8~tplv-k3u1fbpfcp-zoom-1.image',
        userInfo: {
          username: 'admin',
          name: '组织',
        },
        active: {
          name: 'course-list',
        },
        naviData: [
          {
            path: '/dashboard',
            name: 'dashboard', //所有独立菜单项都要有目录层级
            title: '仪表盘', //显示在菜单的目录标题
            meta: {
              iconfont: 'icon-yibiaopan',
            },
          },
          {
            path: '/course',
            name: 'course',
            title: '课程管理',
            meta: {
              iconfont: 'icon-xitongguanli',
            },
            children: [
              {
                path: '/path1',
                name: 'course-list',
                title: '课程表',
                component: '',
              },
              {
                path: '/path2',
                name: 'statics',
                title: '学习统计',
                component: '',
              },
            ],
          },
          {
            path: '/subject',
            name: 'subject',
            title: '题目管理',
            meta: {
              iconfont: 'icon-tikuguanli',
            },
            children: [
              {
                path: '/path2',
                name: 'subject-list',
                title: '解题赛题目',
                component: '',
              },
            ],
          },
        ],
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
    computed: {},
    created() {},
    destroyed() {},
    watch: {},
    mounted() {},
    methods: {
      /**
       * @description: 处理点击用户下拉选项事件
       */
      handleCommand(command) {
        console.log(command);
      },
      /**
       * @description: 处理点击菜单事件
       */
      selectItem(name, item) {
        this.active = item;
        console.log(name, item);
      },
      /**
       * @description: 查看消息
       */
      bellMessage() {
        console.log('查看消息');
      },
      /**
       * @description: 切换主题
       */
      onThemeSwitch(theme) {
        console.log(theme);
      },
      /**
       * @description: 切换语言
       */
      onLangSwitch(lang) {
        console.log(lang);
      },
    },
  };
</script>

<style scoped></style>
<!--cb-navi.vue-->
```
