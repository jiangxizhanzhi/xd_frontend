<template>
  <div class="student-rating">
    <div class="left-wrap cyber-scroll-bar-small">
      <div
        class="score-item"
        v-for="(role, index) in userList"
        :key="index"
        :class="active === role.user_id ? 'active' : ''"
        @click="scoreFn(role, index)"
      >
        <!-- 左侧 -->
        <div class="logo-wrap">
          <img :src="role.user_avatar" />
        </div>
        <!-- 右侧 -->
        <div class="user-info">
          <!-- 名称 -->
          <div class="user-name">
            {{ role.name }}
          </div>
          <div class="type-wrap">
            <!-- 角色名 -->
            <div class="role-classify" :title="role.role_name">
              {{ role.role_name }}
            </div>
          </div>
        </div>
        <div class="score-wrap">
          <div class="expect-score" v-if="!role.scored">
            {{ $t('rbt.unScored') }}
          </div>
          <div class="score" v-else>
            <span class="num">{{ role.score }}</span>
            <span class="tip">{{ $t('rbt.scores') }}</span>
          </div>
        </div>
      </div>
    </div>
    <div class="right-wrap">
      <div class="train-info">
        <div class="train-item">
          <!-- 训练概况 -->
          <training-overview :trainScore="trainScore"></training-overview>
        </div>
        <div class="train-item">
          <!-- 任务统计 -->
          <task-statistics
            v-if="ready"
            :pieData="pieData"
            :total="totalTask"
          ></task-statistics>
        </div>
        <div class="train-item">
          <!-- 团队技能评分 -->
          <skill-rating :radarData="radarData"></skill-rating>
        </div>
      </div>
      <!-- 综合得分 -->
      <div class="comprehensive-score-wrap">
        <comprehensive-score
          :allData="allData"
          @treeDataChange="handleTreeDataChange"
        ></comprehensive-score>
      </div>
      <div class="submit-wrap">
        <cb-input
          :placeholder="$t('rbt.enterComment')"
          v-model="textarea"
        ></cb-input>
        <cb-button @click="submitScore">{{ $t('rbt.submission') }}</cb-button>
      </div>
    </div>
  </div>
</template>

