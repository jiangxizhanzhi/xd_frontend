interface SceneDataBO {
  /**
   * 插件数据(字典: key-插件代号, value-插件数据[不同插件代号对应的数据模型不一样])
   * */
  plugins: {
    /**云平台*/
    cpcloud?: CloudPluginSceneDataBO;
    /**采集*/
    cpcollection?: CollectionPluginSceneDataBO;
    /**流量*/
    cpflow?: FlowPluginSceneDataBO;
  };
  /**拓扑数据*/
  topology: SceneTopologyBO;
}

interface SceneConfigDataBO {
  /**
   * 插件数据(字典: key-插件代号, value-插件数据[不同插件代号对应的数据模型不一样])
   * */
  plugins: {
    /**云平台*/
    cpcloud?: CloudPluginSceneConfigDataBO;
    /**采集*/
    cpcollection?: CollectionPluginSceneConfigDataBO;
    /**流量*/
    cpflow?: FlowPluginSceneConfigDataBO;
  };
  /**拓扑数据*/
  topology: SceneConfigTopologyBO;
}

/**
 拓扑数据
 */
interface SceneTopologyBO {
  /**当前区域id*/
  area_id: string;
  /**区域数据*/
  areas: Array<SceneAreaBO>;
  /**连接数据*/
  connections: Array<SceneElementPortConnectionBO>;
  /**网元数据*/
  elements: Array<SceneElementBO>;
  /**碎片数据*/
  pieces: Array<ScenePieceBO>;
  /**场景基础数据*/
  scene: SceneBO;
}

/**
 区域数据
 */
interface SceneAreaBO {
  /**所属区域id*/
  area: string;
  /**描述*/
  description: string;
  /**显示参数*/
  display_context: string;
  /**服务端id*/
  eid: string;
  /**2d图标地址*/
  icon2: string;
  /**3d图标地址*/
  icon3: string;
  /**节点id*/
  id: string;
  /**名称*/
  name: string;
  /**展开标记*/
  open: boolean;
  /**2d坐标*/
  position2: string;
  /**3d坐标*/
  position3: string;
}

/**
 连接数据
 */
interface SceneElementPortConnectionBO {
  /**显示参数*/
  display_context: string;
  /**服务端id*/
  eid: string;
  /**连接id*/
  id: string;
  /**连接名称*/
  name: string;
  /**源端口id*/
  source: string;
  /**目标端口id*/
  target: string;
  /**是否单向连接*/
  unidirectional: boolean;
}

/**
 网元数据
 */
interface SceneElementBO {
  /**所属区域id*/
  area: string;
  /**cpu数量*/
  cpu: number;
  /**描述*/
  description: string;
  /**磁盘大小*/
  disk: number;
  /**显示参数*/
  display_context: string;
  /**服务端id*/
  eid: string;
  /**事件*/
  event: number;
  /**事件状态*/
  event_status: number;
  /**节点文件*/
  file: string;
  /**2d图标地址*/
  icon2: string;
  /**3d图标地址*/
  icon3: string;
  /**节点id*/
  id: string;
  /**初始化命令*/
  init_commands: Array<string>;
  /**最大端口数量*/
  max_port_number: number;
  /**名称*/
  name: string;
  /**节点文件命令*/
  node_command: string;
  /**网元端口*/
  ports: Array<SceneElementPortBO>;
  /**2d坐标*/
  position2: string;
  /**3d坐标*/
  position3: string;
  /**事件进程*/
  process: string;
  /**事件进程描述信息*/
  process_message: string;
  /**事件进程状态*/
  process_status: number;
  /**内存大小*/
  ram: number;
  /**系统架构*/
  system_architecture: string;
  /**系统语言*/
  system_language: string;
  /**系统类型*/
  system_type: string;
  /**网元类型*/
  type: number;
}

/**
 网元端口
 */
