<template>
  <div class="control-content cyber-scroll-bar-small">
    <div class="situation-content">
      <div class="top-content">
        <!-- //态势导调类型占比 -->
        <div class="chart-one">
          <block fontSize="16" :title="$t('rbt.situationPilotType')"> </block>
          <div class="chart-style">
            <chart-one
              :pieData="chartOneData"
              :total-count="totalCount"
              v-if="chartOneData && chartOneData.length > 0"
              :refresh-types="refreshTypes"
            ></chart-one>
            <!-- 暂无数据 -->
            <div
              v-else
              class="empty-comp"
              style="
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
              "
            >
              <empty-page ref="emptyComp" />
            </div>
          </div>
        </div>
        <!-- 攻击类型Top5统计 -->
        <div class="chart-two">
          <block fontSize="16" :title="$t('rbt.attackTypeTop5')"> </block>
          <div class="chart-style">
            <chart-two
              v-if="typeName.length !== 0"
              :className="typeName"
              :data="typeCount"
              :showXLabel="true"
            ></chart-two>
            <!-- 暂无数据 -->
            <div
              v-else
              class="empty-comp"
              style="
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
              "
            >
              <empty-page ref="emptyComp" />
            </div>
          </div>
        </div>
        <!-- 态势导调时间分布 -->
        <div class="chart-three">
          <block fontSize="16" :title="$t('rbt.situationPilotTime')"> </block>
          <div class="chart-style">
            <chart-three
              :xData="xData"
              :yData="yData"
              v-if="this.xData && this.xData.length !== 0"
              :is-fresh="isFresh"
            ></chart-three>
            <!-- 暂无数据 -->
            <div
              v-else
              class="empty-comp"
              style="
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
              "
            >
              <empty-page ref="emptyComp" />
            </div>
          </div>
          <!-- 导调记录按钮 -->
          <div class="pilot-style" @click="recordFn">
            <cb-iconfont type="icon-jianda" class="icon-style"></cb-iconfont>
            <span> {{ this.$t('rbt.pilotRecord') }}</span>
          </div>
        </div>
      </div>
      <div class="middle-content">
        <!-- 任务导调配置 -->
        <div class="task-config">
          <block fontSize="16" :title="$t('rbt.taskPilotConfig')"> </block>
          <div class="config-content">
            <task-config
              :controlSceneId="controlSceneId"
              :controlTopoId="controlTopoId"
              @taskTypes="taskTypes"
              @taskTops="taskTops"
              @taskTimes="taskTimes"
            ></task-config>
          </div>
        </div>
        <div class="hand-config">
          <!-- 手动导调配置 -->
          <block fontSize="16" :title="$t('rbt.handPilotConfig')">
            <div class="config-content">
              <hand-config
                :controlSceneId="this.controlSceneId"
                :controlTopoId="this.controlTopoId"
                :screenName="screenName"
                @refreshTop="refreshTop"
                @refreshTime="refreshTime"
                @refreshType="refreshType"
              ></hand-config>
            </div>
          </block>
          <!-- 攻防模型按钮 -->
          <div class="model-style" @click="modelFn">
            <span class="title">{{ this.$t('rbt.attackDefenseModel') }}</span>
            <cb-iconfont type="icon-shuoming" class="icon-style"></cb-iconfont>
          </div>
        </div>
      </div>
      <div class="bottom-content">
        <div class="collect-event">
          <block fontSize="16" :title="$t('rbt.hostCollectEvent')"> </block>
          <div class="table-content">
            <collect-event
              :controlSceneId="controlSceneId"
              @refreshHost="refreshHost"
            ></collect-event>
          </div>
        </div>
        <div class="flow-event">
          <block fontSize="16" :title="$t('rbt.flowCollectEvent')"> </block>
          <div class="event-style" @click="eventFn">
            <span class="title">{{ this.$t('rbt.eventModel') }}</span>
            <cb-iconfont type="icon-shuoming" class="icon-style"></cb-iconfont>
          </div>

          <div>
            <flow-list
              :controlSceneId="controlSceneId"
              @refreshFlow="refreshFlow"
            ></flow-list>
          </div>
        </div>
      </div>
    </div>
    <!-- 攻防模型弹框 -->
    <model-content
      :model-visible="modelVisible"
      @modelVisibleChange="modelVisibleChange"
      :model-data="modelData"
    ></model-content>
    <!-- 导调记录弹框 -->
    <polit-record
      :record-visible="recordVisible"
      @recordVisibleChange="recordVisibleChange"
    ></polit-record>
    <!-- 事件模型弹框 -->
    <event-model
      :event-visible="eventVisible"
      @eventVisibleChange="eventVisibleChange"
      :event-model="eventModel"
    ></event-model>
  </div>
