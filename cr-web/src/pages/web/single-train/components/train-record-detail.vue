<template>
  <cb-dialog
    :append-to-body="true"
    height="500px"
    :visible.sync="showDetail"
    class="train-record-detail"
    width="900px"
  >
    <div slot="title" class="dialog-header">
      <div class="dialog-header-title">
        {{ trainData.training_name
        }}{{ $t('m.theTimes', { num: detailData.index }) }}
      </div>
      <div class="dialog-header-spec">
        <div>
          <label for=""
            ><cb-iconfont type="icon-zhanghao"></cb-iconfont
            >{{ $t('m.trainPerson') }}：</label
          >
          <span>{{ trainData.trainee_name }}</span>
        </div>
        <div>
          <label for=""
            ><cb-iconfont type="icon-fenshu"></cb-iconfont
            >{{ $t('m.trainScore') }}：</label
          >
          <span>{{ trainData.score }}{{ $t('m.singleScore') }}</span>
        </div>
        <div>
          <label for=""
            ><cb-iconfont type="icon-shijian1"></cb-iconfont
            >{{ $t('m.trainTimes') }}：</label
          >
          <span>{{ trainData.training_time }}</span>
        </div>
        <div>
          <label for=""
            ><cb-iconfont type="icon-daishenhe"></cb-iconfont
            >{{ $t('m.trainTime') }}：</label
          >
          <span>{{ trainData.time_cost }}</span>
        </div>
      </div>
    </div>
    <div class="dialog-content">
      <div class="dialog-content-base">
        <div class="dialog-content-base-header">
          <div>
            <label for="">
              <cb-iconfont
                :size="14"
                type="icon-lishizuijinshijian"
              ></cb-iconfont>
              {{ $t('m.recommedTime') }}：</label
            >
            <span>{{ trainData.duration_time }}{{ $t('m.singleHour') }}</span>
          </div>
          <div>
            <label for="">
              <cb-iconfont :size="14" type="icon-yingyongxitong"></cb-iconfont>
              {{ $t('list.category') }}：</label
            >
            <span>{{
              utils.getValueName(
                this.$CONSTANT.Condition.Category,
                trainData.sub_type,
              )
            }}</span>
          </div>
          <div>
            <label for="">
              <cb-iconfont :size="14" type="icon-dengji"></cb-iconfont>
              {{ $t('list.difficulty') }}：</label
            >
            <span>{{
              utils.getValueName(
                this.$CONSTANT.Condition.Difficult,
                trainData.difficulty,
              )
            }}</span>
          </div>
        </div>
        <div class="dialog-content-base-train common-style">
          <div class="dialog-content-base-train-left">
            {{ $t('m.trainingSkills') }}：
          </div>
          <div class="dialog-content-base-train-right">
            <cb-tag
              size="small"
              v-for="item in trainData.pre_skill"
              :key="item"
              >{{ item }}</cb-tag
            >
          </div>
        </div>
        <div class="dialog-content-base-pre common-style">
          <div class="dialog-content-base-pre-left">
            {{ $t('m.frontSkills') }}：
          </div>
          <div class="dialog-content-base-pre-right">
            <cb-tag
              size="small"
              v-for="item in trainData.train_skill"
              :key="item"
              >{{ item }}</cb-tag
            >
          </div>
        </div>
        <div class="dialog-content-base-desc common-style">
          <div class="dialog-content-base-desc-left">
            {{ $t('list.trainingDesc') }}：
          </div>
          <div class="dialog-content-base-desc-right">
            {{ trainData.description }}
          </div>
        </div>
      </div>
      <div class="dialog-content-echart">
        <div class="dialog-content-echart-content">
          <div class="dialog-content-echart-content-left">
            <block :title="$t('m.trainingStatistics')"></block>
            <div class="common-bg">
              <train-echart
                v-if="trainTypeData.length > 0"
                :title="$t('m.taskCount')"
                :dataList="trainTypeData"
                :count="mission_count"
              />
            </div>
          </div>
          <div class="dialog-content-echart-content-right">
            <block :title="$t('m.skillScore')"></block>
            <div class="common-bg">
              <cb-echart-radar
                v-if="load && indicator.length > 0"
                :radarShape="radarShape"
                :indicator="indicator"
                :radarData="radarData"
                :radarRadius="radarRadius"
                :axisName="axisName"
              ></cb-echart-radar>
            </div>
          </div>
        </div>
      </div>
      <div class="dialog-content-task">
        <div
          class="dialog-content-task-item"
          v-for="item in trainData.stages"
          :key="item.stage_name"
        >
          <block :title="item.stage_name"></block>
          <div
            class="dialog-content-task-item-content"
            v-for="mission in item.missions"
            :key="mission.title"
          >
            <div
              class="task-title"
              :class="
                mission.status === task_status.CORRECT
                  ? 'task-title-success'
                  : mission.status === task_status.ERROR
                  ? 'task-title-error'
                  : ''
              "
            >
              {{ mission.title }}
            </div>
            <div class="task-content">
              <div class="task-desc">
                {{ mission.description }}
              </div>
              <!-- 判断题 -->
              <div class="task-detail" v-if="mission.type === testType.JUDGE">
                <cb-radio-group
                  v-model="mission.user_answer"
                  direction="vertical"
                >
                  <cb-radio
                    v-for="(item, i) in judgeOption"
                    :key="i"
                    :label="item.optionLabel"
                    :disabled="true"
                  >
                    {{ item.optionLabel + '、' }}
                    <span class="el-radio-choose-span"
                      >{{ item.optionValue }}
                    </span>
                  </cb-radio>
                </cb-radio-group>
              </div>
              <!-- 单选 -->
              <div class="task-detail" v-if="mission.type === testType.SINGLE">
                <cb-radio-group
                  v-model="mission.user_answer"
                  direction="vertical"
                >
                  <cb-radio
                    v-for="(item, i) in mission.option"
                    :key="i"
                    :label="item.optionLabel"
                    :disabled="true"
                  >
                    {{ item.optionLabel + '、' }}
                    <span class="el-radio-choose-span">
                      {{ item.optionValue }}
                    </span>
                  </cb-radio>
                </cb-radio-group>
              </div>
              <!-- 多选 -->
              <div
                class="task-detail"
                v-if="mission.type === testType.MULTIPLE"
              >
                <cb-radio-group
                  v-model="mission.user_answer"
                  direction="vertical"
                >
                  <cb-checkbox-group
                    v-model="mission.user_answer"
                    direction="vertical"
                  >
                    <cb-checkbox
                      v-for="(item, i) in mission.option"
                      :key="i"
                      :label="item.optionLabel"
                      :disabled="true"
                    >
                      {{ item.optionLabel + '、' }}
                      <span class="el-radio-choose-span">
                        {{ item.optionValue }}
                      </span>
                    </cb-checkbox>
                  </cb-checkbox-group>
                </cb-radio-group>
              </div>
              <!-- 文件 -->
              <div
                class="task-detail"
                v-if="mission.type === testType.FILE"
              ></div>
              <div class="answer-bottom">
                <div class="right">
                  {{ $t('m.correctAnswer') }}：{{ mission.answer }}
                </div>
                <div class="your">
                  {{ $t('m.yourAnswer') }}：<span
                    :class="
                      mission.status === task_status.CORRECT
                        ? 'your-success'
                        : mission.status === task_status.ERROR
                        ? 'your-error'
                        : 'your-primary'
                    "
                    >{{
                      formatAnswer(mission.user_answer) ||
                      $t('m.singleNoAnswer')
                    }}</span
                  >
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div slot="footer" class="dialog-footer">
      <cb-button @click="submit" :loading="btnLoading" mr>{{
        $t('m.export')
      }}</cb-button>
      <cb-button button-type="cancel" @click="cancel" />
    </div>
  </cb-dialog>
