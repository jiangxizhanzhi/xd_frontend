import microApp, { getActiveApps } from '@micro-zoe/micro-app';
import { getRouter } from '@cyber/helper';

export const apps = [
  {
    name: 'cr-web',
    rule: '^/cr/(?!admin).+',
    baseRoute: '/cr',
  },
  {
    name: 'oj-web',
    rule: '^/oj/(?!admin).+',
    baseRoute: '/oj',
  },
  {
    name: 'ct-web',
    rule: '^/ct/(?!admin).+',
    baseRoute: '/ct',
  },

  {
    name: 'cr-web',
    rule: '^/admin/cr/admin/.+',
    baseRoute: '/cr',
  },
  {
    name: 'oj-web',
    rule: '^/admin/oj/admin/.+',
    baseRoute: '/oj',
  },
  {
    name: 'ct-web',
    rule: '^/admin/ct/admin/.+',
    baseRoute: '/ct',
  },
];

export function emitCurrentApp(key, data) {
  const curApp = getActiveApps(true)[0];
  curApp && microApp.setData(curApp, { key, ...data });
}

export function getAppByPath(path) {
  let result = {};
  apps.some((app) => {
    const test = new RegExp(app.rule).test(path);
    if (test) {
      result = app;
    }
    return test;
  });
  return result;
}

// 活动场景列表跳转
export const routerPush = (name, params) => {
  const router = getRouter();
  const path = router.resolve({ name, params });
  const fullPath = _.get(path, 'route.fullPath', '');
  const activeApp = getActiveApps(true)[0];
  const target = getAppByPath(fullPath).name;
  if (activeApp !== target) {
    router.push({ name, params });
  } else {
    emitCurrentApp('pushRoute', { name, params });
  }
};
