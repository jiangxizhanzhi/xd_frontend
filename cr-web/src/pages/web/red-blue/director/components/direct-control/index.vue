<template>
  <div class="direct-control">
    <div class="main-wrap">
      <div class="left-wrap">
        <div class="outer-wrap">
          <div
            class="direct-type"
            :key="index"
            v-for="(item, index) in directTypeList"
            :class="[active === index ? 'active' : '']"
            @click="handleClick(index)"
            v-show="item.show"
          >
            <div class="img-wrap">
              <cb-iconfont :size="24" :type="item.icon"></cb-iconfont>
            </div>
            <span class="name">{{ item.name }}</span>
          </div>
        </div>
      </div>
      <div class="right-wrap">
        <environment-direct
          v-if="active === 0"
          @sendData="sendData"
        ></environment-direct>
        <task-direct
          v-if="active === 1"
          :cr-event-data="crEventData"
        ></task-direct>
        <behavior-direct
          v-if="active === 2"
          :cr-event-data="crEventData"
          :controlSceneId="sceneId"
          :active="active"
        ></behavior-direct>
        <!-- 5.4.1新的导演态势导调 -->
        <situation-direct
          v-if="active === 3"
          :controlSceneId="sceneId"
          :controlTopoId="topoId"
          :screenName="screenName"
        ></situation-direct>
      </div>
    </div>
    <div class="footer">
      <div class="center-footer fl">
        <div class="timeBox">
          <div class="astronomicalBox fl">
            <div class="editBox">
              <span class="time-desc">{{ $t('m.astronomicalTime') }}</span>
            </div>
            <div>
              <div class="time">
                <span class="time-y">{{ value1 }}</span>
                <span class="time">{{ value2 }}</span>
              </div>
            </div>
          </div>
          <div class="combatBox fl">
            <div class="editBox">
              <span>{{ $t('m.operationalTime') }}</span>
            </div>
            <div>
              <div class="time">
                <span class="time-y">{{ operationalValue2 }}</span>
                <span class="time">{{ operationalValue1 }}</span>
                <div
                  clsaa="rate-value"
                  style="
                    position: absolute;
                    bottom: 5px;
                    left: 165px;
                    font-size: 14px;
                    height: 20px;
                    line-height: 26px;
                    white-space: nowrap;
                  "
                >
                  {{ $t('m.rate') }}：{{ rateSubmitValue }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="right-footer fl right-footer-single">
        <!-- role_group="2"是导演 -->
        <time-line :scale-times="scaleTimes" :role_group="2" />
      </div>
    </div>
    <!--时间速率弹窗-->
    <cb-dialog :visible.sync="dialogRateTime" width="25%" center>
      <span slot="title">
        {{ rateTimeTitle }}
      </span>
      <template>
        <div v-show="showRate" class="rate">
          <div v-if="isShowRate" class="magT10">
            <cb-form label-width="60px" label-position="right">
              <cb-form-item :label="rateLeftLabel">
                <cb-select
                  v-model="rateValue"
                  class="rate-select elc-select"
                  style="width: 100%"
                >
                  <cb-option
                    v-for="(item, index) in rateList"
                    :key="index"
                    :label="item.rate"
                    :value="item.rate"
                  />
                </cb-select>
              </cb-form-item>
            </cb-form>
          </div>
        </div>
        <div v-show="showRate" class="rate">
          <div v-if="isShowRate" class="magT10 time-box">
            <cb-form
              ref="operationalForm"
              :model="model"
              :rules="rules"
              label-width="60px"
              label-position="right"
            >
              <cb-form-item
                prop="operationalValue"
                :label="$t('m.time')"
                class="elc-date-picker"
              >
                <cb-date-picker
                  v-model="model.operationalValue"
                  type="datetime"
                  default-time="12:00:00"
                  style="width: 100%"
                />
              </cb-form-item>
            </cb-form>
          </div>
        </div>
        <!--以上为作战时间和速率，下面为天文时间-->
        <div v-show="!showRate" class="rate">
          <div class="magT10 time-box">
            <!--<span class="label-span">{{ $t('m.time') }}</span>-->
            <cb-form
              ref="valueForm"
              :model="model2"
              :rules="rules2"
              label-width="60px"
              label-position="right"
            >
              <cb-form-item prop="value3" :label="$t('m.time')">
                <cb-date-picker
                  v-model="model2.value3"
                  :disabled="!isShowRate"
                  type="datetime"
                  default-time="12:00:00"
                  style="width: 100%"
                />
              </cb-form-item>
            </cb-form>
          </div>
        </div>
      </template>
      <span slot="footer" class="dialog-footer">
        <cb-button-group>
          <cb-button @click="saveTime()">{{ $t('m.ensure') }}</cb-button>
          <cb-button hollow @click="dialogRateTime = false">{{
            $t('common.cancel')
          }}</cb-button>
        </cb-button-group>
      </span>
    </cb-dialog>
  </div>
</template>

<script>
import wsutil from '@/utils/websocket';
import utils from '@/utils/utils';
import TimeLine from '@/components/TimeLine/redBlueTimeLine.vue';
// 环境导调
import environmentDirect from './environment-direct/index';
import taskDirect from './task-direct/index';
import behaviorDirect from './behavior-direct/index';
// import situationDirect from './situation-direct/index'; 5.4旧的态势导调
import situationDirect from './direct-situation/index'; //5.4.1新的态势导调
import { timeLine } from '@/api/web/red-blue.js';
export default {
  components: {
    environmentDirect,
    taskDirect,
    behaviorDirect,
    situationDirect,
    TimeLine,
  },
  props: {
    isShowRate: {
      type: Boolean,
      default: true,
    },
    value1: {
      type: String,
      default: '',
    },
    value2: {
      type: String,
      default: '',
    },
    screenName: {
      type: String,
      default: '',
    },
    operationalValue2: {
      type: String,
      default: '',
    },
    operationalValue1: {
      type: String,
      default: '',
    },
    rateSubmitValue: {
      type: [String, Number],
      default: '',
    },
    crEventData: {
      type: Object,
      default: () => {},
    },
    isShowSituationData: {
      type: [Boolean, String],
      default: false,
    },
  },
  data() {
    return {
      showSituation: false,
      cookie: '',
      resource_id: '',
      active: 0,
      directTypeList: [
        {
          icon: 'icon-tuopu1',
          name: this.$t('rbt.environmentModulation'),
          show: true,
        },
        {
          icon: 'icon-renwudaotiao',
          name: this.$t('rbt.taskModulation'),
          show: true,
        },
        {
          icon: 'icon-liuliang',
          name: this.$t('rbt.behaviorModulation'),
          show: true,
        },
        {
          icon: 'icon-taishidaotiao',
          name: this.$t('rbt.situationModulation'),
          show: true,
        },
      ],
      dialogRateTime: false,
      rateTimeTitle: '',
      showRate: false,
      rateLeftLabel: this.$t('m.rate'),
      rateValue: 1,
      rateList: [
        { id: 1, rate: 1 },
        { id: 2, rate: 2 },
        { id: 3, rate: 3 },
        { id: 4, rate: 4 },
        { id: 5, rate: 5 },
      ],
      scaleTimes: {
        data: [],
        start_time: '',
        end_time: '',
        duration_time: '',
      },
      model: {
        operationalValue: '',
      },
      rules: {
        operationalValue: [
          {
            required: true,
            message: this.$t('m.selectTime'),
            trigger: ['blur', 'change'],
          },
        ],
      },
      model2: {
        value3: '',
      },
      rules2: {
        value3: [
          {
            required: true,
            message: this.$t('m.selectTime'),
            trigger: ['blur', 'change'],
          },
        ],
      },
      refreshTime: null,
      sceneId: '',
      topoId: '',
    };
  },
  watch: {
    isShowSituationData: {
      handler(nv) {
        if (nv) {
          this.directTypeList.forEach((item) => {
            if (item.name === this.$t('rbt.situationModulation')) {
              item.show = true;
            }
          });
        } else {
          this.directTypeList.forEach((item) => {
            if (item.name === this.$t('rbt.situationModulation')) {
              item.show = false;
            }
          });
        }
      },
      immediate: true,
    },
  },
  computed: {},
  created() {
    this.resource_id = this.$route.params && this.$route.params.resource_id;
  },
  mounted() {
    this.cookie = utils.getCookie('cr_jwttoken');
    this.initTimeLineData();
    this.refreshTime = setInterval(() => {
      this.initTimeLineData();
    }, 60000);
    this.statusWs();
  },
  beforeDestroy() {
    clearInterval(this.refreshTime);
  },
  destroy() {},
  methods: {
    handleClick(index) {
      this.active = index;
    },
    sendData(data1, data2, data3) {
      this.sceneId = data1;
      this.topoId = data2;
      this.$emit('sendData', data1, data2, data3);
    },
    // 编辑时间
    editTime(state) {
      this.dialogRateTime = true;
      if (state === 'combat') {
        this.showRate = true;
        this.rateTimeTitle =
          this.$t('m.operationalTime') + this.$t('common.edit');
      } else {
        this.showRate = false;
        this.rateTimeTitle =
          this.$t('m.astronomicalTime') + this.$t('common.edit');
      }
    },
    saveTime() {
      // this.dialogRateTime = false
      if (this.showRate && this.isShowRate) {
        this.$refs.operationalForm.validate((valid) => {
          if (valid) {
            // 保存作战时间
            this.$emit('sure2', this.model.operationalValue, this.rateValue);
            // this.sure2();
            this.dialogRateTime = false;
            this.$message({
              type: 'success',
              message: this.$t('m.SuccessfullyModified'),
            });
          }
        });
      } else {
        this.$refs.valueForm.validate((valid) => {
          if (valid) {
            // 保存天文时间
            this.$emit('sure', this.model2.value3);
            // this.sure();
            this.$message({
              type: 'success',
              message: this.$t('m.SuccessfullyModified'),
            });
            this.dialogRateTime = false;
          }
        });
      }
    },
    // 获取导演时间列表
    initTimeLineData() {
      this.scaleTimes = {};
      // 导演登录获取作战时间
      timeLine({ resource_id: this.resource_id }).then((res) => {
        this.scaleTimes = res.data.data;
      });
    },
    statusWs() {
      wsutil.bind(
        `/ojj/ws/cr/ce_base/mission?business_id=${this.resource_id}&token=${this.cookie}`,
        (data) => {
          console.log(data.code, '红蓝导员ws');
          if (data.code === 1 || data.code === 9) {
            // 导演监听到学员任务状态变化（时间轴）
            console.log(data.code, '红蓝导员成功');
            this.initTimeLineData();
          }
        },
      );
    },
  },
};
</script>
<style lang="scss" scoped>
.direct-control {
  width: 100%;
  height: 100%;
  .main-wrap {
    width: 100%;
    // height: 100%;
    height: calc(100% - 56px);
    display: flex;
    .left-wrap {
      .outer-wrap {
        width: 80px;
        min-height: 240px;
        border-radius: 4px;
        border: 1px solid var(--bg-color-2);
        .direct-type {
          width: 100%;
          height: 80px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          color: var(--neutral8);
          border-radius: 4px;
          cursor: pointer;
          .img-wrap {
            width: 24px;
            height: 24px;
            .cb-iconfont {
              width: 100%;
              height: 100%;
            }
          }
          .name {
            margin-top: 8px;
            font-size: 14px;
          }
        }

        .active {
          background: var(--bg-color-2);
          color: var(--primary-color);
        }
      }
      .direct-type:hover {
        background: var(--bg-color-2);
      }
    }
    .right-wrap {
      width: calc(100% - 96px);
      margin-left: 16px;
    }
  }

  .footer {
    width: 100%;
    box-sizing: border-box;
    height: 56px;
    position: fixed;
    bottom: 0px;
    left: 40px;
    .center-footer {
      height: 56px;
      margin-right: 80px;
      box-sizing: border-box;
    }
    .right-footer-single {
      width: calc(100% - 492px) !important;
    }
    .right-footer {
      width: calc(100% - 710px);
      height: 100%;
    }
    .left-button-group-unstart {
      width: 10.07%;
    }
    .right-footer-unstart {
      width: 63.74%;
    }
    .timeBox {
      width: 100%;
      height: 100%;
      display: flex;
      justify-content: space-between;
      align-items: center;
      // .astronomicalBox {
      //   width: 45.64%;
      // }
      .combatBox {
        // width: 45.64%;
        .editBox {
          span {
            font-size: 12px;
            white-space: nowrap;
            color: var(--neutral5);
          }
        }
      }
      .editBox {
        margin-bottom: 7px;
        display: flex;
        align-items: center;
        .time-desc {
          font-weight: 400;
          font-size: 12px;
          color: var(--neutral5);
        }
        span {
          font-size: 14px;
        }
      }
      .time {
        height: 100%;
        border-radius: 6px;
        width: 165px;
        position: relative;
        display: flex;
        align-items: center;
        .time {
          width: 80px;
          font-size: 16px;
          font-weight: bold;
          color: var(--neutral8);
        }
        .time-y {
          width: 90px;
          font-weight: bold;
          font-size: 16px;
          margin: 2px 0;
          color: var(--neutral8);
        }
      }
    }
  }
}
</style>
