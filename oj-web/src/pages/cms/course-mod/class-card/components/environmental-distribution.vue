<template>
  <div class="enviroment-content" id="enterDis">
    <div class="select_div">
      <div class="btn-seat">
        <div class="select">
          <cb-button class="mr" color-type="hollow" @click="allCreatScene()">{{
            $t('m.oneClickToCeateAScene')
          }}</cb-button>
          <cb-button
            class="mr"
            color-type="red hollow"
            @click="allDeleteScene()"
            >{{ $t('m.oneClickToClearAScene') }}</cb-button
          >
          <span>{{ $t('environmentAllocation.every') }}</span>
          <cb-input-number
            class="number-input-training"
            v-model="personalNum"
            controls-position="right"
            @change="handleChange"
            :min="1"
            :max="10"
            size="small"
          ></cb-input-number
          ><span>{{ $t('m.peopleOneScene') }}</span>
        </div>
        <div class="seat-box">
          <enviroment-tag
            :value="seatData"
            @deleteTag="deleteTag"
            titleField="name"
            @click="setSeat"
            isActive
            ><template v-slot:button>
              <cb-button @click="saveSeat()">{{ $t('m.saveSeats') }}</cb-button>
            </template></enviroment-tag
          >
        </div>
        <div class="divDelay">
          <span class="ml">{{ $t('m.sceneDelay') }}</span>
          <cb-switch
            v-model="delay"
            @change="delayChang"
            active-color="#52c41a"
          ></cb-switch>
        </div>
      </div>
      <div class="rightPosition">
        <span
          >{{ $t('m.environmentIsolationMode') }}：{{
            $t('m.classIsolation')
          }}</span
        >
      </div>
    </div>
    <cb-dialog
      :title="$t('m.setSeatName')"
      :visible.sync="dialogVisible"
      width="510px"
      @close="handleClose"
    >
      <div class="el-content">
        <cb-form
          :model="ruleForm"
          :rules="rules"
          ref="ruleForm"
          label-width="120px"
        >
          <cb-form-item :label="$t('m.seatName')" prop="name">
            <cb-input v-model="ruleForm.name"></cb-input>
          </cb-form-item>
        </cb-form>
      </div>
      <div class="btn-groups">
        <cb-button
          mr="mr"
          button-type="confirm"
          @click="saveGroupInfo('ruleForm')"
        ></cb-button>
        <cb-button
          mr="mr"
          button-type="cancel"
          @click="handleClose"
        ></cb-button>
      </div>
    </cb-dialog>
    <div class="distribution">
      <div class="distribution-content" v-loading="loading">
        <div class="groups clearfix" id="sceneContainer">
          <div
            class="group-env clearfix"
            v-for="item in envDatas"
            :key="item.resource_id"
          >
            <div class="group-env-box">
              <span
                class="box-delete"
                v-if="
                  creatingStatus(item) ||
                  runningStatus(item) ||
                  pauseStatus(item) ||
                  recoverStatus(item) ||
                  havePausedStatus(item) ||
                  (item.scene_data &&
                    item.scene_data.scene &&
                    (item.scene_data.scene.topology.scene.event === 1 ||
                      item.scene_data.scene.topology.scene.event === 2) &&
                    item.scene_data.scene.topology.scene.event_status === 5)
                "
                @click="deleteScene(item)"
                ><i class="iconfont iconshanchu"></i
              ></span>
              <div class="group-users-box">
                <cb-scrollbar height="80px">
                  <div
                    class="group-users"
                    :id="item.resource_id"
                    :class="classObject(item)"
                  >
                    <div
                      class="group-user-box"
                      v-for="data in item.user_infos"
                      :id="data.user_id"
                      :key="data.user_id"
                    >
                      <cb-tooltip
                        class="item"
                        popper-class="group-user-tip"
                        :content="getContent(data.name, data.user_name)"
                        placement="top-start"
                      >
                        <cb-tag>{{ data.name }}({{ data.user_name }})</cb-tag>
                      </cb-tooltip>
                    </div>
                  </div>
                </cb-scrollbar>
              </div>
              <div class="group-action">
                <!-- 没有scene_data并且ws未推送OJ-6错误消息才显示未创建 -->
                <span
                  class="status statusStart"
                  v-if="!item.scene_data && !item.ws_error_messgae"
                >
                  {{ $t('m.notCreated') }}
                </span>
                <span class="status statusRunning" v-if="runningStatus(item)">
                  {{ $t('device.running') }}
                </span>
                <span class="status" v-if="creatingStatus(item)">
                  <template v-if="pauseStatus(item)">
                    <!-- 暂停中 -->
                    {{ $t('scene.inPause') }}
                  </template>
                  <template v-else-if="recoverStatus(item)">
                    <!-- 恢复中 -->
                    {{ $t('scene.inRecovery') }}
                  </template>
                  <template v-else>
                    {{ $t('device.creating') }}
                  </template>
                </span>
                <span class="status statusStart" v-if="havePausedStatus(item)">
                  <!-- 已暂停 -->
                  {{ $t('scene.paused') }}
                </span>

                <!-- ws推送错误消息 -->
                <span class="status statusError" v-if="item.ws_error_messgae">
                  <cb-tooltip
                    class="item"
                    popper-class="status-error-tip"
                    effect="dark"
                    placement="bottom"
                  >
                    <div
                      class="status-error-tip-slot"
                      slot="content"
                      v-html="errorMassage(item)"
                    ></div>
                    <i class="iconfont iconxinxi"></i> </cb-tooltip
                  ><span style="marginleft: 5px">{{ $t('device.error') }}</span>
                </span>
                <!-- scene错误消息 -->
                <span
                  class="status statusError"
                  v-else-if="
                    item.scene_data &&
                    item.scene_data.scene &&
                    (item.scene_data.scene.topology.scene.event === 1 ||
                      item.scene_data.scene.topology.scene.event === 2) &&
                    item.scene_data.scene.topology.scene.event_status === 5
                  "
                >
                  <cb-tooltip
                    class="item"
                    popper-class="status-error-tip"
                    effect="dark"
                    placement="bottom"
                  >
                    <div
                      class="status-error-tip-slot"
                      slot="content"
                      v-html="errorMassage(item)"
                    ></div>
                    <i class="iconfont iconxinxi"></i> </cb-tooltip
                  ><span style="marginleft: 5px">{{ $t('device.error') }}</span>
                </span>
                <cb-button
                  class="fr"
                  color-type="hollow"
                  v-if="!item.scene_data"
                  @click="createScene(item)"
                  >{{ $t('m.createSceneEnv') }}</cb-button
                >
                <div v-if="haveRecoverStatus(item) || havePausedStatus(item)">
                  <cb-button-group>
                    <cb-button
                      hollow
                      color-type="red"
                      v-if="haveRecoverStatus(item) || havePausedStatus(item)"
                      @click="deleteScene(item)"
                      >{{ $t('m.clearScene') }}</cb-button
                    >
                    <cb-button
                      hollow
                      color-type="yellow"
                      v-if="haveRecoverStatus(item)"
                      @click="pauseRecoverScene(item, 'pause')"
                      >{{ $t('m.pauseScene') }}</cb-button
                    >
                    <cb-button
                      color-type="hollow"
                      v-if="havePausedStatus(item)"
                      @click="pauseRecoverScene(item, 'recovery')"
                      >{{ $t('m.recoverScene') }}</cb-button
                    >
                  </cb-button-group>
                </div>
                <cb-progress
                  v-if="creatingStatus(item)"
                  :percentage="getPercentage(item)"
                  style="width: 200px"
                ></cb-progress>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import dragula from 'dragula';