interface SceneElementPortBO {
  /** 端口id */
  id: string;
  /** 名称 */
  name: string;
  /** 类型 */
  type: number;
  /** mac地址 */
  macAddr: string;
  /** ip地址 */
  ip: string;
  /** 子网掩码 */
  netmask: string;
  /** 网关 */
  gateway: string;
  /** 是否开启dhcp */
  dhcp: boolean;
  /** dns */
  dns: string;
  /** 上行带宽 */
  egress: number;
  /** 下行带宽 */
  ingress: number;
  /** 延迟 */
  delay: number;
  /** 丢包率 */
  loss: number;
  /** 【即将废弃】接入方式 */
  accessModes: Array<AccessMode>;
  /** 端口顺序 */
  order: number;
}

/**
 碎片数据
 */
interface ScenePieceBO {
  /**所属区域id*/
  area: string;
  /**描述*/
  description: string;
  /**显示参数*/
  display_context: string;
  /**服务端id*/
  eid: string;
  /**2d图标地址*/
  icon2: string;
  /**3d图标地址*/
  icon3: string;
  /**节点id*/
  id: string;
  /**名称*/
  name: string;
  /**2d坐标*/
  position2: string;
  /**3d坐标*/
  position3: string;
  /**碎片类型*/
  type: string;
}

/**
 场景基础数据
 */
interface SceneBO {
  /**创建消耗时间(秒)*/
  create_consume_seconds: number;
  /**创建时间*/
  create_time: string;
  /**描述*/
  description: string;
  /**显示上下文*/
  display_context: string;
  /**服务端id*/
  eid: string;
  /**事件*/
  event: number;
  /**事件状态*/
  event_status: number;
  /**场景文件*/
  file: string;
  /**名称*/
  name: string;
  /**事件进程*/
  process: string;
  /**事件进程描述信息*/
  process_message: string;
  /**事件进程状态*/
  process_status: number;
  /**事件进度百分比*/
  progress_percentage: number;
}

interface CloudPluginSceneDataBO {
  /**本插件端口配置*/
  element_ports: { [key: string]: CloudPluginSceneElementPortBO };
  /**本插件网元配置*/
  elements: { [key: string]: CloudPluginSceneElementBO };
  /**本插件全局配置*/
  scene: CloudPluginSceneBO;
}

/**
 本插件端口配置
 */
interface CloudPluginSceneElementPortBO {
  /**接入方式*/
  access_modes: Array<CloudAccessMode>;
  /**辅助网络id*/
  auxiliary_network_id: string;
  /**是否是连接网络外网的端口*/
  conn_to_ext_net: boolean;
  /**实体设备端口接入类型*/
  entity_access_type: string;
  /**实体设备端口链接的交换机名称*/
  entity_switch_name: string;
  /**实体设备端口链接的交换机端口*/
  entity_switch_port: string;
  /**云平台三层防火墙资源id*/
  firewall_resource_id: string;
  /**虚拟防火墙规则*/
  firewall_rules: Array<FirewallRule>;
  /**弹性ip*/
  floating_ip: string;
  /**弹性ip的id*/
  floating_ip_id: string;
  /**网关设备端口地址段*/
  gateway_port_ips: string;
  /**网关设备端口类型*/
  gateway_port_type: number;
  /***/
  logic_network_id: string;
  /**是否nat外网*/
  nat: boolean;
  /**qos id*/
  qos_id: string;
  /**云平台虚拟化资源id*/
  resource_id: string;
}

/**
 接入方式
 */
interface CloudAccessMode {
  /**接入ip*/
  access_ip: string;
  /**接入端口*/
  access_port: number;
  /**是否连通*/
  available: boolean;
  /**基础协议tcp/udp*/
  base_protocol: string;
  /**连接id*/
  connection_id: string;
  /**连接url*/
  connection_url: string;
  /**连接所属用户*/
  connection_user: string;
  /**描述*/
  desc: string;
  /**接入模式id*/
  id: string;
  /**密码*/
  password: string;
  /**路径*/
  path: string;
  /**端口*/
  port: number;
  /**协议*/
  protocol: string;
  /**开启代理*/
  proxy: boolean;
  /**代理id*/
  proxy_id: string;
  /**用户名*/
  username: string;
}

