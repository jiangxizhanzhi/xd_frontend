<template>
  <div id="scriptExecution">
    <!--流量发生-->
    <div v-if="trafficLists.length" class="traffic-flow">
      <div class="common-title-div">
        <title-director
          :square-color="'bg-color-sky-blue'"
          :name="$t('m.hasReport')"
        />
        <div
          v-if="language === 'zh-CN'"
          class="fr color-white"
          style="margin-left: 5px"
        >
          {{ $t('m.altogether') }}
          <span class="cy-color" style="margin: 0 3px">{{ flowAllName }}</span>
          {{ $t('m.till') }}
          <span class="cy-color" style="margin: 0 3px">
            {{ trafficLists.length }}</span
          >
          {{ $t('m.number') + $t('m.flowFlow') }}
        </div>
        <div v-else class="fr" style="margin-left: 5px">
          <span class="cy-color" style="margin: 0 3px">
            {{ trafficLists.length }}
          </span>
          <span>traffics in total:</span>
          <span class="cy-color" style="margin: 0 3px">{{ flowAllName }}</span>
          <span>etc</span>
        </div>
      </div>
      <div class="list-div">
        <div
          v-for="(traffic, index) in trafficLists"
          :key="index"
          class="common-message flow-div"
        >
          <div
            class="common-type-div attack-bg"
            v-if="traffic.interactive_type === $CONSTANT.FlowType.attack.value"
          >
            {{ $t('flowEmulation.attackFlow') }}
          </div>
          <div
            class="common-type-div background-bg"
            v-if="
              traffic.interactive_type === $CONSTANT.FlowType.background.value
            "
          >
            {{ $t('flowEmulation.backgroundFlow') }}
          </div>
          <!-- -1初始化、0关闭、2错误 -->
          <span
            v-if="
              traffic.status === -1 ||
              traffic.status === 0 ||
              traffic.status === 2
            "
            @click="playFlow(traffic)"
            style="display: inline-block"
          >
            <cb-iconfont type="icon-kaishi" class="cursor" size="38" />
          </span>
          <!-- 1运行、3准备中 -->
          <img
            v-if="traffic.status === 1 || traffic.status === 3"
            class="cursor"
            :src="currentThemeBg.stopBg"
            @click="pauseFlow(traffic)"
          />
          <!-- 流量名 -->
          <div class="common-top color-white one-overflow">
            {{ traffic.name }}
          </div>
          <!-- 节点名 -->
          <div
            class="common-top one-overflow color-gray common-server"
            :title="traffic.node_name"
          >
            {{ traffic.node_name }}
          </div>
          <!-- count: 次数 -->
          <template v-if="getCount(traffic.count)">
            <div
              class="one-overflow flow-frequency"
              :title="
                $t('m.alreadyRunning') + traffic.count + $t('m.flowFrequency')
              "
            >
              <span class="font12 cy-color">
                {{ $t('m.alreadyRunning') }}
                <span class="" style="margin: 0 3px">{{ traffic.count }}</span>
                {{ $t('m.flowFrequency') }}
              </span>
            </div>
          </template>
          <template>
            <!--运行中-->
            <span v-if="traffic.status === 1" class="red-color font12">{{
              $t('m.running')
            }}</span>
            <!-- 准备中 -->
            <span v-if="traffic.status === 3" class="red-color font12">{{
              $t('m.ready')
            }}</span>
            <!-- 错误 -->
            <div class="error-content" v-if="traffic.status === 2">
              <span class="red-color font12">
                {{ $t('m.operationError') }}:
              </span>
              <span
                :title="traffic.status_text"
                class="red-color font12 red-color-error"
              >
                {{ traffic.status_text }}
              </span>
            </div>
          </template>
        </div>
      </div>
    </div>

    <!--任务组-->
    <div v-for="(item, index) in teamLists" :key="index" class="task-list fl">
      <div class="common-title-div">
        <title-director
          :square-color="'bg-color-sky-blue'"
          :name="item.name"
          class="fl"
        />
        <div
          v-if="language === 'zh-CN'"
          class="fr color-white"
          style="margin-left: 5px"
        >
          {{ $t('m.altogether') }}
          <span class="cy-color" style="margin: 0 3px">
            {{ item.userName }}
          </span>
          {{ $t('m.till') }}
          <span class="cy-color" style="margin: 0 3px">
            {{ item.userLength }}
          </span>
          {{ $t('m.people') }}
        </div>
        <div v-else class="fr" style="margin-left: 5px">
          <span class="cy-color" style="margin: 0 3px">
            {{ item.userLength }}
          </span>
          <span>trainees in total:</span>
          <span class="cy-color" style="margin: 0 3px">
            {{ item.userName }}
          </span>
          <span>etc</span>
        </div>
      </div>

      <div
        v-for="(i, indexList) in item.missions_list"
        :key="indexList"
        class="list-title"
      >
        <div class="list-header">
          <span class="stage-name fl one-overflow" :title="i.stage">{{
            i.stage
          }}</span>
        </div>
        <div class="list-div">
          <!--这是copy的任务编排的-->
          <div
            v-for="tasks in i.missions"
            :key="tasks.resource_id"
            class="task-message bg1"
          >
            <div class="task-top">
              <div class="task-content">
                <div class="task-top-title one-overflow">
                  <span>
                    [<span
                      class="title-span"
                      :title="getType(tasks.type)"
                      v-text="getType(tasks.type)"
                    />]
                  </span>
                  <span
                    class="title-span"
                    :title="tasks.title"
                    style="margin-left: 10px"
                  >
                    {{ tasks.title }}
                  </span>
                </div>
                <div v-show="tasks.task_status" class="task-top-complete">
                  <span class="complete-span">
                    {{ $t('m.hasReport') }}
                    <span class="blue-name complete-count">
                      {{ tasks.complete_num }}
                    </span>
                    {{ $t('m.peoples') }},
                  </span>
                  <span class="complete-span">
                    {{ $t('m.hasIssued') }}
                    <span class="blue-name complete-count">
                      {{ item.userLength }}
                    </span>
                    {{ $t('m.peoples') }}
                  </span>
                </div>
                <div v-show="!tasks.task_status" class="task-top-complete">
                  <span class="complete-span">{{ $t('m.notIssued') }}</span>
                </div>
              </div>
              <div class="task-foot">
                <div class="foot-right">
                  <div class="img-div three-img-div probe-elc-switch">
                    <span class="white-color" style="margin-right: 10px">{{
                      $t('m.answerKey')
                    }}</span>
                    <cb-switch
                      v-model="tasks.write_up_show"
                      :active-value="true"
                      :inactive-value="false"
                      @change="
                        isViewAnswer(tasks.write_up_show, tasks.resource_id)
                      "
                    ></cb-switch>
                  </div>
                  <div class="icon-div one-img-div">
                    <cb-iconfont
                      v-if="!tasks.task_status"
                      :title="$t('common.edit')"
                      :size="'20'"
                      type="icon-bianji"
                      @click.native="editTask(tasks, item.resource_id)"
                    ></cb-iconfont>
                    <cb-iconfont
                      v-else
                      class="cursor-not"
                      :title="$t('common.edit')"
                      :size="'20'"
                      type="icon-bianji"
                    ></cb-iconfont>
                  </div>
                  <div class="icon-div one-img-div">
                    <cb-iconfont
                      v-if="tasks.task_status"
                      class="cursor-not"
                      :title="$t('common.edit')"
                      :size="'20'"
                      type="icon-xiafa"
                    ></cb-iconfont>
                    <cb-iconfont
                      v-else
                      :title="$t('common.edit')"
                      :size="'20'"
                      type="icon-xiafa"
                      @click.native="issuedTask(tasks, item.resource_id)"
                    ></cb-iconfont>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!--编辑弹窗-->
    <cb-dialog
      :visible.sync="editDialog"
      :title="$t('common.edit')"
      width="60%"
      :append-to-body="true"
      center
    >
      <edit-dialog ref="editDialog" :task-info="singleTaskInfo" />
      <div slot="footer" class="dialog-footer">
        <cb-button button-type="confirm" @click="saveTaskInfo()">
          {{ $t('common.confirm') }}
        </cb-button>
        <cb-button button-type="cancel" @click="editDialog = false">
          {{ $t('m.cancel') }}
        </cb-button>
      </div>
    </cb-dialog>
  </div>
