<template>
  <!-- 红蓝对抗事件管理 -->
  <div id="trafficEventManagement">
    <div class="left-echart fl">
      <div class="event-title">
        {{ $t('m.trafficEventManagement') }}
      </div>
      <div style="width: 100%; height: 100%">
        <div class="fl" style="width: 100%; height: 40%">
          <event-chart :id="leftId" :light="light" :flow-data="flowData" />
        </div>
        <div class="fl" style="width: 100%; height: 40%">
          <event-chart :id="rightId" :light="light" :flow-data="flowData" />
        </div>
      </div>
    </div>
    <div class="content fr">
      <div class="trafficEventManagement-bottom elc-table">
        <cb-scrollbar>
          <cb-search-table
            :cols="columns"
            :data-source="flowTableData"
            :hidePaginOnDemand="true"
            :searchBarBg="false"
          >
            <template v-slot:operation="scope">
              <cb-button type="text" @click="clickFlow(scope.data)">
                {{ $t('m.startFlow') }}
              </cb-button>
            </template>
          </cb-search-table>
        </cb-scrollbar>
      </div>
    </div>
  </div>
</template>

<script>
import _ from 'lodash';
import utils from '@/utils/utils';
import wsutil from '@/utils/websocket';
import eventChart from '@/components/TaskEditor/event_chart_simple.vue';