</template>

<script>
import block from '@/components/block';
import TrainEchart from './train-echart';
import validateUtils from '@/utils/validate';
import { getRadarLabels } from '@/api/common';
import { recordDetail, exportPdf } from '@/api/web/single-train';
import _ from 'lodash';
import utils from '@/utils/utils';
import { TASK_STATUS } from '../constants';

export default {
  components: {
    block,
    TrainEchart,
  },
  props: {
    detailData: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  watch: {
    detailData: {
      handler(val, oldval) {
        if (val) {
          this.getRecordDetail(val);
        }
      },
      deep: true,
      immediate: true,
    },
  },
  data() {
    return {
      task_status: TASK_STATUS,
      utils,
      btnLoading: false,
      trainTypeData: [],
      mission_count: 0,
      testType: {
        // 题目类型
        JUDGE: 0, // 判断
        SINGLE: 1, // 单选
        MULTIPLE: 2, // 多选
        FILE: 7, //文件
      },
      showDetail: false,
      trainData: {},
      indicator: [],
      radarRadius: ['0%', '55%'],
      load: false,
      radarShape: 'sharp',
      //数据，区域块的颜色等
      radarData: [],
      listen: new this.$ListenDomChange({
        dom: document.body,
        callback: this.listenFunc,
      }),
      categoryList: {
        successful: this.$t('m.success'),
        unfinished: this.$t('m.unfinished'),
        failed: this.$t('m.singleFailed'),
      },
      judgeAnswer: '',
      judgeOption: [
        {
          optionLabel: 'A',
          optionValue: this.$t('missions.correct'),
        },
        {
          optionLabel: 'B',
          optionValue: this.$t('missions.error'),
        },
      ],
    };
  },
  computed: {
    axisName() {
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
  },
  mounted() {
    this.listen.createListen();
    this.getRadarLabelsList();
  },
  beforeDestroy() {
    this.listen.destroyListen();
  },
  methods: {
    // 导出报告-原有接口，跟项羽沟通过暂时不提供新的html模板
    submit() {
      this.btnLoading = true;
      exportPdf({
        room_id: this.detailData.room_id,
        index: this.detailData.index,
      }).then((res) => {
        this.btnLoading = false;
        this.showDetail = false;
      });
    },
    cancel() {
      this.showDetail = false;
    },
    // 监听换肤，动态reload echarts
    listenFunc() {
      const className = document.body.className.split(' ');
      if (className.indexOf('theme-dark') != -1) {
        this.theme = 'dark';
      } else {
        this.theme = 'light';
      }
      this.load = false;
      if (this.indicator.length) {
        this.indicator[0].axisLabel.color = this.$themed('neutral5');
      }
      this.$nextTick(() => {
        this.load = true;
      });
    },
    // 获取技能标签
    getRadarLabelsList() {
      getRadarLabels().then((res) => {
        const data = _.get(res, 'data.data.labels', []);
        this.load = true;
        data.map((item) => {
          this.indicator.push({
            max: 100,
            name: `${item}`,
          });
        });
        this.indicator[0].axisLabel = {
          align: 'center',
          verticalAlign: 'top',
          show: true,
          fontSize: 8,
          color: this.$themed('neutral5'),
          showMaxLabel: true, //不显示最大值，即外圈不显示数字30
          showMinLabel: true, //显示最小数字，即中心点显示0
        };
      });
    },
    // 获取记录详情
    getRecordDetail(data) {
      if (data.room_id) {
        const obj = {
          resource_id: data.room_id,
        };
        recordDetail(obj).then((res) => {
          const data = _.get(res, 'data.data', {});
          this.trainData = data;
          // 如果是多选类型，需要将user_answer字段转换成数组格式,用于checkbox组件回显
          this.trainData?.stages?.forEach((item) => {
            item?.missions?.forEach((mission) => {
              if (
                mission.type === this.testType.MULTIPLE &&
                mission.user_answer
              ) {
                mission.user_answer = mission.user_answer.split(',');
              }
            });
          });
          this.trainTypeData = [];
          this.mission_count = data.record_statistics.mission_count;
          for (let key in data.record_statistics) {
            for (let label in this.categoryList) {
              if (key === label) {
                this.trainTypeData.push({
                  name: this.categoryList[key],
                  value: data.record_statistics[key],
                });
              }
            }
          }
          this.radarData = data.radars;
        });
      }
    },
    // 格式化答案格式，多选情况下，需要将数组重新转换为字符串
    formatAnswer(answer) {
      if (_.isArray(answer)) {
        return answer.join(',');
      } else {
        return answer;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.dialog-header {
  &-title {
    font-size: 20px;
    font-weight: 600;
    color: var(--neutral8);
    line-height: 28px;
  }

  &-spec {
    display: flex;
    margin-top: 16px;
    justify-content: center;
    font-size: 14px;
    color: var(--neutral8);
    font-weight: 400;
    line-height: 22px;

    div {
      margin: 0 10px;

      label {
        font-weight: normal;

        .cb-iconfont {
          margin-right: 8px;
          color: var(--neutral7);
        }
      }
    }
  }
}

.dialog-content {
  color: var(--neutral7);

  &-base {
    &-header {
      display: flex;
      margin-left: -20px;

      div {
        margin: 0 20px;

        label {
          font-weight: normal;
        }
      }
    }

    .common-style {
      overflow: hidden;
      line-height: 24px;
      margin-top: 14px;

      div {
        float: left;
      }
    }

    &-train {
      &-left {
        width: 70px;
      }

      &-right {
        width: calc(100% - 70px);

        .cb-tag {
          margin: 0 4px 4px 0;
        }
      }
    }

    &-pre {
      &-left {
        width: 70px;
      }

      &-right {
        width: calc(100% - 70px);

        .cb-tag {
          margin: 0 4px 4px 0;
        }
      }
    }

    &-desc {
      &-left {
        width: 70px;
      }

      &-right {
        width: calc(100% - 70px);
      }
    }
  }

  &-echart {
    margin-top: 16px;

    &-content {
      display: flex;
      justify-content: space-between;

      .common-bg {
        width: 412px;
        height: 230px;
        background: var(--bg-color-3);
        margin-top: -10px;
      }
    }
  }

  &-task {
    margin-top: 16px;

    &-item {
      margin-bottom: 16px;

      &-content {
        margin-top: -10px;
        margin-bottom: 26px;

        .task-title {
          height: 32px;
          line-height: 32px;
          padding-left: 16px;
          background: var(--primary-color-2);
          &-success {
            background: var(--green-color-2);
          }
          &-error {
            background: var(--red-color-2);
          }
        }

        .task-content {
          padding: 16px;
          background: var(--bg-color-3);
        }

        .task-desc {
          line-height: 24px;
          margin-bottom: 16px;
        }

        .answer-bottom {
          padding-top: 10px;
          margin-top: 16px;
          border-top: 1px solid var(--neutral1);
          display: flex;
          .right {
            margin-right: 24px;
          }
          .your {
            &-success {
              color: var(--green-color);
            }
            &-error {
              color: var(--red-color);
            }
            &-primary {
              color: var(--primary-color);
            }
          }
        }
      }
    }
  }
}
</style>
<style>
.el-dialog.is-fullscreen {
  width: 900px;
}
</style>
