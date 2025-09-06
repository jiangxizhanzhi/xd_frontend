<template>
  <div
    class="training-report cyber-scroll-bar-small"
    v-loading="loading"
    :element-loading-text="$t('common.exporting') + '...'"
  >
    <!-- 左侧装饰 -->
    <div class="left-side">
      <left-decorate></left-decorate>
    </div>
    <!-- 右侧装饰 -->
    <div class="right-side">
      <right-decorate></right-decorate>
    </div>
    <!-- 头部区域 -->
    <div class="header">
      <div class="title">{{ crEventData.data.name }}</div>
      <div class="train-info">
        <div class="admin-info">
          <span>
            <cb-iconfont
              :size="14"
              type="icon-zhanghao"
              class="train-member-icon"
            ></cb-iconfont>
          </span>
          <span>{{ $t('m.trainTeacher') }}{{ '：' }}</span>
          <span class="user-name">{{ teacher_name }} </span>
        </div>
        <div class="training-time">
          <span>
            <cb-iconfont
              :size="14"
              type="icon-shijian1"
              class="train-member-icon"
            ></cb-iconfont>
          </span>
          <span>{{ $t('m.trainsTimes') }}{{ '：' }}</span>
          <span>{{ detailData.start_time }}</span>
        </div>
        <div class="training-duration">
          <span>
            <cb-iconfont
              :size="14"
              type="icon-daishenhe"
              class="train-member-icon"
            ></cb-iconfont>
          </span>
          <span>{{ $t('m.trainDuration') }}{{ '：' }}</span>
          <span>{{ detailData.time_cost }}</span>
        </div>
      </div>
      <div class="btn-wrap">
        <cb-button hollow @click="exportTemplate">{{
          $t('m.exportReport')
        }}</cb-button>
      </div>
    </div>
    <!-- 详情 -->
    <div class="train-detail">
      <!-- 时长、类别、难度 -->
      <div class="basic-info">
        <!-- 时长 -->
        <div class="basic-item time">
          <cb-iconfont :size="16" type="icon-lishizuijinshijian"></cb-iconfont>
          <span class="info-name">{{ $t('list.duration') }}：</span>
          <span class="info-value">{{
            crEventData.data.duration_time
              ? crEventData.data.duration_time + 'h'
              : '-'
          }}</span>
        </div>
        <!-- 类别 -->
        <div class="basic-item type">
          <cb-iconfont :size="16" type="icon-yingyongxitong"></cb-iconfont>
          <span class="info-name">{{ $t('list.category') }}：</span>
          <span class="info-value">{{
            computedCategory(crEventData.data.category)
          }}</span>
        </div>
        <!-- 难度 -->
        <div class="basic-item">
          <cb-iconfont :size="16" type="icon-dengji"></cb-iconfont>
          <span class="info-name">{{ $t('list.difficulty') }}：</span>
          <span class="info-value">{{
            computedDiffculty(crEventData.data.difficult)
          }}</span>
        </div>
      </div>
      <!-- 前置技能 -->
      <div class="pre-skill">
        <div class="skill-name">{{ $t('m.frontSkills') }}：</div>
        <div class="tag-wrap">
          <span
            class="skill-tag"
            :key="index"
            v-for="(item, index) in crEventData.data.pre_skill"
            :title="item"
            >{{ item }}</span
          >
        </div>
      </div>
      <!-- 训练技能 -->
      <div class="train-skill">
        <div class="skill-name">{{ $t('list.trainingSkill') }}：</div>
        <div class="tag-wrap">
          <span
            class="skill-tag"
            :key="index"
            v-for="(item, index) in crEventData.data.train_skill"
            :title="item"
            >{{ item }}</span
          >
        </div>
      </div>
      <!-- 训练描述 -->
      <div class="train-description">
        <div class="desc-name">{{ $t('list.trainingDesc') }}：</div>
        <div class="desc-content" :title="crEventData.data.description">
          {{ crEventData.data.description }}
        </div>
      </div>
      <!-- 角色信息 -->
      <div class="role-wrap">
        <div class="role-name">{{ $t('list.roleInfo') }}：</div>
        <div class="role-group">
          <div class="role-detail" v-for="role in userList" :key="role.name">
            <!-- 左侧 -->
            <div class="left-wrap">
              <img :src="role.logo || defaultLogo" />
            </div>
            <!-- 右侧 -->
            <div class="right-wrap">
              <!-- 名称 -->
              <div class="user-name" :title="role.name">
                {{ role.name }}
              </div>
              <div class="type-wrap">
                <!-- 角色名 -->
                <div class="role-classify" :title="role.role_name">
                  {{ role.role_name }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 图表区域 -->
    <div class="chart-list">
      <div class="chart-wrap">
        <!-- 任务分类 -->
        <div class="chart-item">
          <block :title="$t('rbt.taskClassification')"></block>
          <task-classify
            v-if="ready && task_kind_count"
            :pieData="pieData"
            :count="task_kind_count"
          ></task-classify>
          <!-- 暂无数据 -->
          <div
            v-else
            style="
              width: 100%;
              position: absolute;
              top: 50%;
              left: 50%;
              transform: translate(-50%, -50%);
            "
          >
            <empty-page ref="emptyComp" />
          </div>
        </div>
        <!-- 攻击事件 -->
        <div class="chart-item">
          <block :title="$t('rbt.attackTechniques')"></block>
          <attack-techniques
            v-if="ready && attackCount"
            :pieData="attack_type"
            :count="attackCount"
          ></attack-techniques>
          <!-- 暂无数据 -->
          <div
            v-else
            style="
              width: 100%;
              position: absolute;
              top: 50%;
              left: 50%;
              transform: translate(-50%, -50%);
            "
          >
            <empty-page ref="emptyComp" />
          </div>
        </div>
        <!-- 攻击趋势 -->
        <div class="chart-item">
          <block :title="$t('rbt.attackTrends')"></block>
          <attack-trend
            v-if="ready && trafficLineData.xData.length"
            :lineData="trafficLineData"
          ></attack-trend>
          <!-- 暂无数据 -->
          <div
            v-else
            style="
              width: 100%;
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
      <div class="score-trend-wrap">
        <block :title="$t('m.scoringTrend')"> </block>
        <div
          class="tip-info"
          :style="{
            left: language === 'en-US' ? '150px' : '100px',
          }"
        >
          {{ $t('rbt.only10') }}
        </div>
        <div class="chart-item">
          <score-trend
            v-if="xData.length"
            :seriesData="seriesData"
            :xData="xData"
          ></score-trend>
          <!-- 暂无数据 -->
          <div
            v-else
            style="
              width: 100%;
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
      <div class="personnel-score-wrap">
        <block :title="$t('m.personnelScore')"></block>
        <div class="personnel-score">
          <personnel-score :score-info="socreList"></personnel-score>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getLanguage } from '@cyber/helper';
