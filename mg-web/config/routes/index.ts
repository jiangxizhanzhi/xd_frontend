import { IRoute } from '@cyber/cli';
import ojCourse from './web/oj-web/oj-course';
import ojPractice from './web/oj-web/oj-practice';
import personal from './web/personal';
// demo态势展示
import situationalShow from './web/situational-show';
import RedVsBlue from './web/cr-web/red-vs-blue';
import RangeTest from './web/cr-web/range-test';
import RecourseCenter from './web/recourse-center';

import SoftwareTest from './web/cr-web/software-test';
import comprehensiveTraining from './web/cr-web/comprehensive-training';
import contest from './web/ct-web';
// 单兵训练详情全屏
import singleFull from './web/cr-web/comprehensive-training/single-full';

// 红蓝对抗全屏页面
import redBlueFull from './web/cr-web/red-blue/red-blue-full';
//综合演训教员训练详情全屏页面
import groupTraingFull from './web/cr-web/comprehensive-training/group-traing-full';
//综合演训学员训练详情全屏页面
import groupTraingStudentFull from './web/cr-web/comprehensive-training/group-traing-student-full';
// 实验管理全屏页面
import experimentalManagementFull from './web/cr-web/experimental-management-full/index';
// 科目管理全屏页面
import subjectManagementFull from './web/cr-web/subject-management-full/index';
import liveVuln from './web/live-vuln';

