<template>
  <!--团队训练老师修改任务弹窗内容-->
  <div class="dialog-form">
    <cb-form :label-width="language === 'en' ? '140px' : '110px'">
      <cb-row :gutter="20">
        <cb-col :span="15">
          <cb-form-item :label="$t('m.missionTitle')">
            <cb-input v-model="taskInfos.title" />
          </cb-form-item>
        </cb-col>
        <cb-col :span="9">
          <cb-form-item :label="$t('m.setScore')">
            <cb-input
              v-model="taskInfos.score"
              oninput="value=value.replace(/[^\d]/g,'')"
              type="num"
            />
          </cb-form-item>
        </cb-col>
      </cb-row>
      <cb-form-item :label="$t('m.settingSkillPoints')">
        <div
          style="
            border: 1px solid var(--neutral3);
            overflow: hidden;
            padding: 6px;
            color: #8b94b1;
          "
        >
          <div class="skill-left">
            <div>
              <div
                v-for="(item, index) in taskInfos.levelRate"
                :key="index"
                style="clear: left"
              >
                <div
                  class="one-overflow"
                  style="float: left; text-align: right; margin-right: 9px"
                  :style="{ width: language === 'en' ? '44%' : '25%' }"
                  :title="item.type"
                >
                  {{ item.type }}
                </div>
                <div style="float: left; margin-top: 9px">
                  <cb-rate v-model="item.rate" class="elc-rate" :max="5" />
                </div>
              </div>
            </div>
          </div>
          <div class="skill-right">
            <cb-echart-radar
              v-if="indicator.length > 0"
              ref="rader"
              radarShape="sharp"
              :indicator="indicator"
              :radarData="radarData"
              :axisName="axisName"
            ></cb-echart-radar>
            <!-- <skill-one-chart
              ref="skillBlueChart"
              :level-rate="taskInfos.levelRate"
            /> -->
          </div>
        </div>
      </cb-form-item>
      <cb-form-item :label="$t('m.taskType')">
        <cb-input
          :disabled="true"
          v-text="getType(taskInfos.type)"
          class="inputDiv"
        />
      </cb-form-item>
      <cb-form-item :label="$t('m.taskContent')">
        <cb-input
          v-model="taskInfos.description"
          type="textarea"
          placeholder=""
          :disabled="true"
        />
      </cb-form-item>
    </cb-form>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import SkillOneChart from '@/components/TaskEditor/skillone_chart.vue';
import validateUtils from '@/utils/validate';
import { cutStr } from '@/utils/index.js';
export default {
  components: {
    SkillOneChart,
  },
  props: {
    taskInfo: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      taskInfos: {
        title: '',
        score: null,
        levelRate: [],
        type: null,
        description: '',
      },
    };
  },
  computed: {
    ...mapGetters(['language']),
    radarData() {
      const data = _.map(this.taskInfos.levelRate, (item) => {
        return item.rate;
      });
      return data;
    },
    indicator() {
      const arrs = [];
      _.forEach(this.taskInfos.levelRate, (item, index) => {
        if (index === 0) {
          arrs.push({
            name: item.type,
            max: 5,
            axisLabel: {
              align: 'center',
              verticalAlign: 'top',
              show: true,
              fontSize: 14,
              color: '#B8C4DF',
              showMaxLabel: true, //不显示最大值，即外圈不显示数字30
              showMinLabel: true, //显示最小数字，即中心点显示0
            },
          });
        } else {
          arrs.push({
            name: item.type,
            max: 5,
          });
        }
      });
      return arrs;
    },
    axisName() {
      return {
        formatter: (text) => {
          var strlength = validateUtils.validateLength(text);
          var maxlength = 12;
          if (strlength > maxlength) {
            text = cutStr(text, maxlength) + '...';
          }
          return text;
        },
      };
    },
  },
  watch: {
    taskInfo: {
      handler: function (val, oldval) {
        this.$nextTick(() => {
          this.taskInfos = JSON.parse(JSON.stringify(val));
        });
      },
      immediate: true, // 关键
      deep: true,
    },
    'taskInfos.levelRate': {
      handler: function (val, oldval) {
        this.$nextTick(() => {
          const newData = [];
          val.forEach((item) => {
            newData.push(item.rate);
          });
          // this.$refs.skillBlueChart.options.series[0].data[0].value = newData;
          // this.$refs.skillBlueChart.initBlueChart();
        });
      },
      immediate: true,
      deep: true,
    },
  },
  mounted() {},
  methods: {
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
  },
};
</script>

<style lang="scss">
.dialog-form {
  .skill-left {
    float: left;
    width: 50%;
    margin-left: 5px;
  }
  .skill-right {
    float: left;
    height: 240px;
    width: 48%;
  }
}
.inputDiv {
  background-color: var(--bg-color-2);
}
</style>
