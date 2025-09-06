<template>
  <div class="blue-battle">
    <div v-loading="loading" class="blue-tow-top">
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
    <div class="blue-four-middel">
      <div class="task-pending task">
        <div class="title">{{ $t('m.taskProgress') }}</div>
        <div class="chart">
          <char-line-smooth
            v-loading="loading"
            :data-info="bluepointLineData"
          />
        </div>
      </div>
    </div>
    <div class="blue-four-botton">
      <div class="task-pending task">
        <div class="title">{{ $t('m.taskClassification') }}</div>
        <div class="chart">
          <attack-flow-histogram
            v-loading="typeLoading"
            :data-info="blueattackFlowInfo"
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
      role_type: this.$CONSTANT.DataDisplay.BLUETEAM.value,
      blueColor: ['#00475F', '#005875', '#0091C0', '#00C0FF', '#00C0FF'],
      bluepointLineData: {
        dataLabel: [],
        dataValue1: [],
        dataValue2: [],
        axisLineColor: 'rgba(67,154,255,.2)', // 坐标轴颜色
        axisLabelColor: 'rgba(255,255,255,1)', // 坐标轴label颜色
        lineColor1: '#D6DEE5', // 折线的颜色
        lineColor2: '#39EFFF', // 折线的颜色
        pointColor: '#39EFFF', // 拐点颜色
        pointBorderColor: '#1E213B', // 拐点边框颜色
        marNumber: 10,
      },
      blueattackFlowInfo: {
        dataLabel: [],
        dataValue: [],
        axisTickColor: 'rgba(255,255,255,0)', // 刻度线颜色
        axisLineColor: 'rgba(214,222,229,.2)', // 坐标轴颜色
        axisLabelColor: 'rgba(255,255,255,1)', // 坐标轴label颜色
        linearColors: ['rgba(57, 239, 255, 1)', 'rgba(58, 165, 255, 1)'], // 渐变色
      },
    };
  },
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
      this.bluepointLineData.dataLabel = [];
      this.bluepointLineData.dataValue1 = [];
      this.bluepointLineData.dataValue2 = [];
      this.bluepointLineData.marNumber = 10;
      // 实时状况蓝方获取任务下发和完成任务数进展
      this.$request
        .get(
          '/cr/red_vs_blue/statistics/team_mission_progress',
          { resource_id: scene_hash, role_type: role_type },
          { baseURL: '/api/ojj' },
        )
        .then((res) => {
          this.total_members = _.get(res, 'data.data.total_members', 0);
          this.total_mission = _.get(res, 'data.data.total_mission', 0);
          this.completed_mission = _.get(res, 'data.data.completed_mission', 0);
          this.completed_radio = _.get(res, 'data.completed_radio', 0);
          this.bluepointLineData.dataLabel = _.get(res, 'data.data.x_data', []);
          this.bluepointLineData.dataValue1 = _.get(
            res,
            'data.data.y_total',
            [],
          );
          this.bluepointLineData.dataValue2 = _.get(
            res,
            'data.data.y_complete',
            [],
          );
          this.bluepointLineData.marNumber = parseInt(
            this.bluepointLineData.dataLabel.length / 10,
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
      this.blueattackFlowInfo.dataLabel = [];
      this.blueattackFlowInfo.dataValue = [];
      // 实时战况蓝色任务分类
      this.$request
        .get(
          '/cr/red_vs_blue/statistics/team_mission_category',
          {
            resource_id: this.resource_id,
            role_type: this.role_type,
          },
          { baseURL: '/api/ojj' },
        )
        .then((res) => {
          this.blueattackFlowInfo.dataLabel = _.get(res, 'data.data.xdata', []);
          this.blueattackFlowInfo.dataValue = _.get(res, 'data.data.ydata', []);
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
.blue-battle {
  width: 100%;
  height: 100%;
  .blue-tow-top {
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
      margin-bottom: 10px;
      background: url('~@/assets/img/dataDisplay/blue-team.png');
      .le {
        width: 50%;
        text-align: right;
        line-height: 118px;
        font-size: 24px;
        font-weight: bold;
        background: linear-gradient(
          0deg,
          rgba(57, 239, 255, 1) 0%,
          rgba(58, 165, 255, 1) 100%
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
        span {
          background: linear-gradient(
            0deg,
            rgba(57, 239, 255, 1) 0%,
            rgba(58, 165, 255, 1) 100%
          );
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
      }
    }
    .tip-bottom {
      width: 100%;
      height: 118px;
      background: url('~@/assets/img/dataDisplay/blue-task.png');
      .rr {
        height: 100%;
        .to {
          height: 50%;
          text-align: right;
          font-size: 34px;
          font-family: Impact;
          font-weight: 400;
          line-height: 90px;
          span {
            background: linear-gradient(
              0deg,
              rgba(57, 239, 255, 1) 0%,
              rgba(58, 165, 255, 1) 100%
            );
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
          }
          // letter-spacing: 5px;
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
  .blue-four-middel {
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
        background: url('~@/assets/img/dataDisplay/blue-name-bg.png') center
          center no-repeat;
        background-size: cover;
      }
      .chart {
        height: 100%;
      }
    }
  }
  .blue-four-botton {
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
        background: url('~@/assets/img/dataDisplay/blue-name-bg.png') center
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
