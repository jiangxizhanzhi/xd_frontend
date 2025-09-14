import { gettext } from '@/lang';
const ACCESSTYPE = [
  {
    label: gettext('device.remoteAddressType'),
    value: 'remote_address',
  },
  {
    label: gettext('device.deviceEndMouthType'),
    value: 'device_port',
  },
  {
    label: gettext('device.noLinear'),
    value: 'wireless',
  },
  {
    label: gettext('device.typeTheMACAddress'),
    value: 'mac_address',
  },
];
const PROTOCOLLIST = [
  {
    label: 'http',
    value: 'http',
  },
  {
    label: 'https',
    value: 'https',
  },
  {
    label: 'nc',
    value: 'nc',
  },
  {
    label: 'ssh',
    value: 'ssh',
  },
  {
    label: 'rdp',
    value: 'rdp',
  },
  {
    label: 'telnet',
    value: 'telnet',
  },
];

const SNMPLIST = [
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
const ROLEOPTIONS = [
  {
    name: gettext('device.gatewayNode'),
    id: 6,
    children: [
      {
        name: gettext('device.router'),
        id: 21,
      },
      {
        name: gettext('device.switch'),
        id: 22,
      },
      {
        name: gettext('device.firewall'),
        id: 23,
      },
    ],
  },
  {
    name: gettext('device.terminalNode'),
    id: 4,
  },
  {
    name: gettext('device.hardwarePeripherals'),
    id: 52,
  },
];
const NO_VIRTUAL_DEVICE_GROUPS = [
  {
    label: gettext('device.accessType'),
    prop: 'access_type_name',
  },
  {
    label: gettext('device.switchPort'),
    slot: 'switch_port',
  },
  {
    label: gettext('device.pyPortNumber'),
    prop: 'port_name',
  },
  {
    label: gettext('device.IP'),
    prop: 'ip',
  },
  {
    label: gettext('device.macAddress'),
    prop: 'mac',
  },
  {
    label: gettext('device.managementAgreement'),
    slot: 'access_protocols',
    width: 250,
  },
];
const VIRTUAL_DEVICE_GROUP = [
  {
    label: gettext('device.switchPort'),
    slot: 'switch_port',
  },
  {
    label: gettext('device.pyPortNumber'),
    prop: 'port_name',
  },
  {
    label: gettext('device.portDirection'),
    prop: 'port_direction',
  },
  {
    label: gettext('device.accessType'),
    prop: 'access_type_name',
  },
  {
    label: gettext('device.IPOrVlan'),
    prop: 'IPOrVlan',
  },
  {
    label: gettext('device.managementAgreement'),
    slot: 'access_protocols',
    width: 250,
  },
];
export {
  ACCESSTYPE,
  PROTOCOLLIST,
  SNMPLIST,
  ROLEOPTIONS,
  NO_VIRTUAL_DEVICE_GROUPS,
  VIRTUAL_DEVICE_GROUP,
};