/**
 虚拟防火墙规则
 */
interface FirewallRule {
  /**动作*/
  action: string;
  /**目标ip*/
  destination_ip_address: string;
  /**目标端口*/
  destination_port: string;
  /**方向*/
  direction: string;
  /**ip版本*/
  ip_version: number;
  /**协议*/
  protocol: string;
  /**源ip*/
  source_ip_address: string;
  /**源端口*/
  source_port: string;
}

/**
 本插件网元配置
 */
interface CloudPluginSceneElementBO {
  /**虚拟交换机地址池*/
  allocation_pools: Array<AllocationPool>;
  /**关闭辅助路由*/
  auxiliary_router_off: boolean;
  /**靶标分类*/
  category: number;
  /**靶标二级分类*/
  category2: number;
  /**靶标三级分类*/
  category3: number;
  /**虚拟交换机cidr地址段*/
  cidr: string;
  /**虚拟交换机是否开启dhcp*/
  dhcp: boolean;
  /**虚拟交换机dns*/
  dns_nameservers: Array<string>;
  /**电口数量*/
  electric_port_number: number;
  /**电口类型*/
  electric_port_type: string;
  /**是否外部引用资源*/
  external: boolean;
  /**云平台三层防火墙资源id*/
  firewall_resource_id: string;
  /**虚拟防火墙规则*/
  firewall_rules: Array<FirewallRule>;
  /**虚拟交换机网关*/
  gateway: string;
  /**宿主机名称*/
  host: string;
  /**虚拟交换机静态路由*/
  host_routes: Array<HostRoute>;
  /**虚拟机/容器镜像名称*/
  image: string;
  /**镜像类型*/
  image_type: string;
  /**是否支持初始化*/
  init_support: boolean;
  /**终端初始包含工具*/
  initial_tools: Array<InitialTool>;
  /**是否云平台內置靶標*/
  is_build_in: boolean;
  /**lan口数量*/
  lan_port_number: number;
  /**lan口类型*/
  lan_port_type: string;
  /**光口数量*/
  optical_port_number: number;
  /**光口类型*/
  optical_port_type: string;
  /**快速创建参数*/
  quick_create_params: Array<QuickCreateParam>;
  /**是否支持快速创建*/
  quick_create_support: boolean;
  /**云平台虚拟化资源id*/
  resource_id: string;
  /**靶标角色*/
  role: number;
  /**虚拟路由静态路由*/
  static_routes: Array<StaticRoute>;
  /**是否透明模式*/
  transparent: boolean;
  /**云平台虚拟化类型*/
  virtual_type: number;
  /**虚拟交换机vlan模式*/
  vlan: boolean;
  /**虚拟交换机vlanId*/
  vlan_id: number;
  /**wan口数量*/
  wan_port_number: number;
  /**wan口类型*/
  wan_port_type: string;
}

/**
 虚拟交换机地址池
 */
interface AllocationPool {
  /**结束地址*/
  end: string;
  /**开始地址*/
  start: string;
}

/**
 虚拟交换机静态路由
 */
interface HostRoute {
  /**目的地址(cidr)*/
  destination: string;
  /**下一跳地址*/
  nexthop: string;
}

/**
 终端初始包含工具
 */
interface InitialTool {
  /** 名称 */
  name: string;
  /** 描述 */
  description: string;
  /** 类型 */
  type: string;
  /** 是否预装 */
  preInstalled: boolean;
}

/**
 快速创建参数
 */
