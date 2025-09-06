/*
 * @Author: Fengxuyan
 * @Date: 2021-08-06 10:29:05
 * @LastEditTime: 2022-03-10 09:51:13
 * @LastEditors: wangzhongjie
 * @Description:
 */
import { getI18N } from '@cyber/helper';
let i18n = getI18N();
function gettext(str) {
  return i18n.t(str);
}
export const NODE_STATUS_TOP5 = [
  { name: 'CPU', index: 0 },
  { name: gettext('systemOperation.eventAnalysis.ram'), index: 1 },
  { name: gettext('systemOperation.eventAnalysis.disk'), index: 2 },
];
export const EVENT_STATUS_TOP5 = [
  { name: gettext('systemOperation.eventAnalysis.eventTotal'), index: 0 },
  { name: gettext('systemOperation.eventAnalysis.process'), index: 1 },
  { name: gettext('systemOperation.eventAnalysis.port'), index: 2 },
  {
    name: gettext('systemOperation.eventAnalysis.networkConnection'),
    index: 3,
  },
  { name: gettext('systemOperation.eventAnalysis.file'), index: 4 },
  { name: gettext('systemOperation.eventAnalysis.users'), index: 5 },
];
