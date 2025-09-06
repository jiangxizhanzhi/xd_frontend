<template>
  <div class="replay-boxs">
    <div class="content-top">
      <div class="left-boxs">
        <div class="echart-box">
          <frosted-block>
            <!-- 实时流量 -->
            <monitor-title
              :name="$t('systemOperation.monitorReplay.realTimeTraffic')"
            />
            <LineChart :lineData="trafficLineData" class="calculate-div" />
          </frosted-block>
        </div>
        <div class="table-box">
          <frosted-block>
            <!-- 流量事件 -->
            <monitor-title
              :name="$t('systemOperation.monitorReplay.trafficEvent')"
              :number="trafficEventTotal"
            />
            <scroll-table
              class="calculate-div-center"
              :data="listData"
              :cols="colsTraffic"
              :limitNum="13"
              @scrollEndEvent="getTrafficEvent"
            >
              <template v-slot:type="scope">
                <span :title="scope.data.attack_info.attack_type">{{
                  scope.data.attack_info.attack_type
                }}</span>
              </template>
              <template v-slot:level="scope">
                <span :class="getLevel(scope.data)">
                  <span
                    v-if="level(scope.data) == '4'"
                    :title="$t('systemOperation.monitorReplay.low')"
                  >
                    {{ $t('systemOperation.monitorReplay.low') }}
                  </span>
                  <span
                    v-else-if="level(scope.data) == '3'"
                    :title="$t('systemOperation.monitorReplay.middleLow')"
                  >
                    {{ $t('systemOperation.monitorReplay.low') }}
                  </span>
                  <span
                    v-else-if="level(scope.data) == '2'"
                    :title="$t('systemOperation.monitorReplay.middle')"
                  >
                    {{ $t('systemOperation.monitorReplay.middle') }}
                  </span>
                  <span
                    v-else-if="level(scope.data) == '1'"
                    :title="$t('systemOperation.monitorReplay.high')"
                  >
                    {{ $t('systemOperation.monitorReplay.high') }}
                  </span>
                  <span v-else>{{
                    $t('systemOperation.monitorReplay.none')
                  }}</span>
                </span>
              </template>
            </scroll-table>
          </frosted-block>
        </div>
      </div>
      <div class="center-boxs">
        <div class="equipment-box">
          <frosted-block>
            <div class="com-boxs">
              <StateDiagram
                v-for="(item, index) in imgList"
                :key="index"
                :entityImg="item.img"
                :number="item.number"
                :type="item.text"
              />
            </div>
          </frosted-block>
        </div>
        <div class="monitor-players">
          <frosted-block>
            <div class="players-container">
              <cb-dialog :visible.sync="visibleValue">
                <template slot="title">
                  <div>{{ $t('systemOperation.scene.nodeList') }}</div>
                </template>
                <cb-search-table
                  v-loading="loadingAllElementList"
                  :selection.sync="multipleSelection"
                  :scroll="{ y: 240 }"
                  :background="true"
                  :selector="selector"
                  :cols="columns"
                  row-key="id"
                  :data-source="allElementList"
                  hidePaginOnDemand
                  @onSelect="nodeOnchange"
                  :searchBarBg="false"
                >
                </cb-search-table>
              </cb-dialog>

              <cb-dialog :visible.sync="userList" @close="canel">
                <template slot="title">
                  <div>{{ $t('systemOperation.monitorReplay.userList') }}</div>
                </template>
                <cb-search-table
                  :selection.sync="userSelection"
                  :scroll="{ y: 240 }"
                  :background="true"
                  row-key="id"
                  :cols="userCol"
                  :selector="tableSelector"
                  :data-source="userNameList"
                  :searchBarBg="false"
                >
                </cb-search-table>

                <div class="annius">
                  <cb-button
                    @click="searchUrl"
                    button-type="confirm"
                    mr
                  ></cb-button>
                  <cb-button @click="canel" button-type="cancel" mr></cb-button>
                </div>
              </cb-dialog>

              <div class="player-show">
                <div>
                  <span
                    >{{ $t('systemOperation.monitorReplay.terminalCount') }}
                    {{ terminalCount }}
                  </span>
                  <cb-iconfont
                    @click="OnClick"
                    type="icon-liebiao"
                    style="cursor: pointer"
                  ></cb-iconfont>
                </div>

                <cb-button-group>
                  <cb-button size="small" @click="topBtnClick(0)">{{
                    $t('systemOperation.monitorReplay.viewRecordScreen')
                  }}</cb-button>
                  <cb-button size="small" @click="topBtnClick(1)">{{
                    $t('systemOperation.monitorReplay.viewSituation')
                  }}</cb-button>
                </cb-button-group>
              </div>
              <div v-if="btnflag == 0" class="mainContain">
                <div class="main-monitor">
                  <!-- 播放器 -->
                  <cb-player
                    v-show="ActiveMonitorList.url"
                    ref="monitorPlayerRef1"
                    :url="ActiveMonitorList.url"
                    :config="playerConfig"
                    :id="ActiveMonitorList.id"
                    class="monitor-player-cls"
                    @event="playerEvent"
                    @init="playerInit($event, ActiveMonitorList.id)"
                  ></cb-player>
                </div>
                <div class="contain">
                  <div
                    class="sub-monitor-contain cyber-scroll-bar"
                    v-if="monitorList.length != 0"
                  >
                    <div
                      :key="m.id"
                      class="sub-monitor"
                      :class="index == activeIndex ? 'activeCon' : ''"
                      v-for="(m, index) in monitorList"
                      @click.capture="selectVideo(m, index)"
                    >
                      <!-- 播放器 -->
                      <cb-player
                        ref="monitorPlayerRef"
                        :url="m.url"
                        :config="playerConfig"
                        :id="m.id"
                        class="monitor-player-cls"
                        @event="playerEvent"
                        @init="playerInit($event, m.id)"
                      ></cb-player>
                    </div>
                  </div>
                </div>

                <div class="player-message">
                  <div>
                    <div class="left" style="width: 95px">
                      {{ $t('systemOperation.monitorReplay.currentUser') }}
                    </div>
                    <div class="left" :title="currentUser.name">
                      {{ currentUser.name }}
                    </div>
                    <br />
                    <div>
                      <cb-button @click="showUserList">{{
                        $t('systemOperation.monitorReplay.switchUser')
                      }}</cb-button>
                    </div>
                  </div>

                  <div style="margin-right: 20%">
                    <div style="margin-left: 45%">
                      {{ $t('systemOperation.monitorReplay.nodeInfo') }}
                    </div>
                    <div class="node-info">
                      <div>
                        <div class="node-item" :title="hostName">
                          {{ hostName }}
                        </div>
                        <br />
                        <div class="node-item" :title="nodeSize">
                          {{ nodeSize }}
                        </div>
                      </div>

                      <div style="margin-left: 10%">
                        <div class="node-item" :title="nodetype">
                          {{ nodetype }}
                        </div>
                        <br />
                        <div class="node-item" :title="hostAddress">
                          {{ hostAddress }}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div v-else class="mainContainScene">
                <scene-editor
                  ref="sceneEditor"
                  :sceneConfig="sceneConfig"
                  :topologyData="sceneData"
                  :status="'display'"
                  :showTitle="false"
                  :showLabel="false"
                  :showAccessDialog="false"
                ></scene-editor>
              </div>
            </div>
          </frosted-block>
        </div>
      </div>
      <div class="right-boxs">
        <div class="echart-box">
          <frosted-block>
            <!-- 实时状态 -->
            <monitor-title
              :name="$t('systemOperation.monitorReplay.realTimeStatus')"
            />
            <real-status
              :statusLineData="statusLineData"
              class="calculate-div"
            />
          </frosted-block>
        </div>
        <div class="table-box">
          <frosted-block>
            <!-- 采集事件 -->
            <monitor-title
              :name="$t('systemOperation.monitorReplay.collectionEvent')"
              :number="collectionEventTotal"
            />
            <scroll-table
              class="calculate-div-center"
              :data="collectionData"
              :cols="colsGather"
              :limitNum="13"
              @scrollEndEvent="getCollectionEvent"
            />
          </frosted-block>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import RealStatus from './components/real-status-echart.vue';
