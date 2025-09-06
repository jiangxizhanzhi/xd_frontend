<template>
  <!-- 团队教员探针采集页面采集数据 -->
  <div class="host-collect-info" v-loading="loading">
    <div class="left-area">
      <cb-scrollbar>
        <div>
          <!-- 主机数据下拉框 -->
          <cb-select
            v-model="currentHost"
            :options="hostOptions"
            :first="HostFirstOption"
            @change="changeHost"
          ></cb-select>
        </div>
        <div class="tree-data">
          <!-- 主机列表事件 -->
          <cb-tree
            ref="treeList"
            :data="treeData"
            :props="defaultProps"
            :default-expand-all="true"
            :expand-on-click-node="false"
            @node-click="handleNodeClick"
            node-key="code"
            :empty-text="$t('m.noData')"
          >
            <span class="slot-node" slot-scope="{ node }">
              <span :title="node.label">{{ node.label }}</span>
            </span>
          </cb-tree>
        </div>
      </cb-scrollbar>
    </div>
    <!-- 右侧数据展示 -->
    <div class="right-area">
      <cb-scrollbar>
        <div
          class="search"
          v-if="currentMenu == 'isDoc' || currentMenu == 'isReg'"
        >
          <!-- 级别选择 -->
          <cb-select
            v-model="level"
            :options="docLevelOptions"
            :first="docLevelFirstOption"
            @change="changeLevel"
          >
          </cb-select>
          <span class="time">
            <!-- 日期选择 -->
            <cb-date-picker
              v-model="startEndTime"
              type="daterange"
              :range-separator="$t('m.to')"
              :start-placeholder="$t('m.startTime')"
              :end-placeholder="$t('m.endTime')"
              @change="timeChange"
            >
            </cb-date-picker>
          </span>
        </div>
        <!-- 文件变更事件 -->
        <div v-if="currentMenu == 'isDoc'">
          <div class="doc-change-num">
            <p class="title">
              <i></i>
              <span>{{ $t('test.docChangeNum') }}</span>
            </p>
            <div style="width: 100%; height: 300px">
              <div v-if="!isShow" style="width: 100%; height: 300px">
                <bar-chart :barColor="'primary-color'" :dataList="docBarData">
                </bar-chart>
              </div>
              <div v-else class="no-data">
                <div class="info">
                  <cb-iconfont type="icon-zanwuziyuan" size="56"></cb-iconfont>
                  <div>{{ $t('flowEmulation.noData') }}</div>
                </div>
              </div>
            </div>
          </div>
          <div class="doc-change-table">
            <div class="title">
              <i></i>
              <span>{{ $t('test.docChangeList') }}</span>
              <!--              <cb-input-->
              <!--                class="inputStyle"-->
              <!--                v-model="docPath"-->
              <!--                clearable-->
              <!--                @keyup.enter.native="searchDocPath"-->
              <!--                :placeholder="$t('test.enterFilePath')"-->
              <!--              />-->
            </div>
            <div class="table">
              <cb-search-table
                ref="docTable"
                :url="docUrl"
                :data="docQuery"
                baseURL="/api/mp"
                :cols="docColumns"
                :searchBarBg="false"
              >
                <template v-slot:searchRightArea>
                  <cb-input
                    class="custom-search-input"
                    v-model="docQuery.path"
                    clearable
                    :placeholder="$t('test.enterFilePath')"
                  />
                </template>
                <template v-slot:operation="scope">
                  <cb-button type="text" @click="viewDetail(scope.data)">
                    {{ $t('m.view') }}
                  </cb-button>
                </template>
              </cb-search-table>
            </div>
          </div>
        </div>
        <!-- 注册表变更事件 -->
        <div v-if="currentMenu == 'isReg'">
          <div class="doc-change-num">
            <p class="title">
              <i></i>
              <span>{{ $t('test.regChangeNum') }}</span>
            </p>
            <div style="width: 100%; height: 300px">
              <div v-if="!regShow" style="width: 100%; height: 300px">
                <bar-chart :barColor="'primary-color'" :dataList="regBarData">
                </bar-chart>
              </div>
              <div v-else class="no-data">
                <div class="info">
                  <cb-iconfont type="icon-zanwuziyuan" size="56"></cb-iconfont>
                  <div>{{ $t('flowEmulation.noData') }}</div>
                </div>
              </div>
            </div>
          </div>
          <!-- 注册表变更列表 -->
          <div class="doc-change-table">
            <div class="title">
              <i></i>
              <span>{{ $t('test.regChangeList') }}</span>
              <!--              <cb-input-->
              <!--                class="inputStyle"-->
              <!--                v-model="regName"-->
              <!--                clearable-->
              <!--                @keyup.enter.native="searchRegName"-->
              <!--                :placeholder="$t('test.enterRegName')"-->
              <!--              />-->
            </div>
            <div class="table">
              <cb-search-table
                ref="regTable"
                :url="regUrl"
                :data="regQuery"
                baseURL="/api/mp"
                :cols="regColumns"
                :searchBarBg="false"
              >
                <template v-slot:searchRightArea>
                  <cb-input
                    class="custom-search-input"
                    v-model="regQuery.path"
                    clearable
                    :placeholder="$t('test.enterRegName')"
                  />
                </template>
                <template v-slot:operation="scope">
                  <cb-button type="text" @click="viewDetail(scope.data)">
                    {{ $t('m.view') }}
                  </cb-button>
                </template>
              </cb-search-table>
            </div>
          </div>
        </div>

        <div v-if="currentMenu == 'isOrigin'">
          <!-- 原始日志 -->
          <div>
            <div class="table">
              <cb-search-table
                ref="originTable"
                :cols="originColumns"
                :url="oriLogUrl"
                :data="oriLogQuery"
                baseURL="/api/mp"
                rowKey="resource_id"
                :selection.sync="originSelection"
                :searchBarBg="false"
              >
                <template v-slot:search>
                  <cb-button
                    :disabled="originSelection.length === 0"
                    button-type="import"
                    hollow
                    @click="downloadFile"
                  >
                    {{ $t('test.batchDownload') }}
                  </cb-button>
                </template>
              </cb-search-table>
            </div>
          </div>
        </div>

        <div v-if="currentMenu == 'isLog'">
          <!-- 日志事件 -->
          <div>
            <div class="table">
              <cb-search-table
                ref="logTable"
                :cols="logEventColumns"
                :url="logEventUrl"
                :data="logEventQuery"
                baseURL="/api/mp"
                :searchBarBg="false"
              >
                <template v-slot:search>
                  <cb-select
                    v-model="logEventQuery.appNames"
                    :options="logApplyOptions"
                    :first="logApplyFirstOption"
                  >
                  </cb-select>
                  <cb-select
                    v-model="logEventQuery.levels"
                    :options="logLevelOptions"
                    :first="logLevelFirstOption"
                  >
                  </cb-select>
                  <span class="time">
                    <cb-date-picker
                      v-model="logStartEndTime"
                      type="daterange"
                      :range-separator="$t('m.to')"
                      :start-placeholder="$t('m.startTime')"
                      :end-placeholder="$t('m.endTime')"
                      @change="logTimeChange"
                    >
                    </cb-date-picker>
                  </span>
                  <cb-input
                    style="width: 250px"
                    v-model="logEventQuery.keyword"
                    clearable
                    :placeholder="$t('test.enterRuleDesc')"
                  />
                </template>
              </cb-search-table>
            </div>
          </div>
        </div>

        <div v-if="currentMenu == 'isCollect'">
          <!-- 自定义采集 -->
          <div>
            <div class="table">
              <cb-search-table
                ref="collectTable"
                :cols="collectColumns"
                :url="collectUrl"
                :data="collectQuery"
                baseURL="/api/mp"
                :searchBarBg="false"
              >
                <template v-slot:search>
                  <span class="time">
                    <cb-date-picker
                      v-model="collectStartEndTime"
                      type="daterange"
                      :range-separator="$t('m.to')"
                      :start-placeholder="$t('m.startTime')"
                      :end-placeholder="$t('m.endTime')"
                      @change="collectTimeChange"
                    >
                    </cb-date-picker>
                  </span>
                  <cb-input
                    v-model="collectQuery.keyword"
                    clearable
                    :placeholder="$t('test.enterProbeName')"
                  />
                </template>
              </cb-search-table>
            </div>
          </div>
        </div>
      </cb-scrollbar>
    </div>
    <cb-dialog
      :title="$t('m.details')"
      :visible.sync="detailVisible"
      append-to-body
      @close="handleClose"
      custom-class="detail-wrapper"
      height="500px"
    >
      <div v-if="detailFullLogData" class="detail-list-wrapper">
        <span>{{ detailFullLogData }}</span>
      </div>
      <empty v-else class="empty-box"></empty>
    </cb-dialog>
  </div>
