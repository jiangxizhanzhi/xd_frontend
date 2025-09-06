<template>
  <div class="host-switch">
    <div class="left">
      <div class="host-avatar">
        <img :src="deviceInfo.imgUrl" alt="" class="img" />
      </div>
      <div class="host-info">
        <div class="name" :title="deviceInfo.deviceName">
          {{ deviceInfo.deviceName }}
        </div>
        <div class="system">
          <div class="model">
            <div class="icon" :title="$t('device.system')">
              <cb-iconfont
                :size="16"
                type="icon-danping"
                class="system-icon"
              ></cb-iconfont>
            </div>
            <div class="text" :title="deviceInfo.deviceOs">
              {{ deviceInfo.deviceOs || '-' }}
            </div>
          </div>
          <div class="version">
            <div class="icon" :title="$t('test.systemVersion')">
              <cb-iconfont
                :size="14"
                type="icon-nitaiweb"
                class="system-icon"
              ></cb-iconfont>
            </div>
            <div class="text" :title="deviceInfo.deviceVersion">
              {{ deviceInfo.deviceVersion || '-' }}
            </div>
          </div>
          <div class="ip">
            <div class="icon" title="IP">
              <cb-iconfont
                :size="16"
                type="icon-IP"
                class="system-icon"
              ></cb-iconfont>
            </div>
            <div class="text" :title="deviceInfo.deviceIp">
              {{ deviceInfo.deviceIp || '-' }}
            </div>
          </div>
        </div>
        <div class="echart">
          <div class="cpu">
            <div>CPU</div>
            <div class="number">{{ deviceInfo.cpuOccupy }}%</div>
            <div class="cpu-line">
              <echart-line
                :initData="cpuOccupyData"
                :color="cpuColor"
                :showSplitLine="false"
                :showXAxis="false"
                :showXAxisLabel="false"
                :showYAxisLabel="false"
                :showToolTip="false"
                :showNoData="false"
              ></echart-line>
            </div>
          </div>
          <div class="ram">
            <div>{{ $t('m.memory') }}</div>
            <div class="number">{{ deviceInfo.ramOccupy }}%</div>
            <div class="ram-line">
              <echart-line
                :initData="ramOccupyData"
                :color="ramColor"
                :showSplitLine="false"
                :showXAxis="false"
                :showXAxisLabel="false"
                :showYAxisLabel="false"
                :showToolTip="false"
                :showNoData="false"
              ></echart-line>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="right scroll-bar">
      <div
        v-for="(item, index) in hostScreenData"
        :key="index"
        class="host-item"
      >
        <div
          class="name"
          :title="item.name"
          :class="[nodeId == item.id ? 'node-active' : '']"
        >
          {{ item.name }}
        </div>
        <div class="total-line">
          <div
            v-for="(obj, key) in item.url"
            :key="key"
            :title="getTitle(obj)"
            class="part-line"
            :class="[screenActive == obj.name ? 'active' : 'no-active']"
            :style="{
              width: getWidth(obj) + '%',
              left: getLeft(obj) + '%',
            }"
            @click="changeScreen(obj)"
          ></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import EchartLine from './echart-line.vue';
