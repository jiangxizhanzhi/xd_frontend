<template>
  <div class="check-task">
    <cb-scrollbar class="task-details-dialog">
      <cb-form
        ref="form"
        :model.sync="formInfo"
        label-position="right"
        label-width="130px"
      >
        <cb-form-item :label="$t('m.missionTitle')" prop="name">
          <cb-input v-model="formInfo.name" disabled />
        </cb-form-item>
        <cb-form-item :label="$t('m.content')">
          <div
            v-if="formInfo.type === 1 || formInfo.type === 2"
            class="content-style"
          >
            <div>
              <span style="margin: 0 15px">{{ formInfo.content }}</span>
            </div>
            <div v-for="(item, index) in formInfo.answerOption" :key="index">
              <span style="margin: 0 15px">{{ item.optionLabel }}</span>
              <span>{{ item.optionValue }}</span>
            </div>
          </div>
          <!-- 内容 -->
          <div v-else class="viewMarkDown">
            <CbMarkdown v-model="formInfo.content" type="viewer" />
          </div>
        </cb-form-item>
        <cb-form-item :label="$t('m.userAnswers')">
          <cb-scrollbar>
            <!-- 用户答案 -->
            <div class="viewMarkDown">
              <CbMarkdown
                v-model="formInfo.userAnswers"
                type="viewer"
                class="markDownCommon"
              />
            </div>
          </cb-scrollbar>
        </cb-form-item>
        <cb-form-item :label="$t('m.standardAnswer')">
          <cb-input
            v-model="formInfo.standardAnswer"
            type="textarea"
            :rows="2"
            disabled
          />
        </cb-form-item>
        <cb-form-item :label="$t('m.viewAnswer')">
          <div
            class="markDownCommon mark-border markdown-div"
            :class="
              formInfo.write_up && upDownStates
                ? 'up-markdown'
                : 'down-markdown'
            "
          >
            <!-- 题解 -->
            <CbMarkdown v-model="formInfo.write_up" type="viewer" />

            <div
              v-if="formInfo.write_up"
              class="up-down-btn cursor"
              @click="upDown()"
            >
              <cb-iconfont v-show="upDownStates" type="icon-shouqi" />
              <cb-iconfont v-show="!upDownStates" type="icon-xiala" />
            </div>
          </div>
        </cb-form-item>
        <cb-form-item :label="$t('m.skillPoint')">
          <div class="skill-left" v-if="ready">
            <cb-echart-radar
              v-if="pieLabelArr.length > 0"
              ref="rader"
              radarShape="sharp"
              :indicator="pieLabelArr"
              :radarData="formInfo.level_data"
              :axisName="axisName"
            ></cb-echart-radar>
          </div>
          <div class="skill-right">
            <div class="score color-gray">{{ $t('m.fraction') }}</div>
            <div class="realScore">
              <!-- <span /> -->
              <span class="color-sky-blue">{{ formInfo.score }}/</span>
              <span class="color-sky-blue">{{ formInfo.total_score }}</span>
            </div>
          </div>
        </cb-form-item>
      </cb-form>
    </cb-scrollbar>
  </div>
</template>

<script>
import SkillChart from '@/components/TaskEditor/skill_chart.vue';
import validateUtils from '@/utils/validate';
import { cutStr } from '@/utils/index.js';

export default {
  name: 'CheckTask',
  components: {
    SkillChart,
  },
  props: {
    formInfo: {
      type: Object,
      default: () => {},
    },
    pieLabelData: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      ready: true,
      listen: new this.$ListenDomChange({
        dom: document.body,
        callback: this.listenFunc,
      }),
      upDownStates: false,
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

    pieLabelArr() {
      const arrs = [];
      _.forEach(this.pieLabelData, (item, index) => {
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
      return arrs;
    },
  },
  mounted() {
    this.listen.createListen();
  },
  beforeDestroy() {
    this.listen.destroyListen();
  },
  methods: {
    // 监听换肤，动态reload echarts
    listenFunc() {
      this.ready = false;
      this.$nextTick(() => {
        this.ready = true;
        if (this.$refs.rader) {
          this.$refs.rader.indicator[0].axisLabel.color =
            this.$themed('neutral5');
        }
      });
    },
    upDown() {
      this.upDownStates = !this.upDownStates;
    },
  },
};
</script>

<style scoped lang="scss">
.viewMarkDown {
  background: var(--neutral0);
}
.check-task {
  height: 100%;

  .content-style {
    border-radius: 2px;
  }

  ::v-deep {
    .el-textarea__inner {
      border: none;
      border-radius: 2px;
    }
  }

  .skill-left {
    float: left;
    width: 53%;
    height: 240px;
    padding-top: 16px;
  }
  .skill-right {
    float: left;
    width: 40%;
    position: relative;
    .realScore {
      width: 112px;
      height: 92px;
      background: var(--primary-color-2);
      font-size: 26px;
      text-align: center;
      line-height: 92px;
      margin-left: 60px;
      position: absolute;
      top: 100%;
      transform: translateY(45%);
      span {
        color: var(--primary-color);
      }
    }
  }
  .markdown-div {
    position: relative;
    background: var(--neutral0);
  }
  .up-down-btn {
    width: 50px;
    height: 20px;
    line-height: 20px;
    background: var(--bg-color-3);
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    text-align: center;
    img {
      vertical-align: middle;
      width: 14px;
      height: 8px;
    }
  }
  .up-markdown {
    ::v-deep .markdown-body {
      min-height: 100% !important;
    }
  }
  .down-markdown {
    ::v-deep .markdown-body {
      height: 70px !important;
      overflow: hidden;
    }
  }
}
</style>
<style lang="scss" scoped>
.mark-border {
  background: var(--cy14);
}
</style>
