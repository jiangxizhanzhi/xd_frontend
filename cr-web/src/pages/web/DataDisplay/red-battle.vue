<template>
  <div class="red-battle">
    <div v-loading="loading" class="red-tow-top">
      <div class="tip-top">
        <div class="le fl wh60">{{ $t('m.teamMember') }}</div>
        <div class="ri fr wh40">
          <span>{{ total_members }}</span>
        </div>
      </div>
      <div class="tip-bottom">
        <div class="le fl">{{ $t('m.task') }}</div>
        <div class="rr fr">
          <div class="to">
            <span>{{ completed_mission }} / {{ total_mission }}</span>
          </div>
          <div class="btm">
            {{ $t('m.completeded') }} / {{ $t('m.issued') }}
          </div>
        </div>
      </div>
      <!-- <div class="left-square">
            <div class="all">
              <div class="number">{{total_mission}}</div>
              <div class="text-info">已下发任务数</div>
            </div>
          </div>
          <div class="middle-square">
            <div class="all">
            <div class="number">{{completed_mission}}</div>
            <div class="text-info">完成数</div>
            </div>
          </div>
          <div class="right-square">
            <div class="all">
            <div class="number">{{completed_radio}}%</div>
            <div class="text-info">任务进展</div>
            </div>
          </div> -->
    </div>
    <div class="red-four-middel">
      <div class="task-pending task">
        <div class="title">{{ $t('m.taskProgress') }}</div>
        <div class="chart">
          <char-line-smooth v-loading="loading" :data-info="pointLineData" />
        </div>
      </div>
    </div>
    <div class="red-four-botton">
      <div class="task-pending task">
        <div class="title">{{ $t('m.taskClassification') }}</div>
        <div class="chart">
          <attack-flow-histogram
            v-loading="typeLoading"
            :data-info="attackFlowInfo"
          />
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import CharLineSmooth from '@/pages/web/DataDisplay/components/char_line_smooth.vue';
import AttackFlowHistogram from '@/pages/web/DataDisplay/components/attack_flow_battle.vue';
import { errorMessage } from '@/assets/js/tools.js';
import _ from 'lodash';
export default {
  components: {
    CharLineSmooth,
    AttackFlowHistogram,
  },
  data() {
    return {
      loading: false,
      typeLoading: false,
      timer: null,
      completed_mission: 0,
      completed_radio: 0,
      total_mission: 0,
      total_members: 0,
      role_type: this.$CONSTANT.DataDisplay.REDTEAM.value,
      redColor: [
        '#6D0004',
        '#830005',
        '#980006',
        '#A60006',
        '#BF0007',
        '#DC0008',
        '#FF0009',
      ],
      pointLineData: {
        dataLabel: [],
        dataValue1: [],
        dataValue2: [],
        axisLineColor: 'rgba(67,154,255,.2)', // 坐标轴颜色
        axisLabelColor: 'rgba(255,255,255,1)', // 坐标轴label颜色
        lineColor1: '#D6DEE5', // 折线的颜色
        lineColor2: '#FF6744', // 折线的颜色
        pointColor: '#FF6744', // 拐点颜色
        pointBorderColor: '#1E213B', // 拐点边框颜色
        marNumber: 10,
      },
      attackFlowInfo: {
        dataLabel: [],
        dataValue: [],
        axisTickColor: 'rgba(255,255,255,0)', // 刻度线颜色
        axisLineColor: 'rgba(214,222,229,.2)', // 坐标轴颜色
        axisLabelColor: 'rgba(255,255,255,1)', // 坐标轴label颜色
        linearColors: ['rgba(255, 103, 68, 1)', 'rgba( 255, 32, 32, 1)'], // 渐变色
      },
    };
  },
  // mounted(){
  //   this.getMission()
  // },
  created() {
    this.resource_id = this.$route.params && this.$route.params.resource_id;
    this.getMission();
    this.getType();
    this.timer = setInterval(() => {
      this.getAllData();
    }, 1000 * 60);
  },
  beforeDestroy() {
    clearInterval(this.timer);
  },
  destroyed() {
    clearInterval(this.timer);
  },
  methods: {
    getAllData() {
      this.getMission();
      this.getType();
    },
    getMission() {
      this.loading = true;
      const scene_hash = this.resource_id;
      const role_type = this.role_type;
      this.total_mission = 0;
      this.total_members = 0;
      this.completed_mission = 0;
      this.completed_radio = 0;
      this.pointLineData.dataLabel = [];
      this.pointLineData.dataValue1 = [];
      this.pointLineData.dataValue2 = [];
      this.pointLineData.marNumber = 10;
      // 实时状况红方获取任务下发和完成任务数进展
      this.$request
        .get(
          '/cr/red_vs_blue/statistics/team_mission_progress',
          { resource_id: scene_hash, role_type: role_type },
          { baseURL: '/api/ojj' },
        )
        .then((res) => {
          this.total_mission = _.get(res, 'data.data.total_mission', 0);
          this.total_members = _.get(res, 'data.data.total_members', 0);
          this.completed_mission = _.get(res, 'data.data.completed_mission', 0);
          this.completed_radio = _.get(res, 'data.completed_radio', 0);
          this.pointLineData.dataLabel = _.get(res, 'data.data.x_data', []);
          this.pointLineData.dataValue1 = _.get(res, 'data.data.y_total', []);
          this.pointLineData.dataValue2 = _.get(
            res,
            'data.data.y_complete',
            [],
          );
          this.pointLineData.marNumber = parseInt(
            this.pointLineData.dataLabel.length / 10,
          );
        })
        .catch((error) => {
          errorMessage(error, this);
        })
        .finally(() => {
          this.loading = false;
        });
    },
    getType() {
      this.typeLoading = true;
      this.attackFlowInfo.dataLabel = [];
      this.attackFlowInfo.dataValue = [];
      // 实时战况红色任务分类
      this.$request
        .get(
          '/cr/red_vs_blue/statistics/team_mission_category',
          { resource_id: this.resource_id, role_type: this.role_type },
          { baseURL: '/api/ojj' },
        )
        .then((res) => {
          this.attackFlowInfo.dataLabel = _.get(res, 'data.data.xdata', []);
          this.attackFlowInfo.dataValue = _.get(res, 'data.data.ydata', []);
        })
        .catch((error) => {
          errorMessage(error, this);
        })
        .finally(() => {
          this.typeLoading = false;
        });
    },
  },
};
</script>
<style lang="scss" scoped>
.wh60 {
  width: 60% !important;
}
.wh40 {
  width: 40% !important;
}
.red-battle {
  width: 100%;
  height: 100%;
  .red-tow-top {
    width: calc(100% - 40px);
    height: 30%;
    margin: 0 20px;
    display: flex;
    justify-content: flex-start;
    flex-wrap: wrap;
    .tip-top,
    .tip-bottom {
      width: 100%;
      height: 118px;
      background: url('~@/assets/img/dataDisplay/red-team.png');
      margin-bottom: 10px;
      .le {
        width: 50%;
        text-align: right;
        line-height: 118px;
        font-size: 24px;
        font-weight: bold;
        background: linear-gradient(
          0deg,
          rgba(255, 103, 68, 1) 0%,
          rgba(255, 32, 32, 1) 100%
        );
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
      }
      .ri {
        width: 50%;
        text-align: right;
        line-height: 118px;
        font-size: 34px;
        font-family: Impact;
        font-weight: 400;
        // color: deeppink;
        span {
          background: linear-gradient(
            0deg,
            rgba(255, 103, 68, 1) 0%,
            rgba(255, 32, 32, 1) 100%
          );
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
      }
    }
    .tip-bottom {
      background: url('~@/assets/img/dataDisplay/red-task.png');
      margin-bottom: 0;
      .rr {
        height: 100%;
        .to {
          height: 50%;
          text-align: right;
          font-size: 34px;
          font-family: Impact;
          font-weight: 400;
          line-height: 90px;
          // color: deeppink;
          span {
            background: linear-gradient(
              0deg,
              rgba(255, 103, 68, 1) 0%,
              rgba(255, 32, 32, 1) 100%
            );
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            // letter-spacing: 5px;
          }
        }
        .btm {
          height: 50%;
          text-align: right;
          font-size: 14px;
          font-weight: 400;
          color: rgba(240, 241, 247, 0.8);
          letter-spacing: 3px;
        }
      }
    }
  }
  .red-four-middel {
    width: 100%;
    height: 32%;
    margin-bottom: 20px;
    // background: url('~@/assets/img/dataDisplay/chart-bottom.png') center bottom no-repeat;
    .task {
      width: 100%;
      height: calc(100% - 20px);
      .title {
        width: 146px;
        height: 38px;
        margin: 10px auto 0;
        text-align: center;
        font-size: 18px;
        font-weight: normal;
        color: rgba(240, 241, 247, 1);
        line-height: 38px;
        background: url('~@/assets/img/dataDisplay/red-name-bg.png') center
          center no-repeat;
        background-size: cover;
      }
      .chart {
        height: 100%;
      }
    }
  }
  .red-four-botton {
    width: 100%;
    height: 33%;
    // background: url('~@/assets/img/dataDisplay/chart-bottom.png') center bottom no-repeat;
    .task {
      width: 100%;
      height: calc(100% - 20px);
      .title {
        width: 146px;
        height: 38px;
        margin: 20px auto 0;
        text-align: center;
        font-size: 18px;
        font-weight: normal;
        color: rgba(240, 241, 247, 1);
        line-height: 38px;
        background: url('~@/assets/img/dataDisplay/red-name-bg.png') center
          center no-repeat;
        background-size: cover;
      }
      .chart {
        height: 100%;
      }
    }
  }
}
</style>
