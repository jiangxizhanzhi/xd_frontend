<template>
  <cb-inner-page class="oj-course" :background="false">
    <div class="top">
      <div class="job-img">
        <div><img :src="avatar || defaultLogo" alt="" /></div>
      </div>
      <div class="job-name">
        <span class="job-tag-info" :title="jobInfo.name">{{
          jobInfo.name
        }}</span>
        <span>( {{ $t('m.JobMatchingDegree') }}{{ jobInfo.percent }}% )</span>
        <span @click="openPosition" class="cursor">
          <cb-iconfont type="icon-genghuangangwei" />
          <span v-if="!this.isSelectButton">{{ $t('m.changeJobs') }}</span>
          <span v-else>{{ $t('m.selectJobs') }}</span>
        </span>
      </div>
      <div class="job-des">
        <div
          class="one-overflow"
          :title="jobInfo.description"
          v-if="jobInfo.description != ''"
        >
          {{ jobInfo.description }}
        </div>
        <div v-else>
          {{ $t('componentServerEdit.noData') }}
        </div>
      </div>
      <div class="job-rtks">
        <div @click="goT('t')" class="t-box">
          <CircleTKS
            type="T"
            :count="taskData.length"
            :desc="$t('m.jobResponsibilities')"
          />
        </div>
        <div @click="goT('k')" class="k-box">
          <CircleTKS
            type="K"
            :count="knowledgeData.length"
            :desc="$t('m.exercise.knowledgePoint')"
          />
        </div>
        <div @click="goT('s')">
          <CircleTKS
            type="S"
            :count="skillData.length"
            :desc="$t('m.skillPoint')"
          />
        </div>
      </div>
    </div>
    <div class="bottom">
      <div class="course-skill-tab">
        <template v-if="this.skillData.length > 0">
          <cb-radio-group v-model="currentTab" size="medium">
            <cb-radio-button label="course">
              <span> &nbsp;{{ $t('course.courseLearning') }}&nbsp;&nbsp;</span>
            </cb-radio-button>
            <!-- 没有技能点不展示技能训练按钮-->
            <cb-radio-button label="skill">
              <span> {{ $t('course.skillTraining') }}</span>
            </cb-radio-button>
          </cb-radio-group>
        </template>

        <template v-else>
          <cb-radio-group
            v-model="currentTab"
            size="medium"
            class="single-radio"
          >
            <cb-radio-button label="course" style="border-radius: 10px">
              <span> &nbsp;{{ $t('course.courseLearning') }}&nbsp;&nbsp;</span>
            </cb-radio-button>
          </cb-radio-group>
        </template>
      </div>
      <div class="wrapper-box">
        <div v-if="currentTab === 'course'" class="course-boxs">
          <job-away
            type="course"
            :trainTypeList="TRAIN_TYPE_LIST"
            :courseList="courseList"
          ></job-away>
          <div class="course-path">
            <div class="title">{{ $t('m.allCourse') }}</div>
            <template v-if="courseList.length > 0">
              <div class="course-path-list">
                <div
                  class="course-card-item"
                  v-for="item in courseList"
                  :key="item.resource_id"
                >
                  <course-card
                    :trainTypeList="TRAIN_TYPE_LIST"
                    type="course"
                    :card-data="item"
                  ></course-card>
                </div>
              </div>
            </template>
            <template v-else>
              <div class="noCourse"><empty></empty></div>
            </template>
          </div>
        </div>
        <div v-else-if="currentTab === 'skill'" class="skill-boxs">
          <job-away
            type="skill"
            :trainTypeList="TRAIN_TYPE_LIST"
            :courseList="trainList"
          ></job-away>
          <div class="course-path">
            <div class="title">{{ $t('course.allTrain') }}</div>
            <template v-if="trainAllList.length > 0">
              <div class="course-path-list">
                <div
                  class="course-card-item"
                  v-for="item in trainAllList"
                  :key="item.resource_id"
                >
                  <course-card
                    type="skill"
                    :trainTypeList="TRAIN_TYPE_LIST"
                    :card-data="item"
                  ></course-card>
                </div>
              </div>
            </template>
            <template v-else>
              <div class="noCourse"><empty></empty></div>
            </template>
          </div>
        </div>
      </div>
    </div>
    <change-position ref="positionRef" @value="getPositionValue">
    </change-position>
    <RTKSPoint
      ref="rtksPointRef"
      :tData="taskData"
      :kData="knowledgeData"
      :sData="skillData"
    />
  </cb-inner-page>
</template>
<script>
import ListCard from './components/list-card.vue';
import Block from '@/components/block';
import CourseCard from './components/course-card.vue';
import JobAway from './components/job-away.vue';
import ProfessionalItem from './components/professional-item.vue';
import CourseLearnProcess from './components/course-learn-process.vue';
import ChangePosition from './components/change-position';
import Empty from '@/components/empty/index.vue';

