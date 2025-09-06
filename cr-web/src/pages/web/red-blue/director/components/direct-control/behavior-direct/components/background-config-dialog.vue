<template>
  <cb-dialog
    :visible.sync="backgroundIsShow"
    append-to-body
    @close="handleClose"
    top="50px"
    width="850px"
    height="640px"
  >
    <!--头部-->
    <template slot="title">
      <div class="dialog-title">
        {{ $t('rbt.disposition') }}
      </div>
    </template>
    <div class="main-content">
      <cb-form ref="fromRef" :rules="rules" :model.sync="model">
        <div class="one-content">
          <!-- 通用配置 -->
          <div class="top-title">
            <block fontSize="16" :title="$t('rbt.generalConfig')"> </block>
            <cb-form-item
              :label="$t('rbt.continueExecution') + ':'"
              :class="language == 'en-US' ? 'sing-style-en' : 'sing-style'"
            >
              <cb-switch
                v-model="model.keep_running"
                @change="changeStatusOne"
                :active-value="1"
                :inactive-value="0"
              >
              </cb-switch>
            </cb-form-item>
          </div>
          <div class="bottom-content">
            <cb-form-item
              :label="$t('rbt.delay') + ':'"
              prop="common_conf.latency"
            >
              <cb-input
                size="small"
                style="width: 128px"
                v-model="model.common_conf.latency"
                :placeholder="$t('rbt.placeInput')"
              >
                <template slot="append"> ms</template></cb-input
              >
            </cb-form-item>

            <cb-form-item
              :label="$t('rbt.jitter') + ':'"
              prop="common_conf.jitter"
            >
              <cb-input
                size="small"
                style="width: 128px"
                v-model="model.common_conf.jitter"
                :placeholder="$t('rbt.placeInput')"
              >
                <template slot="append"> ms</template></cb-input
              >
            </cb-form-item>

            <cb-form-item :label="$t('IPG') + ':'" prop="common_conf.ipg">
              <cb-input
                size="small"
                style="width: 128px"
                v-model="model.common_conf.ipg"
                :placeholder="$t('rbt.placeInput')"
              >
                <template slot="append"> ms</template></cb-input
              >
            </cb-form-item>
            <cb-form-item
              :label="$t('rbt.durations') + ':'"
              prop="common_conf.duration"
              :class="language == 'en-US' ? 'time-en' : 'time-style'"
            >
              <cb-input
                style="width: 128px"
                size="small"
                v-model="model.common_conf.duration"
                :disabled="isDisabledOne"
                :placeholder="$t('rbt.placeInput')"
              >
                <template slot="append">s</template></cb-input
              >
            </cb-form-item>
          </div>
        </div>
        <div class="two-three-wrapper">
          <div class="switch-config">
            <span class="label">{{ $t('rbt.openConfig') + ': ' }}</span>
            <cb-switch
              v-model="model.config"
              @change="changeStatusConfig"
              :active-value="1"
              :inactive-value="0"
            >
            </cb-switch>
          </div>
          <!-- 速率配置 -->
          <div class="two-content">
            <div class="top-title">
              <block fontSize="16" :title="$t('rbt.rateConfig')"> </block>
            </div>
            <div class="bottom-content">
              <cb-form-item
                :label="$t('rbt.OccurrenceMode') + ':'"
                prop="rate_conf.load_mode"
                :class="language == 'en-US' ? 'mode-en' : 'mode-style'"
              >
                <cb-select
                  :disabled="isDisabledTwo"
                  :options="optionsData"
                  v-model="model.rate_conf.load_mode"
                  style="width: 165px"
                ></cb-select>
              </cb-form-item>
              <template v-if="model.rate_conf.load_mode === 0">
                <cb-form-item
                  :label="$t('rbt.rate') + ':'"
                  prop="rate_conf.rate_max"
                  class="input-style"
                  labelWidth="100px"
                >
                  <cb-tooltip
                    effect="dark"
                    :content="'8Mbps = 1Mb/s'"
                    placement="top-start"
                  >
                    <cb-input
                      :placeholder="$t('rbt.placeInput')"
                      size="small"
                      style="width: 188px"
                      v-model="model.rate_conf.rate_max"
                      :disabled="isDisabledTwo"
                    >
                      <template slot="append"> Mbps</template>
                    </cb-input>
                  </cb-tooltip>
                </cb-form-item>
              </template>
              <template v-else>
                <cb-form-item
                  :label="$t('rbt.rateMin') + ':'"
                  prop="rate_conf.rate_min"
                  class="input-style"
                >
                  <cb-input
                    :placeholder="$t('rbt.placeInput')"
                    size="small"
                    style="width: 138px"
                    v-model="model.rate_conf.rate_min"
                    :disabled="isDisabledTwo"
                  >
                    <template slot="append"> Mb/s</template></cb-input
                  >
                </cb-form-item>
                <cb-form-item
                  :label="$t('rbt.rateMax') + ':'"
                  prop="rate_conf.rate_max"
                  :class="
                    language == 'en-US'
                      ? 'input-style-en rate-en'
                      : 'input-style rate-styles'
                  "
                >
                  <cb-input
                    :placeholder="$t('rbt.placeInput')"
                    type="number"
                    size="small"
                    style="width: 138px"
                    v-model="model.rate_conf.rate_max"
                    :disabled="isDisabledTwo"
                  >
                    <template slot="append"> Mb/s</template></cb-input
                  >
                </cb-form-item>
              </template>
            </div>
          </div>
          <!-- 流配置 -->
          <div class="three-content">
            <div class="top-title">
              <block fontSize="16" :title="$t('rbt.FlowConfig')"> </block>
            </div>
            <div>{{ $t('rbt.TCPConfig') }}</div>
            <div class="middle-content">
              <cb-form-item
                :label="$t('MSS') + ':'"
                prop="flow_conf.tcp_conf.mss"
              >
                <cb-input
                  v-model="model.flow_conf.tcp_conf.mss"
                  :disabled="isDisabledThree"
                ></cb-input>
              </cb-form-item>
              <cb-form-item
                :label="$t('UGR') + ':'"
                prop="flow_conf.tcp_conf.ugr"
              >
                <cb-input
                  v-model="model.flow_conf.tcp_conf.ugr"
                  :disabled="isDisabledThree"
                  :placeholder="$t('rbt.placeInput')"
                ></cb-input>
              </cb-form-item>
              <cb-form-item
                :label="$t('ACK') + ':'"
                prop="flow_conf.tcp_conf.ack"
              >
                <cb-input
                  v-model="model.flow_conf.tcp_conf.ack"
                  :disabled="isDisabledThree"
                  :placeholder="$t('rbt.placeInput')"
                ></cb-input>
              </cb-form-item>
              <cb-form-item
                :label="$t('PSH') + ':'"
                prop="flow_conf.tcp_conf.psh"
              >
                <cb-input
                  v-model="model.flow_conf.tcp_conf.psh"
                  :disabled="isDisabledThree"
                  :placeholder="$t('rbt.placeInput')"
                ></cb-input>
              </cb-form-item>
              <cb-form-item
                :label="$t('RST') + ':'"
                prop="flow_conf.tcp_conf.rst"
              >
                <cb-input
                  v-model="model.flow_conf.tcp_conf.rst"
                  :disabled="isDisabledThree"
                  :placeholder="$t('rbt.placeInput')"
                ></cb-input>
              </cb-form-item>
              <cb-form-item
                :label="$t('SYN') + ':'"
                prop="flow_conf.tcp_conf.syn"
              >
                <cb-input
                  v-model="model.flow_conf.tcp_conf.syn"
                  :disabled="isDisabledThree"
                  :placeholder="$t('rbt.placeInput')"
                ></cb-input>
              </cb-form-item>
              <cb-form-item
                :label="$t('FIN') + ':'"
                prop="flow_conf.tcp_conf.fin"
              >
                <cb-input
                  v-model="model.flow_conf.tcp_conf.fin"
                  :disabled="isDisabledThree"
                  :placeholder="$t('rbt.placeInput')"
                ></cb-input>
              </cb-form-item>
              <cb-form-item
                :label="$t('rbt.sourcePort') + ':'"
                :class="language == 'en-US' ? 'port-style-en' : 'port-style'"
                prop="flow_conf.tcp_conf.sport"
              >
                <cb-input
                  v-model="model.flow_conf.tcp_conf.sport"
                  :disabled="isDisabledThree"
                  :placeholder="$t('rbt.placeInput')"
                ></cb-input>
              </cb-form-item>
              <cb-form-item
                :label="$t('rbt.destinationPort') + ':'"
                :class="language == 'en-US' ? 'port-styles-en' : 'port-styles'"
                prop="flow_conf.tcp_conf.dport"
              >
                <cb-input
                  v-model="model.flow_conf.tcp_conf.dport"
                  :disabled="isDisabledThree"
                  :placeholder="$t('rbt.placeInput')"
                ></cb-input>
              </cb-form-item>
            </div>

            <div>{{ $t('rbt.IPv4Config') }}</div>
            <div class="bottom-content">
              <cb-form-item
                :label="$t('TTL') + ':'"
                prop="flow_conf.ipv4_conf.ttl"
              >
                <cb-input
                  v-model="model.flow_conf.ipv4_conf.ttl"
                  :disabled="isDisabledThree"
                ></cb-input>
              </cb-form-item>
              <cb-form-item
                :label="$t('TOS/DSCP') + ':'"
                class="tos-style"
                prop="flow_conf.ipv4_conf.dscp"
              >
                <cb-input
                  v-model="model.flow_conf.ipv4_conf.dscp"
                  :disabled="isDisabledThree"
                  :placeholder="$t('rbt.placeInput')"
                ></cb-input>
              </cb-form-item>
              <cb-form-item
                :label="$t('rbt.sourceIp') + ':'"
                :class="language == 'en-US' ? 'ip-style-en' : 'ip-style'"
                prop="flow_conf.ipv4_conf.sip"
              >
                <cb-input
                  v-model="model.flow_conf.ipv4_conf.sip"
                  :disabled="isDisabledThree"
                  :placeholder="$t('rbt.placeInput')"
                ></cb-input>
              </cb-form-item>
              <cb-form-item
                :label="$t('rbt.destinationIP') + ':'"
                :class="language == 'en-US' ? 'ip-styles-en' : 'ip-styles'"
                prop="flow_conf.ipv4_conf.dip"
              >
                <cb-input
                  v-model="model.flow_conf.ipv4_conf.dip"
                  :disabled="isDisabledThree"
                  :placeholder="$t('rbt.placeInput')"
                ></cb-input>
              </cb-form-item>
            </div>
          </div>
        </div>
      </cb-form>
    </div>
    <!-- 底部按钮 -->
    <div slot="footer" class="dialog-footer">
      <cb-button button-type="confirm" @click="confirmFn" mr> </cb-button>
      <cb-button button-type="cancel" @click="cancelFn"> </cb-button>
    </div>
  </cb-dialog>
