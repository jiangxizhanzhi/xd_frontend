import t from '../../../../../utils/i18n';

// 接入协议
export const PROTOCOL_OPTIONS = [
  {
    key: 'http',
    value: 'http',
    port: '80',
  },
  {
    key: 'https',
    value: 'https',
    port: '443',
  },
  {
    key: 'nc',
    value: 'nc',
    port: '9999',
  },
  {
    key: 'ssh',
    value: 'ssh',
    port: '22',
  },
  {
    key: 'rdp',
    value: 'rdp',
    port: '3389',
  },
  {
    key: 'telnet',
    value: 'telnet',
    port: '23',
  },
  // {
  //   key: 'console',
  //   value: 'console',
  //   port: '',
  // },
];
// 直接接入协议
export const PROTOCOL_OPTIONS_CONSOLE = [
  {
    key: 'console',
    value: 'console',
  },
  {
    key: 'COM',
    value: 'COM',
  },
];
// 端口接入类型
export const CONNECT_MODE = [
  {
    label: 'access',
    value: 'access',
  },
  {
    label: 'dot1q-tunnel',
    value: 'dot1q-tunnel',
  },
];
// 防火墙规则 -协议
export const FIREWALL_RULES_PROTOCOL_OPTIONS = [
  {
    key: 'tcp',
    value: 'tcp',
  },
  {
    key: 'udp',
    value: 'udp',
  },
  {
    key: 'icmp',
    value: 'icmp',
  },
  {
    key: 'all',
    value: 'all',
  },
];
// 防火墙规则 -动作
export const FIREWALL_RULES_ACTION_OPTIONS = [
  {
    key: 'allow',
    value: 'allow',
  },
  {
    key: 'deny',
    value: 'deny',
  },
  {
    key: 'reject',
    value: 'reject',
  },
];
// 防火墙规则 -动作
export const FIREWALL_RULES_DIRECTION_OPTIONS = [
  {
    key: 'egress',
    label: t('target.uplink'),
    value: 'egress',
  },
  {
    key: 'ingress',
    label: t('target.downLink'),
    value: 'ingress',
  },
  {
    key: 'both',
    label: t('target.bothWay'),
    value: 'both',
  },
];
// snmp下拉框
export const SNMP_LIST = [
  {
    label: 'V1',
    value: 'V1',
  },
  {
    label: 'V2C',
    value: 'V2',
  },
  {
    label: 'V3',
    value: 'V3',
  },
];
