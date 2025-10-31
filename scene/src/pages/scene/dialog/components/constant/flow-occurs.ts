//@ts-ignore
import t, { i18n } from '../../../../../utils/i18n';
/**
 * 流量发生类型分类
 */
export const FLOW_CATEGORY = {
  '': t('target.allTypes'),
  0: t('target.testAndMeasurement'),
  1: t('target.upgradeApplication'),
  2: t('target.networkManagement'),
  3: t('target.P2P'),
  4: t('target.financial'),
  5: t('target.email'),
  6: t('target.safetyWork'),
  7: t('target.distributedComputing'),
  8: t('target.mobilePhone'),
  9: t('target.mobileDevices'),
  10: t('target.instantMessaging'),
  11: t('target.SCADA'),
  12: t('target.motor'),
  13: t('target.remoteControl'),
  14: t('target.av'),
  15: t('target.enterpriseApplication'),
  16: t('target.socialNetworkSearch'),
  17: t('target.fileTransfer'),
  18: t('target.database'),
  19: t('target.identityAuthentication'),
  20: t('target.ERP'),
  21: t('target.storage'),
  22: t('target.game'),
  23: t('target.secureDataTransmission'),
};
/**
 * 流量发生类型
 */
export const FLOW_TYPE = {
  1: t('menu.dialog.attackTraffic'),
  0: t('menu.dialog.backgroundTraffic'),
  3: '--',
};
