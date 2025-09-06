<template>
  <div class="task-list">
    <div class="task-wrap">
      <div class="task-info">
        <cb-checkbox
          :indeterminate="indeterminate"
          v-if="showCheckbox"
          v-model="allChecked"
          class="checkbox"
          @change="handleCheckAllChange"
        ></cb-checkbox>
        <div class="task-name" :title="taskStage.stage">
          {{ taskStage.stage }}
        </div>
        <!-- 批量下发 新增任务 删除任务 按钮 -->
        <div class="btn-wrap" v-if="!showCheckbox">
          <span
            :class="[
              taskStage.is_all_release ? 'all-release' : 'not-all-release',
            ]"
            @click="!taskStage.is_all_release && batchDistribute()"
            >{{ $t('rbt.batchDelivery') }}</span
          >
          <span @click="addMission(taskStage, currentRole)">{{
            $t('rbt.createTask')
          }}</span>
          <span
            :class="[
              taskStage.is_all_release ? 'all-release' : 'not-all-release',
            ]"
            @click="!taskStage.is_all_release && batchDelete()"
            >{{ $t('rbt.deleteTask') }}</span
          >
        </div>
        <!-- 确定下发 取消 按钮 -->
        <div class="btn-wrap" v-if="showCheckbox && temp === 'distribution'">
          <span @click="confirmDistribute">{{ $t('rbt.confirmIssued') }}</span>
          <span @click="cancel">{{ $t('rbt.cancel') }}</span>
        </div>
        <!-- 确定删除 取消 按钮 -->
        <div class="btn-wrap" v-if="showCheckbox && temp === 'delete'">
          <span @click="confirmDelete">{{ $t('rbt.confirmDelete') }}</span>
          <span @click="cancel">{{ $t('rbt.cancel') }}</span>
        </div>
        <!-- 下拉箭头 -->
        <div class="triangle-wrap" @click.stop="fold = !fold">
          <cb-iconfont
            ref="xialaRef"
            type="icon-xiala"
            size="16"
            class="triangle-color"
            :class="{
              arrowTransform: !fold,
              arrowTransformReturn: fold,
            }"
          ></cb-iconfont>
        </div>
      </div>
      <!-- 折叠区域 -->
      <collapse-transition>
        <div class="collapase-wrap" v-show="fold">
          <div
            class="task-item"
            :key="task.resource_id"
            v-for="(task, index) in taskStage.mission_infos"
            @click="viewDetail(task)"
          >
            <!-- 任务名称行 -->
            <div class="task-source">
              <div @click.stop>
                <cb-checkbox
                  v-if="showCheckbox"
                  class="checkbox"
                  v-model="task.checked"
                  :disabled="task.is_release"
                  @change="
                    checkboxChange(
                      task.checked,
                      task.resource_id,
                      taskStage.mission_infos,
                    )
                  "
                ></cb-checkbox>
              </div>
              <span
                class="task-type"
                :class="[
                  task.is_release
                    ? 'task-type-release'
                    : 'task-type-not-release',
                ]"
              >
                [<span
                  class="title-span"
                  :title="getType(task.type)"
                  v-text="getType(task.type)"
                ></span
                >]
                <span :title="task.title">{{ task.title }}</span>
              </span>
              <span class="tag" v-if="task.is_dynamic">{{
                $t('rbt.dynamicAdd')
              }}</span>
            </div>
            <!-- 已下发提示 -->
            <div
              class="status-release"
              v-if="task.is_release"
              :class="[
                task.is_release && task.not_finish_user_list.length === 0
                  ? 'release-all-finish'
                  : 'release-not-all-finish',
              ]"
              :style="{
                marginLeft: showCheckbox ? '30px' : '0',
              }"
            >
              <!-- 未完成和完成的加起来是下发的人数 -->
              {{
                $t('rbt.hasIssued') +
                (task.not_finish_user_list.length +
                  task.finish_user_list.length) +
                $t('rbt.people') +
                ',' +
                $t('rbt.hasBeenFinished') +
                task.finish_user_list.length +
                $t('rbt.people')
              }}
              <!-- 完成任务人员信息 -->
              <transition name="el-fade-in">
                <div class="finish-tip">
                  <div class="tip">
                    {{
                      $t('rbt.hasIssued') +
                      (task.not_finish_user_list.length +
                        task.finish_user_list.length) +
                      $t('rbt.people') +
                      ',' +
                      $t('rbt.hasBeenFinished') +
                      task.finish_user_list.length +
                      $t('rbt.people')
                    }}
                  </div>
                  <div class="user-wrap cyber-scroll-bar-small">
                    <div
                      class="user-info"
                      :key="user.resource_id"
                      v-for="user in task.all_user_list"
                    >
                      <div class="logo-wrap">
                        <img :src="user.logo" />
                      </div>
                      <div class="user-name" :title="user.rep_name">
                        {{ user.rep_name }}
                      </div>
                      <div class="status" v-if="user.finish">
                        <cb-iconfont
                          :size="16"
                          type="icon-xuanze1"
                        ></cb-iconfont>
                      </div>
                    </div>
                  </div>
                </div>
              </transition>
            </div>
            <!-- 待下发 -->
            <div
              v-else
              class="status"
              :class="[
                showCheckbox
                  ? 'status-show-checkbox'
                  : 'status-not-show-checkbox',
              ]"
              :style="{
                marginLeft: showCheckbox ? '30px' : '0',
              }"
            >
              {{ $t('rbt.notIssued') }}
            </div>
            <!-- 按钮操作 -->
            <div class="btn-wrap" v-if="!showCheckbox">
              <!-- 题解 开启关闭-->
              <span
                class="btn-item"
                :title="
                  task.show_writeup
                    ? $t('rbt.closeSolution')
                    : $t('rbt.openSolution')
                "
                @click.stop="
                  changeWriteUp(
                    task.show_writeup,
                    task.resource_id,
                    task.room_id,
                  )
                "
              >
                <cb-iconfont
                  :size="16"
                  :type="
                    task.show_writeup ? 'icon-tijiexianshi' : 'icon-tijieguanbi'
                  "
                  class="write-up-icon"
                ></cb-iconfont>
              </span>
              <!-- 下发 -->
              <span
                class="btn-item"
                :title="$t('rbt.delivery')"
                :style="{
                  cursor: task.is_release ? 'not-allowed' : 'pointer',
                }"
                @click.stop="
                  !task.is_release ? distribute(task.resource_id) : ''
                "
              >
                <cb-iconfont
                  :size="16"
                  type="icon-xiafa"
                  :class="task.is_release ? 'has-style' : 'no-style'"
                ></cb-iconfont>
              </span>
              <!-- 编辑- -->
              <span
                class="btn-item"
                :style="{
                  cursor: task.is_release ? 'not-allowed' : 'pointer',
                }"
                @click.stop="!task.is_release ? editorDialog(task) : ''"
              >
                <cb-iconfont
                  :size="16"
                  type="icon-bianji"
                  :class="task.is_release ? 'has-style' : 'no-style'"
                ></cb-iconfont>
              </span>
            </div>
          </div>
        </div>
      </collapse-transition>
    </div>
    <!-- 任务详情弹窗 -->
    <cb-dialog
      :visible.sync="dialogTaskDetail"
      :title="$t('m.taskDetails')"
      width="640px"
      height="600px"
    >
      <div class="task-detail">
        <div class="item">
          <div class="key">{{ $t('rbt.taskName') }}：</div>
          <div class="value" :title="taskDetail.title">
            {{ taskDetail.title }}
          </div>
        </div>
        <div class="item">
          <div class="key">{{ $t('rbt.taskDes') }}：</div>
          <div class="value-desc" :title="taskDetail.description">
            {{ taskDetail.description }}
          </div>
        </div>
        <div class="item">
          <div class="key">{{ $t('rbt.type') }}：</div>
          <div class="value">{{ getType(taskDetail.type) }}</div>
        </div>
        <div class="item">
          <div class="key">{{ $t('rbt.score') }}：</div>
          <div class="value">{{ taskDetail.score }}</div>
        </div>
        <div class="item">
          <div class="key">{{ $t('rbt.skillPoints') }}：</div>
          <div class="value">
            <div style="width: 420px; height: 245px">
              <cb-echart-radar
                ref="skillchart"
                radarShape="sharp"
                :indicator="pieLabelArr"
                :radarData="radarData"
                :axisName="axisNameDetail"
              ></cb-echart-radar>
            </div>
          </div>
        </div>
        <div class="item">
          <div class="key">{{ $t('rbt.deliverUser') }}：</div>
          <div class="value">{{ currentRole.role_name }}</div>
        </div>
        <div class="item">
          <div class="key">{{ $t('rbt.deliverRole') }}：</div>
          <div class="values">
            <div
              class="user"
              :key="item.resource_id"
              v-for="item in taskDetail.all_user_list"
            >
              <div class="logo-wrap">
                <img :src="item.logo" />
              </div>
              <div class="name" :title="item.rep_name">{{ item.rep_name }}</div>
            </div>
          </div>
        </div>
      </div>
    </cb-dialog>
    <!--添加任务弹窗-->
    <cb-dialog
      :visible.sync="dialogAddMission"
      :title="$t('m.addMission')"
      width="1100px"
      :close-on-press-escape="false"
    >
      <div class="cyber-scroll-bar" style="height: 500px; overflow: auto">
        <mission-detail
          v-if="dialogAddMission"
          ref="createMission"
          :role-select="roleSelect"
          :role-option-list="roleOptionList"
          :submit-url="missionSubmitUrl"
          :pieLabelData="pieLabelArr"
          :positionOption="positionOption"
          @missionResponse="getMissionResponse"
          @closeDialog="addMissionDialog"
          :mission-stage="missionStage"
        >
        </mission-detail>
      </div>
      <span slot="footer" class="dialog-footer">
        <cb-button
          button-type="confirm"
          mr
          @click="missionSubmit()"
        ></cb-button>
        <cb-button button-type="cancel" @click="addMissionDialog"></cb-button>
      </span>
    </cb-dialog>
    <!--任务编排编辑弹窗-->
    <cb-dialog
      :visible.sync="dialogUpdate"
      :title="$t('missions.updateMission')"
      width="1000px"
      height="500px"
      @stateEventDialog="showDialog"
      @close="cancelEditTask"
    >
      <template>
        <div class="dialog-form">
          <!-- 任务名称 -->
          <cb-form
            ref="editFormRef"
            :label-width="language === 'en' ? '100px' : '110px'"
            :model.sync="task"
            :rules="rules"
          >
            <cb-form-item :label="$t('m.missionTitle') + '：'" prop="title">
              <cb-input v-model="task.title" class="elc-input" />
            </cb-form-item>
            <!-- 分数 -->
            <cb-form-item :label="$t('m.fraction') + '：'" prop="score">
              <cb-input-number
                v-model="task.score"
                :min="0"
                :precision="0"
                :max="500"
                :label="$t('m.fraction')"
                class="elc-input-number"
              />
              <span class="num-title"
                >( {{ $t('m.pleaseEnterIntegerBetween0And500') }} )</span
              >
            </cb-form-item>
            <!-- 技能点 -->
            <cb-form-item :label="$t('m.settingSkillPoints') + '：'">
              <div class="update-dialog">
                <div class="skill-left">
                  <div
                    v-for="(item, index) in levelRate"
                    :key="index"
                    style="clear: left"
                  >
                    <div class="rate-a one-overflow" :title="item.type">
                      {{ item.type }}
                    </div>
                    <div style="float: left; margin-top: 9px">
                      <cb-rate v-model="item.rate" class="elc-rate" :max="5" />
                    </div>
                  </div>
                </div>
                <div class="skill-right">
                  <cb-echart-radar
                    v-if="pieLabelArr.length > 0"
                    ref="skillBlueChart"
                    radarShape="sharp"
                    :indicator="pieLabelArr"
                    :radarData="radarData"
                    :axisName="axisNameEdit"
                  ></cb-echart-radar>
                </div>
              </div>
            </cb-form-item>
            <!-- 任务描述 -->
            <cb-form-item :label="$t('missions.taskDes') + '：'">
              <cb-input
                v-model="task.description"
                class="elc-input"
                type="textarea"
              />
            </cb-form-item>
            <!-- 类别 -->
            <cb-form-item :label="$t('m.category') + '：'">
              <cb-input class="elc-input" v-text="getCategory(task.category)" />
            </cb-form-item>
            <!-- 任务类型 -->
            <cb-form-item :label="$t('m.missionCategory') + '：'">
              <cb-input v-text="getType(task.type)" />
            </cb-form-item>
            <!-- 答案 -->
            <cb-form-item :label="$t('missions.answer') + '：'">
              <cb-input v-text="getAnswer(task.type, task.answer)" />
            </cb-form-item>
            <!-- 题解 -->
            <cb-form-item :label="$t('m.answerKey') + '：'">
              <CbMarkdown
                v-if="task.write_up"
                v-model="task.write_up"
                type="viewer"
              />
              <span v-else>-</span>
            </cb-form-item>
          </cb-form>
        </div>
      </template>
      <span slot="footer" class="dialog-footer">
        <cb-button button-type="confirm" mr @click="updateTask"></cb-button>
        <cb-button button-type="cancel" @click="cancelEditTask"></cb-button>
      </span>
    </cb-dialog>
  </div>
