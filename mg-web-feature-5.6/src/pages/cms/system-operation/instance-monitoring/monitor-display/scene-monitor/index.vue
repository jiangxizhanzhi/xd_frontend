<template>
  <!-- 场景监控 -->
  <div class="sceneOuteContainer">
    <div class="sceneContainer">
      <!-- 左侧 -->
      <div class="sceneLeft">
        <div class="item top">
          <frosted-block>
            <monitor-title
              :name="$t('systemOperation.monitorScene.runNodeStatistic')"
            />
            <node-info :node-pic="nodeInfo" />
          </frosted-block>
        </div>
        <div class="item middle">
          <frosted-block>
            <monitor-title
              :name="$t('systemOperation.monitorScene.collectEventStatistics')"
            />
            <collection-event-statistic
              :bar-data="rateData"
              :two-data="pieData"
            ></collection-event-statistic>
          </frosted-block>
        </div>
        <div class="item bottom">
          <frosted-block>
            <monitor-title
              :name="$t('systemOperation.monitorScene.collectEvent')"
              :number="hostNumber"
            />
            <scroll-table
              class="collection-scroll"
              :data="hostListData"
              :cols="colsCollection"
              :limitNum="6"
              @scrollEndEvent="getInstanceHost"
            />
          </frosted-block>
        </div>
      </div>
      <!-- 中间 -->
      <div class="sceneCenter">
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
              @on-display-click="nodeClick"
            ></scene-editor>
          </frosted-block>
        </div>
        <div class="bottomStatistics">
          <frosted-block>
            <monitor-title
              :name="$t('systemOperation.monitorScene.resourceUsage')"
            />
            <device-detail-info
              :xData="xData"
              :lineData="lineData"
              :host-data="hostData"
            ></device-detail-info>
          </frosted-block>
        </div>
      </div>
      <!-- 右侧 -->
      <div class="sceneRight">
        <div class="item top">
          <frosted-block>
            <monitor-title
              :name="$t('systemOperation.monitorScene.SceneNetworkInfo')"
            />
            <NetworkInfo :count="networkCount"></NetworkInfo>
          </frosted-block>
        </div>
        <div class="item middle">
          <frosted-block>
            <monitor-title
              :name="$t('systemOperation.monitorScene.trafficStatistics')"
            />
            <traffic-statistic
              :risk-data="riskData"
              :lineData="flowLineData"
            ></traffic-statistic>
          </frosted-block>
        </div>
        <div class="item bottom">
          <frosted-block>
            <monitor-title
              :name="$t('systemOperation.monitorScene.trafficEvent')"
              :number="flowNumber"
            />
            <scroll-table
              class="collection-scroll"
              :data="listDataCollection"
              :cols="colsTraffic"
              :limitNum="6"
              @scrollEndEvent="getInstanceFlow"
            >
              <template v-slot:type="scope">
                <span>{{ scope.data.attack_info.attack_type }}</span>
              </template>
              <template v-slot:level="scope">
                <span :class="getLevel(scope.data.attack_info)">
                  {{ getLevelLabel(scope.data) }}
                </span>
              </template>
            </scroll-table>
          </frosted-block>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import FrostedBlock from '../components/frosted-block.vue';
