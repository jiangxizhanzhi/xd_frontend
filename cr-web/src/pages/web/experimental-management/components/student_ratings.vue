<template>
  <div id="studentRatings">
    <div class="student-new-layout">
      <div class="user-info">
        <img :src="userInfo.logo ? userInfo.logo : defaultLogo" />
        <div class="bg-purple-tow fr one-overflow">
          <span :title="userInfo.name">{{ userInfo.name }}</span>
          <br />
          <span :title="userInfo.role_name" class="role">
            {{ userInfo.role_name }}
          </span>
          <br />
          <span :title="userInfo.role_desc" class="desc">
            {{ userInfo.role_desc }}
          </span>
        </div>
      </div>
      <div class="student-select">
        <cb-select
          v-model="activeUser"
          :options="rolesList"
          @change="changeUser"
          class="user-select"
          titleField="name"
          valueField="resource_id"
          style="width: 100%"
        />
      </div>
    </div>
    <div v-if="rolesList.length" class="fl common-div left-div resource-list">
      <cb-scrollbar class="left-scrollbar-list">
        <!-- 训练统计 -->
        <title-director
          :square-color="'bg-color-sky-blue'"
          :name="$t('m.trainingStatistics')"
        />
        <div class="meber-echart">
          <train-echarts
            :id="'meber'"
            ref="trainEcharts"
            :init-data="opinionData"
            :lazy="true"
            :task-total="totalAssgin"
            :theme="theme"
            style="height: 130px"
          />
        </div>
        <title-director
          :square-color="'bg-color-sky-blue'"
          :name="$t('m.skillScore')"
        />
        <div class="echart skill-echart">
          <cb-echart-radar
            v-if="pieLabelArr.length > 0 && ready"
            ref="rader"
            radarShape="sharp"
            :indicator="pieLabelArr"
            :radarData="radarData"
            :radarRadius="radarRadius"
            :axisName="axisName"
          ></cb-echart-radar>
        </div>
        <title-director
          :square-color="'bg-color-sky-blue'"
          :name="$t('m.dynamicEvent')"
        />
        <div
          style="min-height: 160px"
          class="bgd font-title border-content event-content"
        >
          <div
            class="event-content-mission"
            v-for="(statu, i) in dynamicData"
            :key="i"
            :title="statu.mission_name"
          >
            <div class="event-content-task">
              <span
                style="margin: 0 5px 0 0"
                :class="[
                  'action-type',
                  statu.action_type === 4 ? 'white-color' : '',
                  statu.action_type === 1 ? 'cy-color' : '',
                  statu.action_type === 8 ? 'red-color' : '',
                  statu.action_type === 9 ? 'yellow-color' : '',
                  statu.action_type === 7 ? 'green-color' : '',
                ]"
                >[{{ statu.action_type_name }}]</span
              >
              <span class="task white-color">{{ statu.mission_name }}</span>
            </div>
            <div class="event-content-time">
              {{ statu.action_time && statu.action_time.slice(5) }}
            </div>
          </div>
        </div>
      </cb-scrollbar>
    </div>
    <div v-if="rolesList.length" class="fl common-div right-div">
      <cb-scrollbar class="right-scrollbar-list">
        <div class="grid-content">
          <!-- 标题 综合评价 -->
          <div style="display: flex; height: 25px">
            <title-director
              :square-color="'bg-color-sky-blue'"
              :name="$t('m.overview')"
            />
            <cb-button
              @click="userRecord"
              type="text"
              hollow
              icon="icon-jianda"
              class="train-record-btn"
            >
              {{ $t('m.trainrecord') }}
            </cb-button>
          </div>
          <div
            class="number border-content"
            style="height: 150px; line-height: 122px"
          >
            <span>{{ userCount }}</span>
            <i v-if="userCount > 1">{{ $t('m.grade') }}</i>
            <i v-else>{{ $t('m.gradeSingular') }}</i>
          </div>
          <!-- 标题 训练得分-->
          <div style="display: flex">
            <title-director
              :square-color="'bg-color-sky-blue'"
              :name="$t('m.trainscore')"
            />
            <!-- 下拉框 -->
            <cb-select
              v-model="value"
              :options="options"
              @change="selectChange"
              class="cursor common-select fr mr11"
            />
          </div>
          <div class="myecharts border-content">
            <!-- 客观题 图表 -->
            <div class="fl" style="width: 50%; height: 98%">
              <OneEcharts
                :id="'leftStudent'"
                :init-data="opinionData1"
                :lazy="true"
                :allColor="[$themed('green-color'), $themed('blue-color')]"
                :theme="theme"
              />
            </div>
            <!-- 主观题 图表-->
            <div class="fl" style="width: 50%; height: 98%">
              <OneEcharts
                :id="'rightStudent'"
                :init-data="opinionData2"
                :lazy="true"
                :allColor="[$themed('green-color'), $themed('blue-color')]"
                :theme="theme"
              />
            </div>
          </div>
          <!-- 标题 能力评分 -->
          <title-director
            :square-color="'bg-color-sky-blue'"
            :name="$t('m.abilityscore')"
          />
          <cb-select
            v-model="value"
            :options="options1"
            @change="selectChange"
            class="cursor common-select fr mr11 selsct_tow"
          />
          <!-- 评星模块 -->
          <cb-form ref="form" label-width="80px" style="padding: 0">
            <div class="competence border-content" style="padding: 8px 0">
              <div class="rate-item" style="margin-top: 16px">
                <div
                  class="tt one-overflow"
                  :class="getI18Nn().locale == 'en-US' ? 'tt-en' : ''"
                  :title="$t('m.competence')"
                >
                  {{ $t('m.competence') }}
                </div>
                <div class="star star-width">
                  <cb-rate
                    v-model="rateList[0]"
                    class="elc-rate"
                    :max="5"
                    @change="rateDbclick(0)"
                  />
                </div>
              </div>
              <div class="rate-item">
                <div
                  class="tt one-overflow"
                  :class="getI18Nn().locale == 'en-US' ? 'tt-en' : ''"
                  :title="$t('m.teamcooperation')"
                >
                  {{ $t('m.teamcooperation') }}
                </div>
                <div class="star star-width">
                  <cb-rate
                    v-model="rateList[1]"
                    class="elc-rate"
                    :max="5"
                    @change="rateDbclick(1)"
                  />
                </div>
              </div>
              <div class="rate-item">
                <div
                  class="tt one-overflow"
                  :class="getI18Nn().locale == 'en-US' ? 'tt-en' : ''"
                  :title="$t('m.executivepower')"
                >
                  {{ $t('m.executivepower') }}
                </div>
                <div class="star star-width">
                  <cb-rate
                    v-model="rateList[2]"
                    class="elc-rate"
                    :max="5"
                    @change="rateDbclick(2)"
                  />
                </div>
              </div>
              <div class="rate-item">
                <div
                  class="tt one-overflow"
                  :class="getI18Nn().locale == 'en-US' ? 'tt-en' : ''"
                  :title="$t('m.leadership')"
                >
                  {{ $t('m.leadership') }}
                </div>
                <div class="star star-width">
                  <cb-rate
                    v-model="rateList[3]"
                    class="elc-rate"
                    :max="5"
                    @change="rateDbclick(3)"
                  />
                </div>
              </div>
              <div class="rate-item">
                <div
                  class="tt one-overflow"
                  :class="getI18Nn().locale == 'en-US' ? 'tt-en' : ''"
                  :title="$t('m.overview')"
                >
                  {{ $t('m.overview') }}
                </div>
                <div class="star star-width">
                  <cb-rate
                    v-model="rateList[4]"
                    class="elc-rate"
                    :max="5"
                    @change="rateDbclick(4)"
                  />
                </div>
              </div>
              <div class="rate-item">
                <div class="star">
                  <cb-input
                    v-model="textarea"
                    :placeholder="$t('m.PleaseEnterComment')"
                    type="textarea"
                    :rows="2"
                  />
                </div>
              </div>
            </div>
            <cb-button @click="submitForm()" hollow class="bottom-btn">
              {{ $t('m.submission') }}
            </cb-button>
          </cb-form>
        </div>
      </cb-scrollbar>
    </div>
    <!-- 训练记录 弹框 -->
    <cb-dialog
      :visible.sync="showTrainRecord"
      width="66%"
      class="task-answer-dialog"
      :append-to-body="true"
      center
    >
      <div slot="title" class="header-title">
        <span class="title-name">{{ $t('m.trainRecord') }}</span>
      </div>
      <train-record :task-lists="taskLists" style="height: 500px" />
    </cb-dialog>
  </div>