import ScrollTable from '../components/scroll-table.vue';
import MonitorTitle from '../components/monitor-title.vue';
import LineChart from '../components/line-chart-shadow-soild.vue';
import FrostedBlock from '../components/frosted-block.vue';
import StateDiagram from '../components/state-diagram.vue';
import virtualImg from '../assets/img/virtual.png';
import containerImg from '../assets/img/container.png';
import entityImg from '../assets/img/entity.png';
import { VIRTUAL_TYPE } from '@/pages/cms/system-operation/constant.js';
import { getSceneData } from '@/api/monitor';
import { SceneEditor } from '@cyber/scene';
export default {
  components: {
    RealStatus,
    ScrollTable,
    MonitorTitle,
    LineChart,
    FrostedBlock,
    StateDiagram,
    SceneEditor,
  },
  data() {
    const that = this;
    return {
      // 场景配置
      sceneConfig: {
        showMenu: false,
        menubar: [],
        toolbar: ['restore'],
        showToolbar: true,
      },
      sceneData: {}, // 场景数据
      btnflag: 0,
      activeIndex: 0,
      multipleSelection: [],
      userSelection: [],
      trafficEventTotal: '',
      collectionEventTotal: '',
      loadingAllElementList: false,
      allElementList: [],
      userNameList: '',
      elementId: '',
      hostName: '',
      nodeSize: '',
      nodetype: '',
      hostAddress: '',
      currentUser: '',
      selector: {
        maxSelect: 1,
      },
      tableSelector: {
        maxSelect: 1,
      },
      columns: [
        {
          label: this.$t('systemOperation.monitorReplay.hostNname'),
          prop: 'name',
        },
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
        {
          label: this.$t('systemOperation.monitorReplay.nodeSize'),
          getData(row) {
            if (row.host_state) {
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
        {
          label: this.$t('systemOperation.monitorReplay.address'),
          getData(row) {
            const ips = _.map(row.ports, (item) => {
              return item.ip;
            });
            return _.compact(ips).join('/');
          },
        },
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

      userCol: [
        {
          label: this.$t('systemOperation.monitorReplay.user'),
          prop: 'name',
        },
      ],

      value: '',
      visibleValue: false,
      userList: false,

      imgList: [
        {
          img: virtualImg,
          text: this.$t('systemOperation.scene.vm'),
          number: 0,
        },
        {
          img: containerImg,
          text: this.$t('systemOperation.scene.container'),
          number: 0,
        },
        {
          img: entityImg,
          text: this.$t('systemOperation.scene.entity'),
          number: 0,
        },
      ],
      listData: [],
      collectionData: [],
      colsTraffic: [
        {
          label: this.$t('systemOperation.monitorReplay.sourceHost'),
          prop: 'source_ip',
        },
        {
          label: this.$t('systemOperation.monitorReplay.destinationHost'),
          prop: 'target_ip',
        },
        {
          label: this.$t('systemOperation.monitorReplay.types'),
          prop: 'attack_type',
          slot: 'type',
        },
        {
          label: this.$t('systemOperation.monitorReplay.alarmLevel'),
          prop: 'severity',
          class: 'level',
          slot: 'level',
        },
        {
          label: this.$t('systemOperation.monitorReplay.times'),
          prop: 'time',
        },
      ],
      colsGather: [
        {
          label: this.$t('systemOperation.monitorReplay.hosts'),
          prop: 'node_name',
        },
        {
          label: this.$t('systemOperation.monitorReplay.eventType'),
          prop: 'type',
        },
        {
          label: this.$t('systemOperation.monitorReplay.eventDesc'),
          prop: 'description',
        },
        {
          label: this.$t('systemOperation.monitorReplay.times'),
          prop: 'time',
        },
      ],
      monitorList: [],
      ActiveMonitorList: {
        id: 'monitor-player',
        name: 'monitor-player',
        url: '',
      },
      mainMonitor: 'monitor-player-1',
      playerConfig: {
        ignores: ['replay'],
        width: '100%',
        height: '100%',
      },
      trafficLineData: {
        xData: [],
        yData: [],
      },

      statusLineData: {
        xData: [],
        yData: [],
      },
    };
  },

  created() {
    this.sceneId = this.$route.params && this.$route.params.id;
    Promise.all([this.allElements(), this.getUserList()]).then(() => {
      this.getMonitoringUrl();
    });
    this.getTrafficEvent();
    this.getCollectionEvent();
    this.getRealStatus();
    this.getRealTraffic();
    this.getSceneInfo();
  },
  mounted() {
    this.getSceneData();
  },
  computed: {
    level(data) {
      return function (data) {
        const tmp = data.attack_info;
        if (tmp) {
          return tmp.severity;
        }
      };
    },

    //终端总数为虚拟机加容器加实体设备的总数
    terminalCount() {
      return (
        this.imgList[0].number + this.imgList[1].number + this.imgList[2].number
      );
    },
  },
  watch: {
    isActive(val) {
      this.model = {
        start_time: '',
        end_time: '',
        search: '',
      };
      this.selection = [];
    },
    elementId(val) {
      this.getMonitoringUrl();
    },
    btnflag: {
      handler(val) {
        // 编辑器主题色设置
        this.$nextTick(() => {
          if (val && this.$refs.sceneEditor) {
            this.$refs.sceneEditor.setTheme('dark');
          }
        });
      },
    },
  },

  methods: {
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
    topBtnClick(flag) {
      this.btnflag = flag;
    },
    // 更换视屏
    selectVideo(m, index) {
      // const back
      this.activeIndex = index;
      const newViedo = this.monitorList.find((item) => {
        if (item.name == m.name) {
          return true;
        }
      });
      this.$refs.monitorPlayerRef1.pause();
      setTimeout(() => {
        this.ActiveMonitorList.url = newViedo.url;
      }, 100);
    },
    //查询场景监控信息
    getSceneInfo() {
      this.$request
        .get(
          `cscene/monitor/scene/info/${this.sceneId}`,
          {},
          { baseURL: '/api/mp' },
        )
        .then((res) => {
          const data = _.get(res, 'data.data', []);
          this.imgList[0].number = data.virtual_machine_count;
          this.imgList[1].number = data.container_count;
          this.imgList[2].number = data.entity_count;
        });
    },
    //查询流量事件
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
            this.listData = data;
          });
          this.trafficEventTotal = _.get(res, 'data.data.total', '');
        });
    },
    //查询采集事件
    getCollectionEvent() {
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
          this.collectionData = [];
          this.$nextTick(() => {
            this.collectionData = data;
          });
          this.collectionEventTotal = _.get(res, 'data.data.total', '');
        });
    },
    //查询实时状态
    getRealStatus() {
      this.$request
        .get(
          'cscene/monitor/hoststate/scene_trend',
          {
            sceneId: this.sceneId,
          },
          { baseURL: '/api/mp' },
        )
        .then((res) => {
          const data = _.get(res, 'data.data', {});
          const xData = [];
          const cpu_yData = [];
          const memory_yData = [];
          const disk_yData = [];
          _.forEach(data, (item) => {
            xData.push(item.time);
            cpu_yData.push(item.cpu_percent);
            memory_yData.push(item.memory_percent);
            disk_yData.push(item.disk_percent);
          });
          this.statusLineData.xData = xData;
          this.statusLineData.yData = [cpu_yData, memory_yData, disk_yData];
        });
    },
    //查询实时流量
    getRealTraffic() {
      this.$request
        .get(
          'cscene/monitor/flow/scene_trend',
          {
            sceneId: this.sceneId,
          },
          { baseURL: '/api/mp' },
        )
        .then((res) => {
          const xData = [];
          const yData = [];
          const data = _.get(res, 'data.data', {});
          _.forEach(data, (item) => {
            xData.push(item.time);
            yData.push(item.data_size);
          });
          this.trafficLineData.xData = xData;
          this.trafficLineData.yData = yData;
        });
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
            this.elementId = this.allElementList[0].id || '';
            this.multipleSelection =
              this.allElementList.length != 0
                ? [_.cloneDeep(this.allElementList[0])]
                : [];
            this.showElementInfo(this.allElementList[0]);

            resolve();
          })
          .catch(() => {
            reject();
          });
      });
    },
    getMonitoringUrl() {
      this.$request
        .get(
          `/cscene/cscene_instances/list_recordings`,
          {
            ids: [this.sceneId],
            nodeIds: [this.elementId],
            userIds: [this.currentUser.id],
          },
          { baseURL: '/api/mp' },
        )
        .then((res) => {
          const data = _.get(res, 'data.data.list', []);
          if (this.ActiveMonitorList.url) {
            this.$refs.monitorPlayerRef1.pause();
            setTimeout(() => {
              this.ActiveMonitorList.url =
                data.length != 0 ? data[0].play_url : '';
            }, 100);
          } else {
            this.ActiveMonitorList.url =
              data.length != 0 ? data[0].play_url : '';
          }
          const monitorList = data.map((item, index) => {
            return {
              url: item.play_url,
              name: item.name,
              id: `monitor-player-${index + 1}`,
            };
          });
          this.monitorList = _.cloneDeep(monitorList);
          this.activeIndex = 0;
        });
    },
    // 获取用户列表

    getUserList() {
      return new Promise((resolve, reject) => {
        this.$request
          .get(
            `/cscene/monitor/scene/recording/users`,
            {
              sceneId: this.sceneId,
            },
            { baseURL: '/api/mp' },
          )
          .then((res) => {
            const data = _.get(res, 'data.data', []);
            // 测试数据
            // const data = [
            //   { name: 'nihao', id: '22222' },
            //   { name: 'nihao1', id: '111111133334' },
            // ];
            // 默认选中第一个用户
            this.currentUser =
              data.length != 0 ? _.cloneDeep(data[0]) : { id: '', name: '' };
            this.userSelection =
              data.length != 0
                ? [_.cloneDeep(data[0])]
                : [{ id: '', name: '' }];
            this.userNameList = _.cloneDeep(data);

            resolve();
          })
          .catch(() => {
            reject();
          });
      });
    },

    // 查看节点某个用户视频文件url
    getUserUrl() {
      this.$request
        .get(
          `cscene/cscene_instances/list_recordings`,
          {
            ids: [this.sceneId],
            nodeIds: [this.elementId],
            userIds: [this.userSelection[0].username],
          },
          { baseURL: '/api/mp' },
        )
        .then((res) => {
          const data = _.get(res, 'data.data.list', {});
        });
    },

    showUserList() {
      this.userList = true;
      // this.allElements();
    },

    //选择节点后渲染节点信息并生成当前节点用户列表
    nodeOnchange(val) {
      this.multipleSelection[0] = val;
      this.elementId = val.id;
      this.showElementInfo(val);

      this.getMonitoringUrl();

      this.visibleValue = !this.visibleValue;
    },

    showElementInfo(data) {
      const size =
        data.host_state.cpu_count +
        this.$t('systemOperation.scene.core') +
        '/' +
        data.host_state.memory_total +
        'MB/' +
        data.host_state.disk_space +
        'GB';
      const users = [];
      _.forEach(data.ports, (port) => {
        _.forEach(port.access_modes, (access_mode) => {
          users.push(access_mode.username);
        });
      });
      const currUser = users.join('/');

      const name = data.name;
      const types = _.filter(VIRTUAL_TYPE, (item) => {
        return item.value === data.virtual_type;
      });
      const type = types && types[0].label;
      const ips = _.map(data.ports, (item) => {
        return item.ip;
      });
      const ip = _.compact(ips).join('/');

      this.hostName = name;
      this.nodeSize = size;
      this.nodetype = type;
      this.hostAddress = ip;
    },

    error() {
      if (this.multipleSelection.length > 4) {
        this.$message.error({
          message: this.$t('systemOperation.monitorReplay.waringMsg'),
        });
      } else {
        this.visibleValue = false;
      }
      switch (this.multipleSelection.length) {
        case 1:
          this.monitorList = [];
          this.monitorList.push({
            id: 'monitor-player-1',
            name: 'monitor-player',
            url: '//sf1-cdn-tos.huoshanstatic.com/obj/media-fe/xgplayer_doc_video/mp4/xgplayer-demo-360p.mp4',
          });
          break;

        case 2:
          this.monitorList = [];
          this.monitorList.push(
            {
              id: 'monitor-player-1',
              name: 'monitor-player',
              url: '//sf1-cdn-tos.huoshanstatic.com/obj/media-fe/xgplayer_doc_video/mp4/xgplayer-demo-360p.mp4',
            },
            {
              id: 'monitor-player-2',
              name: 'monitor-player',
              url: '//sf1-cdn-tos.huoshanstatic.com/obj/media-fe/xgplayer_doc_video/mp4/xgplayer-demo-360p.mp4',
            },
          );
          break;

        case 3:
          this.monitorList = [];
          this.monitorList.push(
            {
              id: 'monitor-player-1',
              name: 'monitor-player',
              url: '//sf1-cdn-tos.huoshanstatic.com/obj/media-fe/xgplayer_doc_video/mp4/xgplayer-demo-360p.mp4',
            },
            {
              id: 'monitor-player-2',
              name: 'monitor-player',
              url: '//sf1-cdn-tos.huoshanstatic.com/obj/media-fe/xgplayer_doc_video/mp4/xgplayer-demo-360p.mp4',
            },
            {
              id: 'monitor-player-3',
              name: 'monitor-player',
              url: '//sf1-cdn-tos.huoshanstatic.com/obj/media-fe/xgplayer_doc_video/mp4/xgplayer-demo-360p.mp4',
            },
          );
          break;

        case 4:
          this.monitorList = [];
          this.monitorList.push(
            {
              id: 'monitor-player-1',
              name: 'monitor-player',
              url: '//sf1-cdn-tos.huoshanstatic.com/obj/media-fe/xgplayer_doc_video/mp4/xgplayer-demo-360p.mp4',
            },
            {
              id: 'monitor-player-2',
              name: 'monitor-player',
              url: '//sf1-cdn-tos.huoshanstatic.com/obj/media-fe/xgplayer_doc_video/mp4/xgplayer-demo-360p.mp4',
            },
            {
              id: 'monitor-player-3',
              name: 'monitor-player',
              url: '//sf1-cdn-tos.huoshanstatic.com/obj/media-fe/xgplayer_doc_video/mp4/xgplayer-demo-360p.mp4',
            },
            {
              id: 'monitor-player-4',
              name: 'monitor-player',
              url: '//sf1-cdn-tos.huoshanstatic.com/obj/media-fe/xgplayer_doc_video/mp4/xgplayer-demo-360p.mp4',
            },
          );
          break;
      }
    },

    getLevel(row) {
      const classObj = {};
      const tmp = row.attack_info;
      if (tmp) {
        if (tmp.severity == '1') {
          classObj.high = true;
        } else if (tmp.severity == '2') {
          classObj.middle = true;
        } else if (tmp.severity == '3') {
          classObj.low = true;
        } else {
          classObj.low = true;
        }
        return classObj;
      }
    },

    BtnClick() {
      this.visibleValue = false;
    },

    searchUrl() {
      this.userList = false;
      this.currentUser = this.userSelection[0];
      if (this.userNameList.length != 0) {
        // this.getUserUrl();
        this.getMonitoringUrl();
      }
    },

    canel() {
      this.userSelection = [];
      this.userSelection.push(this.currentUser);
      this.userList = false;
    },

    OnClick() {
      this.visibleValue = true;
      setTimeout(() => {
        if (this.$refs.sceneEditor) {
          this.$refs.sceneEditor.setTheme('dark');
        }
      }, 10);
    },

    getMonitorCls(id, index) {
      if (this.mainMonitor) {
        return this.mainMonitor === id ? 'main-monitor' : 'sub-monitor';
      } else {
        return index === 0 ? 'main-monitor' : 'sub-monitor';
      }
    },
    getMainPlayer() {
      let mainPlayer;
      this.$refs.monitorPlayerRef.some((i) => {
        if (i.id === this.mainMonitor) {
          mainPlayer = i;
          return true;
        }
      });
      return mainPlayer;
    },
    playerInit(player, id) {
      if (id !== this.mainMonitor) {
        player.muted = true;
      }
    },
    playerEvent(data = {}) {
      const { type, id } = data;
      if (id !== this.mainMonitor) {
        return;
      }
      this.$refs.monitorPlayerRef &&
        this.$refs.monitorPlayerRef.map((i) => {
          if (i.id !== this.mainMonitor) {
            this.playerControl(i, type, data.data);
          }
        });
    },
    playerControl(target, event, data) {
      if (event === 'play' || event === 'pause') {
        target[event]();
      } else if (
        ['seeking', 'seeked', 'ended'].includes(event) &&
        data.currentTime
      ) {
        target.setCurrentTime(data.currentTime);
      } else if (event === 'playbackrateChange') {
        target.setPlaybackrate(data.to);
      } else if (event === 'timeupdate') {
        this.fixPlayerTime();
      }
    },
    fixPlayerTime() {
      let minTime = null;
      this.$refs.monitorPlayerRef.map((i) => {
        const currentTime = i.player.currentTime;
        if (minTime === null || currentTime < minTime) {
          minTime = currentTime;
        }
      });
      this.$refs.monitorPlayerRef.map((i) => {
        const currentTime = i.player.currentTime;
        if (currentTime - minTime > 0.4) {
          i.setCurrentTime(minTime);
        }
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.contain {
  width: 100%;
  height: 30%;
}
.mainContain {
  width: 100%;
  height: calc(100% - 60px);
}
.mainContainScene {
  width: 100%;
  height: 100%;
}
.activeCon {
  outline: 1px solid var(--neutral1);
}
.replay-boxs {
  width: 100%;
  height: 100%;
  .high {
    color: rgba(253, 58, 44, 1);
  }
  .middle {
    color: rgba(253, 118, 44, 1);
  }
  .low {
    color: rgba(57, 255, 178, 1);
  }
  .content-top {
    display: flex;
    justify-content: space-between;
    width: 100%;
    height: calc(100% - 80px);
    .left-boxs,
    .right-boxs {
      width: 26%;
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }
    .echart-box {
      height: 30%;
    }
    .table-box {
      height: 68%;
    }
    .calculate-div {
      height: calc(100% - 32px);
    }
    .calculate-div-center {
      height: calc(100% - 32px);
      padding-top: 10px;
    }
    .center-boxs {
      width: 46.5%;
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      .equipment-box {
        height: 10%;
        .com-boxs {
          height: 100%;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0 30px;
        }
        .com-wrapper {
          display: flex;
          justify-content: flex-start;
          align-items: center;

          img {
            width: 70px;
            height: 70px;
          }
          .number {
            font-size: 18px;
            font-weight: bold;
            // text-shadow: 0px 0px 20px #0b1e41;
            color: #bde1ff;
            text-shadow: 0 0 8px rgb(231 239 255 / 20%),
              0 0 8px rgb(231 239 255 / 20%), 0 0 8px rgb(231 239 255 / 20%),
              0 0 8px rgb(231 239 255 / 20%);
            background: linear-gradient(
              0deg,
              #bde1ff 0%,
              #ffffff 50%,
              #e7efff 100%
            );
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
          }
          .desc {
            color: #fff;
            font-size: 12px;
            font-family: Microsoft YaHei;
            font-weight: 400;
          }
        }
      }
      .monitor-players {
        height: 88%;
        width: 100%;
        .players-container {
          width: 100%;
          height: 95%;
          display: flex;
          flex-wrap: wrap;
          justify-content: space-around;
          align-content: flex-start;
          position: relative;

          .annius {
            text-align: center;
          }

          .player-show {
            width: 100%;
            height: 5%;
            padding-top: 5px;
            margin-left: 10px;
            color: #fff;
            z-index: 99;
            display: flex;
            justify-content: space-between;
          }

          .player-message {
            display: flex;
            justify-content: space-between;
            color: #fff;
            line-height: 18px;
            width: 100%;
            height: 60px;
            margin-top: 10px;
            padding-left: 20px;
            word-spacing: 3px;
            .left {
              margin-left: 15%;
            }
            .node-info {
              display: flex;
              margin-top: 20px;
              .node-item {
                width: 150px;
                text-align: center;
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
              }
            }
          }
          .main-monitor {
            height: 60%;
            width: 100%;
            margin-top: 5px;
            ::v-deep .monitor-player-cls {
              .xgplayer-controls {
                display: flex;
                position: fixed;
                bottom: 0px;
              }
            }
            .monitor-name {
              display: none;
            }
          }
          .sub-monitor-contain {
            display: flex;
            width: 100%;
            height: 100%;
            overflow: auto;
            padding-top: 10px;
            .sub-monitor {
              padding: 5px;
              flex-shrink: 0;
              margin: 0 10px;
              height: calc(100% - 10px);
              width: 262px;
              display: flex;
              flex-direction: column;
              align-items: center;
              position: relative;
              ::v-deep .monitor-player-cls {
                .xgplayer-controls {
                  display: none;
                }
                .xgplayer-start {
                  display: none;
                }
              }
              .monitor-name {
                color: white;
                font-size: 14px;
                margin-top: 2%;
              }
            }
          }
        }
      }
    }
  }
}
</style>