</template>

<script>
import _ from 'lodash';
import wsutil from '@/utils/websocket';
import utils from '@/utils/utils';
import TitleDirector from '@/pages/web/RedVsBlue/Director/components/title.vue';
import EditDialog from '@/components/TaskEditor/editDialog.vue';
import { getLanguage, getTheme, request } from '@cyber/helper';
import { getRadarLabels } from '@/api/common';
export default {
  name: 'ScriptExecution',
  components: {
    EditDialog,
    TitleDirector,
  },
  props: {
    resourceId: {
      type: String,
      default: '',
    },
    crEventData: {
      type: Object,
      default: () => {},
    },
    closeSceneBool: {
      type: Boolean,
      default: () => {
        return false;
      },
    },
  },
  data() {
    return {
      cookie: '',
      skillLabel: [],
      update_role_id: '',
      connection: null,
      flowAllName: '',
      trafficLists: [],
      teamLists: [],
      currentTask: null,
      editDialog: false,
      singleTaskInfo: {},
      resource_id: this.$route.params && this.$route.params.resource_id,
      language: getLanguage(),
      theme: getTheme(),
      callAction: '',
      trafficListsCopy: [],
    };
  },
  computed: {
    currentThemeBg() {
      const currentBg = {
        'theme-dark': {
          stopBg: require('@/assets/img/TeamTrain/stop.png').default,
        },
        'theme-light': {
          stopBg: require('@/assets/img/TeamTrain/stop_shadow.png').default,
        },
      };
      return currentBg[this.theme];
    },
  },
  watch: {
    crEventData: {
      handler(val, oldval) {
        if (val !== oldval) {
          if (!_.isEmpty(val)) {
            this.$nextTick(() => {
              this.$set(val, 'data', val);
              this.initFlow();
              this.bindSceneWs();
            });
          }
        }
      },
      deep: true,
      immediate: true,
    },
    // 父组件编辑器关闭场景是否被点击
    closeSceneBool: {
      handler(newValue, oldValue) {
        if (newValue) {
          this.initFlow();
        }
      },
    },
  },
  beforeDestroy() {
    if (this.connection) {
      this.connection.close();
      this.connection = null;
    }
  },
  mounted() {
    this.initData(this.$route.params.resource_id);
    // this.initData();
    this.getRadarLabelsList();
    /* this.initFlow(); */
    // 获取token
    /* this.cookie = document.cookie.split('cr_jwttoken=')[1]; */
    this.cookie = utils.getCookie('cr_jwttoken');
  },
  methods: {
    // 获取技能标签
    getRadarLabelsList() {
      // this.$request.get("/cr/admin/mission/missions/radar_labels",null,{baseURL:"/api/ojj"})
      // .then((res) => {
      //   const data = _.get(res, 'data.data.labels', []);
      //   this.skillLabel = data;
      // });
      getRadarLabels().then((res) => {
        const data = _.get(res, 'data.data.labels', []);
        this.skillLabel = data;
      });
    },
    getType(type) {
      let text = '';
      if (type === 0) {
        text = this.$t('m.judge');
      } else if (type === 1) {
        text = this.$t('m.radio');
      } else if (type === 2) {
        text = this.$t('m.multipleSelection');
      } else if (type === 3) {
        text = this.$t('m.fillPosition');
      } else if (type === 4) {
        text = this.$t('m.questionAnswer');
      } else if (type === 5) {
        text = this.$t('m.attack');
      } else if (type === 6) {
        text = this.$t('m.defense');
      } else if (type === 7) {
        text = this.$t('m.file');
      }
      return text;
    },

    // 转化流量的运行成功次数
    getCount(count) {
      if (count !== null) {
        return JSON.stringify(count);
      }
    },

    //获取流量集合
    initFlow() {
      request
        .get(
          '/cr/team_train/room/flow',
          { room_id: this.resource_id },
          { baseURL: '/api/ojj' },
        )
        .then((res) => {
          let allName = '';
          for (var i = 0; i < res.data.data.data.length; i++) {
            if (i >= 2) {
              break;
            }
            if (i === res.data.data.data.length - 1) {
              allName += res.data.data.data[i].name;
            } else {
              //  allName += res.data.data.data[i].name + '、';
              if (i === 1) {
                allName += res.data.data.data[i].name;
              } else {
                allName += res.data.data.data[i].name + '、';
              }
            }
          }
          this.flowAllName = allName;
          this.trafficLists = res.data.data.data;
          this.trafficListsCopy = res.data.data.data;
        });
    },

    //流量的ws,获取流量状态,
    bindSceneWs() {
      wsutil.cbind(
        `/ojj/ws/cr/ce_base/scene?business_id=${this.resource_id}&token=${this.cookie}`,
        {
          '': (data) => {
            this.callAction = data?.data?.call_action;
            if (this.callAction) {
              const wsFlowList =
                  data?.data?.scene_element_plugin_data?.cpflow?.flows,
                wsSceneElementId = data?.data?.scene_element.id; // 场景中节点的id

              if (wsFlowList && wsFlowList.length && wsSceneElementId) {
                const wsFlowListTemp = wsFlowList; // ws实时获取的流量列表
                const trafficListsCopy = this.trafficListsCopy; // flow_list接口返回的流量列表
                for (let i = 0, len = trafficListsCopy.length; i < len; i++) {
                  /* 判断 场景中节点的id 和 flow_list接口返回的流量列表的node_id 是否一致*/
                  if (wsSceneElementId === trafficListsCopy[i].node_id) {
                    for (
                      let j = 0, lenJ = wsFlowListTemp.length;
                      j < lenJ;
                      j++
                    ) {
                      /* 判断 ws返回的流量的id 和 flow_list接口返回的流量id 是否一致,一致才更新流量*/
                      if (wsFlowListTemp[j].id === trafficListsCopy[i].id) {
                        /* ws拿到的数据缺少node_id和node_name,要和flow_list匹配,添加这两个属性 */
                        wsFlowListTemp[j].node_name =
                          trafficListsCopy[i].node_name;
                        wsFlowListTemp[j].node_id = trafficListsCopy[i].node_id;
                        trafficListsCopy[i] = wsFlowListTemp[j];
                      }
                    }
                  }
                }
                this.trafficLists = [...trafficListsCopy];
              }
            }
          },
        },
      );
    },

    initData(id) {
      this.$request
        .get(
          '/cr/team_train/role',
          { resource_id: id },
          { baseURL: '/api/ojj' },
        )
        .then((res) => {
          _.forEach(res.data.data.roles, (roles) => {
            // 在这改user相关
            this.$set(roles, 'userLength', roles.users.length);
            let userAllName = '';
            for (var i = 0; i < roles.users.length; i++) {
              if (i >= 2) {
                break;
              }
              if (i === roles.users.length - 1) {
                userAllName += roles.users[i].name;
              } else {
                if (i === 1) {
                  userAllName += roles.users[i].name;
                } else {
                  userAllName += roles.users[i].name + '、';
                }
              }
            }
            this.$set(roles, 'userName', userAllName);
            _.forEach(roles.missions_list, (list) => {
              _.forEach(list.missions, (item) => {
                this.$set(item, 'completeNum', 1);
                this.$set(
                  item,
                  'task_status',
                  res.data.data.mission_mapping[item.resource_id] ? 1 : 0,
                );
                if (
                  res.data.data.mission_mapping[item.resource_id] &&
                  res.data.data.mission_mapping[item.resource_id].complete_num
                ) {
                  this.$set(
                    item,
                    'complete_num',
                    res.data.data.mission_mapping[item.resource_id]
                      .complete_num,
                  );
                } else {
                  this.$set(item, 'complete_num', 0);
                }
                if (res.data.data.show_writeup_mapping[item.resource_id]) {
                  this.$set(item, 'write_up_show', true);
                } else {
                  this.$set(item, 'write_up_show', false);
                }
              });
            });
          });
          this.teamLists = res.data.data.roles;
        });
    },

    // 团队训练启动流量
    playFlow(traffic) {
      const params = {};
      params.node_id = traffic.node_id;
      params.flow_id = traffic.id;
      params.room_id = this.resource_id;
      request
        .post('/cr/team_train/room/flow', params, { baseURL: '/api/ojj' })
        .then((res) => {
          /* this.initFlow(); */
          this.$message({
            message: this.$t('m.success'),
            type: 'success',
          });
        })
        .catch((error) => {});
    },

    //暂停流量
    pauseFlow(traffic) {
      const params = {};
      params.node_id = traffic.node_id;
      params.flow_id = traffic.id;
      params.room_id = this.resource_id;
      request
        .post('/cr/team_train/room/flow/stop', params, { baseURL: '/api/ojj' })
        .then((res) => {
          /* this.initFlow(); */
          this.$message({
            message: this.$t('m.success'),
            type: 'success',
          });
        })
        .catch((error) => {});
    },

    isViewAnswer(write_up_show, mission_hash) {
      // 是否放开题解
      let switchState = 1; // 开启传1 关闭传0
      if (write_up_show) {
        // 如果true，意味着已经开启，所以要关闭，传0,但是开关会在传值时v-model值会置返
        switchState = true;
      } else {
        switchState = false;
      }
      const params = {};
      params.write_up_show = switchState;
      params.mission_resource_id = mission_hash;
      // params.training_team = this.resource_id;
      params.room_id = this.resource_id;
      this.$request
        .post('/cr/team_train/room/update_show_write_up', params, {
          baseURL: '/api/ojj',
        })
        .then((res) => {
          if (!write_up_show) {
            this.$message.success(this.$t('m.SuccessfullyClosedSolution'));
          } else {
            this.$message.success(this.$t('m.SuccessfullyLetTheSolution'));
          }
          this.initData(this.$route.params.resource_id);
        })
        .catch((error) => {
          this.initData(this.$route.params.resource_id);
        });
    },
    // 场景任务修改
    saveTaskInfo() {
      const temp = this.$refs.editDialog.taskInfos;
      const skill_points = [];
      temp.levelRate.forEach((item) => {
        skill_points.push(item.rate);
      });
      const params = {};
      params.skill_points = JSON.stringify(skill_points);
      params.score = temp.score;
      params.title = temp.title;
      params.resource_id = temp.resource_id;
      this.$request
        .put('/cr/admin/mission/mission_update', params, {
          baseURL: '/api/ojj',
        })
        .then((res) => {
          this.$message.success(this.$t('m.changedSuccessfully'));
          this.initData(this.$route.params.resource_id);
          this.editDialog = false;
        });
    },
    issuedTask(task, role_resource_id) {
      // 下发任务
      if (task.task_status) {
        this.$message.error(
          this.$t('m.taskHasBeenDeliveredDoNotDeliverItAgain'),
        );
      } else {
        const params = {};
        params.role_resource_id = role_resource_id;
        params.mission_resource_id = task.resource_id;
        this.$request
          .post('/cr/team_train/room/missions', params, { baseURL: '/api/ojj' })
          .then((res) => {
            this.$message.success(this.$t('m.successfullyIssued'));
            this.initData(this.$route.params.resource_id);
            this.$emit('refreshTimeData');
          });
      }
    },
    editTask(task, resource_id) {
      this.update_role_id = resource_id;
      // 打开编辑任务弹窗
      this.currentTask = task;
      // [社会工程学、密码学、漏洞]、应用层渗透、数据运用、其他]
      const type = [
        this.$t('m.socialEngineering'),
        this.$t('m.cryptography'),
        this.$t('m.loophole'),
        this.$t('m.applicationLayerPermeation'),
        this.$t('m.dataApplication'),
        this.$t('m.other'),
      ];
      const array = [];
      _.forEach(JSON.parse(task.skill_points), (item, itemIndex) => {
        array.push({
          rate: item,
        });
      });
      _.forEach(this.skillLabel, (typeItem, index) => {
        if (!array[index]) {
          array[index] = {};
        } else {
          if (array[index].rate) {
            array[index].rate = parseInt(array[index].rate);
          }
        }
        array[index].type = this.skillLabel[index];
      });
      this.singleTaskInfo = JSON.parse(JSON.stringify(task));
      this.singleTaskInfo.levelRate = array;
      this.editDialog = true;
    },
  },
};
</script>

