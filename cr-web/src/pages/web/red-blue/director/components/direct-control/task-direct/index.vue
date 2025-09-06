<template>
  <div class="task-direct el-tabs__content cyber-scroll-bar-small">
    <!-- 任务进度 -->
    <div class="task-progress">
      <block :title="$t('rbt.taskComplete')"></block>
      <!-- 任务进度分类 -->
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
                released + unreleased === 0
                  ? 'overall-inner-progress-none'
                  : 'overall-inner-progress-has',
              ]"
              :style="{
                width:
                  `${Number(
                    ((released / (released + unreleased)) * 100).toFixed(0),
                  )}` + '%',
              }"
            ></div>
          </div>
        </div>
        <div class="percentage-wrap">
          {{ released + '/' + (released + unreleased) }}
        </div>
      </div>
      <!-- 红方蓝方进度 -->
      <div class="red-blue-progress">
        <!-- 红方 -->
        <div class="red-progress">
          <div class="red-team">
            <span class="name">{{ $t('common.redUser') }}</span>
            <!-- 进度条展示 -->
            <div class="progress-wrap">
              <div class="red-outer-progress">
                <div
                  class="red-inner-progress"
                  :class="[
                    red_roles.total
                      ? 'red-inner-progress-has'
                      : 'red-inner-progress-none',
                  ]"
                  :style="{
                    width:
                      `${Number(
                        ((red_roles.released / red_roles.total) * 100).toFixed(
                          0,
                        ),
                      )}` + '%',
                  }"
                ></div>
              </div>
            </div>
            <!-- 比例值 -->
            <div class="percentage-wrap">
              {{ red_roles.released + '/' + red_roles.total }}
            </div>
          </div>
          <!-- 折叠区域 角色进度 -->
          <collapse-transition>
            <div class="collapase-wrap" v-show="redFold">
              <div class="red-role" v-for="(role, index) in red_roles.role">
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
                          class="progress-item-inner red"
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
          <div class="triangle-wrap" @click.stop="redFold = !redFold">
            <cb-iconfont
              ref="xialaRef"
              type="icon-xiala1"
              size="16"
              class="triangle-color"
              :class="{
                arrowTransform: !redFold,
                arrowTransformReturn: redFold,
              }"
            ></cb-iconfont>
          </div>
        </div>
        <!-- 蓝方 -->
        <div class="blue-progress">
          <div class="blue-team">
            <span class="name">{{ $t('common.blueUser') }}</span>
            <!-- 进度条展示 -->
            <div class="progress-wrap">
              <div class="blue-outer-progress">
                <div
                  class="blue-inner-progress"
                  :class="[
                    blue_roles.total
                      ? 'blue-inner-progress-has'
                      : 'blue-inner-progress-none',
                  ]"
                  :style="{
                    width:
                      `${Number(
                        (
                          (blue_roles.released / blue_roles.total) *
                          100
                        ).toFixed(0),
                      )}` + '%',
                  }"
                ></div>
              </div>
            </div>
            <!-- 比例值 -->
            <div class="percentage-wrap">
              {{ blue_roles.released + '/' + blue_roles.total }}
            </div>
          </div>
          <!-- 折叠区域 角色进度 -->
          <collapse-transition>
            <div class="collapase-wrap" v-show="blueFold">
              <div class="blue-role" v-for="(role, index) in blue_roles.role">
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
                          class="progress-item-inner blue"
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
          <div class="triangle-wrap" @click.stop="blueFold = !blueFold">
            <cb-iconfont
              ref="xialaRef"
              type="icon-xiala1"
              size="16"
              class="triangle-color"
              :class="{
                arrowTransform: !blueFold,
                arrowTransformReturn: blueFold,
              }"
            ></cb-iconfont>
          </div>
        </div>
      </div>
    </div>
    <!-- 任务下发 -->
    <div class="task-distribution">
      <block :title="$t('rbt.taskDelivery')"></block>
      <cb-tabs v-model="activeName">
        <cb-tab-pane :label="$t('common.redUser')" name="red"> </cb-tab-pane>
        <cb-tab-pane :label="$t('common.blueUser')" name="blue"> </cb-tab-pane>
      </cb-tabs>
      <div class="task-detail cyber-scroll-bar-small">
        <div
          class="task-card"
          :key="index"
          v-for="(item, index) in task_release_infos"
        >
          <div class="header">
            <div class="role-name" :title="item.role_name">
              {{ item.role_name }}
            </div>
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
          <div
            class="content cyber-scroll-bar-small"
            v-if="item.mission_stages.length > 0"
          >
            <div
              :key="index"
              v-for="(stage, index) in item.mission_stages"
              style="margin-bottom: 16px"
            >
              <task-list
                :mission-stage="index"
                :task-stage="stage"
                @update="getMissionList"
                :cr-event-data="crEventData"
                :currentRole="item"
              ></task-list>
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
import taskList from './components/task-list';
import { getMissionProgress, getMissionList } from '@/api/web/red-blue.js';
export default {
  components: {
    block,
    collapseTransition,
    taskList,
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
      defaultLogo,
      redFold: false,
      blueFold: false,
      resource_id: this.$route.params && this.$route.params.resource_id,
      released: '',
      unreleased: '',
      submitted: '',
      unsubmitted: '',
      red_roles: {},
      blue_roles: {},
      activeName: 'red',
      task_release_infos: [],
    };
  },
  watch: {
    activeName: {
      handler(nv, ov) {
        if (nv === 'red') {
          this.getMissionList();
        } else if (nv === 'blue') {
          this.getMissionList();
        }
      },
      immediate: true,
      deep: true,
    },
  },
  computed: {},
  created() {
    this.resource_id = this.$route.params && this.$route.params.resource_id;
  },
  mounted() {
    // 默认先获取红方
    this.getMissionList();
  },
  methods: {
    // 获取任务进度和下发进度
    getMissionProgress() {
      getMissionProgress({ resource_id: this.resource_id }).then((res) => {
        const data = _.get(res, 'data.data', []);
        this.released = data.released;
        this.unreleased = data.unreleased;
        this.submitted = data.submitted;
        this.unsubmitted = data.unsubmitted;
        this.red_roles = data.red_roles;
        this.blue_roles = data.blue_roles;
      });
    },
    // 获取任务列表
    getMissionList() {
      //  获取任务进度和下发进度
      this.getMissionProgress();
      let index = 0;
      if (this.activeName === 'red') {
        index = 0;
      } else if (this.activeName === 'blue') {
        index = 1;
      }
      getMissionList({ resource_id: this.resource_id }).then((res) => {
        const data = _.get(res, 'data.data', []);
        // 获取红方 data[0]，蓝方data[1]
        data.forEach((item) => {
          item.task_release_infos.forEach((role) => {
            role.mission_stages.forEach((stage) => {
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
                task.all_user_list = task.finish_user_list.concat(
                  task.not_finish_user_list,
                );
              });
            });
          });
        });
        // index未传默认获取红方
        this.task_release_infos = data[index].task_release_infos;
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
  transform: rotateZ(-90deg);
}
.arrowTransformReturn {
  transition: 0.2s;
  transform-origin: center;
  transform: rotateZ(0deg);
}

.task-direct {
  width: 100%;
  height: 100%;
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
    .red-blue-progress {
      padding: 0 16px 0px 16px;
      // 红方有下边框
      .red-progress {
        border-bottom: 1px solid var(--neutral0);
      }
      .red-progress,
      .blue-progress {
        position: relative;
        padding: 10px 0;

        .red-team,
        .blue-team {
          display: flex;
          align-items: center;
          padding-left: 24px;
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
            height: 8px;
            .red-outer-progress {
              width: 100%;
              height: 100%;
              background: var(--bg-color-3);
              border-radius: 8px;
              .red-inner-progress {
                height: 100%;
                border-radius: 8px;
              }
              .red-inner-progress-has {
                background: var(--red-color);
              }
              .red-inner-progress-none {
                background: var(--bg-color-3);
              }
            }
            .blue-outer-progress {
              width: 100%;
              height: 100%;
              background: var(--bg-color-3);
              border-radius: 8px;
              .blue-inner-progress {
                height: 100%;
                border-radius: 8px;
              }
              .blue-inner-progress-has {
                background: var(--blue-color);
              }
              .blue-inner-progress-none {
                background: var(--bg-color-3);
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
        .collapase-wrap {
          padding-left: 24px;
          .red-role,
          .blue-role {
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
              height: 8px;
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
                  .red {
                    background: var(--red-color);
                  }
                  .blue {
                    background: var(--blue-color);
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
      overflow-y: hidden;
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
              margin-left: -10px;
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
