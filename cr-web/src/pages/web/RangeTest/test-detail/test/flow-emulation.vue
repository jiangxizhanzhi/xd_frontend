<template>
  <div class="flow-content">
    <div class="left-content">
      <div class="host-title">{{ $t('flowEmulation.hostList') }}</div>
      <div
        :class="['host-item', { hostActive: hostActive === index }]"
        v-for="(item, index) in hostList"
        @click="hostClick(item, index)"
        :key="item.id"
      >
        {{ item.name }}
      </div>
    </div>
    <div class="right-content">
      <div class="table-content content-item">
        <div class="content-title">
          <span></span>
          <span>{{ $t('flowEmulation.flowList') }}</span>
        </div>
        <div class="switch">
          <cb-switch
            v-model="switchBool"
            :active-text="$t('flowEmulation.parallel')"
            :inactive-text="$t('flowEmulation.serial')"
          >
          </cb-switch>
        </div>
        <div class="all-start-btn">
          <cb-button :hollow="true" @click="startAll">{{
            $t('flowEmulation.allStart')
          }}</cb-button>
        </div>
        <div class="table-main">
          <cb-search-table
            :scroll="{ y: 500 }"
            :cols="columns"
            :url="tableUrl"
            :baseURL="baseURL"
            :data="model"
            ref="flowListRef"
            :searchBarBg="false"
          >
            <template v-slot:search>
              <cb-select
                v-model="model.interactive_type"
                :options="flowTypeList"
                clearable="clearable"
                :first="{
                  value: '',
                  label: $t('flowEmulation.allType'),
                }"
              ></cb-select>
            </template>
            <template v-slot:source_ip="scope">
              <div class="column-content">
                <span
                  v-if="!scope.data.columnInputShow && scope.data.source_ip"
                  >{{ scope.data.source_ip }}</span
                >
                <span
                  v-if="
                    scope.data.interactive_type == 1 && !scope.data.source_ip
                  "
                  >-</span
                >
                <cb-input
                  v-if="scope.data.columnInputShow"
                  style="width: 140px; margin-right: 10px"
                  v-model="scope.data.source_ip"
                  autofocus
                  :placeholder="$t('flowEmulation.enterIp')"
                  @blur="blurEvent($event, scope.data)"
                  @keyup.enter.native="handleEnter($event)"
                ></cb-input>
                <span
                  v-if="scope.data.interactive_type !== 1"
                  @click="columnClick(scope.data)"
                >
                  <cb-iconfont
                    style="cursor: pointer; color: #7988a6"
                    type="icon-bianji"
                    size="18"
                  ></cb-iconfont>
                </span>
              </div>
            </template>
            <template v-slot:operate="scope">
              <div class="button-group">
                <span class="start-group">
                  <cb-button
                    @click="startFlow(scope.data)"
                    type="text"
                    buttonType="edit"
                    :disabled="startEnabled(scope.data)"
                    >{{ $t('flowEmulation.start') }}</cb-button
                  >
                  <cb-popover
                    placement="left"
                    trigger="hover"
                    v-if="scope.data.status == 2"
                  >
                    <div class="login-info">
                      {{ scope.data.status_text }}
                    </div>
                    <div slot="reference">
                      <cb-button type="text" colorType="red">！</cb-button>
                    </div>
                  </cb-popover>
                </span>
                <cb-button
                  @click="downloadFlowAction(scope.data)"
                  type="text"
                  buttonType="edit"
                  mr
                  >{{ $t('flowEmulation.downloadFlow') }}</cb-button
                >
              </div>
            </template>
          </cb-search-table>
        </div>
      </div>
      <div class="flow-back content-item">
        <div class="content-title">
          <span></span>
          <span>{{ $t('flowEmulation.flowPlayback') }}</span>
        </div>
        <div class="flow-back-content">
          <div class="back-left">
            <div class="flow-title">{{ flowTitle }}</div>
            <div
              v-show="!emptyLine"
              style="width: 780px; height: 260px"
              ref="line"
            ></div>
            <div v-show="emptyLine" class="no-data">
              <div class="info">
                <cb-iconfont type="icon-zanwuziyuan" size="56"></cb-iconfont>
                <div>{{ $t('flowEmulation.noData') }}</div>
              </div>
            </div>
          </div>
          <div class="back-right">
            <div class="back-right-item">
              <div class="value-group">
                <span>{{ backModel.opackets }}</span
                ><span>pkt</span>
              </div>
              <div class="name-group">
                <span>Total packets</span>
              </div>
            </div>
            <div class="back-right-item">
              <div class="value-group">
                <span>{{ backModel.obytes }}</span
                ><span>kb</span>
              </div>
              <div class="name-group">
                <span>Total bytes</span>
              </div>
            </div>
            <div class="back-right-item" style="margin-bottom: 0">
              <div class="value-group">
                <span>{{ backModel.tx_bps }}</span
                ><span>kb/s</span>
              </div>
              <div class="name-group">
                <span>Total bps</span>
              </div>
            </div>
            <div class="back-right-item" style="margin-bottom: 0">
              <div class="value-group">
                <span>{{ backModel.oerrors }}</span
                ><span></span>
              </div>
              <div class="name-group">
                <span>Total errors</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import * as Echarts from 'echarts';