import Default from '@/assets/img/course/default.png';
import CircleTKS from './components/circle-tks.vue';
import RTKSPoint from './components/rtks-point.vue';
import { TRAIN_TYPE_LIST } from '@/pages/web/course/constant.js';

export default {
  components: {
    ListCard,
    Block,
    CourseCard,
    CourseLearnProcess,
    ChangePosition,
    JobAway,
    ProfessionalItem,
    Empty,
    CircleTKS,
    RTKSPoint,
  },
  props: {},
  data() {
    return {
      TRAIN_TYPE_LIST,
      currentTab: 'course',
      defaultLogo: Default,
      xAxisLineShow: true,
      barData: [],
      courseList: [],
      trainList: [],
      trainAllList: [],
      jobInfo: {
        description: '',
        percent: '',
        name: '',
      },
      taskData: [],
      knowledgeData: [],
      skillData: [],
      loading: false,
      professinalArr: [],
      isSelectButton: false,
    };
  },
  computed: {
    avatar() {
      return this.$store.state.user.avatar;
    },
    xData() {
      return [
        this.$t('m.course'),
        this.$t('m.theoryClass'),
        this.$t('m.practiceClass'),
      ];
    },
    taskCols() {
      return [
        {
          prop: 'resource_id',
          label: this.$t('m.duty'),
          width: 100,
        },
        {
          prop: 'content',
          label: this.$t('m.content'),
        },
      ];
    },
    knowledgeCols() {
      return [
        {
          prop: 'resource_id',
          label: this.$t('m.knowledge'),
          width: 100,
        },
        {
          prop: 'content',
          label: this.$t('m.content'),
        },
      ];
    },
  },
  mounted() {
    this.getCareerLearnPath();
    this.getTrainPath();
    this.getJobInfo();
  },
  methods: {
    goT(type) {
      this.$refs.rtksPointRef.dialogPoint = true;
      setTimeout(() => {
        const a = '#' + type;
        this.$el.querySelector(a).scrollIntoView({ behavior: 'smooth' });
      }, 100);
    },
    // 学习路径/ 学习进度
    getCareerLearnPath() {
      this.loading = true;
      this.$request
        .get('/api/ojj/course/train/knowledge', {}, { baseURL: '' })
        .then((res) => {
          this.courseList = _.get(res, 'data.data.knowledge_bos', []);
          this.barData = [
            _.get(res, 'data.data.course_percent'),
            _.get(res, 'data.data.theory_percent'),
            _.get(res, 'data.data.exercise_percent'),
          ];
        })
        .catch((res) => {
          this.isSelectButton = true;
        })
        .finally(() => {
          this.loading = false;
        });
    },
    // 训练路径
    getTrainPath() {
      this.$request
        .get('/api/ojj/rtks/training-plan/training/path', {}, { baseURL: '' })
        .then((res) => {
          this.trainList = _.get(res, 'data.data.path', []);
          this.trainAllList = _.get(res, 'data.data.related', []);
        })
        .finally(() => {});
    },
    // 岗位信息/岗位职责/关联知识
    getJobInfo() {
      this.$request
        .get(
          '/api/ojj/rtks/training-plan/getRoleDetailRes',
          {},
          { baseURL: '' },
        )
        .then((res) => {
          let data = _.get(res, 'data.data', {}) || {};
          for (const key in this.jobInfo) {
            this.jobInfo[key] = data[key] || '';
          }
          this.knowledgeData = data.knowledge_data_list || [];
          this.taskData = data.task_data_list || [];
          this.skillData = data.skill_data_list || [];
          this.professinalArr = [...this.taskData, ...this.knowledgeData];
        });
    },
    openPosition() {
      this.$refs.positionRef.dialogPosition = true;
      if (this.isSelectButton) {
        this.$refs.positionRef.isSelectButton = true;
      }
    },
    getPositionValue(value) {
      this.postPosition(value);
    },
    postPosition(value) {
      const data = {
        role_id: value.resource_id,
      };
      this.$request
        .post('/relate/user/role', data, {
          baseURL: '/api/ojj',
        })
        .then(() => {
          this.$message.success(this.$t('course.changePostWarn'));
          this.getCareerLearnPath();
          this.getTrainPath();
          this.getJobInfo();
        });
    },
  },
};
</script>
<style lang="scss" scoped>
.single-radio.cb-radio-group {
  .cb-radio-button:last-child {
    ::v-deep .el-radio-button__inner {
      border-radius: 4px;
    }
  }
}
.noCourse {
  position: relative;
  z-index: 2;
  background-color: var(--bg-color-secondary);
}
// .noCourse::before {
//   position: absolute;
//   content: '';
//   inset: 0;
//   opacity: 0.7;
// }
.noSystem {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;
  background-color: var(--bg-color-secondary);
  height: 71px;
  span {
    color: var(--font-color-regular);
  }
}
.empty_page {
  height: 200px;
}
.oj-course {
  color: var(--font-color-primary);
  .course-fade-enter-active,
  .course-fade-leave-active {
    transition: all 0.5s;
  }
  .course-fade-enter,
  .course-fade-leave-to {
    opacity: 0;
  }
  .course-pagination {
    .ant-pagination.mini {
      margin: 0 !important;
    }
  }
}
// .tag-name {
//   color: var(--font-color-regular);
//   display: inline-block;
//   width: 80px;
//   font-size: 14px;
// }

