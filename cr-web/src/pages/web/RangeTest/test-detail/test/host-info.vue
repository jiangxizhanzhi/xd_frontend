<template>
  <div class="host-info">
    <div class="host-list-area">
      <cb-scrollbar>
        <span>{{ $t('test.hostList') }}</span>
        <div
          v-for="(item, index) in hostList"
          :class="index == currentKey ? 'active' : ''"
          :key="item.id"
          @click="changeType(item, index)"
          class="host"
        >
          {{ item.name }}
        </div>
      </cb-scrollbar>
    </div>
    <div class="chart-area">
      <cb-scrollbar>
        <!-- 机器基本信息 -->
        <div class="basic-info">
          <p class="title">
            <i></i>
            <span>{{ $t('test.machineBasicInfo') }}</span>
          </p>
          <div class="machine-name">
            <span>{{ $t('test.machineName') }}</span
            >:
            <span class="info">{{ machineGroup.name }}</span>
          </div>
          <div class="machine-info">
            <span>{{ $t('test.osFrame') }}</span
            >:
            <span class="info">{{ osGroup.frame }}</span>
            <span>{{ $t('test.os') }}</span
            >:
            <span class="info">{{ machineGroup.systemTypeName }}</span>
            <span>{{ $t('test.systemVersion') }}</span
            >:
            <span class="info">{{ osGroup.version }}</span>
            <span>{{ $t('test.ipAddress') }}</span
            >:
            <span class="info">{{ machineGroup.ip }}</span>
          </div>
        </div>
        <div class="occupy-info">
          <!-- cpu占用率 -->
          <div class="cpu-area">
            <p class="title">
              <i></i>
              <span>{{ $t('test.cpuOccupancy') }}</span
              ><span>({{ cpuInfo.occupy }}%)</span>
            </p>
            <div class="main-title">
              <div>
                <span>{{ $t('m.mainFrequency') }}</span
                ><span>{{ cpuInfo.mhz }}MHZ</span>
              </div>
              <div>
                <span>{{ $t('m.coreNumber') }}</span
                ><span>{{ cpuInfo.core }}</span>
              </div>
            </div>
            <div style="width: 100%; height: 300px">
              <div v-if="!isShow" style="width: 100%; height: 300px">
                <cb-echart-line
                  :xData="xDataCpu"
                  :lineData="lineDataCpu"
                  :grid="grid"
                  :legendShow="true"
                  :axisLineShow="true"
                  :areaStyle="true"
                  :smooth="true"
                  :yAxisLabelFormatter="yAxisLabelFormatter"
                  :toolTipFormatter="toolTipFormatter"
                  :chartSize="chartSize"
                  :name="[]"
                ></cb-echart-line>
              </div>
              <div v-else class="no-data">
                <div class="info">
                  <cb-iconfont type="icon-zanwuziyuan" size="56"></cb-iconfont>
                  <div>{{ $t('flowEmulation.noData') }}</div>
                </div>
              </div>
            </div>
          </div>
          <div class="memory-area">
            <p class="title">
              <i></i>
              <span>{{ $t('test.memoryUsage') }}</span
              ><span>({{ memoryInfo.occupy }}%)</span>
            </p>
            <div class="main-title">
              <div>
                <span
                  >{{ $t('test.memorySize') }}/{{
                    $t('test.availableMemory')
                  }}</span
                ><span>{{ memoryInfo.count }}M/{{ memoryInfo.usable }}M</span>
              </div>
            </div>
            <div style="width: 100%; height: 300px">
              <div v-if="!isShow" style="width: 100%; height: 300px">
                <cb-echart-line
                  :xData="xDataMemory"
                  :lineData="lineDataMemory"
                  :grid="grid"
                  :legendShow="true"
                  :axisLineShow="true"
                  :areaStyle="true"
                  :smooth="true"
                  :yAxisLabelFormatter="yAxisLabelFormatter"
                  :toolTipFormatter="toolTipFormatter"
                  :chartSize="chartSize"
                  :name="[]"
                ></cb-echart-line>
              </div>
              <div v-else class="no-data">
                <div class="info">
                  <cb-iconfont type="icon-zanwuziyuan" size="56"></cb-iconfont>
                  <div>{{ $t('flowEmulation.noData') }}</div>
                </div>
              </div>
            </div>
          </div>
          <div class="disk-area">
            <p class="title">
              <i></i>
              <span>{{ $t('test.diskOccupancy') }}</span
              ><span>({{ diskInfo.occupy }}%)</span>
            </p>
            <div class="main-title">
              <div>
                <span
                  >{{ $t('test.diskSize') }}/{{
                    $t('test.availableDisk')
                  }}</span
                ><span>{{ diskInfo.count }}G/{{ diskInfo.usable }}G</span>
              </div>
            </div>
            <div style="width: 100%; height: 300px">
              <div v-if="!isShow" style="width: 100%; height: 300px">
                <cb-echart-line
                  :xData="xDataDisk"
                  :lineData="lineDataDisk"
                  :grid="grid"
                  :legendShow="true"
                  :axisLineShow="true"
                  :areaStyle="true"
                  :smooth="true"
                  :yAxisLabelFormatter="yAxisLabelFormatter"
                  :toolTipFormatter="toolTipFormatter"
                  :chartSize="chartSize"
                  :name="[]"
                ></cb-echart-line>
              </div>
              <div v-else class="no-data">
                <div class="info">
                  <cb-iconfont type="icon-zanwuziyuan" size="56"></cb-iconfont>
                  <div>{{ $t('flowEmulation.noData') }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="interface-info">
          <p class="title">
            <i></i>
            <span>{{ $t('test.interfaceList') }}</span>
          </p>
          <div class="table">
            <cb-search-table
              ref="interfaceTable"
              :cols="interfaceColumns"
              :url="interfaceUrl"
              baseURL="/api/mp"
              :data="interfaceModel"
              :searchBarBg="false"
            >
            </cb-search-table>
          </div>
        </div>
        <div class="port-info">
          <p class="title">
            <i></i>
            <span>{{ $t('test.portList') }}</span>
          </p>
          <div class="table">
            <cb-search-table
              ref="portTable"
              :cols="portColumns"
              :url="portUrl"
              baseURL="/api/mp"
              :data="portModel"
              :searchBarBg="false"
            >
            </cb-search-table>
          </div>
        </div>
        <div class="process-info">
          <p class="title">
            <i></i>
            <span>{{ $t('test.processList') }}</span>
          </p>
          <div class="table">
            <cb-search-table
              ref="processTable"
              :cols="processColumns"
              :url="processUrl"
              baseURL="/api/mp"
              :data="processModel"
              :searchBarBg="false"
            >
            </cb-search-table>
          </div>
        </div>
      </cb-scrollbar>
    </div>
  </div>
</template>

<script>
import _ from 'lodash';
export default {
  components: {},
  props: {
    sceneId: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      listen: new this.$ListenDomChange({
        dom: document.body,
        callback: this.listenFunc,
      }),
      currentKey: 0,
      hostList: [],
      isShow: true,
      nodeId: '',
      cpuInfo: {
        occupy: '',
        mhz: '',
        core: '',
      },
      memoryInfo: {
        occupy: '',
        count: '',
        usable: '',
      },
      diskInfo: {
        occupy: '',
        count: '',
        usable: '',
      },
      yAxisLabelFormatter: '{value}%',
      toolTipFormatter: '{b0}</br>{c0}%',
      grid: {
        top: 35,
        bottom: 10,
        left: 40,
        right: 70,
        containLabel: true,
      },
      xDataCpu: [],
      lineDataCpu: [],
      xDataMemory: [],
      lineDataMemory: [],
      xDataDisk: [],
      lineDataDisk: [],
      chartSize: {
        width: '500px',
        height: '300px',
      },
      interfaceUrl: '',
      portUrl: '',
      processUrl: '',
      interfaceModel: {
        nodeIds: '',
        sceneIds: '',
      },
      portModel: {
        nodeIds: '',
        sceneIds: '',
      },
      processModel: {
        nodeIds: '',
        sceneIds: '',
      },
      machineGroup: {
        name: '',
        ip: '',
        systemTypeName: '',
      },
      osGroup: {
        frame: '',
        version: '',
      },
      interfaceColumns: [
        {
          label: this.$t('test.name'),
          prop: 'name',
        },
        {
          label: this.$t('test.types'),
          prop: 'type',
        },
        {
          label: this.$t('test.linkStatus'),
          prop: 'state',
        },
        {
          label: this.$t('test.mtu'),
          prop: 'mtu',
        },
        {
          label: this.$t('test.macAddress'),
          prop: 'mac',
        },
        {
          label: this.$t('test.ipAddress'),
          prop: 'ip',
        },
        {
          label: this.$t('test.packageSent'),
          // prop: '',
          getData: (data) => {
            const packets = data.tx.packets;
            return packets;
          },
        },
        {
          label: this.$t('test.packageReceive'),
          // prop: '',
          getData: (data) => {
            const packets = data.rx.packets;
            return packets;
          },
        },
        {
          label: this.$t('test.byteSent'),
          // prop: '',
          getData: (data) => {
            const bytes = data.tx.bytes;
            return bytes;
          },
        },
        {
          label: this.$t('test.byteReceive'),
          // prop: '',
          getData: (data) => {
            const bytes = data.rx.bytes;
            return bytes;
          },
        },
      ],
      portColumns: [
        {
          label: this.$t('m.agreement'),
          prop: 'protocol',
        },
        {
          label: this.$t('m.nativeIp'),
          // prop: '',
          getData: (data) => {
            const ip = data.local.ip;
            return ip;
          },
        },
        {
          label: this.$t('m.nativePort'),
          prop: '',
          getData: (data) => {
            const port = data.local.port;
            return port;
          },
        },
        {
          label: this.$t('m.remoteIp'),
          // prop: '',
          getData: (data) => {
            const ip = data.remote.ip;
            return ip;
          },
        },
        {
          label: this.$t('m.remotePort'),
          // prop: '',
          getData: (data) => {
            const port = data.remote.port;
            return port;
          },
        },
        {
          label: this.$t('m.state'),
          prop: 'state',
        },
        {
          label: this.$t('m.process'),
          prop: 'process',
        },
      ],
      processColumns: [
        {
          label: this.$t('PID'),
          prop: 'pid',
        },
        {
          label: this.$t('m.parentProcess'),
          prop: 'ppid',
        },
        {
          label: this.$t('m.processUser'),
          prop: 'euser',
        },
        {
          label: this.$t('m.memoryUsage'),
          // prop: '',
          getData: (data) => {
            const size = parseFloat((data.vm_size / 1024).toFixed(2)) + 'MB';
            return size;
          },
        },
        {
          label: this.$t('m.commandLine'),
          width: 350,
          prop: 'cmd',
        },
        {
          label: this.$t('m.state'),
          prop: 'state',
        },
        {
          label: this.$t('m.creationTime'),
          prop: 'start_time',
        },
      ],
    };
  },
  created() {
    this.resource_id = this.$route.params && this.$route.params.resource_id;
  },
  mounted() {
    this.listen.createListen();
  },
  beforeDestroy() {
    this.listen.destroyListen();
  },
  watch: {
    // 监听场景id
    sceneId: {
      handler: function (val, oldval) {
        if (val) {
          this.getMachineList();
        } else {
          this.hostList = [];
          this.machineGroup = [];
          this.osGroup = [];
          this.cpuInfo = [];
          this.memoryInfo = [];
          this.diskInfo = [];
          this.isShow = true;
          this.interfaceUrl = '';
          this.portUrl = '';
          this.processUrl = '';
          this.interfaceModel.sceneIds = '';
          this.portModel.sceneIds = '';
          this.processModel.sceneIds = '';
          this.$nextTick(() => {
            this.$refs.interfaceTable.empty();
            this.$refs.portTable.empty();
            this.$refs.processTable.empty();
          });
        }
      },
      immediate: true,
    },
    //监听节点
    nodeId: {
      handler: function (val, oldval) {
        if (val) {
          this.getMachineOs();
          this.getCpuMemoryDisk();
          this.getOccupyRate();
          this.interfaceUrl = 'cscene/monitor/hoststate/element_netifaces';
          this.portUrl = 'cscene/monitor/hoststate/element_port';
          this.processUrl = 'cscene/monitor/hoststate/element_process';
          this.interfaceModel = {
            nodeIds: [val],
            sceneIds: this.sceneId,
            fetchIfSceneInstanceShutdown: true,
          };
          this.portModel = {
            nodeIds: [val],
            sceneIds: this.sceneId,
            fetchIfSceneInstanceShutdown: true,
          };
          this.processModel = {
            nodeIds: [val],
            sceneIds: this.sceneId,
            fetchIfSceneInstanceShutdown: true,
          };
          for (let i = 0; i < this.hostList.length; i++) {
            if (val === this.hostList[i].value) {
              this.machineGroup = {
                name: this.hostList[i].name,
                ip: this.hostList[i].ip,
                systemTypeName: this.hostList[i].system_type_name,
              };
              break;
            }
          }
        } else {
          this.machineGroup = [];
          this.osGroup = [];
          this.interfaceUrl = '';
          this.portUrl = '';
          this.processUrl = '';
          this.xDataCpu = [];
          this.xDataMemory = [];
          this.xDataDisk = [];
          this.lineDataCpu = [];
          this.lineDataMemory = [];
          this.lineDataDisk = [];
        }
      },
      immediate: true,
    },
  },

  methods: {
    // 监听换肤，切换背景
    listenFunc() {
      //有图表数据时监听
      if (!this.isShow) {
        this.isShow = true;
        this.$nextTick(() => {
          this.isShow = false;
        });
      }
    },
    //获取系统架构及版本信息
    getMachineOs() {
      this.$request
        .get(
          `cscene/monitor/scene/element/os`,
          {
            sceneId: this.sceneId,
            elementIds: this.nodeId,
          },
          {
            baseURL: '/api/mp',
          },
        )
        .then((res) => {
          const frame = _.get(res, 'data.data.architecture', '');
          const version = _.get(res, 'data.data.os.version', '');
          this.osGroup = {
            frame: frame,
            version: version,
          };
        });
    },
    getMachineList() {
      this.nodeId = '';
      this.$request
        .get(`cscene/monitor/scene/all_elements/${this.sceneId}`, null, {
          baseURL: '/api/mp',
        })
        .then((res) => {
          const data = _.get(res, 'data.data', []) || [];
          const list = data.map((item) => {
            let ip = '';
            if (item.ports.length) {
              ip = item.ports[0].ip;
            }
            return {
              name: item.name,
              value: item.id,
              ip,
              system_type_name: item.system_type_name,
            };
          });
          this.hostList = [...list];
          this.nodeId = list.length && list[0].value;
        });
    },
    // 获取cpu、内存、磁盘
    getCpuMemoryDisk(val) {
      this.$request
        .get(
          `cscene/monitor/hoststate/element_trend`,
          {
            sceneId: this.sceneId,
            elementIds: this.nodeId,
          },
          {
            baseURL: '/api/mp',
          },
        )
        .then((res) => {
          const list = _.get(res, 'data.data', []) || [];
          const lineDataCpu = [],
            lineDataMemory = [],
            lineDataDisk = [];
          this.xDataCpu = [];
          this.xDataMemory = [];
          this.xDataDisk = [];
          this.lineDataCpu = [];
          this.lineDataMemory = [];
          this.lineDataDisk = [];

          if (list.length) {
            list.forEach((item) => {
              // cpu
              this.xDataCpu.push(item.time.substr(0, 16));
              lineDataCpu.push(item.cpu_percent);
              // 内存
              this.xDataMemory.push(item.time.substr(0, 16));
              lineDataMemory.push(item.memory_percent);

              //磁盘
              this.xDataDisk.push(item.time.substr(0, 16));
              lineDataDisk.push(item.disk_percent);
            });
            this.lineDataCpu.push(lineDataCpu);
            this.lineDataMemory.push(lineDataMemory);
            this.lineDataDisk.push(lineDataDisk);
            this.isShow = false;
          } else {
            this.isShow = true;
          }
        });
    },
    getOccupyRate() {
      this.$request
        .get(
          `cscene/monitor/hoststate`,
          {
            sceneId: this.sceneId,
            elementIds: this.nodeId,
          },
          {
            baseURL: '/api/mp',
          },
        )
        .then((res) => {
          const data = _.get(res, 'data.data', []) || [];
          this.cpuInfo.occupy = data[0]?.cpu_percent || 0;
          this.cpuInfo.core = data[0]?.cpu_count || 0;
          this.cpuInfo.mhz = data[0]?.cpu_freq || 0;
          this.memoryInfo.occupy = data[0]?.memory_percent || 0;
          this.memoryInfo.count = data[0]?.memory_total || 0;
          this.memoryInfo.usable = data[0]?.memory_free || 0;
          this.diskInfo.occupy = data[0]?.disk_percent || 0;
          this.diskInfo.count = data[0]?.disk_space || 0;
          this.diskInfo.usable = data[0]?.disk_unused || 0;
        });
    },
    changeType(item, index) {
      this.currentKey = index;
      this.nodeId = item.value;
    },
  },
};
</script>

