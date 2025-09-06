<template>
  <cb-timeline>
    <cb-timeline-item
      v-for="item in trainRecord"
      :key="item.room_id"
      :timestamp="item.training_time"
      placement="top"
    >
      <div class="cb-card">
        <div class="cb-card-header">
          <div class="clearfix">
            <span>{{ $t('m.theTimes', { num: item.index }) }}</span>
            <cb-button
              style="float: right"
              hollow
              @click="trainDetail(item)"
              size="small"
              >{{ $t('m.lookDetail') }}</cb-button
            >
          </div>
        </div>
        <div class="cb-card-body">
          <div class="item">
            <label for="">
              <cb-iconfont type="icon-lishizuijinshijian"></cb-iconfont
              >{{ $t('m.trainDuration') }}：</label
            >
            <span>{{ item.time_cost }}</span>
          </div>
          <div class="item">
            <label for=""
              ><cb-iconfont type="icon-bingtu"></cb-iconfont
              >{{ $t('m.completeness') }}：</label
            >
            <span class="task-progress"
              ><cb-progress
                :percentage="(item.finished / item.mission_count) * 100"
              ></cb-progress>
              <i class="right-text"
                >{{ item.finished }}/{{ item.mission_count }}</i
              >
            </span>
          </div>
          <div class="item">
            <label for=""
              ><cb-iconfont type="icon-chengjiguanli"></cb-iconfont
              >{{ $t('m.fraction') }}：</label
            >
            <span
              >{{ item.score }}{{ $t('m.singleScore') }} ({{
                $t('m.totalScore')
              }}：{{ item.total_score }})</span
            >
          </div>
        </div>
      </div>
    </cb-timeline-item>
    <train-record-detail ref="tarinRecordDetail" :detail-data="detailData" />
  </cb-timeline>
</template>

<script>
import TrainRecordDetail from './train-record-detail.vue';
export default {
  components: {
    TrainRecordDetail,
  },
  props: {
    trainRecord: {
      type: Array,
      default() {
        return [];
      },
    },
  },
  data() {
    return {
      detailData: {},
    };
  },

  methods: {
    trainDetail(item) {
      this.detailData = item;
      this.$refs.tarinRecordDetail.showDetail = true;
    },
  },
};
</script>

<style lang="scss">
.el-timeline {
  .el-timeline-item {
    .el-timeline-item__wrapper {
      .el-timeline-item__timestamp {
        font-size: 16px;
        font-family: PingFangSC-Semibold, PingFang SC;
        font-weight: 600;
        color: var(--neutral9);
      }
    }
  }
}
.el-timeline {
  margin-left: -40px;
}

.el-timeline-item__wrapper {
  padding-left: 20px;
}

.el-timeline-item__node--normal {
  left: -8px;
  top: -10px;
}

.el-timeline-item__node {
  width: 8px;
  height: 8px;
  background: none;
  background-size: cover;
  border-radius: 100%;
  background: var(--primary-color);
}

.el-timeline-item__content {
  color: var(--neutral8);
}

.el-timeline-item__tail {
  position: absolute;
  left: 4px;
  height: 100%;
  border-left: 1px solid var(--neutral1);
}

.el-timeline-item__node--normal {
  left: 0;
  top: 0;
}

.cb-card {
  border-radius: 4px;
  background: var(--bg-color-3);
  overflow: hidden;
  color: var(--neutral8);
  transition: 0.3s;

  &-header {
    padding: 4px 16px;
    border-bottom: 1px solid var(--neutral0);
    box-sizing: border-box;
    line-height: 30px;
  }

  &-body {
    padding: 8px 16px;

    .item {
      display: flex;
      font-size: 14px;
      margin: 8px 0;
      .task-progress {
        .cb-progress__text {
          visibility: hidden;
        }
        position: relative;
        .cb-progress {
          position: relative;
          top: 1px;
          .cb-progress-bar {
            flex: none;
          }
        }
        .right-text {
          position: absolute;
          right: 5px;
          top: 1px;
          color: var(--neutral9);
          font-style: normal;
        }
      }

      label {
        color: var(--neutral4);
        font-weight: normal;

        .cb-iconfont {
          margin-right: 4px;
        }
      }

      span {
        color: var(--neutral8);
        width: 70%;
      }
    }
  }
}
</style>
