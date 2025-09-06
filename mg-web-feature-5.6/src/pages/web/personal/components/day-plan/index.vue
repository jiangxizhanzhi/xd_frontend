<template>
  <div class="day-plan-wrapper">
    <cb-calendar
      :data="caleData"
      width="100%"
      :showToday="false"
      @select="select"
      @prevMonth="prevNextMonYear"
      @nextMonth="prevNextMonYear"
      @prevYear="prevNextMonYear"
      @nextYear="prevNextMonYear"
      :showActive="showDetail"
    />
    <div
      v-if="showDetail"
      class="today-play"
      :style="`top:${detailY}px;left:${detailX}px;`"
      @mouseleave="handleLeave"
    >
      <div class="header-box">
        <span>{{ activeDay }}{{ $t('personal.dayPlan') }}</span>
        <span class="close-box" @click="showDetail = false">
          <cb-iconfont
            style="cursor: pointer"
            type="icon-guanbi"
            themedColor="neutral5"
          />
        </span>
      </div>
      <div class="content cyber-scroll-bar-small">
        <div
          class="list-wrapper cursor"
          v-for="(item, index) in currentDayLists"
          :key="index"
          @click="goto(item)"
        >
          <div class="list-box" :class="getLeftColor(item.classify)">
            <div class="wrapper-top">
              <div
                class="list-type ft12"
                :class="language === 'en-US' ? 'list-typ-en' : ''"
              >
                {{ getType(item.classify) }}
              </div>
              <div class="list-time ft12 time">
                <span
                  v-if="
                    (item.startTime === '00:00:00' &&
                      item.endTime === '23:59:59') ||
                    (item.startTime === '00:00:00' &&
                      item.endTime === '00:00:00')
                  "
                  >{{ $t('personal.allDay') }}</span
                >
                <template v-else>
                  <span class="mr5">{{ item.startTime }}</span>
                  <span class="mr5">~</span>
                  <span>{{ item.endTime }}</span>
                </template>
              </div>
            </div>
            <div class="list-name ft14 time one-overflow">
              <span v-if="item.classify !== TASK_TYPE.CLASS" :title="item.name">
                {{ item.name }}
              </span>
              <span v-else :title="`${item.course_name}/${item.lesson_name}`">
                <span>{{ item.course_name }}</span>
                <span v-if="item.lesson_name">/</span>
                <span>{{ item.lesson_name }}</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import _ from 'lodash';
