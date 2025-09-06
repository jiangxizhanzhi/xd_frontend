<template>
  <div class="scroll-items">
    <div class="scroll-items-content">
      <!-- <cb-scroll
        :data="dataList"
        v-if="dataList.length !== 0"
        class="scroll-box"
        :classOption="optionSingleHeight"
      > -->
      <div class="scroll-box">
        <div v-for="(item, index) in dataList" :key="index" class="scroll-item">
          <div class="time">{{ item.create_time }}</div>
          <div class="content">
            <span class="regular">{{ $t('personTrainingScreen.congra') }}</span>
            <span class="normal">{{ item.user_name }}</span>
            <span class="regular">{{ $t('personTrainingScreen.pass') }}</span>
            <span class="normal">{{ item.role_name }}</span>
            <span class="regular"
              >{{ $t('personTrainingScreen.automatic') }}，</span
            >
            <span class="score"
              >{{ $t('personTrainingScreen.grade') }}
              {{
                item.type === 1
                  ? $t('personTrainingScreen.qualified')
                  : $t('personTrainingScreen.excellent')
              }}！</span
            >
          </div>
        </div>
      </div>
      <!-- </cb-scroll> -->
    </div>
  </div>
</template>

<script>
export default {
  props: {
    dataList: {
      type: Array,
      default: () => [],
    },
    limitNum: {
      type: Number,
      default: 3,
    },
  },
  computed: {
    optionSingleHeight() {
      return {
        limitMoveNum: this.limitNum,
      };
    },
  },
};
</script>

<style lang="scss" scoped>
.scroll-items {
  &-content {
    .scroll-box {
      margin-top: 10px;
      height: 318px;
      overflow: hidden;
      font-size: 14px;
      font-family: PingFangSC-Semibold, PingFang SC;
      font-weight: 600;
      color: rgba(255, 255, 255, 0.9);
      .scroll-item {
        line-height: 28px;
        font-size: 14px;
        font-family: PingFangSC-Semibold, PingFang SC;
        font-weight: 600;
        text-align: left;
        margin-bottom: 8px;
        .time {
          color: rgba(255, 255, 255, 0.9);
        }
        .content {
          .regular {
            font-family: PingFangSC-Regular, PingFang SC;
            color: rgba(255, 255, 255, 0.7);
            font-weight: 400;
          }
          .normal {
            font-weight: 600;
            color: rgba(255, 255, 255, 0.9);
          }
          .score {
            color: #36d94c;
          }
        }
      }
    }
  }
}
</style>
