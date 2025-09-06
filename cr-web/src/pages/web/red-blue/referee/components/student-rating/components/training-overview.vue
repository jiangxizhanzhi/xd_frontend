<template>
  <div class="training-overview">
    <block :title="$t('rbt.trainingOverview')"></block>
    <!-- 客观题 -->
    <div class="training-item">
      <div class="outer-wrap">
        <div class="img-wrap blue">
          <cb-iconfont
            :size="16"
            type="icon-cepingguanli"
            class="training-icon"
          ></cb-iconfont>
        </div>
      </div>
      <div class="score-wrap">
        <span class="type">{{ $t('rbt.objectiveQuestionScore') }}</span>
        <span class="num" v-if="trainScore"
          >{{ trainScore.get_score_objective }}
        </span>
      </div>
      <div class="total-wrap">
        <span class="type">{{ $t('rbt.totalScore') }}</span>
        <span class="num" v-if="trainScore"
          >{{ trainScore.sum_score_objective }}{{ $t('rbt.scores') }}</span
        >
      </div>
    </div>
    <!-- 主观题 -->
    <div class="training-item">
      <div class="outer-wrap">
        <div class="img-wrap green">
          <cb-iconfont
            :size="16"
            type="icon-daohanglan-ziyuan"
            class="training-icon"
          ></cb-iconfont>
        </div>
      </div>
      <div class="score-wrap">
        <span class="type">{{ $t('rbt.subjectiveQuestionScore') }}</span>
        <span class="num" v-if="trainScore"
          >{{ trainScore.get_score_subjective }}
        </span>
      </div>
      <div class="total-wrap">
        <span class="type">{{ $t('rbt.totalScore') }}</span>
        <span class="num" v-if="trainScore"
          >{{ trainScore.sum_score_subjective }}{{ $t('rbt.scores') }}</span
        >
      </div>
    </div>
    <!-- 训练用时 -->
    <div class="training-item">
      <div class="outer-wrap">
        <div class="img-wrap yellow">
          <cb-iconfont
            :size="16"
            type="icon-lishizuijinshijian"
            class="training-icon"
          ></cb-iconfont>
        </div>
      </div>
      <div class="score-wrap">
        <span class="type">{{ $t('rbt.trainingTime') }}</span>
        <span class="num" v-if="trainScore">{{ trainScore.time_cost }}</span>
      </div>
      <div class="total-wrap">
        <span class="type">{{ $t('rbt.recommendedTime') }}</span>
        <span class="num" v-if="trainScore"
          >{{ trainScore.duration }}{{ 'h' }}</span
        >
      </div>
    </div>
  </div>
</template>

<script>
import block from '@/components/block';
export default {
  components: {
    block,
  },
  props: {
    trainScore: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {};
  },
  watch: {
    watch: {
      trainScore: {
        handler(val, oldVal) {
          this.trainScore = val;
        },
        deep: true,
        immediate: true,
      },
    },
  },
  computed: {},
  methods: {},
  created() {},
  mounted() {},
};
</script>
<style lang="scss" scoped>
.training-overview {
  width: 100%;
  height: 100%;
  .training-item {
    height: 56px;
    display: flex;
    align-items: center;
    position: relative;
    .outer-wrap {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: var(--neutral0);
      display: flex;
      align-items: center;
      justify-content: center;
      .img-wrap {
        width: 26px;
        height: 26px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        .training-icon {
          color: var(--white-color);
        }
      }
      .blue {
        background: var(--primary-color);
      }
      .green {
        background: var(--green-color);
      }
      .yellow {
        background: var(--yellow-color);
      }
    }
    .score-wrap {
      margin-left: 8px;
      display: flex;
      align-items: center;
      .type {
        font-size: 14px;
        color: var(--neutral7);
        margin-right: 8px;
      }
      .num {
        font-size: 20px;
        color: var(--neutral8);
      }
    }
    .total-wrap {
      position: absolute;
      right: 16px;
      .type {
        font-size: 12px;
        color: var(--neutral5);
      }
      .num {
        font-size: 12px;
        color: var(--neutral8);
      }
    }
  }
}
</style>
