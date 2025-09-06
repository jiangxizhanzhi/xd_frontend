<template>
  <div class="single-person">
    <div class="top-person">
      <div>
        <img :src="currentPersonInfo.logo || defaultLogo" />
        <span>{{ currentPersonInfo.rep_name }}</span>
      </div>
      <cb-select
        v-model="currentPerson"
        :options="userList"
        titleField="rep_name"
        valueField="resource_id"
      ></cb-select>
    </div>
    <div class="bottom-box">
      <div class="left-box cyber-scroll-bar">
        <div class="train-statics">
          <title-name :name="$t('m.trainingStatistics')" />
          <div class="com-box height-167">
            <train-echarts
              v-if="opinionData.length"
              :id="'meber'"
              ref="trainEcharts"
              :init-data="opinionData"
              :lazy="true"
              :task-total="totalAssgin"
              :theme="theme"
            />
          </div>
        </div>
        <div class="skill-box mt8">
          <title-name :name="$t('m.skillScore')" />
          <div class="com-box height-254">
            <cb-echart-radar
              v-if="pieLabelArr.length > 0 && ready"
              ref="rader"
              radarShape="sharp"
              :indicator="pieLabelArr"
              :radarData="levelData"
              :radarRadius="radarRadius"
              :axisName="axisName"
              class="chart-style"
            ></cb-echart-radar>
          </div>
        </div>
        <div class="dynamic-events mt8">
          <title-name :name="$t('m.dynamicEvent')" />
          <div class="com-box min-height-144">
            <template v-if="dynamicData.length > 0">
              <div
                v-for="(statu, i) in dynamicData"
                :key="i"
                class="bgd font-title"
                :title="statu.mission_name"
              >
                <div class="one-overflow" style="width: 98%">
                  <span class="white-color">
                    [{{ statu.action_time && statu.action_time.slice(5) }}]
                  </span>
                  <span
                    style="margin: 0 5px"
                    :class="[
                      statu.action_type === 2 ? 'white-color' : '',
                      statu.action_type === 1 ? 'cy-color' : '',
                      statu.action_type === 4 ? 'red-color' : '',
                      statu.action_type === 5 ? 'yellow-color' : '',
                      statu.action_type === 3 ? 'green-color' : '',
                    ]"
                    >[{{ statu.action_type_name }}]</span
                  >
                  <span class="white-color">{{ statu.mission_name }}</span>
                </div>
              </div>
            </template>
            <empty-page v-else class="height-144" />
          </div>
        </div>
      </div>
      <div class="right-box cyber-scroll-bar">
        <div class="comprehensive-assessment">
          <title-name :name="$t('m.overview')" />
          <div class="com-box height-167 assessment-box">
            <div class="baseline">
              <span class="number">{{ userCount }}</span>
              <span class="unit">{{ $t('m.grade') }}</span>
            </div>
          </div>
        </div>
        <div class="train-score mt8">
          <title-name :name="$t('m.trainscore')" />
          <cb-select
            v-model="value"
            :options="options"
            @change="selectChange"
            class="train-score-select common-select fr mr11"
          />
          <div class="com-box height-254">
            <!-- 客观题 图表 -->
            <div class="fl" style="width: 50%; height: 100%">
              <OneEcharts
                :id="'leftStudent'"
                :init-data="opinionData1"
                :lazy="true"
                :allColor="[$themed('green-color'), $themed('blue-color')]"
                :theme="theme"
                class="chart-style"
              />
            </div>
            <!-- 主观题 图表-->
            <div class="fl" style="width: 50%; height: 100%">
              <OneEcharts
                :id="'rightStudent'"
                :init-data="opinionData2"
                :lazy="true"
                :allColor="[$themed('green-color'), $themed('blue-color')]"
                :theme="theme"
              />
            </div>
          </div>
        </div>
        <div class="ability-score mt8">
          <title-name :name="$t('m.abilityscore')" />
          <cb-select
            v-model="value"
            :options="options1"
            @change="selectChange"
            class="ability-score-select common-select fr mr11"
          />
          <div class="com-box height-230">
            <!-- 评星模块 -->
            <cb-form ref="form" label-width="80px">
              <div class="competence">
                <div class="rate-item">
                  <div
                    class="one-overflow"
                    :class="getI18Nn().locale === 'en-US' ? 'tt-en' : 'tt'"
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
                    :class="getI18Nn().locale === 'en-US' ? 'tt-en' : 'tt'"
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
                    :class="getI18Nn().locale === 'en-US' ? 'tt-en' : 'tt'"
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
                    :class="getI18Nn().locale === 'en-US' ? 'tt-en' : 'tt'"
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
                    :class="getI18Nn().locale === 'en-US' ? 'tt-en' : 'tt'"
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
                  <div
                    class="tt tf one-overflow"
                    :class="getI18Nn().locale === 'en-US' ? 'tt-en' : 'tt'"
                    :title="$t('m.remark')"
                  >
                    {{ $t('m.remark') }}
                  </div>
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
            </cb-form>
          </div>
        </div>
        <div class="btn-box">
          <cb-button @click="submitScore()" style="margin-top: 16px">
            {{ $t('m.submission') }}
          </cb-button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import TitleName from './TitleName';