interface QuickCreateParam {
  /**分类*/
  categories: string;
  /**部署类型*/
  deploy_type: number;
  /**描述*/
  description: string;
  /**docker资源信息*/
  docker_installer_data: DockerInstaller;
  /**logo*/
  logo: string;
  /**名称*/
  name: string;
  /**资源文件列表*/
  resource_list: Array<Resource>;
  /**id*/
  uuid: string;
}

/**
 docker资源信息
 */
interface DockerInstaller {
  /**文件地址*/
  docker_url: string;
  /**支持平台*/
  start_up_parameter_list: Array<StartUpParameter>;
  /**临时文件id*/
  tmpdir_uuid: string;
  /**用户文件名*/
  user_filename: string;
}

/**
 支持平台
 */
interface StartUpParameter {
  /**命令*/
  cmd: string;
  /**容器端口*/
  container_port: string;
  /**默认值*/
  default_val: string;
  /**参数说明*/
  desc: string;
  /**主机端口*/
  host_port: string;
  /**参数名称*/
  name: string;
  /**是否必须*/
  required: string;
  /**参数类型*/
  type: string;
}

/**
 资源文件列表
 */
interface Resource {
  /**文件地址*/
  file: string;
  /**支持平台*/
  platforms: string;
  /**临时文件id*/
  tmpdir_uuid: string;
  /**用户文件名*/
  user_filename: string;
}

/**
 虚拟路由静态路由
 */
interface StaticRoute {
  /**目的地址(cidr)*/
  destination: string;
  /**下一跳地址*/
  nexthop: string;
}

/**
 本插件全局配置
 */
interface CloudPluginSceneBO {
  /**是否开启录屏*/
  enable_recording: boolean;
}

interface CollectionPluginSceneDataBO {
  /**本插件端口配置*/
  element_ports: { [key: string]: CollectionPluginSceneElementPortBO };
  /**本插件网元配置*/
  elements: { [key: string]: CollectionPluginSceneElementBO };
  /**本插件全局配置*/
  scene: CollectionPluginSceneBO;
}

/**
 本插件端口配置
 */
interface CollectionPluginSceneElementPortBO {
  /**是否开启流量采集*/
  enable_flow_collect: boolean;
}

/**
 本插件网元配置
 */
interface CollectionPluginSceneElementBO {
  /**是否开启探针采集*/
  enable_probe_collect: boolean;
  /**探针列表*/
  probes: Array<Probe>;
}

/**
 探针列表
 */
interface Probe {
  /**是否通用探针*/
  common: boolean;
  /**描述*/
  desc: string;
  /**是否开启探针*/
  disabled: boolean;
  /**探针id*/
  id: string;
  /**采集时间间隔,单位:秒*/
  interval: number;
  /**名称*/
  name: string;
  /**参数*/
  params: Array<Param>;
  /**状态*/
  status: number;
  /**状态描述*/
  status_text: string;
  /**分类*/
  type: string;
}

/**
 参数
 */
interface Param {
  /**默认值*/
  default_value: string;
  /**说明*/
  description: string;
  /**名称*/
  name: string;
  /**类型*/
  type: string;
  /**自定义值*/
  value: string;
}

/**
 本插件全局配置
 */
interface CollectionPluginSceneBO {
  /**是否开启流量采集*/
  enable_flow_collect: boolean;
  /**是否开启探针采集*/
  enable_probe_collect: boolean;
  /**流量采集id*/
  flow_collector: string;
  /**数据采集id*/
  probe_collector: string;
  /**采集路由id*/
  probe_router: string;
}

interface FlowPluginSceneDataBO {
  /**本插件端口配置*/
  element_ports: { [key: string]: FlowPluginSceneElementPortBO };
  /**本插件网元配置*/
  elements: { [key: string]: FlowPluginSceneElementBO };
  /**本插件全局配置*/
  scene: FlowPluginSceneBO;
}

/**
 本插件端口配置
 */
interface FlowPluginSceneElementPortBO {
  // 空
}

