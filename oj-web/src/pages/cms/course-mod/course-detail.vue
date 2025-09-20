<template>
  <!--  <cb-inner-page :background="true" title="课程详情">-->
  <div class="course-detail-wrapper">
    <div class="left cyber-scroll-bar-small">
      <div
        class="course-name"
        @click="handleChangeRightInfo('profile')"
      >{{ detailData.name }}</div>
      <div class="desc header">{{ detailData.description }}</div>
      <cb-collapse v-model="activeNames">
        <cb-collapse-item name="1">
          <template slot="title">
            <span class="header-title">{{ experimentData.name }}</span>
            <span class="header-icon el-icon-date"></span>
            <span class="header-info">共计{{ experimentData.value.length }}节</span>
          </template>
          <div
            class="item"
            :key="item.resource_id"
            v-for="item in experimentData.value"
          >
            <div class="name">
              {{ item.name }}
              <span class="right-desc">
                <span class="desc">{{ difficultOptions[item.difficult] }}</span>
                <span class="desc time">预计{{ item.duration_time }}h</span>
              </span>
            </div>
            <div class="desc">{{ item.description }}</div>
            <div class="skill">
              <div class="label">训练技能：</div>
              <cb-tag
                :key="tagIndex"
                v-for="(tag, tagIndex) in item.train_skill"
              >{{ tag }}</cb-tag>
            </div>
            <div class="skill">
              <div class="label">前置技能：</div>
              <cb-tag
                :key="tagIndex"
                v-for="(tag, tagIndex) in item.pre_skill"
              >{{ tag }}</cb-tag>
            </div>
            <div class="role">
              <div class="label">角色信息：</div>
              <div
                class="role-list"
                @click="handleChangeRightInfo('monitor')"
              >
                <div
                  class="img-box"
                  :key="role.resource_id"
                  v-for="role in item.roles_data"
                >
                  <img
                    class="avatar"
                    :src="role.users_data[0].logo"
                    alt=""
                  />
                  <span>{{ role.name }}</span>
                  <span class="desc">{{ role.description }}</span>
                </div>
              </div>
            </div>
          </div>
        </cb-collapse-item>
        <cb-collapse-item name="2">
          <template slot="title">
            <span class="header-title">{{ subjectData.name }}</span>
            <span class="header-icon el-icon-date"></span>
            <span class="header-info">共计{{ subjectData.value.length }}节</span>
          </template>
          <div
            class="item"
            :key="item.resource_id"
            v-for="item in subjectData.value"
          >
            <div class="name">
              {{ item.name }}
              <span class="right-desc">
                <span class="desc">{{ difficultOptions[item.difficult] }}</span>
                <span class="desc time">预计{{ item.duration_time }}h</span>
              </span>
            </div>
            <div class="desc">{{ item.description }}</div>
            <div class="skill">
              <div class="label">训练技能：</div>
              <cb-tag
                :key="tagIndex"
                v-for="(tag, tagIndex) in item.train_skill"
              >{{ tag }}</cb-tag>
            </div>
            <div class="skill">
              <div class="label">前置技能：</div>
              <cb-tag
                :key="tagIndex"
                v-for="(tag, tagIndex) in item.pre_skill"
              >{{ tag }}</cb-tag>
            </div>
            <div class="role">
              <div class="label">角色信息：</div>
              <div
                class="role-list"
                @click="handleChangeRightInfo('monitor')"
              >
                <div
                  class="img-box"
                  :key="role.resource_id"
                  v-for="role in item.roles_data"
                >
                  <img
                    class="avatar"
                    :src="role.users_data[0].logo"
                    alt=""
                  />
                  <span>{{ role.name }}</span>
                  <span class="desc">{{ role.description }}</span>
                </div>
              </div>
            </div>
          </div>
        </cb-collapse-item>
        <cb-collapse-item name="3">
          <template slot="title">
            <span class="header-title">{{ comprehensiveTrainData.name }}</span>
            <span class="header-icon el-icon-date"></span>
            <span class="header-info">共计{{ comprehensiveTrainData.value.length }}节</span>
          </template>
          <div
            class="item"
            :key="item.resource_id"
            v-for="item in comprehensiveTrainData.value"
          >
            <div class="name">
              {{ item.name }}
              <span class="right-desc">
                <span class="desc">{{ difficultOptions[item.difficult] }}</span>
                <span class="desc time">预计{{ item.duration_time }}h</span>
              </span>
            </div>
            <div class="desc">{{ item.description }}</div>
            <div class="skill">
              <div class="label">训练技能：</div>
              <cb-tag
                :key="tagIndex"
                v-for="(tag, tagIndex) in item.train_skill"
              >{{ tag }}</cb-tag>
            </div>
            <div class="skill">
              <div class="label">前置技能：</div>
              <cb-tag
                :key="tagIndex"
                v-for="(tag, tagIndex) in item.pre_skill"
              >{{ tag }}</cb-tag>
            </div>
            <div class="role">
              <div class="label">角色信息：</div>
              <div
                class="role-list"
                @click="handleChangeRightInfo('monitor')"
              >
                <div
                  class="img-box"
                  :key="role.resource_id"
                  v-for="role in item.roles_data"
                >
                  <img
                    class="avatar"
                    :src="role.users_data[0].logo"
                    alt=""
                  />
                  <span>{{ role.name }}</span>
                  <span class="desc">{{ role.description }}</span>
                </div>
              </div>
            </div>
          </div>
        </cb-collapse-item>
      </cb-collapse>
      <div class="list"></div>
    </div>
    <div class="right cyber-scroll-bar-small">
      <template v-if="activeTab === 'profile'">
        <div class="header">学习概览</div>
        <study-profile :course-id="courseId"></study-profile>
      </template>
      <template v-if="activeTab === 'monitor'">
        <div class="header monitor">
          <cb-iconfont
            class="back-btn"
            type="icon-fanhui"
            size="18"
            @click="handleChangeRightInfo('profile')"
          ></cb-iconfont>
          <div>实时监控</div>
        </div>
        <real-time-monitoring></real-time-monitoring>
      </template>
    </div>
  </div>
  <!--  </cb-inner-page>-->
