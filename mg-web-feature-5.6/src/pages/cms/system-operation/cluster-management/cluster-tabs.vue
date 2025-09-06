<template>
  <cb-inner-page :background="false">
    <cb-tabs type="border-card" v-model="activeName">
      <cb-tab-pane
        :label="$t('systemOperation.views.clusterManagement.vm.VM')"
        :name="tabNames.vm"
      >
        <vm-tab v-if="activeName === tabNames.vm"></vm-tab>
      </cb-tab-pane>
      <cb-tab-pane
        :label="
          $t('systemOperation.views.clusterManagement.container.Container')
        "
        :name="tabNames.container"
      >
        <container-tab v-if="activeName === tabNames.container"></container-tab>
      </cb-tab-pane>
      <cb-tab-pane label="Dynamips" :name="tabNames.dynamips">
        <dynamips-tab v-if="activeName === tabNames.dynamips"></dynamips-tab>
      </cb-tab-pane>
      <!-- 暂时隐藏npc菜单 -->
      <!-- <cb-tab-pane
        :label="$t('systemOperation.views.clusterManagement.vpc.vpc')"
        :name="tabNames.vpc"
      >
        <npc-tab v-if="activeName === tabNames.vpc"></npc-tab>
      </cb-tab-pane> -->
    </cb-tabs>
  </cb-inner-page>
</template>

<script>
import VmTab from './components/vm-tab.vue';
import ContainerTab from './components/container-tab.vue';
import NpcTab from './components/npc-tab.vue';
import DynamipsTab from './components/dynamips-tab.vue';

const tabNames = {
  vm: 'VM',
  container: 'container',
  vpc: 'vpc',
  dynamips: 'dynamips',
};
export default {
  components: {
    VmTab,
    ContainerTab,
    NpcTab,
    DynamipsTab,
  },
  data() {
    return {
      activeName: tabNames.vm,
    };
  },

  computed: {
    tabNames() {
      return tabNames;
    },
  },
};
</script>
