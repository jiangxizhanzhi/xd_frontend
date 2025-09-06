import { getI18N } from '@cyber/helper';
// 激活模块  exclude属性为区别标准版时,不可勾选拥有此属性的模块
const activeModule = [
  {
    key: 'LCS-FUNC-CR-SHIXUN',
    name: getI18N().t('activation.course'),
  },
  {
    key: 'LCS-FUNC-CR-JINGSAI',
    name: getI18N().t('activation.contest'),
  },
  {
    key: 'LCS-FUNC-CR-HUOTILOUDONG',
    name: getI18N().t('activation.bioVulnerability'),
  },
  {
    key: 'LCS-FUNC-CR-ZHISHIKU',
    name: getI18N().t('activation.resource'),
  },
  {
    key: 'LCS-FUNC-CR-ZONGHEXUNLIAN',
    name: getI18N().t('activation.training'),
    exclude: 0,
  },
  {
    key: 'LCS-FUNC-CR-HONGLANDUIKANG',
    name: getI18N().t('activation.cyberWargame'),
    exclude: 0,
  },
  {
    key: 'LCS-FUNC-CR-SHENTOUSAI',
    name: getI18N().t('activation.penContest'),
  },
  {
    key: 'LCS-FUNC-CR-YUNWEISAI',
    name: getI18N().t('activation.OMContest'),
  },
  {
    key: 'LCS-FUNC-CR-CEPING',
    name: getI18N().t('activation.evaluation'),
    exclude: 0,
  },
];
export { activeModule };
