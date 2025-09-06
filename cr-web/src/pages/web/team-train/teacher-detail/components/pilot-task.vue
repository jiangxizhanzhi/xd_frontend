<template>
  <!-- 团队任务导调 -->
  <div class="task-direct el-tabs__content cyber-scroll-bar-small">
    <!-- 团队训练任务进度 -->
    <div class="task-progress">
      <block :title="$t('rbt.taskComplete')"></block>
      <!-- 任务进度分类5种 -->
      <div class="progress-category">
        <div class="item">
          <span class="outer-wrap">
            <span class="inner-wrap distribute">
              <cb-iconfont
                :size="16"
                type="icon-daochu"
                class="category-icon-color"
              ></cb-iconfont>
            </span>
          </span>
          <span class="status">{{ $t('rbt.hasIssueds') }}</span>
          <span class="num">{{ released }}</span>
        </div>
        <div class="item">
          <span class="outer-wrap">
            <span class="inner-wrap not-distribute">
              <cb-iconfont
                :size="16"
                type="icon-xiafa1"
                class="category-icon-color"
              ></cb-iconfont>
            </span>
          </span>
          <span class="status">{{ $t('rbt.notIssued') }}</span>
          <span class="num">{{ unreleased }}</span>
        </div>
        <div class="item">
          <span class="outer-wrap">
            <span class="inner-wrap submit">
              <cb-iconfont
                :size="16"
                type="icon-fuxuankuangxuanze"
                class="category-icon-color"
              ></cb-iconfont>
            </span>
          </span>
          <span class="status">{{ $t('rbt.submitted') }}</span>
          <span class="num">{{ submitted }}</span>
        </div>
        <div class="item">
          <span class="outer-wrap">
            <span class="inner-wrap not-submit">
              <cb-iconfont
                :size="16"
                type="icon-a-daitijiaodaiwancheng"
                class="category-icon-color"
              ></cb-iconfont>
            </span>
          </span>
          <span class="status">{{ $t('rbt.unSubmitted') }}</span>
          <span class="num">{{ unsubmitted }}</span>
        </div>
        <div class="item">
          <span class="outer-wrap">
            <span class="inner-wrap waiting">
              <cb-iconfont
                :size="16"
                type="icon-a-daitijiaodaiwancheng"
                class="category-icon-color"
              ></cb-iconfont>
            </span>
          </span>
          <span class="status">{{ $t('rbt.toEvaluate') }}</span>
          <span class="num">{{ waiting }}</span>
        </div>
      </div>
      <!-- 任务下发进度 -->
      <div class="overall-progress">
        <span class="name">{{ $t('rbt.taskDeliveryProgress') }}</span>
        <!-- stroke-width:宽度 -->
        <!-- stroke-linecap:两端形状 -->
        <div class="progress-wrap">
          <div class="overall-outer-progress">
            <div
              class="overall-inner-progress"
              :class="[
                percent
                  ? 'overall-inner-progress-has'
                  : 'overall-inner-progress-none',
              ]"
              :style="{
                width: percent + '%',
              }"
            ></div>
          </div>
        </div>
        <div class="percentage-wrap">
          {{ this.taskData.released + '/' + this.taskData.total }}
        </div>
      </div>
      <!-- 角色进度 -->
      <div class="all-progress cyber-scroll-bar-small">
        <div class="role-prgress">
          <!-- 角色进度 -->
          <collapse-transition>
            <div class="collapase-wrap">
              <div class="red-role" v-for="(role, indexRole) in roles.role">
                <!-- 角色名称 -->
                <span class="name" :title="role.role_name">{{
                  role.role_name
                }}</span>
                <!-- 进度条展示 -->
                <div class="progress-wrap">
                  <!-- width: `${stage.total / role.total * 100}`+ '%'
                  当前阶段任务数量/总任务数量作为当前阶段长度 -->
                  <!-- 角色有阶段 -->
                  <template v-if="role.stage.length">
                    <div
                      class="progress-item"
                      :key="index"
                      v-for="(stage, index) in role.stage"
                      :style="{
                        width: `${(stage.total / role.total) * 100}` + '%',
                      }"
                    >
                      <div class="progress-item-outer">
                        <div
                          class="progress-item-inner"
                          :class="[
                            indexRole % 3 === 0
                              ? 'color-one'
                              : indexRole % 3 === 1
                              ? 'color-two'
                              : 'color-three',
                          ]"
                          :style="{
                            width:
                              `${Number(
                                ((stage.released / stage.total) * 100).toFixed(
                                  0,
                                ),
                              )}` + '%',
                          }"
                        ></div>
                      </div>
                    </div>
                  </template>
                  <!-- 角色无阶段 -->
                  <template v-else>
                    <div
                      class="progress-item"
                      :style="{
                        width: '100%',
                      }"
                    >
                      <div class="progress-item-outer">
                        <div
                          class="progress-item-inner"
                          :style="{
                            width: '0%',
                          }"
                        ></div>
                      </div>
                    </div>
                  </template>
                </div>
                <!-- 比例值 -->
                <div class="percentage-wrap">
                  {{ role.released + '/' + role.total }}
                </div>
              </div>
            </div>
          </collapse-transition>
        </div>
      </div>
    </div>
    <!-- 任务下发 -->
    <div class="task-distribution">
      <block :title="$t('rbt.taskDelivery')"></block>
      <div class="task-detail cyber-scroll-bar-small">
        <div
          class="task-card"
          :key="index"
          v-for="(item, index) in task_release_infos"
        >
          <div class="header">
            <!-- 角色名称 -->
            <div class="role-name" :title="item.role_name">
              {{ item.role_name }}
            </div>
            <!-- 角色下学员头像去前面12个 -->
            <div class="role-logo-wrap">
              <span
                class="role-logo"
                :key="user.resource_id"
                v-for="(user, index) in item.user_info_list"
                v-if="index < 11"
              >
                <img :src="user.logo" />
              </span>
            </div>
            <!-- 角色下学员人数 -->
            <div class="total-info">
              {{
                $t('rbt.total') + item.user_info_list.length + $t('rbt.people')
              }}
            </div>
            <div class="percentage-wrap">
              <span class="primary">{{ item.release_count }}</span
              >/<span>{{ item.all_count }}</span>
            </div>
          </div>
          <!--  -->
          <div
            class="content cyber-scroll-bar-small"
            v-if="item.mission_stages.length"
          >
            <div
              :key="index"
              v-for="(stage, index) in item.mission_stages"
              style="margin-bottom: 16px"
            >
              <task-issue
                @update="getMissionList"
                :task-stage="stage"
                :index-stage="index"
                :cr-event-data="crEventData"
                :currentRole="item"
              ></task-issue>
            </div>
          </div>
          <div class="no-data" v-else>
            <div
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
      </div>
    </div>
  </div>
