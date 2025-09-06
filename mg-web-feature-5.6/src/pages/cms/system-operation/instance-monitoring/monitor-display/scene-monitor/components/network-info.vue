<template>
  <div class="nodeConOut">
    <div class="nodeCon">
      <div v-for="(item, index) in imgArr" :key="item">
        <!-- <NetworkInfoItem :imgUrl="item" :type="type[index]"></NetworkInfoItem> -->
        <StateDiagram
          :entityImg="item"
          :number="count[index]"
          :type="type[index]"
        />
      </div>
    </div>
  </div>
</template>

<script>
import StateDiagram from '../../components/state-diagram.vue';
// import NetworkInfoItem from './detail/network-info-item.vue';
import fire from '../../assets/img/icon_fire.png';
import flow from '../../assets/img/icon_flow.png';
import ip from '../../assets/img/icon_ip.png';
import network from '../../assets/img/icon_network.png';
import route from '../../assets/img/icon_route.png';
export default {
  props: {
    count: {
      type: Array,
      default() {
        return [];
      },
    },
  },
  data() {
    return {
      fire,
      flow,
      ip,
      network,
      route,
      type: [
        this.$t('systemOperation.monitorScene.network'),
        // this.$t('systemOperation.monitorScene.elasticIP'),
        this.$t('systemOperation.monitorScene.routing'),
        this.$t('systemOperation.monitorScene.firewallRules'),
        this.$t('systemOperation.monitorScene.flowTable'),
      ],
    };
  },
  computed: {
    imgArr() {
      return [this.network, this.route, this.fire, this.flow];
    },
  },
  components: {
    StateDiagram,
    // NetworkInfoItem,
  },
};
</script>

<style lang="scss" scoped>
.nodeConOut {
  height: calc(100% - 42px);
  display: flex;
  align-items: center;
  justify-content: center;
}
.nodeCon {
  height: 100%;
  width: 100%;
  display: grid;
  text-align: center;
  justify-content: space-around;
  grid-template-columns: repeat(auto-fill, 126px);
}
</style>