import dayjs from 'dayjs';
import { getDayPlanData } from '@/api/personal.ts';
import { getRouter, getLanguage } from '@cyber/helper';
import { TASK_TYPE, TASK_TYPE_LIST, REDVSBLUE } from '../../constant.ts';
export default {
  components: {},
  data() {
    return {
      TASK_TYPE,
      TASK_TYPE_LIST,
      REDVSBLUE,
      currentTime: null,
      caleData: [],
      currentDayLists: [],
      language: getLanguage(),
      showDetail: false,
      activeDay: '',
      detailX: '',
      detailY: '',
    };
  },
  created() {
    this.currentTime = dayjs().format('YYYY-MM');
    this.getInitData();
  },
  methods: {
    getType(classify) {
      const filterData = _.filter(this.TASK_TYPE_LIST, (item) => {
        return item.value === classify;
      });
      return filterData.length > 0 ? filterData[0].name : '';
    },
    getLeftColor(classify) {
      const filterData = _.filter(this.TASK_TYPE_LIST, (item) => {
        return item.value === classify;
      });
      if (filterData.length > 0) {
        if (filterData[0].color === 'orange') {
          return 'list-box-orange';
        } else if (filterData[0].color === 'green') {
          return 'list-box-green';
        } else if (filterData[0].color === 'cyan') {
          return 'list-box-cyan';
        } else if (filterData[0].color === 'red') {
          return 'list-box-red';
        }
      }
      return filterData.length > 0 ? filterData[0].name : '';
    },
    select(value, position) {
      if (!value) {
        this.showDetail = false;
      } else {
        this.showDetail = false;
        setTimeout(() => {
          this.detailX = position.x;
          this.detailY = position.y;
          this.activeDay = value.date.slice(5, 10);
          this.showDetail = true;
          this.currentDayLists = value.classrooms;
        }, 50);
      }
    },
    handleLeave() {
      this.showDetail = false;
    },
    prevNextMonYear(val) {
      this.showDetail = false;
      this.currentTime = dayjs(val).format('YYYY-MM');
      this.getInitData();
    },
    getInitData() {
      const that = this;
      getDayPlanData({
        month: this.currentTime,
      })
        .then((resp) => {
          const data = _.get(resp, 'data.data', []);
          _.forEach(data, (item) => {
            _.forEach(item.classrooms, (lesson) => {
              that.$set(lesson, 'startTime', lesson.start_time.substr(11, 19));
              that.$set(lesson, 'endTime', lesson.end_time.substr(11, 19));
            });
          });
          that.caleData = data;
        })
        .catch((err) => {
          /* that.$serverError(err); */
        });
    },
    // 跳转
    goto(item) {
      const data = {
        resource_id: item.resource_id,
      };
      const host = window.location.host;
      const protocol = window.location.protocol;
      let joinUrl = '';
      if (item.classify === this.TASK_TYPE.CLASS) {
        // 5.6去除了此处签到
        // 课时
        getRouter().push({
          path: `/oj/all-course/lesson/${item.course_id}/${item.lesson_id}/`,
          query: {
            room_id: item.resource_id,
          },
        });
      } else if (item.classify === this.TASK_TYPE.TEAM) {
        // 团队
        if (item.role_group === 2) {
          const url = this.$router.resolve({
            path: `/cr/student_combat/${item.resource_id}`,
          });
          window.open(url.href, '_self');
        } else {
          const url = this.$router.resolve({
            path: `/cr/train-detail-home/${item.resource_id}`,
          });
          window.open(url.href, '_self');
        }
      } else if (item.classify === this.TASK_TYPE.RB) {
        // 红蓝对抗
        if (item.role_group === this.REDVSBLUE.ADMIN) {
          const url = this.$router.resolve({
            path: `/cr/manage-home/${item.resource_id}`,
          });
          window.open(url.href, '_self');
        } else if (item.role_group === this.REDVSBLUE.DIRECTOR) {
          const url = this.$router.resolve({
            path: `/cr/director-home/${item.resource_id}`,
          });
          window.open(url.href, '_self');
        } else if (item.role_group === this.REDVSBLUE.REFEREE) {
          const url = this.$router.resolve({
            path: `/cr/referee-home/${item.resource_id}`,
          });
          window.open(url.href, '_self');
        } else {
          this.$request
            .get(
              '/cr/red_vs_blue/user/get_running_status',
              { resource_id: item.resource_id },
              { baseURL: '/api/ojj' },
            )
            .then((res) => {
              // 学员登录点击列表
              if (res.data.data.time_management_status !== 4) {
                const url = this.$router.resolve({
                  path: `/cr/access-center-member/${item.resource_id}`,
                });
                window.open(url.href, '_self');
              } else {
                this.$message.warning(this.$t('personal.NotStartEvent'));
                return;
              }
            });
        }
      } else if (item.classify === this.TASK_TYPE.THEORY) {
        // 理论赛跳转请求此接口成功之后进行跳转
        this.$request
          .get(
            `/web/theory_race/exam/enroll/?exam_id=${item.resource_id}`,
            undefined,
            { baseURL: '/api/ct' },
          )
          .then((res) => {
            getRouter().push({
              path: `/ct/contest/exam-guid/${item.resource_id}/`,
            });
          });
      } else if (item.classify === this.TASK_TYPE.OM) {
        // 运维赛
        joinUrl = `${protocol}//${host}/page/ct/contest/operation/${item.resource_id}/GuidePage`;
        window.open(joinUrl, '_blank');
      } else if (item.classify === this.TASK_TYPE.CTF) {
        // 夺旗赛
        // getRouter().push({
        //   path: `/ct/contest/flag/${item.resource_id}/GuidePage`,
        // });
        joinUrl = `${protocol}//${host}/page/ct/contest/flag/${item.resource_id}/GuidePage`;
        window.open(joinUrl, '_blank');
      } else if (item.classify === this.TASK_TYPE.AD) {
        // 攻防赛
        // getRouter().push({
        //   path: `/ct/contest/attack-defense/${item.resource_id}/GuidePage`,
        // });
        joinUrl = `${protocol}//${host}/page/ct/contest/attack-defense/${item.resource_id}/GuidePage`;
        window.open(joinUrl, '_blank');
      } else if (item.classify === this.TASK_TYPE.PERMEATE) {
        // 渗透赛
        // getRouter().push({
        //   path: `/ct/contest/cfs/${item.resource_id}/`,
        // });
        joinUrl = `${protocol}//${host}/page/ct/contest/cfs/${item.resource_id}/GuidePage`;
        window.open(joinUrl, '_blank');
      } else if (item.classify === this.TASK_TYPE.AWDP) {
        // 沙盒攻防赛
        joinUrl = `${protocol}//${host}/page/ct/contest/awdp/${item.resource_id}/GuidePage`;
        window.open(joinUrl, '_blank');
      } else if (item.classify === this.TASK_TYPE.AI) {
        // 人工智能赛
        joinUrl = `${protocol}//${host}/page/ct/contest/ai/${item.resource_id}/GuidePage`;
        window.open(joinUrl, '_blank');
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.day-plan-wrapper {
  width: 100%;
  padding-top: 8px;
  .content {
    width: 100%;
    min-height: 100px;
    max-height: 292px;
    overflow-y: auto;
    width: 336px;
    padding: 16px;
    .list-wrapper {
      width: 100%;

      &:last-child {
        border-bottom: 0;
      }
    }
    .list-box-green {
      border-left: 4px solid var(--green-color);
      color: var(--green-color);
      .list-type {
        background: var(--green-color-2);
      }
    }
    .list-box-orange {
      border-left: 4px solid var(--orange-color);
      color: var(--orange-color);
      .list-type {
        background: var(--orange-color-2);
      }
    }
    .list-box-red {
      border-left: 4px solid var(--red-color);
      color: var(--red-color);
      .list-type {
        background: var(--red-color-2);
      }
    }
    .list-box-cyan {
      border-left: 4px solid var(--cyan-color);
      color: var(--cyan-color);
      .list-type {
        background: var(--cyan-color-2);
      }
    }
    .list-box {
      width: 100%;
      height: 76px;
      padding: 16px;
      box-sizing: border-box;
      background: var(--neutral0);
      margin-bottom: 16px;
      &:hover {
        background: var(--neutral1);
      }
    }
    .wrapper-top {
      display: flex;
      align-items: center;
      margin-bottom: 8px;
    }

    .list-type {
      width: 64px;
      margin-right: 8px;
      border-radius: 2px;
      padding: 3px 8px;
    }
    .list-typ-en {
      width: 100px;
    }
    .list-time {
      width: 120px;
      margin-right: 15px;
      color: var(--neutral8);
    }
    .list-name {
      color: var(--neutral8);
    }
  }
  .today-play {
    position: fixed;
    width: 336px;
    z-index: 3;
    background: var(--bg-color-2);
    box-shadow: 8px 8px 30px 0px var(--box-shadow-color);
    border-radius: 4px;
    .header-box {
      height: 57px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid var(--neutral0);
      font-size: 16px;
      font-weight: 600;
      color: var(--neutral8);
      padding: 0 13px;
      .close-box {
        &:hover {
          .cb-iconfont {
            color: var(--neutral8) !important;
          }
        }
      }
    }
  }
}
</style>
<style lang="scss">
.day-plan-wrapper {
  .el-date-picker__header {
    width: 259px;
    margin: auto;
  }
  .el-picker-panel {
    background: transparent;
    box-shadow: none;
  }
  .el-picker-panel__content {
    margin: 0 !important;
    width: 100% !important;
    .el-date-table td.schedule:after {
      bottom: -3px !important;
    }
  }
  .el-date-table th {
    padding: 0 5px;
  }
  .el-date-table td {
    padding: 0;
  }

  .el-date-table td,
  .el-date-table td div {
    height: 36px;
  }
  tr {
    height: 24px;
    line-height: 35px;
  }
  .el-date-table td div span {
    height: 24px !important;
    line-height: 24px !important;
  }
  .cb-calendar .el-picker-panel__content tr > th {
    color: var(--neutral4);
  }
  .el-picker-panel__content .el-date-table td span {
    font-size: 14px;
  }
  .el-icon-d-arrow-right,
  .el-icon-d-arrow-left {
    display: none;
  }
  .el-picker-panel__icon-btn,
  .el-icon-arrow-left {
    width: 24px;
    height: 24px;
    background: var(--neutral1);
    border-radius: 50%;
    margin-top: 3px;
    margin-right: 16px;
    margin-left: 16px;
    &:hover {
      background: var(--primary-color-2);
    }
  }
  .el-picker-panel__content .el-date-table td.schedule span {
    border-radius: 4px;
    border: 0;
  }

  .el-picker-panel__content .el-date-table td.today span {
    background: var(--primary-color-2);
    color: var(--primary-color);
    border: 0;
    border-radius: 4px;
  }
  .schedule {
    position: relative;
    &::before {
      content: '';
      display: block;
      width: 3px;
      height: 3px;
      background: var(--neutral5);
      border-radius: 50%;
      margin-right: 6px;
      position: absolute;
      bottom: 7px;
      left: 50%;
      transform: translateX(-50%);
      z-index: 2;
    }
  }
  .schedule.today {
    &::before {
      background: var(--primary-color);
    }
  }
  // .schedule.available.today {
  //   span {
  //     color: var(--neutral8) !important;
  //     background: var(--primary-color) !important;
  //   }
  // }
  .el-picker-panel__content
    .el-date-table
    td.available:not(.current):not(.today)
    span:hover {
    background: var(--neutral2);
    color: var(--neutral8);
  }
  .el-picker-panel__content
    .el-date-table
    td.available:not(.current):not(.today)
    span:hover {
    background: none !important;
  }
  .el-picker-panel__content
    .el-date-table
    td.schedule:not(.current):not(.today)
    span:hover {
    background: var(--neutral2) !important;
  }
  // todo 点击后的样式
  .current-click {
    span {
      color: var(--white-color) !important;
      background: var(--primary-color) !important;
    }
    &::before {
      background: var(--primary-color) !important;
    }
  }
}
</style>
