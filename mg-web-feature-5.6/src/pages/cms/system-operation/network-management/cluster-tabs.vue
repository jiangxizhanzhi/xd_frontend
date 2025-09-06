<template>
  <cb-inner-page :background="false">
    <cb-tabs type="border-card" v-model="activeName">
      <cb-tab-pane
        :label="$t('systemOperation.views.clusterManagement.network.Network')"
        :name="tabNames.network"
      >
        <network-tab v-if="activeName === tabNames.network"></network-tab>
      </cb-tab-pane>
      <cb-tab-pane
        :label="$t('systemOperation.views.clusterManagement.route.Route')"
        :name="tabNames.route"
      >
        <route-tab v-if="activeName === tabNames.route"></route-tab>
      </cb-tab-pane>
      <!--      <cb-tab-pane-->
      <!--        :label="$t('systemOperation.views.clusterManagement.floatIp.FloatIp')"-->
      <!--        :name="tabNames.floatIp"-->
      <!--      >-->
      <!--        <float-ip-tab v-if="activeName === tabNames.floatIp"></float-ip-tab>-->
      <!--      </cb-tab-pane>-->
      <cb-tab-pane
        :label="$t('systemOperation.views.clusterManagement.firewall.Firewall')"
        :name="tabNames.firewall"
      >
        <firewall-tab v-if="activeName === tabNames.firewall"></firewall-tab>
      </cb-tab-pane>
      <cb-tab-pane
        :label="
          $t('systemOperation.views.clusterManagement.flowTable.FlowTable')
        "
        :name="tabNames.flowTable"
      >
        <flowtable-tab v-if="activeName === tabNames.flowTable"></flowtable-tab>
      </cb-tab-pane>
    </cb-tabs>
  </cb-inner-page>
</template>

<script>
import NetworkTab from './components/network-tab.vue';
import RouteTab from './components/route-tab.vue';
import FloatIpTab from './components/float-ip-tab.vue';
import FirewallTab from './components/firewall-tab.vue';
import FlowtableTab from './components/flowtable-tab.vue';

const tabNames = {
  vm: 'VM',
  container: 'container',
  network: 'network',
  route: 'route',
  floatIp: 'floatIp',
  firewall: 'firewall',
  flowTable: 'flowTable',
};
export default {
  components: {
    NetworkTab,
    RouteTab,
    FloatIpTab,
    FirewallTab,
    FlowtableTab,
  },
  data() {
    return {
      activeName: tabNames.network,
    };
  },

  computed: {
    tabNames() {
      return tabNames;
    },
  },
};
</script>
