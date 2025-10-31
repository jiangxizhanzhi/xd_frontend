import {
  validateBool,
  validateInteger,
  validateIp,
  validateIpAddress,
  validateIpSegment,
  validatePeer,
  validatePort,
  validateFirewallPort,
  validatePositiveInteger,
  validateVlanId,
  validateEmpty,
  validatePositiveIntegerOrZero,
  validateLoss,
  validate500,
} from '../../../../../utils/form/rules';
import t from '../../../../../utils/i18n';

export const FORM_RULES = {
  // 设备信息
  basicInfo: {
    // 节点名称
    name: [
      {
        required: true,
        message: t('menu.dialog.validator.empty'),
        trigger: 'blur',
      },
      { validator: validateEmpty, trigger: ['blur'] },
      {
        min: 1,
        max: 255,
        // @ts-ignore
        message: t('menu.dialog.validator.name', { min: 1, max: 255 }),
        trigger: ['blur'],
      },
    ],
  },
  // 网络配置
  networkConfig: {
    protocol: [
      {
        required: true,
        message: t('menu.dialog.validator.empty'),
        trigger: 'blur',
      },
    ],
    username: [],
    password: [],
    // 端口号
    port: [
      { validator: validatePositiveInteger, trigger: ['blur', 'change'] },
      { validator: validatePort, trigger: ['blur'] },
    ],
    // 防火墙协议的 端口
    firewallPort: [
      { validator: validateFirewallPort, trigger: ['blur', 'change'] },
    ],
    // 上行带宽
    egress: [
      { validator: validatePositiveInteger, trigger: ['blur', 'change'] },
    ],
    // 下行带宽
    ingress: [
      { validator: validatePositiveInteger, trigger: ['blur', 'change'] },
    ],
    // 时延
    delay: [
      { validator: validatePositiveIntegerOrZero, trigger: ['blur', 'change'] },
      { validator: validate500, trigger: ['blur', 'change'] },
    ],
    // 丢包率
    loss: [
      { validator: validatePositiveInteger, trigger: ['blur', 'change'] },
      { validator: validateLoss, trigger: ['blur', 'change'] },
    ],
    ip: [{ validator: validateIp, trigger: ['blur', 'change'] }],
    // 附加信息
    description: [
      {
        min: 0,
        max: 2048,
        // @ts-ignore
        message: t('menu.dialog.validator.descLength', { min: 0, max: 2048 }),
        trigger: ['blur'],
      },
    ],
    // IP + 地址段
    ipAddress: [{ validator: validateIpAddress, trigger: ['blur', 'change'] }],
    // 地址段
    address: [{ validator: validateIpSegment, trigger: ['blur', 'change'] }],
    // 网关地址
    gateway: [{ validator: validateIp, trigger: ['blur', 'change'] }],
    // vlanId
    vlanId: [
      { validator: validatePositiveInteger, trigger: ['blur', 'change'] },
      { validator: validateVlanId, trigger: ['blur', 'change'] },
    ],
    DNS: [{ validator: validateIp, trigger: ['blur', 'change'] }],
    private_key_path: [
      {
        required: true,
        message: t('menu.dialog.validator.empty'),
        trigger: ['blur', 'change'],
      },
    ],
  },
  // 其他配置
  otherConfig: {
    // 自定义命令
    init_commands: [],
    // 文件的自定义命令
    node_command: [],
  },
  staticRoutes: {
    destination: [
      {
        required: true,
        message: t('menu.dialog.validator.empty'),
        trigger: 'blur',
      },
      { validator: validateIpSegment, trigger: ['blur', 'change'] },
    ],
    nextHop: [
      {
        required: true,
        message: t('menu.dialog.validator.empty'),
        trigger: 'blur',
      },
      { validator: validateIp, trigger: ['blur', 'change'] },
    ],
    integer: [
      {
        required: true,
        message: t('menu.dialog.validator.empty'),
        trigger: 'blur',
      },
      { validator: validateInteger, trigger: ['blur', 'change'] },
    ],
    positiveInteger: [
      {
        required: true,
        message: t('menu.dialog.validator.empty'),
        trigger: 'blur',
      },
      { validator: validatePositiveInteger, trigger: ['blur', 'change'] },
      { validator: validatePeer, trigger: ['blur', 'change'] },
    ],
    require: [
      {
        required: true,
        message: t('menu.dialog.validator.empty'),
        trigger: 'blur',
      },
    ],
    ip: [
      {
        required: true,
        message: t('menu.dialog.validator.empty'),
        trigger: 'blur',
      },
      { validator: validateIp, trigger: ['blur', 'change'] },
    ],
    // 地址段
    address: [
      {
        required: true,
        message: t('menu.dialog.validator.empty'),
        trigger: 'blur',
      },
      { validator: validateIpSegment, trigger: ['blur', 'change'] },
    ],
    // loopback
    loopback: [{ validator: validateIpSegment, trigger: ['blur', 'change'] }],
    // 邻居
    neighbour: [{ validator: validateIp, trigger: ['blur', 'change'] }],
  },
  probe: {
    require: [
      {
        required: true,
        message: t('menu.dialog.validator.empty'),
        trigger: 'blur',
      },
    ],
    number: [{ validator: validateInteger, trigger: ['blur', 'change'] }],
    ip: [{ validator: validateIp, trigger: ['blur', 'change'] }],
    bool: [{ validator: validateBool, trigger: ['blur', 'change'] }],
  },
};
