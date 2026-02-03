/**
 * 将场景格式的数据-》靶标格式的数据
 */
export function getOriginTargetData(copyData: any, nodeInfo: any) {
  let {
    basicConfig = {},
    applicationConfig = {},
    cpcollection = {},
    networkConfig = {},
    otherConfig = {},
    routerConfig = {},
    throughConfig = {},
    cpFlow = {},
  } = copyData;
  let ext_vm =
    basicConfig.image_type == 'vm'
      ? {
          cpu: basicConfig.cpu,
          disk: basicConfig.disk,
          ram: basicConfig.ram,
          init_support: basicConfig.init_support,
        }
      : null;

  let ext_docker =
    basicConfig.image_type == 'container'
      ? {
          init_support: basicConfig.init_support,
        }
      : null;

  let ext_gateway = {
    port_configs: [],
    console_config: [],
  };
  if (
    [21, 22, 23, 1].includes(basicConfig.role) &&
    ['container', 'vm'].includes(basicConfig.image_type)
  ) {
    for (let i = 0; i < basicConfig.wan.count; i++) {
      let name = `${basicConfig.wan.unit}0/${i + 1}(WAN)`;
      if (basicConfig.is_build_in && basicConfig.role == 21) {
        name = basicConfig.wan.unit + '0/' + (i + 1) + ` (eth${i})`;
      }
      // @ts-ignore
      ext_gateway['port_configs'].push({ port_type: 1, port_name: name });
    }
    for (let i = 0; i < basicConfig.lan.count; i++) {
      let name = `${basicConfig.wan.unit}0/${i + 1}(WAN)`;
      if (basicConfig.is_build_in && basicConfig.role == 21) {
        name = basicConfig.lan.unit + '0/' + (i + 1) + ` (eth${i})`;
      }
      // @ts-ignore
      ext_gateway['port_configs'].push({ port_type: 2, port_name: name });
    }
  }
  return {
    category: basicConfig.category,
    category2: basicConfig.second_category,
    category3: basicConfig.l3_category,
    image_type: basicConfig.image_type,
    image: basicConfig.icon,
    icon: basicConfig.icon,
    label: [basicConfig.name],
    role: basicConfig.role,
    name: basicConfig.name,
    mirror: basicConfig.image,
    ext_system_info: {
      system_architecture: basicConfig.system_architecture,
      language: basicConfig.system_language,
      system_type: basicConfig.system_type,
    },
    netCardNum: basicConfig.netCardNum,
    is_build_in: basicConfig.is_build_in,
    // 电口数量
    electrical: basicConfig.electrical,
    // 光口数量
    light: basicConfig.light,
    wan: basicConfig.wan,
    lan: basicConfig.lan,
    x: nodeInfo.x,
    y: nodeInfo.y,
    ospfRouterId: basicConfig.ospfRouterId,
    quick_create_params: basicConfig.quick_create_params,
    quick_create_support: basicConfig.quick_create_support,
    ext_vm: ext_vm,
    ext_docker: ext_docker,
    ext_entity: null,
    ext_entity_access: null,
    ext_gateway: ext_gateway,

    copyNetworkConfig: networkConfig,
    copyOtherConfig: otherConfig,
    copyRouterConfig: routerConfig,
    copyCpcollection: cpcollection,
    copyCpFlow: cpFlow,
  };
}