</template>

<script>
import block from '@/components/block';
import { configFlowApi } from '@/api/web/team-training';
import { getLanguage } from '@cyber/helper';
export default {
  components: {
    block,
  },
  props: {
    // 接收是否展示背景配置弹框
    backgroundShow: {
      type: Boolean,
      default: false,
    },
    // 接收背景流量数据
    backData: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      language: getLanguage(),
      rules: {
        // 延时 latency0-1000
        'common_conf.latency': [
          {
            pattern: /^(0|[1-9]\d{0,2}|1000)$/,
            message: this.$t('rbt.enterInteger'),
            trigger: ['blur', 'change'],
          },
        ],
        // 抖动0-1000

        'common_conf.jitter': [
          {
            pattern: /^(0|[1-9]\d{0,2}|1000)$/,
            message: this.$t('rbt.enterInteger'),
            trigger: ['blur', 'change'],
          },
        ],

        // ipg0-1000
        'common_conf.ipg': [
          {
            pattern: /^(0|[1-9]\d{0,2}|1000)$/,
            message: this.$t('rbt.enterInteger'),
            trigger: ['blur', 'change'],
          },
        ],
        // 速率min
        'rate_conf.rate_min': [
          { validator: this.checkRate, trigger: ['blur', 'change'] },
        ],
        // 速率max
        'rate_conf.rate_max': [
          { validator: this.checkRate, trigger: ['blur', 'change'] },
        ],
        // ttl0-255
        'flow_conf.ipv4_conf.ttl': [
          { validator: this.checkTtl, trigger: ['blur', 'change'] },
        ],
        // mss0-9146
        'flow_conf.tcp_conf.mss': [
          { validator: this.checkTcpConf, trigger: ['blur', 'change'] },
        ],
        // fin0或1
        'flow_conf.tcp_conf.fin': [
          {
            pattern: /^[01]$/,
            message: this.$t('rbt.enterOne'),
            trigger: ['blur', 'change'],
          },
        ],
        'flow_conf.tcp_conf.syn': [
          {
            pattern: /^[01]$/,
            message: this.$t('rbt.enterOne'),
            trigger: ['blur', 'change'],
          },
        ],
        'flow_conf.tcp_conf.rst': [
          {
            pattern: /^[01]$/,
            message: this.$t('rbt.enterOne'),
            trigger: ['blur', 'change'],
          },
        ],
        'flow_conf.tcp_conf.psh': [
          {
            pattern: /^[01]$/,
            message: this.$t('rbt.enterOne'),
            trigger: ['blur', 'change'],
          },
        ],
        'flow_conf.tcp_conf.ack': [
          {
            pattern: /^[01]$/,
            message: this.$t('rbt.enterOne'),
            trigger: ['blur', 'change'],
          },
        ],
        'flow_conf.tcp_conf.ugr': [
          {
            pattern: /^[01]$/,
            message: this.$t('rbt.enterOne'),
            trigger: ['blur', 'change'],
          },
        ],
        // 源端口0-65535
        'flow_conf.tcp_conf.sport': [
          { validator: this.checkPort, trigger: ['blur', 'change'] },
        ],
        // 目的端口0-65535
        'flow_conf.tcp_conf.dport': [
          { validator: this.checkPort, trigger: ['blur', 'change'] },
        ],
        // TOS?DSCP
        'flow_conf.ipv4_conf.dscp': [
          { validator: this.checkTos, trigger: ['blur', 'change'] },
        ],
        // 源ip
        'flow_conf.ipv4_conf.sip': [
          { validator: this.checkIp, trigger: ['blur', 'change'] },
        ],
        //目的ip
        'flow_conf.ipv4_conf.dip': [
          { validator: this.checkIp, trigger: ['blur', 'change'] },
        ],
      },
      backgroundIsShow: this.backgroundShow,
      flow_task_conf: {},
      optionsData: [
        { label: this.$t('rbt.uniformDistribution'), value: 0 },
        { label: this.$t('rbt.randomDistribution'), value: 1 },
        { label: this.$t('rbt.binomialDistribution'), value: 2 },
        { label: this.$t('rbt.exponentDistribution'), value: 3 },
        { label: this.$t('rbt.gaussDistribution'), value: 4 },
      ],
      // 三个switch开关
      isDisabledOne: false,
      isDisabledTwo: false,
      isDisabledThree: false,
      model: {
        keep_running: 0,
        rate_unlimited: 0,
        replay: 0,
        config: 0,
        // 速率配置
        rate_conf: {
          rate_max: '', //最大速率
          rate_min: '', //最小速率
          load_mode: 0,
        },
        // 通用配置
        common_conf: {
          duration: '', //时长
          ipg: '',
          latency: 0, //延时
          jitter: 0, //抖动
        },
        // 流配置
        flow_conf: {
          // TCP配置
          tcp_conf: {
            ack: '',
            dport: '', //目的端口
            fin: '',
            mss: 1460,
            psh: '',
            rst: '',
            sport: '', //源端口
            ugr: '',
            syn: '',
          },

          // 	IPV4配置
          ipv4_conf: {
            dscp: 'ff',
            sip: '', //源ip
            dip: '', //目的ip
            ttl: 32,
          },
        },
      },
    };
  },
  created() {},
  mounted() {},
  methods: {
    // 端口校验
    checkPort(rule, value, callback) {
      const reg = /(^[1-9]\d*$)/;
      if (value) {
        if (reg.test(value) && Number(value) >= 0 && Number(value) <= 65535) {
          callback();
        } else {
          callback(new Error(this.$t('rbt.enterSix')));
        }
      } else {
        callback();
      }
    },

    // 速率校验
    checkRate(rule, value, callback) {
      const reg = /(^[1-9]\d*$)/;
      if (value) {
        if (reg.test(value) && Number(value) >= 0 && Number(value) <= 2048) {
          callback();
        } else {
          callback(new Error(this.$t('rbt.enterFour')));
        }
      } else {
        callback();
      }
    },

    // ttl校验

    checkTtl(rule, value, callback) {
      const reg = /(^[1-9]\d*$)/;
      if (value) {
        if (reg.test(value) && Number(value) >= 0 && Number(value) <= 255) {
          callback();
        } else {
          callback(new Error(this.$t('rbt.enterTwo')));
        }
      } else {
        callback();
      }
    },
    // mss校验
    checkTcpConf(rule, value, callback) {
      const reg = /(^[1-9]\d*$)/;
      if (value) {
        if (reg.test(value) && Number(value) >= 0 && Number(value) <= 9146) {
          callback();
        } else {
          callback(new Error(this.$t('rbt.enterNine')));
        }
      } else {
        callback();
      }
    },
    // tos/dscp校验
    checkTos(rule, value, callback) {
      const reghex = /^[A-Fa-f0-9]{1,4}$/;
      if (value) {
        if (reghex.test(value)) {
          if (parseInt(value, 16) >= 0 && parseInt(value, 16) <= 255) {
            callback();
          } else {
            callback(new Error(this.$t('rbt.enterF')));
          }
        } else {
          callback(new Error(this.$t('rbt.enterF')));
        }
      } else {
        callback();
      }
    },
    // ip校验
    checkIp(rule, value, callback) {
      const ipRexp = /^(\d+)\.(\d+)\.(\d+)\.(\d+)$/;
      if (value) {
        if (!ipRexp.test(value)) {
          value.match(ipRexp);
          if (
            !(
              RegExp.$1 <= 255 &&
              RegExp.$1 > 0 &&
              RegExp.$2 <= 255 &&
              RegExp.$2 >= 0 &&
              RegExp.$3 <= 255 &&
              RegExp.$3 >= 0 &&
              RegExp.$4 <= 255 &&
              RegExp.$4 >= 0
            )
          ) {
            callback(new Error(this.$t('rbt.enterIps')));
          }
        } else {
          callback();
        }
      } else {
        callback();
      }
    },
    // 持续执行开关
    changeStatusOne(data) {
      if (data) {
        this.isDisabledOne = true;
        this.model.keep_running = data;
        // this.model.common_conf = {};
      } else {
        this.isDisabledOne = false;
      }
    },
    // 速率配置和流配置控制按钮
    changeStatusConfig(data) {
      this.isDisabledTwo = !data;
      this.isDisabledThree = !data;
    },
    // 点击关闭背景流量配置弹窗
    handleClose() {
      this.$emit('closeBackgroundDialog', false);
    },
    // 点击确定
    confirmFn() {
      this.$refs['fromRef'].validate((valid) => {
        if (valid) {
          if (this.model.rate_conf.load_mode === 0) {
            this.model.rate_conf.rate_min = undefined;
          }
          this.flow_task_conf = {
            ...this.model,
          };
          configFlowApi({
            flow_task_conf: this.flow_task_conf,
            task_id: this.backData.task_id,
            keep_running: this.model.keep_running,
            rate_unlimited: this.model.rate_unlimited,
            replay: this.model.replay,
            config: this.model.config,
          }).then((res) => {});
          this.handleClose();
        }
      });
    },
    //点击取消
    cancelFn() {
      this.handleClose();
      this.model = {
        keep_running: 0,
        rate_unlimited: 0,
        replay: 0,
        config: 0,
        // 速率配置
        rate_conf: {
          rate_max: '', //最大速率
          rate_min: '', //最小速率
          load_mode: 0,
        },
        // 通用配置
        common_conf: {
          duration: '', //时长
          ipg: '',
          latency: 0, //延时
          jitter: 0, //抖动
        },
        // 流配置
        flow_conf: {
          // TCP配置
          tcp_conf: {
            ack: '',
            dport: '', //目的端口
            fin: '',
            mss: 1460,
            psh: '',
            rst: '',
            sport: '', //源端口
            ugr: '',
            syn: '',
          },

          // 	IPV4配置
          ipv4_conf: {
            dscp: 'ff',
            sip: '', //源ip
            dip: '', //目的ip
            ttl: 32,
          },
        },
      };
    },
  },
  watch: {
    backgroundShow: {
      handler(val) {
        this.backgroundIsShow = val;
      },
    },
    backData: {
      handler(val, oldVal) {
        if (val) {
          this.backData = val;
          // 三个switch
          this.model.keep_running = this.backData.keep_running;
          this.model.rate_unlimited = this.backData.rate_unlimited;
          this.model.replay = this.backData.replay;
          this.model.config = this.backData.config;

          if (this.model.keep_running === 1) {
            this.isDisabledOne = true;
          } else {
            this.isDisabledOne = false;
          }
          if (this.model.config === 1) {
            this.isDisabledTwo = false;
            this.isDisabledThree = false;
          } else {
            this.isDisabledTwo = true;
            this.isDisabledThree = true;
          }
          if (
            this.backData &&
            this.backData.flow_task_conf &&
            this.backData.flow_task_conf.common_conf !== null
          ) {
            this.model.common_conf = this.backData.flow_task_conf.common_conf;
          } else {
            this.model.common_conf = {
              duration: '', //时长
              ipg: '',
              latency: 0, //延时
              jitter: 0, //抖动
            };
          }

          if (
            this.backData &&
            this.backData.flow_task_conf &&
            this.backData.flow_task_conf.rate_conf !== null
          ) {
            this.model.rate_conf = this.backData.flow_task_conf.rate_conf;
          } else {
            this.model.rate_conf = {
              rate_max: '', //最大速率
              rate_min: '', //最小速率
              load_mode: 0,
            };
          }

          if (
            this.backData &&
            this.backData.flow_task_conf &&
            this.backData.flow_task_conf.flow_conf !== null
          ) {
            this.model.flow_conf.ipv4_conf =
              this.backData.flow_task_conf.flow_conf.ipv4_conf;
            this.model.flow_conf.tcp_conf =
              this.backData.flow_task_conf.flow_conf.tcp_conf;
          } else {
            this.model.flow_conf.tcp_conf = {
              ack: '',
              dport: '', //目的端口
              fin: '',
              mss: 1460,
              psh: '',
              rst: '',
              sport: '', //源端口
              ugr: '',
              syn: '',
            };
            this.model.flow_conf.ipv4_conf = {
              dscp: 'ff',
              sip: '', //源ip
              dip: '', //目的ip
              ttl: 32,
            };
          }
        }
      },
      immediate: true,
      // deep: true,
    },
  },
};
</script>