<script>
import defaultLogo from '@/assets/img/userhead.png';
import trainingOverview from './student-score-content/training-overview.vue';
import taskStatistics from './student-score-content/task-statistics.vue';
import skillRating from './student-score-content/skill-rating.vue';
import comprehensiveScore from './student-score-content/comprehensive-score.vue';
import {
  getStudentScoreApi,
  getStudentDetailApi,
  getRadarScoreApi,
} from '@/api/web/team-training';
export default {
  components: {
    trainingOverview,
    taskStatistics,
    skillRating,
    comprehensiveScore,
  },
  props: {},
  data() {
    return {
      textarea: '', //评语
      active: '',
      default_id: '', //进入评分页面默认左侧第一个学员id
      ready: false,
      defaultLogo,
      userList: [], //学员评分左侧数据
      trainScore: {}, //训练概况数据
      taskPercent: {},
      radarData: [], //雷达图的数据
      totalTask: '',
      pieData: [],
      allData: {},
      user: '',
      submitTreeData: {}, //提交数据
      resource_id: '',
    };
  },
  computed: {},
  created() {
    this.resource_id = this.$route.params && this.$route.params.resource_id;
  },
  mounted() {
    this.getStudentData();
  },
  watch: {},
  methods: {
    handleTreeDataChange(data) {
      this.submitTreeData = data;
    },
    // 提交评分todo
    submitScore() {
      // 星星得分
      this.startData = [];
      this.submitTreeData.children[0].children[0].children[0].children.forEach(
        (item, index) => {
          this.startData.push(item.score / 4);
        },
      );
      const params = {};
      params.user = this.user;
      params.training_percentage = this.submitTreeData.children[1].score; //训练得分占比
      params.ability_percentage = this.submitTreeData.children[0].score; //能力得分占比
      params.ability_score = JSON.stringify(this.startData); //能力分
      params.comment = this.textarea; //评语
      params.final_score = Math.round(this.submitTreeData.score); //最终得分四舍五入
      params.room_id = this.resource_id; //训练id
      this.$request
        .post('/cr/training_team/training_team/student_score', params, {
          baseURL: '/api/ojj',
        })
        .then(() => {
          this.$message.success(this.$t('m.submitSuccess'));
          // 成功之后刷新左侧评分数据
          this.getStudentData(this.user);
        })
        .catch((error) => {});
    },
    // 教员获取学员评分左侧数据
    getStudentData(id) {
      getStudentScoreApi({ resource_id: this.resource_id }).then((res) => {
        this.userList = res.data.data;
        if (this.userList) {
          this.default_id = this.userList[0].user_id;
          this.user = id || this.userList[0].user_id;
          this.active = id || this.userList[0].user_id;
          getStudentDetailApi({
            resource_id: this.resource_id,
            user_hash: id ? id : this.default_id,
          }).then((res) => {
            this.trainScore = res.data.data.training_summary; //训练概况客观主观等得分数据
            this.taskPercent = res.data.data.task_statistics; //任务统计数据
            this.totalTask = Number(this.taskPercent.mission_count);
            this.allData = res.data.data;
            this.textarea = res.data.data.comment;
            this.pieData = [
              {
                name: this.$t('rbt.success'),
                value: Number(this.taskPercent.successful),
              },
              {
                name: this.$t('rbt.fail'),
                value: Number(this.taskPercent.failed),
              },
              {
                name: this.$t('rbt.undone'),
                value: Number(this.taskPercent.unfinished),
              },
              {
                name: this.$t('rbt.toEvaluates'),
                value: Number(this.taskPercent.not_evaluated),
              },
            ];
            this.ready = true;
          });
          // 获取雷达数据
          getRadarScoreApi({
            resource_id: this.resource_id,
            user_hash: id ? id : this.default_id,
          }).then((res) => {
            this.radarData = _.get(res, 'data.data', []);
          });
        }
      });
    },
    // 点击左侧学员评分
    scoreFn(role) {
      this.active = role.user_id;
      this.user = role.user_id; //学员的id
      // this.ready = false;
      getStudentDetailApi({
        resource_id: this.resource_id,
        user_hash: role.user_id,
      }).then((res) => {
        this.allData = res.data.data;
        this.trainScore = res.data.data.training_summary; //训练概况客观主观等得分数据
        this.taskPercent = res.data.data.task_statistics; //任务统计数据
        this.totalTask = Number(this.taskPercent.mission_count);
        this.textarea = res.data.data.comment;
        this.pieData = [
          {
            name: this.$t('rbt.success'),
            value: Number(this.taskPercent.successful),
          },
          {
            name: this.$t('rbt.fail'),
            value: Number(this.taskPercent.failed),
          },
          {
            name: this.$t('rbt.undone'),
            value: Number(this.taskPercent.unfinished),
          },
          {
            name: this.$t('rbt.toEvaluates'),
            value: Number(this.taskPercent.not_evaluated),
          },
        ];
        this.ready = true;
      });
      // 获取雷达数据
      getRadarScoreApi({
        resource_id: this.resource_id,
        user_hash: role.user_id,
      }).then((res) => {
        this.radarData = _.get(res, 'data.data', []);
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.student-rating {
  border-radius: 4px;
  width: 100%;
  height: 100%;
  background: var(--bg-color-2);
  display: flex;
  .left-wrap {
    border-radius: 4px;
    width: 300px;
    background: var(--bg-color-3);
    overflow-y: scroll;
    .score-item {
      height: 80px;
      border-bottom: 1px solid var(--neutral1);
      display: flex;
      align-items: center;
      position: relative;
      &:hover {
        background: var(--neutral0);
        cursor: pointer;
      }
      .logo-wrap {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        background: var(--bg-color-3);
        margin-right: 4px;
        margin-left: 16px;
        border: 1px solid var(--neutral1);
        border-radius: 50%;
        img {
          border-radius: 50%;
          width: 100%;
          height: 100%;
          border-radius: 50%;
        }
      }
      .user-info {
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
            padding: 0 8px;
            background: var(--neutral0);
          }
        }
      }
      .score-wrap {
        position: absolute;
        right: 16px;
        .expect-score {
          font-size: 14px;
          color: var(--primary-color);
        }
        .score {
          display: flex;
          align-items: center;
          .num {
            font-size: 20px;
            color: var(--neutral8);
          }
          .tip {
            font-size: 14px;
            color: var(--neutral8);
            margin-left: 4px;
          }
        }
      }
    }
    .active {
      background: var(--neutral0);
    }
  }
  .right-wrap {
    width: calc(100% - 316px);
    padding-top: 16px;
    padding-right: 16px;
    padding-left: 16px;
    .train-info {
      height: 260px;
      display: flex;
      .train-item {
        border-radius: 2px;
        flex: 1;
        margin-right: 16px;
        background: var(--bg-color-3);
        padding: 16px;
        &:last-child {
          margin-right: 0;
        }
      }
    }
    .comprehensive-score-wrap {
      border-radius: 2px;
      height: calc(100% - 370px);
      background: var(--bg-color-3);
      margin-top: 16px;
    }
    .submit-wrap {
      margin-top: 8px;
      text-align: center;
      .cb-button {
        margin-top: 8px;
      }
    }
  }
}
</style>
