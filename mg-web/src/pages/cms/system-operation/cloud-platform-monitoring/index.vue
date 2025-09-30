<template>
  <cb-inner-page :background="true" title="资源编排">
    <!-- 资源统计 -->
    <div class="wrapper">
      <Block :title="$t('systemOperation.cloudPlatform.resourceStatistics')">
        <resource-statistics />
      </Block>
    </div>
    <!-- 资源编排 -->
    <div class="wrapper">
      <Block :title="$t('systemOperation.systemAlarm.deviceMonitor')">
        <device-monitor />
      </Block>
    </div>
    <!-- 节点管理 -->
    <div class="wrapper">
      <Block :title="$t('systemOperation.cloudPlatform.onlyVMTitle')">
        <slot slot="little-title">
          {{ $t('systemOperation.cloudPlatform.onlyVm') }}
        </slot>
        <node-management />
      </Block>
    </div>
    <!-- 服务状态监控 -->
    <div class="wrapper">
      <Block
        :title="$t('systemOperation.cloudPlatform.serviceStatusMonitoring')"
      >
        <service-status-monitoring />
      </Block>
    </div>
    <!-- 虚实结合交换机状态 -->
    <div class="wrapper">
      <Block :title="$t('systemOperation.cloudPlatform.switchStatus')">
        <switch-status />
      </Block>
    </div>
  </cb-inner-page>
</template>

<script>
import Block from '@/components/block';
import ResourceStatistics from './components/resource-statistics.vue';
import NodeManagement from './components/node-management.vue';
import ServiceStatusMonitoring from './components/service-status-monitoring.vue';
import SwitchStatus from './components/switch-status.vue';
import DeviceMonitor from '../system-alarm/components/device-monitor.vue';
export default {
  components: {
    Block,
    ResourceStatistics,
    NodeManagement,
    ServiceStatusMonitoring,
    SwitchStatus,
    DeviceMonitor,
  },
};
</script>

<style lang="scss" scoped>
.wrapper {
  padding: 15px 20px;
  margin: 0px 16px 16px -8px;
  background: var(--bg-color-2);
}
</style>
