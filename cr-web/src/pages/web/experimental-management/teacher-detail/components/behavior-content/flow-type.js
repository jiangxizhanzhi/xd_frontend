import { getI18N } from '@cyber/helper';
const i18n = getI18N();

export const FLOW_CATEGORY = {
  '': i18n.t('flowTypes.allTypes'),
  0: i18n.t('flowTypes.testAndMeasurement'),
  1: i18n.t('flowTypes.upgradeApplication'),
  2: i18n.t('flowTypes.networkManagement'),
  3: i18n.t('flowTypes.P2P'),
  4: i18n.t('flowTypes.financial'),
  5: i18n.t('flowTypes.email'),
  6: i18n.t('flowTypes.safetyWork'),
  7: i18n.t('flowTypes.distributedComputing'),
  8: i18n.t('flowTypes.mobilePhone'),
  9: i18n.t('flowTypes.mobileDevices'),
  10: i18n.t('flowTypes.instantMessaging'),
  11: i18n.t('flowTypes.SCADA'),
  12: i18n.t('flowTypes.motor'),
  13: i18n.t('flowTypes.remoteControl'),
  14: i18n.t('flowTypes.av'),
  15: i18n.t('flowTypes.enterpriseApplication'),
  16: i18n.t('flowTypes.socialNetworkSearch'),
  17: i18n.t('flowTypes.fileTransfer'),
  18: i18n.t('flowTypes.database'),
  19: i18n.t('flowTypes.identityAuthentication'),
  20: i18n.t('flowTypes.ERP'),
  21: i18n.t('flowTypes.storage'),
  22: i18n.t('flowTypes.game'),
  23: i18n.t('flowTypes.secureDataTransmission'),
};

export const FLOW_TYPE = {
  1: i18n.t('flowTypes.attack'),
  0: i18n.t('flowTypes.background'),
  3: '--',
};