</template>

<script>
import moment from 'moment';
import BarChart from './bar-chart';
import { getAllCollectTypeApi } from '@/api/web/team-training';
import Empty from '../../../../Empty';

export default {
  components: {
    BarChart,
    Empty,
  },
  // 接收的sceneId
  props: {
    sceneId: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      loading: false,
      //控制图表显示
      currentMenu: 'isDoc',
      treeData: [],
      defaultProps: {
        children: 'children',
        label: 'name',
      },
      currentHost: null,
      hostOptions: [],
      HostFirstOption: {
        label: this.$t('test.allHosts'),
        value: null,
      },

      //文件变更事件参数
      isShow: true,
      detailVisible: false,
      detailFullLogData: '',
      docUrl: '',
      docQuery: {
        sceneId: '',
        elementIds: '',
        startTime: '',
        endTime: '',
        levels: '',
        path: '',
      },
      docPath: '',
      docDataList: [],
      docBarData: [],
      level: null,
      startEndTime: null,
      startTime: '',
      endTime: '',
      docLevelFirstOption: {
        label: this.$t('test.allLevels'),
        value: null,
      },
      // 高,中,低级别
      docLevelOptions: [
        {
          label: this.$t('test.high'),
          value: '10,11,12,13,14,15',
        },
        {
          label: this.$t('test.middle'),
          value: '5,6,7,8,9',
        },
        {
          label: this.$t('test.low'),
          value: '0,1,2,3,4',
        },
      ],

      //注册表事件参数
      regShow: true,
      regUrl: '',
      regQuery: {
        sceneId: '',
        elementIds: '',
        startTime: '',
        endTime: '',
        levels: '',
        path: '',
      },
      regName: '',
      regBarData: [],
      regDataList: [],

      //原始日志
      oriLogUrl: '',
      oriLogQuery: {
        sceneId: '',
        elementIds: '',
      },
      originDataList: [],
      originSelection: [],

      //日志事件参数
      logEventUrl: '',
      logEventQuery: {
        id: '',
        nodeIds: '',
        levels: '',
        catagories: '',
        startTime: '',
        endTime: '',
        keyword: '',
        appNames: '',
      },
      logEventType: '',
      logEventDataList: [],
      logStartEndTime: null,
      logStartTime: null,
      logEndTime: null,
      logEventName: '',
      logApplyValue: null,
      logApplyOptions: [],
      logApplyFirstOption: {
        label: this.$t('test.allApply'),
        value: '',
      },
      logLevel: null,
      logLevelOptions: [
        {
          label: this.$t('test.high'),
          value: '10,11,12,13,14,15',
        },
        {
          label: this.$t('test.middle'),
          value: '5,6,7,8,9',
        },
        {
          label: this.$t('test.low'),
          value: '0,1,2,3,4',
        },
      ],
      logLevelFirstOption: {
        label: this.$t('test.allLevels'),
        value: '',
      },

      //自定义采集
      collectUrl: '',
      collectQuery: {
        id: '',
        nodeIds: '',
        keyword: '',
        startTime: '',
        endTime: '',
      },
      probeName: '',
      collectDataList: [],
      collectStartEndTime: null,
      collectStartTime: '',
      collectEndTime: '',

      getLevel: (value) => {
        if (value >= 0 && value <= 4) {
          return this.$t('test.low');
        } else if (value >= 5 && value <= 9) {
          return this.$t('test.middle');
        } else if (value >= 10) {
          return this.$t('test.high');
        } else {
          return '-';
        }
      },
      getFileSize: (size) => {
        if (size === null || size === '' || size === undefined) {
          return '-';
        }
        //把字节转换成正常文件大小
        var num = 1024.0; //byte
        if (size < num) {
          return size + 'B';
        } else if (size < Math.pow(num, 2)) {
          return (size / num).toFixed(2) + 'KB'; //KB
        } else if (size < Math.pow(num, 3)) {
          return (size / Math.pow(num, 2)).toFixed(2) + 'M'; //M
        } else if (size < Math.pow(num, 4)) {
          return (size / Math.pow(num, 3)).toFixed(2) + 'G'; //G
        } else {
          return (size / Math.pow(num, 4)).toFixed(2) + 'T'; //T
        }
      },

      docColumns: [
        {
          label: this.$t('test.hostName'),
          prop: 'node_name',
        },
        {
          label: this.$t('test.times'),
          prop: 'time',
        },
        {
          label: this.$t('test.docName'),
          prop: 'path',
        },
        {
          label: this.$t('test.action'),
          prop: 'event_desc',
        },
        {
          label: this.$t('test.level'),
          getData: (row) => {
            return this.getLevel(row.level);
          },
        },
        {
          label: this.$t('test.doc'),
          getData: (row) => {
            return this.getFileSize(row.file_size);
          },
        },
        {
          label: this.$t('common.operation'),
          slot: 'operation',
        },
      ],
      regColumns: [
        {
          label: this.$t('test.hostName'),
          prop: 'node_name',
        },
        {
          label: this.$t('test.regName'),
          prop: 'path',
        },
        {
          label: this.$t('test.times'),
          prop: 'time',
        },
        {
          label: this.$t('test.action'),
          prop: 'event_desc',
        },
        {
          label: this.$t('test.beforeModify'),
          prop: 'md5_before',
        },
        {
          label: this.$t('test.afterModify'),
          prop: 'md5_after',
        },
        {
          label: this.$t('test.level'),
          getData: (row) => {
            return this.getLevel(row.level);
          },
        },
        {
          label: this.$t('common.operation'),
          slot: 'operation',
        },
      ],
      originColumns: [
        {
          label: this.$t('test.docName'),
          prop: 'path',
        },
        {
          label: this.$t('test.fileSize'),
          getData: (row) => {
            return this.getFileSize(row.size);
          },
        },
        {
          label: this.$t('test.times'),
          prop: 'create_time',
        },
      ],
      logEventColumns: [
        {
          label: this.$t('test.hostName'),
          prop: 'node_name',
        },
        {
          label: this.$t('test.times'),
          prop: 'time',
        },
        {
          label: this.$t('test.applyName'),
          prop: 'app_name',
        },
        {
          label: this.$t('test.eventName'),
          prop: 'event_desc',
        },
        {
          label: this.$t('test.level'),
          getData: (row) => {
            return this.getLevel(row.level);
          },
        },
        {
          label: this.$t('test.rule'),
          prop: 'description',
        },
      ],
      collectColumns: [
        {
          label: this.$t('test.hostName'),
          prop: 'node_name',
        },
        {
          label: this.$t('test.probeName'),
          prop: 'probe_name',
        },
        {
          label: this.$t('test.detail'),
          getData: (data) => {
            //转字符串后去掉首尾{}括号
            const content = JSON.stringify(data.content).substr(1).slice(0, -1);
            return content;
          },
        },
        {
          label: this.$t('test.times'),
          prop: 'time',
        },
      ],
    };
  },
  created() {
    this.resource_id = this.$route.params && this.$route.params.resource_id;
  },
  mounted() {},
  watch: {
    // 监听场景id
    sceneId: {
      handler: function (val, oldval) {
        if (val) {
          this.currentMenu = 'isDoc';
          this.getMachineList();
          this.getAllEventType();
          this.getDocChangeChart();
          this.docUrl = 'cscene/monitor/scene/element/file_modify';
          this.docQuery.sceneId = val;
          // this.getDocChangeTable();
        } else {
          this.currentMenu = 'isDoc';
          this.hostOptions = [];
          this.treeData = [];
          this.isShow = true;
          this.docBarData = [];
          this.docUrl = '';
          this.docQuery.sceneId = '';
          this.$nextTick(() => {
            this.$refs.docTable.empty();
          });
        }
      },
      immediate: true,
    },
  },
  beforeDestroy() {},
  methods: {
    viewDetail(data) {
      this.detailVisible = true;
      this.detailFullLogData = data.content?.full_log || '';
    },
    handleClose() {
      this.detailFullLogData = '';
    },
    // 获取下拉框主机列表
    getMachineList() {
      this.$request
        .get(
          `cscene/monitor/scene/all_elements/${this.sceneId}?is_collect=true`,
          null,
          {
            baseURL: '/api/mp',
          },
        )
        .then((res) => {
          const data = _.get(res, 'data.data', []) || [];
          const list = data.map((item) => {
            return {
              label: item.name,
              value: item.id,
            };
          });
          this.hostOptions = [...list];
        });
    },
    //获取所有事件类型
    getAllEventType() {
      getAllCollectTypeApi({ sceneId: this.sceneId }).then((res) => {
        const data = _.get(res, 'data.data', []) || [];
        this.treeData = [...data];
        this.$nextTick(() => {
          if (this.$refs.treeList != undefined) {
            this.$refs.treeList.setCurrentKey(
              this.treeData[0].children[0].code,
              true,
              false,
            ); // 默认选中第一条
          }
        });
      });
    },
    //文件变更柱状图
    getDocChangeChart() {
      const params = {};
      if (this.sceneId) {
        params.sceneId = this.sceneId;
      }
      if (this.currentHost) {
        params.elementIds = this.currentHost;
      }
      if (this.startEndTime) {
        params.startTime = this.startTime;
        params.endTime = this.endTime;
      }
      if (this.level) {
        params.levels = this.level;
      }
      this.$request
        .get(`cscene/monitor/scene/element/file_modify_histogram`, params, {
          baseURL: '/api/mp',
        })
        .then((res) => {
          const data = _.get(res, 'data.data', []);
          if (data.length) {
            this.isShow = false;
            this.docBarData = data;
          } else {
            this.isShow = true;
          }
        });
    },
    //注册表变更柱状图
    getRegChangeChart() {
      const params = {};
      if (this.sceneId) {
        params.sceneId = this.sceneId;
      }
      if (this.currentHost) {
        params.elementIds = this.currentHost;
      }
      if (this.startEndTime) {
        params.startTime = this.startTime;
        params.endTime = this.endTime;
      }
      if (this.level) {
        params.levels = this.level;
      }
      this.$request
        .get(`cscene/monitor/scene/element/registry_modify_histogram`, params, {
          baseURL: '/api/mp',
        })
        .then((res) => {
          const data = _.get(res, 'data.data', []);
          if (data.length) {
            this.regShow = false;
            this.regBarData = data;
          } else {
            this.regShow = true;
          }
        });
    },
    //原始日志下载
    downloadFile() {
      if (this.$_.isEmpty(this.originSelection)) {
        return;
      }
      this.loading = true;
      this.originSelection.forEach((item, index) => {
        const params = {
          agentName: item.agent_name,
          osType: item.os_type,
          paths: item.path,
        };
        this.$request
          .get('/cscene/logfile/download_urls', params, {
            baseURL: '/api/mp',
          })
          .then((res) => {
            this.loading = false;
            const url = res.data.data.list[0].download_url;
            const file_name = res.data.data.list[0].name;
            this.$request.binaryDownload(
              'get',
              url,
              {},
              { filename: file_name, baseURL: '' },
            );
          })
          .catch(() => {
            this.loading = false;
          });
      });
    },

    getApplyName() {
      const params = {};
      if (this.sceneId) {
        params.sceneId = this.sceneId;
      }
      if (this.currentHost) {
        params.elementIds = this.currentHost;
      }
      if (this.logEventType) {
        params.catagories = this.logEventType;
      }
      this.$request
        .get(`cscene/collection/type/apps`, params, {
          baseURL: '/api/mp',
        })
        .then((res) => {
          const data = _.get(res, 'data.data', []);
          const options = [];
          _.forEach(data, (item) => {
            let option = {
              lable: item.name,
              value: item.name,
            };
            options.push(option);
          });
          this.logApplyOptions = options;
        });
    },
    // 级别选择切换
    changeLevel() {
      if (!this.sceneId) {
        return;
      }
      //重新调用接口
      if (this.currentMenu == 'isDoc') {
        this.getDocChangeChart();
        this.docQuery.levels = this.level;
      } else {
        this.getRegChangeChart();
        this.regQuery.levels = this.level;
      }
    },
    timeChange() {
      if (!this.sceneId) {
        return;
      }
      if (this.startEndTime) {
        this.startTime = moment(this.startEndTime[0]).format(
          'YYYY-MM-DD HH:mm:ss',
        );
        this.endTime = moment(this.startEndTime[1]).format(
          'YYYY-MM-DD HH:mm:ss',
        );
      } else {
        this.startTime = null;
        this.endTime = null;
      }
      if (this.currentMenu == 'isDoc') {
        this.getDocChangeChart();
        this.docQuery.startTime = this.startTime;
        this.docQuery.endTime = this.endTime;
      } else {
        this.getRegChangeChart();
        this.regQuery.startTime = this.startTime;
        this.regQuery.endTime = this.endTime;
      }
    },
    //切换节点需要重新请求当前页面接口
    changeHost() {
      if (this.currentMenu == 'isDoc') {
        this.getDocChangeChart();
        this.docQuery.elementIds = this.currentHost;
      } else if (this.currentMenu == 'isReg') {
        this.getRegChangeChart();
        this.regQuery.elementIds = this.currentHost;
      } else if (this.currentMenu == 'isOrigin') {
        this.oriLogQuery.elementIds = this.currentHost;
      } else if (this.currentMenu == 'isLog') {
        this.getApplyName();
        this.logEventQuery.nodeIds = this.currentHost;
      } else if (this.currentMenu == 'isCollect') {
        this.collectQuery.nodeIds = this.currentHost;
      }
    },
    //点击左侧分类需切换页面并请求
    handleNodeClick(data) {
      //切换的时候清除搜索条件
      this.level = null;
      this.startEndTime = null;
      this.docQuery.startTime = '';
      this.docQuery.endTime = '';
      this.docQuery.levels = '';
      this.docQuery.path = '';

      this.regQuery.startTime = '';
      this.regQuery.endTime = '';
      this.regQuery.levels = '';
      this.regQuery.path = '';

      this.logEventQuery.appNames = '';
      this.logEventQuery.levels = '';
      this.logEventQuery.startTime = '';
      this.logEventQuery.endTime = '';
      this.logEventQuery.keyword = '';

      this.docPath = '';
      this.regName = '';
      this.logApplyValue = null;
      this.logLevel = null;
      this.logStartEndTime = null;
      this.logEventName = '';

      this.collectQuery.keyword = '';
      this.collectQuery.startTime = '';
      this.collectQuery.endTime = '';
      this.probeName = '';
      this.collectStartEndTime = null;
      const menu = this.currentMenu;
      if (data.type == '0') {
        //重复点击页面菜单时刷新数据
        if (menu == 'isDoc') {
          this.$refs.docTable.reload();
        }
        this.currentMenu = 'isDoc';
        this.getDocChangeChart();
        this.docUrl = 'cscene/monitor/scene/element/file_modify';
        this.docQuery.sceneId = this.sceneId || '';
        this.docQuery.elementIds = this.currentHost || '';
        this.docQuery.levels = this.level || '';
        this.docQuery.path = this.docPath || '';
        this.docQuery.startTime = this.startEndTime || '';
        this.docQuery.endTime = this.startEndTime || '';
      } else if (data.type == '1') {
        if (menu == 'isReg') {
          this.$refs.regTable.reload();
        }
        this.currentMenu = 'isReg';
        this.getRegChangeChart();
        this.regUrl = 'cscene/monitor/scene/element/registry_modify';
        this.regQuery.sceneId = this.sceneId || '';
        this.regQuery.elementIds = this.currentHost || '';
        this.regQuery.levels = this.level || '';
        this.regQuery.path = this.regName || '';
        this.regQuery.startTime = '';
        this.regQuery.endTime = '';
      } else if (data.type == '2') {
        if (menu == 'isOrigin') {
          this.$refs.originTable.reload();
        }
        this.currentMenu = 'isOrigin';
        this.oriLogUrl = 'cscene/logfile/page';
        this.oriLogQuery.sceneId = this.sceneId || '';
        this.oriLogQuery.elementIds = this.currentHost || '';
      } else if (data.type == '3') {
        //重复点击页面菜单时刷新数据，日志事件通过分类来区分
        const category = data.code;
        if (menu == 'isLog') {
          if (this.logEventType == category) {
            this.$refs.logTable.reload();
          }
        }
        this.currentMenu = 'isLog';
        this.logEventUrl = 'cscene/cscene_instances/list_host_events';
        this.logEventType = data.code;
        this.logApplyValue = null;
        this.logEventQuery.appNames = '';
        this.getApplyName();
        this.logEventQuery.id = this.sceneId || '';
        this.logEventQuery.nodeIds = this.currentHost || '';
        this.logEventQuery.levels = this.logLevel || '';
        this.logEventQuery.keyword = this.logEventName || '';
        this.logEventQuery.catagories = this.logEventType || '';
        this.logEventQuery.startTime = '';
        this.logEventQuery.endTime = '';
      } else if (data.type == '4') {
        if (menu == 'isCollect') {
          this.$refs.collectTable.reload();
        } else {
          this.currentMenu = 'isCollect';
          //此处将列表清空因为存在缓存,从日志事件切换过来,因为日志列表参数名与其重复，采集接口无数据时可能显示日志列表数据
          this.$nextTick(() => {
            this.$refs.collectTable.empty();
          });
        }
        this.collectUrl = 'cscene/cscene_instances/get_probe_collection_data';
        this.collectQuery.id = this.sceneId || '';
        this.collectQuery.nodeIds = this.currentHost || '';
        this.collectQuery.keyword = this.probeName || '';
        this.collectQuery.startTime = '';
        this.collectQuery.endTime = '';
      }
    },
    changeApply() {
      // this.getLogEventDataList();
      this.logEventQuery.appNames = this.logApplyValue;
    },
    changelogLevel() {
      this.logEventQuery.levels = this.logLevel;
    },
    logTimeChange() {
      if (this.logStartEndTime) {
        this.logStartTime = moment(this.logStartEndTime[0]).format(
          'YYYY-MM-DD HH:mm:ss',
        );
        this.logEndTime = moment(this.logStartEndTime[1]).format(
          'YYYY-MM-DD HH:mm:ss',
        );
      } else {
        this.logStartTime = null;
        this.logEndTime = null;
      }
      this.logEventQuery.startTime = this.logStartTime;
      this.logEventQuery.endTime = this.logEndTime;
    },
    collectTimeChange() {
      if (this.collectStartEndTime) {
        this.collectStartTime = moment(this.collectStartEndTime[0]).format(
          'YYYY-MM-DD HH:mm:ss',
        );
        this.collectEndTime = moment(this.collectStartEndTime[1]).format(
          'YYYY-MM-DD HH:mm:ss',
        );
      } else {
        this.collectStartTime = null;
        this.collectEndTime = null;
      }
      this.collectQuery.startTime = this.collectStartTime;
      this.collectQuery.endTime = this.collectEndTime;
    },
    searchDocPath() {
      this.docQuery.path = this.docPath;
    },
    searchRegName() {
      this.regQuery.path = this.regName;
    },
    searchEventName() {
      this.logEventQuery.keyword = this.logEventName;
    },
    searchProbeName() {
      this.collectQuery.keyword = this.probeName;
    },
  },
};
</script>

