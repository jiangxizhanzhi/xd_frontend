<template>
  <div id="task-editor-new">
    <div class="left-echarts fl">
      <div class="echarts-common">
        <title-director
          :square-color="'bg-color-blue'"
          :name="$t('m.hasReport')"
        />
        <!-- 已完成 -->
        <div class="echart">
          <battle-char-histogram
            :light="light"
            :data-info="taskFinishedEchartsComputed"
          />
          <chart-previous
            class="previous"
            :idx="taskFinishedEchartsIdx"
            @click="taskFinishedEchartsIdx = taskFinishedEchartsIdx - 1"
          />
          <chart-next
            class="next"
            :len="
              taskFinishedEcharts.dataLabel
                ? taskFinishedEcharts.dataLabel.length
                : 0
            "
            :idx="taskFinishedEchartsIdx"
            @click="taskFinishedEchartsIdx = taskFinishedEchartsIdx + 1"
          />
        </div>
      </div>
      <div class="echarts-common">
        <title-director
          :square-color="'bg-color-green'"
          :name="$t('m.hasIssued')"
        />
        <!-- 已下发 -->
        <div class="echart">
          <battle-char-histogram
            :light="light"
            :data-info="taskReleaseEchartsComputed"
          />
          <chart-previous
            class="previous"
            :idx="taskReleaseEchartsIdx"
            @click="taskReleaseEchartsIdx--"
          />
          <chart-next
            class="next"
            :len="
              taskReleaseEcharts.dataLabel
                ? taskReleaseEcharts.dataLabel.length
                : 0
            "
            :idx="taskReleaseEchartsIdx"
            @click="taskReleaseEchartsIdx++"
          />
        </div>
      </div>
      <div class="echarts-common">
        <title-director
          :square-color="'bg-color-yellow'"
          :name="$t('m.notIssued')"
        />
        <!-- 未下发 -->
        <div class="echart">
          <battle-char-histogram
            :light="light"
            :data-info="taskNotReleaseEchartsComputed"
          />
          <chart-previous
            class="previous"
            :idx="taskNotReleaseEchartsIdx"
            @click="taskNotReleaseEchartsIdx--"
          />
          <chart-next
            class="next"
            :len="
              taskNotReleaseEcharts.dataLabel
                ? taskNotReleaseEcharts.dataLabel.length
                : 0
            "
            :idx="taskNotReleaseEchartsIdx"
            @click="taskNotReleaseEchartsIdx++"
          />
        </div>
      </div>
    </div>
    <div class="left fl" :class="{ widthChange: isShowDetail !== true }">
      <cb-scrollbar>
        <div v-for="(item, index) in teamLists" :key="index" class="team">
          <cb-collapse v-model="activeName">
            <cb-collapse-item :name="index">
              <template slot="title" style="padding-left: 30px">
                <span
                  :class="
                    item.group === '红方' || item.group === 'Red'
                      ? 'red-color'
                      : 'cy-color'
                  "
                  style="position: relative; top: 3px"
                >
                  <cb-iconfont
                    type="icon-qizi"
                    size="24"
                    :color="
                      item.group === '红方' || item.group === 'Red'
                        ? '#FD3A2C'
                        : ''
                    "
                  />
                </span>
                <span class="gt"> ></span>
                <div
                  class="team-name"
                  :class="{
                    'red-color': item.group === '红方' || item.group === 'Red',
                    'cy-color': item.group === '蓝方' || item.group === 'Blue',
                  }"
                >
                  {{ item.group }}
                </div>
                <div class="title-all">
                  <div class="task-num">
                    <span>{{ $t('m.numberOfTasks') }}:</span>
                    <span class="font-style">{{ item.mission_number }}</span>
                  </div>
                  <div class="row-num" style="">
                    <span>{{ $t('m.numberOfGroups') }}:</span>
                    <span class="font-style">{{ item.group_number }}</span>
                  </div>
                  <div class="people-num" style="">
                    <span>{{ $t('m.numberOfPeople') }}:</span>
                    <span class="font-style">{{ item.people_number }}</span>
                  </div>
                </div>
              </template>
              <div class="team-operate cy-color">
                <span @click="addPage(index)">
                  <cb-iconfont size="18" type="icon-wenshu" />
                  <span
                    class="team-name cy-color"
                    style="margin: 0 10px 0 5px"
                    >{{ $t('m.exerciseDocument') }}</span
                  >
                </span>
                <span @click="addMission(item, index)">
                  <cb-iconfont size="18" type="icon-xinzeng" />
                  <span class="team-name cy-color" style="margin: 0 5px">{{
                    $t('m.addMission')
                  }}</span>
                </span>
                <span @click="deleteMuti(item, index)">
                  <cb-iconfont
                    size="18"
                    type="icon-shanchu"
                    class="icon-style"
                  />
                  <span class="team-name cy-color" style="margin: 0 5px">{{
                    $t('m.deleteTask')
                  }}</span>
                </span>
              </div>
              <div
                v-for="(row, rowindex) in item.roles"
                :key="rowindex"
                class="rows"
              >
                <div class="rows-title">
                  <div class="row-name">
                    <title-director
                      :square-color="getSquareColor(item)"
                      :name="row.name"
                    />
                  </div>
                  <div class="tsak-right fr">
                    <div class="task-num">
                      <span>{{ $t('m.numberOfTasks') }}:</span>
                      <span class="font-style">{{ row.mission_number }}</span>
                    </div>
                    <div class="row-num">
                      <span>{{ $t('m.numberOfPeople') }}:</span>
                      <span class="font-style">{{ row.people_number }}</span>
                    </div>
                  </div>
                </div>
                <div class="task-box">
                  <div
                    v-for="(tasks, id) in row.missions"
                    :key="id"
                    class="task-message"
                    :class="taskBoxBg(tasks, index, rowindex, id)"
                    style="position: relative"
                  >
                    <div class="task-top">
                      <div
                        class="task-content"
                        @click="selectBox(index, rowindex, id, tasks)"
                      >
                        <div class="task-top-title one-overflow">
                          [<span
                            class="title-span"
                            :title="getType(tasks.type)"
                            v-text="getType(tasks.type)"
                          />]
                          <span class="title-span" :title="tasks.title">{{
                            tasks.title
                          }}</span>
                        </div>
                        <div
                          v-show="tasks.missionStatus"
                          class="task-top-complete"
                        >
                          <span class="complete-span"
                            >{{ $t('m.hasReport')
                            }}<span class="cy-color complete-count">{{
                              tasks.complete_num_formatter
                            }}</span
                            >{{ $t('m.peoples') }},</span
                          >
                          <span class="complete-span"
                            >{{ $t('m.hasIssued')
                            }}<span class="cy-color complete-count">{{
                              tasks.delivery_details !== null
                                ? tasks.delivery_details.length
                                : 0
                            }}</span
                            >{{ $t('m.peoples') }}</span
                          >
                        </div>
                        <div
                          v-show="!tasks.missionStatus"
                          class="task-top-complete"
                        >
                          <span class="complete-span">{{
                            $t('m.notIssued')
                          }}</span>
                        </div>
                      </div>
                      <div class="task-foot">
                        <div class="foot-left" style="display: none">
                          <i
                            class="fa fa-arrow-circle-down"
                            aria-hidden="true"
                          />{{
                            tasks.delivery_details !== null
                              ? tasks.delivery_details.length
                              : 0
                          }}{{ $t('m.peoples') }}
                          <i
                            class="fa fa-check-circle-o"
                            aria-hidden="true"
                          />{{ tasks.complete_num_formatter
                          }}{{ $t('m.peoples') }}
                        </div>
                        <div
                          class="foot-right"
                          :class="getFilter(index, rowindex, id)"
                        >
                          <div class="img-div three-img-div probe-elc-switch">
                            <span
                              class="white-color"
                              style="margin-right: 10px"
                              >{{ $t('m.answerKey') }}</span
                            >
                            <cb-switch
                              v-model="tasks.write_up_show"
                              :active-value="true"
                              :inactive-value="false"
                              @change="
                                isViewAnswer(
                                  tasks.write_up_show,
                                  tasks.resource_id,
                                  index,
                                  rowindex,
                                )
                              "
                            ></cb-switch>
                          </div>
                          <div class="icon-div one-img-div">
                            <span
                              v-if="!tasks.missionStatus"
                              :title="$t('common.edit')"
                              class="sky-bule-icon"
                              @click="
                                editorDialog(
                                  index,
                                  rowindex,
                                  tasks,
                                  row.role_resource_id,
                                )
                              "
                            >
                              <cb-iconfont type="icon-bianji" size="18" />
                            </span>

                            <span
                              v-else
                              class="disable-btn-color"
                              :title="$t('common.edit')"
                            >
                              <cb-iconfont type="icon-bianji" size="18" />
                            </span>
                          </div>
                          <div class="icon-div one-img-div">
                            <span
                              v-if="tasks.missionStatus"
                              class="disable-btn-color"
                              :title="$t('m.issued')"
                            >
                              <cb-iconfont type="icon-xiafa" size="18" />
                            </span>
                            <span
                              v-else
                              class="sky-bule-icon"
                              :title="$t('m.issued')"
                              @click="issuedTask(index, rowindex, id, tasks)"
                            >
                              <cb-iconfont type="icon-xiafa" size="18" />
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div v-if="tasks.mission_dynamic" class="mission-dynamic">
                      {{ $t('crEvent.dynamicalAdd') }}
                    </div>
                  </div>
                </div>
              </div>
              <div v-show="item.group_hash == isDelete" class="btn">
                <cb-button button-type="confirm" @click="sureDelete(index)">
                  {{ $t('m.ensure') }}
                </cb-button>
                <cb-button button-type="cancel" @click="cancel(index)">
                  {{ $t('m.cancel') }}
                </cb-button>
              </div>
            </cb-collapse-item>
          </cb-collapse>
        </div>
      </cb-scrollbar>
      <!--文书编辑弹窗-->
      <cb-dialog
        v-if="dialogBook"
        :title="$t('m.exerciseDocument')"
        :visible.sync="dialogBook"
        width="50%"
        :close-on-press-escape="false"
      >
        <cb-markdown
          ref="myQuillEditor"
          v-model="content"
          class="practical-notes"
          :uploadImages="uploadImages"
        />
        <span slot="footer" class="dialog-footer">
          <cb-button button-type="confirm" mr @click="submitPage"></cb-button>
          <cb-button
            button-type="cancel"
            @click="dialogBook = false"
          ></cb-button>
        </span>
      </cb-dialog>
      <!--任务编排编辑弹窗-->
      <cb-dialog
        :visible.sync="dialogUpdate"
        :title="$t('common.edit')"
        width="1000px"
        height="500px"
        @stateEventDialog="showDialog"
        @close="cancelEditTask"
      >
        <template>
          <div class="dialog-form">
            <!-- <cb-form label-width="100px" :model="task" :rules="rules"> -->
            <cb-form
              :label-width="language === 'en' ? '100px' : '110px'"
              :model="task"
              :rules="rules"
            >
              <cb-form-item :label="$t('m.missionTitle')" prop="title">
                <cb-input v-model="task.title" class="elc-input" />
              </cb-form-item>
              <cb-form-item :label="$t('m.fraction')" prop="score">
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
              <cb-form-item :label="$t('m.settingSkillPoints')">
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
                        <cb-rate
                          v-model="item.rate"
                          class="elc-rate"
                          :max="5"
                        />
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
              <cb-form-item :label="$t('m.taskType')">
                <cb-input
                  :disabled="true"
                  class="task-type-disabled elc-input"
                  v-text="getType(task.type)"
                />
              </cb-form-item>
              <cb-form-item :label="$t('m.taskContent')">
                <cb-input
                  v-model="task.description"
                  type="textarea"
                  placeholder=""
                  :disabled="true"
                  class="elc-input"
                />
              </cb-form-item>
            </cb-form>
          </div>
        </template>
        <span slot="footer" class="dialog-footer">
          <cb-button button-type="confirm" mr @click="updateTask"></cb-button>
          <cb-button button-type="cancel" @click="cancelEditTask"></cb-button>
        </span>
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
            @missionResponse="getMissionResponse"
            @closeDialog="addMissionDialog"
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
    </div>
    <div v-if="isShowDetail" class="right fl">
      <cb-scrollbar class="rightScrollbar">
        <div class="task-detail">
          <title-director
            :square-color="'bg-color-sky-blue'"
            :name="$t('m.taskDetails')"
          />
          <cb-form ref="taskDetail" :model="taskDetail" label-width="110px">
            <cb-form-item :label="$t('m.missionTitle')">
              <div class="form-value one-overflow" :title="taskDetail.title">
                {{ taskDetail.title }}
              </div>
            </cb-form-item>
            <cb-form-item :label="$t('m.taskOverview')">
              <div
                class="form-value one-overflow"
                :title="taskDetail.description"
              >
                {{ taskDetail.description }}
              </div>
            </cb-form-item>
          </cb-form>
          <div class="skillchart">
            <div style="height: 325px">
              <cb-echart-radar
                v-if="pieLabelArr.length > 0 && ready"
                ref="skillchart"
                radarShape="sharp"
                :indicator="pieLabelArr"
                :radarData="levels"
                :axisName="axisNameDetail"
              ></cb-echart-radar>
            </div>
            <div class="detail-infos form-value">
              <div class="fl left-div" style="">
                <div class="common-div">
                  <div
                    class="fl one-overflow width30"
                    :title="$t('m.tasksType')"
                  >
                    {{ $t('m.tasksType') }}
                  </div>
                  <div class="fl width8">:</div>
                  <div
                    class="fl one-overflow width62"
                    :title="getType(taskDetail.type)"
                  >
                    {{ getType(taskDetail.type) }}
                  </div>
                </div>
                <div class="common-div">
                  <div
                    class="fl one-overflow width30"
                    :title="$t('m.fraction')"
                  >
                    {{ $t('m.fraction') }}
                  </div>
                  <div class="fl width8">:</div>
                  <div
                    class="fl one-overflow width62"
                    :title="taskDetail.score"
                  >
                    {{ taskDetail.score }}
                  </div>
                </div>
              </div>
              <div class="fl left-div right-div">
                <div class="common-div">
                  <div class="fl one-overflow width21" :title="$t('m.role')">
                    {{ $t('m.role') }}
                  </div>
                  <div class="fl width8">:</div>
                  <div class="fl one-overflow width62" :title="role">
                    {{ role }}
                  </div>
                </div>
                <div class="common-div">
                  <div class="fl one-overflow width21" :title="$t('m.groups')">
                    {{ $t('m.groups') }}
                  </div>
                  <div class="fl width8">:</div>
                  <div class="fl one-overflow width62" :title="group">
                    {{ group }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="push-detail">
          <div class="clearfix" style="margin-bottom: 13px">
            <title-director
              :square-color="'bg-color-sky-blue'"
              :name="$t('m.deliveryDetails')"
            />
            <div v-show="deliveryDetails" class="push-title form-value">
              <span class="font-style">{{
                deliveryDetails !== null ? deliveryDetails.length : 0
              }}</span>
              <span>{{ $t('m.numberOfDeliveries') }}</span>
              <span class="font-style" style="margin-left: 10px">{{
                complete_num_formatter_value
              }}</span>
              <span>{{ $t('m.completionNumber') }}</span>
            </div>
          </div>
          <div>
            <cb-row
              v-for="(item, index) in deliveryDetails"
              :key="index"
              :gutter="20"
            >
              <cb-col :span="4" :offset="1"
                ><img
                  :src="item.logo || defaultUserLogo"
                  style="width: 30px; margin-top: 4px"
              /></cb-col>
              <cb-col
                :span="6"
                class="one-overflow form-value"
                :title="item.rep_name"
                >{{ item.rep_name }}</cb-col
              >
              <cb-col
                :span="5"
                class="one-overflow form-value"
                :title="item.group_name"
                >{{ item.group_name }}</cb-col
              >
              <cb-col :span="8" class="form-value" :title="item.roleName">
                <span class="fl">[</span>
                <span
                  class="one-overflow fl"
                  style="max-width: 80%; min-width: 5%"
                  >{{ item.roleName }}</span
                >
                <span class="fl">]</span>
              </cb-col>
            </cb-row>
            <div
              v-show="!deliveryDetails"
              style="margin-top: 40px; text-align: center; font-size: 14px"
            >
              <cb-iconfont type="icon-zanwuziyuan" size="56"></cb-iconfont>
              <div>{{ $t('m.noData') }}</div>
            </div>
          </div>
        </div>
      </cb-scrollbar>
      <div class="detail-delete cursor" @click="cancelDetail">
        <i class="el-icon-close" />
      </div>
    </div>
  </div>
</template>

<script>
import { getLanguage } from '@cyber/helper';
import SkillChart from '@/components/TaskEditor/skill_chart.vue';
import SkillOneChart from '@/components/TaskEditor/skillone_chart.vue';
import TitleDirector from '@/pages/web/RedVsBlue/Director/components/title.vue';
import BattleCharHistogram from '@/pages/web/RedVsBlue/Director/components/battle_char_histogram.vue';
import _ from 'lodash';
import { deliveryStatus, exercisePaper } from '@/api/web/task_editor.js';
import { getExercisePaper } from '@/api/web/task_editor.js';
import {
  deleteMission,
  updateMission,
  isWriteUp,
} from '@/api/web/task_editor.js';
import ChartPrevious from '@/components/chart-step/chart-step-previous.vue';
import ChartNext from '@/components/chart-step/chart-step-next.vue';
import MissionDetail from '../Common/components/mission-detail';
import defaultUserLogo from '@/assets/img/userhead.png';
import { validateTitleLength255 } from '@/utils/rules';
import { getRadarLabels } from '@/api/common.js';
import validateUtils from '@/utils/validate';
import { cutStr } from '@/utils/index.js';
import { BUSINESS_TYPE } from '@/pages/web/RedVsBlue/constants.js';
const cityOptions = ['红方一组', '红方二组', '红方三组'];
const cityOptions1 = ['蓝方一组', '蓝方二组'];
let interval = null;
export default {
  components: {
    ChartPrevious,
    ChartNext,
    SkillChart,
    SkillOneChart,
    TitleDirector,
    BattleCharHistogram,
    MissionDetail,
  },
  props: {
    breadcrumbName: {
      type: String,
      default: '',
    },
    crEventData: {
      type: Object,
      default: () => {},
    },
    crStatus: {
      type: Number,
      default: null,
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
      BUSINESS_TYPE,
      status: false,
      selectDeleteIndex: -1,
      language: getLanguage(),
      listen: new this.$ListenDomChange({
        dom: document.body,
        callback: this.listenFunc,
      }),
      update_role_id: '',
      light: '',
      defaultUserLogo: defaultUserLogo,
      blueChart: 'blueChart',
      redChart: 'redChart',
      isShowDetail: false,
      scheme: '',
      radio: '2',
      type: '攻击',
      selectAlls: false,
      levels: [],
      dialogUpdate: false,
      checkAll: false,
      checkedCities: [],
      cities: cityOptions,
      cities1: cityOptions1,
      isIndeterminate: true,
      tableData: [],
      options: [],
      value: '',
      content: '',
      dialogBook: false,
      activeName: '',
      currentIndex: null,
      currentDeleteIndex: null,
      directorTaskArrangement: this.$t('m.directorTaskArrangement'),
      teamLists: [],
      i: null,
      isDelete: false,
      showSelectBtn: false,
      taskDetail: {},
      pieLabelArr: [],
      ready: true,
      pieArrs: [],
      levelRate: [],
      resource_id: '',
      cr_scene_config_role_id: '',
      task: {},
      role: '',
      group: '',
      deliveryDetails: [],
      paperGroupHash: '',
      exercisePaper: '',
      pushList: [],
      taskHashNew: [],
      groupMessage: {},
      userMessage: [],
      performanceData: null,
      taskFinishedEchartsIdx: 0,
      taskFinishedEcharts: {
        dataLabel: [],
        dataValue: [],
        dataRole: [],
        axisTickColor: 'rgba(67,154,255,0)', // 刻度线颜色
        axisLineColor: 'rgba(67,154,255,0)', // 坐标轴颜色
        axisLabelColor: 'rgba(192, 204, 231, 1)', // 坐标轴label颜色
        linearColors: ['rgba(63, 162, 254, 1)', 'rgba(27, 75, 120, 1)'], // 渐变色
        bottomValue: 25,
        barWidth: 10,
        Xrotate: 25,
        gridY: 20,
        gridBottom: 10,
      },
      taskReleaseEchartsIdx: 0,
      taskReleaseEcharts: {
        dataLabel: [],
        dataValue: [],
        dataRole: [],
        axisTickColor: 'rgba(67,154,255,0)', // 刻度线颜色
        axisLineColor: 'rgba(67,154,255,0)', // 坐标轴颜色
        axisLabelColor: 'rgba(192, 204, 231, 1)', // 坐标轴label颜色
        linearColors: ['rgba(80, 179, 150, 1)', 'rgba(45, 78, 73, 1)'], // 渐变色
        bottomValue: 25,
        barWidth: 10,
        Xrotate: 25,
        gridY: 20,
        gridBottom: 10,
      },
      taskNotReleaseEchartsIdx: 0,
      taskNotReleaseEcharts: {
        dataLabel: [],
        dataValue: [],
        dataRole: [],
        axisTickColor: 'rgba(67,154,255,0)', // 刻度线颜色
        axisLineColor: 'rgba(67,154,255,0)', // 坐标轴颜色
        axisLabelColor: 'rgba(192, 204, 231, 1)', // 坐标轴label颜色
        linearColors: ['rgba(208, 138, 80, 1)', 'rgba(113, 67, 28, 1)'], // 渐变色
        bottomValue: 25,
        barWidth: 10,
        Xrotate: 25,
        gridY: 20,
        gridBottom: 10,
      },
      complete_num_formatter_value: '',
      // 添加任务
      dialogAddMission: false,
      roleSelect: true,
      roleOptionList: [],
      missionSubmitUrl: '',
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
    };
  },
  computed: {
    // ...mapGetters(['language']),
    taskNotReleaseEchartsComputed() {
      const { taskNotReleaseEcharts, taskNotReleaseEchartsIdx } = this;
      const step = 10;
      const copy = JSON.parse(JSON.stringify(taskNotReleaseEcharts));
      const dataLabel = _.get(taskNotReleaseEcharts, 'dataLabel', []);
      if (dataLabel.length > step) {
        const start = taskNotReleaseEchartsIdx * step;
        const end = (taskNotReleaseEchartsIdx + 1) * step;
        copy.dataLabel = copy.dataLabel.slice(start, end);
        copy.dataRole = copy.dataRole.slice(start, end);
        copy.dataValue = copy.dataValue.slice(start, end);
      }

      return copy;
    },
    taskReleaseEchartsComputed() {
      const { taskReleaseEcharts, taskReleaseEchartsIdx } = this;
      const step = 10;
      const copy = JSON.parse(JSON.stringify(taskReleaseEcharts));
      const dataLabel = _.get(taskReleaseEcharts, 'dataLabel', []);
      if (dataLabel.length > step) {
        const start = taskReleaseEchartsIdx * step;
        const end = (taskReleaseEchartsIdx + 1) * step;
        copy.dataLabel = copy.dataLabel.slice(start, end);
        copy.dataRole = copy.dataRole.slice(start, end);
        copy.dataValue = copy.dataValue.slice(start, end);
      }

      return copy;
    },
    taskFinishedEchartsComputed() {
      const { taskFinishedEcharts, taskFinishedEchartsIdx } = this;
      const step = 10;
      const copy = JSON.parse(JSON.stringify(taskFinishedEcharts));
      const dataLabel = _.get(taskFinishedEcharts, 'dataLabel', []);
      if (dataLabel.length > step) {
        const start = taskFinishedEchartsIdx * step;
        const end = (taskFinishedEchartsIdx + 1) * step;
        copy.dataLabel = copy.dataLabel.slice(start, end);
        copy.dataRole = copy.dataRole.slice(start, end);
        copy.dataValue = copy.dataValue.slice(start, end);
      }

      return copy;
    },
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
  watch: {
    radio: {
      handler(val, oldval) {
        if (val === '2') {
          this.showSelectBtn = true;
        } else {
          this.showSelectBtn = false;
        }
      },
      deep: true,
    },
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
    levelRate: {
      handler(val, oldval) {
        if (val) {
          if (this.$refs.skillBlueChart) {
            const newData = [];
            val.forEach((item) => {
              newData.push(item.rate);
            });
            this.$refs.skillBlueChart.options.series[0].data[0].value = newData;
            this.$refs.skillBlueChart.initBlueChart();
          }
        }
      },
      deep: true,
    },
    crEventData: {
      handler(val, oldval) {
        if (JSON.stringify(val) !== JSON.stringify(oldval)) {
          if (!_.isEmpty(val.data)) {
            // if (this.crEventData.data.mission_scheme) {
            // this.haveMission = true
            this.resource_id =
              this.$route.params && this.$route.params.resource_id;
            //导演添加任务
            // this.missionSubmitUrl = `/red_vs_blue/red_vs_blue_directors/${this.resource_id}/mission_info_create/`;
            this.missionSubmitUrl = `/cr/director/red_vs_blue/red_vs_blue/mission_info_create`;
            this.getData();
            this.getUserGrade();
          }
          // }
        }
      },
      deep: true,
      immediate: true,
    },
  },
  beforeMount() {},
  created() {
    this.resource_id = this.$route.params && this.$route.params.resource_id;
  },
  beforeDestroy() {
    clearInterval(interval);
    this.listen.destroyListen();
  },
  mounted() {
    this.getPieLabel();
    interval = setInterval(() => {
      this.getUserGrade();
    }, 120000);
    this.listen.createListen();
  },
  methods: {
    // 监听换肤，动态reload ecahrts
    listenFunc() {
      const className = document.body.className.split(' ');
      if (className.indexOf('theme-dark') != -1) {
        this.light = 'dark';
      } else {
        this.light = 'light';
      }
      this.ready = false;
      if (this.pieLabelArr.length) {
        this.pieLabelArr[0].axisLabel.color = this.$themed('neutral5');
      }
      this.$nextTick(() => {
        this.ready = true;
      });
    },
    // 上传图片
    uploadImages(item) {
      var formdata = new FormData();
      formdata.append('file', item[0]);
      formdata.append('type', this.BUSINESS_TYPE.CR_WEB_RED);
      return new Promise((resolve, reject) => {
        // 导演添加文书上传图片
        this.$request
          .post('/common/web/image_upload', formdata, { baseURL: '/api/ojj' })
          .then((res) => {
            resolve([
              {
                url: _.get(res, 'data.data.file_path', ''),
              },
            ]);
          });
      });
    },

    // 获取左侧图表信息
    getUserGrade() {
      // 点击任务编排获取左侧图表
      this.$request
        .get(
          '/cr/red_vs_blue/statistics/missions_statistics',
          { resource_id: this.resource_id },
          { baseURL: '/api/ojj' },
        )
        .then((res) => {
          if (res.data.data) {
            this.performanceData = res.data.data;
            this.taskFinishedEcharts.dataLabel = [];
            this.taskReleaseEcharts.dataLabel = [];
            this.taskNotReleaseEcharts.dataLabel = [];
            this.taskFinishedEcharts.dataValue = [];
            this.taskReleaseEcharts.dataValue = [];
            this.taskNotReleaseEcharts.dataValue = [];
            this.taskFinishedEcharts.dataRole = [];
            this.taskReleaseEcharts.dataRole = [];
            this.taskNotReleaseEcharts.dataRole = [];
            _.forEach(res.data.data, (item) => {
              this.taskFinishedEcharts.dataLabel.push(item.user_name);
              this.taskReleaseEcharts.dataLabel.push(item.user_name);
              this.taskNotReleaseEcharts.dataLabel.push(item.user_name);
              this.taskFinishedEcharts.dataValue.push(
                item.complete_missions_count,
              );
              this.taskReleaseEcharts.dataValue.push(
                item.release_missions_count,
              );
              this.taskNotReleaseEcharts.dataValue.push(
                item.scheme_missions_count - item.release_missions_count,
              );
              this.taskFinishedEcharts.dataRole.push(item.role_group);
              this.taskReleaseEcharts.dataRole.push(item.role_group);
              this.taskNotReleaseEcharts.dataRole.push(item.role_group);
            });
          }
        });
    },
    // 获取颜色
    getSquareColor(item) {
      let colorStyle = '';
      if (item.group === '红方' || item.group === 'Red') {
        colorStyle =
          'linear-gradient(0deg,rgba(255,103,68,1) 0%,rgba(255,32,32,1) 100%)';
      } else {
        colorStyle =
          'linear-gradient(0deg,rgba(57,239,255,1) 0%, rgba(58,165,255,1) 100%)';
      }
      return colorStyle;
    },
    isViewAnswer(write_up_show, mission_hash, index, rowIndex) {
      if (this.currentDeleteIndex !== index) {
        let switchState = true;
        if (write_up_show) {
          switchState = true;
        } else {
          switchState = false;
        }
        // 是否开放题解
        // const url = `/red_vs_blue/red_vs_blue_directors/${this.resource_id}/show_write_up/`;
        // isWriteUp(url, {
        //   show_writeup: switchState,
        //   mission_resource_id: mission_hash,
        // })
        isWriteUp(this.url, {
          write_up_show: switchState,
          mission_resource_id: mission_hash,
          room_id: this.resource_id,
        })
          .then((res) => {
            this.getData();
            if (!write_up_show) {
              this.messageDialog(
                'success',
                this.$t('m.SuccessfullyClosedSolution'),
              );
            } else {
              this.messageDialog(
                'success',
                this.$t('m.SuccessfullyLetTheSolution'),
              );
            }
          })
          .catch((res) => {
            this.getData();
            this.error(res);
          });
      }
    },
    // 取消编辑
    cancelEditTask() {
      this.task.title = this.groupMessage.task_name;
      this.task.score = this.groupMessage.score;
      this.dialogUpdate = false;
    },
    // 点击演习文书，弹出弹窗
    addPage(index) {
      this.dialogBook = true;
      // 提交演戏文书的grouphash
      this.paperGroupHash = this.teamLists[index].group_hash;
      // 获取当前演习文书
      // 导演获取演习文书
      getExercisePaper(this.url, {
        resource_id: this.resource_id,
        group_hash: this.teamLists[index].group_hash,
      }).then((res) => {
        this.content = res.data.data.exercise_paper || '';
      });
    },

    // 提交文书
    submitPage() {
      if (this.content) {
        //导演提交演习文书
        exercisePaper(this.url, {
          resource_id: this.resource_id,
          exercise_paper: this.content,
          group_hash: this.paperGroupHash,
        })
          .then((res) => {
            this.dialogBook = false;
            this.messageDialog('success', this.$t('m.successful'));
            this.content = '';
          })
          .catch(() => {
            this.messageDialog('error', this.$t('m.failed'));
          });
      } else {
        this.messageDialog(
          'error',
          this.$t('common.pleaseInput') + this.$t('m.exerciseDocument'),
        );
      }
    },
    // 更新任务
    updateTask() {
      const mission_data = {};
      const arr = [];
      mission_data.title = this.task.title;
      mission_data.score = this.task.score;
      mission_data.is_copy = true;
      _.forEach(this.levelRate, (point) => {
        arr.push(point.rate);
      });
      mission_data.skill_points = JSON.stringify(arr);
      if (!mission_data.title) {
        this.messageDialog('error', this.$t('m.taskNameNotEmpty'));
      } else if (mission_data.score === undefined) {
        this.messageDialog('error', this.$t('m.pleaseProvideValidScore'));
      } else {
        updateMission(this.url, {
          // mission_resource_id: this.task.resource_id,
          resource_id: this.task.resource_id,
          title: this.task.title,
          score: this.task.score,
          skill_points: JSON.stringify(arr),
          role_resource_id: this.update_role_id,
        })
          .then((res) => {
            this.getData();
            this.dialogUpdate = false;
            this.messageDialog('success', this.$t('m.successfulTaskEditing'));
          })
          .catch((error) => {
            this.error(error);
            this.getData();
          });
      }
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
    // 编辑任务
    editorDialog(index, rowindex, task, role_resource_id) {
      this.update_role_id = role_resource_id;
      if (this.crStatus === null) {
        // 作战未开始
        this.messageDialog('error', this.$t('m.operationDidNotBegin'));
      } else if (this.crStatus === 0) {
        // 作战已停止
        this.messageDialog('error', this.$t('m.operationStopped'));
      } else {
        if (this.currentDeleteIndex !== index) {
          this.isShowDetail = false;
          const array = [];
          // let type1 = this.pieArrs;
          // [
          //   this.$t('m.socialEngineering'),
          //   this.$t('m.cryptography'),
          //   this.$t('m.loophole'),
          //   this.$t('m.applicationLayerPermeation'),
          //   this.$t('m.dataApplication'),
          //   this.$t('m.other'),
          // ];
          this.dialogUpdate = true;
          _.forEach(JSON.parse(task.skill_points), (item, itemIndex) => {
            array.push({
              rate: item,
            });
          });
          // debugger
          _.forEach(this.pieArrs, (typeItem, index) => {
            this.$set(array[index], 'type', typeItem);
            // array[index].type = type[index];
          });
          this.levelRate = array;
          this.task = task;
          this.groupMessage.group = this.teamLists[index].group;
          this.groupMessage.group_hash = this.teamLists[index].group_hash;
          // this.groupMessage.role = this.teamLists[index].roles[rowindex].name
          // this.groupMessage.role_hash = this.teamLists[index].roles[rowindex].role_hash
          this.groupMessage.task_name = task.title;
          this.groupMessage.score = task.score;
        }
      }
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
    taskBoxBg(task, once, second, third) {
      const text = {};
      if (task.missionStatus) {
        text.bg2 = true;
        if (task.isSelected) {
          text.selected = true;
        }
      } else {
        text.bg1 = true;
        if (task.isSelected) {
          text.selected = true;
        }
      }
      if (!this.isDelete) {
        // 正常状态状态下
        if (this.currentIndex) {
          if (
            this.currentIndex[0] === once &&
            this.currentIndex[1] === second &&
            this.currentIndex[2] === third
          ) {
            text.selected = true;
          } else {
            text.selected = false;
          }
        }
      }
      if (this.isShowDetail) {
        text['task-message-three'] = true;
        text['task-message-five'] = false;
      } else {
        text['task-message-five'] = true;
        text['task-message-three'] = false;
      }
      return text;
    },
    getFilter(once, second, third) {
      const filterBg = {};
      if (this.currentDeleteIndex === once) {
        filterBg['foot-right-filter'] = true;
      } else {
        filterBg['foot-right-filter'] = false;
      }
      return filterBg;
    },
    // 下发
    // 导演角色任务下发
    issuedTask(index, rowIndex, taskIndex, task) {
      if (this.currentDeleteIndex !== index) {
        this.resource_id = this.$route.params && this.$route.params.resource_id;
        // this.getUrl = `/red_vs_blue/red_vs_blue_directors/${this.resource_id}/mission_release/`;
        const role_hash =
          this.teamLists[index].roles[rowIndex].role_resource_id;
        const mission_hash = task.resource_id;
        // .teamLists[index].group_hash

        // let mission_status = null
        // if (task.mission_status === 0) {
        //   mission_status = 1
        // } else {
        //   mission_status = 0
        // }
        deliveryStatus(this.url, {
          role_resource_id: role_hash,
          mission_resource_id: mission_hash,
        })
          .then((res) => {
            this.messageDialog('success', this.$t('m.successfullyIssued'));
            this.getData();
          })
          .catch((res) => {
            this.error(res);
          });
      }
    },
    // 获取任务列表
    getData(index) {
      this.resource_id = this.$route.params && this.$route.params.resource_id;
      // 点击任务编排查询角色
      this.$request
        .get(
          '/cr/director/red_vs_blue/red_vs_blue/roles',
          { resource_id: this.resource_id },
          { baseURL: '/api/ojj' },
        )
        .then((res) => {
          const collapseList = [];
          //判断如果没有数据可以删除就不出现确定取消按钮
          if (
            index != undefined &&
            res.data.data.groups[index].mission_number === 0
          ) {
            this.isDelete = false;
          }
          // this.teamLists = res.data.groups;
          this.teamLists = res.data.data.groups;
          _.forEach(this.teamLists, (d, index) => {
            collapseList.push(index);
            _.forEach(d.roles, (role) => {
              _.forEach(role.missions, (missions) => {
                this.$set(missions, 'isSelected', false);
                this.$set(
                  missions,
                  'missionStatus',
                  !!missions.delivery_details,
                );
                // if (res.data.show_writeup_mapping[missions.resource_id]) {
                if (res.data.data.show_writeup_mapping[missions.resource_id]) {
                  this.$set(missions, 'write_up_show', true);
                } else {
                  this.$set(missions, 'write_up_show', false);
                }
                if (res.data.data.mission_mapping[missions.resource_id]) {
                  this.$set(
                    missions,
                    'complete_num_formatter',
                    res.data.data.mission_mapping[missions.resource_id]
                      .complete_num,
                  );
                } else {
                  this.$set(missions, 'complete_num_formatter', 0);
                }
                if (res.data.data.dynamic.includes(missions.resource_id)) {
                  this.$set(missions, 'mission_dynamic', true);
                } else {
                  this.$set(missions, 'mission_dynamic', false);
                }
                //  }
              });
            });
          });
          this.activeName = collapseList;
        });
      // }
    },
    // 清空
    empty() {
      this.$confirm(this.$t('common.confirmDelete') + '?')
        .then(() => {
          this.teamLists.forEach((row) => {
            row.row.forEach((task) => {
              task.task = [];
            });
          });
          this.messageDialog('success', this.$t('common.deleteSuccessful'));
        })
        .catch(() => {
          this.messageDialog('info', this.$t('common.canceledDeletion'));
        });
    },
    // 全选
    selectAll() {
      this.selectAlls = !this.selectAlls;
    },
    showDialog(a) {
      this.dialogUpdate = a;
    },
    // 删除
    deleteMuti(item, index) {
      this.status = true;
      const arr = this.teamLists.map((item, index) => {
        return {
          ...item,
          roles: item.roles.map((i) => {
            return {
              ...i,
              missions: i.missions.map((j) => {
                return {
                  ...j,
                  isSelected: false,
                };
              }),
            };
          }),
        };
      });
      this.teamLists = arr;
      this.selectDeleteIndex = index;
      this.isShowDetail = false;
      // this.isDelete = item.group_hash;
      //点击删除任务判断是否展示确定取消按钮
      this.isDelete = item.mission_number > 0 ? item.group_hash : 0;
      // this.cancelClick()
      this.currentIndex = [];
      this.currentDeleteIndex = index;
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

    // 添加任务
    addMission(item, index) {
      this.addMissionDialog();
      this.roleOptionList = [];
      _.forEach(item.roles, (role) => {
        this.roleOptionList.push({
          label: role.name,
          value: role.role_resource_id,
        });
      });
    },

    // 添加任务弹框
    addMissionDialog() {
      this.dialogAddMission = !this.dialogAddMission;
    },
    getMissionResponse(res) {
      this.missionRes = res.data.data;
      this.getData();
      // 失败保留添加任务弹窗,提高易用性
      if (this.missionRes) {
        this.messageDialog('success', this.$t('common.operateSuccess'));
      } else {
        this.addMissionDialog();
        this.$message.error(res.data.message);
      }
    },
    // 新增测试弹窗的验证
    getValidForm() {
      return this.$refs['createMission'].missionFormValid();
    },
    selectBox(index, rowIndex, taskIndex, task) {
      // 判断不能勾选是不是自己队伍数据
      if (index !== this.selectDeleteIndex && this.status) {
        return;
      }
      if (this.isDelete) {
        this.isShowDetail = false;
      } else {
        this.currentIndex = [index, rowIndex, taskIndex];
        this.isShowDetail = true;
      }
      if (this.isDelete) {
        this.teamLists[index].roles[rowIndex].missions[taskIndex].isSelected =
          !this.teamLists[index].roles[rowIndex].missions[taskIndex].isSelected;
      } else {
        // this.indexOnce = index
        // this.indexSecond = rowIndex
        // this.indexThird = taskIndex
        this.taskDetail = task;
        this.role = this.teamLists[index].roles[rowIndex].name;
        this.group = this.teamLists[index].group;
        this.levels = JSON.parse(task.skill_points);
        this.deliveryDetails = task.delivery_details;
        this.complete_num_formatter_value = task.complete_num_formatter;
        _.forEach(this.deliveryDetails, (i) => {
          if (i.role === this.teamLists[index].roles[rowIndex].role_hash) {
            i.roleName = this.teamLists[index].roles[rowIndex].name;
          }
        });
      }
    },
    // 确定删除
    sureDelete(index) {
      const arr = [];
      this.teamLists[index].roles.forEach((row, rowIndex) => {
        const missions = [];
        _.forEach(row.missions, (task) => {
          if (task.isSelected === true) {
            missions.push(task.resource_id);
          }
        });
        if (missions.length > 0) {
          arr.push({
            // group: this.teamLists[index].group,
            // groupHash: this.teamLists[index].group_hash,
            // role: row.name,
            role_resource_id: row.role_resource_id,
            missions: missions,
          });
        }
      });
      if (arr.length <= 0) {
        this.messageDialog('error', this.$t('m.pleaseSelectTaskWantDelete'));
      } else {
        this.$confirm(this.$t('common.confirmDelete') + '?')
          .then(() => {
            // 删除任务
            // const url = `/red_vs_blue/red_vs_blue_directors/${this.resource_id}/mission_delete/`;
            deleteMission(this.url, {
              mission_config: arr,
              room_id: this.resource_id,
            })
              .then((res) => {
                this.getData(this.selectDeleteIndex);
                this.messageDialog(
                  'success',
                  this.$t('common.deleteSuccessful'),
                );
              })
              .catch((res) => {
                this.error(res);
              });
          })
          .catch(() => {
            this.cancel(index);
          });
      }
    },
    // 取消多选删除
    cancel(index) {
      this.teamLists[index].roles.forEach((row, rowIndex) => {
        row.missions.forEach((task, taskIndex) => {
          if (task.isSelected) {
            task.isSelected = false;
          }
        });
      });
      this.isDelete = false;
      this.currentDeleteIndex = null;
      this.status = false;
    },
    error(res) {
      const datas = res.response.data;
      _.forEach(datas, (value, key) => {
        if (_.isArray(value)) {
          this.$message.error(value[0].message);
        } else {
          this.$message.error(value.message);
        }
      });
    },
    messageDialog(type, message) {
      this.$message({
        type: type,
        message: message,
      });
    },
    // 取消查看详情
    cancelDetail() {
      this.isShowDetail = false;
      this.currentIndex = null;
    },
  },
};
</script>

<style lang="scss" scoped>
.num-title {
  color: var(--font-color-secondary);
}
.disable-btn-color {
  cursor: not-allowed;
}
.echart {
  position: relative;
  .previous {
    position: absolute;
    left: 20px;
    bottom: 15px;
    cursor: pointer;
  }
  .next {
    position: absolute;
    right: 20px;
    bottom: 15px;
    cursor: pointer;
  }
}

$rightSpanColor: var(--neutral8);
$rightSpanSize: 14px;
#task-editor-new {
  height: 100%;
  clear: left;
  $fontcolor: var(--neutral8);
  $teamNameColor: var(--primary-color);
  color: $fontcolor;
  .selected {
    border-radius: 2px;
  }
  ::v-deep .el-scrollbar {
    width: 100%;
    height: 100%;
    ::v-deep .el-scrollbar__wrap {
      overflow-x: hidden;
    }
  }
  .font-style {
    font-size: 14px;
    font-weight: 600;
    margin: 0 5px;
  }
  .left-echarts {
    width: 23.15%;
    height: 100%;
    padding: 0 0 25px 0;
    box-sizing: border-box;
    border-right: 1px solid var(--neutral3);
    .echarts-common {
      width: 100%;
      height: 33%;
      box-sizing: border-box;
      padding: 30px 0 0 40px;
    }
    .echart {
      width: 100%;
      height: calc(100% - 25px);
    }
  }
  .widthChange {
    width: 76.39% !important;
  }
  .left {
    ::v-deep .el-scrollbar__wrap {
      overflow-x: hidden;
      .gt {
        color: var(--neutral8);
      }
    }
    width: calc(50.35% - 20px);
    height: 100%;
    box-sizing: border-box;
    border-radius: 2px;
    ::v-deep .el-scrollbar__view {
      height: 100%;
      padding: 0 40px;
    }
    .mission-dynamic {
      min-width: 64px;
      height: 22px;
      position: absolute;
      right: 0;
      top: 0;
      font-size: 12px;
      border-radius: 2px;
      font-weight: 400;
      line-height: 20px;
      padding: 0 2px;
      text-align: center;
      color: var(--orange-color);
      background: var(--orange-color-2);
      border: 1px solid var(--orange-color);
    }
    .book-img {
      width: 22px;
      height: 22px;
      vertical-align: middle;
    }
    .team {
      position: relative;
      border-radius: 2px;

      ::v-deep .el-collapse {
        border: none;
        ::v-deep .el-collapse-item__header,
        .el-collapse-item__wrap {
          background-color: transparent;
        }
      }
      ::v-deep .el-icon-arrow-right {
        color: var(--primary-color);
        position: absolute;
        margin: auto 5px;
        top: 32px;
        right: 0;
      }
      .btn {
        clear: both;
        text-align: center;
        padding-top: 20px;
        .elc-dialog-btn-ensure,
        .elc-dialog-btn-cancel {
          width: 168px !important;
        }
      }
      .team-name {
        vertical-align: middle;
        font-size: 14px;
        font-family: Microsoft YaHei;
        font-weight: 400;
      }
      .task-num,
      .row-num,
      .row-num,
      .people-num {
        margin: 0 9px;
        display: inline-block;
      }
      ::v-deep .el-collapse-item__content {
        padding-bottom: 0;
        .rows {
          padding: 10px 0;
          border-radius: 2px;
          overflow: hidden;
          .task-box {
            clear: both;
            display: flex;
            flex-direction: row;
            flex-wrap: wrap;
            justify-content: flex-start;
            .task-message {
              cursor: pointer;
              width: 220px;
              height: 122px;
              margin: 10px 8px 10px 8px;
              border: 1px solid transparent;
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
                  color: var(--neutral8);
                  .title-span {
                    font-size: 14px;
                    font-weight: 400;
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
                    margin-right: 5px;
                  }
                }
              }
              .task-foot {
                overflow: hidden;
                .foot-left {
                  float: left;
                  color: #8d94ae;
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
                  .one-img-div {
                    width: 10%;
                  }
                  .two-img-div {
                    width: 49.9%;
                  }
                  .img-div {
                    height: 38px;
                    line-height: 38px;
                    text-align: center;
                    position: relative;
                    display: flex;
                    align-items: center;
                  }
                  .icon-div {
                    display: flex;
                    align-items: center;
                  }
                }
                .foot-right-filter {
                  background: var(--neutral0);
                }
              }
            }
          }
          .row-name {
            .common-title {
              width: auto !important;
              float: left;
              height: auto;
              margin-top: -1px;
            }
            .name-div {
              font-size: 14px !important;
              margin-right: 20px;
            }
          }
        }
      }
      ::v-deep .el-collapse-item__wrap {
        border: none;
        background: transparent;
      }
      ::v-deep .el-collapse-item__header {
        position: relative;
        height: 80px;
        line-height: 80px;
        background: transparent;
      }
      .team-operate {
        cursor: pointer;
        position: absolute;
        right: 34px;
        top: 26px;
        i {
          margin: auto 6px;
        }
      }
    }
  }
  .right {
    ::v-deep .el-scrollbar__wrap {
      overflow-x: hidden;
    }
    position: relative;
    overflow: hidden;
    padding: 30px 0;
    width: 26.5%;
    box-sizing: border-box;
    height: 100%;
    margin-left: 20px;
    border-radius: 2px !important;
    ::v-deep .name-div {
      font-size: 14px !important;
    }
    .form-value {
      font-size: $rightSpanSize;
      font-weight: 400;
      color: $rightSpanColor;
    }

    .rightScrollbar {
      height: 100% !important;
      overflow-x: hidden;
      .el-scrollbar__wrap {
        overflow-x: hidden;
      }
      ::v-deep .el-scrollbar__view {
        height: 100%;
        padding: 0 40px;
      }
    }
    .task-detail {
      position: relative;
      h4 {
        color: #0096fe;
      }
      ::v-deep .el-form {
        ::v-deep .el-form-item {
          margin-bottom: 0;
        }
        ::v-deep .el-form-item__label {
          font-size: $rightSpanSize;
          font-weight: 400;
          line-height: 32px;
          padding-left: 20px;
        }

        ::v-deep .el-textarea__inner {
          background-color: transparent;
          border: none;
        }
        ::v-deep .el-form-item__content {
          white-space: nowrap;
          line-height: 32px;
        }
      }
      .skillchart {
        width: 100%;
        border-radius: 2px;
        margin-top: 10px;
        padding: 20px 0;
        box-sizing: border-box;
        border: 1px solid var(--border-color-secondary);
      }
    }
    .push-detail {
      min-height: 18%;
      padding-top: 6px;
      .common-title {
        width: 37%;
        float: left;
      }
      .el-scrollbar {
        height: 88%;
        .el-scrollbar__wrap {
          overflow-x: hidden;
        }
        .el-scrollbar__view {
          width: 97%;
        }
      }
      h4 {
        color: var(--primary-color);
        float: left;
      }
      .push-title {
        float: right;
        height: 25px;
        line-height: 25px;
      }
      .el-row {
        line-height: 40px;
        height: 40px;
        clear: both;
        &:nth-child(n) {
          background: var(--bg-color-3);
        }
        &:nth-child(2n) {
          background: transparent;
        }
      }
    }
  }
  // 右侧详情
  .detail-infos {
    width: 100%;
    height: 50px;
    margin-top: 20px;
    .left-div {
      width: 50%;
      padding-left: 20%;
      box-sizing: border-box;
    }
    .right-div {
      padding-left: 10% !important;
    }
    .common-div {
      width: 100%;
      clear: both;
      overflow: hidden;
      padding: 3px 0;
    }
    .width30 {
      width: 30%;
    }
    .width21 {
      width: 21%;
    }
    .width8 {
      width: 8%;
    }
    .width62 {
      width: 62%;
    }
    .width62 {
      width: 62%;
    }
  }
  $input-textarea-placeholder: var(--neutral8);
  $input-textarea: var(--neutral8);
  .update-dialog {
    .task-type-disabled {
      color: $input-textarea;
    }
    ::v-deep .el-form-item__label {
      width: 96px !important;
      color: $input-textarea-placeholder !important;
    }
    ::v-deep .el-form-item__content {
      margin-left: 111px !important;
    }
    ::v-deep .el-input__inner {
      color: $input-textarea;
      border-radius: 2px;
      border: none;
    }
    ::v-deep input::-webkit-input-placeholder,
    ::v-deep textarea::-webkit-input-placeholder {
      color: $input-textarea-placeholder;
    }
    ::v-deep input::-moz-input-placeholder,
    ::v-deep textarea::-moz-input-placeholder {
      color: $input-textarea-placeholder;
    }
    ::v-deep input::-ms-input-placeholder,
    ::v-deep textarea::-ms-input-placeholder {
      color: $input-textarea-placeholder;
    }
    ::v-deep .el-textarea__inner {
      border: 1px solid var(--neutral3) !important;
      color: $input-textarea;
      font-size: 14px;
    }

    .time-checkbox {
      .el-checkbox {
        color: var(--neutral8) !important;
      }
      .el-checkbox__label {
        font-size: 15px !important;
      }
    }
  }
  // 详情取消按钮
  .detail-delete {
    width: 20px;
    height: 20px;
    position: absolute;
    top: 28px;
    right: 36px;
  }
  ::v-deep .elc-dialog-btn-ensure,
  ::v-deep .elc-dialog-btn-cancel {
    width: 168px;
  }
}
</style>
<style lang="scss">
// 添加任务弹框
.add-task-dailog {
  .el-dialog {
    height: 87% !important;
    .el-scrollbar {
      height: 100%;
    }
  }
  .el-dialog__body {
    height: calc(100% - 186px) !important;
  }
  .el-form-item__label {
    text-align: right !important;
  }
}
// 弹窗
.dialog-exercise-book {
  ::v-deep .el-dialog__body {
    height: 500px;
    padding: 20px 30px !important;
  }
  ::v-deep .v-note-wrapper {
    height: 100% !important;
  }
  ::v-deep .divarea-wrapper {
    overflow-y: scroll !important;
  }
}
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
.practical-notes {
  height: 350px !important;
}
.practical-notes {
  .v-note-show {
    background: var(--cy16);
  }
}
.v-note-wrapper {
  box-shadow: none !important;
  z-index: 99;
  background-color: var(--cy16);
  border: 1px solid var(--cy16);
  .v-note-op {
    border-bottom: 1px solid var(--cy23-5) !important;
    background: var(--cy16) !important;
    .v-left-item,
    .v-right-item {
      .op-icon {
        color: var(--font-color-primary2);
        &:hover {
          background: var(--cy11-4) !important;
        }
      }
      .op-icon.fa-mavon-arrows-alt {
        display: none;
      }
      .op-icon.selected {
        background: var(--cy11-4) !important;
        color: var(--primary-color);
      }
      .op-icon.dropdown-wrapper.dropdown .popup-dropdown {
        background: var(--bg-color-2) !important;
        border-color: var(--bg-color-2) !important;
        .dropdown-item {
          color: var(--neutral8) !important;
          &:hover {
            background: var(--bg-color-3) !important;
            opacity: 0.4;
          }
        }
      }
    }
    .add-image-link-wrapper {
      background: var(--cy12-3);
      .add-image-link {
        background: var(--bg-color-2);
        i,
        .title {
          color: var(--neutral8);
        }
        .input-wrapper {
          background: var(--cy16);
          border-radius: 2px;
          border-color: var(--cy16);
          input {
            background: transparent;
            color: var(--neutral8);
          }
        }
        .op-btn.cancel {
          border: 1px solid var(--primary-color);
          color: var(--primary-color);
          border-radius: 2px;
        }
        .op-btn.sure {
          background: var(--primary-color);
          border-radius: 2px;
        }
      }
    }
  }
  .v-note-panel {
    .v-note-edit {
      .content-input-wrapper,
      .auto-textarea-wrapper,
      .auto-textarea-input {
        min-height: 100%;
        color: var(--neutral8);
      }
    }
    .v-note-show {
      .v-show-content,
      .v-show-content-html {
        color: var(--neutral8);
        border-radius: 2px;
      }
    }
    .single-show {
      .v-show-content-html {
        color: var(--neutral8);
      }
    }
  }
}
.markdown-body {
  p,
  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    color: var(--neutral8);
  }
  h2 {
    font-size: 16px;
    font-weight: bold;
  }
  h4 {
    font-size: 14px;
  }
  p {
    font-size: 14px;
  }
  table {
    tr,
    th,
    td {
      background: transparent;
      border-color: var(--neutral0);
      color: var(--neutral8);
    }
  }
}
</style>