import defaultLogo from '@/assets/img/userhead.png';
import { getTrainingCategory, getDifficultLists } from '@/api/web/red-blue';
import leftDecorate from '@/components/PublicList/left-decorate.vue';
import rightDecorate from '@/components/PublicList/right-decorate.vue';
import block from '@/components/block';
import taskClassify from './components/task-classify.vue';
import attackTechniques from './components/attack-techniques.vue';
import attackTrend from './components/attack-trend.vue';
import scoreTrend from './components/score-trend.vue';
import personnelScore from './components/personnel-score.vue';
import EmptyPage from '@/pages/web/Empty/behavior-index.vue';
import {
  trainingReportApi,
  trainReportApi,
  attackMethodsApi,
  attackTrendApi,
} from '@/api/web/team-training';
// import { singleFormatTime } from '@/assets/js/tools.js';

export default {
  components: {
    leftDecorate,
    rightDecorate,
    block,
    taskClassify,
    attackTechniques,
    attackTrend,
    scoreTrend,
    personnelScore,
    EmptyPage,
  },
  props: {
    crEventData: {
      type: Object,
      default: () => {},
    },
    sceneId: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      //导出报告loading
      loading: false,
      language: getLanguage(),
      defaultLogo,
      teacher_name: '',
      detailData: {},
      userList: [],
      socreList: [],
      categoryList: [],
      difficultList: [],
      seriesData: [],
      team_trends: [],
      pieData: [],
      kind_map: {
        aa: 1,
        bb: 2,
      },
      task_kind_count: 0,
      ready: false,
      attack_type: [],
      attackCount: 0,
      trafficLineData: {
        xData: [],
        yData: [],
      },
    };
  },
  watch: {
    sceneId: {
      handler(val) {
        if (val) {
          this.getAttackMethods();
          this.getAttackTrend();
        }
      },
      deep: true,
      immediate: true,
    },
  },
  computed: {},
  created() {
    this.getTrainingCategory();
    this.getDifficultLists();
    // this.initReportData();
    this.getTrainReport();
  },
  mounted() {
    // this.pieData = [
    //   {
    //     name: '管理员',
    //     value: 38,
    //   },
    //   {
    //     name: '导演',
    //     value: 6,
    //   },
    //   {
    //     name: '裁判',
    //     value: 4,
    //   },
    //   {
    //     name: '其他用户',
    //     value: 11,
    //   },
    // ];
    this.ready = true;
  },
  methods: {
    // 攻击事件
    getAttackMethods() {
      const data = {
        sceneId: this.sceneId,
        top_n_with_other: 5,
      };
      attackMethodsApi(data).then((res) => {
        const data = _.get(res, 'data.data');
        this.attack_type = data.map((el) => ({
          name: el.attack_type,
          value: el.times,
        }));
        data.map((item) => {
          this.attackCount = this.attackCount + item.times;
        });
      });
    },
    // 攻击趋势
    getAttackTrend() {
      const data = {
        sceneId: this.sceneId,
      };
      attackTrendApi(data).then((res) => {
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
    // 初始化报告数据
    // initReportData() {
    //   trainingReportApi({
    //     resource_id: this.$route.params.resource_id,
    //   }).then((res) => {
    //     this.detailData = _.get(res, 'data.data');
    //     this.userList = _.get(res, 'data.data.users');
    //   });
    // },
    getTrainReport() {
      this.xData = [];
      this.seriesData = [];
      trainReportApi({
        resource_id: this.$route.params.resource_id,
        scoreCount: 10,
      }).then((res) => {
        const data = _.get(res, 'data.data');
        this.teacher_name = data.teacher_name;
        this.detailData = data.room_base_info;
        this.userList = data.user_roles;
        this.socreList = data.get_score_rsps;
        this.team_trends = data.team_trends;
        this.kind_map = data.kind_map;
        this.handleData(this.kind_map);
        this.task_kind_count = data.task_kind_count || 0;
        data.team_trends.map((item) => {
          const obj = {};
          obj.name = item.user_data.rep_name;
          obj.data = item.score_trends.map((child) => child.score);
          this.seriesData.push(obj);
          this.xData = item.score_trends.map((child) => child.score_time);
        });
        // 取前20条数据
        if (this.seriesData.length > 10) {
          this.seriesData = this.seriesData.slice(0, 10);
        }
      });
    },
    handleData(data) {
      this.pieData = [];
      for (const key in data) {
        const obj = {};
        obj.name = key;
        obj.value = data[key];
        this.pieData.push(obj);
      }
    },
    getTrainingCategory() {
      getTrainingCategory({ type: 3 }).then((res) => {
        const data = _.get(res, 'data.data', []);
        this.categoryList = data.map((item) => {
          return {
            label: item.name,
            value: item.code,
          };
        });
        this.categoryList.unshift({
          label: this.$t('list.allTraining'),
          value: '',
        });
      });
    },
    getDifficultLists() {
      getDifficultLists({ type: 24 }).then((res) => {
        const data = _.get(res, 'data.data', []);
        this.difficultList = data.map((item) => {
          return {
            label: item.name,
            value: item.code,
          };
        });
        this.difficultList.unshift({
          label: this.$t('list.allDifficulty'),
          value: '',
        });
      });
    },
    computedCategory(category) {
      const data = this.categoryList.filter((item) => {
        return item.value === category;
      });
      if (data.length) {
        return data[0].label;
      }
    },
    computedDiffculty(difficult) {
      const data = this.difficultList.filter((item) => {
        return item.value === difficult;
      });
      if (data.length) {
        return data[0].label;
      }
    },

    // 团队训练报告导出
    exportTemplate() {
      this.loading = true;
      this.$request
        .binaryDownload(
          'get',
          '/cr/team_train/room/mission/TrainReportsPdf',
          { resource_id: this.$route.params.resource_id },
          {
            baseURL: '/api/ojj',
          },
        )
        .then((res) => {
          this.loading = false;
        })
        .catch(() => {
          this.loading = false;
        });
    },
  },
};
</script>
<style lang="scss" scoped>
.training-report {
  width: 100%;
  height: 100%;
  background: var(--bg-color-2);
  position: relative;
  overflow-y: scroll;
  overflow-x: hidden;
  padding-bottom: 16px;
  border-radius: 4px;
  .left-side {
    position: absolute;
    left: -5px;
    top: 0;
    bottom: 0;
    height: 100%;
  }
  .right-side {
    position: absolute;
    right: -5px;
    top: 0;
    bottom: 0;
    height: 100%;
  }
  .header {
    height: 97px;
    margin: 0 40px;
    border-bottom: 1px solid var(--neutral1);
    padding-top: 16px;
    position: relative;
    .title {
      color: var(--neutral8);
      font-size: 20px;
      text-align: center;
    }
    .train-info {
      margin-top: 10px;
      height: 22px;
      line-height: 22px;
      display: flex;
      justify-content: center;
      font-size: 14px;
      color: var(--neutral8);
      div {
        margin: 0 12px;
        max-width: 20%;
      }
      .admin-info,
      .director-info,
      .referee-info,
      .training-time,
      .training-duration {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        .train-member-icon {
          color: var(--neutral7);
        }
      }
    }
    .btn-wrap {
      position: absolute;
      right: 0;
      bottom: 20px;
    }
  }
  .train-detail {
    margin: 0 40px;
    .basic-info {
      display: flex;
      align-items: center;
      position: relative;
      margin: 16px 0;
      .basic-item {
        display: flex;
        align-items: center;
        margin-right: 26px;
        min-width: 80px;
        .info-name {
          margin-left: 5px;
          font-size: 14px;
          color: var(--neutral5);
        }
        .info-value {
          font-size: 14px;
          color: var(--neutral8);
        }
      }
      .time {
        min-width: 90px;
      }
      .node {
        min-width: 90px;
      }
      .type {
        min-width: 120px;
      }
    }
    .train-skill,
    .pre-skill {
      display: flex;
      position: relative;
      margin-top: 4px;
      .skill-name {
        font-size: 14px;
        color: var(--neutral7);
        margin-bottom: 10px;
        min-width: 70px;
      }
      .tag-wrap {
        .skill-tag {
          display: inline-block;
          height: 22px;
          line-height: 22px;
          background-color: var(--neutral0);
          padding: 0 8px;
          margin-right: 4px;
          margin-bottom: 4px;
          font-size: 12px;
          color: var(--neutral8);
        }
      }
    }
    .train-description {
      margin-top: 4px;
      display: flex;
      .desc-name {
        font-size: 14px;
        color: var(--neutral7);
        min-width: 70px;
      }
      .desc-content {
        font-size: 14px;
        line-height: 20px;
        color: var(--neutral8);
        display: -webkit-box;
        overflow: hidden;
        -webkit-line-clamp: 3;
        -webkit-box-orient: vertical;
      }
    }
    .role-wrap {
      margin-top: 16px;
      display: flex;
      .role-name {
        font-size: 14px;
        color: var(--neutral7);
        min-width: 70px;
      }
      .role-group {
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        .role-detail {
          margin-right: 24px;
          display: flex;
          margin-bottom: 16px;
          // width: 60px;
          .left-wrap {
            width: 46px;
            height: 46px;
            border-radius: 50%;
            background: var(--nav-text);
            margin-right: 4px;
            overflow: hidden;
            img {
              width: 100%;
              height: 100%;
            }
          }
          .right-wrap {
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            .user-name {
              height: 22px;
              font-size: 14px;
              color: var(--neutral8);
              max-width: 144px;
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
            }
            .type-wrap {
              display: flex;
              align-items: center;
              .role-type {
                width: 40px;
                height: 22px;
                line-height: 22px;
                text-align: center;
                font-size: 12px;
                border-radius: 2px;
              }
              .green {
                background: var(--green-color-2);
                color: var(--green-color);
              }
              .red {
                background: var(--red-color-2);
                color: var(--red-color);
              }
              .blue {
                background: var(--blue-color-2);
                color: var(--blue-color);
              }
              .role-classify {
                min-width: 60px;
                max-width: 100px;
                height: 22px;
                line-height: 22px;
                font-size: 12px;
                color: var(--neutral5);
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
                text-align: center;
                margin-left: 4px;
                padding: 0 8px;
                background: var(--neutral0);
              }
            }
          }
        }
      }
    }
  }
  .chart-list {
    margin: 0 16px;
    .chart-wrap {
      height: 292px;
      display: flex;
      .chart-item {
        background: var(--bg-color-3);
        margin-right: 16px;
        flex: 1;
        padding: 16px;
        position: relative;
        border-radius: 2px;
        &:last-child {
          margin-right: 0;
        }
      }
    }
    .score-trend-wrap {
      margin-top: 16px;
      height: 296px;
      padding: 16px;
      background: var(--bg-color-3);
      position: relative;
      border-radius: 2px;
      .tip-info {
        position: absolute;
        top: 18px;
        left: 100px;
        font-size: 14px;
        color: var(--neutral5);
      }
      .chart-item {
        height: calc(100% - 36px);
      }
    }
    .personnel-score-wrap {
      margin-top: 16px;
      padding: 16px;
      background: var(--bg-color-3);
      border-radius: 2px;
      .personnel-score {
        height: calc(100% - 36px);
      }
    }
  }
}
</style>