import msger from '@/utils/message.js';
import _ from 'lodash';
import Validate from '@/utils/validate.js';
import wsutil from '@/utils/websocket';
import utils from '@/utils/utils';
import EnviromentTag from './environment-tag.vue';
export default {
  components: {
    Validate,
    EnviromentTag,
  },
  data() {
    return {
      isWsErrorMessage: false,
      cookie: '',
      delay: false,
      isloading: true,
      loading: false,
      selectSeat: '',
      oldNum: 1,
      personalNum: 1,
      refresh: false,
      envDatas: [],
      runScense: [],
      nowSeats: [],
      seatData: [],
      seatName: '',
      dialogVisible: false,
      ruleForm: {
        name: '',
      },
      drake: null,
      rules: {
        name: [
          {
            required: true,
            message: this.$t('m.namePh'),
            trigger: 'blur',
          },
          { validator: Validate.name, trigger: 'blur' },
        ],
      },
    };
  },
  computed: {
    lessonId() {
      return _.get(this, '$route.params.lessonId');
    },
  },
  watch: {
    envDatas: {
      handler(newVal, oldVal) {
        const runData = [];
        _.forEach(newVal, (element) => {
          if (this.runningStatus(element) || this.creatingStatus(element)) {
            runData.push(element.resource_id);
          }
        });
        this.runScense = runData;
      },
      immediate: true,
    },
  },
  created() {
    this.getGroupInfo();
    this.getSeat();
    /* this.cookie = document.cookie.split('cr_jwttoken=')[1]; */
    this.cookie = utils.getCookie('cr_jwttoken');
    //ws创建场景
    this.connectionScene = wsutil.bind(
      `/ojj/ws/oj/classroom/scene?classroom_id=${this.lessonId}&token=${this.cookie}`,
      (data) => {
        if (data.code === 1) {
          this.sceneChange(data.data);
        } else if (data.code === 'OJ-2') {
          this.sceneChange(data);
        } else if (data.code === 'OJ-6') {
          this.isWsErrorMessage = true;
          this.getErrorMessage(data.data);
        }
      },
    );

    //TODO ws记得对接
    // this.connectionScene = wsutil.bind(
    //   `/ws/admin/course/group_info/`,
    //   (data) => {
    //     if (data.code === 1) {
    //       this.sceneChange(data.data);
    //     }
    //   },
    // );
    this.loadDragula();
    this.getDelay();
  },
  mounted() {},
  updated() {
    this.dragulaSet();
  },
  beforeDestroy() {
    if (this.connectionScene) {
      this.connectionScene.close();
    }
  },
  methods: {
    deleteTag(data) {
      this.deleteSeat(data.resource_id);
    },
    getDelay() {
      // 获取延时状态
      this.$request
        .get(
          `/oj/admin/class/group_info/get_destroy_delay_status`,
          {
            classroomId: this.lessonId,
          },
          {
            baseURL: '/api/ojj',
          },
        )
        .then((res) => {
          this.delay = res.data.data;
        });
    },
    delayChang() {
      const that = this;
      this.$request
        .patch(
          `/oj/admin/class/group_info/set_scene_destroy_delay`,
          {
            end: that.delay,
            classroom_id: this.lessonId,
            // destroy_delay: '168',
          },
          {
            baseURL: '/api/ojj',
          },
        )
        .then((data) => {});
    },
    loadDragula() {
      const that = this;
      this.drake = dragula([], that.option())
        .on('drag', function (el) {})
        .on('drop', function (el, target, source, sibling) {
          // 拖拽请求接口
          if (source.id !== target.id) {
            const nowSeatsResource = _.cloneDeep(that.nowSeats);
            that.$request
              .patch(
                `/oj/admin/class/group_info/move`,
                {
                  classroom_id: that.lessonId,
                  from_group_id: source.id,
                  to_group_id: target.id,
                  user_id: el.id,
                },
                {
                  baseURL: '/api/ojj',
                },
              )
              .then((res) => {
                const resourceObj = _.find(nowSeatsResource, {
                  resource_id: source.id,
                });
                const userArray = _.find(resourceObj.user_infos, {
                  user_id: el.id,
                });
                _.forEach(that.nowSeats, (element) => {
                  if (element.resource_id === source.id) {
                    _.remove(element.user_infos, function (n) {
                      return n.user_id === el.id;
                    });
                  }
                  if (element.resource_id === target.id) {
                    element.user_infos.push(userArray);
                  }
                });
              });
          }
        });
    },
    dragulaSet() {
      const container = [];
      _.forEach(this.envDatas, (element) => {
        container.push(document.getElementById(element.resource_id));
      });
      this.drake.containers = _.cloneDeep(container);
    },
    runningStatus(item) {
      if (
        item.scene_data &&
        item.scene_data.scene &&
        item.scene_data.scene.topology.scene.event === 2 &&
        item.scene_data.scene.topology.scene.event_status === 4
      ) {
        return true;
      } else if (
        item.scene_data &&
        item.scene_data.scene &&
        item.scene_data.scene.topology.scene.event === 7 &&
        item.scene_data.scene.topology.scene.event_status === 4
      ) {
        return true;
      }
      return false;
    },
    creatingStatus(item) {
      const status =
        item.scene_data &&
        item.scene_data.scene &&
        item.scene_data.scene.topology.scene.event_status !== 4 &&
        item.scene_data.scene.topology.scene.event_status !== 5;
      return status;
    },
    pauseStatus(item) {
      // 暂停中
      const status =
        item.scene_data &&
        item.scene_data.scene &&
        item.scene_data.scene.topology.scene.event === 6 &&
        item.scene_data.scene.topology.scene.event_status !== 4;
      return status;
    },
    havePausedStatus(item) {
      // 已暂停
      const status =
        item.scene_data &&
        item.scene_data.scene &&
        item.scene_data.scene.topology.scene.event === 6 &&
        item.scene_data.scene.topology.scene.event_status === 4;
      return status;
    },
    recoverStatus(item) {
      // 恢复中
      const status =
        item.scene_data &&
        item.scene_data.scene &&
        item.scene_data.scene.topology.scene.event === 7 &&
        item.scene_data.scene.topology.scene.event_status !== 4;
      return status;
    },
    haveRecoverStatus(item) {
      // 已恢复
      const status =
        (item.scene_data &&
          item.scene_data.scene &&
          item.scene_data.scene.topology.scene.event === 7 &&
          item.scene_data.scene.topology.scene.event_status === 4) ||
        (item.scene_data &&
          item.scene_data.scene &&
          item.scene_data.scene.topology.scene.event === 2 &&
          item.scene_data.scene.topology.scene.event_status === 4);
      return status;
    },
    // 获取进度条
    getPercentage(item) {
      let per =
        item.scene_data &&
        item.scene_data.scene &&
        item.scene_data.scene.topology &&
        item.scene_data.scene.topology.scene &&
        item.scene_data.scene.topology.scene.progress_percentage;
      return per;
    },
    classObject(item) {
      let className = 'dragulaContainer';
      if (this.runningStatus(item) || this.creatingStatus(item)) {
        className = 'dragulaContainer no-dragula';
      }
      return className;
    },
    option() {
      const options = {
        isContainer: function (el) {
          return false; // 点击和拖动都会触发，drake.containers元素将被考虑
        },
        moves: function (el, source, handle, sibling) {
          if (source.classList.contains('no-dragula')) {
            return false;
          }
          return true; // 一直能拖动，拖动时触发
        },
        accepts: function (el, target, source, sibling) {
          if (target.classList.contains('no-dragula')) {
            return false;
          }
          return true; // 元素可以放在任何`container`中
        },
        invalid: function (el, handle) {
          return false; // 默认情况下不会阻止任何拖动
        },
        direction: 'vertical', // 元素的排放方向
        copy: false, // 拖动的元素是否为副本
        copySortSource: false, // 复制的源容器重新排序
        revertOnSpill: false, // 是否将拖到容器外的元素放回原处
        removeOnSpill: false, // 是否将拖到容器外的元素删除
        mirrorContainer: document.body, // 设置获取附加镜像元素的元素
        ignoreInputTextSelection: false, // 允许用户选择输入文本
      };
      return options;
    },
    handleChange(val) {
      // 每/人一场景切换
      this.updateGroupInfo();
    },
    getSeat() {
      // 获取保存的座次
      this.$request
        .get(
          `/oj/admin/class/group_info/archive`,
          {
            classroom_id: this.lessonId,
          },
          {
            baseURL: '/api/ojj',
          },
        )
        .then((res) => {
          const datas = _.get(res, 'data.data');
          this.seatData = datas;
        });
    },
    deleteSeat(id) {
      // 删除保存的座次
      this.$request
        .delete(
          `/oj/admin/class/group_info/delete`,
          {
            classroom_id: this.lessonId,
            group_archive_id: id,
          },
          {
            baseURL: '/api/ojj',
          },
        )
        .then((res) => {
          this.getSeat();
        });
    },
    setSeat(data) {
      // 点击已保存的座次
      // 保存数据设置座次
      this.selectSeat = data.resource_id;
      this.loading = true;
      this.$request
        .post(
          `/oj/admin/class/group_info/use`,
          {
            classroom_id: this.lessonId,
            group_archive_id: data.resource_id,
          },
          {
            baseURL: '/api/ojj',
          },
        )
        .then((res) => {
          const datas = _.get(res, 'data.data');
          this.envDatas = datas;
          // this.refresh = true
          this.nowSeats = _.cloneDeep(datas);
        })
        .finally(() => {
          this.loading = false;
        });
    },
    saveSeat() {
      // 保存座次按钮点击弹框显示
      this.seatName = '';
      this.dialogVisible = true;
    },
    handleClose() {
      this.dialogVisible = false;
      this.ruleForm.name = '';
    },
    saveGroupInfo(formName) {
      const that = this;
      this.$refs[formName].validate((valid) => {
        if (valid) {
          that.$request
            .post(
              `/oj/admin/class/group_info/save`,
              {
                classroom_id: that.lessonId,
                data: that.nowSeats,
                name: that.ruleForm.name,
              },
              { baseURL: '/api/ojj' },
            )
            .then((res) => {
              that.getSeat();
            });
          that.handleClose();
        } else {
          return false;
        }
      });
    },

    getGroupInfo() {
      const that = this;
      that.isloading ? (that.loading = true) : '';
      this.$request
        .get(
          '/oj/admin/class/group_info/get',
          {
            classroom_id: this.lessonId,
          },
          {
            baseURL: '/api/ojj',
          },
        )
        .then((res) => {
          const datas = _.get(res, 'data.data');
          this.envDatas = datas;
          this.nowSeats = _.cloneDeep(datas);
          let now = 1;
          let max = 1;
          _.forEach(datas, (item) => {
            const userInfo = _.get(item, 'user_infos', '') || [];
            userInfo.length > 0 ? (now = userInfo.length) : '';
            max < now ? (max = now) : '';
          });
          this.personalNum = max;
          that.isloading = false;
        })
        .finally(() => {
          that.loading = false;
        });
    },
    updateGroupInfo() {
      // 编辑课堂座次
      const that = this;
      if (this.runScense.length > 0) {
        this.$nextTick(() => {
          that.personalNum = that.oldNum;
        });
        this.$confirm(this.$t('m.environmentalTipMassage'), '', {
          type: 'warning',
        })
          .then(() => {})
          .catch(() => {});
        return null;
      }
      this.oldNum = this.personalNum;
      that.loading = true;
      that.$request
        .post(
          `/oj/admin/class/group_info/update`,
          {
            classroom_id: this.lessonId,
            group_count: this.personalNum,
          },
          { baseURL: '/api/ojj' },
        )
        .then((res) => {
          const datas = _.get(res, 'data.data');
          that.envDatas = datas;
          that.nowSeats = _.cloneDeep(datas);
        })
        .finally(() => {
          that.loading = false;
        });
    },
    createScene(item) {
      // 课程表创建场景
      this.$request
        .post(
          '/oj/admin/classroom/scene',
          { group_id: item.resource_id },
          { baseURL: '/api/ojj' },
        )
        .then((res) => {
          this.getGroupInfo();
        })
        .catch((ex) => {
          msger.serverError(ex, this);
        });
    },
    // 暂停 恢复场景
    pauseRecoverScene(item, status) {
      const hint =
        status === 'pause'
          ? this.$t('scene.confirmPauseScene')
          : this.$t('scene.confirmRecoverScene');
      this.$confirm(hint + '？', this.$t('common.info'), {
        type: 'warning',
      }).then(() => {
        this.$request
          .patch(
            '/oj/admin/classroom/scene/pause',
            { group_id: item.resource_id },
            { baseURL: '/api/ojj' },
          )
          .then((res) => {
            this.getGroupInfo();
          });
      });
    },
    deleteScene(item) {
      this.$confirm(
        this.$t('scene.confirmClearScene') + '？',
        this.$t('common.info'),
        {
          type: 'warning',
        },
      ).then(() => {
        //课程表删除场景
        this.$request
          .delete(
            '/oj/admin/classroom/scene',
            { group_id: item.resource_id },
            { baseURL: '/api/ojj' },
          )
          .then((res) => {
            this.getGroupInfo();
          })
          .catch((ex) => {
            msger.serverError(ex, this);
          });
      });
    },
    deleteSceneSync(id) {
      //课程表删除场景
      this.$request
        .delete(
          '/oj/admin/classroom/scene',
          { group_id: id },
          { baseURL: '/api/ojj' },
        )
        .then((res) => {
          this.getGroupInfo();
        })
        .catch((ex) => {
          msger.serverError(ex, this);
        });
    },
    allCreatScene() {
      const that = this;
      that.loading = true;
      // 课程表一键创建场景
      this.$request
        .post(
          '/oj/admin/classroom/scene/batch',
          { classroom_id: this.lessonId },
          { baseURL: '/api/ojj' },
        )
        .then((res) => {})
        .catch((ex) => {
          msger.serverError(ex, this);
          this.getGroupInfo();
          this.getSeat();
        })
        .finally(() => {
          this.loading = false;
        });
    },
    allDeleteScene() {
      this.$confirm(
        this.$t('scene.confirmClearScene') + '？',
        this.$t('common.info'),
        {
          type: 'warning',
        },
      )
        .then(() => {
          this.loading = true;
          // 课程表一键删除场景
          this.$request
            .delete(
              '/oj/admin/classroom/scene/batch',
              { classroom_id: this.lessonId },
              { baseURL: '/api/ojj' },
            )
            .then((res) => {})
            .catch((ex) => {
              msger.serverError(ex, this);
              this.getGroupInfo();
              this.getSeat();
            })
            .finally(() => {
              this.loading = false;
            });
        })
        .catch(() => {});
    },
    sceneChange(data) {
      if (data.data.scene && data.data.scene.event !== 9) {
        _.forEach(this.envDatas, (item) => {
          if (item.resource_id && item.resource_id === data.group_id) {
            // 如果item.scene_data不为null，直接将ws推送的的data.data.scene赋值
            if (item.scene_data) {
              item.scene_data.scene.topology.scene = data.data.scene;
            } else {
              // 如果item.scene_data为null，需要构造出该结构进行赋值
              item.scene_data = {
                scene: {
                  topology: {
                    scene: data.data.scene,
                  },
                },
              };
            }
          }
        });
        // this.refresh = true
        this.nowSeats = _.cloneDeep(this.envDatas);
      } else if (data.code === 'OJ-2') {
        _.forEach(this.envDatas, (item) => {
          if (item.resource_id && item.resource_id === data.data.group_id) {
            if (item.scene_data) {
              item.scene_data = null;
            }
            if (item.ws_error_messgae) {
              item.ws_error_messgae = null;
            }
          }
        });
      }
      this.refresh = true;
      this.nowSeats = _.cloneDeep(this.envDatas);
    },
    getErrorMessage(data) {
      _.forEach(this.envDatas, (item) => {
        if (item.resource_id && item.resource_id === data.group_id) {
          this.$set(item, 'ws_error_messgae', data.message);
        }
      });
    },
    errorMassage(item) {
      let error = '';
      if (this.isWsErrorMessage) {
        error = item.ws_error_messgae;
      } else if (
        item.scene_data &&
        item.scene_data.scene &&
        item.scene_data.scene.topology.scene.process_message
      ) {
        error = item.scene_data.scene.topology.scene.process_message;
      }
      var strs = '';
      for (var i = 0; i < error.length; i = i + 250) {
        strs += error.substring(i, i + 250) + '<br>';
      }
      return strs;
    },
    getContent(name, user_name) {
      return `${name}(${user_name})`;
    },
  },
};
</script>
<style lang="scss">
#enterDis {
  .statusError {
    color: var(--red-color);
  }
}
.el-tooltip__popper.is-dark.group-user-tip {
  background-color: var(--bg-color-4) !important;
  color: var(--neutral8) !important;
}
.enviroment-content .box-delete i {
  color: var(--primary-color);
}
.distribution {
  .distribution-content {
    .groups {
      .group-users-box {
        background: var(--bg-color-3);
      }
    }
  }
}

