import t from '../utils/i18n';

export enum DialogTypes {
  //导入
  Import = 1,
  //创建模板
  CreateTemplate,
  //配置
  BaseConfig,
  //添加角色
  AddRole,
  //数据采集
  DataCollection,
  // 流量发生
  FlowOccurs,
  //  交换机
  //简易
  SwitchSimple,
  //虚拟机
  SwitchVMware,
  //容器
  SwitchContainer,
  //  实体设备
  PhysicalDevice,
  //  外部网络
  ExternalNetWork,
  //  终端
  //容器
  TerminalNodeContainer,
  //虚拟机
  TerminalNodeVMware,
  //  路由器
  //简易型
  RouterSimple,
  //虚拟机
  RouterVMware,
  //容器
  RouterContainer,
  //  防火墙
  //简易型
  FireWallSimple,
  //  虚拟机
  FireWallVMware,
  //容器
  FireWallContainer,
  //核心路由器
  RouterCore,
  Npc,
  // GNS3节点
  // 交换机
  SwitchDynamips,
  // 路由器
  RouterDynamips,
  // 防火墙
  FireWallDynamips,
}
export const DialogTitle = {
  [DialogTypes.Import]: t('menu.importConfig'),
  [DialogTypes.CreateTemplate]: t('menu.createTemplate'),
  [DialogTypes.BaseConfig]: t('menu.basicSetting'),
  [DialogTypes.AddRole]: t('menu.addRole'),
  [DialogTypes.DataCollection]: t('menu.menu.dataCollect'),
  [DialogTypes.FlowOccurs]: t('menu.generatedTraffic'),
  [DialogTypes.SwitchSimple]: t('target.switches') + t('target.config'),
  [DialogTypes.SwitchVMware]: t('target.switches') + t('target.config'),
  [DialogTypes.SwitchContainer]: t('target.switches') + t('target.config'),
  [DialogTypes.PhysicalDevice]: t('target.entity') + t('target.config'),
  [DialogTypes.ExternalNetWork]:
    t('target.externalNetwork') + t('target.config'),
  [DialogTypes.TerminalNodeContainer]:
    t('target.terminal') + t('target.config'),
  [DialogTypes.TerminalNodeVMware]: t('target.terminal') + t('target.config'),
  [DialogTypes.RouterSimple]: t('target.router') + t('target.config'),
  [DialogTypes.RouterVMware]: t('target.router') + t('target.config'),
  [DialogTypes.RouterContainer]: t('target.router') + t('target.config'),
  [DialogTypes.FireWallSimple]: t('target.firewall') + t('target.config'),
  [DialogTypes.FireWallVMware]: t('target.firewall') + t('target.config'),
  [DialogTypes.FireWallContainer]: t('target.firewall') + t('target.config'),
  [DialogTypes.RouterCore]: t('target.kRouter') + t('target.config'),
  [DialogTypes.Npc]: t('target.npc') + t('target.config'),
  [DialogTypes.SwitchDynamips]: t('target.switches') + t('target.config'),
  [DialogTypes.RouterDynamips]: t('target.router') + t('target.config'),
  [DialogTypes.FireWallDynamips]: t('target.firewall') + t('target.config'),
};