/**
 本插件网元配置
 */
interface FlowPluginSceneElementBO {
  /**流量列表*/
  flows: Array<Flow>;
}

/**
 流量列表
 */
interface Flow {
  /**流量分类*/
  category: number;
  /**执行次数*/
  count: number;
  /**描述*/
  desc: string;
  /**流量id*/
  id: string;
  /**交互类型：0 背景流量，1 攻击流量，2 全流量*/
  interactive_type: number;
  /**名称*/
  name: string;
  /**流量脚本参数列表*/
  script_param_models: Array<FlowScriptParam>;
  /**状态*/
  status: number;
  /**状态描述*/
  status_text: string;
  /**流量任务id*/
  task_id: string;
  /**分类*/
  type: string;
}

/**
 流量脚本参数列表
 */
interface FlowScriptParam {
  /**参数描述*/
  param_desc: string;
  /**参数key*/
  param_key: string;
  /**参数类型：0 string,1 IP,2 number,3 bool*/
  param_type: number;
  /**参数值*/
  param_value: string;
}

/**
 本插件全局配置
 */
interface FlowPluginSceneBO {
  /**流量发生器id*/
  executor: string;
}

/**
 拓扑数据
 */
interface SceneConfigTopologyBO {
  /**当前区域id*/
  area_id: string;
  /**区域数据*/
  areas: Array<SceneConfigAreaBO>;
  /**连接数据*/
  connections: Array<SceneConfigElementPortConnectionBO>;
  /**网元数据*/
  elements: Array<SceneConfigElementBO>;
  /**碎片数据*/
  pieces: Array<SceneConfigPieceBO>;
  /**场景基础数据*/
  scene: SceneConfigBO;
}

/**
 区域数据
 */
interface SceneConfigAreaBO {
  /**所属区域id*/
  area: string;
  /**描述*/
  description: string;
  /**显示参数*/
  display_context: string;
  /**服务端id*/
  eid: string;
  /**2d图标地址*/
  icon2: string;
  /**3d图标地址*/
  icon3: string;
  /**节点id*/
  id: string;
  /**名称*/
  name: string;
  /**展开标记*/
  open: boolean;
  /**2d坐标*/
  position2: string;
  /**3d坐标*/
  position3: string;
}

/**
 连接数据
 */
interface SceneConfigElementPortConnectionBO {
  /**显示参数*/
  display_context: string;
  /**服务端id*/
  eid: string;
  /**连接id*/
  id: string;
  /**连接名称*/
  name: string;
  /**源端口id*/
  source: string;
  /**目标端口id*/
  target: string;
  /**是否单向连接*/
  unidirectional: boolean;
}

/**
 网元数据
 */
interface SceneConfigElementBO {
  /**所属区域id*/
  area: string;
  /**cpu数量*/
  cpu: number;
  /**描述*/
  description: string;
  /**磁盘大小*/
  disk: number;
  /**显示参数*/
  display_context: string;
  /**服务端id*/
  eid: string;
  /**节点文件*/
  file: string;
  /**2d图标地址*/
  icon2: string;
  /**3d图标地址*/
  icon3: string;
  /**节点id*/
  id: string;
  /**初始化命令*/
  init_commands: Array<string>;
  /**最大端口数量*/
  max_port_number: number;
  /**名称*/
  name: string;
  /**节点文件命令*/
  node_command: string;
  /**网元端口*/
  ports: Array<SceneConfigElementPortBO>;
  /**2d坐标*/
  position2: string;
  /**3d坐标*/
  position3: string;
  /**内存大小*/
  ram: number;
  /**系统架构*/
  system_architecture: string;
  /**系统语言*/
  system_language: string;
  /**系统类型*/
  system_type: string;
  /**网元类型*/
  type: number;
}

/**
 网元端口
 */
