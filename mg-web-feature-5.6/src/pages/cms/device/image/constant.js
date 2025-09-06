import { gettext } from '@/lang';

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
  /* {
    name: gettext('device.externalNetwork'),
    id: 3,
  }, */
];

const VIRTUALTYPEOPTIONS = [
  {
    label: gettext('device.simpleType'),
    value: 'simple',
  },
  {
    label: gettext('device.vm'),
    value: 'vm',
  },
  {
    label: gettext('device.docker'),
    value: 'container',
  },
];

const VIRTUALTYPEOPTIONSTERMINAL = [
  {
    label: gettext('device.vm'),
    value: 'vm',
  },
  {
    label: gettext('device.docker'),
    value: 'container',
  },
];
const VIRTUALTYPEOPTIONSTERMINALDYNAMIPS = [
  {
    label: gettext('device.vm'),
    value: 'vm',
  },
  {
    label: gettext('device.docker'),
    value: 'container',
  },
  {
    label: gettext('device.dynamips'),
    value: 'dynamips',
  },
];

const SYSTEMIMAGETYPEOPTIONS = [
  {
    label: gettext('device.BaseImages'),
    value: 1,
  },
  {
    label: gettext('device.cpCloud'),
    value: 2,
  },
  {
    label: gettext('device.customUpload'),
    value: 3,
  },
];
const SYSTEMIMAGETYPEOPTIONSDYANIMPS = [
  {
    label: gettext('device.BaseImages'),
    value: 1,
  },
  {
    label: gettext('device.customUpload'),
    value: 3,
  },
];
const EditSYSTEMIMAGETYPEOPTIONSDYANIMPS = [
  {
    label: gettext('device.BaseImages'),
    value: 1,
  },
  {
    label: gettext('device.cpCloud'),
    value: 2,
  },
  {
    label: gettext('device.customUpload'),
    value: 3,
  },
];

const UPLOADTYPEOPTIONS = [
  {
    label: 'http',
    value: 'http',
  },
  {
    label: 'ftp',
    value: 'ftp',
  },
];

const PORTTYPELIST = [
  {
    label: gettext('device.managementPort'),
    value: 0,
  },
  {
    label: gettext('device.wanProt'),
    value: 1,
  },
  {
    label: gettext('device.lanPort'),
    value: 2,
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
  {
    label: 'console',
    value: 'console',
  },
];
const PROTOCOLLISTPORTTELNET = [
  {
    label: 'telnet',
    value: 'telnet',
  },
];
const PROTOCOLLISTPORT = [
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
  /* {
    label: 'console',
    value: 'console',
  }, */
];
// 直接接入协议
const DIRECTLISTPORT = [
  {
    label: 'console',
    value: 'console',
  },
  {
    label: 'COM',
    value: 'COM',
  },
];
const AUTHPROTOCOLLIST = [
  {
    label: 'rdp',
    value: 'rdp',
  },
  {
    label: 'nla',
    value: 'nla',
  },
];
const DISKFORMATOPTIONS = [
  {
    label: gettext('device.QEsimulator'),
    value: 'qcow2',
  },
  {
    label: gettext('device.vmDisk'),
    value: 'vmdk',
  },
  {
    label: gettext('device.virtualDiskMirror'),
    value: 'vdi',
  },
  {
    label: gettext('device.originalImage'),
    value: 'raw',
  },
  {
    label: gettext('device.dynamipsSimulator'),
    value: 'dynamips',
  },
];
const INTERACTIVEOPTIONS = [
  {
    label: gettext('common.open'),
    value: true,
  },
  {
    label: gettext('common.close'),
    value: false,
  },
];
const TTYOPTIONS = [
  {
    label: gettext('common.open'),
    value: true,
  },
  {
    label: gettext('common.close'),
    value: false,
  },
];

export {
  ROLEOPTIONS,
  VIRTUALTYPEOPTIONS,
  SYSTEMIMAGETYPEOPTIONS,
  SYSTEMIMAGETYPEOPTIONSDYANIMPS,
  EditSYSTEMIMAGETYPEOPTIONSDYANIMPS,
  VIRTUALTYPEOPTIONSTERMINAL,
  VIRTUALTYPEOPTIONSTERMINALDYNAMIPS,
  UPLOADTYPEOPTIONS,
  PORTTYPELIST,
  PROTOCOLLIST,
  PROTOCOLLISTPORT,
  PROTOCOLLISTPORTTELNET,
  AUTHPROTOCOLLIST,
  DISKFORMATOPTIONS,
  DIRECTLISTPORT, //直接接入下拉框内容
  INTERACTIVEOPTIONS,
  TTYOPTIONS,
};