</template>
<script>
import _ from 'lodash';
import defaultLogo from '@/assets/img/userhead.png';
import OneEcharts from '@/pages/web/team-train/components/one_echart.vue';
import TrainRecord from '@/pages/web/team-train/components/train_record.vue';
import TitleDirector from '@/pages/web/RedVsBlue/Director/components/title.vue';
import TrainEcharts from '@/pages/web/team-train/components/echart.vue';
import { mapGetters } from 'vuex';
import { getValueName } from '@/assets/js/tools.js';
import { getRadarLabels } from '@/api/common';
import validateUtils from '@/utils/validate';
import { cutStr } from '@/utils/index.js';
import { getI18N } from '@cyber/helper';

export default {
  components: {
    OneEcharts,
    TrainRecord,
    TitleDirector,
    TrainEcharts,
  },
  props: {
    rolesList: {
      type: Array,
      default: () => {
        return [];
      },
    },
  },
  data() {
    return {
      ready: true,
      pieLabelArr: [],
      pieLabelData: [],
      load: false,
      indicator: [],
      radarRadius: ['0%', '60%'],
      radarShape: 'sharp',
      radarData: [],
      listen: new this.$ListenDomChange({
        dom: document.body,
        callback: this.listenFunc,
      }),
      theme: '',
      defaultLogo: defaultLogo,
      userCount: '56',
      textarea: '',
      rateList: [0, 0, 0, 0, 0],
      rateOldList: [0, 0, 0, 0, 0],
      showTrainRecord: false,
      activeindex: 0,
      userInfo: {},
      opinionData1: {
        name: this.$t('m.objectiveQuestion'),
        list: [
          { value: '', name: this.$t('m.goal') },
          { value: '', name: this.$t('m.totalScore') },
        ],
      },
      opinionData2: {
        name: this.$t('m.subjectiveQuestions'),
        list: [
          { value: '', name: this.$t('m.goal') },
          { value: '', name: this.$t('m.totalScore') },
        ],
      },
      options: [
        // 训练比例
        {
          value: '1',
          label: '10%',
        },
        {
          value: '2',
          label: '20%',
        },
        {
          value: '3',
          label: '30%',
        },
        {
          value: '4',
          label: '40%',
        },
        {
          value: '5',
          label: '50%',
        },
        {
          value: '6',
          label: '60%',
        },
        {
          value: '7',
          label: '70%',
        },
        {
          value: '8',
          label: '80%',
        },
        {
          value: '9',
          label: '90%',
        },
      ],
      options1: [
        // 能力评分比例
        {
          value: '1',
          label: '90%',
        },
        {
          value: '2',
          label: '80%',
        },
        {
          value: '3',
          label: '70%',
        },
        {
          value: '4',
          label: '60%',
        },
        {
          value: '5',
          label: '50%',
        },
        {
          value: '6',
          label: '40%',
        },
        {
          value: '7',
          label: '30%',
        },
        {
          value: '8',
          label: '20%',
        },
        {
          value: '9',
          label: '10%',
        },
      ],
      value: '3',
      taskLists: [],
      resource_id: '',
      trainScore: {},
      activeUser: '',
      opinionData: [],
      totalAssgin: 0,
      dynamicData: [],
    };
  },
  computed: {
    ...mapGetters(['language']),
    axisName() {
      return {
        fontSize: 12,
        formatter: (text) => {
          let strlength = validateUtils.validateLength(text);
          let maxlength = 14;
          if (strlength > maxlength) {
            text = cutStr(text, maxlength) + '...';
          }
          return text;
          // 两行显示
          /* let newParamsName = '',
            paramsNameNumber = params.length, // name长度
            provideNumber = 10; // 每行能显示的字的个数
          if (paramsNameNumber > provideNumber) {
            for (let p = 0; p < 2; p++) {
              let tempStr = '',
                start = p * provideNumber,
                end = start + provideNumber;
              if (p === 1) {
                tempStr = params.substring(start, end) + '...';
              } else {
                tempStr = params.substring(start, end) + '\n';
              }
              newParamsName += tempStr;
            }
          } else {
            newParamsName = params;
          }
          return newParamsName; */
        },
      };
    },
  },
  watch: {
    rateList: {
      handler: function (val, oldval) {
        this.scoreCalculation();
      },
      immediate: true, // 关键
      deep: true,
    },
    rolesList: {
      handler: function (val, oldval) {
        if (val !== oldval) {
          if (val.length) {
            this.activeUser = val[0].resource_id || '';
            this.userInfo = val[0] || {};
            this.initUsereData();
            this.getUserMissionDynamic(val[0].resource_id);
            this.getPersonRadar(val[0].resource_id);
          }
        }
      },
      immediate: true, // 关键
      deep: true,
    },
    language: {
      deep: true,
      handler(val) {
        this.initUsereData();
      },
    },
  },
  created() {
    this.resource_id = this.$route.params && this.$route.params.resource_id;
  },
  mounted() {
    this.resource_id = this.$route.params && this.$route.params.resource_id;
    this.listen.createListen();
    this.getRadarLabelsList();
  },
  beforeDestroy() {
    this.listen.destroyListen();
  },
  methods: {
    getI18Nn() {
      return getI18N();
    },
    // 监听换肤，动态reload echarts
    listenFunc() {
      const className = document.body.className.split(' ');
      if (className.indexOf('theme-dark') != -1) {
        this.theme = 'dark';
      } else {
        this.theme = 'light';
      }
      this.ready = false;
      if (this.pieLabelArr.length) {
        this.pieLabelArr[0].axisLabel.color = this.$themed('neutral5');
      }
      this.$nextTick(() => {
        this.ready = true;
      });
    },
    rateDbclick(i) {
      if (this.rateOldList[i] === this.rateList[i]) {
        this.rateList[i] = 0;
        this.scoreCalculation();
        this.rateOldList[i] = this.rateList[i];
      } else {
        this.rateOldList[i] = this.rateList[i];
      }
    },
    // 获取技能标签
    getRadarLabelsList() {
      getRadarLabels().then((res) => {
        const data = _.get(res, 'data.data.labels');
        this.pieArrs = data;
        const arrs = [];
        _.forEach(data, (item, index) => {
          if (index === 0) {
            arrs.push({
              name: item,
              max: 100,
              axisLabel: {
                align: 'center',
                verticalAlign: 'top',
                show: true,
                fontSize: 10,
                color: this.$themed('neutral5'),
                showMaxLabel: true, //不显示最大值，即外圈不显示数字30
                showMinLabel: true, //显示最小数字，即中心点显示0
              },
            });
          } else {
            arrs.push({
              name: item,
              max: 100,
            });
          }
        });
        this.pieLabelArr = arrs;
      });
    },
    // 获取个人技能图
    getPersonRadar(id) {
      this.$request
        .get(
          '/cr/admin/mission/missions/radar',
          {
            resource_id: this.$route.params.resource_id,
            user_hash: id,
          },
          { baseURL: '/api/ojj' },
        )
        .then((res) => {
          this.radarData = _.get(res, 'data.data', []);
        });
    },
    // [前台]教员-获,取学员任务统计与动态事件信息
    getUserMissionDynamic(id) {
      this.$request
        .get(
          '/cr/training_team/training_team/get_user_mission_dynamic',
          {
            resource_id: this.$route.params.resource_id,
            student_id: id,
          },
          {
            baseURL: '/api/ojj',
          },
        )

        .then((res) => {
          // this.opinionData = res.data.statistical_info;
          this.opinionData =
            _.get(res, 'data.data.statistical_info', []) == null
              ? []
              : _.get(res, 'data.data.statistical_info', []);
          // 动态事件类型:
          // 1、下发
          // 2、上报
          // 3、成功
          // 4、失败
          // 5、驳回
          // this.dynamicData = res.data.data.dynamic_data;
          this.dynamicData = _.get(res, 'data.data.dynamic_data', []);
          this.dynamicData.forEach((item) => {
            item.action_type_name = getValueName(
              this.$CONSTANT.Action.ActionType,
              //  item.action_type,
              parseInt(item.action_type),
            );
          });
          let total = 0;
          // statistical_state 0 已完成 1 进行中 2 未开始
          this.opinionData.forEach((item) => {
            if (item.statistical_state === 0) {
              // this.finishedAssgin = item.value
            }
            this.$set(
              item,
              'name',
              getValueName(
                this.$CONSTANT.Statistical.StatisticalState,
                // item.statistical_state,
                parseInt(item.statistical_state),
              ),
            );
            total += item.value;
          });
          this.totalAssgin = total;
        });
    },
    // 点击训练记录
    userRecord() {
      this.showTrainRecord = true;
      this.initRecordData();
    },
    // 获取人员训练记录
    initRecordData() {
      this.$request
        .get(
          '/cr/training_team/training_team/get_training_record',
          {
            resource_id: this.$route.params.resource_id,
            user_hash: this.activeUser,
          },
          {
            baseURL: '/api/ojj',
          },
        )

        .then((res) => {
          _.forEach(res.data.data, (item) => {
            this.$set(item, 'level', 1);
            this.$set(item, 'name', item.stage);
            this.$set(item, 'children', item.missions);
            _.forEach(item.children, (list) => {
              this.$set(list, 'name', list.title);
              this.$set(list, 'level', 2);
              this.$set(list, 'state', 1);
            });
          });
          this.taskLists = res.data.data;
        });
    },
    // 获取学员评分
    initUsereData() {
      this.$request
        .get(
          '/cr/training_team/training_team/student_score',
          {
            resource_id: this.$route.params.resource_id,
            user_hash: this.activeUser,
          },
          {
            baseURL: '/api/ojj',
          },
        )

        .then((res) => {
          const dataBakup = _.cloneDeep(res.data.data);
          this.textarea = dataBakup.comment;
          this.trainScore = dataBakup.training_score;
          this.opinionData1.list[0].value =
            dataBakup.training_score.get_score_objective; // 客观题得分
          this.opinionData1.list[1].value =
            dataBakup.training_score.sum_score_objective; // 客观题总分
          this.opinionData2.list[0].value =
            dataBakup.training_score.get_score_subjective; // 主观题得分
          this.opinionData2.list[1].value =
            dataBakup.training_score.sum_score_subjective; // 主观题总分
          if (res.data.data.final_score) {
            this.userCount = dataBakup.final_score;
            this.rateList = dataBakup.ability_score;
            // 训练分占比
            this.value = this.options.find(
              (ele) => ele.label === dataBakup.training_percentage,
            ).value;
          } else {
            this.rateList = [0, 0, 0, 0, 0];
            this.initRecordData();
          }
        });
    },
    selectChange() {
      this.scoreCalculation();
    },
    // 计算分数
    scoreCalculation() {
      // 训练占比
      const trainPercentage = parseInt(
        this.options.find((ele) => ele.value === this.value).label,
      );
      // 能力占比
      const abilityPercentage = parseInt(
        this.options1.find((ele) => ele.value === this.value).label,
      );
      // get_score_objective// 客观题得分
      // get_score_subjective// 主观题得分
      const objective = this.trainScore.get_score_objective;
      const sumObjective = this.trainScore.sum_score_objective;
      const subjective = this.trainScore.get_score_subjective;
      const sumSubjective = this.trainScore.sum_score_subjective;
      let rateTotal = null;
      _.forEach(this.rateList, (item) => {
        rateTotal += item;
      });
      let lastScore;
      if (!sumObjective && sumSubjective) {
        lastScore =
          (subjective * 100 * trainPercentage * 0.01) / sumSubjective +
          4 * rateTotal * abilityPercentage * 0.01;
      } else if (sumObjective && !sumSubjective) {
        lastScore =
          (objective * 100 * trainPercentage * 0.01) / sumObjective +
          4 * rateTotal * abilityPercentage * 0.01;
      } else if (!sumObjective && !sumSubjective) {
        lastScore = 4 * rateTotal * abilityPercentage * 0.01;
      } else {
        lastScore =
          ((objective + subjective) * 100 * trainPercentage * 0.01) /
            (sumObjective + sumSubjective) +
          4 * rateTotal * abilityPercentage * 0.01;
      }
      this.userCount = parseInt(lastScore);
    },
    changeUser(val) {
      // this.activeindex = index
      this.userInfo = _.find(
        this.rolesList,
        (user) => user.resource_id === val,
      );
      this.$emit(
        'sendStudentId',
        _.find(this.rolesList, (user) => user.resource_id === val).id,
      );
      this.initUsereData();
      this.getUserMissionDynamic(val);
      this.getPersonRadar(val);
    },
    submitForm() {
      const params = {};
      params.user = this.activeUser;
      params.training_percentage = this.options.find(
        (ele) => ele.value === this.value,
      ).label; // 训练得分所占比例
      params.ability_percentage = this.options1.find(
        (ele) => ele.value === this.value,
      ).label; // 能力得分比例
      params.ability_score = JSON.stringify(this.rateList);
      params.comment = this.textarea;
      params.final_score = this.userCount;
      // params.training_team = this.resource_id;
      params.room_id = this.resource_id;

      this.$request
        .post('cr/training_team/training_team/student_score', params, {
          baseURL: '/api/ojj',
        })
        .then(() => {
          this.$message.success(this.$t('m.submitSuccess'));
        })
        .catch((error) => {
          // errorMessage(error, this);
        });
    },
  },
};
</script>