interface SceneConfigElementPortBO {
  /** 端口id */
  id: string;
  /** 名称 */
  name: string;
  /** 类型 */
  type: number;
  /** mac地址 */
  macAddr: string;
  /** ip地址 */
  ip: string;
  /** 子网掩码 */
  netmask: string;
  /** 网关 */
  gateway: string;
  /** 是否开启dhcp */
  dhcp: boolean;
  /** dns */
  dns: string;
  /** 上行带宽 */
  egress: number;
  /** 下行带宽 */
  ingress: number;
  /** 延迟 */
  delay: number;
  /** 丢包率 */
  loss: number;
  /** 【即将废弃】接入方式 */
  accessModes: Array<AccessMode>;
  /** 端口顺序 */
  order: number;
}

/**
 * 接入方式
 */
interface AccessMode {
  /** 协议 */
  protocol: string;
  /** 端口 */
  port: number;
  /** 用户名 */
  username: string;
  /** 密码 */
  password: string;
  /** 路径 */
  path: string;
  /** 描述 */
  desc: string;
  /** 基础协议tcp/udp */
  baseProtocol: string;
  /** 开启代理 */
  proxy: boolean;
}

/**
 碎片数据
 */
interface SceneConfigPieceBO {
  /**所属区域id*/
  area: string;
  /**描述*/
  description: string;
  /**显示参数*/
  display_context: string;
  /**服务端id*/
  eid: string;
  /**2d图标地址*/
  icon2: string;
  /**3d图标地址*/
  icon3: string;
  /**节点id*/
  id: string;
  /**名称*/
  name: string;
  /**2d坐标*/
  position2: string;
  /**3d坐标*/
  position3: string;
  /**碎片类型*/
  type: string;
}

/**
 场景基础数据
 */
interface SceneConfigBO {
  /**创建时间*/
  create_time: string;
  /**描述*/
  description: string;
  /**显示上下文*/
  display_context: string;
  /**服务端id*/
  eid: string;
  /**场景文件*/
  file: string;
  /**名称*/
  name: string;
}

interface CloudPluginSceneConfigDataBO {
  /**本插件端口配置*/
  element_ports: { [key: string]: CloudPluginSceneConfigElementPortBO };
  /**本插件网元配置*/
  elements: { [key: string]: CloudPluginSceneConfigElementBO };
  /**本插件全局配置*/
  scene: CloudPluginSceneConfigBO;
}

/**
 本插件端口配置
 */
interface CloudPluginSceneConfigElementPortBO {
  /**接入方式*/
  access_modes: Array<CloudAccessMode>;
  /**辅助网络id*/
  auxiliary_network_id: string;
  /**是否是连接网络外网的端口*/
  conn_to_ext_net: boolean;
  /**实体设备端口接入类型*/
  entity_access_type: string;
  /**实体设备端口链接的交换机名称*/
  entity_switch_name: string;
  /**实体设备端口链接的交换机端口*/
  entity_switch_port: string;
  /**云平台三层防火墙资源id*/
  firewall_resource_id: string;
  /**虚拟防火墙规则*/
  firewall_rules: Array<FirewallRule>;
  /**弹性ip*/
  floating_ip: string;
  /**弹性ip的id*/
  floating_ip_id: string;
  /**网关设备端口地址段*/
  gateway_port_ips: string;
  /**网关设备端口类型*/
  gateway_port_type: number;
  /**是否nat外网*/
  nat: boolean;
  /**qos id*/
  qos_id: string;
  /**云平台虚拟化资源id*/
  resource_id: string;
}

/**
 本插件网元配置
 */
