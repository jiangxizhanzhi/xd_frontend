<template>
  <div class="node-monitor cy-common-theme__dark">
    <div class="node-monitor-cotent-left">
      <div class="node-monitor-wrap small-box monitoring">
        <!-- 监控 -->
        <frosted-block>
          <cb-button
            type="text"
            icon="icon-shuaxinzhongqihuifu"
            :disabled="elementId ? false : true"
            @click="handleMonitorModal"
            >{{ $t('systemOperation.nodeMonitoring.seePlayback') }}</cb-button
          >
          <div class="player">
            <div v-if="monitoringUrl" style="width: 100%; height: 100%">
              <cb-player
                :url="monitoringUrl"
                :config="playerConfig"
                ref="monitorPlayerRef1"
              ></cb-player>
            </div>
          </div>
        </frosted-block>
      </div>
      <div class="node-monitor-wrap middle-box get-event-type">
        <frosted-block>
          <!-- 采集事件分类 -->
          <monitor-title
            :name="$t('systemOperation.nodeMonitoring.collectionEventType')"
          ></monitor-title>
          <get-event-type :eventTypeList="eventTypeList"></get-event-type>
        </frosted-block>
      </div>

      <div class="node-monitor-wrap big-box get-event">
        <frosted-block>
          <!-- 采集事件 -->
          <monitor-title
            :name="$t('systemOperation.nodeMonitoring.gatheringEvent')"
            :list="gatherEventList"
            :number="gatherEventCount"
          ></monitor-title>
          <get-event
            :list="gatherEventList"
            @getNewData="getGatherEvent"
          ></get-event>
        </frosted-block>
      </div>
    </div>
    <div class="node-monitor-cotent-center">
      <div class="node-monitor-wrap small-box basic-message-boxs">
        <frosted-block>
          <!-- 节点基本信息 -->
          <monitor-title
            :name="$t('systemOperation.nodeMonitoring.basicNodeInformation')"
          ></monitor-title>
          <div class="set-node">
            <cb-button type="text" icon="icon-shezhi" @click="setNode">
              {{ $t('systemOperation.nodeMonitoring.setTheNode') }}
            </cb-button>
          </div>
          <div class="node-monitor-div">
            <basic-message :currentNode="currentNode"> </basic-message>
          </div>
        </frosted-block>
      </div>
      <div class="node-monitor-wrap middle-box">
        <frosted-block>
          <!-- 节点资源 -->
          <monitor-title
            :name="$t('systemOperation.nodeMonitoring.nodeResources')"
          ></monitor-title>
          <div class="node-monitor-div">
            <node-resource
              :currentNode="currentNode"
              :nodeRosourceTrend="nodeRosourceTrend"
            ></node-resource>
          </div>
        </frosted-block>
      </div>
      <div class="node-monitor-wrap big-box">
        <frosted-block>
          <!-- 实时状态 -->
          <monitor-title
            :name="$t('systemOperation.nodeMonitoring.realTimeStatus')"
          ></monitor-title>
          <div class="real-time-status-div">
            <real-status
              :realProgressList="realProgressList"
              :realHostList="realHostList"
              :realConnectionList="realConnectionList"
            ></real-status>
          </div>
        </frosted-block>
      </div>
    </div>
    <div class="node-monitor-cotent-right">
      <div class="node-monitor-wrap small-box">
        <frosted-block>
          <monitor-title
            :name="$t('systemOperation.nodeMonitoring.realTimeStatus')"
          ></monitor-title>
          <!-- 实时状态 右上角 -->
          <real-status-top :realStatus="realStatus"></real-status-top>
        </frosted-block>
      </div>
      <div class="node-monitor-wrap middle-box">
        <frosted-block>
          <!-- 流量统计 -->
          <monitor-title
            :name="$t('systemOperation.nodeMonitoring.trafficTotal')"
          ></monitor-title>
          <get-traffic
            :trafficLevelCount="trafficLevelCount"
            :nodeTrafficTrend="nodeTrafficTrend"
          ></get-traffic>
        </frosted-block>
      </div>
      <div class="node-monitor-wrap big-box">
        <frosted-block>
          <!-- 流量事件 -->
          <monitor-title
            :name="$t('systemOperation.nodeMonitoring.trafficEvent')"
            :number="trafficEventCount"
          ></monitor-title>
          <div class="real-time-status-div">
            <traffic-event
              :list="trafficEventList"
              @getNewData="getTrafficEvent"
            ></traffic-event>
          </div>
        </frosted-block>
      </div>
    </div>
    <!-- 回放弹窗 -->
    <cb-dialog
      :visible="monitoringModal"
      :before-close="handleMonitorCloseModal"
    >
      <template slot="title">
        <div>
          <span>{{ currentNode.name }}</span
          >&nbsp;&nbsp;&nbsp;&nbsp;<span>{{
            $t('systemOperation.nodeMonitoring.processVideoList')
          }}</span>
        </div>
      </template>
      <div>
        <monitoring-table
          :sceneId="sceneId"
          :elementId="elementId"
          @playVideo="playSingle"
        ></monitoring-table>
      </div>
    </cb-dialog>
    <!-- 设置节点弹窗 -->
    <cb-dialog
      :title="$t('systemOperation.nodeMonitoring.selectTheNode')"
      :visible.sync="setNodeDialog"
      width="60%"
    >
      <div class="content-box cyber-scroll-bar">
        <div class="info-box">
          <div class="square" />
          {{ $t('systemOperation.nodeMonitoring.singleContentIsOk') }}
        </div>
        <cb-search-table
          v-loading="loadingAllElementList"
          row-key="id"
          :cols="cols"
          :selector="selector"
          :selection.sync="selection"
          ref="allElementListRef"
          :data-source="allElementList"
          hidePaginOnDemand
          @onSelect="selectionOnchange"
          :searchBarBg="false"
        >
        </cb-search-table>
      </div>
    </cb-dialog>
  </div>