</template>

<script>
import wsutil from '@/utils/websocket';
import utils from '@/utils/utils';
import EmptyPage from '@/pages/web/Empty';
import Block from '@/components/block';
import ChartOne from './red-blue-situation/chart-one.vue';
import ChartTwo from './red-blue-situation/chart-two.vue';
import ChartThree from './red-blue-situation/chart-three.vue';
import TaskConfig from './red-blue-situation/task-config/task-config.vue'; //任务导调配置
import HandConfig from './red-blue-situation/hand-config/hand-config.vue'; //手动导调配置
import ModelContent from './red-blue-situation/hand-config/model-content.vue'; //攻防模型
import FlowList from './red-blue-situation/flow-list.vue';
import CollectEvent from './red-blue-situation/collect-event.vue';
import PolitRecord from './red-blue-situation/polit-record.vue'; //导调记录
import EventModel from './red-blue-situation/event-model.vue'; //导调记录
import {
  getSituationTypeApi,
  getAttackTypeApi,
  getTimeDataApi,
  getAttackModelApi,
  getEventModelApi,
} from '@/api/web/team-training';
export default {
  props: {
    // 接收场景启动场景id
    controlSceneId: {
      type: String,
      default: '',
    },
    // 接收场景未启动拓扑id
    controlTopoId: {
      type: String,
      default: '',
    },
    screenName: {
      type: String,
      default: '',
    },
  },
  components: {
    EmptyPage,
    Block,
    ChartOne,
    ChartTwo,
    ChartThree,
    TaskConfig,
    HandConfig,
    FlowList,
    CollectEvent,
    ModelContent,
    PolitRecord,
    EventModel,
  },
  data() {
    return {
      cookie: '',
      refreshTypes: 0,
      isFresh: 0,
      chartOneData: [],
      xData: [],
      yData: [],
      typeCount: [],
      typeName: [],
      modelVisible: false, //动效墨香弹框
      recordVisible: false, //导调记录弹框
      eventVisible: false, //事件模型弹框
      modelData: {},
      eventModel: [],
      totalCount: 0,
    };
  },
  created() {
    this.resource_id = this.$route.params.resource_id;
  },
  mounted() {
    this.getStatisticData();
    this.TopData();
    this.getTimeData();
    this.cookie = utils.getCookie('cr_jwttoken');
    this.statusWs();
  },
  methods: {
    // 态势导调类型占比
    getStatisticData() {
      getSituationTypeApi({ room_id: this.resource_id }).then((res) => {
        this.chartData = res.data.data.list || [];
        this.totalCount = res.data.data.total_count;
        this.chartOneData = [];
        if (this.chartData.length) {
          this.chartData.forEach((item) => {
            this.chartOneData.push({
              value: item.count,
              name: item.guide_name,
            });
          });
        }
      });
    },
    // 攻击类型Top5统计
    TopData() {
      getAttackTypeApi({ room_id: this.resource_id })
        .then((res) => {
          this.rankingData = res.data.data;
          this.typeCount = [];
          this.typeName = [];
          this.rankingData.forEach((item) => {
            this.typeCount.push(item.count);
            this.typeName.push(item.name);
          });
        })
        .catch((err) => {
          this.$serverError(err);
        });
    },
    // 态势导调时间分布
    getTimeData() {
      getTimeDataApi({ room_id: this.resource_id }).then((res) => {
        this.chartThreeData = res.data.data || [];
        this.xData = this.chartThreeData.time_list;
        this.yData = this.chartThreeData.count_list;
      });
    },
    // 点击导调记录查看
    recordFn() {
      this.recordVisible = true;
    },
    recordVisibleChange(data) {
      this.recordVisible = data;
    },
    // 点击攻防模型查看
    modelFn() {
      getAttackModelApi(null).then((res) => {
        this.modelData = res.data.data;
      });
      this.modelVisible = true;
    },
    modelVisibleChange(data) {
      this.modelVisible = data;
    },
    // 点击事件模型查看
    eventFn() {
      getEventModelApi(null).then((res) => {
        this.eventModel = res.data.data;
      });
      this.eventVisible = true;
    },
    eventVisibleChange(data) {
      this.eventVisible = data;
    },
    // 更新 refreshTop  攻击类型Top5统计
    refreshTop(data) {
      if (data) {
        this.TopData();
      }
    },
    //更新 refreshTime 态势导调时间分布
    refreshTime(data) {
      this.getTimeData();
      this.isFresh = this.isFresh + 1;
    },
    //更新类型占比 refreshType
    refreshType(data) {
      if (data) {
        this.getStatisticData();
        this.refreshTypes = this.refreshTypes + 1;
      }
    },

    // 任务导调配置更新相关
    taskTypes(data) {
      if (data) {
        this.getStatisticData();
        this.refreshTypes = this.refreshTypes + 1;
      }
    },
    taskTops(data) {
      if (data) {
        this.TopData();
      }
    },
    taskTimes(data) {
      this.getTimeData();
      this.isFresh = this.isFresh + 1;
    },

    // 主机采集事件更新相关
    refreshHost(data) {
      if (data) {
        this.getStatisticData();
        this.refreshTypes = this.refreshTypes + 1;
      }
    },
    // 流量分析事件更新相关
    refreshFlow(data) {
      if (data) {
        this.getStatisticData();
        this.refreshTypes = this.refreshTypes + 1;
      }
    },
    //ws推送
    statusWs() {
      wsutil.bind(
        `/ojj/ws/cr/ce_base/mission?business_id=${this.resource_id}&token=${this.cookie}`,
        (data) => {
          if (data.code === 10) {
            //  更新上面三个图表
            this.refreshType();
            this.TopData();
            this.refreshTime();
          }
        },
      );
    },
  },
  watch: {},
};
</script>