</template>

<script>
import block from '@/components/block';
import defaultLogo from '@/assets/img/addhost.png';
import collapseTransition from '@/components/collapase/index';
import EmptyPage from '@/pages/web/Empty/behavior-index.vue';
import taskIssue from './task-issue-list'; //任务下发
import { getTaskProgressApi, getMissionListApi } from '@/api/web/team-training';
export default {
  components: {
    block,
    collapseTransition,
    taskIssue,
    EmptyPage,
  },
  props: {
    crEventData: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      task_release_infos: [],
      taskData: {},
      percent: 0,
      defaultLogo,
      resource_id: this.$route.params && this.$route.params.resource_id,
      released: '',
      unreleased: '',
      submitted: '',
      unsubmitted: '',
      waiting: '',
      roles: {
        total: 23,
        distributed: 10,
        role: [],
      },
      taskList: [],
    };
  },
  watch: {},
  computed: {},
  created() {
    this.resource_id = this.$route.params && this.$route.params.resource_id;
    this.getProgressData();
  },
  mounted() {
    this.getMissionList();
  },
  methods: {
    // 教员获取任务进度
    getProgressData() {
      getTaskProgressApi({ resource_id: this.resource_id }).then((res) => {
        this.taskData = res.data.data;
        this.released = this.taskData.released; //已下发
        this.unreleased = this.taskData.unreleased; //待下发
        this.submitted = this.taskData.submitted; //已提交
        this.unsubmitted = this.taskData.unsubmitted; //待提交
        this.waiting = this.taskData.waiting; //待评估
        this.percent =
          Number((this.taskData.released / this.taskData.total).toFixed(2)) *
          100; //任务下发进度
        this.roles = this.taskData.roles;
      });
    },
    // 教员获取任务下发任务列表
    getMissionList() {
      getMissionListApi({ resource_id: this.resource_id }).then((res) => {
        const data = _.get(res, 'data.data', []);
        data.forEach((item) => {
          item.mission_stages.forEach((stage) => {
            stage.mission_infos.forEach((task) => {
              // 任务添加checked属性用来控制选中
              task.checked = false;
              // 完成任务人员添加属性判断
              task.finish_user_list.forEach((item) => {
                item.finish = true;
              });
              // 未完成任务人员添加属性判断
              task.not_finish_user_list.forEach((item) => {
                item.finish = false;
              });
              // 所有人员
              task.all_user_list = task.finish_user_list.concat(
                task.not_finish_user_list,
              );
            });
          });
        });
        this.task_release_infos = data;
        this.getProgressData();
      });
    },
  },
};
</script>
<style lang="scss" scoped>
// 下拉箭头动画
.arrowTransform {
  transition: 0.2s;
  transform-origin: center;
  transform: rotateZ(0deg);
}
.arrowTransformReturn {
  transition: 0.2s;
  transform-origin: center;
  transform: rotateZ(180deg);
}