</template>

<script>
import MonitoringTable from './components/monitoring-table.vue';
import MonitorTitle from '../components/monitor-title.vue';
import BasicMessage from './components/node-basic-message.vue';
import NodeResource from './components/node-resource.vue';
import RealStatus from './components/real-time-status.vue';
import TrafficEvent from './components/traffic-event.vue';
import GetEvent from './components/get-event.vue';
import GetEventType from './components/get-event-type.vue';
import RealStatusTop from './components/real-time-status-top.vue';
import GetTraffic from './components/get-traffic.vue';
import FrostedBlock from '../components/frosted-block.vue';
import { VIRTUAL_TYPE } from '@/pages/cms/system-operation/constant.js';
export default {
  components: {
    MonitoringTable,
    MonitorTitle,
    BasicMessage,
    NodeResource,
    RealStatus,
    TrafficEvent,
    GetEvent,
    GetEventType,
    RealStatusTop,
    GetTraffic,
    FrostedBlock,
  },
  props: {
    nodeId: {
      type: String,
      default: '',
    },
  },
  data() {
    const that = this;
    return {
      monitoringUrl: '', // 监控接口
      monitoringModal: false,
      setNodeDialog: false,
      playerConfig: {
        width: '100%',
        height: '100%',
      },
      sceneId: '',
      elementId: '',
      loadingAllElementList: false,
      allElementList: [], // 所有节点列表
      selector: {
        maxSelect: 1,
      },
      selection: [],
      cols: [
        {
          label: this.$t('systemOperation.monitorReplay.hostNname'),
          prop: 'name',
        },
        // 类型
        {
          label: this.$t('systemOperation.monitorReplay.types'),
          getData(row) {
            const types = _.filter(VIRTUAL_TYPE, (item) => {
              return item.value === row.virtual_type;
            });
            if (types.length) {
              return types[0].label;
            }
          },
        },
        // 节点规模
        {
          label: this.$t('systemOperation.monitorReplay.nodeSize'),
          getData(row) {
            if (row.host_state === null) {
              return '-';
            } else {
              return (
                row.host_state.cpu_count +
                that.$t('systemOperation.scene.core') +
                '/' +
                row.host_state.memory_total +
                'MB/' +
                row.host_state.disk_space +
                'GB'
              );
            }
          },
        },
        // 地址
        {
          label: this.$t('systemOperation.monitorReplay.address'),
          getData(row) {
            const ips = _.map(row.ports, (item) => {
              return item.ip;
            });
            return _.compact(ips).join('/');
          },
        },
        // 用户
        {
          label: this.$t('systemOperation.monitorReplay.user'),
          getData(row) {
            let users = [];
            _.forEach(row.ports, (port) => {
              _.forEach(port.access_modes, (access_mode) => {
                users.push(access_mode.username);
              });
            });
            return users.join('/');
          },
        },
        // 登录方式
        {
          label: this.$t('systemOperation.monitorReplay.logWay'),
          getData(row) {
            let protocol = [];
            _.forEach(row.ports, (port) => {
              _.forEach(port.access_modes, (access_mode) => {
                protocol.push(access_mode.protocol);
              });
            });
            return protocol.join('/');
          },
        },
      ],
      eventTypeList: [], //采集事件分类
      trafficLevelCount: {}, // 流量风险 各级别值
      currentNode: {}, // 当前节点信息
      realStatus: {}, // 右上角 实时状态
      realProgressList: [], //实时状态-进程
      realHostList: [], //实时状态-端口
      realConnectionList: [], //实时状态-网络连接
      trafficEventList: [], //流量事件
      trafficEventCount: 0, //流量事件-总条数
      gatherEventList: [], //采集事件
      gatherEventCount: 0, //采集事件-总条数
      nodeTrafficTrend: [], // 节点流量趋势图
      nodeRosourceTrend: [], //节点资源趋势图
      timer: null,
    };
  },
  watch: {},
  created() {
    this.sceneId = this.$route.params && this.$route.params.id;
    this.allElements().then(() => {
      this.com();
      this.timer = setInterval(() => {
        this.com();
      }, 30000);
    });
  },
  beforeDestroy() {
    clearInterval(this.timer);
  },
  mounted() {},
  methods: {
    //打开节点弹窗列表
    setNode() {
      this.setNodeDialog = !this.setNodeDialog;
    },
    com() {
      this.getEventType();
      this.getSingleNode();
      this.getTrafficLevel();
      this.getRealStatus();
      this.getRealProgress();
      this.getTrafficEvent();
      this.getGatherEvent();
      this.getNodeTrafficTrend();
      this.getNodeRosourceTrend();
      this.getMonitoringUrl();
      this.getRealHost();
      this.getRealConnection();
    },
    selectionOnchange(val) {
      this.selection[0] = val;
      this.elementId = val.id;
      this.com();
      this.setNodeDialog = !this.setNodeDialog;
    },
    handleMonitorModal() {
      this.monitoringModal = true;
    },
    handleMonitorCloseModal() {
      this.monitoringModal = !this.monitoringModal;
    },
    // 获取所有节点列表
    allElements() {
      return new Promise((resolve, reject) => {
        this.loadingAllElementList = true;
        this.$request
          .get(
            `/cscene/monitor/scene/all_elements/${this.sceneId}`,
            {},
            { baseURL: '/api/mp' },
          )
          .then((res) => {
            this.loadingAllElementList = false;
            this.allElementList = _.get(res, 'data.data', []);
            if (this.nodeId) {
              this.elementId = this.nodeId;
            } else {
              this.elementId = this.allElementList[0].id || '';
            }
            resolve();
          })
          .catch(() => {
            reject();
          });
      });
    },
    // 获取左上角监控
    getMonitoringUrl() {
      this.$request
        .get(
          `/cscene/cscene_instances/list_recordings`,
          {
            ids: [this.sceneId],
            nodeIds: [this.elementId],
          },
          { baseURL: '/api/mp' },
        )
        .then((res) => {
          const data = _.get(res, 'data.data.list', []);
          // 为了处理循环刷新时，当前视频不被刷新；切换节点后视频的获取
          if (this.monitoringUrl) {
            const filterData = _.filter(data, (item) => {
              return item.play_url === this.monitoringUrl;
            });
            if (filterData.length <= 0) {
              this.$set(this, 'monitoringUrl', '');
              if (this.$refs.monitorPlayerRef1) {
                this.$refs.monitorPlayerRef1.pause();
              }
              setTimeout(() => {
                this.monitoringUrl = data.length != 0 ? data[0].play_url : '';
              }, 100);
            }
          } else {
            this.$set(this, 'monitoringUrl', '');
            if (this.$refs.monitorPlayerRef1) {
              this.$refs.monitorPlayerRef1.pause();
            }
            setTimeout(() => {
              this.monitoringUrl = data.length != 0 ? data[0].play_url : '';
            }, 100);
          }
        });
    },
    // 查询节点基本信息
    getSingleNode() {
      this.$request
        .get(
          `/cscene/monitor/scene/element/info`,
          {
            sceneId: this.sceneId,
            elementIds: this.elementId,
          },
          { baseURL: '/api/mp' },
        )
        .then((res) => {
          const data = _.get(res, 'data.data', {});
          this.currentNode = data;
          this.selection[0] = data;
        });
    },
    // 获取采集事件分类
    getEventType() {
      this.$request
        .get(
          '/cscene/monitor/event/aggr',
          {
            sceneId: this.sceneId,
            elementIds: this.elementId,
          },
          { baseURL: '/api/mp' },
        )
        .then((res) => {
          const data = _.get(res, 'data.data', {});
          this.eventTypeList = [
            {
              value: data.process || 0,
              name: this.$t('systemOperation.nodeMonitoring.process'),
            },
            {
              value: data.file || 0,
              name: this.$t('systemOperation.nodeMonitoring.file'),
            },
            {
              value: data.port || 0,
              name: this.$t('systemOperation.nodeMonitoring.port'),
            },
            {
              value: data.network || 0,
              name: this.$t('systemOperation.nodeMonitoring.networkConnection'),
            },
            {
              value: data.user || 0,
              name: this.$t('systemOperation.nodeMonitoring.user'),
            },
          ];
        });
    },
    // 获取 流量风险 各级别值
    getTrafficLevel() {
      this.$request
        .get(
          '/cscene/monitor/flow/risk_count',
          {
            sceneId: this.sceneId,
            elementIds: this.elementId,
          },
          { baseURL: '/api/mp' },
        )
        .then((res) => {
          const data = _.get(res, 'data.data', {});
          this.trafficLevelCount = data;
        });
    },
    // 右上角 实时状态
    getRealStatus() {
      this.$request
        .get(
          'cscene/monitor/scene/element/rtinfo',
          {
            sceneId: this.sceneId,
            elementIds: this.elementId,
          },
          {
            baseURL: '/api/mp',
          },
        )
        .then((res) => {
          const data = _.get(res, 'data.data', {});
          this.realStatus = data;
        });
    },
    // 获取 实时状态-进程
    getRealProgress() {
      this.$request
        .get(
          '/cscene/monitor/hoststate/element_process',
          {
            sceneIds: this.sceneId,
            nodeIds: this.elementId,
            pageSize: 200, // 后台要求设置200
          },
          {
            baseURL: '/api/mp',
          },
        )
        .then((res) => {
          const data = _.get(res, 'data.data', []);
          this.realProgressList = data.list || [];
        });
    },
    // 获取实时状态-端口
    getRealHost() {
      this.$request
        .get(
          '/cscene/monitor/hoststate/element_port',
          {
            sceneIds: this.sceneId,
            nodeIds: this.elementId,
            pageSize: 200, // 后台要求设置200
          },
          {
            baseURL: '/api/mp',
          },
        )
        .then((res) => {
          const data = _.get(res, 'data.data', []);
          this.realHostList = data.list || [];
        });
    },
    // 获取实时状态-网络连接
    getRealConnection() {
      this.$request
        .get(
          '/cscene/monitor/scene/element/connection_state',
          {
            sceneId: this.sceneId,
            elementIds: this.elementId,
            pageSize: 200, // 后台要求设置200
          },
          {
            baseURL: '/api/mp',
          },
        )
        .then((res) => {
          const data = _.get(res, 'data.data', []);
          this.realConnectionList = data.list || [];
        });
    },
    // 获取 流量事件
    getTrafficEvent() {
      const arr = new Array();
      arr.push(this.elementId);
      this.$request
        .get(
          '/cscene/monitor/flow/page',
          {
            id: this.sceneId,
            nodeIds: arr,
            page: 1,
            per_page: 100,
          },
          {
            baseURL: '/api/mp',
          },
        )
        .then((res) => {
          const data = _.get(res, 'data.data.list');
          const total = _.get(res, 'data.data.total', 0);
          this.trafficEventList = [];
          this.$nextTick(() => {
            this.trafficEventList = data;
          });
          this.trafficEventCount = total;
        });
    },
    // 获取采集事件
    getGatherEvent() {
      const arr = new Array();
      arr.push(this.elementId);
      this.$request
        .get(
          '/cscene/cscene_instances/list_host_events',
          {
            id: this.sceneId,
            nodeIds: arr,
            page: 1,
            per_page: 100,
          },
          {
            baseURL: '/api/mp',
          },
        )
        .then((res) => {
          const data = _.get(res, 'data.data.list');
          const total = _.get(res, 'data.data.total');
          this.gatherEventList = [];
          this.$nextTick(() => {
            this.gatherEventList = data;
          });
          this.gatherEventCount = total;
        });
    },
    // 节点流量趋势图
    getNodeTrafficTrend() {
      const arr = new Array();
      arr.push(this.elementId);
      this.$request
        .get(
          '/cscene/monitor/flow/element_trend',
          {
            sceneId: this.sceneId,
            elementIds: arr,
          },
          {
            baseURL: '/api/mp',
          },
        )
        .then((res) => {
          const data = _.get(res, 'data.data', []);
          this.nodeTrafficTrend = data;
        });
    },
    //节点资源趋势图
    getNodeRosourceTrend() {
      const arr = new Array();
      arr.push(this.elementId);
      this.$request
        .get(
          '/cscene/monitor/hoststate/element_trend',
          {
            sceneId: this.sceneId,
            elementIds: arr,
          },
          {
            baseURL: '/api/mp',
          },
        )
        .then((res) => {
          const data = _.get(res, 'data.data', []);
          this.nodeRosourceTrend = data;
        });
    },
    // 查看回放
    playSingle(row) {
      this.$refs.monitorPlayerRef1.pause();
      setTimeout(() => {
        this.monitoringModal = !this.monitoringModal;
        this.monitoringUrl = row.play_url;
        setTimeout(() => {
          this.$refs.monitorPlayerRef1.play();
        }, 50);
      }, 100);
    },
  },
  watch: {},
};
</script>