import {
  getMainInfoList,
  getFlowRecordData,
  allStartFlow,
  downloadFlow,
  batchStart,
  editSourceIp,
  keepRunning,
} from '@/api/web/flow-emulation.js';
import utils from '@/utils/utils';
import wsutil from '@/utils/websocket';
import _ from 'lodash';
export default {
  name: 'flowEmulation',
  data() {
    return {
      listen: new this.$ListenDomChange({
        dom: document.body,
        callback: this.listenFunc,
      }),
      sceneId: '',
      taskId: '',
      emptyLine: true,
      switchBool: false,
      hostList: [],
      tableUrl: '/cr/eval/task/flow/list',
      baseURL: '/api/ojj',
      model: {
        interactive_type: '',
        node_id: '',
        task_id: '',
        test: '',
        flow_id: '',
        is_all_flow: '',
      },
      flowTypeList: [
        {
          label: this.$t('flowEmulation.backgroundFlow'),
          value: 0,
        },
        {
          label: this.$t('flowEmulation.attackFlow'),
          value: 1,
        },
      ],
      columns: [
        {
          label: this.$t('flowEmulation.flow'),
          prop: 'name',
        },
        {
          label: this.$t('flowEmulation.sourceIp'),
          /* prop: 'source_ip', */
          slot: 'source_ip',
        },
        {
          label: this.$t('flowEmulation.flowClassification'),
          getData: (row) => {
            let category = row.category;
            if (category === 0) {
              return this.$t('flowEmulation.testFlow');
            } else if (category === 1) {
              return this.$t('flowEmulation.testFlow');
            } else if (category === 2) {
              return this.$t('flowEmulation.networkManagement');
            } else if (category === 3) {
              return 'P2P';
            } else if (category === 4) {
              return this.$t('flowEmulation.finance');
            } else if (category === 5) {
              return this.$t('flowEmulation.email');
            } else if (category === 6) {
              return this.$t('flowEmulation.appUpdate');
            } else if (category === 7) {
              return this.$t('flowEmulation.distributedComputation');
            } else if (category === 8) {
              return this.$t('flowEmulation.telephone');
            } else if (category === 9) {
              return this.$t('flowEmulation.mobileDevices');
            } else if (category === 10) {
              return this.$t('flowEmulation.instantMessaging');
            } else if (category === 11) {
              return 'SCADA';
            } else if (category === 12) {
              return this.$t('flowEmulation.maneuvering');
            } else if (category === 13) {
              return this.$t('flowEmulation.remoteControl');
            } else if (category === 14) {
              return this.$t('flowEmulation.AV');
            } else if (category === 15) {
              return this.$t('flowEmulation.enterpriseApplication');
            } else if (category === 16) {
              return this.$t('flowEmulation.socialNetworkSearch');
            } else if (category === 17) {
              return this.$t('flowEmulation.fileTransfer');
            } else if (category === 18) {
              return this.$t('flowEmulation.database');
            } else if (category === 19) {
              return this.$t('flowEmulation.identityAuthentication');
            } else if (category === 20) {
              return 'ERP';
            } else if (category === 21) {
              return this.$t('flowEmulation.storage');
            } else if (category === 22) {
              return this.$t('flowEmulation.game');
            } else if (category === 23) {
              return this.$t('flowEmulation.secureDataTransmission');
            }
          },
        },
        {
          label: this.$t('flowEmulation.flowType'),
          getData: (row) => {
            let type = row.interactive_type;
            if (type === 0) {
              return this.$t('flowEmulation.backgroundFlow');
            } else if (type === 1) {
              return this.$t('flowEmulation.attackFlow');
            } else if (type === 2) {
              return this.$t('flowEmulation.allFlow');
            }
          },
        },
        {
          label: this.$t('flowEmulation.executeCount'),
          prop: 'count',
        },
        {
          label: this.$t('flowEmulation.operate'),
          slot: 'operate',
        },
      ],
      chart: null,
      options: {
        tooltip: {
          show: true,
          backgroundColor: this.$themed('bg-color-1'),
          borderWidth: 0,
          show: true,
          //tooltip的文本颜色
          textStyle: {
            color: this.$themed('neutral8'),
          },
          //toolTip显示时,线的显示样式
          axisPointer: {
            lineStyle: {
              color: this.$themed('neutral4'),
              width: 1,
              type: 'solid',
            },
          },
        },
        xAxis: {
          name: 'Time(s)',
          nameLocation: 'center',
          nameGap: 30,
          nameTextStyle: {
            color: this.$themed('neutral4'),
          },
          axisLine: {
            show: false,
          },
          axisTick: {
            show: false,
          },
          axisLabel: {
            fontSize: 14,
            inside: false,
            showMinLabel: true,
            showMaxLabel: true,
            verticalAlign: 'top',
            color: this.$themed('neutral4'),
          },
          data: [],
        },
        yAxis: {
          name: 'Tx pps(kpkt/s)',
          nameTextStyle: {
            color: this.$themed('neutral4'),
          },
          axisLine: {
            show: false,
          },
          axisLabel: {
            fontSize: 14,
            color: this.$themed('neutral4'),
          },
          splitLine: {
            lineStyle: {
              color: this.$themed('neutral0'),
              width: 1,
            },
          },
        },
        color: [this.$themed('primary-color')],
        series: [
          {
            type: 'line',
            data: [],
          },
        ],
        grid: {
          top: 30,
          left: 20,
          right: 20,
          bottom: 20,
          containLabel: true,
        },
      },
      backModel: {
        opackets: 0,
        obytes: 0,
        tx_bps: 0,
        oerrors: 0,
      },
      refreshTime: null,
      refreshListTime: null,
      refreshListCount: 0, //记录表格刷新次数
      oneTimeout: null,
      allTimeout: null,
      hostActive: 0,
      flowTitle: '',
      cookie: '',
    };
  },
  watch: {
    'model.node_id': {
      handler() {
        //flowTitle有值说明进行了启动流量操作，此时切换主机将流量回放数据清空
        if (this.flowTitle) {
          clearInterval(this.refreshTime);
          clearInterval(this.refreshListTime);
          clearInterval(this.oneTimeout);
          clearInterval(this.allTimeout);
          this.flowTitle = '';
          this.emptyLine = true;
          this.backModel = {
            opackets: 0,
            obytes: 0,
            tx_bps: 0,
            oerrors: 0,
          };
        }
      },
    },
    refreshListCount: {
      handler(nv, ov) {
        if (nv >= 3) {
          // refreshListTime定时器执行3次后销毁
          clearInterval(this.refreshListTime);
        }
      },
    },
  },
  mounted() {
    this.templateId = this.$route.params.templateId;
    this.sceneId = this.$route.params.mpSceneId;
    this.taskId = this.$route.params.taskId;
    this.cookie = utils.getCookie('cr_jwttoken');
    this.initLine();
    this.getMainInfo(this.sceneId);
    // 进入页面请求ws接口，更新流量列表
    this.bindSceneWs();
    this.listen.createListen();
  },
  beforeDestroy() {
    clearInterval(this.refreshTime);
    clearInterval(this.refreshListTime);
    clearInterval(this.oneTimeout);
    clearInterval(this.allTimeout);
    this.listen.destroyListen();
  },
  methods: {
    // 监听换肤，切换背景
    listenFunc() {
      const chartTooltip = {
        show: true,
        backgroundColor: this.$themed('bg-color-1'),
        borderWidth: 0,
        show: true,
        //tooltip的文本颜色
        textStyle: {
          color: this.$themed('neutral8'),
        },
        //toolTip显示时,线的显示样式
        axisPointer: {
          lineStyle: {
            color: this.$themed('neutral4'),
            width: 1,
            type: 'solid',
          },
        },
      };
      const xNameTextStyle = {
        color: this.$themed('neutral4'),
      };
      const xAxisLabel = {
        fontSize: 14,
        inside: false,
        showMinLabel: true,
        showMaxLabel: true,
        verticalAlign: 'top',
        color: this.$themed('neutral4'),
      };
      const yNameTextStyle = {
        padding: [0, 40, 0, 0],
        color: this.$themed('neutral4'),
      };
      const yAxisLabel = {
        fontSize: 14,
        color: this.$themed('neutral4'),
      };
      const ySplitLine = {
        lineStyle: {
          color: this.$themed('neutral0'),
          width: 1,
        },
      };
      this.options.tooltip = chartTooltip;
      this.options.xAxis.nameTextStyle = xNameTextStyle;
      this.options.xAxis.axisLabel = xAxisLabel;
      this.options.yAxis.nameTextStyle = yNameTextStyle;
      this.options.yAxis.axisLabel = yAxisLabel;
      this.options.yAxis.splitLine = ySplitLine;
      this.chart.setOption(this.options);
    },
    getMainInfo(id) {
      getMainInfoList(id).then((res) => {
        const list = _.get(res, 'data.data', []) || [];
        if (list.length) {
          const hostList = list.map((item) => {
            return {
              id: item.id,
              name: item.name,
            };
          });
          this.hostList = hostList;
          this.model.node_id = hostList[0].id;
          this.model.task_id = this.taskId;
        }
      });
    },

    // 折线图初始化
    initLine() {
      this.chart = Echarts.init(this.$refs.line);
      this.chart.setOption(this.options);
    },
    // 主机列表点击
    hostClick(data, index) {
      this.model.node_id = data.id;
      this.hostActive = index;
    },

    // 启动流量
    startFlow(data) {
      this.flowTitle = data.name;
      clearInterval(this.refreshTime);
      clearInterval(this.oneTimeout);
      let flow_id = data.id,
        source_ip = data.source_ip;
      const params = {
        flows: [
          {
            flow_id,
            source_ip,
          },
        ],
        node_id: this.model.node_id,
        run_type: this.switchBool ? 1 : 0,
        task_id: this.model.task_id,
      };
      batchStart(params).then(async (res) => {
        this.model.flow_id = flow_id;
        this.$message.success(this.$t('m.start_success'));
        // 3秒后开启定时器
        this.oneTimeout = setTimeout(() => {
          this.model.flow_id = '';
          this.refreshTime = setInterval(() => {
            // 点击启动后每2秒调一下中台的流量回放按钮
            this.$refs.flowListRef.reload();
            this.getFlowRecords(flow_id, 1);
          }, 2000);
        }, 3000);
      });
    },

    // 点击全部启动
    startAll() {
      this.flowTitle = this.$t('flowEmulation.allFlow');
      this.flowAllStart();
    },

    // 全部启动接口
    flowAllStart() {
      clearInterval(this.refreshTime);
      clearInterval(this.allTimeout);
      const params = {
        run_type: this.switchBool ? 1 : 0,
        task_id: this.model.task_id,
        node_id: this.model.node_id,
      };
      allStartFlow(params).then(async (res) => {
        this.model.is_all_flow = true;
        this.$message.success(this.$t('m.start_success'));
        // 3秒后开启定时器
        this.allTimeout = setTimeout(() => {
          // 点击启动后每2秒调一下中台的流量回放按钮
          this.model.is_all_flow = '';
          this.refreshTime = setInterval(() => {
            this.$refs.flowListRef.reload();
            this.getFlowRecords('', 2);
          }, 2000);
        }, 3000);
      });
    },

    bindSceneWs() {
      wsutil.cbind(
        `/ojj/ws/cr/ce_base/scene?business_id=${this.templateId}&token=${this.cookie}`,
        {
          '': (data) => {
            let type = _.get(data, 'type', ''),
              resData = _.get(data, 'data', {}) || {};
            if (
              type === 'scene_element' &&
              resData &&
              (resData.call_action === 'node_start_flow' ||
                resData.call_action === 'node_stop_flow')
            ) {
              this.$refs.flowListRef.reload();
            }
          },
        },
      );
    },
    // 启动操作是否可用
    startEnabled(data) {
      const { common_status, status } = data;
      if (common_status) {
        return true;
      } else {
        if (status === 3 || status === 1) {
          return true;
        } else {
          return false;
        }
      }
    },

    // 流量回放接口
    getFlowRecords(flow_id, type) {
      let is_batch = false,
        params = {};
      if (type === 2) {
        is_batch = true;
        params = {
          id: this.sceneId,
          is_batch,
          node_id: this.model.node_id,
        };
      } else if (type === 1) {
        params = {
          flow_id,
          id: this.sceneId,
          is_batch,
          node_id: this.model.node_id,
        };
      }

      getFlowRecordData(params)
        .then((res) => {
          //切换主机会清除定时器，但请求可能已经发出，再加一层判断
          if (!this.flowTitle) {
            this.emptyLine = true;
            this.backModel = {
              opackets: 0,
              obytes: 0,
              tx_bps: 0,
              oerrors: 0,
            };
            return;
          }
          const status = _.get(res, 'data.data.status', '') || '';
          if (status === 3) {
            this.$refs.flowListRef.reload();
            // 结束后开启定时器多刷新几次列表
            this.refreshListTime = setInterval(() => {
              this.$refs.flowListRef.reload();
              this.refreshListCount++;
            }, 3000);
            clearInterval(this.refreshTime);
          }
          const flowList = _.get(res, 'data.data.flow_records_list', []) || [];
          if (flowList.length) {
            this.emptyLine = false;
            let length = flowList.length;
            const xAxisSecond = [],
              yAxisTxbps = [];

            flowList.forEach((item) => {
              xAxisSecond.push(item.second - length);
              yAxisTxbps.push(item.tx_bps);
            });
            this.options.xAxis.data = xAxisSecond;
            this.options.series[0].data = yAxisTxbps;
            this.chart.setOption(this.options);
            const lastFlow = flowList[length - 1];
            this.backModel = {
              opackets: lastFlow.opackets,
              obytes: (lastFlow.obytes / 1024).toFixed(2),
              tx_bps: (lastFlow.tx_bps / 1024).toFixed(2),
              oerrors: lastFlow.oerrors,
            };
          } else {
            this.emptyLine = true;
            this.options.xAxis.data = [];
            this.options.series[0].data = [];
            this.chart.setOption(this.options);
            this.backModel = {
              opackets: 0,
              obytes: 0,
              tx_bps: 0,
              oerrors: 0,
            };
          }
        })
        .catch((error) => {
          this.emptyLine = true;
          this.options.xAxis.data = [];
          this.options.series[0].data = [];
          this.chart.setOption(this.options);
          this.backModel = {
            opackets: 0,
            obytes: 0,
            tx_bps: 0,
            oerrors: 0,
          };
        });
    },

    // 下载流量
    downloadFlowAction(data) {
      const { id } = data;
      const params = {
        flow_id: id,
        task_id: this.model.task_id,
      };
      downloadFlow(params).then((res) => {
        const file_path = _.get(res, 'data.data.file_path', '') || '';
        if (file_path) {
          let url =
            window.top.location.protocol +
            '//' +
            window.top.location.host +
            '/fdfs/' +
            file_path;
          window.top.open(url, '_blank');
        }
      });
    },

    // 源ip编辑
    columnClick(data) {
      const { id } = data;
      this.$set(data, 'columnInputShow', true);
    },
    //回车事件回调,手动触发blur事件
    handleEnter(e) {
      e.target.blur();
    },
    blurEvent(done, data) {
      const sourceIp = data.source_ip;
      const ipRexp = /^(\d+)\.(\d+)\.(\d+)\.(\d+)$/;
      if (ipRexp.test(sourceIp)) {
        sourceIp.match(ipRexp);
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
          this.$message.error(this.$t('test.ipError'));
          return;
        }
      } else {
        //不符合IP格式时判断是否为空值，允许删除
        if (sourceIp == '' || sourceIp == null) {
          data.source_ip = null;
        } else {
          this.$message.error(this.$t('test.ipError'));
          return;
        }
      }
      const params = {
        flow_id: data.id,
        node_id: this.model.node_id,
        source_ip: data.source_ip,
        task_id: this.model.task_id,
      };
      editSourceIp(params).then((res) => {
        this.$refs.flowListRef.reload();
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.content {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
}
.flow-content {
  background-color: var(--bg-color-2);
  height: 100%;
  display: flex;
  flex-direction: row;
  .left-content {
    width: 15%;
    overflow-y: auto;
    border-right: solid 1px var(--neutral3);
    padding: 16px;
    flex: 1;
    .host-title {
      color: var(--neutral7);
      font-size: 14px;
      margin-bottom: 10px;
    }
    .host-item {
      cursor: pointer;
      color: (--neutral8);
      font-size: 14px;
      margin-top: 16px;
    }
    .host-item.hostActive {
      color: var(--primary-color);
    }
  }
  .right-content {
    padding: 16px;
    width: 85%;
    .content-item {
      background-color: var(--neutral0);
      padding: 16px;
      position: relative;
      margin-bottom: 20px;
      .all-start-btn {
        position: absolute;
        right: 16px;
      }
      .switch {
        position: absolute;
        right: 125px;
        top: 60px;
      }
    }
    .content-title {
      color: var(--neutral8);
      margin-bottom: 16px;
      display: flex;
      align-items: center;
      span:first-child {
        width: 6px;
        height: 8px;
        background: var(--primary-color);
        margin-right: 8px;
      }
    }
    .flow-back {
      .flow-back-content {
        display: flex;
        flex-direction: row;
        .back-left {
          width: 800px;
          position: relative;
          background: var(--bg-color-2);
          .flow-title {
            font-size: 14px;
            color: var(--neutral8);
            text-align: center;
            margin-bottom: 5px;
            padding-top: 5px;
          }
          .empty_line {
            color: var(--neutral8);
            text-align: center;
            margin-top: 120px;
            font-size: 14px;
          }
        }
        .back-right {
          width: calc(100% - 800px);
          display: flex;
          flex-direction: row;
          flex-wrap: wrap;
          justify-content: space-between;
          .back-right-item {
            display: flex;
            flex-direction: column;
            width: calc((100% - 30px) / 2);
            height: 148px;
            background: var(--bg-color-2);
            align-items: flex-start;
            justify-content: center;
            padding-left: 8%;
            margin: 0 0 15px 15px;
            .value-group {
              display: flex;
              flex-direction: row;
              align-items: center;
              span:first-child {
                font-size: 28px;
                margin-right: 10px;
              }
              span:last-child {
                color: var(--neutral5);
                font-size: 14px;
              }
            }
            .name-group {
              font-size: 18px;
              margin-top: 10px;
            }
          }
        }
      }
    }
    .column-content {
      display: flex;
      align-items: center;
    }
    .no-data {
      width: 780px;
      height: 300px;
      text-align: center;
      position: relative;
      .info {
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        font-size: 14px;
      }
    }

    .button-group {
      display: flex;
      .start-group {
        width: 50px;
        display: flex;
      }
    }
  }
}
</style>