// .job-describe-text {
//   margin-top: 5px;
//   font-size: 14px;
//   color: var(--font-color-primary);
// }

.course-path {
  .title {
    color: var(--neutral8);
  }
  &-title {
    & > div:nth-child(1) {
      background: linear-gradient(
        to right,
        transparent,
        var(--bg-color-sixth) 80%,
        var(--bg-color-sixth) 82%,
        transparent 82%,
        transparent 88%,
        var(--bg-color-sixth) 88%,
        var(--bg-color-sixth) calc(88% + 5px),
        transparent calc(88% + 5px)
      );
    }
    & > div:nth-child(3) {
      background: linear-gradient(
        to left,
        transparent,
        var(--bg-color-sixth) 80%,
        var(--bg-color-sixth) 82%,
        transparent 82%,
        transparent 88%,
        var(--bg-color-sixth) 88%,
        var(--bg-color-sixth) calc(88% + 5px),
        transparent calc(88% + 5px)
      );
    }
  }
}

// ------------------
.card-list {
  display: flex;
  height: 286px;
  margin-bottom: 32px;
  .job-contain {
    height: 100%;
    flex: 2;
    background: var(--bg-color-secondary);
    padding: 14px 24px 24px;
    margin-right: 16px;
    .change-job {
      display: flex;
      justify-content: flex-end;
    }
    .job-img {
      height: 80px;
      margin-bottom: 15px;
      display: flex;
      justify-content: center;
      & > div {
        height: 80px;
        width: 80px;
        border-radius: 50%;
        background-color: var(--bg-color-fifth);
        & img {
          width: 90%;
          height: 90%;
        }
      }
    }
    .job-name {
      text-align: center;
      height: 21px;
      display: flex;
      justify-content: center;
      span {
        height: 21px;
        display: inline-block;
      }
      .job-tag {
        font-family: Arial-BoldMT, Arial;
        color: #0ec252;
        font-size: 18px;
        height: 21px;
        margin-right: 3px;
        display: flex;
        /* align-items: center; */
        margin-top: 2px;
      }
      .job-tag-info {
        max-width: 50%;
        display: inline-block;
        overflow: hidden;
        height: 20px;
        word-break: break-all;
      }
    }
    .job-des {
      margin-top: 16px;
      font-size: 14px;
      opacity: 0.65;
      height: calc(100% - 150px);
      line-height: 20px;
      max-height: calc(100% - 150px);
      display: -webkit-box;
      /*! autoprefixer: off */
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 5;
      overflow: hidden;
    }
    .job-des-no-data {
      margin-top: 16px;
      font-size: 14px;
      color: var(--font-color-regular);
      text-align: center;
    }
  }
}
.title {
  margin-bottom: 8px;
  margin-top: 24px;
  font-size: 14px;
}
.course-path {
  &-title {
    display: flex;
    align-items: center;
    justify-content: center;

    & > div:nth-child(1),
    & > div:nth-child(3) {
      width: 200px;
      height: 5px;
    }
  }

  &-list {
    display: flex;
    flex-wrap: wrap;

    .course-card-item {
      width: calc((100% - 64px) / 5);
      flex-shrink: 0;
      margin-right: 16px;
      margin-bottom: 16px;
    }
    .course-card-item:nth-child(5n + 5) {
      margin-right: 0 !important;
    }
  }
}

.cb-block-title-container {
  margin: 0 !important;
}
</style>
<style lang="scss" scoped>
.oj-course {
  .top {
    height: 250px;
    background: var(--bg-color-2);
    margin-bottom: 16px;
    text-align: center;
    .job-img {
      margin-bottom: 9px;
      img {
        width: 64px;
        height: 64px;
        border-radius: 50%;
        background: var(--bg-color-fifth);
        margin-top: 16px;
      }
    }
    .job-name {
      margin-bottom: 8px;
      font-size: 14px;
      color: var(--neutral8);
    }
    .job-des {
      margin-bottom: 24px;
      font-size: 14px;
      color: var(--neutral7);
    }
    .job-rtks {
      display: flex;
      justify-content: center;
      .t-box,
      .k-box {
        margin-right: 116px;
      }
    }
  }
  .bottom {
    padding: 16px;
    background-color: var(--bg-color-2);
    .course-skill-tab {
      display: flex;
      justify-content: center;
      margin-bottom: 8px;
    }
  }
}
.cursor {
  margin-left: 12px;
  span {
    color: var(--primary-color);
  }
  &:hover {
    span,
    .cb-iconfont {
      color: var(--primary-color-8);
    }
  }
}
</style>
