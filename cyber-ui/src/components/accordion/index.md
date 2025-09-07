```html
<template>
  <cb-accordion
    :data="naviData"
    :show-flag="showFlag"
    :show-toggle="showToggle"
    :logo="logo"
    :avatar="avatar"
    :user-commands="userCommands"
    :active="active"
    :user-info="userInfo"
    logo-name="下一代网络靶场下一代网络靶场"
    @command="handleCommand"
    @select="selectItem"
    @setCollapse="setCollapse"
  >
  </cb-accordion>
</template>

<script>
  import avatar from '@/assets/img/userhead.png';
  export default {
    components: {},
    data() {
      return {
        avatar,
        showFlag: true,
        showToggle: true,
        logo: 'https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f3c3c98ebfce4ae28db981dfabedc1d8~tplv-k3u1fbpfcp-zoom-1.image',
        active: {
          name: 'course',
        },
        naviData: [
          {
            path: '/dashboard',
            name: 'dashboard',
            meta: { title: 'dashboard.dashboard', iconfont: 'icon-yibiaopan' },
          },
          {
            path: '',
            name: 'courses-manage-folder',
            meta: { title: '课程管理', iconfont: 'icon-kechengguanli' },
            children: [
              {
                path: '/oj/admin/courses/list',
                name: 'courses',
                meta: { title: '课程管理' },
                children: [
                  {
                    path: '1312asdasda',
                    name: 'test1',
                    meta: { title: 'test1' },
                  },
                ],
              },
              {
                path: '/oj/admin/courses/add',
                name: 'courses-add',
                meta: { title: '新增', breadcrumb: { parentName: 'courses' } },
              },
              {
                path: '/oj/admin/courses/:courseId/edit/',
                name: 'courses-edit',
                meta: { title: '编辑', breadcrumb: { parentName: 'courses' } },
              },
              {
                path: '/oj/admin/courses/:courseId/visiblity',
                name: 'courses-visiblity',
                meta: {
                  title: '授权访问',
                  breadcrumb: { parentName: 'courses' },
                },
              },
              {
                path: '/oj/admin/courses/:courseId/auth',
                name: 'courses-auth',
                meta: {
                  title: '授权操作',
                  breadcrumb: { parentName: 'courses' },
                },
              },
              {
                path: '/oj/admin/courses/aspect/list',
                name: 'courses-aspect',
                meta: {
                  title: '方向管理',
                  breadcrumb: { parentName: 'courses' },
                },
              },
              {
                path: '/oj/admin/courses/aspect/add',
                name: 'courses-aspect-add',
                meta: {
                  title: '新增',
                  breadcrumb: { parentName: 'courses-aspect' },
                },
              },
              {
                path: '/oj/admin/courses/aspect/:aspectId/edit',
                name: 'courses-aspect-edit',
                meta: {
                  title: '编辑',
                  breadcrumb: { parentName: 'courses-aspect' },
                },
              },
              {
                path: '/oj/admin/courses/:courseId/lessons/list',
                name: 'lessons-manage',
                meta: {
                  title: '课时管理',
                  breadcrumb: { parentName: 'courses' },
                },
              },
              {
                path: '/oj/admin/courses/:courseId/lessons/:lessonId/practice',
                name: 'lessons-manage-practice',
                meta: {
                  title: '练习',
                  breadcrumb: { parentName: 'lessons-manage' },
                },
              },
              {
                path: '/oj/admin/course/:courseId/lesson/add',
                name: 'lessons-add',
                meta: {
                  title: '新增',
                  breadcrumb: { parentName: 'lessons-manage' },
                },
              },
              {
                path: '/oj/admin/course/:courseId/lesson/:lessonId/edit/:itemNum',
                name: 'lessons-edit',
                meta: {
                  title: '编辑',
                  breadcrumb: { parentName: 'lessons-manage' },
                },
              },
              {
                path: '/oj/admin/course/:courseId/lesson/:lessonId/report',
                name: 'experiment-report',
                meta: {
                  title: '实验报告',
                  breadcrumb: { parentName: 'lessons-manage' },
                },
              },
              {
                path: '/oj/admin/course/:courseId/lesson/:lessonId/monitor',
                name: 'learn-monitor',
                meta: {
                  title: '学习监控',
                  breadcrumb: { parentName: 'lessons-manage' },
                },
              },
              {
                path: '/oj/admin/courses/class-card',
                name: 'class-card',
                meta: { title: '课程表' },
              },
              {
                path: '/oj/admin/courses/class-card/:lessonId/classroom-manage',
                name: 'classroom-manage',
                meta: {
                  title: '进入课堂',
                  breadcrumb: { parentName: 'class-card' },
                },
              },
              {
                path: '/oj/admin/courses/class-card/:lessonId/theory-classroom-manage',
                name: 'theory-classroom-manage',
                meta: {
                  title: '进入课堂',
                  breadcrumb: { parentName: 'class-card' },
                },
              },
              {
                path: '/oj/admin/courses/class-card/:lessonId/classroom-manage/class-monitor',
                name: 'class-monitor',
                meta: {
                  title: '监控',
                  breadcrumb: { parentName: 'classroom-manage' },
                },
              },
              {
                path: '/oj/admin/course/learn-statistics/list',
                name: 'learn-statistics',
                meta: { title: '学习统计' },
              },
              {
                path: '/oj/admin/course/learn-statistics/:lessonId/learn-count/theory-list',
                name: 'theory-learn-count',
                meta: {
                  title: '学习统计',
                  type: 0,
                  breadcrumb: { parentName: 'learn-statistics' },
                },
              },
              {
                path: '/oj/admin/course/learn-statistics/:lessonId/learn-count/list',
                name: 'learn-count',
                meta: {
                  title: '学习统计',
                  type: 0,
                  breadcrumb: { parentName: 'learn-statistics' },
                },
              },
              {
                path: '/oj/admin/course/learn-statistics/person-statistics/:userId/detail',
                name: 'user-info',
                meta: {
                  title: '个人信息',
                  type: 0,
                  breadcrumb: { parentName: 'learn-statistics' },
                },
              },
              {
                path: '/oj/admin/course-mod/career-system/career-list',
                name: 'career-system',
                meta: { title: '职业框架管理' },
              },
              {
                path: '/oj/admin/course-mod/career-system/career-add',
                name: 'career-add',
                meta: {
                  title: '新增',
                  breadcrumb: { parentName: 'career-system' },
                },
              },
              {
                path: '/oj/admin/course-mod/career-system/career-edit',
                name: 'career-edit',
                meta: {
                  title: '编辑',
                  breadcrumb: { parentName: 'career-system' },
                },
              },
              {
                path: '/oj/admin/course-mod/career-system/framework-management-list',
                name: 'framework-management-list',
                meta: {
                  title: '框架管理',
                  breadcrumb: { parentName: 'career-system' },
                },
              },
              {
                path: '/oj/admin/course-mod/career-system/framework-management-list/framework-management-add',
                name: 'framework-management-add',
                meta: {
                  title: '新增',
                  breadcrumb: { parentName: 'framework-management-list' },
                },
              },
              {
                path: '/oj/admin/course-mod/career-system/framework-management-list/framework-management-edit/:frameworkId',
                name: 'framework-management-edit',
                meta: {
                  title: '编辑',
                  breadcrumb: { parentName: 'framework-management-list' },
                },
              },
              {
                path: '/oj/admin/course-mod/career-system/career-job-database/job-database-list',
                name: 'job-database-list',
                meta: {
                  title: '岗位职责库',
                  breadcrumb: { parentName: 'career-system' },
                },
              },
              {
                path: '/oj/admin/course-mod/career-system/career-job-database/job-database-add',
                name: 'job-database-add',
                meta: {
                  title: '新增',
                  breadcrumb: { parentName: 'job-database-list' },
                },
              },
              {
                path: '/oj/admin/course-mod/career-system/career-job-database/job-database-edit/:jobId',
                name: 'job-database-edit',
                meta: {
                  title: '编辑',
                  breadcrumb: { parentName: 'job-database-list' },
                },
              },
              {
                path: '/oj/admin/course-mod/career-system/career-knowledge-database/knowledge-database-list',
                name: 'knowledge-database-list',
                meta: {
                  title: '知识点库',
                  breadcrumb: { parentName: 'career-system' },
                },
              },
              {
                path: '/oj/admin/course-mod/career-system/career-knowledge-database/knowledge-database-add',
                name: 'knowledge-database-add',
                meta: {
                  title: '新增',
                  breadcrumb: { parentName: 'knowledge-database-list' },
                },
              },
              {
                path: '/oj/admin/course-mod/career-system/career-knowledge-database/knowledge-database-edit/:libraryId',
                name: 'knowledge-database-edit',
                meta: {
                  title: '编辑',
                  breadcrumb: { parentName: 'knowledge-database-list' },
                },
              },
              {
                path: '/oj/admin/course-mod/career-system/career-knowledge-database/knowledge-category/knowledge-category-list',
                name: 'knowledge-category-list',
                meta: {
                  title: '知识类别',
                  breadcrumb: { parentName: 'knowledge-database-list' },
                },
              },
              {
                path: '/oj/admin/course-mod/career-system/career-knowledge-database/knowledge-category/knowledge-category-add',
                name: 'knowledge-category-add',
                meta: {
                  title: '新增',
                  breadcrumb: { parentName: 'knowledge-category-list' },
                },
              },
              {
                path: '/oj/admin/course-mod/career-system/career-knowledge-database/knowledge-category/knowledge-category-edit/:id',
                name: 'knowledge-category-edit',
                meta: {
                  title: '编辑',
                  breadcrumb: { parentName: 'knowledge-category-list' },
                },
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
    computed: {
      userInfo() {
        return '';
      },
    },
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
        // console.log(name, item);
      },
      /**
       * @description: 处理手风琴折叠事件
       */
      setCollapse(item) {
        console.log(item);
      },
    },
  };
</script>

<style scoped></style>
<!-- accordion.vue -->
```
