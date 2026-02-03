<template>
  <div id="node-tooltip" @mouseenter="tooltipEnter" @mouseleave="tooltipLeave">
    <!-- 网络设备/路由器-内置(简易型) -->
    <div v-if="nodeTooltipType === 'router'">
      <div class="item-message">
        <span>{{ $tt('tooltip.deviceType') }}：</span>
        <span>{{ deviceType }}</span>
      </div>
      <div class="item-message">
        <span>{{ $tt('tooltip.powerInterfaceCount') }}：</span>
        <span>{{ electrical.count }}</span>
      </div>
      <div class="item-message">
        <span>{{ $tt('tooltip.fiberInterfaceCount') }}：</span>
        <span>{{ light.count }}</span>
      </div>
      <div class="item-message">
        <span>{{ $tt('tooltip.imageName') }}：</span>
        <span>{{ imageName }}</span>
      </div>
      <div class="item-message">
        <div>{{ $tt('tooltip.networkConfig') }}：</div>
        <div v-for="(item, index) in network" :key="item.name + index">
          <span>{{ item.name }}：</span>
          <span>{{ item.ip ? item.ip : '--' }}</span>
        </div>
      </div>
    </div>
    <!-- 网络设备/路由器-虚拟机 -->
    <div v-else-if="nodeTooltipType === 'vrouter'">
      <div class="item-message">
        <span>{{ $tt('tooltip.deviceType') }}：</span>
        <span>{{ deviceType }}</span>
      </div>
      <div class="item-message">
        <span>{{ $tt('tooltip.imageName') }}：</span>
        <span>{{ imageName }}</span>
      </div>
      <div class="item-message">
        <span>CPU：</span>
        <span>{{ cpu }}</span>
      </div>
      <div class="item-message">
        <span>{{ $tt('tooltip.memory') }}：</span>
        <span>{{ ram }}M</span>
      </div>
      <div class="item-message">
        <span>{{ $tt('tooltip.hardDisk') }}：</span>
        <span>{{ disk }}G</span>
      </div>
      <div class="item-message">
        <span>{{ $tt('tooltip.wanInterfaceCount') }}：</span>
        <span>{{ wan.count }}</span>
      </div>
      <div class="item-message">
        <span>{{ $tt('tooltip.lanInterfaceCount') }}：</span>
        <span>{{ lan.count }}</span>
      </div>
      <div class="item-message">
        <div>{{ $tt('tooltip.networkConfig') }}：</div>
        <div v-for="(item, index) in network" :key="item.name + index">
          <span>{{ item.name }}：</span>
          <span>{{ item.ip ? item.ip : '--' }}</span>
        </div>
      </div>
      <div class="item-message">
        <div>Cloud-init：{{ init_support ? $tt('menu.drawer.open') : $tt('menu.drawer.close') }}</div>
      </div>
    </div>
    <!-- 网络设备/路由器-容器 -->
    <div v-else-if="nodeTooltipType === 'crouter'">
      <div class="item-message">
        <span>{{ $tt('tooltip.deviceType') }}：</span>
        <span>{{ deviceType }}</span>
      </div>
      <div class="item-message">
        <span>{{ $tt('tooltip.imageName') }}：</span>
        <span>{{ imageName }}</span>
      </div>
      <div class="item-message">
        <span>{{ $tt('tooltip.wanInterfaceCount') }}：</span>
        <span>{{ wan.count }}</span>
      </div>
      <div class="item-message">
        <span>{{ $tt('tooltip.lanInterfaceCount') }}：</span>
        <span>{{ lan.count }}</span>
      </div>
      <div class="item-message">
        <div>{{ $tt('tooltip.networkConfig') }}：</div>
        <div v-for="(item, index) in network" :key="item.name + index">
          <span>{{ item.name }}：</span>
          <span>{{ item.ip ? item.ip : '--' }}</span>
        </div>
      </div>
    </div>
    <!-- 网络设备/路由器-核心路由器 -->
    <div v-else-if="nodeTooltipType === 'build_in_router'">
      <div class="item-message">
        <span>{{ $tt('tooltip.deviceType') }}：</span>
        <span>{{ deviceType }}</span>
      </div>
      <div class="item-message">
        <span>{{ $tt('tooltip.imageName') }}：</span>
        <span>{{ imageName }}</span>
      </div>
      <div class="item-message">
        <span>{{ $tt('tooltip.portCount') }}：</span>
        <span>{{ portNumber }}</span>
      </div>
      <div class="item-message">
        <div>{{ $tt('tooltip.networkConfig') }}：</div>
        <div v-for="(item, index) in network" :key="item.name + index">
          <span>{{ item.name }}：</span>
          <span>{{ item.ip ? item.ip : '--' }}</span>
        </div>
      </div>
    </div>
    <!-- 网络设备/交换机-内置(简易型) -->
    <div v-else-if="nodeTooltipType === 'switcher'">
      <div class="item-message">
        <span>{{ $tt('tooltip.deviceType') }}：</span>
        <span>{{ deviceType }}</span>
      </div>
      <div class="item-message">
        <span>{{ $tt('tooltip.powerInterfaceCount') }}：</span>
        <span>{{ electrical.count }}</span>
      </div>
      <div class="item-message">
        <span>{{ $tt('tooltip.fiberInterfaceCount') }}：</span>
        <span>{{ light.count }}</span>
      </div>
      <div class="item-message">
        <span>{{ $tt('tooltip.addresses') }}：</span>
        <span>{{ address }}</span>
      </div>
      <div class="item-message">
        <span>{{ $tt('tooltip.imageName') }}：</span>
        <span>{{ imageName }}</span>
      </div>
      <div class="item-message">
        <div>{{ $tt('tooltip.networkConfig') }}：</div>
        <div v-for="(item, index) in network" :key="item.name + index">
          <span>{{ item.name }}：</span>
          <span>{{ item.ip ? item.ip : '--' }}</span>
        </div>
      </div>
    </div>
    <!-- 网络设备/交换机-虚拟机 -->
    <div v-else-if="nodeTooltipType === 'vswitcher'">
      <div class="item-message">
        <span>{{ $tt('tooltip.deviceType') }}：</span>
        <span>{{ deviceType }}</span>
      </div>
      <div class="item-message">
        <span>{{ $tt('tooltip.imageName') }}：</span>
        <span>{{ imageName }}</span>
      </div>
      <div class="item-message">
        <span>CPU：</span>
        <span>{{ cpu }}</span>
      </div>
      <div class="item-message">
        <span>{{ $tt('tooltip.memory') }}：</span>
        <span>{{ ram }}M</span>
      </div>
      <div class="item-message">
        <span>{{ $tt('tooltip.hardDisk') }}：</span>
        <span>{{ disk }}G</span>
      </div>
      <div class="item-message">
        <span>{{ $tt('tooltip.portCount') }}：</span>
        <span>{{ portNumber }}</span>
      </div>
      <div class="item-message">
        <div>{{ $tt('tooltip.networkConfig') }}：</div>
        <div v-for="(item, index) in network" :key="item.name + index">
          <span>{{ item.name }}：</span>
          <span>{{ item.ip ? item.ip : '--' }}</span>
        </div>
      </div>
      <div class="item-message">
        <div>Cloud-init：{{ init_support ? $tt('menu.drawer.open') : $tt('menu.drawer.close') }}</div>
      </div>
    </div>
    <!-- 网络设备/交换机-容器 -->
    <div v-else-if="nodeTooltipType === 'cswitcher'">
      <div class="item-message">
        <span>{{ $tt('tooltip.deviceType') }}：</span>
        <span>{{ deviceType }}</span>
      </div>
      <div class="item-message">
        <span>{{ $tt('tooltip.imageName') }}：</span>
        <span>{{ imageName }}</span>
      </div>
      <div class="item-message">
        <span>{{ $tt('tooltip.portCount') }}：</span>
        <span>{{ portNumber }}</span>
      </div>
      <div class="item-message">
        <div>{{ $tt('tooltip.networkConfig') }}：</div>
        <div v-for="(item, index) in network" :key="item.name + index">
          <span>{{ item.name }}：</span>
          <span>{{ item.ip ? item.ip : '--' }}</span>
        </div>
      </div>
    </div>
    <!-- 网络设备/防火墙-内置(简易型) -->
    <div v-if="nodeTooltipType === 'firewall'">
      <div class="item-message">
        <span>{{ $tt('tooltip.deviceType') }}：</span>
        <span>{{ deviceType }}</span>
      </div>
      <div class="item-message">
        <span>{{ $tt('tooltip.powerInterfaceCount') }}：</span>
        <span>{{ electrical.count }}</span>
      </div>
      <div class="item-message">
        <span>{{ $tt('tooltip.fiberInterfaceCount') }}：</span>
        <span>{{ light.count }}</span>
      </div>
      <div class="item-message">
        <span>{{ $tt('tooltip.imageName') }}：</span>
        <span>{{ imageName }}</span>
      </div>
      <div class="item-message">
        <div>{{ $tt('tooltip.networkConfig') }}：</div>
        <div v-for="(item, index) in network" :key="item.name + index">
          <span>{{ item.name }}：</span>
          <span>{{ item.ip ? item.ip : '--' }}</span>
        </div>
      </div>
    </div>
    <!-- 网络设备/防火墙-虚拟机 -->
    <div v-else-if="nodeTooltipType === 'vfirewall'">
      <div class="item-message">
        <span>{{ $tt('tooltip.deviceType') }}：</span>
        <span>{{ deviceType }}</span>
      </div>
      <div class="item-message">
        <span>{{ $tt('tooltip.imageName') }}：</span>
        <span>{{ imageName }}</span>
      </div>
      <div class="item-message">
        <span>CPU：</span>
        <span>{{ cpu }}</span>
      </div>
      <div class="item-message">
        <span>{{ $tt('tooltip.memory') }}：</span>
        <span>{{ ram }}M</span>
      </div>
      <div class="item-message">
        <span>{{ $tt('tooltip.hardDisk') }}：</span>
        <span>{{ disk }}G</span>
      </div>
      <div class="item-message">
        <span>{{ $tt('tooltip.wanInterfaceCount') }}：</span>
        <span>{{ wan.count }}</span>
      </div>
      <div class="item-message">
        <span>{{ $tt('tooltip.lanInterfaceCount') }}：</span>
        <span>{{ lan.count }}</span>
      </div>
      <div class="item-message">
        <div>{{ $tt('tooltip.networkConfig') }}：</div>
        <div v-for="(item, index) in network" :key="item.name + index">
          <span>{{ item.name }}：</span>
          <span>{{ item.ip ? item.ip : '--' }}</span>
        </div>
      </div>
      <div class="item-message">
        <div>Cloud-init：{{ init_support ? $tt('menu.drawer.open') : $tt('menu.drawer.close') }}</div>
      </div>
    </div>
    <!-- 网络设备/防火墙-容器 -->
    <div v-else-if="nodeTooltipType === 'crouter'">
      <div class="item-message">
        <span>{{ $tt('tooltip.deviceType') }}：</span>
        <span>{{ deviceType }}</span>
      </div>
      <div class="item-message">
        <span>{{ $tt('tooltip.imageName') }}：</span>
        <span>{{ imageName }}</span>
      </div>
      <div class="item-message">
        <span>{{ $tt('tooltip.portCount') }}：</span>
        <span>{{ portNumber }}</span>
      </div>
      <div class="item-message">
        <div>{{ $tt('tooltip.networkConfig') }}：</div>
        <div v-for="(item, index) in network" :key="item.name + index">
          <span>{{ item.name }}：</span>
          <span>{{ item.ip ? item.ip : '--' }}</span>
        </div>
      </div>
    </div>
    <!-- 终端节点/虚拟机 -->
    <div v-else-if="nodeTooltipType === 'vserver'">
      <div class="item-message">
        <span>{{ $tt('tooltip.deviceType') }}：</span>
        <span>{{ deviceType }}</span>
      </div>
      <div class="item-message">
        <span>{{ $tt('tooltip.imageName') }}：</span>
        <span>{{ imageName }}</span>
      </div>
      <div class="item-message">
        <span>CPU：</span>
        <span>{{ cpu }}</span>
      </div>
      <div class="item-message">
        <span>{{ $tt('tooltip.memory') }}：</span>
        <span>{{ ram }}M</span>
      </div>
      <div class="item-message">
        <span>{{ $tt('tooltip.hardDisk') }}：</span>
        <span>{{ disk }}G</span>
      </div>
      <div class="item-message">
        <span>{{ $tt('tooltip.networkCardCount') }}：</span>
        <span>{{ netCardNum }}</span>
      </div>
      <div class="item-message">
        <div>{{ $tt('tooltip.networkConfig') }}：</div>
        <div v-for="(item, index) in network" :key="item.name + index">
          <span>{{ item.name }}：</span>
          <span>{{ item.ip ? item.ip : '--' }}</span>
        </div>
      </div>
      <div class="item-message">
        <div>Cloud-init：{{ init_support ? $tt('menu.drawer.open') : $tt('menu.drawer.close') }}</div>
      </div>
    </div>
    <!-- 终端节点/容器 -->
    <div v-else-if="nodeTooltipType === 'cserver'">
      <div class="item-message">
        <span>{{ $tt('tooltip.deviceType') }}：</span>
        <span>{{ deviceType }}</span>
      </div>
      <div class="item-message">
        <span>{{ $tt('tooltip.imageName') }}：</span>
        <span>{{ imageName }}</span>
      </div>
      <div class="item-message">
        <span>{{ $tt('tooltip.networkCardCount') }}：</span>
        <span>{{ netCardNum }}</span>
      </div>
      <div class="item-message">
        <div>{{ $tt('tooltip.networkConfig') }}：</div>
        <div v-for="(item, index) in network" :key="item.name + index">
          <span>{{ item.name }}：</span>
          <span>{{ item.ip ? item.ip : '--' }}</span>
        </div>
      </div>
    </div>
    <!-- 仿真节点 -->
    <div v-else-if="nodeTooltipType === 'npc'">
      <div class="item-message">
        <div>IP：</div>
        <div>{{ ipAddress }}</div>
      </div>
    </div>
    <!-- 实体设备 -->
    <div v-else-if="nodeTooltipType === 'entity'">
      <div class="item-message">
        <span>{{ $tt('tooltip.deviceType') }}：</span>
        <span>{{ deviceType }}</span>
      </div>
      <div class="item-message">
        <span
          >{{ $tt('tooltip.systemType') }}：{{
            (entityInfo.ext_system_info &&
              entityInfo.ext_system_info.system_type_name) ||
            '--'
          }}</span
        >
        <span></span>
      </div>
      <div class="item-message">
        <span
          >{{ $tt('tooltip.languageVersion') }}：{{
            (entityInfo.ext_system_info &&
              entityInfo.ext_system_info.language_name) ||
            '--'
          }}</span
        >
        <span></span>
      </div>
      <div class="item-message">
        <span
          >{{ $tt('tooltip.systemArchitecture') }}：{{
            (entityInfo.ext_system_info &&
              entityInfo.ext_system_info.system_architecture_name) ||
            '--'
          }}</span
        >
        <span></span>
      </div>
      <div class="item-message">
        <span
          >{{ $tt('tooltip.status') }}：{{
            entityInfo.in_position
              ? $tt('tooltip.in_position')
              : $tt('tooltip.not_in_position')
          }}</span
        >
        <span></span>
      </div>
    </div>
  </div>