import DeviceDetailInfo from './components/device-detail-info.vue';
import NetworkInfo from './components/network-info.vue';
import MonitorTitle from '../components/monitor-title.vue';
import TrafficStatistic from './components/traffic-statistic.vue';
import ScrollTable from '../components/scroll-table.vue';
import CollectionEventStatistic from './components/collection-event-statistic.vue';
import NodeInfo from '../components/node-info.vue';
import contain from '../assets/img/icon_ontain.png';
import device from '../assets/img/icon-device.png';
import viturl from '../assets/img/icon-viturl.png';
import { SceneEditor } from '@cyber/scene';
import {
  getSceneInfo,
  getAggrTop,
  getAggr,
  getHost,
  getFlow,
  getFlowRisk,
  getSceneData,
  getFlowTrend,
  getSceneTrend,
  getSceneStates,
} from '@/api/monitor';
import _ from 'lodash';
export default {
  components: {
    FrostedBlock,
    NodeInfo,
    DeviceDetailInfo,
    NetworkInfo,
    MonitorTitle,
    TrafficStatistic,
    ScrollTable,
    CollectionEventStatistic,
    SceneEditor,
  },
  props: {
    nodeId: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      sceneId: '',
      networkCount: [],
      rateData: {},
      pieData: {},
      // 场景配置
      sceneConfig: {
        showMenu: false,
        menubar: [],
        toolbar: ['restore'],
        showToolbar: true,
      },
      sceneData: {}, // 场景数据
      hostData: [],
      xData: [],
      lineData: [],
      nodeInfo: [
        {
          name: this.$t('systemOperation.monitorScene.virtual'),
          value: 0,
          key: 'virtual_machine_count',
          icon: contain,
        },
        {
          name: this.$t('systemOperation.monitorScene.container'),
          value: 0,
          key: 'container_count',
          icon: device,
        },
        {
          name: this.$t('systemOperation.monitorScene.physicalEquipment'),
          value: 0,
          key: 'entity_count',
          icon: viturl,
        },
      ],
      hostListData: [],
      hostNumber: 0,
      riskData: {},
      flowLineData: {},
      listDataCollection: [],
      flowNumber: 0,
      colsCollection: [
        {
          label: this.$t('systemOperation.monitorScene.hosts'),
          prop: 'node_name',
        },
        {
          label: this.$t('systemOperation.monitorScene.eventType'),
          prop: 'type',
        },
        {
          label: this.$t('systemOperation.monitorScene.eventDesc'),
          prop: 'description',
        },
        {
          label: this.$t('systemOperation.monitorScene.times'),
          prop: 'time',
        },
      ],
      colsTraffic: [
        {
          label: this.$t('systemOperation.monitorScene.sourceHost'),
          prop: 'source_node_name',
        },
        {
          label: this.$t('systemOperation.monitorScene.destinationHost'),
          prop: 'target_node_name',
        },
        {
          label: this.$t('systemOperation.monitorScene.types'),
          slot: 'type',
        },
        {
          label: this.$t('systemOperation.monitorScene.alarmLevel'),
          class: 'level',
          slot: 'level',
        },
        {
          label: this.$t('systemOperation.monitorScene.times'),
          prop: 'time',
        },
      ],
      timer: null,
      visible: true,
      demoList: [
        {
          node_name: 1,
        },
        {
          node_name: 2,
        },
        {
          node_name: 3,
        },
        {
          node_name: 4,
        },
        {
          node_name: 5,
        },
        {
          node_name: 6,
        },
        {
          node_name: 7,
        },
        {
          node_name: 8,
        },
        {
          node_name: 9,
        },
        {
          node_name: 10,
        },
      ],
    };
  },
  mounted() {
    this.$refs.sceneEditor.setTheme('dark');
    this.sceneId = this.$route.params.id;
    this.comFunc();
    this.timer = setInterval(() => {
      this.comFunc();
    }, 30000);
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
    comFunc() {
      this.getSceneInfo();
      this.getDataRate();
      this.getPieData();
      this.getInstanceHost();
      this.getSceneData();
      this.getSceneTrendData();
      this.getSceneStatesData();
      this.getFlowRiskCount();
      this.getFlowTrendData();
      this.getInstanceFlow();
    },
    nodeClick(val) {
      if (val.role === 4) {
        this.$emit('update:nodeId', val.id);
        this.$emit('goNode');
      }
    },
    // 查询节点基本信息（运行节点统计和场景网络信息）
    getSceneInfo() {
      getSceneInfo(this.sceneId).then((res) => {
        const data = _.get(res, 'data.data', []);
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
        Object.keys(data).map((key) => {
          this.nodeInfo.map((item) => {
            if (item.key === key) {
              item.value = data[key];
            }
          });
        });
      });
    },
    // 采集事件统计
    getDataRate() {
      const query = { sceneId: this.sceneId };
      getAggrTop(query).then((res) => {
        const data = _.get(res, 'data.data');
        const reverseData = data.reverse();
        const xData = [];
        const yData = [];
        reverseData.map((item) => {
          xData.push(item.element_name);
          yData.push(item.percent);
        });
        this.rateData = {
          xData,
          yData,
        };
      });
    },
    getPieData() {
      const query = { sceneId: this.sceneId };
      getAggr(query).then((res) => {
        const data = _.get(res, 'data.data');
        this.pieData = data;
      });
    },
    // 采集事件table
    getInstanceHost() {
      const query = {
        id: this.sceneId,
        page: 1,
        per_page: 100,
      };
      getHost(query).then((res) => {
        const data = _.get(res, 'data.data.list');
        const total = _.get(res, 'data.data.total');
        this.hostListData = [];
        this.$nextTick(() => {
          this.hostListData = data;
        });
        this.hostNumber = total;
      });
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
    // 获取资源使用情况
    getSceneTrendData() {
      const query = {
        sceneId: this.sceneId,
      };
      getSceneTrend(query).then((res) => {
        const data = _.get(res, 'data.data', []);
        const xData = [];
        const cpuData = [];
        const diskData = [];
        const memoryData = [];
        data.map((item) => {
          xData.push(item.time);
          cpuData.push(item.cpu_percent);
          diskData.push(item.disk_percent);
          memoryData.push(item.memory_percent);
        });
        this.xData = xData;
        this.lineData = [cpuData, diskData, memoryData];
      });
    },
    getSceneStatesData() {
      getSceneStates(this.sceneId).then((res) => {
        const data = _.get(res, 'data.data', []);
        this.hostData = [];
        this.$nextTick(() => {
          this.hostData = data;
        });
      });
    },
    // 风险级别统计
    getFlowRiskCount() {
      const query = {
        sceneId: this.sceneId,
      };
      getFlowRisk(query).then((res) => {
        const data = _.get(res, 'data.data');
        this.riskData = data;
      });
    },
    getFlowTrendData() {
      const query = {
        sceneId: this.sceneId,
      };
      getFlowTrend(query).then((res) => {
        const data = _.get(res, 'data.data');
        const xData = [];
        const yData = [];
        data.map((item) => {
          xData.push(item.time);
          yData.push(item.data_size);
        });
        this.flowLineData = {
          xData,
          yData,
        };
      });
    },

    // 流量事件table
    getInstanceFlow() {
      const query = {
        id: this.sceneId,
        page: 1,
        per_page: 100,
      };
      getFlow(query).then((res) => {
        const data = _.get(res, 'data.data.list');
        const total = _.get(res, 'data.data.total');
        this.listDataCollection = [];
        this.$nextTick(() => {
          this.listDataCollection = data;
        });
        this.flowNumber = total;
      });
    },
    getLevel(row) {
      const classObj = {};
      if (row.severity === 1) {
        classObj.high = true;
      } else if (row.severity === 2) {
        classObj.middle = true;
      } else if (row.severity === 4 || row.severity === 3) {
        classObj.low = true;
      }
      return classObj;
    },
    getLevelLabel(row) {
      let levelLabel = '';
      if (row.attack_info && row.attack_info.severity === 1) {
        levelLabel = this.$t('systemOperation.nodeMonitoring.high');
      } else if (row.attack_info && row.attack_info.severity === 2) {
        levelLabel = this.$t('systemOperation.nodeMonitoring.middle');
      } else if (
        (row.attack_info && row.attack_info.severity === 4) ||
        (row.attack_info && row.attack_info.severity === 3)
      ) {
        levelLabel = this.$t('systemOperation.nodeMonitoring.low');
      }
      return levelLabel;
    },
  },
};
</script>