<style lang="scss" scoped>
#studentRatings {
  height: 100%;
  width: 100%;
  box-sizing: border-box;
  .student-new-layout {
    display: flex;
    justify-content: space-between;
    margin-bottom: 24px;
    height: 46px;
    .user-info {
      // width: 100%;
      width: 250px;
      img {
        display: inline-block;
        width: 48px;
        height: 48px;
        position: relative;
        top: -6px;
      }
    }
    .student-select {
      width: 200px;
      // width: 60%;
      .user-select {
        width: 100%;
        // margin-left: 8px;
        ::v-deep .el-input__inner {
          width: 100% !important;
          height: 36px !important;
          margin-top: 0 !important;
        }
        ::v-deep .el-select {
          width: 100% !important;
          ::v-deep .el-input__inner {
            height: 36px !important;
          }
        }
      }
    }
  }
  .left-scrollbar-list,
  .right-scrollbar-list {
    ::v-deep .is-horizontal {
      ::v-deep .el-scrollbar__thumb {
        width: 0 !important;
      }
    }
  }
  .echart {
    height: 200px;
  }
  .common-div {
    width: 50%;
    height: calc(100% - 90px);
    box-sizing: border-box;
  }
  .train-record-btn {
    position: relative;
    top: -6px;
    right: 2px;
  }
  .mr24 {
    margin-right: 24px;
  }
  .mr11 {
    margin-right: 11px;
  }
  .mr22 {
    margin-right: 22px;
  }
  .left-div {
    .font-title {
      width: 98%;
      font-size: 14px;
      /* line-height: 32px;
      padding-left: 24px; */
    }
  }
  ::v-deep .el-row {
    margin: 15px 0 6px 0;
    height: 100%;
    .el-col-12 {
      width: 59%;
      height: calc(100% - 25px);
      .el-scrollbar {
        height: calc(100% - 25px);
      }
      .el-scrollbar__bar.is-horizontal {
        height: 0 !important;
      }
      .el-scrollbar__wrap {
        overflow-x: hidden;
      }
      .el-scrollbar__view {
        height: calc(100% - 25px);
      }
    }
    .el-col-10 {
      width: 39% !important;
      height: 100%;
      .el-scrollbar {
        height: 100%;
      }
      .el-scrollbar__wrap {
        overflow-x: hidden;
      }
      .el-scrollbar__view {
        height: 100%;
      }
    }
    .el-col-1 {
      width: 1px !important;
    }
  }
  .left {
    width: 100%;
    overflow: hidden;
    margin: 0 0 8px;
  }

  .changeColor {
    float: left;
    width: 100%;
    height: 100%;
    transition: all 0.5s ease-in 0.5ms;
    background-color: rgba(46, 84, 197, 0.36);
    opacity: 1;
  }
  .myecharts {
    height: 200px;
  }
  .task-set {
    width: 100%;
    border-bottom: 1px dashed rgba(172, 182, 219, 0.16);
    clear: left;
    padding: 8px 10px 0;
  }
  .bg-purple-one {
    width: 25%;
    height: 100%;

    img {
      width: 42px;
      height: 42px;
      border-radius: 50%;
      margin: 10px 8px 0 8px;
      background-color: #fff;
    }
  }
  .bg-purple-tow {
    width: calc(100% - 56px);
    height: 100%;
    line-height: 25px;
    font-size: 14px;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
    span:nth-child(1) {
      font-weight: 400;
    }
  }
  ::v-deep .common-title {
    margin-left: 8px;
    .name-div {
      font-size: 14px;
    }
  }

  .grid-content {
    position: relative;
    padding-left: 10px;
    height: 100%;
    box-sizing: border-box;
    .btn {
      position: absolute;
      top: 0;
      right: 14px;
    }
    ::v-deep .cb-select {
      width: 77px !important;
      position: absolute;
      top: 210px;
      right: 0;
      margin-right: 0;
    }
    ::v-deep .selsct_tow {
      position: absolute;
      top: 470px;
      right: 0;
    }
  }
  ::v-deep .el-form {
    padding: 0 !important;
  }
  ::v-deep .el-form-item {
    height: 20px;
    margin: 5px 0 !important;
    ::v-deep .el-form-item__label {
      width: 42% !important;
      padding-top: 3px;
    }
    ::v-deep.el-form-item__content {
      width: 64% !important;
      height: 20%;
    }
    ::v-deep .el-rate {
      line-height: 3;
    }
  }

  .competence {
    margin-top: 19px;
    width: 100%;
    .rate-item {
      clear: both;
      overflow: hidden;
      // width: calc(100% - 12px);
      margin-right: 16px;
    }
    ::v-deep .el-rate {
      display: flex;
      flex-direction: row;
      // justify-content: space-around;
    }
    .tt {
      width: 80px;
      float: left;
      text-align: right;
      // margin-right: 14px;
      margin-right: 8px;
      font-size: 14px;
      white-space: nowrap;
      // text-align-last: justify;
      text-align: justify;
      // margin-left: 26px;
      margin-left: 16px;
    }
    .tt-en {
      float: left;
      text-align: right;
      margin-right: 8px;
      font-size: 14px;
      white-space: nowrap;
      text-align-last: justify;
      text-align: justify;
      margin-left: 16px;
      width: 53% !important;
    }
    .tf {
      margin-top: 5px;
    }
    ::v-deep.el-textarea {
      margin: 5px 0 0 16px;
    }
    .star-width {
      width: 49% !important;
    }
    .star {
      // width: calc(100% - 28px - 84px);
      width: 322px;
      // float: left;
      margin: 0 0 4px 0;
      ::v-deep.el-rate__icon {
        margin-right: 4px !important;
      }
    }
  }

  .title-name {
    .linear {
      width: 3px;
      height: 16px;
      border-radius: 2px;
    }
    span {
      padding-left: 15px;
      font-size: 16px;
      line-height: 16px;
      display: block;
    }
  }
  .btn_start {
    min-width: 80px;
    height: 24px;
    line-height: 23px;
    box-sizing: border-box;
    padding: 1px;
    border-radius: 15px;
  }
  .btn_radius {
    width: calc(100% - 18px);
    padding: 0 9px;
    height: 100%;
    border-radius: 15px;
    text-align: center;
    vertical-align: middle;
    font-size: 12px;
    font-family: Microsoft YaHei;
    span {
      vertical-align: middle;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
  }

  .line {
    width: 1px;
    height: 667px;
    background: rgba(64, 87, 167, 1);
    opacity: 0.76;
    margin-left: 4px;
  }
  .number {
    width: 100%;
    height: 60px;
    text-align: center;
    span,
    i {
      font-size: 46px;
      font-family: PingFang SC;
      font-weight: 400;
    }
    i {
      margin-left: 5px;
      font-size: 16px;
      font-weight: 300;
    }
  }
  ::v-deep.el-input--suffix .el-input__inner {
    width: 77px !important;
    height: 30px !important;
    margin-right: 2px !important;
  }
  .echartEvent {
    width: 100%;
    height: 150px;
    margin-bottom: 70px;
  }
  .bottom-btn {
    position: relative;
    top: 15px;
    left: 50%;
    transform: translateX(-50%);
  }
  ::v-deep .elc-btn-gradient {
    min-width: 110px;
    height: 40px;
    border-radius: 20px;
    line-height: 40px;
    .elc-btn-gradient-inner {
      border-radius: 20px;
      span {
        font-size: 12px;
      }
    }
  }
  .common-select {
    ::v-deep .el-input__inner {
      border-color: transparent !important;
    }
    ::v-deep .el-input__icon {
      line-height: 30px !important;
    }
  }
}
.event-content-task {
  word-break: break-all;
}
.task-answer-dialog {
  margin: 0 auto 0;
  ::v-deep .cb-dialog-body {
    height: 500px !important;
    padding: 0 20px 15px 5px !important;
    box-sizing: border-box;
    border-bottom: 0 !important;
  }
}
.event-content {
  padding: 16px;
  margin-bottom: 16px;
  &-mission {
    margin-bottom: 16px;
  }
  &-task {
    font-size: 14px;
    line-height: 22px;
    margin-bottom: 4px;
  }
  &-time {
    font-size: 12px;
    line-height: 20px;
  }
}
</style>
<style lang="scss">
.cb-tabs .el-tabs--border-card .el-tabs__content {
  background: transparent;
}
.el-tabs--border-card > .el-tabs__content {
  padding: 0;
}
.meber-echart,
.skill-echart,
.border-content {
  margin-bottom: 20px;
  margin-top: 10px;
  padding: 10px;
  background: var(--bg-color-4);
}
</style>