export default {
  components: {
    eventChart,
  },
  filters: {},
  props: {
    crEventData: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      scene_manager_id: '',
      // 左侧的环形图
      flowData: {
        ig_traffic: 0,
        bg_traffic: 0,
        running_count: 0,
        not_start_count: 0,
      },
      leftId: 'leftId',
      rightId: 'rightId',
      listen: new this.$ListenDomChange({
        dom: document.body,
        callback: this.listenFunc,
      }),
      light: '',
      columns: [
        {
          label: this.$t('m.target'),
          prop: 'node_name',
        },
        {
          label: this.$t('m.flow'),
          prop: 'name',
        },
        {
          label: this.$t('m.explain'),
          prop: 'desc',
        },
        {
          label: this.$t('m.trafficClass'),
          getData: (row) => {
            /* let category = _.get(row, 'category', '') || ''; */
            const { category } = row;
            if (category === 0 || category) {
              if (category === 0) {
                return this.$t('traffic.testFlow');
              } else if (category === 1) {
                return this.$t('traffic.applicationUpgrade');
              } else if (category === 2) {
                return this.$t('traffic.networkManage');
              } else if (category === 3) {
                return this.$t('traffic.P2P');
              } else if (category === 4) {
                return this.$t('traffic.financial');
              } else if (category === 5) {
                return this.$t('traffic.mail');
              } else if (category === 6) {
                return this.$t('traffic.safeWork');
              } else if (category === 7) {
                return this.$t('traffic.distributedComputation');
              } else if (category === 8) {
                return this.$t('traffic.mobilePhone');
              } else if (category === 9) {
                return this.$t('traffic.mobileDevice');
              } else if (category === 10) {
                return this.$t('traffic.IM');
              } else if (category === 11) {
                return this.$t('traffic.SCADA');
              } else if (category === 12) {
                return this.$t('traffic.maneuvering');
              } else if (category === 13) {
                return this.$t('traffic.remoteControl');
              } else if (category === 14) {
                return this.$t('traffic.AV');
              } else if (category === 15) {
                return this.$t('traffic.enterpriseApplication');
              } else if (category === 16) {
                return this.$t('traffic.socialNetworkSearch');
              } else if (category === 17) {
                return this.$t('traffic.fileTransfer');
              } else if (category === 18) {
                return this.$t('traffic.database');
              } else if (category === 19) {
                return this.$t('traffic.identityAuthentication');
              } else if (category === 20) {
                return this.$t('traffic.ERP');
              } else if (category === 21) {
                return this.$t('traffic.storage');
              } else if (category === 22) {
                return this.$t('traffic.game');
              } else if (category === 23) {
                return this.$t('traffic.secureDataTransmission');
              } else {
                return '-';
              }
            } else {
              return '-';
            }
          },
        },
        {
          label: this.$t('m.trafficType'),
          getData: (row) => {
            const { interactive_type } = row;
            if (interactive_type === 1) {
              return this.$t('traffic.dynamicTraffic');
            } else if (interactive_type === 0) {
              return this.$t('traffic.staticTraffic');
            }
          },
        },
        {
          label: this.$t('m.status'),
          getData: (row) => {
            /* -1初始化、0关闭、1运行、2错误、3准备中 */
            const { status } = row;
            if (status === -1) {
              return this.$t('m.initialize');
            } else if (status === 0) {
              return this.$t('m.close');
            } else if (status === 1) {
              return this.$t('m.run');
            } else if (status === 2) {
              return this.$t('m.error');
            } else if (status === 3) {
              return this.$t('m.ready');
            }
          },
        },
        {
          label: this.$t('m.numberExecutions'),
          getData: (row) => {
            const { count } = row;
            if (count) {
              return `${count}`;
            } else {
              return '0';
            }
          },
        },
        {
          label: this.$t('m.action'),
          slot: 'operation',
        },
      ],
      flowTableData: [],
      trafficListsCopy: [],
      resource_id: this.$route.params && this.$route.params.resource_id,
      cookie: '',
    };
  },
  computed: {},
  watch: {
    crEventData: {
      handler(val, oldval) {
        if (!_.isEmpty(val.data)) {
          this.scene_manager_id = val.data.scene_manager_id;
          this.initFlow();
        }
      },
      deep: true,
      immediate: true,
    },
  },
  created() {},
  mounted() {
    this.cookie = utils.getCookie('cr_jwttoken');
    this.listen.createListen();
    this.bindSceneWs();
  },
  beforeDestroy() {
    this.listen.destroyListen();
  },
  methods: {
    // 监听换肤，动态reload echarts
    listenFunc() {
      const className = document.body.className.split(' ');
      if (className.indexOf('theme-dark') != -1) {
        this.light = 'dark';
      } else {
        this.light = 'light';
      }
    },
    // 获取流量集合
    initFlow() {
      this.$request
        .get(
          '/cr/red_vs_blue/scene/flow',
          { room_id: this.resource_id },
          { baseURL: '/api/ojj' },
        )
        .then((res) => {
          const flowList = _.get(res, 'data.data.data', []) || [];
          this.flowTableData = flowList;
          this.trafficListsCopy = flowList;
          let attackCount = 0,
            bgCount = 0,
            runningCount = 0,
            notStartCount = 0;
          flowList.forEach((item) => {
            // 流量类型统计
            if (item.interactive_type === 1) {
              attackCount++;
            } else if (item.interactive_type === 0) {
              bgCount++;
            }
            // 运行状态统计
            if (item.status === 1) {
              runningCount++;
            } else if (item.status !== 1) {
              notStartCount++;
            }
          });
          this.flowData = {
            ig_traffic: attackCount,
            bg_traffic: bgCount,
            running_count: runningCount,
            not_start_count: notStartCount,
          };
        });
    },

    // ws实时更新流量
    bindSceneWs() {
      wsutil.cbind(
        `/ojj/ws/cr/ce_base/scene?business_id=${this.resource_id}&token=${this.cookie}`,
        {
          '': (data) => {
            this.callAction = data?.data?.call_action;
            if (this.callAction) {
              const wsFlowList =
                  data?.data?.scene_element_plugin_data?.cpflow?.flows,
                wsSceneElementId = data?.data?.scene_element.id; // 场景中节点的id

              if (wsFlowList && wsFlowList.length && wsSceneElementId) {
                const wsFlowListTemp = wsFlowList; // ws实时获取的流量列表
                const trafficListsCopy = this.trafficListsCopy; // flow_list接口返回的流量列表
                for (let i = 0, len = trafficListsCopy.length; i < len; i++) {
                  /* 判断 场景中节点的id 和 flow_list接口返回的流量列表的node_id 是否一致*/
                  if (wsSceneElementId === trafficListsCopy[i].node_id) {
                    for (
                      let j = 0, lenJ = wsFlowListTemp.length;
                      j < lenJ;
                      j++
                    ) {
                      /* 判断 ws返回的流量的id 和 flow_list接口返回的流量id 是否一致,一致才更新流量*/
                      if (wsFlowListTemp[j].id === trafficListsCopy[i].id) {
                        /* ws拿到的数据缺少node_id和node_name,要和flow_list匹配,添加这两个属性 */
                        wsFlowListTemp[j].node_name =
                          trafficListsCopy[i].node_name;
                        wsFlowListTemp[j].node_id = trafficListsCopy[i].node_id;
                        trafficListsCopy[i] = wsFlowListTemp[j];
                      }
                    }
                  }
                }
                this.flowTableData = [...trafficListsCopy];
                // 1. 获取status为1的数量 2.
                let running_count = this.flowTableData.filter(
                  (flow) => flow.status === 1,
                ).length;
                this.flowData = {
                  ...this.flowData,
                  // 运行中
                  running_count: running_count,
                  // 未运行
                  not_start_count: this.flowTableData.length - running_count,
                };
              }
            }
          },
        },
      );
    },

    // 启动流量
    clickFlow(traffic) {
      const { id, node_id } = traffic;
      this.$request
        .post(
          '/cr/red_vs_blue/scene/flow',
          {
            flow_id: id,
            node_id,
            room_id: this.resource_id,
          },
          { baseURL: '/api/ojj' },
        )
        .then((res) => {
          this.$message({
            message: this.$t('m.actionSuccess'),
            type: 'success',
          });
        })
        .catch((error) => {});
    },
  },
};
</script>

<style lang="scss">
#trafficEventManagement {
  height: 100% !important;
  .left-echart {
    width: 20%;
    height: 100%;
    .event-title {
      position: relative;
      display: block;
      padding: 30px 0;
      text-align: center;
      color: var(--neutral8);
      box-sizing: border-box;
    }
  }
  .header {
    margin-bottom: 15px;
    width: 100%;
  }
  .traffic-tips {
    color: #bd1212 !important;
  }
  .content {
    width: 80%;
    height: 100%;
    .trafficEventManagement-bottom {
      height: 90%;
      margin-bottom: 10px;
      border-radius: 2px;

      .trafficEventManagement-footer {
        height: 5%;
      }
      .cb-scrollbar {
        height: 100%;
        .name-wrapper {
          display: inline-block;
        }
        .cb-scrollbar__wrap {
          overflow-x: hidden;
          height: 100%;
        }
      }
    }
  }
}
</style>
