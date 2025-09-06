import { constant } from '@/utils/constant';
// 攻击向量
// 攻击向量 修改后攻击向量
export const vulnIndex_AV = constant([
  'NETWORK', //通过网络进行攻击
  'ADJACENT', //通过受限制的网络进行攻击，比如局域网或者蓝牙等
  'LOCAL', // 在不连接网络的情况下进行攻击
  'PHYSICAL', // 需要接触到实体机器才能攻击
]);
// 攻击复杂度
export const vulnIndex_AC = constant([
  'LOW', //低 攻击可被轻易重现
  'HIGH', //高 需攻击者达成数项条件才能成功
]);
// 权限要求 机密性影响 完整性影响 可用性影响
export const vulnIndex_PR = constant([
  'NONE', //不需要
  'LOW', //需要一般使用者权限
  'HIGH', //需要管理者权限
]);
// 用户交互
export const vulnIndex_UI = constant([
  'NONE', //不需要
  'REQUIRED', //需要使用操作者某些动作才能让攻击者成功
]);
// 范围指标
export const vulnIndex_S = constant([
  'UNCHANGED', //仅影响含有漏洞的元件本身仅影响含有漏洞的元件本身
  'CHANGED', //会影响到含漏洞的元件以外的元件
]);

// 利用代码成熟度
export const vulnIndex_E = constant([
  'NOT DEFINED',
  'HIGH',
  'FUNCTIONAL',
  'PROOF OF CONCEPT',
  'UNPROVEN',
]);

// 修复水平
export const vulnIndex_RL = constant([
  'NOT DEFINED',
  'UNAVAILABLE',
  'WORKAROUND',
  'TEMPORARY FIX',
  'OFFICIAL FIX',
]);

// 报告信心
export const vulnIndex_RC = constant([
  'NOT DEFINED',
  'UNKNOWN',
  'CONFIRMED',
  'REASONABLE',
]);

// 修改后的攻击复杂度
export const vulnIndex_MAC = constant(['NOT DEFINED', 'LOW', 'HIGH']);

// 修改后的权限要求 机密性影响 完整性影响 可用性影响
export const vulnIndex_MPR = constant(['NOT DEFINED', 'NONE', 'LOW', 'HIGH']);

// 修改后的用户交互
export const vulnIndex_MUI = constant(['NOT DEFINED', 'NONE', 'REQUIRED']);

// 修改后的范围
export const vulnIndex_MS = constant(['NOT DEFINED', 'UNCHANGED', 'CHANGED']);

// 修改后的机密性要求 完整性要求 可用性要求
export const vulnIndex_CR = constant(['NOT DEFINED', 'LOW', 'MEDIUM', 'HIGH']);

// 危险等级
export const dangerLevelOptions = constant({
  0: 'common.dangerLevelOptions.unknown', // 未知
  1: 'common.dangerLevelOptions.lowRisk', // 低危
  2: 'common.dangerLevelOptions.crisis', // 中危
  3: 'common.dangerLevelOptions.highRisk', // 高危
  4: 'common.dangerLevelOptions.critically', // 极危
});

// 攻击类型
export const attackTypeOptions = constant({
  0: 'common.attackTypeOptions.local',
  1: 'common.attackTypeOptions.dos',
  3: 'common.attackTypeOptions.remote',
  4: 'common.attackTypeOptions.webapps',
});

// 行业
export const businessOptions = constant({
  0: 'common.businessOptions.other', // 其他
  1: 'common.businessOptions.telecom', // 电信
  2: 'common.businessOptions.mobileInternet', // 移动互联网
  3: 'common.businessOptions.industrialControlSystem', // 工控系统
  4: 'common.businessOptions.blockchain', // 区块链
});

// paper管理-分类
export const classifyOptions = constant({
  0: 'common.classifyOptions.other', // 其他
  1: 'common.classifyOptions.vulnAnalysis', // 漏洞分析
  2: 'common.classifyOptions.securityDevelopment', // 安全开发
  3: 'common.classifyOptions.ctfTalk', // CTF杂谈
});

// web-index search
export const searchFieldOptions = constant({
  0: 'components.searchInputBar.default', // 默认
  1: 'components.searchInputBar.productBusinessName', // 产品名称/厂商名称
});
