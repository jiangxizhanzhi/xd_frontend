<template>
  <div class="main">
    <div class="layout">
      <div class="g-between">
        <div class="top">
          <frosted-block>
            <monitor-title
              :name="$t('systemOperation.eventAnalysis.collectEventTrendView')"
            >
            </monitor-title>
            <trend :sceneId="sceneId"></trend>
          </frosted-block>
        </div>
        <div class="center">
          <frosted-block>
            <monitor-title
              :name="$t('systemOperation.eventAnalysis.nodeStatusTop5')"
            >
            </monitor-title>
            <node-status-top-5
              :sceneId="sceneId"
              :tabs="NODE_STATUS_TOP5"
            ></node-status-top-5>
          </frosted-block>
        </div>
        <div class="bottom">
          <frosted-block>
            <monitor-title
              :name="$t('systemOperation.eventAnalysis.collectEventList')"
            >
            </monitor-title>
            <event-table
              :sceneId="sceneId"
              :list-data="listData"
              @getNewData="getGatherEvent"
            ></event-table>
          </frosted-block>
        </div>
      </div>
      <div class="center">
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
      <div class="g-between">
        <div class="top">
          <frosted-block>
            <monitor-title
              :name="$t('systemOperation.eventAnalysis.runNodeTotal')"
            >
            </monitor-title>
            <node-info :node-pic="nodeInfo" />
          </frosted-block>
        </div>

        <div class="center">
          <frosted-block>
            <monitor-title
              :name="$t('systemOperation.eventAnalysis.collectEventTypeTop5')"
            >
            </monitor-title>
            <event-type-top-5
              :sceneId="sceneId"
              :tabs="EVENT_STATUS_TOP5"
            ></event-type-top-5>
          </frosted-block>
        </div>
        <div class="bottom">
          <frosted-block>
            <monitor-title
              :name="$t('systemOperation.eventAnalysis.collectEvent')"
              :number="collectionEventTotal"
            >
            </monitor-title>
            <event-nightingale :pieData="collectionData"></event-nightingale>
          </frosted-block>
        </div>
      </div>
    </div>
    <div class="bottom-event-table">
      <frosted-block>
        <div class="table-container" ref="searchTableRef">
          <node-search-table
            :sceneId="sceneId"
            :scroll-y="scrollY"
          ></node-search-table>
        </div>
      </frosted-block>
    </div>
  </div>
</template>