</template>

<script>
import { getConstantsConfig, getCourseDetailData } from '../../../api/course';
import StudyProfile from "./study-profile";
import RealTimeMonitoring from "./real-time-monitoring";
import _ from 'lodash';

export default {
  name: "course-detail",
  components: {
    StudyProfile,
    RealTimeMonitoring,
  },
  props: {},
  setup(props, { emit }) {
    return {}
  },
  data() {
    return {
      activeNames: ['1', '2'],
      detailData: {
        name: 'xxxx',
        lesson_count: '1',
        course_duration: '1',
        logo: '1',
        student_num: '1',
        team_room_rsps: [],
      },
      experimentData: {
        name: '实验',
        value: [],
      },
      subjectData: {
        name: '科目',
        value: [],
      },
      comprehensiveTrainData: {
        name: '综合演训',
        value: [],
      },
      activeTab: 'profile', // profile monitor
      difficultOptions: {},
      courseId: '',
    }
  },
  created() {
    this.courseId = this.$route.params.courseId;
    this.getCourseDetailDataFunc();
    this.getDifficultyOptions();
  },
  methods: {
    getCourseDetailDataFunc() {
      this.experimentData.value = [];
      this.subjectData.value = [];
      this.comprehensiveTrainData.value = [];
      let params = { resource_id: this.courseId };
      getCourseDetailData(params).then(res => {
        this.detailData = res.data.data;
        this.detailData.team_room_rsps.forEach(item => {
          if (item.train_xd_type === '实验') {
            this.experimentData.value.push(item)
          } else if (item.train_xd_type === '科目') {
            this.subjectData.value.push(item)
          } else if (item.train_xd_type === '综合演训') {
            this.comprehensiveTrainData.value.push(item)
          }
        })
      })
    },
    handleChangeRightInfo(data) {
      this.activeTab = data;
    },
    getDifficultyOptions() {
      getConstantsConfig({ type: 24 }).then((res) => {
        const data = _.get(res, 'data.data', []);
        data.forEach((item) => {
          this.difficultOptions[item.code] = item.name;
        })
      });
    },
  }
}
</script>

<style scoped lang="scss">
.course-detail-wrapper {
  display: flex;
  gap: 16px;

  .header {
    color: var(--primary-color);
    font-size: 18px;
    font-weight: bold;
    margin-bottom: 16px;

    &.monitor {
      display: flex;
      align-items: center;

      .back-btn {
        margin-right: 10px;
        cursor: pointer;
      }
    }
  }

  .course-name {
    font-size: 18px;
    cursor: pointer;

    &:hover {
      color: var(--primary-color);
    }
  }

  ::v-deep .el-collapse {
    border: 0;
  }

  ::v-deep .el-collapse-item {
    margin-bottom: 16px;
  }

  ::v-deep .el-collapse-item__content {
    padding-bottom: 0;
  }

  ::v-deep .el-collapse-item__header {
    padding-left: 16px;
    font-size: 14px;
    background-color: var(--header-bg);
    border-radius: 8px;
  }

  .header-title{
    display: inline-block;
    width: 56px;
  }

  .header-icon {
    padding-left: 10%;
    font-size: 14px;
    color: var(--info-text);
  }

  .header-info {
    padding-left: 8px;
    font-size: 12px;
    color: var(--info-text);
  }

  .left {
    height: calc(100vh - 160px);
    overflow-y: auto;
    width: 30%;
    //margin-left: 24px;
    background: var(--white-color);
    border-radius: 4px;
    padding: 16px;
    font-size: 14px;

    .name {}

    .desc {
      font-size: 14px;
      color: var(--info-text);

      &.header {
        padding: 16px 0 8px 0;
      }
    }

    .item {
      background-color: var(--bg-color-1);
      margin: 10px 0;
      padding: 16px;

      .label {
        display: inline-block;
        width: 70px;
        flex-shrink: 0;
      }

      .right-desc {
        float: right;

        .time {
          margin-left: 16px;
        }
      }

      .skill {
        margin: 10px 0;
      }

      .role {
        display: flex;

        .role-list {
          display: flex;
          flex-wrap: wrap;
          gap: 38px;
          padding: 16px;

          &:hover {
            cursor: pointer;
            //color: var(--primary-color);
            background-color: rgba(231, 240, 255, 0.2);
            outline: 1px dashed var(--primary-color);
            border-radius: 2px;
          }

          .img-box {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
          }

          .avatar {
            width: 40px;
            height: 40px;
            border-radius: 50%;
          }
        }
      }
    }
  }

  .right {
    width: 70%;
    padding: 0;
    height: calc(100vh - 160px);
    overflow-y: auto;
  }
}
</style>
