<template>
  <div class="student-rating">
    <div class="left-wrap cyber-scroll-bar-small">
      <div
        class="score-item"
        v-for="(role, index) in userList"
        :key="index"
        :class="active === role.user_id ? 'active' : ''"
        @click="handleClick(role.user_id, index)"
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
            <!-- 类型 -->
            <div
              :class="[
                'role-type',
                role.role_group === 1 ||
                role.role_group === 2 ||
                role.role_group === 3
                  ? 'green'
                  : role.role_group === 4
                  ? 'red'
                  : 'blue',
              ]"
            >
              {{ computedGroup(role.role_group) }}
            </div>
            <!-- 角色名 -->
            <div class="role-classify">
              {{ role.role_name }}
            </div>
          </div>
        </div>
        <div class="score-wrap">
          <div class="expect-score" v-if="!role.scored">
            {{ $t('rbt.unScored') }}
          </div>
          <div class="score" v-else>
            <span class="num">{{ role.score || 0 }}</span>
            <span class="tip">{{ $t('rbt.scores') }}</span>
          </div>
        </div>
      </div>
    </div>
    <div class="right-wrap">
      <div class="train-info">
        <!-- 训练概况 -->
        <div class="train-item">
          <training-overview :trainScore="trainScore"></training-overview>
        </div>
        <!-- 任务统计 -->
        <div class="train-item">
          <task-statistics
            v-if="ready"
            :pieData="pieData"
            :total="totalTask"
          ></task-statistics>
        </div>
        <!-- 技能评分 -->
        <div class="train-item">
          <skill-rating
            :radarData="radarData"
            @treeDataChange="handleTreeDataChange"
          ></skill-rating>
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
import trainingOverview from './components/training-overview.vue';
import taskStatistics from './components/task-statistics.vue';
import skillRating from './components/skill-rating.vue';
import comprehensiveScore from './components/comprehensive-score.vue';
import { getScoreList, getStudentScore } from '@/api/web/red-blue.js';
import { getRadarScoreApi } from '@/api/web/team-training';
export default {
  components: {
    trainingOverview,
    taskStatistics,
    skillRating,
    comprehensiveScore,
  },
  props: {
    resource_id: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      textarea: '', //评语
      active: 0,
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
    };
  },
  watch: {
    user: {
      handler(val, old) {
        this.default_id = val;
      },
    },
  },
  computed: {},
  created() {},
  mounted() {
    this.getScoreList();
  },
  methods: {
    handleClick(userId) {
      this.getStudentScore(userId);
      this.getRadarData(userId);
      this.user = userId;
      this.active = userId;
    },
    getScoreList(userId) {
      //裁判获取学员评估列表
      getScoreList({
        resource_id: this.resource_id,
      }).then((res) => {
        this.userList = res.data.data;
        this.default_id = userId || this.userList[0].user_id;
        this.active = userId || this.userList[0].user_id;
        this.user = userId || this.userList[0].user_id;
        if (this.userList.length) {
          this.getStudentScore(this.active);
          this.getRadarData(this.active);
        }
      });
    },
    // 查询评分数据
    getStudentScore(userId) {
      const params = {
        resource_id: this.resource_id,
        user_hash: userId,
      };
      getStudentScore(params).then((res) => {
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
    },
    getRadarData(userId) {
      const params = {
        resource_id: this.resource_id,
        user_hash: userId,
      };
      // 获取雷达数据
      getRadarScoreApi(params).then((res) => {
        this.radarData = _.get(res, 'data.data', []);
      });
    },
    computedGroup(group) {
      if (group === 1 || group === 2 || group === 3) {
        return `${this.$t('list.white')}`;
      } else if (group === 4) {
        return `${this.$t('list.red')}`;
      } else if (group === 5) {
        return `${this.$t('list.blue')}`;
      }
    },
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
      params.user = this.default_id;
      params.training_percentage = this.submitTreeData.children[1].score; //训练得分占比
      params.ability_percentage = this.submitTreeData.children[0].score; //能力得分占比
      params.ability_score = JSON.stringify(this.startData); //能力分
      params.comment = this.textarea; //评语
      params.final_score = Math.round(this.submitTreeData.score); //最终得分四舍五入
      params.room_id = this.resource_id; //训练id
      this.$request
        .post('/cr/red_vs_blue/red_vs_blue/student_score', params, {
          baseURL: '/api/ojj',
        })
        .then(() => {
          this.$message.success(this.$t('m.submitSuccess'));
          // 成功之后刷新左侧评分数据
          // this.getStudentScore(this.user);
          this.getScoreList(this.user);
        })
        .catch((error) => {});
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
            margin-left: 4px;
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