<script>
import MonitorTitle from '../components/monitor-title.vue';
import Trend from './components/trend.vue';
import NodeStatusTop5 from './components/node-status-top5.vue';
import EventTypeTop5 from './components/event-type-top5.vue';
import EventNightingale from './components/event-nightingale.vue';
import EventTable from './components/event-table.vue';
import NodeSearchTable from './components/node-search-table.vue';
import FrostedBlock from '../components/frosted-block.vue';
import nodeInfo from '../components/node-info.vue';
import { NODE_STATUS_TOP5, EVENT_STATUS_TOP5 } from './constant/tabs.js';
import contain from '../assets/img/icon_ontain.png';
import device from '../assets/img/icon-device.png';
import viturl from '../assets/img/icon-viturl.png';
import { SceneEditor } from '@cyber/scene';
import { getSceneData } from '@/api/monitor';
export default {
  components: {
    MonitorTitle,
    nodeInfo,
    EventTable,
    NodeSearchTable,
    FrostedBlock,
    Trend,
    NodeStatusTop5,
    EventTypeTop5,
    EventNightingale,
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
      collectLoading: { value: true },
      NODE_STATUS_TOP5,
      EVENT_STATUS_TOP5,
      scrollY: 0,
      nodeInfo: [],
      collectionData: [
        {
          value: 0,
          name: this.$t('systemOperation.monitorScene.process'),
          key: 'process',
        },
        {
          value: 0,
          name: this.$t('systemOperation.monitorScene.file'),
          key: 'file',
        },
        {
          value: 0,
          name: this.$t('systemOperation.monitorScene.port'),
          key: 'port',
        },
        {
          value: 0,
          name: this.$t('systemOperation.monitorScene.networkConnection'),
          key: 'network',
        },
        {
          value: 0,
          name: this.$t('systemOperation.monitorScene.users'),
          key: 'user',
        },
      ],
      collectionEventTotal: '',
      // 场景配置
      sceneConfig: {
        showMenu: false,
        menubar: [],
        toolbar: ['restore'],
        showToolbar: true,
      },
      sceneData: {}, // 场景数据
      timer: null,
      visible: true,
      listData: [],
    };
  },
  provide() {
    return {
      loading: this.collectLoading,
    };
  },
  computed: {},
  created() {
    this.sceneId = this.$route.params && this.$route.params.id;
    // this.getCollectionEvent();
    this.comFunc();
    // this.getCollectionCount();
    this.getNode();
    this.getSceneData();
    this.getGatherEvent();
  },
  mounted() {
    this.$refs.sceneEditor.setTheme('dark');
    this.timer = setInterval(() => {
      this.comFunc();
    }, 30000);
    this.scrollY = this.$refs.searchTableRef.offsetHeight - 52 - 60 - 45; // -搜索条 - 分页 -表头;
    document.addEventListener('visibilitychange', this.handle);
  },
  beforeDestroy() {
    clearInterval(this.timer);
    document.removeEventListener('visibilitychange', this.handle);
  },
  watch: {},
  methods: {
    //查询采集事件列表
    getGatherEvent() {
      this.$request
        .get(
          'cscene/cscene_instances/list_host_events',
          {
            id: this.sceneId,
            page: 1,
            per_page: 100,
          },
          { baseURL: '/api/mp' },
        )
        .then((res) => {
          const data = _.get(res, 'data.data.list', []);
          const total = _.get(res, 'data.data.total', 0);
          this.listData = [];
          this.$nextTick(() => {
            _.forEach(data, (item) => {
              if (item.time) {
                this.$set(item, 'time', item.time.slice(5));
              }
            });
            this.listData = data;
          });
          this.collectionEventTotal = total;
        });
    },
    handle() {
      this.visible = document.visibilityState === 'visible';
      if (document.visibilityState === 'visible') {
        this.$nextTick(() => {
          this.$refs.sceneEditor.setTheme('dark');
        });
      }
    },
    comFunc() {
      this.getCollectionEvent();
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
    nodeClick(val) {
      if (val.role === 4) {
        this.$emit('update:nodeId', val.id);
        this.$emit('goNode');
      }
    },
    //查询采集事件总数
    getCollectionCount() {
      this.$request
        .get(
          '/cscene/monitor/event/sum',
          {
            sceneId: this.sceneId,
          },
          { baseURL: '/api/mp' },
        )
        .then((res) => {
          // this.collectionEventTotal = _.get(res, 'data.data', 0);
        });
    },
    //查询采集事件
    getCollectionEvent() {
      this.$request
        .get(
          '/cscene/monitor/event/aggr',
          {
            sceneId: this.sceneId,
          },
          { baseURL: '/api/mp' },
        )
        .then((res) => {
          const data = _.get(res, 'data.data', {});
          const collectData = [];
          Object.keys(data).forEach((item) => {
            for (let i = 0; i < this.collectionData.length; i++) {
              if (item == this.collectionData[i].key) {
                this.collectionData[i].value = data[item];
                break;
              }
            }
          });
          this.collectLoading.value = false;
        });
    },
    // 获取节点统计
    getNode() {
      const nodeInfoBakup = [
        { name: this.$t('systemOperation.scene.vm'), value: 0, icon: contain },
        {
          name: this.$t('systemOperation.scene.container'),
          value: 0,
          icon: device,
        },
        {
          name: this.$t('systemOperation.scene.entity'),
          value: 0,
          icon: viturl,
        },
      ];
      this.$request
        .get(
          `/cscene/monitor/scene/all_elements/${this.sceneId}`,
          {
            realTimeHostState: false,
          },
          { baseURL: '/api/mp' },
        )
        .then((res) => {
          const data = _.get(res, 'data.data', []);
          let vmCount = 0;
          let containCount = 0;
          let physicalCount = 0;
          //测试
          // const data = [
          //   { virtual_type: 4 },
          //   { virtual_type: 5 },
          //   { virtual_type: 6 },
          //   { virtual_type: 4 },
          //   { virtual_type: 6 },
          //   { virtual_type: 0 },
          // ];
          data.forEach((item) => {
            if (item.virtual_type == 4) {
              vmCount++;
            } else if (item.virtual_type == 5) {
              containCount++;
            } else if (item.virtual_type == 6) {
              physicalCount++;
            }
          });
          nodeInfoBakup[0].value = vmCount;
          nodeInfoBakup[1].value = containCount;
          nodeInfoBakup[2].value = physicalCount;
          this.nodeInfo = _.cloneDeep(nodeInfoBakup);
        });
    },
  },
};
</script>

<style lang="scss" scoped>
.main {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: calc(100% - 10px);
}
.layout {
  display: flex;
  justify-content: space-between;
  height: 68.5%;
  .g-between {
    width: 28%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    .top {
      height: 26%;
      width: 100%;
    }
    .center {
      height: 35%;
      width: 100%;
    }
    .bottom {
      height: 35%;
      width: 100%;
    }
  }
  .center {
    width: 42.5%;
    display: inline-block;
    height: 100%;
  }
}
.bottom-event-table {
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
</style>