<style scoped lang="scss" scoped>
.content-box {
  min-height: 200px;
  max-height: 600px;
  overflow: auto;
  .info-box {
    height: 40px;
    display: flex;
    align-items: center;
    color: var(--orange-color);
    font-size: 14px;
    .square {
      width: 4px;
      height: 4px;
      background-color: var(--orange-color);
      margin-right: 10px;
    }
  }
}
.node-monitor {
  width: 100%;
  height: 99%;
  margin-bottom: 1%;
  display: flex;
  justify-content: space-between;
  .node-monitor-cotent-left,
  .node-monitor-cotent-right {
    width: 28%;
    display: flex;
    flex-flow: column;
    justify-content: space-between;
  }
  .node-monitor-cotent-center {
    width: 42.5%;
    display: flex;
    flex-flow: column;
    justify-content: space-between;
  }

  .node-monitor-wrap {
    width: 100%;
    overflow: hidden;
  }
  .basic-message-boxs {
    position: relative;
    .set-node {
      position: absolute;
      right: 20px;
      top: 1px;
    }
  }

  .middle-box {
    height: 33%;
  }
  .small-box {
    height: 27%;
  }
  .big-box {
    height: 37%;
  }

  .monitoring {
    position: relative;
    width: 100%;

    .player {
      width: 100%;
      height: 100%;
    }
    .cb-button {
      position: absolute;
      float: right;
      top: 10px;
      right: 20px;

      cursor: pointer;
      z-index: 100;
    }
  }

  .node-monitor-div {
    height: 100%;
  }
}
</style>