import emptyPage from '@/pages/web/Empty';
import defaultLogo from '@/assets/img/userhead.png';
import TrainEcharts from '@/pages/web/team-train/components/echart.vue';
import OneEcharts from '@/pages/web/team-train/components/one_echart.vue';
import SkillScoreSpecial from '@/components/TaskEditor/skill-score-special.vue';
import { getRadarLabels } from '@/api/common.js';
import { getValueName } from '@/assets/js/tools.js';
import validateUtils from '@/utils/validate';
import { cutStr } from '@/utils/index.js';
import { getLanguage } from '@cyber/helper';
import { getI18N } from '@cyber/helper';
export default {
  components: {
    TitleName,
    emptyPage,
    TrainEcharts,
    OneEcharts,
    SkillScoreSpecial,
  },
  props: {
    userList: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      language: getLanguage(),
      radarRadius: ['0%', '60%'],
      pieLabelArr: [],
      ready: true,
      listen: new this.$ListenDomChange({
        dom: document.body,
        callback: this.listenFunc,
      }),
      theme: '',
      defaultLogo,
      currentPerson: '',
      currentPersonInfo: {},
      dynamicData: [], // 动态事件
      opinionData: [
        // // 训练统计
        // { statistical_state: 0, value: 0, name: '已完成' },
        // { statistical_state: 1, value: 0, name: '进行中' },
        // { statistical_state: 2, value: 0, name: '未下发' },
      ],
      totalAssgin: 0,
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
      opinionData1: {
        // 客观题图表
        name: this.$t('m.objectiveQuestion'),
        list: [
          { value: 10, name: this.$t('m.goal') },
          { value: 50, name: this.$t('m.totalScore') },
        ],
      },
      opinionData2: {
        // 主观题图表
        name: this.$t('m.subjectiveQuestions'),
        list: [
          { value: 10, name: this.$t('m.goal') },
          { value: 100, name: this.$t('m.totalScore') },
        ],
      },
      rateList: [0, 0, 0, 0, 0],
      rateOldList: [0, 0, 0, 0, 0],
      textarea: '',
      userCount: '56',
      trainScore: {
        // get_score_objective: 10,
        // sum_score_objective: 50,
        // get_score_subjective: 10,
        // sum_score_subjective: 100,
      },
      levelData: [1, 1, 1, 1, 1, 1, 4], // 技能评分
      resource_id: '',
    };
  },
  watch: {
    language: {
      handler(nv, ov) {
        console.log(nv);
      },
    },
    userList: {
      handler(nv, ov) {
        if (nv) {
          this.currentPerson = nv[0].resource_id;
          this.currentPersonInfo = nv[0];
        }
      },
      deep: true,
      immediate: true,
    },
    currentPerson: {
      handler(nv, ov) {
        if (nv) {
          this.currentPersonInfo = _.filter(this.userList, (item) => {
            return item.resource_id === nv;
          })[0];
          this.changeUser();
        }
      },
      deep: true,
      immediate: true,
    },
    rateList: {
      handler: function (val, oldval) {
        this.scoreCalculation();
      },
      immediate: true, // 关键
      deep: true,
    },
  },
  computed: {
    axisName() {
      return {
        formatter: (text) => {
          var strlength = validateUtils.validateLength(text);
          var maxlength = 36;
          if (strlength > maxlength) {
            text = cutStr(text, maxlength) + '...';
          }
          return text;
        },
      };
    },
  },
  created() {
    this.resource_id = this.$route.params && this.$route.params.resource_id;
  },
  mounted() {
    this.listen.createListen();
    this.getPieLabel();
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
    changeUser() {
      this.value = '3';
      this.commonRequest();
    },
    commonRequest() {
      this.getSkillData();
      this.getTrainStatics();
      this.initUsereData();
    },
    // 获取雷达图label
    getPieLabel() {
      getRadarLabels().then((res) => {
        const data = _.get(res, 'data.data.labels');
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
                fontSize: 14,
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
    // 获取技能评分
    getSkillData() {
      this.$request
        .get(
          '/cr/admin/mission/missions/radar',
          {
            resource_id: this.$route.params.resource_id,
            user_hash: this.currentPerson,
          },
          { baseURL: '/api/ojj' },
        )
        .then((res) => {
          this.levelData = _.get(res, 'data.data');
        });
    },
    // 查看学员用户评分
    // 获取学员评分
    initUsereData() {
      this.$request
        .get(
          '/cr/red_vs_blue/red_vs_blue/student_score',
          {
            resource_id: this.$route.params.resource_id,
            user_hash: this.currentPerson,
          },
          { baseURL: '/api/ojj' },
        )
        .then((res) => {
          const data = _.get(res, 'data.data');
          this.textarea = data.comment;
          this.trainScore = data.training_score;
          this.opinionData1.list[0].value =
            data.training_score.get_score_objective; // 客观题得分
          this.opinionData1.list[1].value =
            data.training_score.sum_score_objective; // 客观题总分
          this.opinionData2.list[0].value =
            data.training_score.get_score_subjective; // 主观题得分
          this.opinionData2.list[1].value =
            data.training_score.sum_score_subjective; // 主观题总分
          if (data.final_score) {
            this.userCount = data.final_score;
            this.rateList = data.ability_score;
            // 训练分占比
            this.value = this.options.find(
              (ele) => ele.label === data.training_percentage,
            ).value;
          } else {
            this.rateList = [0, 0, 0, 0, 0];
          }
        });
    },
    // 获取训练统计
    getTrainStatics() {
      this.$request
        .get(
          '/cr/red_vs_blue/red_vs_blue/get_user_mission_dynamic',
          {
            resource_id: this.$route.params.resource_id,
            student_id: this.currentPerson,
          },
          {
            baseURL: '/api/ojj',
          },
        )
        .then((res) => {
          this.opinionData = res.data.data.statistical_info;
          // 动态事件类型:
          // 1、下发
          // 2、上报
          // 3、成功
          // 4、失败
          // 5、驳回
          this.dynamicData = res.data.data.dynamic_data;
          this.dynamicData.forEach((item) => {
            item.action_type_name = getValueName(
              this.$CONSTANT.Action.ActionType,
              parseInt(item.action_type),
              // item.action_type,
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
          // this.unfinishedAssgin = this.totalAssgin - this.finishedAssgin
        });
    },

    // 给学员评分
    submitScore() {
      const params = {};
      params.training_percentage = this.options.find(
        (ele) => ele.value === this.value,
      ).label; // 训练得分所占比例
      params.ability_percentage = this.options1.find(
        (ele) => ele.value === this.value,
      ).label; // 能力得分比例
      params.ability_score = JSON.stringify(this.rateList);
      params.comment = this.textarea;
      params.final_score = this.userCount;
      params.room_id = this.$route.params.resource_id;
      params.user = this.currentPerson;

      this.$request
        .post(`/cr/red_vs_blue/red_vs_blue/student_score`, params, {
          baseURL: '/api/ojj',
        })
        .then((res) => {
          this.$message.success(this.$t('m.submitSuccess'));
        });
    },

    selectChange() {
      this.scoreCalculation();
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
  },
};
</script>
<style lang="scss">
.single-person {
  .host-title {
    padding-left: 0;
  }
}
</style>
<style lang="scss" scoped>
.mr11 {
  margin-right: 11px;
}
.mt8 {
  margin-top: 8px;
}
.single-person {
  padding: 20px 16px;
  height: 100%;
  .top-person {
    display: flex;
    align-items: center;
    justify-content: space-between;
    img {
      width: 45px;
      height: 45px;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.4);
      margin-right: 10px;
    }
    span {
      font-size: 14px;
      color: var(--neutral8);
    }
  }
  .bottom-box {
    width: 100%;
    display: flex;
    height: calc(100% - 45px);
    .left-box {
      width: 50%;
      height: 100%;
      overflow-y: auto;
      border-right: 1px solid var(--neutral0);
      padding-right: 15px;
    }
    .com-box {
      padding: 10px 0;
      background: var(--bg-color-3);
    }
    .right-box {
      width: 50%;
      height: 100%;
      overflow-y: auto;
      padding: 0 5px 50px 15px;
    }
    .height-167 {
      height: 167px;
    }
    .height-240 {
      height: 240px;
    }
    .height-254 {
      height: 254px;
    }
    .chart-style {
      margin-top: 8px;
    }
    .min-height-144 {
      min-height: 144px;
      // overflow-y: auto;
    }
    .height-144 {
      height: 144px;
    }
    .height-230 {
      height: 230px;
    }
    .comprehensive-assessment {
      .assessment-box {
        display: flex;
        align-items: center;
        justify-content: center;
        color: var(--neutral8);
        .baseline {
          display: flex;
          align-items: baseline;
        }
      }
      .number {
        font-size: 46px;
      }
      .unit {
        font-size: 14px;
      }
    }
    .train-score {
      position: relative;
    }
    .ability-score {
      position: relative;
    }
    .common-select {
      width: 88px !important;
      position: absolute;
      top: 7px;
      right: -11px;
      ::v-deep.el-input--suffix .el-input__inner {
        width: 88px !important;
        height: 30px !important;
      }
      ::v-deep .el-input__icon {
        line-height: 30px !important;
      }
    }
  }
  .ability-score {
    ::v-deep.el-form {
      padding: 0 !important;
    }
  }

  .competence {
    margin-top: 19px;
    width: 100%;
    .rate-item {
      clear: both;
      overflow: hidden;
      width: calc(100% - 12px);
    }
    ::v-deep .el-rate {
      display: flex;
      flex-direction: row;
      .el-rate__item {
        margin-right: 4px;
      }
    }
    .tt {
      width: 60px;
      float: left;
      text-align: right;
      margin-right: 8px;
      font-size: 14px;
      white-space: nowrap;
      // text-align-last: justify;
      // text-align: justify;
      margin-left: 26px;
    }
    .tt-en {
      width: 170px;
      float: left;
      text-align: right;
      margin-right: 8px;
      font-size: 14px;
      white-space: nowrap;
      // text-align-last: justify;
      // text-align: justify;
      margin-left: 26px;
    }
    .tf {
      margin-top: 5px;
    }
    ::v-deep.el-textarea {
      margin: 5px 0 0 4px;
    }
    .star-width {
      // width: 49% !important;
    }
    .star {
      width: calc(100% - 140px - 84px);
      float: left;
      margin: 0 0 4px 0;
      ::v-deep.el-rate__icon {
        margin-right: 0 !important;
      }
    }
  }
  .btn-box {
    display: flex;
    justify-content: end;
  }
  .font-title {
    width: 98%;
    font-size: 14px;
    line-height: 32px;
    padding-left: 24px;
  }
}
</style>