<style lang="scss">
#scriptExecution {
  width: 100%;
  height: 100%;
  padding-top: 20px;
  .traffic-flow {
    width: 100%;
    margin: 10px 0 5px 0;
  }
  .flow-frequency {
    line-height: 21px;
  }
  .task-list {
    width: 100%;
  }
  .common-title-div {
    width: calc(100% - 8px);
    height: 30px;
    // line-height: 30px;
    font-size: 14px;
    margin-top: 12px auto 0;
    text-align: center;
    ::v-deep .common-title {
      width: auto !important;
      margin-left: 8px;
      .name-div {
        font-size: 14px !important;
        height: 30px;
        // line-height: 30px;
      }
    }
  }
  .list-title {
    width: 100%;
    // 任务卡片
    .bg2 {
      background: linear-gradient(
        0deg,
        rgba(31, 39, 54, 1) 0%,
        rgba(46, 57, 81, 1) 100%
      );
      border-radius: 16px;
      box-sizing: border-box;
    }
    .task-message {
      float: left;
      width: 220px;
      height: 122px;
      margin: 10px 8px 10px 8px;
      padding: 1px;

      .task-top {
        overflow: hidden;
        height: 100%;
        border-radius: 2px;
      }
      .task-content {
        height: 83px;
        box-sizing: border-box;
        text-align: left;
        padding: 20px 5px 0 10px;
        .task-top-title {
          .title-span {
            font-size: 14px;
            font-weight: 400;
            // color:rgba(237,242,255,1);
          }
        }
        .task-top-complete {
          margin-top: 3px;
          .complete-count {
            margin: 0 5px;
          }
          .complete-span {
            font-size: 12px;
            font-weight: 300;
            // color:rgba(169,183,214,1);
            margin-right: 5px;
          }
        }
      }
      .task-foot {
        overflow: hidden;
        .foot-left {
          float: left;
          // color: #8d94ae;
          width: 52%;
          i {
            font-size: 18px;
            margin: 0 3px 0 4px;
          }
        }
        .foot-right {
          width: 100%;
          height: 38px;
          box-sizing: border-box;
          display: flex;
          flex-direction: row;
          justify-content: space-between;
          cursor: pointer;
          position: relative;
          padding: 0 15px;
          img {
            width: 22px;
            height: 22px;
          }
          .three-img-div {
            width: 40%;
            margin-right: 25px;
          }
          .two-img-div {
            width: 49.9%;
          }
          .one-img-div {
            width: 10%;
          }
          .img-div {
            height: 38px;
            line-height: 38px;
            text-align: center;
            position: relative;
            display: flex;
            align-items: center;
            span {
              font-size: 12px;
            }
          }
          .icon-div {
            display: flex;
            align-items: center;
            .cursor-not {
              color: var(--font-color-secondary);
            }
          }
        }
        .foot-right-filter {
          -ms-filter: blur(10px);
          filter: blur(10px);
        }
      }
    }
  }
  .stage-name {
    width: 100%;
    height: 24px;
    text-align: left;
    font-size: 14px;
  }
  .list-header {
    width: 100%;
    height: 30px;
    margin: 10px 0 4px;
  }
  .list-div {
    width: calc(100% - 16px);
    overflow: hidden;
    padding: 0 1px;
  }
  .font12 {
    font-size: 12px;
  }
  .flow-div {
    box-sizing: border-box;
    text-align: center;
    padding-top: 20px;
    img {
      width: 38px;
      height: 38px;
    }
  }
  .common-message {
    float: left;
    width: 220px;
    height: 150px;
    margin: 5px;
    position: relative;
    .common-type-div {
      min-width: 64px;
      height: 22px;
      position: absolute;
      right: 0;
      top: 0;
      text-align: center;
      padding: 0 2px;
      font-size: 12px;
      border-radius: 2px;
      font-weight: 400;
      line-height: 20px;
    }
    .attack-bg {
      color: var(--red-color);
      background: var(--red-color-2);
      border: 1px solid var(--red-color);
    }
    .background-bg {
      color: var(--orange-color);
      background: var(--orange-color-2);
      border: 1px solid var(--orange-color);
    }
    .common-type-img {
      width: 70px;
      height: 68px;
      position: absolute;
      top: 0;
      right: 0;
    }
    .common-server {
      font-size: 12px !important;
    }
    .common-top {
      width: 97%;
      height: 24px;
      font-size: 14px;
      line-height: 24px;
      padding-left: 5px;
    }
  }

  .skill-left {
    float: left;
    width: 50%;
    margin-left: 5px;
  }
  .skill-right {
    float: left;
    width: 48%;
  }
  .time-checkbox {
    .el-checkbox {
      color: #e5eaff !important;
    }
    .el-checkbox__label {
      font-size: 15px !important;
    }
  }
  .error-content {
    display: flex;
    justify-content: center;
    .red-color-error {
      width: 130px;
      padding: 0 10px;
      text-align: left;
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
    }
  }
}
</style>
