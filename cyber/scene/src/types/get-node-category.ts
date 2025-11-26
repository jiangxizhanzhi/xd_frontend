/**
 * 编辑器内部处理到的靶标类型
 ——————————————————————————————————————————————
   role |  名称  | 虚拟类型 | 预置类型 | 类型标识符
 ——————————————————————————————————————————————
 * 22     交换机    简易型      *         switcher
 *                 虚拟机      *         vswitcher
 *                 容器        *         cswitcher
 *                 dynamips   *         dyswitcher
 *                 实装        *         entity
——————————————————————————————————————————————————
 * 1     二层交换机  *          *         switcher
 ————————————————————————————————————————————————————
 * 21     路由器    简易型      *         router
 *                 虚拟机      -非内置    vrouter
 *                            -内置      build_in_router（核心路由器）
 *                 容器        *         crouter
 *                 dynamips    *        dyrouter
 *                 实装        *         entity
————————————————————————————————————————————————————
 * 23     防火墙    简易型       *        firewall
 *                 虚拟机       *        vfirewall
 *                 容器         *        cfirewall
 *                 dynamips    *        dyfirewall
 *                 实装         *        entity
————————————————————————————————————————————————————
 * 3      外部网络   *           *        network
————————————————————————————————————————————————————
 * 7      仿真节点   *           *        npc
————————————————————————————————————————————————————
 * 4      终端节点   虚拟机       *        vserver
 *                  容器        *        cserver
 *                  实装        *        entity
————————————————————————————————————————————————————
 */

export default function getNodeCategory(
  role: number,
  image_type: string,
  is_build_in?: boolean,
) {
  let type = '';
  let typeNumber = null;
  switch (role) {
    // 交换机
    case 22:
      switch (image_type) {
        case 'simple':
          type = 'switcher';
          typeNumber = 7;
          break;
        case 'vm':
          type = 'vswitcher';
          typeNumber = 8;
          break;
        case 'container':
          type = 'cswitcher';
          typeNumber = 9;
          break;
        case 'dynamips':
          type = 'dyswitcher';
          typeNumber = 22;
          break;
        case 'entity':
          type = 'entity';
          typeNumber = 10;
          break;
      }
      break;
    // 交换机
    case 1:
      switch (image_type) {
        case 'simple':
          type = 'switcher';
          typeNumber = 7;
          break;
      }
      break;
    // 路由器
    case 21:
      switch (image_type) {
        case 'simple':
          type = 'router';
          typeNumber = 14;
          break;
        case 'vm':
          if (is_build_in) {
            type = 'build_in_router';
            typeNumber = 20;
          } else {
            type = 'vrouter';
            typeNumber = 15;
          }
          break;
        case 'container':
          type = 'crouter';
          typeNumber = 16;
          break;
        case 'dynamips':
          type = 'dyrouter';
          typeNumber = 23;
          break;
        case 'entity':
          type = 'entity';
          typeNumber = 10;
          break;
      }
      break;
    // 外部网络
    case 3:
      type = 'network';
      typeNumber = 11;
      break;
    // 仿真节点
    case 7:
      type = 'npc';
      typeNumber = 21;
      break;
    // 终端节点
    case 4:
      switch (image_type) {
        case 'vm':
          type = 'vserver';
          typeNumber = 13;
          break;
        case 'container':
          type = 'cserver';
          typeNumber = 12;
          break;
        case 'entity':
          type = 'entity';
          typeNumber = 10;
          break;
      }
      break;
    // 防火墙
    case 23:
      switch (image_type) {
        case 'simple':
          type = 'firewall';
          typeNumber = 17;
          break;
        case 'vm':
          type = 'vfirewall';
          typeNumber = 18;
          break;
        case 'container':
          type = 'cfirewall';
          typeNumber = 19;
          break;
        case 'dynamips':
          type = 'dyfirewall';
          typeNumber = 24;
          break;
        case 'entity':
          type = 'entity';
          typeNumber = 10;
          break;
      }
      break;
  }
  return { type, typeNumber };
}
