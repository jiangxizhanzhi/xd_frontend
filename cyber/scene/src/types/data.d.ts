/**
 * 数据类型
 */
export interface SceneData {
  id: string;
  //角色信息
  roles: Role[];
  type: number;
  logo: string;
  //拓扑配置
  scene_config: SceneConfig;
  test_scenes?: null;
  app_scenes?: null;
  reference_type?: number;
  reference_meta_data?: string;
  create_user?: string;
  create_username?: string;
}

/**
 * 角色配置
 */
export interface Role {
  // 角色资产分配的节点（children这一层）
  asset_nodes: any[];
  // 红队/蓝队下面的子角色
  children?: Role[];
  // 角色id，值与角色名称一致（children这一层）
  id: string;
  // 角色名（children这一层）
  name: string;
  // red || blue，区分红队和蓝队（children这一层）
  type: string;
  // 战争迷雾分配的可见节点（children这一层）
  visible_nodes: VisibleNode[];
  // 任务信息
  missions_scheme?: MissionsScheme;
}

export interface MissionsScheme {
  template: number;
  color: number;
  scheme_data: SchemeDatum[];
}

export interface SchemeDatum {
  stage: string;
  missions: Mission[];
}

export interface Mission {
  title: string;
  description: string;
  resource_id: string;
}

export interface VisibleNode {
  id: string;
  category: string;
}

/**
 * 拓扑配置
 */
export interface SceneConfig {
  // 场景基本信息，包含场景名称、基础配置等
  scene: Scene;
  area_id: null;
  // 区块数据
  areas: Area[];
  // 节点数据
  elements: Element[];
  // 连线数据
  connections: Connection[];
  // 文字标签数据
  pieces: Piece[];
}

/**
 * 区域配置
 */
export interface Area {
  eid: string; // 服务端id
  id: string; // 区域id
  area: string; // 所属区域id
  description: string; // 描述
  display_context: string; // 显示参数
  icon2: string; // 2d图标地址
  icon3: string; // 3d图标地址
  name: string; // 名称
  open: boolean; // 展开标记
  position2: string; // 2d坐标
  position3: string; // 3d坐标
}

/**
 * 文本配置
 */
export interface Piece {
  eid: string; // 服务端id
  id: string; // 区域id
  area: string; // 所属区域id
  description: string; // 描述
  display_context: string; // 显示参数
  icon2: string; // 2d图标地址
  icon3: string; // 3d图标地址
  name: string; // 名称
  position2: string; // 2d坐标
  position3: string; // 3d坐标
  type: string; // 碎片类型
}

/**
 * 连线配置(端口配置)
 */
export interface Connection {
  eid: string;
  // 线ID
  id: string;
  // 源端口ID
  source: string;
  // 目标端口ID
  target: string;
  // 源端口名称和目标端口名称 JSON序列化后组成的字符串 如："{\"source\":\"eth0/1\",\"target\":\"eth0/2\"}"
  name: string;
  unidirectional: boolean;
}

/**
 * 节点信息
 */
export interface Element {
  eid: string;
  // 前端生成的节点ID
  id: string;
  area: string;
  // 节点的图标
  icon2: string;
  // x和y坐标值 JSON序列化后组成的字符串 如："{\"x\":565,\"y\":325}"
  position2: string;
  icon3: string;
  position3: string;
  // 节点的名称
  name: string;
  description: string;
  type: number;
  // 其他配置中 附件的文件地址
  file: string;
  system_type: string;
  // 系统架构 32|64
  system_architecture: string;
  // 系统语言
  system_language: string;
  cpu: number;
  ram: number;
  disk: number;
  // 其他配置中 自定义命令
  init_commands: string[];
  // 其他配置中 附件的命令
  node_command: string[];
  // 网卡数量
  max_port_number: number;
  ports: Port[];
  flows: Flow[];
  // ext: ElementEXT;
  //节点扩展字段归一
  allocation_pools: Array<any>; // 虚拟交换机地址池
  category: number; // 靶标分类
  category2: number; // 靶标二级分类
  category3: number; // 靶标三级分类
  cidr: string; // 虚拟交换机cidr地址段
  dhcp: boolean; // 虚拟交换机是否开启dhcp
  dns_nameservers: Array<string>; // 虚拟交换机dns
  electric_port_number: number; // 电口数量
  electric_port_type: string; // 电口类型
  external: boolean; // 是否外部引用资源
  firewall_resource_id: string; // 云平台三层防火墙资源id
  firewall_rules: Array<any>; // 虚拟防火墙规则
  gateway: string; // 简易型交换机网关
  host: string; // 宿主机名称
  image: string; // 快照名称
  image_type: string; // 镜像类型
  init_support: boolean; // 是否支持初始化
  initial_tools: Array<any>; // 终端初始包含工具
  lan_port_number: number; // lan口数量
  lan_port_type: string; // lan口类型
  optical_port_number: number; // 光口数量
  optical_port_type: string; // 光口类型
  quick_create_params: Array<any>; //快速创建参数
  quick_create_support: boolean; // 是否支持快速创建
  resource_id: string; //云平台虚拟化资源id
  role: number; // 靶标角色
  static_routes: Array<any>; // 虚拟路由静态路由
  transparent: boolean; // 是否透明模式
  virtual_type: number; // 云平台虚拟化类型
  vlan: boolean; // 虚拟交换机vlan模式
  vlan_id: number; // 虚拟交换机vlanId
  wan_port_number: number; // wan口数量
  wan_port_type: string; // wan口类型
  probes: Probes; // 新增enable_probe_collect开关字段
}

