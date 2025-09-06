<template>
  <div class="traffic-analysis cy-common-theme__dark">
    <div class="traffic-analysis-top">
      <div class="traffic-left">
        <div class="traffic-left-one traffic-small-box">
          <frosted-block>
            <monitor-title
              :name="this.$t('systemOperation.trafficAnalysis.realTraffic')"
            ></monitor-title>
            <regular-traffic :listData="regularTraffic"></regular-traffic>
          </frosted-block>
        </div>
        <div class="traffic-left-two traffic-big-box">
          <frosted-block>
            <monitor-title
              :name="this.$t('systemOperation.trafficAnalysis.attackEventType')"
            ></monitor-title>
            <traffic-nightingale
              :pieData="attackEventType"
            ></traffic-nightingale>
          </frosted-block>
        </div>
        <div class="traffic-left-three traffic-big-box">
          <frosted-block>
            <monitor-title
              :name="this.$t('systemOperation.trafficAnalysis.attackEventList')"
            >
            </monitor-title>
            <attack-event-list
              :listData="listData"
              @getNewData="getTrafficEvent"
            >
            </attack-event-list>
          </frosted-block>
        </div>
      </div>
      <div class="traffic-center">
        <NetworkInfo :count="networkCount"></NetworkInfo>
        <div class="topCard">
          <frosted-block border>
            <scene-editor
              v-if="visible"
              ref="sceneEditor"
              :sceneConfig="sceneConfig"
              :topologyData="sceneData"
              :status="'display'"
              :showTitle="false"
              :showLabel="false"
              :showAccessDialog="false"
              @onAccess="goIframe"
            ></scene-editor
          ></frosted-block>
        </div>
        <node-info :node-pic="nodeInfo" flag="traffic" />
      </div>
      <div class="traffic-right">
        <div class="traffic-right-one traffic-small-box">
          <frosted-block>
            <monitor-title
              :name="
                this.$t('systemOperation.trafficAnalysis.attackEventTotal')
              "
            >
            </monitor-title>
            <attack-event-count
              :trafficLevelCount="trafficLevelCount"
            ></attack-event-count>
          </frosted-block>
        </div>
        <div class="traffic-right-two traffic-big-box">
          <frosted-block>
            <monitor-title
              :name="this.$t('systemOperation.trafficAnalysis.attackNodesTop5')"
            ></monitor-title>
            <attack-node :barData="attackNode"></attack-node>
          </frosted-block>
        </div>
        <div class="traffic-right-three traffic-big-box">
          <frosted-block>
            <monitor-title
              :name="
                this.$t('systemOperation.trafficAnalysis.byAttackNodesTop5')
              "
            ></monitor-title>
            <by-attack-node :barData="deAttackNode"></by-attack-node>
          </frosted-block>
        </div>
      </div>
    </div>
    <div class="traffic-analysis-foot">
      <frosted-block ref="searchTable">
        <div class="table-container" ref="searchTableRef">
          <traffic-search-table
            :sceneId="sceneId"
            :scroll-y="scrollY"
            @processHandle="processHandle"
          ></traffic-search-table>
        </div>
      </frosted-block>
    </div>
    <file-process :percentage="process" :isShowProgress="showProgress">
    </file-process>
  </div>
</template>

<script>
import FrostedBlock from '../components/frosted-block.vue';
import MonitorTitle from '../components/monitor-title.vue';
import AttackEventList from './components/attack-event-list.vue';
import AttackEventCount from './components/attack-event-count.vue';
import RegularTraffic from './components/regular-traffic.vue';
import AttackNode from './components/attack-node.vue';
import ByAttackNode from './components/by-attack-node.vue';
import TrafficNightingale from './components/traffic-nightingale.vue';
import TrafficSearchTable from './components/traffic-search-table.vue';
import NetworkInfo from './components/network-info.vue';
import NodeInfo from '../components/node-info.vue';
import totalFlow from '../assets/img/icon_totalFlow.png';
import attackFlow from '../assets/img/icon_attackFlow.png';
import netConn from '../assets/img/icon_netwConn.png';
import broadband from '../assets/img/icon_Broadband.png';
import attackEvent from '../assets/img/icon_attackEvent.png';
import { getSceneInfo } from '@/api/monitor';
import { getSceneData } from '@/api/monitor';
import { SceneEditor } from '@cyber/scene';
import FileProcess from '@/components/file-generate-progress';