<style scoped lang="scss">
::v-deep.main-content {
  width: 100%;
  margin-top: -24px;
  .el-form {
    padding-right: 0 !important;
    .one-content {
      min-height: 162px;
      background: var(--bg-color-3);
      padding: 16px;
      .top-title {
        display: flex;
        justify-content: space-between;

        height: 28px;
        line-height: 28px;
        margin-bottom: 16px;

        .sing-style {
          min-width: 106px;
        }
        .sing-style-en {
          min-width: 170px;
        }
      }

      .bottom-content {
        display: flex;
        flex-wrap: wrap;
        .el-form-item {
          width: 180px;
        }
      }
    }
    .two-three-wrapper {
      position: relative;
      background: var(--bg-color-3);
      padding-top: 16px;
      margin-top: 16px;
      .switch-config {
        .label {
          display: inline-block;
          width: 72px;
        }
        position: absolute;
        right: 16px;
      }
    }
    .two-content {
      min-height: 106px;
      margin: 16px;
      margin-top: 0;
      margin-right: 70px;
      background: var(--bg-color-3);
      border-bottom: 1px solid var(--neutral1);
      .top-title {
        display: flex;
        justify-content: space-between;

        height: 28px;
        line-height: 28px;
        margin-bottom: 16px;

        .sing-style {
          min-width: 120px;
        }
        .sing-style-en {
          min-width: 140px;
        }
      }
      .bottom-content {
        display: flex;
        flex-wrap: wrap;
        .mode-en {
          width: 280px !important;
        }
        .rate-en {
          width: 216px !important;
        }

        .el-form-item {
          width: 250px;
        }
        .input-style {
          width: 214px;
        }
      }
    }
    .three-content {
      min-height: 274px;
      margin-top: 16px;
      background: var(--bg-color-3);
      padding: 16px;
      padding-top: 0;

      .top-title {
        display: flex;
        justify-content: space-between;

        height: 28px;
        line-height: 28px;
        margin-bottom: 16px;

        .sing-style {
          min-width: 148px;
        }
        .sing-style-en {
          min-width: 175px;
        }
      }
      .el-form-item {
        width: 136px;
        .el-form-item__content {
          .el-input {
            width: 80px;
          }
        }
      }
      .middle-content {
        display: flex;
        flex-wrap: wrap;
        margin-top: 16px;
        .port-styles {
          width: 200px;
          .el-form-item__content {
            .el-input {
              width: 128px;
            }
          }
        }
        .port-style {
          width: 200px;
          .el-form-item__content {
            .el-input {
              width: 128px;
            }
          }
        }
        .port-style-en {
          width: 200px;
        }
        .port-styles-en {
          width: 200px;
        }
      }
      .bottom-content {
        margin-top: 16px;
        display: flex;
        flex-wrap: wrap;
        .el-form-item {
          width: 136px;
        }
        .ip-styles {
          width: 180px;
          .el-form-item__content {
            .el-input {
              width: 120px;
            }
          }
        }
        .ip-style {
          width: 180px;
          .el-form-item__content {
            .el-input {
              width: 120px;
            }
          }
        }
        .ip-style-en {
          width: 170px;
        }
        .ip-styles-en {
          width: 190px;
        }
        .tos-style {
          width: 180px;
        }
      }
    }
    .time-en {
      width: 206px !important;
    }
    .time-style {
      min-width: 120px !important;
    }
  }
}
</style>