</template>

<script>
import t, { i18n } from '../../../utils/i18n';
import {
  inject,
  onMounted,
  onUnmounted,
  watch,
  getCurrentInstance,
  provide,
  ref,
  nextTick,
} from '@vue/composition-api';
import getNodeCategory from '../../../types/get-node-category';
import _ from 'lodash';
export default {
  name: 'NodeTooltip',
  props: {
    nodeMessage: {
      type: Object,
      default: {},
    },
    imageName: {
      type: String,
      default: '',
    },
    entityInfo: {
      type: Object,
      default: () => ({}),
    },
  },
  components: {},
  setup(props) {
    onMounted(() => {});
    return {};
  },
  data() {
    return {
      CATEGORY: {
        1: this.$tt('menu.menu.operateSystem'),
        2: this.$tt('menu.menu.applicationSystem'),
        3: this.$tt('menu.menu.networkEquipment'),
        4: this.$tt('menu.menu.securityEquipment'),
      },
      deviceType: '',
      role: '',
      is_build_in: false,
      image_type: '',
      electrical: {},
      light: {},
      wan: {},
      lan: {},
      address: '',
      nodeTooltipType: '',
      cpu: '',
      ram: '',
      disk: '',
      network: [],
      portNumber: 0,
      netCardNum: 0,
      ipAddress: '',
      init_support: '',
    };
  },
  watch: {
    nodeMessage: {
      handler(value) {
        let category = _.get(value, 'basicConfig.category', '');
        this.deviceType = this.CATEGORY[category];
        this.electrical = _.get(value, 'basicConfig.electrical', {}) || {};
        this.light = _.get(value, 'basicConfig.light', {}) || {};
        this.wan = _.get(value, 'basicConfig.wan', {}) || {};
        this.lan = _.get(value, 'basicConfig.lan', {}) || {};
        this.address = _.get(value, 'networkConfig.address', '');
        this.role = _.get(value, 'basicConfig.role', '');
        this.image_type = _.get(value, 'basicConfig.image_type', '');
        this.is_build_in = _.get(value, 'basicConfig.is_build_in', '');
        this.cpu = _.get(value, 'basicConfig.cpu', '');
        this.ram = _.get(value, 'basicConfig.ram', '');
        this.disk = _.get(value, 'basicConfig.disk', '');
        const network = _.get(value, 'networkConfig.network', []) || [];
        this.network = network;
        this.ipAddress = network[0]?.ip ? network[0]?.ip : '--';
        this.portNumber = network.length;
        this.netCardNum = _.get(value, 'basicConfig.netCardNum', 0);
        this.init_support = _.get(value, 'basicConfig.init_support', '');
        // 根据节点类型，展示相应的节点提示框
        const { type, typeNumber } = getNodeCategory(
          this.role,
          this.image_type,
          this.is_build_in,
        );
        this.nodeTooltipType = type;
      },
    },
  },
  mounted() {},
  methods: {
    $tt: t,
    tooltipEnter() {
      this.$emit('tooltipEnter');
    },
    tooltipLeave() {
      this.$emit('tooltipLeave');
    },
  },
};
</script>

<style lang="scss" scoped>
#node-tooltip {
  display: none;
  position: absolute;
  z-index: 0;
  > div {
    width: 170px;
    max-height: 250px;
    font-size: 12px;
    background: var(--bg-color-2);
    color: var(--neutral8);
    padding: 8px;
    display: block;
    border: 1px solid var(--neutral3);
    overflow-y: auto;
  }
  .item-message {
    line-height: 18px;
  }
}
</style>