export default {
  components: {
    MonitorTitle,
    AttackEventList,
    FrostedBlock,
    AttackEventCount,
    RegularTraffic,
    AttackNode,
    ByAttackNode,
    TrafficNightingale,
    TrafficSearchTable,
    NetworkInfo,
    NodeInfo,
    SceneEditor,
    FileProcess,
  },
  data() {
    return {
      process: 0, //文件生成进度数据
      showProgress: false, //文件生成进度条是否显示
      // 场景配置
      sceneConfig: {
        showMenu: false,
        menubar: [],
        toolbar: ['restore'],
        showToolbar: true,
      },
      sceneData: {}, // 场景数据
      networkCount: [],
      scrollY: 0,
      listData: [],
      regularTraffic: [], // 左上角实时流量
      trafficLevelCount: {}, // 攻击事件 各级别值
      attackEventType: [], //攻击事件类型
      attackNode: {
        xData: [],
        yData: [],
      }, //攻击节点top5
      deAttackNode: {
        xData: [],
        yData: [],
      }, //被攻击节点top5
      nodeInfo: [],
      timer: null,
      visible: true,
    };
  },
  created() {
    this.sceneId = this.$route.params && this.$route.params.id;
    this.getTrafficEvent();
    this.comFunc();
    this.getTrafficEventType();
    this.getSceneInfo();
    this.getTrafficTypesCount();
  },
  mounted() {
    this.$refs.sceneEditor.setTheme('dark');
    this.timer = setInterval(() => {
      this.comFunc();
    }, 30000);
    this.scrollY = this.$refs.searchTableRef.offsetHeight - 52 - 60 - 45; // -搜索条 - 分页 -表头;
    this.getSceneData();
    document.addEventListener('visibilitychange', this.handle);
  },
  beforeDestroy() {
    clearInterval(this.timer);
    document.removeEventListener('visibilitychange', this.handle);
  },
  methods: {
    handle() {
      this.visible = document.visibilityState === 'visible';
      if (document.visibilityState === 'visible') {
        this.$nextTick(() => {
          this.$refs.sceneEditor.setTheme('dark');
        });
      }
    },
    processHandle(process, url) {
      if (process >= 0 && process < 100) {
        this.showProgress = true;
        this.process = process;
      } else if (process == 100) {
        this.showProgress = false;
        this.process = 0;
        if (url) {
          window.top.open(url, '_blank');
        }
      } else {
        this.showProgress = false;
        this.process = 0;
      }
    },
    comFunc() {
      this.getTrafficLevel();
      this.getTrafficAttackNode(0);
      this.getTrafficAttackNode(1);
      this.getTrafficEventType();
      this.getTrafficEvent();
      this.getRegularTraffic();
    },
    // 获取场景信息
    getSceneData() {
      const query = {
        id: this.sceneId,
      };
      getSceneData(query).then((res) => {
        const data = _.get(res, 'data.data');
        this.sceneData = {
          ...data,
          scene_config: data.scene,
        };
      });
    },
    goIframe(val) {
      window.open(val, '_blank');
    },
    getTrafficEvent() {
      this.$request
        .get(
          'cscene/monitor/flow/page',
          {
            id: this.sceneId,
            page: 1,
            per_page: 100,
          },
          { baseURL: '/api/mp' },
        )
        .then((res) => {
          const data = _.get(res, 'data.data.list', []);
          this.listData = [];
          this.$nextTick(() => {
            _.forEach(data, (item) => {
              if (item.time) {
                this.$set(item, 'time', item.time.slice(5));
              }
            });
            this.listData = data;
          });
        });
    },
    // 获取左上角实时流量
    getRegularTraffic() {
      this.$request
        .get(
          'cscene/monitor/flow/scene_trend',
          {
            sceneId: this.sceneId,
          },
          { baseURL: '/api/mp' },
        )
        .then((res) => {
          const data = _.get(res, 'data.data', []);
          this.regularTraffic = data;
        });
    },
    // 获取 流量风险 各级别值
    getTrafficLevel() {
      this.$request
        .get(
          '/cscene/monitor/flow/risk_count',
          {
            sceneId: this.sceneId,
          },
          { baseURL: '/api/mp' },
        )
        .then((res) => {
          const data = _.get(res, 'data.data', {});
          this.trafficLevelCount = data;
        });
    },
    // 攻击事件类型
    getTrafficEventType() {
      this.$request
        .get(
          '/cscene/monitor/flow/attack_type_count',
          {
            sceneId: this.sceneId,
          },
          { baseURL: '/api/mp' },
        )
        .then((res) => {
          const data = _.get(res, 'data.data', []);
          const count = data.reduce((prev, item) => {
            return prev + item.times;
          }, 0);

          this.attackEventType = data.map((item) => {
            return {
              value: ((item.times / count) * 100).toFixed(2),
              name: item.attack_type,
            };
          });
        });
    },
    //攻击点击top5和被攻击节点top5 （ipType=0是攻击，ipType=1是被攻击）
    getTrafficAttackNode(type) {
      this.$request
        .get(
          '/cscene/monitor/flow/attack_ip_count',
          {
            sceneId: this.sceneId,
            ipType: type,
            topSize: 5,
          },
          { baseURL: '/api/mp' },
        )
        .then((res) => {
          const data = _.get(res, 'data.data', []);
          if (type == 0) {
            this.arrageAttackNode(data, this.attackNode);
          } else {
            this.arrageAttackNode(data, this.deAttackNode);
          }
        });
    },
    arrageAttackNode(data, arrNode) {
      arrNode.xData = [];
      arrNode.yData = [];
      const count = data.reduce((prev, item) => {
        return prev + item.times;
      }, 0);
      data.forEach((item) => {
        arrNode.xData.push(item.node_name);
        arrNode.yData.push(((item.times / count) * 100).toFixed(2));
      });
    },
    // 查询节点基本信息（运行节点统计）
    getSceneInfo() {
      getSceneInfo(this.sceneId).then((res) => {
        const switch_count = _.get(res, 'data.data.switch_count', 0);
        const elastic_ip_count = _.get(res, 'data.data.elastic_ip_count', 0);
        const router_count = _.get(res, 'data.data.router_count', 0);
        const firewall_count = _.get(res, 'data.data.firewall_count', 0);
        const flow_table_count = _.get(res, 'data.data.flow_table_count', 0);
        this.networkCount = [
          switch_count,
          // elastic_ip_count,
          router_count,
          firewall_count,
          flow_table_count,
        ];
      });
    },
    // 中间，总流量，攻击流量，网络连接等
    getTrafficTypesCount() {
      const nodeInfo = [
        {
          name: this.$t('systemOperation.trafficAnalysis.TotalFlow'),
          value: 0,
          icon: totalFlow,
        },
        {
          name: this.$t('systemOperation.trafficAnalysis.attackTraffic'),
          value: 0,
          icon: attackFlow,
        },
        {
          name: this.$t('systemOperation.trafficAnalysis.InternetConnect'),
          value: 0,
          icon: netConn,
        },
        {
          name: this.$t('systemOperation.trafficAnalysis.broadbandOccu'),
          value: 0,
          icon: broadband,
        },
        {
          name: this.$t('systemOperation.trafficAnalysis.attackEvent'),
          value: 0,
          icon: attackEvent,
        },
      ];
      this.$request
        .get(
          '/cscene/monitor/flow/summary',
          {
            sceneId: this.sceneId,
          },
          { baseURL: '/api/mp' },
        )
        .then((res) => {
          nodeInfo[0].value = _.get(res, 'data.data.total_flow_size', 0);
          nodeInfo[1].value = _.get(res, 'data.data.total_attack_flow_size', 0);
          nodeInfo[2].value = _.get(res, 'data.data.net_conn_size', 0);
          nodeInfo[3].value = _.get(res, 'data.data.bandwith', 0);
          nodeInfo[4].value = _.get(res, 'data.data.attack_count', 0);
          this.nodeInfo = _.cloneDeep(nodeInfo);
        });
    },
  },
  watch: {},
};
</script>

<style scoped lang="scss">
.traffic-analysis {
  width: 100%;
  height: 99%;

  display: flex;
  flex-flow: column;
  justify-content: space-between;
  .traffic-analysis-top {
    height: 68.5%;
    display: flex;
    justify-content: space-between;
    .traffic-small-box {
      height: 26%;
    }
    .traffic-big-box {
      height: 35%;
    }
    .traffic-left,
    .traffic-right {
      width: 28%;
      display: flex;
      flex-flow: column;
      justify-content: space-between;
    }
    .traffic-center {
      width: 42.5%;
      position: relative;
      .topCard {
        height: calc(100% - 180px);
        position: absolute;
        top: 70px;
        right: 0;
        left: 0;
      }
    }
  }
  .traffic-analysis-foot {
    height: 30%;
    width: 100%;
    .table-container {
      padding: 0.5% 0.5% 0;
      height: 100%;
      width: 100%;
      box-sizing: border-box;
      ::v-deep .ant-table-pagination {
        margin: 10px 0 0;
      }
    }
  }
}
</style>