<style lang="scss" scoped>
.host-collect-info {
  display: flex;
  width: 100%;
  height: 100%;
  // min-height: 710px;
  background: var(--bg-color-2);
  .left-area {
    width: 15%;
    border-right: 1px solid var(--neutral0);
    padding: 16px;
    font-size: 14px;
    .tree-data {
      margin-top: 20px;
    }
    .slot-node {
      font-size: 14px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    ::v-deep .cb-select {
      width: 100% !important;
    }
  }
  .right-area {
    width: 85%;
    padding: 16px;
    .search {
      .time {
        margin-left: 5px;
      }
    }
    .doc-change-num {
      background-color: var(--bg-color-3);
      margin-top: 16px;
      padding: 16px;
    }
    .doc-change-table {
      background-color: var(--bg-color-3);
      margin-top: 16px;
      padding: 16px;
      .inputStyle {
        width: 200px;
        float: right;
        margin: 0px 8px 20px 0px;
      }
      .custom-search-input {
        margin-top: -57px;
      }
      .table {
        margin-top: 12px;
      }
    }

    .title {
      height: 40px;
      color: var(--neutral8);
      font-size: 16px;
      i {
        display: inline-block;
        width: 6px;
        height: 8px;
        margin-right: 5px;
        margin-bottom: 2px;
        background: var(--primary-color);
      }
    }
    .no-data {
      height: 100%;
      width: 100%;
      text-align: center;
      position: relative;
      .info {
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        font-size: 14px;
      }
    }
  }
}
.detail-wrapper {
  max-height: 500px;
  .detail-list-wrapper {
    white-space: pre-wrap;
    line-height: 2;
  }
  .empty-box {
    height: 400px;
  }
}
</style>
