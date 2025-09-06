<template>
  <div class="comprehensive-training">
    <div class="training-statistics">
      <Block :title="$t('personal.trainingStatistics')">
        <div class="training-statistics-content">
          <div class="chart-left">
            <div class="head ft14">
              {{ $t('personal.trainingOverview') }}
            </div>
            <div class="chart">
              <training-overview
                v-if="
                  trainingData.completed && trainingData.completed.length > 0
                "
                :trainingData="trainingData"
              ></training-overview>
              <div v-else class="no-data">
                <div class="icon">
                  <cb-iconfont type="icon-zanwuziyuan" :size="56"></cb-iconfont>
                  <div>{{ $t('personal.noData') }}</div>
                </div>
              </div>
            </div>
          </div>
          <div class="chart-right">
            <div class="head ft14">
              {{ $t('personal.trainingType') }}
            </div>
            <div class="chart">
              <training-type
                v-if="trainTypeData.length > 0"
                :title="$t('personal.trainingTimes')"
                :dataList="trainTypeData"
              ></training-type>
              <div v-else class="no-data">
                <div class="icon">
                  <cb-iconfont type="icon-zanwuziyuan" :size="56"></cb-iconfont>
                  <div>{{ $t('personal.noData') }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Block>
    </div>
    <div class="my-training">
      <Block :title="$t('personal.myTrainingMission')">
        <my-training></my-training>
      </Block>
    </div>
  </div>
</template>

<script>
import Block from '@/components/block';
import TrainingOverview from './components/training-overview.vue';
import TrainingType from './components/training-type.vue';
import MyTraining from './components/my-training.vue';
import { getTraining } from '@/api/personal';
export default {
  components: {
    Block,
    TrainingOverview,
    TrainingType,
    MyTraining,
  },
  data() {
    return {
      trainingData: {},
      trainTypeData: [],
      categoryList: {
        1: this.$t('personal.penetrationTest'),
        2: this.$t('personal.operationProtection'),
        3: this.$t('personal.systemSimulation'),
        4: this.$t('personal.integratedScene'),
        5: this.$t('personal.ceOthers'),
      },
    };
  },
  created() {},
  mounted() {
    this.getTrainingData();
  },
  methods: {
    getTrainingData() {
      getTraining()
        .then((res) => {
          const data = _.get(res, 'data.data', {});
          this.trainingData = data;
          this.trainTypeData = [];
          for (let key in data.training_type_map) {
            this.trainTypeData.push({
              name: this.categoryList[key],
              value: data.training_type_map[key],
            });
          }
        })
        .catch(() => {});
    },
  },
};
</script>
<style lang="scss" scoped>
.comprehensive-training {
  width: 100%;
  padding-top: 16px;
  .training-statistics {
    width: 100%;
    ::v-deep .cb-block-title-container {
      margin-bottom: 0 !important;
    }
    .training-statistics-content {
      width: 100%;
      margin-top: 12px;
      display: flex;
      justify-content: space-between;
      .chart-left {
        width: calc((100% - 16px) / 2);
        height: 324px;
        background: var(--bg-color-3);
        .head {
          width: 100%;
          font-size: 14px;
          height: 14px;
          line-height: 14px;
          margin-top: 12px;
          padding: 0 16px;
          color: var(--neutral8);
        }
        .chart {
          width: 100%;
          height: 288px;
        }
      }
      .chart-right {
        width: calc((100% - 16px) / 2);
        height: 324px;
        background: var(--bg-color-3);
        .head {
          width: 100%;
          font-size: 14px;
          height: 14px;
          line-height: 14px;
          margin: 12px 0 16px 0;
          padding: 0 16px;
          color: var(--neutral8);
        }
        .chart {
          width: 100%;
          height: 276px;
        }
      }
    }
  }
  .my-training {
    // width: 100%;
    margin-top: 24px;
    ::v-deep .cb-block-title-container {
      margin-bottom: 12px !important;
    }
  }
  .no-data {
    width: 100%;
    height: 100%;
    position: relative;
    .icon {
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
    }
  }
}
</style>
<style lang="scss">
.comprehensive-training {
  .training-statistics,
  .my-training {
    .cb-block-title-container {
      margin-bottom: 12px !important;
    }
  }
}
</style>
