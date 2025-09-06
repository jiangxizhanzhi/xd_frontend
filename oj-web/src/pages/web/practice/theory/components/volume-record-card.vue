<template>
  <div class="volume-record-card" @click="goDetail">
    <div class="volume-title">
      <span class="one-overflow"
        >{{ detailObj.paper_time }}
        {{ detailObj.ai_create_flag ? $t('practice.intelligent') : ''
        }}{{ $t('practice.volume') }} (
        {{ detailObj.count }}
        {{ $t('practice.topic') }})</span
      >
    </div>
    <div class="volume-count">
      <div v-if="!detailObj.is_finish" class="undone">
        <div class="undone-count outer-com">
          <div class="undone-single">
            <div class="count color-green">{{ detailObj.right }}</div>
            <div class="label">{{ $t('practice.right') }}</div>
          </div>
          <div class="undone-single">
            <div class="count color-red">{{ detailObj.wrong }}</div>
            <div class="label">{{ $t('practice.wrong') }}</div>
          </div>
          <div class="undone-single">
            <div class="count color-yellow">{{ detailObj.not_start }}</div>
            <div class="label">{{ $t('practice.notStart') }}</div>
          </div>
        </div>
        <div class="btn-continue btn-com">
          <cb-button hollow @click.native.stop="continuePractice">
            {{ $t('practice.keepPractice') }}
          </cb-button>
        </div>
      </div>
      <div v-else class="finished">
        <div class="accuracy-box outer-com">
          <div class="accuracy-single">
            <div class="color-blue count">{{ detailObj.accuracy_rate }}%</div>
            <div class="label">{{ $t('practice.accuracy') }}</div>
          </div>
        </div>
        <div class="btn-again btn-com">
          <cb-button hollow @click.native.stop="againPractice">
            {{ $t('practice.practiceAgain') }}
          </cb-button>
        </div>
      </div>
    </div>
    <div
      class="status-box"
      :class="detailObj.is_finish ? 'green-box' : 'orange-box'"
    >
      <span v-if="detailObj.is_finish">{{ $t('m.completed') }}</span>
      <span v-else>{{ $t('practice.unfinished') }}</span>
    </div>
  </div>
</template>
<script>
import { VOLUME_STATUS } from '../../constant';
export default {
  name: 'VolumeRecordCard',
  props: {
    detailObj: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      VOLUME_STATUS,
    };
  },
  methods: {
    goDetail() {
      this.$emit('go-detail', this.detailObj);
    },
    continuePractice() {
      this.$emit('continue-practice', this.detailObj);
    },
    againPractice() {
      this.$emit('again-practice', this.detailObj);
    },
  },
};
</script>
<style lang="scss" scoped>
.volume-record-card {
  width: 100%;
  height: 100%;
  background: var(--bg-color-3);
  border-radius: 4px;
  position: relative;
  cursor: pointer;

  .volume-title {
    height: 80px;
    background: var(--bg-color-1);
    font-size: 20px;
    font-weight: 600;
    color: var(--neutral8);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0 10px;
  }
  .volume-count {
    .undone {
    }
    .outer-com {
      display: flex;
      justify-content: space-between;
      margin-top: 30px;
      padding: 0 25px;
    }
    .btn-com {
      display: none;
    }
    .count {
      font-weight: 600;
      font-size: 24px;
      line-height: 20px;
    }
    .label {
      font-size: 12px;
      color: var(--neutral6);
      line-height: 16px;
      margin-top: 8px;
    }
    .finished {
      .accuracy-box {
        justify-content: space-around !important;
      }
    }
    .undone-single {
      width: 33%;
    }
    .undone-single,
    .accuracy-single {
      display: flex;
      flex-direction: column;
      flex-wrap: nowrap;
      justify-content: center;
      align-items: center;
    }
  }
  &:hover {
    margin-top: -4px;
    background: var(--neutral0);
    box-shadow: 6px 0px 20px 0px var(--box-shadow-color);
    .btn-com {
      display: block !important;
      display: flex !important;
      margin-top: 10px !important;
      justify-content: center;
    }
    .outer-com {
      margin-top: 16px !important;
    }
  }
  .status-box {
    position: absolute;
    top: 0;
    left: 0;
    padding: 1px 8px;
    font-size: 12px;
    color: var(--white-color);
    line-height: 20px;
    border-radius: 4px 0px 8px 0px;
  }
  .green-box {
    background: var(--green-color-8);
  }
  .orange-box {
    background: var(--orange-color-8);
  }
}
</style>