<style lang="scss" scoped>
.host-info {
  display: flex;
  width: 100%;
  height: 100%;
  .active {
    color: var(--primary-color);
  }
  .host-list-area {
    width: 15%;
    border-right: 1px solid var(--neutral0);
    padding: 15px 10px 15px 15px;
    font-size: 14px;
    .host {
      margin-top: 16px;
      cursor: pointer;
    }
  }
  .chart-area {
    width: 85%;
    padding: 15px 10px 15px 15px;
    .basic-info {
      background-color: var(--neutral0);
      padding: 16px 10px;
      font-size: 14px;
      .machine-name {
        margin-top: 20px;
        padding-left: 25px;
      }
      .machine-info {
        margin-top: 10px;
        padding-left: 25px;
      }
      .info {
        margin-right: 100px;
        margin-left: 5px;
      }
    }
    .occupy-info {
      display: flex;
      justify-content: space-between;
      margin-top: 15px;
      .cpu-area {
        width: 33%;
        padding: 15px 10px;
        background-color: var(--neutral0);
      }
      .memory-area {
        width: 33%;
        margin-left: 15px;
        padding: 15px 10px;
        background-color: var(--neutral0);
      }
      .disk-area {
        width: 33%;
        margin-left: 15px;
        padding: 15px 10px;
        background-color: var(--neutral0);
      }
      .main-title {
        display: flex;
        flex-direction: row;
        // justify-content: center;
        text-align: center;
        font-size: 12px;
        margin-top: 10px;
        padding-left: 20px;
        div {
          margin-right: 10px;
          span {
            padding: 0 5px;
          }
          span:last-child {
            color: var(--primary-color);
          }
        }
      }
    }
    .interface-info {
      padding: 20px 10px;
      font-size: 16px;
      background-color: var(--neutral0);
      margin-top: 15px;
      .table {
        margin-top: 16px;
        padding: 0px 10px;
      }
    }
    .port-info {
      padding: 20px 10px;
      font-size: 16px;
      margin-top: 15px;
      background-color: var(--neutral0);
      .table {
        margin-top: 16px;
        padding: 0px 10px;
      }
    }
    .process-info {
      padding: 20px 10px;
      font-size: 16px;
      background-color: var(--neutral0);
      margin-top: 15px;
      .table {
        margin-top: 10px;
        padding: 0px 10px;
      }
    }
    .title {
      color: var(--neutral8);
      margin: 0 0 0 10px;
      line-height: 14px;
      font-size: 16px;
      i {
        display: inline-block;
        width: 6px;
        height: 8px;
        margin-right: 5px;
        margin-bottom: 2px;
        background: var(--primary-color);
      }
    }
    .no-data {
      height: 100%;
      width: 100%;
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
  }
}
</style>
