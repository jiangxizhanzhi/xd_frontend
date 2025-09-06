<template>
  <div class="train-score">
    <div
      v-for="(item, idx) in trainingScoreData"
      :key="idx"
      class="single-person"
    >
      <div class="rank">
        {{ idx + 1 }}
        <img :src="numberBg" class="number-bg" />
      </div>
      <div class="user-info one-overflow">
        <div class="user-img">
          <img :src="item.avatar || defaultAvatar" />
        </div>
        <div class="user-name">{{ item.name }}</div>
      </div>
      <div class="score one-overflow">
        <div class="score-value">{{ item.score }}</div>
        <div class="score-desc">{{ $t('screenBusiness.score') }}</div>
      </div>
    </div>
  </div>
</template>
<script>
import defaultAvatar from '@/assets/default-avatar.png';
import numberBg from '@/assets/img/visual-screen/screen-business/number_bg.png';
import { queryTrainingScore } from '../api';
export default {
  data() {
    return {
      defaultAvatar: defaultAvatar,
      numberBg: numberBg,
      trainingScoreData: [],
      room_id: '',
      timer: null,
    };
  },
  created() {
    this.room_id = this.$route.params.id;
    if (this.room_id) {
      this.getTopScoreData();
      this.timer = setInterval(() => {
        this.getTopScoreData();
      }, 1000 * 5);
    }
  },
  beforeDestroy() {
    if (this.timer) {
      clearInterval(this.timer);
    }
  },
  methods: {
    getTopScoreData() {
      queryTrainingScore({ room_id: this.room_id }).then((res) => {
        this.trainingScoreData = _.get(res, 'data.data', []) || [];
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.train-score {
  width: 100%;
  padding-left: 10px;
  .single-person {
    display: flex;
    align-items: center;
    width: 100%;
    height: 34px;
    margin-bottom: 12px;
    &:last-child {
      margin-bottom: 0;
    }
    .rank {
      width: 25px;
      height: 28px;
      font-size: 16px;
      font-family: youshebiaotihei !important;
      color: #ffffff;
      text-align: center;
      margin-right: 7px;
      padding-top: 3px;
      position: relative;
      .number-bg {
        position: absolute;
        width: 18px;
        height: 25px;
        top: 0;
        left: 0;
      }
    }
    .user-info {
      display: flex;
      align-items: center;
      margin-right: 5px;
      width: calc(100% - 138px);
      .user-img {
        width: 34px;
        height: 34px;
        border-radius: 50%;
        margin-right: 3px;
        background: linear-gradient(
          145deg,
          #ade5ff 0%,
          rgba(7, 230, 204, 0) 100%
        );
        border-image: linear-gradient(
            180deg,
            rgba(173, 229, 255, 1),
            rgba(59, 193, 255, 0.41)
          )
          1 1;
        img {
          width: 100%;
          height: 100%;
          border-radius: 50%;
        }
      }
      .user-name {
        width: calc(100% - 34px);
        font-size: 14px;
        font-family: PingFangSC-Semibold !important;
        font-weight: 600;
        color: #ffffff;
        line-height: 20px;
      }
    }
    .score {
      width: 62px;
      display: flex;
      align-items: flex-start;
      .score-value {
        font-size: 16px;
        font-family: OPPOSans-H !important;
        font-weight: normal;
        color: #ffffff;
        margin-right: 3px;
        // line-height: 25px;
      }
      .score-desc {
        font-size: 12px;
        font-family: PingFangSC-Regular !important;
        font-weight: 400;
        color: #ffffff;
        position: relative;
        top: 3px;
        // line-height: 17px;
      }
    }
  }
}
</style>
