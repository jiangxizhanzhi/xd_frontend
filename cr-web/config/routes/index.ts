import { IRoute } from '@cyber/cli';
import Single from './web/single';
import SigleFull from './web/single-full';
import Group from './web/group-training';
// 增加靶场测评
import RangeTest from './web/range-test';
import redVsBlue from './web/red-vs-blue';
import { experimentalManageRouter } from './web/experimental-management/index';
import { subjectManageRouter } from './web/subject-management/index';
import { resourceCenterRouter } from './web/resourceCenter';
// cms
import { probeRouter } from './cms/probe';
import { trafficRouter } from './cms/traffic';
import { missionRouter } from './cms/mission';
import { redVsBlueRouter } from './cms/red-vs-blue';
// /靶场测评体系
import { assessmentSystem } from './cms/assessment-system';
import { trainingRouter } from './cms/training';
import { resourceRouter } from './cms/resource';
// 场景管理
import { sceneManageRouter } from './cms/scene-management/index';
// 红蓝对抗全屏页面
import redBlueFull from './web/red-blue-full';
// 综合演训我的训练详情全屏页面
import teamTrainFull from './web/group-traing-full';
// 综合演训学员进入详情全屏页面
import teamTrainStudentFull from './web/group-traing-student-full';
// 实验管理全屏路由
import experimentalManagementFull from './web/experimental-management-full/index'
// 科目管理全屏路由
import subjectManagementFull from './web/subject-management-full/index';

const titleName = '';
export default [
  {
    path: '/login',
    name: 'login',
    component: './pages/login/index',
  },
  // web 单独页面
  {
    // 单兵训练--训练记录--打印
    name: 'single-print',
    path: '/print',
    meta: {
      auth: false,
    },
    component: './pages/web/SingleTrain/components/print.vue',
  },
  // 场景录屏
  {
    path: '/all-scene/screen/recording',
    component: './pages/web/screen-record/screen-recording.vue',
    name: 'scene-screen-recording',
    meta: {
      auth: false,
    },
  },
  ...SigleFull,
  ...redBlueFull,
  ...teamTrainFull,
  ...teamTrainStudentFull,
  ...experimentalManagementFull,
  ...subjectManagementFull,
  {
    path: '/',
    component: './layouts/web-layout.vue',
    name: 'web-layout',
    meta: {
      layout: true,
    },
    children: [
      {
        path: '/',
        name: 'web-default',
        redirect: { name: 'single-list' },
      },
      {
        name: 'individaulManual',
        path: '/indidaul/manual/:id',
        title: titleName,
        component: './pages/web/SingleTrain/training_manual',
      },
      ...Single,
      ...Group,
      // 实验管理
      experimentalManageRouter,
      // 科目管理
      subjectManageRouter,
      // 场景管理
      sceneManageRouter,
      // 红蓝对抗
      ...redVsBlue,
      ...RangeTest,
      resourceCenterRouter,
    ],
  },
  // 大屏展示
  {
    name: 'blue-grade',
    path: '/data-display/blue-grade/:resource_id/:role',
    component: './pages/web/DataDisplay/blue-grade.vue',
    meta: {
      auth: false,
    },
  },
  {
    name: 'red-grade',
    path: '/data-display/red-grade/:resource_id/:role',
    component: './pages/web/DataDisplay/red-grade.vue',
    meta: {
      auth: false,
    },
  },
  {
    name: 'blue-rank',
    path: '/data-display/blue-rank/:resource_id/:role',
    component: './pages/web/DataDisplay/blue-rank.vue',
    meta: {
      auth: false,
    },
  },
  {
    name: 'red-rank',
    path: '/data-display/red-rank/:resource_id/:role',
    component: './pages/web/DataDisplay/red-rank.vue',
    meta: {
      auth: false,
    },
  },
  {
    name: 'battle',
    path: '/data-display/battle/:resource_id/:role',
    component: './pages/web/DataDisplay/battle.vue',
    meta: {
      auth: false,
    },
  },

  // cms
  {
    path: '/all-scene-cms/screen/recording',
    component: './pages/cms/scene/config/screen-recording.vue',
    name: 'scene-screen-recording-cms',
    meta: {
      auth: false,
    },
  },
  {
    path: '/admin',
    name: 'cms-layout',
    component: './layouts/cms-layout',
    meta: {
      layout: true,
    },
    children: [
      {
        path: '/',
        name: 'cms-default',
        redirect: { name: 'group_training' },
      },

      // 新版场景编排
      // crEventRouter,
      // 对抗演练
      // ...trainingRouter,
      // 红蓝对抗
      ...redVsBlueRouter,
      //靶场测评体系
      assessmentSystem,
      // 任务管理
      ...missionRouter,

      // 流量管理
      trafficRouter,

      // 探针管理
      probeRouter,

      resourceRouter,
    ],
  },
] as IRoute[];
