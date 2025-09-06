<template>
  <div class="right-wrapper">
    <div v-show="show">
      <div>
        <block
          :title="$t('screenBusiness.realTimeAttack')"
          :box-width="324"
          :box-height="140"
          :box-top="40"
          :box-right="30"
          :show-info="true"
        >
          <real-time-attack :data="realTimeData"></real-time-attack>
        </block>
      </div>

      <div>
        <block
          :title="$t('screenBusiness.attackTraffic')"
          :box-width="324"
          :box-height="200"
          :box-top="210"
          :box-right="30"
        >
          <attack-flow :data="attackFlowData"></attack-flow>
        </block>
      </div>

      <div style="margin: 16px 0">
        <block
          :title="$t('screenBusiness.attackTrend')"
          :box-width="324"
          :box-height="200"
          :box-top="425"
          :box-right="30"
        >
          <attack-trend :data="attackTrendData"></attack-trend>
        </block>
      </div>

      <div>
        <block
          :title="$t('screenBusiness.attackLog')"
          :box-width="324"
          :box-height="270"
          :box-top="640"
          :box-right="30"
        >
          <attack-log :data="attackLogData"></attack-log>
        </block>
      </div>
    </div>
  </div>
</template>

<script>
import _ from 'lodash';
import Block from './block.vue';
import RealTimeAttack from './real-time-attack.vue';
import AttackFlow from './attack-flow.vue';
import AttackTrend from './attack-trend.vue';
import AttackLog from './attack-log.vue';
import { queryAttackTrend, queryAttackLog, queryAttackTimes } from '../api';
import { dateFormat } from '@/utils';
export default {
  components: {
    Block,
    RealTimeAttack,
    AttackLog,
    AttackFlow,
    AttackTrend,
  },
  props: {
    show: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      room_id: '',
      scene_id: '',
      attackFlowData: [],
      attackTrendData: [],
      attackLogData: [],
      realTimeData: [],
      timer: null,
    };
  },
  created() {
    this.room_id = this.$route.params.id;
    this.scene_id = this.$route.query.scene_id;
    if (this.scene_id) {
      this.getAttackData();
      this.getAttackLogData();
      this.getRealTimeData();
      this.timer = setInterval(() => {
        this.getAttackData();
        this.getAttackLogData();
        this.getRealTimeData();
      }, 1000 * 5);
    }
  },
  beforeDestroy() {
    if (this.timer) {
      clearInterval(this.timer);
    }
  },
  methods: {
    getAttackData() {
      queryAttackTrend({ sceneId: this.scene_id }).then((res) => {
        const data = _.get(res, 'data.data', []) || [];
        this.attackFlowData = data.map((el) => ({
          name: dateFormat(new Date(el.time), 'HH:mm:ss'),
          value: el.data_size,
        }));
      });
      queryAttackTrend({ sceneId: this.scene_id, type: 1 }).then((res) => {
        const data = _.get(res, 'data.data', []) || [];
        this.attackTrendData = data.map((el) => ({
          name: dateFormat(new Date(el.time), 'HH:mm:ss'),
          value: el.data_size,
        }));
      });
    },
    getAttackLogData() {
      queryAttackLog({ id: this.scene_id }).then((res) => {
        const data = _.get(res, 'data.data.list', []) || [];
        this.attackLogData = data.map((el) => ({
          ...el,
          time: dateFormat(new Date(el.time), 'HH:mm:ss'),
          attack_type: el.attack_info.attack_type,
        }));
      });
    },
    getRealTimeData() {
      queryAttackTimes({ sceneId: this.scene_id }).then((res) => {
        const data = _.get(res, 'data.data', []) || [];
        const count =
          _.reduce(
            data,
            (result, value) => {
              return result + value;
            },
            0,
          ) || 0; // 总攻击次数为累计相加值
        const result = _.padStart(count, 6, '0'); // 固定保持6位
        this.realTimeData = [...result];
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.right-wrapper {
  height: 100%;
  width: 324px;
  padding-top: 40px;
  padding-bottom: 30px;
  // padding: 40px 30px 0px 0px;
  position: absolute;
  z-index: 12;
  // right: 30px;
  right: 0px;
  top: 0px;

  display: flex;
  flex-direction: column;
  background-image: url(~@/assets/img/visual-screen/screen-business/right_bg.png);
  background-size: 100% 100%;
  &::before {
    content: '';
    display: block;
    position: absolute;
    inset: 0;
    background-image: url(~@/assets/img/visual-screen/screen-business/decoration_right.png);
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