/**
 * 节点扩展字段
 */
export interface ElementEXT {
  // role: number;
  // image_type: string;
  // external: boolean;
  // virtual_type: number;
  // transparent: boolean;
  // resource_id: string;
  // electric_port_number: number;
  // electric_port_type: string;
  // optical_port_number: number;
  // optical_port_type: string;
  // cidr: string;
  // gateway: string;
  // dns_nameservers: any[];
  // dhcp: boolean;
  // allocation_pools: any[];
  // vlan: boolean;
  // vlan_id: number;
  // static_routes: any[];
  // firewall_rules: any[];
  // image: string;
  // initial_tools: any[];
  // category: number;
  // init_support: boolean;
  // quick_create_support: boolean;
  // quick_create_params: any[];
}

export interface Flow {
  id: string;
  name: string;
  desc: string;
  type: number;
  status: string;
  status_text: string;
  task_id?: null;
  script_param_models?: FlowParam[];
}

/**
 * 端口配置
 */
export interface Port {
  eid: string;
  // 端口ID，前端生成，生成规则为port_节点ID_(entity_electrical | light | wan | lan)_序号
  id: string;
  // 端口名称
  name: string;
  type: number;
  // IP地址，可以手填或者场景启动后生成填入
  ip: string;
  netmask: string;
  gateway: string;
  dhcp: boolean;
  dns: string;
  egress: number;
  ingress: number;
  delay: number;
  loss: number;
  source_port_id: string;
  // ext: PortEXT;
  //拓展字段归一
  access_modes: Array<any>; // 接入方式
  auxiliary_network_id: string; // 辅助网络id
  entity_access_type: string; // 实体设备端口接入类型
  entity_switch_name: string; // 实体设备端口链接的交换机名称
  entity_switch_port: string; // 实体设备端口链接的交换机端口
  firewall_resource_id: string; // 云平台三层防火墙资源id
  firewall_rules: Array<any>; // 虚拟防火墙规则
  floating_ip: string; // 弹性ip
  floating_ip_id: string; // 弹性ip的id
  gateway_port_ips: string; // 网关设备端口地址段
  gateway_port_type: number; // 网关设备端口类型
  nat: boolean; // 是否nat外网
  qos_id: string; // qos id
  resource_id: string; // 云平台虚拟化资源id
  mac_addr: string; // 实体设备
}

/**
 * 端口扩展字段
 */
export interface PortEXT {
  // resource_id: string;
  // nat: boolean;
  // entity_access_type: string;
  // entity_switch_name: string;
  // entity_switch_port: string;
  // gateway_port_type: number;
  // gateway_port_ips: string;
  // auxiliary_network_id: string;
  // qos_id: string;
  // access_modes: any[];
}

// 数据采集 新增开关
export interface Probes {
  enable_probe_collect: boolean;
  probes: Probe[];
}

// 数据采集
export interface Probe {
  // 探针描述
  desc: string;
  id: string;
  // 探针名称
  name: string;
  status: number;
  status_text: string;
  /**
   * 探针分类
   *   0: 'String',
   *   1: 'IP',
   *   2: 'Number',
   *   3: 'Bool',
   */
  type: number;
  // 预设参数数据
  params: Param[];
  common: boolean;
}

export interface Param {
  // 参数默认值
  default_value: string;
  // 参数描述
  description: string;
  // 参数名称
  name: string;
  // 参数类型
  type: number;
}
// 流量发生参数列表
export interface FlowParam {
  param_desc: string;
  param_key: string;
  param_type: number; // 参数类型：0 string,1 IP,2 number,3 bool
  param_value: string;
}

export interface Scene {
  eid: string;
  // 场景名称
  name: string;
  // 场景描述
  description: string;
  file: string;
  // 是否简易型连线、背景图片
  display_context: string;
  // 是否开启流量采集，默认false
  enable_flow_collect: boolean;
  // 是否开启流量镜像，默认false
  enable_flow_mirror: boolean;
}
