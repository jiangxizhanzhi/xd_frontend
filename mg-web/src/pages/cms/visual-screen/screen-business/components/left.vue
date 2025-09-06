<template>
  <div class="left-wrapper">
    <div v-show="show">
      <div>
        <block
          :title="$t('screenBusiness.assetsStatistics')"
          :box-width="324"
          :box-height="180"
          :box-top="40"
          :box-left="30"
        >
          <assets-statistics :data="assetsData"></assets-statistics>
        </block>
      </div>

      <div>
        <block
          :title="$t('screenBusiness.taskDeliveryProgress')"
          :box-width="324"
          :box-height="200"
          :box-top="210"
          :box-left="30"
        >
          <!-- <task-status></task-status> -->
          <progress-bar :dataList="progressData"></progress-bar>
        </block>
      </div>

      <div style="margin: 16px 0 0 0">
        <block
          :title="$t('screenBusiness.taskStatus')"
          :box-width="324"
          :box-height="220"
          :box-top="425"
          :box-left="30"
        >
          <pie-three-dimensional
            :optionData="optionData"
            :showLegend="false"
            :innerRangWidth="0.6"
            :maxheight="40"
            :top="0"
            :distance="200"
          ></pie-three-dimensional>
        </block>
      </div>

      <div>
        <block
          :title="$t('screenBusiness.trainingScoreTOP5')"
          :box-width="324"
          :box-height="265"
          :box-top="640"
          :box-left="30"
        >
          <train-score />
        </block>
      </div>
    </div>
  </div>
</template>

<script>
import Block from './block.vue';
import AssetsStatistics from './assets-statistics.vue';
import TaskStatus from './task-status.vue';
import ProgressBar from './progress-bar.vue';
import pieThreeDimensional from './pie-three-dimensional.vue';
import TrainScore from './train-score.vue';
import { queryAssets, querySituationInfo } from '../api';
import _ from 'lodash';
export default {
  components: {
    Block,
    AssetsStatistics,
    TaskStatus,
    ProgressBar,
    pieThreeDimensional,
    TrainScore,
  },
  props: {
    dataList: {
      type: Object,
      default: () => {},
    },
    show: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      room_id: '',
      scene_id: '',
      optionData: [],
      progressData: {},
      assetsData: {},
      attackFlowData: [],
      attackTrendData: [],
      attackLogData: [],
      timer: null,
    };
  },
  watch: {
    dataList: {
      handler(nv, ov) {
        if (!_.isEmpty(nv)) {
          this.progressData = nv.progress || {};
          this.optionData = [
            {
              name: this.$t('screenBusiness.success'),
              value: nv?.statistics.success,
            },
            {
              name: this.$t('screenBusiness.fail'),
              value: nv?.statistics.fail,
            },
            {
              name: this.$t('screenBusiness.toBeReviewed'),
              value: nv?.statistics.wait,
            },
            {
              name: this.$t('screenBusiness.unreported'),
              value: nv?.statistics.unsubmitted,
            },
          ];
        }
      },
      immediate: true,
      deep: true,
    },
  },
  created() {
    this.room_id = this.$route.params.id;
    this.scene_id = this.$route.query.scene_id;
    if (this.scene_id) {
      this.getAssetsData();
      this.timer = setInterval(() => {
        this.getAssetsData();
      }, 1000 * 5);
    }
  },
  beforeDestroy() {
    if (this.timer) {
      clearInterval(this.timer);
    }
  },
  methods: {
    getAssetsData() {
      queryAssets({ sceneIds: this.scene_id }).then((res) => {
        this.assetsData = _.head(_.get(res, 'data.data', {})) || {};
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.left-wrapper {
  height: 100%;
  width: 324px;
  // padding-top: 40px;
  // padding-bottom: 30px;
  padding: 40px 0 30px 30px;
  position: absolute;
  z-index: 12;
  left: 0;
  top: 0px;
  display: flex;
  flex-direction: column;
  background-image: url(~@/assets/img/visual-screen/screen-business/left_bg.png);
  background-size: 100% 100%;
  &::before {
    content: '';
    display: block;
    position: absolute;
    inset: 0;
    background-image: url(~@/assets/img/visual-screen/screen-business/decoration_left.png);
    background-size: 100% 100%;
    background-position: center;
    background-repeat: no-repeat;
    z-index: 12;
    pointer-events: none;
  }
  & > div {
    // flex: 1;
    margin-bottom: 15px;
  }
}
</style>