import { getDeviceInfo, getDeviceOccupy, getAllNodes } from '@/api/web/replay';
export default {
  props: {
    //场景id
    sceneId: {
      type: String,
      default: () => {
        return '';
      },
    },
    //录屏数据
    sceneData: {
      type: Array,
      default: () => {
        return [];
      },
    },
    // 训练开始时间
    trainStartTime: {
      type: String,
      default: () => {
        return '';
      },
    },
    // 训练结束时间
    trainEndTime: {
      type: String,
      default: () => {
        return '';
      },
    },
    //复盘时间
    replayTime: {
      type: String,
      default: () => {
        return '';
      },
    },
  },
  components: {
    EchartLine,
  },
  data() {
    return {
      //待播放视频
      screenActive: '',
      //记录当前播放视频结束时间
      currentScreenEndTime: '',
      //设备基本信息
      deviceInfo: {
        imgUrl: '',
        deviceOs: '',
        deviceVersion: '',
        deviceIp: '',
        cpuOccupy: 0,
        ramOccupy: 0,
      },
      //所有节点信息，用于寻找某个节点的详细信息
      hostList: [],
      hostScreenData: [],
      cpuColor: [this.$themed('primary-color')],
      ramColor: [this.$themed('green-color')],
      //cpu图表数据
      cpuOccupyData: {
        xData: [],
        yData: [],
      },
      //ram图表数据
      ramOccupyData: {
        xData: [],
        yData: [],
      },
      //节点id
      nodeId: '',
      //轮询
      occupyInterval: null,
    };
  },
  created() {},
  mounted() {},
  beforeDestroy() {
    clearInterval(this.occupyInterval);
  },
  watch: {
    sceneData: {
      handler(val, oldval) {
        this.initData(val);
      },
      deep: true,
      immediate: true,
    },
    nodeId: {
      handler(val) {
        if (val && this.sceneId) {
          this.getAllNodes();
          this.getDeviceInfo();
          this.getDeviceOccupy();
          clearInterval(this.occupyInterval);
          this.occupyInterval = setInterval(() => {
            this.getDeviceOccupy();
          }, 1000 * 5);
        }
      },
      deep: true,
      immediate: true,
    },
  },
  methods: {
    initData(val) {
      this.hostScreenData = _.cloneDeep(val);
      if (this.hostScreenData.length) {
        this.nodeId = this.hostScreenData[0].id;
        //默认第一条录屏是待播放状态
        if (this.hostScreenData[0].url.length) {
          this.screenActive = this.hostScreenData[0].url[0].name;
          this.currentScreenEndTime = this.hostScreenData[0].url[0].endTime;
        }
      }
    },
    // 计算录屏时长所占训练区间的范围
    getWidth(data) {
      //训练时间之外的录屏，截止时间设为训练结束时间
      if (
        new Date(this.trainEndTime).getTime() < new Date(data.endTime).getTime()
      ) {
        data.endTime = this.trainEndTime;
      }
      // 训练总时长
      let totalTime =
        new Date(this.trainEndTime).getTime() -
        new Date(this.trainStartTime).getTime();
      //
      let time =
        new Date(data.endTime).getTime() - new Date(data.startTime).getTime();
      return (time / totalTime) * 100;
    },
    // 计算录屏开始时间在训练区间的起点
    getLeft(data) {
      let totalTime =
        new Date(this.trainEndTime).getTime() -
        new Date(this.trainStartTime).getTime();
      let time =
        new Date(data.startTime).getTime() -
        new Date(this.trainStartTime).getTime();
      return (time / totalTime) * 100;
    },
    changeScreen(data) {
      //切换待播放视频
      this.screenActive = data.name;
      this.nodeId = data.nodeId;
      this.currentScreenEndTime = data.endTime;
      this.$emit('changeScreen', data);
    },
    //获取所有设备
    getAllNodes() {
      getAllNodes(this.sceneId).then((res) => {
        const data = _.get(res, 'data.data', []) || [];
        const list = data.map((item) => {
          let ip = '';
          if (item.ports.length) {
            ip = item.ports[0].ip;
          }
          return {
            name: item.name,
            id: item.id,
            ip,
            system_type_name: item.system_type_name,
            icon2: item.icon2,
          };
        });
        this.hostList = [...list];
        this.hostList.forEach((item, i) => {
          if (this.nodeId == item.id) {
            this.deviceInfo.imgUrl = this.hostList[i].icon2;
            this.deviceInfo.deviceName = this.hostList[i].name;
            this.deviceInfo.deviceIp = this.hostList[i].ip;
            this.deviceInfo.deviceOs = this.hostList[i].system_type_name;
          }
        });
      });
    },
    //获取设备信息
    getDeviceInfo() {
      const params = {
        sceneId: this.sceneId,
        elementIds: this.nodeId,
      };
      getDeviceInfo(params).then((res) => {
        const data = _.get(res, 'data.data.os', {}) || {};
        this.deviceInfo.deviceVersion = data.version;
      });
    },
    //获取设备占用率
    getDeviceOccupy() {
      let endTime;
      // 视频播放结束，则将查询此节点占用率截止时间固定
      if (
        new Date(this.currentScreenEndTime).getTime() <
        new Date(this.replayTime).getTime()
      ) {
        endTime = this.currentScreenEndTime;
      } else {
        endTime = this.replayTime;
      }
      const params = {
        sceneId: this.sceneId,
        elementIds: this.nodeId,
        startTime: this.trainStartTime,
        endTime: endTime,
      };
      getDeviceOccupy(params).then((res) => {
        const list = _.get(res, 'data.data', []) || [];
        let xData = [],
          cpuYData = [],
          ramYData = [];
        list.forEach((item) => {
          xData.push(item.time.substr(10, 6));
          cpuYData.push(item.cpu_percent);
          ramYData.push(item.memory_percent);
        });
        if (list.length) {
          this.deviceInfo.cpuOccupy = list[list.length - 1].cpu_percent;
          this.deviceInfo.ramOccupy = list[list.length - 1].memory_percent;
        }

        this.cpuOccupyData.xData = xData;
        this.cpuOccupyData.yData = [cpuYData];
        this.ramOccupyData.xData = xData;
        this.ramOccupyData.yData = [ramYData];
      });
    },
    getTitle(data) {
      return (
        this.$t('common.screenTime') +
        '：' +
        data.startTime +
        ' ~ ' +
        data.endTime
      );
    },
  },
};
</script>
<style lang="scss" scoped>
.host-switch {
  width: 100%;
  height: 100%;
  display: flex;
  .left {
    width: 440px;
    height: 100%;
    padding: 12px 12px 4px 12px;
    display: flex;
    background: var(--bg-color-3);
    .host-avatar {
      width: 32px;
      .img {
        width: 32px;
        height: 32px;
      }
    }
    .host-info {
      width: calc(100% - 32px - 8px);
      margin-left: 8px;
      .name {
        min-height: 10px;
      }
      .system {
        display: flex;
        margin: 8px 0px;
        font-size: 12px;
        color: var(--neutral7);
        text-align: center;
        .model {
          display: flex;
          align-items: center;
          width: 30%;
          .system-icon {
            color: var(--neutral7);
          }
        }
        .version {
          display: flex;
          align-items: center;
          width: 30%;
          .system-icon {
            color: var(--neutral7);
          }
        }
        .ip {
          display: flex;
          align-items: center;
          width: 30%;
          .system-icon {
            color: var(--neutral7);
          }
        }
        .text {
          margin-left: 4px;
          max-width: 95px;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }
      }
      .echart {
        display: flex;
        width: 100%;
        position: relative;
        // top: -25px;
        .cpu {
          display: flex;
          width: 50%;
          align-items: center;
          .number {
            color: var(--primary-color);
            margin: 0 8px;
          }
          .cpu-line {
            position: relative;
            // left: -40px;
            width: 80px;
            height: 32px;
            // height: 100px;
            // transform: scale(0.5);
          }
        }
        .ram {
          display: flex;
          width: 50%;
          align-items: center;
          .number {
            color: var(--green-color);
            margin: 0 8px;
          }
          .ram-line {
            position: relative;
            // left: -40px;
            width: 80px;
            height: 32px;
            // height: 100px;
            // transform: scale(0.5);
          }
        }
      }
    }
  }
  .right {
    width: calc(100% - 440px);
    height: 100%;
    overflow: auto;
    padding: 12px;
    background: var(--bg-color-3);
    border-left: 1px solid var(--neutral1);
    .host-item {
      display: flex;
      height: 22px;
      align-items: center;
      .name {
        width: 20%;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
      .node-active {
        color: var(--primary-color);
      }
      .total-line {
        position: relative;
        width: 80%;
        height: 8px;
        background: var(--neutral0);
        border-radius: 6px;
        .part-line {
          position: absolute;
          height: 100%;
          border-radius: 6px;
          // background: var(--primary-color);
          cursor: pointer;
        }
        .active {
          background: var(--primary-color);
        }
        .no-active {
          background: var(--neutral8);
        }
      }
    }
  }
  .scroll-bar::-webkit-scrollbar {
    width: 6px;
    height: 6px;
  }
  .scroll-bar::-webkit-scrollbar-thumb {
    background: var(--scrollbar-color);
  }
  .scroll-bar::-webkit-scrollbar-thumb:hover {
    background: var(--bg-color-2);
  }
}
</style>
