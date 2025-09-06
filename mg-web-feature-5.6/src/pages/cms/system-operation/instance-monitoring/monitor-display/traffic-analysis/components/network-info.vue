<template>
  <div class="nodeConOut">
    <div class="nodeCon">
      <div v-for="(item, index) in imgArr" :key="item">
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
  },
};
</script>

<style lang="scss" scoped>
.nodeConOut {
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  width: 100%;
}
.nodeCon {
  height: 100%;
  width: 100%;
  display: flex;
  text-align: center;
  justify-content: space-around;
}
</style>