#enterDis {
  .rightPosition {
    display: flex;
    align-items: center;
    height: 40px;
  }
  .ml {
    margin: 0 10px;
  }
  .el-input-number.is-controls-right .el-input-number__decrease {
    bottom: 2px;
  }
  .el-input .el-input__inner {
    height: 36px;
  }
  .group-user-box {
    display: inline-block;
    margin-right: 20px;
    margin-bottom: 20px;
  }
  .divDelay {
    display: flex;
    align-items: center;
    height: 40px;
    width: 150px;
    flex-shrink: 0;
  }
}
</style>
<style src="dragula/dist/dragula.css"></style>
<style lang="scss">
.select {
  min-width: 420px;
  display: flex;
  align-items: center;
  flex-grow: 0;
  flex-shrink: 0;
  height: 40px;
}
.group-env-box {
  .group-users-box {
    .el-scrollbar {
      height: calc(100% + 36px);
    }
    .el-scrollbar__wrap {
      overflow-x: scroll;
    }
  }
}
.enviroment-content {
  .el-progress {
    display: inline-block;
    margin-left: 10px;
    width: calc(100% - 52px);
    .el-progress-bar__outer {
      height: 10px !important;
    }
    .el-progress-bar__inner {
      height: 10px;
      border-radius: 5px;
    }
  }
  .el-input-number {
    margin: 0 10px;
    width: 85px;
  }
  .select_div {
    display: flex;
    justify-content: space-between;
    .btn-seat {
      width: calc(100% - 400px);
      display: flex;
    }
    .btn-groups {
      display: block;
    }
    .seat-box {
      position: relative;
      margin: 0 10px;
    }
  }
}
</style>
<style scoped lang="scss">
.enviroment-content {
  .seat-box {
    .box-delete {
      display: none;
    }
    &:hover {
      .box-delete {
        display: block;
        cursor: pointer;
      }
    }
  }
  .box-delete {
    cursor: pointer;
    z-index: 1;
    text-align: center;
    width: 16px;
    height: 16px;
    font-size: 12px;
    border-radius: 50%;
    position: absolute;
    right: 12px;
    top: 2px;
    i {
      font-size: 12px;
    }
  }
  .select_div {
    font-size: 14px;
    font-family: Microsoft YaHei;
    font-weight: 400;
    .saveSeats {
      margin-left: 20px;
      margin-bottom: 10px;
    }
    .btn-groups {
      display: inline-block;
      .seat-box {
        position: relative;
      }
    }
  }
  .distribution {
    margin-top: 30px;
    .distribution-content {
      min-height: 150px;
      .btn-groups {
        margin-bottom: 20px;
      }
      .groups {
        .group-env {
          width: calc((100% - 60px) / 4);
          box-sizing: border-box;
          margin-right: 20px;
          margin-bottom: 20px;
          display: block;
          float: left;
        }
        .group-env:nth-child(4n) {
          margin-right: 0;
        }
        .group-env-box {
          position: relative;
          .box-delete {
            top: -2px;
            right: -2px;
          }
        }
        .group-users-box {
          height: 130px;
          padding: 15px;
          overflow: hidden;
        }
        .group-users {
          position: relative;
          min-height: 100px;
        }
        .group-action {
          margin-top: 10px;
          font-size: 14px;
          font-family: Microsoft YaHei;
          font-weight: 400;
          display: flex;
          justify-content: space-between;
          height: 30px;
          align-items: center;
          .statusRunning {
            color: var(--green-color);
          }
          .statusDelete {
            color: var(--red-color);
          }
        }
      }
    }
  }
  .el-content {
    margin-bottom: 20px;
    label {
      display: inline-block;
      width: 80px;
      margin-right: 10px;
      text-align: right;
    }
  }
  .el-dialog__body {
    .el-input {
      width: 310px;
    }
    .btn-groups {
      display: block;
      clear: both;
      text-align: center;
    }
  }
}
</style>
