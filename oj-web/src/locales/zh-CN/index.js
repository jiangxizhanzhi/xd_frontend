import Course from './web/course';
import Practice from './web/practice';
import Other from './web/other';
import routes from './web/routes';
import button from './cms/button';
import common from './cms/common';
import coursecms from './cms/course';
import routescms from './cms/routes.js';
import flags from './cms/flags.js';
import classSchedule from './cms/class-schedule.js';
import attEngage from './cms/att-engage';
import zh from './cms/zh';
import _ from 'lodash';
const allZh = _.merge(Course, button, common, coursecms, flags, zh, Other);
const allRoutes = _.merge(routes, routescms);
export default {
  ...Practice,
  ...allRoutes,
  ...allZh,
  classSchedule,
  attEngage,
};
