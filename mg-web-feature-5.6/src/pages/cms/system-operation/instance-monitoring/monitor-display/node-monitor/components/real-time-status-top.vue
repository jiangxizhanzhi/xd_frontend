<template>
  <div class="real-status-top">
    <StateDiagram
      v-for="(item, index) in dataList"
      :key="index"
      :entityImg="item.img"
      :number="item.number"
      :type="item.name"
    />
    <div class="width33"></div>
  </div>
</template>
<script>
import StateDiagram from '../../components/state-diagram.vue';
import iconFlow from '../../assets/img/icon_flow.png';
import iconNetWork from '../../assets/img/icon_network.png';
import iconPort from '../../assets/img/icon-port.png';
import iconFile from '../../assets/img/icon-file.png';
import iconUser from '../../assets/img/icon-user.png';
import iconRejestTable from '../../assets/img/icon-rejesttable.png';
import iconEnvironment from '../../assets/img/icon-environment.png';
export default {
  props: {
    realStatus: {
      type: Object,
      default: () => {},
    },
  },
  components: {
    StateDiagram,
  },

  name: 'realStatusTop',

  data() {
    return {
      dataList: [
        {
          key: 'process_count',
          number: 0,
          img: iconFlow,
          name: this.$t('systemOperation.nodeMonitoring.process'),
        },

        {
          key: 'user_count',
          number: 0,
          img: iconUser,
          name: this.$t('systemOperation.nodeMonitoring.user'),
        },

        {
          key: 'ports_count',
          number: 0,
          img: iconPort,
          name: this.$t('systemOperation.nodeMonitoring.port'),
        },

        {
          key: 'connection_count',
          number: 0,
          img: iconNetWork,
          name: this.$t('systemOperation.nodeMonitoring.networkConnection'),
        },

        {
          key: 'file_op_count',
          number: 0,
          img: iconFile,
          name: this.$t('systemOperation.nodeMonitoring.fileOperations'),
        },

        {
          key: 'registry_op_count',
          number: 0,
          img: iconRejestTable,
          name: this.$t(
            'systemOperation.nodeMonitoring.registrationFormOperation',
          ),
        },

        {
          key: 'env_op_count',
          number: 0,
          img: iconEnvironment,
          name: this.$t(
            'systemOperation.nodeMonitoring.environmentVarManipulation',
          ),
        },
      ],
      iconFlow,
      iconNetWork,
      iconPort,
      iconFile,
      iconUser,
      iconRejestTable,
      iconEnvironment,
    };
  },
  watch: {
    realStatus: {
      handler(nv, ov) {
        if (!_.isEmpty(nv)) {
          _.forEach(this.dataList, (item) => {
            for (let i in nv) {
              if (item.key === i) {
                this.$set(item, 'number', nv[i]);
              }
            }
          });
        }
      },
      immediate: true,
      deep: true,
    },
  },
};
</script>
<style scoped lang="scss" scoped>
.real-status-top {
  width: 100%;
  height: 80%;
  display: grid;
  text-align: center;
  justify-content: space-around;
  grid-template-columns: repeat(auto-fill, 126px);
}
</style>