<style scoped lang="scss">
.control-content {
  width: 100%;
  height: calc(100% - 50px);
  // padding: 16px;
  // background: var(--bg-color-2);
  overflow-y: scroll;
  .situation-content {
    width: 100%;
    height: 100%;
    .top-content {
      height: 268px;
      display: flex;
      .chart-one,
      .chart-two,
      .chart-three {
        width: calc((100% - 32px) / 3);
        background: var(--bg-color-2);
        border-radius: 4px;
        padding: 16px;
        .chart-style {
          position: relative;
          height: calc((100% - 32px));
          ::v-deep .empty_page {
            .not-data {
              .cb-iconfont {
                font-size: 56px !important;
              }
            }
          }
        }
      }
      .chart-two {
        margin: 0px 16px;
      }
      .chart-three {
        position: relative;
        .pilot-style {
          position: absolute;
          right: 16px;
          top: 16px;
          font-size: 14px;
          color: var(--neutral7);
          cursor: pointer;
          .icon-style {
            color: var(--neutral7);
          }
          &:hover {
            color: var(--primary-color) !important;
          }
          &:hover .cb-iconfont {
            fill: var(--primary-color) !important;
          }
        }
      }
    }
    .middle-content {
      background: var(--bg-color-2);
      height: 458px;
      margin: 16px 0px;
      display: flex;
      padding: 16px;
      border-radius: 4px;
      .task-config,
      .hand-config {
        height: 100%;
        width: calc((100% - 16px) / 2);
        background: var(--bg-color-3);
        // border-radius: 4px;
        padding: 16px;
      }
      .hand-config {
        position: relative;
        .model-style {
          position: absolute;
          right: 16px;
          top: 16px;
          font-size: 14px;
          color: var(--neutral7);
          cursor: pointer;
          .icon-style {
            color: var(--neutral7);
          }
          &:hover {
            color: var(--primary-color) !important;
          }
          &:hover .cb-iconfont {
            fill: var(--primary-color) !important;
          }
        }
      }
      .task-config {
        margin-right: 16px;
        ::v-deep .cb-block-title-container {
          margin-bottom: 8px;
        }

        .config-content {
          height: calc((100% - 32px));
          width: 100%;
        }
      }
    }
    .bottom-content {
      background: var(--bg-color-2);
      height: 540px;
      display: flex;
      .collect-event,
      .flow-event {
        width: calc((100% - 16px) / 2);
        background: var(--bg-color-2);
        // border-radius: 4px;
        padding: 16px;
        position: relative;
        .event-style {
          position: absolute;
          right: 16px;
          top: 16px;
          font-size: 14px;
          color: var(--neutral7);
          cursor: pointer;
          .icon-style {
            color: var(--neutral7);
          }
          &:hover {
            color: var(--primary-color) !important;
          }
          &:hover .cb-iconfont {
            fill: var(--primary-color) !important;
          }
        }
      }
      .collect-event {
        background: var(--bg-color-3);
        margin: 16px;
      }
      .flow-event {
        background: var(--bg-color-3);
        margin: 16px 16px 16px 0;
      }
    }
  }
}
</style>