</template>

<script>
import { fetchCategoryList, uploadMissionMd } from '@/api/web/task_editor';
import { getLanguage } from '@cyber/helper';
import { validateTitleLength255 } from '@/utils/rules';
import { getRadarLabels } from '@/api/common.js';
import { cutStr } from '@/utils/index.js';
import validateUtils from '@/utils/validate';
import collapseTransition from '@/components/collapase/index';
import MissionDetail from '@/pages/web/red-blue/common/components/mission-detail';
import defaultLogo from '@/assets/img/addhost.png';
import {
  isWriteUp,
  deleteMission,
  deliveryStatus,
  getTaskDetail,
  updateMission,
} from '@/api/web/red-blue.js';
export default {
  components: {
    collapseTransition,
    MissionDetail,
  },
  props: {
    // 任务阶段
    taskStage: {
      type: [Array, Object],
      default: [],
    },
    crEventData: {
      type: Object,
      default: () => {},
    },
    currentRole: {
      type: [Object, Array],
      default: () => {},
    },
    // 阶段索引
    missionStage: {
      type: [Number, String],
      default: 0,
    },
  },
  data() {
    const positivenumber = (rule, value, callback) => {
      if (value < 0) {
        callback(new Error(this.$t('m.PositiveNumber')));
      } else {
        callback();
      }
    };
    return {
      resource_id: this.$route.params && this.$route.params.resource_id,
      language: getLanguage(),
      defaultLogo,
      fold: true, //控制任务列表折叠
      tip: '', //控制悬浮提示索引
      selection: [], //复选框选中项
      showCheckbox: false, //控制复选框的显示隐藏
      indeterminate: false, //未全选状态样式
      allChecked: false, //全选状态
      temp: '', //控制是批量下发还是删除
      dialogTaskDetail: false,
      taskDetail: {
        title: '',
        description: '',
        type: '',
        score: '',
        skill_points: '',
        role_name: '',
        all_user_list: [],
      },
      // 添加任务
      dialogAddMission: false,
      roleSelect: true,
      roleOptionList: [],
      missionSubmitUrl: '',
      // 饼图数据
      pieLabelArr: [],
      // 编辑弹窗
      dialogUpdate: false,
      task: {
        title: '',
        score: '',
        skill_points: '',
        type: '',
        description: '',
        category: '',
        answer: '',
        write_up: '',
      },
      groupMessage: {},
      rules: {
        title: [
          {
            required: true,
            message: this.$t('m.inputMissionName'),
            trigger: 'blur',
          },
          { validator: validateTitleLength255, trigger: 'blur' },
        ],
        score: [
          { required: true, message: this.$t('m.inputScore'), trigger: 'blur' },
          { validator: positivenumber, trigger: 'blur' },
        ],
      },
      levelRate: [],
      levels: [],
      positionOption: [],
      missionRes: '',
      categoryOption: [],
    };
  },
  watch: {
    levels: {
      handler(val, oldval) {
        if (val) {
          if (this.$refs.skillchart) {
            this.$refs.skillchart.options.series[0].data[0].value = val;
            this.$refs.skillchart.initRedChart();
          }
        }
      },
      deep: true,
    },
    crEventData: {
      handler(val, oldval) {
        if (JSON.stringify(val) !== JSON.stringify(oldval)) {
          if (!_.isEmpty(val.data)) {
            //导演添加任务
            this.missionSubmitUrl = `/cr/director/red_vs_blue/red_vs_blue/mission_info_create`;
          }
        }
      },
      deep: true,
      immediate: true,
    },
  },
  computed: {
    radarData() {
      let arrs = [];
      arrs = _.map(this.levelRate, (item) => {
        return item.rate;
      });
      return arrs;
    },
    axisNameEdit() {
      return {
        formatter: (text) => {
          var strlength = validateUtils.validateLength(text);
          var maxlength = 10;
          if (strlength > maxlength) {
            text = cutStr(text, maxlength) + '...';
          }
          return text;
        },
      };
    },
    axisNameDetail() {
      return {
        formatter: (text) => {
          var strlength = validateUtils.validateLength(text);
          var maxlength = 8;
          if (strlength > maxlength) {
            text = cutStr(text, maxlength) + '...';
          }
          return text;
        },
      };
    },
  },
  created() {
    fetchCategoryList().then((res) => {
      this.categoryOption = res.data.data;
    });
  },
  mounted() {
    this.getPieLabel();
  },
  methods: {
    // 鼠标悬浮提示任务完成情况
    handlerEnter(index) {
      this.tip = index;
    },
    // 复选框选中状态
    checkboxChange(event, id, mission_infos) {
      const disData = [];
      // 统计未下发的任务长度
      mission_infos.forEach((item) => {
        if (!item.is_release) {
          disData.push(item);
        }
      });
      // event为true进行push,为false进行删除
      if (event) {
        this.selection.push(id);
      } else {
        this.selection = this.selection.filter((item) => {
          return item !== id;
        });
      }
      // 未全选
      if (this.selection.length > 0 && this.selection.length < disData.length) {
        this.indeterminate = true;
        this.allChecked = false;
      } else if (this.selection.length === disData.length) {
        // 全选
        this.indeterminate = false;
        this.allChecked = true;
      } else {
        // 未选
        this.indeterminate = false;
        this.allChecked = false;
      }
    },
    // 全选状态
    handleCheckAllChange(val) {
      this.selection = [];
      // 全选
      if (val) {
        this.indeterminate = false;
        this.allChecked = true;
        this.fold = true;
        this.taskStage.mission_infos.forEach((item) => {
          if (!item.is_release) {
            item.checked = true;
            this.selection.push(item.resource_id);
          }
        });
      } else {
        // 取消全选
        this.allChecked = false;
        this.taskStage.mission_infos.forEach((item) => {
          item.checked = false;
        });
        this.selection = [];
      }
    },
    // 批量下发点击
    batchDistribute() {
      this.temp = 'distribution';
      this.showCheckbox = true;
      this.allChecked = false;
      this.fold = true;
    },
    // 确定下发点击
    confirmDistribute() {
      this.fold = true;
      // 批量下发
      if (this.selection.length > 0) {
        this.$confirm(this.$t('rbt.ensureIssued') + '？').then((res) => {
          deliveryStatus({
            role_resource_id: this.currentRole.role_id,
            mission_resource_ids: this.selection,
          })
            .then((res) => {
              this.messageDialog('success', this.$t('m.successfullyIssued'));
              this.$emit('update');
              this.showCheckbox = false;
              this.indeterminate = false;
              this.selection = [];
            })
            .catch((res) => {
              this.$message.error(res.data.message);
            });
        });
      } else {
        this.$message.error(this.$t('rbt.selectIssued'));
      }
    },
    // 删除任务点击
    batchDelete() {
      this.temp = 'delete';
      this.showCheckbox = true;
      this.allChecked = false;
      this.fold = true;
    },
    // 确定删除点击
    confirmDelete() {
      this.fold = true;
      if (this.selection.length > 0) {
        this.$confirm(this.$t('common.confirmDelete') + '？').then((res) => {
          deleteMission({
            mission_config: [
              {
                missions: this.selection,
                role_resource_id: this.currentRole.role_id,
              },
            ],
            room_id: this.resource_id,
          }).then((res) => {
            this.$emit('update');
            this.$message.success(this.$t('rbt.deleteSuccess'));
            this.showCheckbox = false;
            this.indeterminate = false;
            this.selection = [];
          });
        });
      } else {
        this.$message.error(this.$t('rbt.selectDelete'));
      }
    },
    // 取消
    cancel() {
      this.fold = true;
      // 清空选择状态
      this.taskStage.mission_infos.forEach((item) => {
        item.checked = false;
      });
      this.allChecked = false;
      this.indeterminate = false;

      // 清空选择内容
      this.selection = [];
      this.showCheckbox = false;
    },
    // 修改题解
    changeWriteUp(status, resource_id, room_id) {
      isWriteUp({
        write_up_show: !status,
        mission_resource_id: resource_id,
        room_id: room_id,
      }).then((res) => {
        this.$emit('update');
        if (status) {
          this.$message({
            type: 'success',
            message: this.$t('m.SuccessfullyClosedSolution'),
          });
        } else {
          this.$message({
            type: 'success',
            message: this.$t('m.SuccessfullyLetTheSolution'),
          });
        }
      });
    },
    // 查看任务详情
    viewDetail(task) {
      this.taskDetail.title = task.title;
      this.taskDetail.description = task.description;
      this.taskDetail.type = task.type;
      this.taskDetail.score = task.score;
      // 比例和雷达图处理
      const array = [];
      _.forEach(JSON.parse(task.skill_points), (item, itemIndex) => {
        array.push({
          rate: item,
        });
      });
      _.forEach(this.pieArrs, (typeItem, index) => {
        this.$set(array[index], 'type', typeItem);
      });
      this.levelRate = array;
      // -----------
      this.taskDetail.all_user_list = task.all_user_list;
      this.dialogTaskDetail = true;
    },
    // 新增任务
    addMission(taskStage, currentRole) {
      this.fold = true;
      this.roleOptionList = [
        {
          label: currentRole.role_name,
          value: currentRole.role_id,
        },
      ];
      this.positionOption = taskStage.mission_infos.map((item) => {
        return {
          label: item.title,
          value: item.resource_id,
        };
      });
      this.positionOption.unshift({
        label: this.$t('rbt.finally'),
        value: '',
      });
      this.positionOption.unshift({
        label: this.$t('rbt.foremost'),
        value: 'first',
      });
      // 添加任务
      this.addMissionDialog();
    },
    // 添加任务弹框
    addMissionDialog() {
      this.dialogAddMission = !this.dialogAddMission;
    },
    getMissionResponse(res) {
      this.missionRes = res.data.data;
      this.$emit('update');
      // 失败保留添加任务弹窗,提高易用性
      if (this.missionRes) {
        this.messageDialog('success', this.$t('common.operateSuccess'));
      } else {
        this.addMissionDialog();
        this.$message.error(res.data.message);
      }
    },
    messageDialog(type, message) {
      this.$message({
        type: type,
        message: message,
      });
    },
    // 添加任务
    missionSubmit() {
      // 对任务详情页中内容进行校验,判断是否可提交
      if (this.getValidForm()) {
        this.$refs.createMission.submitReady();
      } else {
        return;
      }
    },
    // 新增测试弹窗的验证
    getValidForm() {
      return this.$refs['createMission'].missionFormValid();
    },
    // 获取雷达图label
    getPieLabel() {
      getRadarLabels().then((res) => {
        const data = _.get(res, 'data.data.labels');
        this.pieArrs = data;
        const arrs = [];
        _.forEach(data, (item, index) => {
          if (index === 0) {
            arrs.push({
              name: item,
              max: 5,
              axisLabel: {
                align: 'center',
                verticalAlign: 'top',
                show: true,
                fontSize: 14,
                color: this.$themed('neutral5'),
                showMaxLabel: true, //不显示最大值，即外圈不显示数字30
                showMinLabel: true, //显示最小数字，即中心点显示0
              },
            });
          } else {
            arrs.push({
              name: item,
              max: 5,
            });
          }
        });
        this.pieLabelArr = arrs;
      });
    },
    showDialog(a) {
      this.dialogUpdate = a;
    },
    // 单个下发
    distribute(resource_id) {
      deliveryStatus({
        role_resource_id: this.currentRole.role_id,
        mission_resource_ids: [resource_id],
      })
        .then((res) => {
          this.messageDialog('success', this.$t('m.successfullyIssued'));
          this.$emit('update');
        })
        .catch((res) => {
          this.$message.error(res.data.message);
        });
    },
    // 编辑任务
    editorDialog(task) {
      this.task.resource_id = task.resource_id;
      this.task.title = task.title;
      this.task.score = task.score;
      // 比例和雷达图处理
      const array = [];
      _.forEach(JSON.parse(task.skill_points), (item, itemIndex) => {
        array.push({
          rate: item,
        });
      });
      _.forEach(this.pieArrs, (typeItem, index) => {
        this.$set(array[index], 'type', typeItem);
      });
      this.levelRate = array;
      // -----------
      this.task.type = task.type;
      this.task.description = task.description;
      this.task.category = task.category_id;
      this.task.answer = task.answer;
      this.task.write_up = task.write_up;
      this.dialogUpdate = true;
    },
    getCategory(category) {
      let data = '';
      this.categoryOption.forEach((item) => {
        if (item.resource_id === category) {
          data = item.name;
        }
      });
      return data;
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
    getAnswer(type, answer) {
      let data = '';
      if (type === 0) {
        if (answer === 'A') {
          data = this.$t('m.correct');
        } else if (answer === 'B') {
          data = this.$t('m.error');
        }
      } else {
        data = answer;
      }
      return data;
    },
    // 更新任务
    updateTask() {
      // 技能点参数处理
      const arr = [];
      _.forEach(this.levelRate, (point) => {
        arr.push(point.rate);
      });
      this.$refs.editFormRef.validate((valid) => {
        if (valid) {
          updateMission({
            resource_id: this.task.resource_id,
            title: this.task.title,
            score: this.task.score,
            skill_points: JSON.stringify(arr),
            role_resource_id: this.currentRole.role_id,
            description: this.task.description,
          })
            .then((res) => {
              this.$emit('update');
              this.messageDialog('success', this.$t('m.successfulTaskEditing'));
              this.dialogUpdate = false;
            })
            .catch((res) => {});
        } else {
          return false;
        }
      });
    },
    // 取消编辑
    cancelEditTask() {
      this.dialogUpdate = false;
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

@keyframes showTip {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}

.task-list {
  width: 100%;
  height: 100%;
  .task-wrap {
    .task-info {
      background: var(--bg-color-3);
      padding: 0 16px;
      height: 48px;
      line-height: 48px;
      position: relative;
      display: flex;
      align-items: center;
      .checkbox {
        margin-right: 16px;
      }
      .task-name {
        display: inline-block;
        font-size: 14px;
        color: var(--neutral8);
        width: 230px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
      .btn-wrap {
        position: absolute;
        top: 0px;
        right: 32px;
        font-size: 14px;
        span {
          color: var(--primary-color);
          margin-right: 16px;
          cursor: pointer;
        }
        .all-release {
          color: var(--primary-color-4);
        }
        .not-all-release {
          color: var(--primary-color);
        }
      }
      .triangle-wrap {
        width: 20px;
        height: 20px;
        position: absolute;
        top: 0;
        right: 16px;
        cursor: pointer;
        .triangle-color {
          color: var(--neutral5);
        }
      }
    }
    .collapase-wrap {
      // 添加最小高度，否则折叠获取不到dom
      min-height: 10px;
      .task-item {
        background: var(--bg-color-3);
        padding: 12px 16px;
        height: 74px;
        position: relative;
        border-bottom: 1px solid var(--neutral0);
        cursor: pointer;
        .task-source {
          display: flex;
          align-items: center;
          height: 24px;
          .checkbox {
            margin-right: 16px;
          }
          .task-type {
            display: inline-block;
            max-width: 400px;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
            font-size: 14px;
            margin-right: 4px;
          }
          .task-type-release {
            color: var(--neutral4);
          }
          .task-type-not-release {
            color: var(--neutral8);
          }
          .tag {
            display: inline-block;
            width: 64px;
            height: 22px;
            line-height: 22px;
            text-align: center;
            color: var(--orange-color);
            background: var(--orange-color-2);
            font-size: 12px;
          }
        }
        .status,
        .status-release {
          display: inline-block;
          margin-top: 8px;
          font-size: 12px;
        }
        .release-all-finish {
          color: var(--neutral4);
        }
        .release-not-all-finish {
          color: var(--neutral7);
        }
        .status-show-checkbox {
          color: var(--neutral4);
        }
        .status-not-show-checkbox {
          color: var(--neutral7);
        }
        .status-release:hover {
          .finish-tip {
            display: block;
            animation-name: showTip;
            animation-duration: 0.5s;
          }
        }
        .btn-wrap {
          position: absolute;
          right: 4px;
          bottom: 16px;
          .btn-item {
            margin-right: 16px;
            cursor: pointer;
            .write-up-icon {
              color: var(--neutral6);
            }
          }
          span {
            .has-style {
              color: var(--neutral4);
            }
            .no-style {
              color: var(--neutral7);
            }
          }
        }
        .finish-tip {
          display: none;
          position: absolute;
          left: 60px;
          top: -48px;
          background: var(--bg-color-3);
          box-shadow: 8px 8px 30px 0px var(--box-shadow-color);
          border-radius: 2px;
          z-index: 1;
          text-align: center;
          .tip {
            height: 22px;
            font-size: 14px;
            color: var(--neutral8);
            margin-top: 8px;
          }
          .user-wrap {
            display: flex;
            margin-top: 8px;
            flex-wrap: wrap;
            min-width: 167px;
            max-width: 330px;
            min-height: 80px;
            max-height: 300px;
            overflow-y: scroll;
            padding-left: 20px;
            .user-info {
              display: flex;
              flex-direction: column;
              align-items: center;
              width: 36px;
              margin-right: 16px;
              margin-bottom: 16px;
              &:nth-child(6n) {
                margin-right: 0px;
              }
              .logo-wrap {
                width: 24px;
                height: 24px;
                border-radius: 50%;
                background: var(--bg-color-3);
                border: 1px solid var(--neutral1);
                img {
                  width: 100%;
                  height: 100%;
                  border-radius: 50%;
                }
              }
              .user-name {
                width: 36px;
                font-size: 12px;
                color: var(--neutral8);
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
              }
            }
          }
        }
      }
      .task-item:hover {
        background: var(--neutral0);
      }
    }
  }
}
</style>
<style lang="scss" scoped>
// 任务详情弹窗
.task-detail {
  width: 100%;
  .item {
    width: 100%;
    display: flex;
    margin-bottom: 12px;
    .key {
      font-size: 14px;
      color: var(--neutral7);
      width: 80px;
      text-align: right;
    }
    .value {
      font-size: 14px;
      color: var(--neutral8);
      width: calc(100% - 80px);
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      .user {
        width: 70px;
        display: inline-block;
        text-align: center;
        .logo-wrap {
          width: 32px;
          height: 32px;
          display: inline-block;
          border-radius: 50%;
          background: var(--bg-color-3);
          border: 1px solid var(--neutral1);
          img {
            border-radius: 50%;
            width: 100%;
            height: 100%;
          }
        }
        .name {
          text-align: center;
          width: 70px;
          font-size: 14px;
          color: var(--neutral8);
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }
      }
    }
    .value-desc {
      font-size: 14px;
      color: var(--neutral8);
      overflow: hidden;
      white-space: normal;
    }
    .values {
      font-size: 14px;
      color: var(--neutral8);
      width: calc(100% - 80px);
      display: flex;
      flex-wrap: wrap;
      .user {
        width: 70px;
        display: inline-block;
        text-align: center;
        .logo-wrap {
          width: 40px;
          height: 40px;
          display: inline-block;
          background: var(--bg-color-3);
          border: 1px solid var(--neutral1);
          border-radius: 50%;
          img {
            width: 100%;
            height: 100%;
            border-radius: 50%;
          }
        }
        .name {
          text-align: center;
          width: 70px;
          font-size: 14px;
          color: var(--neutral8);
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }
      }
    }
  }
}
</style>
<style lang="scss" scoped>
// 编辑任务弹窗
.update-dialog {
  overflow: hidden;
  .skill-left {
    float: left;
    width: 300px;
    .rate-a {
      width: 120px;
      float: left;
      text-align: right;
      margin-right: 9px;
      color: var(--neutral8);
    }
  }
  .skill-right {
    float: left;
    width: calc(100% - 310px);
    height: 240px;
  }
}

::v-deep.cb-markdown .markdown-body {
  margin: 0 auto;
  padding: 0 0;
}
</style>