.task-direct {
  width: 100%;
  // height: 100%;
  height: calc(100% - 50px);
  overflow-y: scroll;
  .task-progress {
    border-radius: 4px;
    width: 100%;
    background: var(--bg-color-2);
    padding: 16px;
    .progress-category {
      height: 64px;
      display: flex;
      justify-content: space-between;
      .item {
        border-radius: 2px;
        flex: 1;
        background: var(--bg-color-3);
        margin-right: 8px;
        display: flex;
        align-items: center;
        &:last-child {
          margin-right: 0px;
        }
        .outer-wrap {
          width: 40px;
          height: 40px;
          background: var(--neutral0);
          margin-left: 20px;
          border-radius: 50%;
          display: flex;
          justify-content: center;
          align-items: center;
          .inner-wrap {
            width: 26px;
            height: 26px;
            border-radius: 50%;
            display: flex;
            justify-content: center;
            align-items: center;
            .category-icon-color {
              color: var(--white-color);
            }
          }
          .distribute {
            background: var(--primary-color);
          }
          .not-distribute {
            background: var(--blue-color);
          }
          .submit {
            background: var(--green-color);
          }
          .not-submit {
            background: var(--orange-color);
          }
          .waiting {
            background: var(--primary-color);
          }
        }
        .status {
          display: inline-block;
          height: 22px;
          line-height: 22px;
          margin: 0 16px;
          font-size: 14px;
          color: var(--neutral7);
        }
        .num {
          display: inline-block;
          height: 22px;
          line-height: 22px;
          font-size: 20px;
          color: var(--neutral8);
        }
      }
    }
    .overall-progress {
      border-radius: 2px;
      height: 48px;
      margin-top: 16px;
      background: var(--bg-color-3);
      padding: 0 16px 0px 16px;
      display: flex;
      align-items: center;
      .name {
        width: 100px;
        font-size: 14px;
        color: var(--neutral8);
      }
      .progress-wrap {
        flex: 1;
        height: 8px;
        .overall-outer-progress {
          width: 100%;
          height: 100%;
          background: var(--neutral0);
          border-radius: 8px;
          .overall-inner-progress {
            height: 100%;
            border-radius: 8px;
          }
          .overall-inner-progress-none {
            background: var(--neutral0);
          }
          .overall-inner-progress-has {
            background: var(--primary-color);
          }
        }
      }
      .percentage-wrap {
        font-size: 14px;
        color: var(--neutral8);
        width: 70px;
        text-align: right;
      }
    }
    .all-progress {
      padding: 0 16px 0px 16px;
      // max-height: 196px;
      max-height: 176px;
      overflow: auto;
      .role-prgress {
        position: relative;
        padding: 10px 0 0;

        .red-team,
        .blue-team {
          display: flex;
          align-items: center;
          //   padding-left: 24px;
          height: 30px;
          .name {
            width: 76px;
            font-size: 14px;
            color: var(--neutral8);
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
          }
          .progress-wrap {
            flex: 1;
          }
          .percentage-wrap {
            font-size: 14px;
            color: var(--neutral8);
            width: 96px;
            text-align: right;
          }
        }
        .collapase-wrap {
          //   padding-left: 24px;
          .red-role {
            display: flex;
            align-items: center;
            height: 30px;
            .name {
              width: 90px;
              font-size: 14px;
              color: var(--neutral8);
              overflow: hidden;
              white-space: nowrap;
              text-overflow: ellipsis;
            }
            .progress-wrap {
              flex: 1;
              display: flex;
              align-items: center;
              .progress-item {
                height: 8px;
                margin-right: 10px;
                .progress-item-outer {
                  width: 100%;
                  height: 100%;
                  background: var(--bg-color-3);
                  border-radius: 8px;
                  .progress-item-inner {
                    height: 100%;
                    border-radius: 8px;
                  }
                  .color-one {
                    background: var(--blue-color);
                  }
                  .color-two {
                    background: var(--green-color);
                  }
                  .color-three {
                    background: var(--orange-color);
                  }
                }
              }
              .progress-item:last-child {
                margin-right: 0;
              }
            }
            .percentage-wrap {
              font-size: 14px;
              color: var(--neutral8);
              width: 70px;
              text-align: right;
            }
          }
        }
        .triangle-wrap {
          width: 20px;
          height: 20px;
          position: absolute;
          top: 18px;
          left: 0;
          cursor: pointer;
          .triangle-color {
            color: var(--neutral3);
          }
        }
      }
    }
  }
  .task-distribution {
    border-radius: 4px;
    width: 100%;
    margin-top: 16px;
    padding: 16px;
    background: var(--bg-color-2);
    .task-detail {
      width: 100%;
      height: 560px;
      white-space: nowrap;
      overflow-x: auto;
      display: flex;
      .task-card {
        display: inline-block;
        width: 508px;
        height: 100%;
        margin-right: 32px;
        &:last-child {
          margin-right: 0;
        }
        .header {
          height: 24px;
          line-height: 24px;
          display: flex;
          align-items: center;
          position: relative;
          .role-name {
            max-width: 160px;
            color: var(--neutral8);
            font-size: 16px;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
            font-weight: 400;
          }
          .role-logo-wrap {
            display: flex;
            margin-left: 16px;
            .role-logo {
              width: 24px;
              height: 24px;
              border-radius: 50%;
              margin-left: -6px;
              background: var(--bg-color-3);
              border: 1px solid var(--neutral1);
              img {
                border-radius: 50%;
                width: 100%;
                height: 100%;
              }
            }
          }
          .total-info {
            margin-left: 8px;
            color: var(--neutral7);
            font-size: 14px;
          }
          .percentage-wrap {
            position: absolute;
            right: 0;
            font-size: 16px;
            .primary {
              color: var(--primary-color);
            }
          }
        }
        .content {
          margin-top: 16px;
          overflow-y: scroll;
          position: relative;
          height: calc(100% - 40px);
        }
        .no-data {
          margin-top: 16px;
          position: relative;
          background: var(--bg-color-3);
          height: calc(100% - 290px);
        }
      }
    }
  }
}
</style>