<style lang="scss" scoped>
.high {
  color: rgba(253, 58, 44, 1);
}
.middle {
  color: rgba(253, 118, 44, 1);
}
.low {
  color: rgba(57, 255, 178, 1);
}
.sceneOuteContainer {
  width: 100%;
  height: 100%;
  overflow-y: auto;
  box-sizing: border-box;
  color: #fff;
}
.sceneContainer {
  width: 100%;
  height: calc(100% - 10px);
  display: flex;
  box-sizing: border-box;
  justify-content: space-between;
  .sceneLeft {
    .top {
      height: 18%;
    }
    .middle {
      height: 41%;
    }
  }
  .sceneRight {
    .top {
      height: 22%;
    }
    .middle {
      height: 38%;
    }
  }
  .sceneLeft,
  .sceneRight {
    display: flex;
    width: 26%;
    height: 100%;
    flex-wrap: wrap;
    justify-content: center;
    align-content: space-between;
    .item {
      width: 100%;
    }
    .bottom {
      height: 37%;
      .collection-scroll {
        height: calc(100% - 32px);
        padding-top: 10px;
      }
    }
  }
  .sceneCenter {
    width: 46.5%;
    height: 100%;
    display: flex;
    align-content: space-between;
    flex-wrap: wrap;
    .topCard {
      width: 100%;
      height: 58%;
    }
    .bottomStatistics {
      width: 100%;
      height: 40%;
    }
  }
}
</style>