interface CloudPluginSceneConfigElementBO {
  /**虚拟交换机地址池*/
  allocation_pools: Array<AllocationPool>;
  /**关闭辅助路由*/
  auxiliary_router_off: boolean;
  /**靶标分类*/
  category: number;
  /**靶标二级分类*/
  category2: number;
  /**靶标三级分类*/
  category3: number;
  /**虚拟交换机cidr地址段*/
  cidr: string;
  /**虚拟交换机是否开启dhcp*/
  dhcp: boolean;
  /**虚拟交换机dns*/
  dns_nameservers: Array<string>;
  /**电口数量*/
  electric_port_number: number;
  /**电口类型*/
  electric_port_type: string;
  /**是否外部引用资源*/
  external: boolean;
  /**云平台三层防火墙资源id*/
  firewall_resource_id: string;
  /**虚拟防火墙规则*/
  firewall_rules: Array<FirewallRule>;
  /**虚拟交换机网关*/
  gateway: string;
  /**宿主机名称*/
  host: string;
  /**虚拟交换机静态路由*/
  host_routes: Array<HostRoute>;
  /**虚拟机/容器镜像名称*/
  image: string;
  /**镜像类型*/
  image_type: string;
  /**是否支持初始化*/
  init_support: boolean;
  /**终端初始包含工具*/
  initial_tools: Array<InitialTool>;
  /**是否云平台內置靶標*/
  is_build_in: boolean;
  /**lan口数量*/
  lan_port_number: number;
  /**lan口类型*/
  lan_port_type: string;
  /**光口数量*/
  optical_port_number: number;
  /**光口类型*/
  optical_port_type: string;
  /**快速创建参数*/
  quick_create_params: Array<QuickCreateParam>;
  /**是否支持快速创建*/
  quick_create_support: boolean;
  /**云平台虚拟化资源id*/
  resource_id: string;
  /**靶标角色*/
  role: number;
  /**虚拟路由静态路由*/
  static_routes: Array<StaticRoute>;
  /**是否透明模式*/
  transparent: boolean;
  /**云平台虚拟化类型*/
  virtual_type: number;
  /**虚拟交换机vlan模式*/
  vlan: boolean;
  /**虚拟交换机vlanId*/
  vlan_id: number;
  /**wan口数量*/
  wan_port_number: number;
  /**wan口类型*/
  wan_port_type: string;
}

/**
 本插件全局配置
 */
interface CloudPluginSceneConfigBO {
  /**是否开启录屏*/
  enable_recording: boolean;
}

interface CollectionPluginSceneConfigDataBO {
  /**本插件端口配置*/
  element_ports: { [key: string]: CollectionPluginSceneConfigElementPortBO };
  /**本插件网元配置*/
  elements: { [key: string]: CollectionPluginSceneConfigElementBO };
  /**本插件全局配置*/
  scene: CollectionPluginSceneConfigBO;
}

/**
 本插件端口配置
 */
interface CollectionPluginSceneConfigElementPortBO {
  /**是否开启流量采集*/
  enable_flow_collect: boolean;
}

/**
 本插件网元配置
 */
interface CollectionPluginSceneConfigElementBO {
  /**是否开启探针采集*/
  enable_probe_collect: boolean;
  /**探针列表*/
  probes: Array<Probe>;
}

/**
 本插件全局配置
 */
interface CollectionPluginSceneConfigBO {
  /**是否开启流量采集*/
  enable_flow_collect: boolean;
  /**是否开启探针采集*/
  enable_probe_collect: boolean;
}

interface FlowPluginSceneConfigDataBO {
  /**本插件端口配置*/
  element_ports: { [key: string]: FlowPluginSceneConfigElementPortBO };
  /**本插件网元配置*/
  elements: { [key: string]: FlowPluginSceneConfigElementBO };
  /**本插件全局配置*/
  scene: FlowPluginSceneConfigBO;
}

/**
 本插件端口配置
 */
interface FlowPluginSceneConfigElementPortBO {
  // 空
}

/**
 本插件网元配置
 */
interface FlowPluginSceneConfigElementBO {
  /**流量列表*/
  flows: Array<Flow>;
}

/**
 本插件全局配置
 */
interface FlowPluginSceneConfigBO {
  // 空
}
