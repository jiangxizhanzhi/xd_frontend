<template>
<!--  <cb-inner-page :background="true" title="课程详情">-->
    <div class="course-detail-wrapper">
      <div class="left cyber-scroll-bar-small">
        <div class="course-name" @click="handleChangeRightInfo('profile')">云数据中心课程1</div>
        <div class="desc header">通过科目训练，学习云计算、云存储、云网络等资源使用与管理训练。</div>
        <cb-collapse v-model="activeNames">
          <cb-collapse-item name="1">
            <template slot="title">
              <span>实验</span>
              <span class="header-icon el-icon-date"></span>
              <span class="header-info">共计3节</span>
            </template>
            <div class="item" v-for="item in ['', '', '', '', '', '', '', '']">
              <div class="name">
                1.1 云计算资源使用与管理训练实验
                <span class="right-desc">
                  <span class="desc">困难</span>
                  <span class="desc time">预计6h</span>
                </span>
              </div>
              <div class="desc">学习云计算资源使用与管理。</div>
              <div class="skill">
                <div class="label">训练技能：</div>
                <cb-tag>标签一</cb-tag>
              </div>
              <div class="skill">
                <div class="label">前置技能：</div>
                <cb-tag>标签一</cb-tag>
              </div>
              <div class="role">
                <div class="label">角色信息：</div>
                <div class="role-list" @click="handleChangeRightInfo('monitor')">
                  <div class="img-box" v-for="item in ['', '', '', '', '', '', '', '']">
                    <img class="avatar" src="" alt="" />
                    <span>admin</span>
                    <span class="desc">教员</span>
                  </div>
                </div>
              </div>
            </div>
          </cb-collapse-item>
          <cb-collapse-item name="2">
            <template slot="title">
              <span>科目</span>
              <span class="header-icon el-icon-date"></span>
              <span class="header-info">共计3节</span>
            </template>
            <div class="item" v-for="item in ['', '', '', '', '', '', '', '']">
              <div class="name">
                1.1 云计算资源使用与管理训练实验
                <span class="right-desc">
                  <span class="desc">困难</span>
                  <span class="desc time">预计6h</span>
                </span>
              </div>
              <div class="desc">学习云计算资源使用与管理。</div>
              <div class="skill">
                <div class="label">训练技能：</div>
                <cb-tag>标签一</cb-tag>
              </div>
              <div class="skill">
                <div class="label">前置技能：</div>
                <cb-tag>标签一</cb-tag>
              </div>
              <div class="role" title="点击进入学员监控">
                <div class="label">角色信息：</div>
                <div class="role-list" @click="handleChangeRightInfo('monitor')">
                  <div class="img-box" v-for="item in ['', '', '', '', '', '', '', '']">
                    <img class="avatar" src="" alt="" />
                    <span>admin</span>
                    <span class="desc">教员</span>
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
          <study-profile></study-profile>
        </template>
        <template v-if="activeTab === 'monitor'">
          <div class="header monitor">
            <cb-iconfont class="back-btn" type="icon-fanhui" size="18" @click="handleChangeRightInfo('profile')"></cb-iconfont>
            <div>实时监控</div>
          </div>
          <real-time-monitoring></real-time-monitoring>
        </template>
    </div>
    </div>
<!--  </cb-inner-page>-->
</template>

<script>
import {getCourseDetailData} from "../../../api/course";
import StudyProfile from "./study-profile";
import RealTimeMonitoring from "./real-time-monitoring";

export default {
  name: "course-detail",
  components: {
    StudyProfile,
    RealTimeMonitoring,
  },
  props: {},
  setup(props, {emit}) {
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
      activeTab: 'profile', // profile monitor
    }
  },
  created() {
    this.getCourseDetailDataFunc();
  },
  methods: {
    getCourseDetailDataFunc() {
      let params = {resource_id: 'ZXCG6EDK9H'}
      getCourseDetailData(params).then(res => {
        this.detailData = res.data.data;
      })
    },
    handleChangeRightInfo(data) {
      this.activeTab = data;
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
    .name {
    }
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