import system from './cms/system';
import dashboard from './cms/dashboard';
import statisticalAnalysis from './cms/statistical-analysis';
import systemOperstion from './cms/system-operation';
import coursesManage from './cms/oj-cms/courses-manage';
import practice from './cms/oj-cms/practice';
import careerSystem from './cms/oj-cms/career-system';
import trfficManage from './cms/cr-cms/traffic-manage';
import probe from './cms/cr-cms/probe';
import resourceManage from './cms/resource-manage';
import device from './cms/device';
import taskPlan from './cms/cr-cms/task-plan';
import redVsBlue from './cms/cr-cms/red-vs-blue';
import assessmentManagement from './cms/cr-cms/assessment-management';
import training from './cms/cr-cms/training';
import contestMgr from './cms/ct-cms/contest-mgr';
import screen from './cms/screen';
import personTrainingScreen from './cms/person-training-screen';
// 场景管理
import {sceneManageRouter} from './cms/scene-management/index';
import situation3DManage from './cms/situation-3D-manage';
import intelligenceCenter from './web/intelligence-center';
export default [
  ...situationalShow,
  {
    name: 'login',
    path: '/login',
    component: './login',
  },
  {
    path: '*',
    name: '*',
    redirect: '/404',
  },
  {
    path: '/404',
    name: '404',
    component: './pages/error-page/404.vue',
  },
  {
    path: '/change-password/:type',
    name: 'change-password',
    component: './pages/change-password/index.vue',
  },
  // 菜单配置页面
  {
    name: 'menu-config',
    path: '/menu-config',
    title: '菜单配置',
    meta: {
      auth: false,
    },
    component: './pages/menu-config/index.vue',
  },

  // 前台单独页面
  {
    name: 'screen',
    path: '/visual-screen',
    title: '可视化',
    meta: {
      auth: false,
    },
    component: './pages/web/visual-screen',
  },
  {
    name: 'screen2',
    path: '/visual-screen2',
    title: '可视化',
    meta: {
      auth: false,
    },
    component: './pages/web/visual-screen/index2.vue',
  },
  {
    name: 'screen1',
    path: '/screen-3/visual-screen/001',
    // title: '可视化',
    meta: {
      auth: false,
    },
    component: './pages/web/situational-show/index.vue',
  },
  // 红蓝大屏展示
  {
    name: 'blue-grade',
    path: '/cr/data-display/blue-grade/:resource_id/:role',
    component: './frame',
    meta: {
      auth: false,
    },
  },
  {
    name: 'red-grade',
    path: '/cr/data-display/red-grade/:resource_id/:role',
    component: './frame',
    meta: {
      auth: false,
    },
  },
  {
    name: 'blue-rank',
    path: '/cr/data-display/blue-rank/:resource_id/:role',
    component: './frame',
    meta: {
      auth: false,
    },
  },
  {
    name: 'red-rank',
    path: '/cr/data-display/red-rank/:resource_id/:role',
    component: './frame',
    meta: {
      auth: false,
    },
  },
  {
    name: 'battle',
    path: '/cr/data-display/battle/:resource_id/:role',
    component: './frame',
    meta: {
      auth: false,
    },
  },
  ...singleFull,
  ...redBlueFull,
  ...groupTraingFull,
  ...groupTraingStudentFull,
  ...experimentalManagementFull,
  ...subjectManagementFull,
  // 航油态势大屏
  {
    path: '/screen_business/:id',
    name: 'screen-business',
    meta: {
      auth: false,
    },
    component: './pages/cms/visual-screen/screen-business/index.vue',
  },
  {
    path: '/oj/cr_scene/lesson/cr_scene_case/:id/:course_id/:lesson_id/console',
    component: './frame',
    name: 'ojweb-course-console',

    meta: {
      auth: false,
    },
  },
  // cr-web 场景录屏
  {
    path: '/cr/all-scene/screen/recording',
    component: './frame',
    name: 'scene-screen-recording',
    meta: {
      auth: false,
    },
  },

  // 运维赛
  {
    path: '/contest/operation/:resource_id/:value',
    name: 'ct-operation-contest-display',
    title: 'routes.ct-contest-operation-list',
    meta: {
      auth: false,
    },
    component: './frame',
  },
  //夺旗赛
  {
    path: '/contest/flag/:resource_id/:value',
    name: 'ct-flag-contest-display',
    title: 'routes.ct-flag-contest-list',
    meta: {
      auth: false,
    },
    component: './frame',
  },
  //攻防赛
  {
    path: '/contest/attack-defense/:resource_id/:value',
    name: 'ct-atk-def-contest-display',
    title: 'routes.ct-attack-defense-list',
    meta: {
      auth: false,
    },
    component: './frame',
  },
  //渗透赛
  {
    path: '/contest/cfs/:resource_id/:value',
    name: 'ct-cfs-contest-display',
    title: 'routes.ct-contest-cfs-list',
    meta: {
      auth: false,
    },
    component: './frame',
  },
  // 配置ip等待页面
  {
    name: 'deploy-await',
    path: '/admin/deploy-await',
    component: './pages/deploy-await/index.vue',
    meta: {
      auth: false,
    },
  },
  {
    path: '/',
    name: 'web-layout',
    component: './layouts/web-layout',
    meta: {
      layout: true,
    },
    children: [
      {
        path: '',
        name: 'web-default',
        redirect: {
          name: 'learn-statistics',
        },
      },
      {
        name: 'learn-statistics',
        path: '/admin/oj/admin/course/learn-statistics/list',
        title: '首页',
        component: './frame',
        meta: {
          iconfont: 'icon-shouye1',
          module: 'learn-statistics',
        },
      },
      {
        name: 'guide-control',
        path: '',
        title: '综合导控',
        meta: {
          iconfont: 'icon-zonghexunlian',
        },
      },
      // 课程管理
      ...coursesManage,
      // 对抗演练
      // ...training,
      // ...ojCourse,
      // ...ojPractice,
      // ...contest,
      ...comprehensiveTraining,
      // 场景管理
      sceneManageRouter,
      // 演训资源
      ...device,
      // 系统运维
      ...systemOperstion,
      // 系统管理
      ...system,
      // ...RedVsBlue,
      // ...RangeTest,
      // ...SoftwareTest,
      // ...liveVuln,
      // ...RecourseCenter,
      // 智能体中心
      // ...intelligenceCenter,
      // ...personal,
    ],
  },
  //后台单独页面
  {
    path: '/admin/oj/admin/course/class-card/:lessonId/:userId/console',
    component: './frame',
    name: 'ojcms-course-console',
    meta: {
      auth: false,
    },
  },
  // 教学直播iframe
  {
    name: 'teaching-live',
    path: '/admin/oj/admin/courses/class-card/:lessonId/:courseId/:orgId/classroom-manage/teaching-live',
    component: './frame',
    meta: {
      auth: false,
    },
  },
  {
    path: '/admin/cr/admin/all-scene/screen/recording',
    component: './frame',
    name: 'scene-screen-recording-cms',
    meta: {
      auth: false,
    },
  },
  {
    name: 'mg-monitor-display',
    path: '/admin/system-operation/instance-monitoring/monitor-display/:id',
    title: '场景监控',
    meta: {
      auth: false,
    },
    component:
      './pages/cms/system-operation/instance-monitoring/monitor-display/index.vue',
  },
  {
    name: 'resource-import',
    path: '/resource-import',
    title: 'routes.resource-import',
    meta: {
      auth: false,
    },
    component: './pages/cms/resource-import/list',
  },
  // 镜像管理查看连接信息登录页
  {
    name: 'image-manage-connect',
    path: '/admin/std/image-manage/connect',
    component: './pages/cms/device/image/list/connect-index',
    meta: {
      auth: false,
    },
  },
  // 竞赛-成绩管理打印
  {
    name: 'ct-score-print',
    path: '/admin/ct/admin/exams/score/print/:examId/:userId',
    component: './frame',
    meta: {
      auth: false,
    },
  },
  // 竞赛-运维赛管理-人员管理-统计分析
  {
    name: 'ct-operation-person-statistic',
    path: '/admin/ct/admin/operation/person/statistic',
    component: './frame',
    meta: {
      auth: false,
    },
  },
  //竞赛-夺旗赛管理-人员管理-统计分析
  {
    name: 'ct-flag-person-statistic',
    path: '/admin/ct/admin/flag/person/statistic/:resource_id',
    component: './frame',
    meta: {
      auth: false,
    },
  },
  // 攻防赛-人员管理-统计分析
  {
    name: 'ct-ad-person-statistic',
    path: '/admin/ct/admin/ad/person/statistic/:resource_id',
    component: './frame',
    meta: {
      auth: false,
    },
  },
  // 渗透赛-人员管理-统计分析
  {
    name: 'ct-cfs-person-statistic',
    path: '/admin/ct/admin/cfs/person/statistic/:resource_id',
    component: './frame',
    meta: {
      auth: false,
    },
  },
  ...screen,
  ...personTrainingScreen,
  {
    path: '/admin',
    name: 'cms-layout',
    component: './layouts/cms-layout',
    meta: {
      layout: true,
    },
    // children: [
    //   {
    //     path: '',
    //     name: 'cms-default',
    //     redirect: {
    //       name: 'dashboard',
    //     },
    //   },
    //   // 仪表盘
    //   ...dashboard,
    //   // 统计分析
    //   ...statisticalAnalysis,
    //   // 课程管理
    //   ...coursesManage,
    //   // 题库管理
    //   ...practice,
    //   // 竞赛管理
    //   ...contestMgr,
    //   // 对抗演练
    //   ...training,
    //   // 红蓝对抗
    //   ...redVsBlue,
    //   // 测评管理
    //   ...assessmentManagement,
    //   // 资源管理
    //   ...resourceManage,
    //   // 演训资源
    //   ...device,
    //   // 场景管理
    //   sceneManageRouter,
    //   // 流量管理
    //   ...trfficManage,
    //   // 探针管理
    //   ...probe,
    //   // 态势管理
    //   // ...situation3DManage,
    //   // 任务方案
    //   ...taskPlan,
    //   // 职业框架
    //   ...careerSystem,
    //   // 系统管理
    //   ...system,
    //   // 系统运维
    //   ...systemOperstion,
    //   // 资源导入
    //   // ...resource,
    // ],
  },
] as IRoute[];
