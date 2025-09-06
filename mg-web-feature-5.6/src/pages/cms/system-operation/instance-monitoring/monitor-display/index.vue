<template>
  <div class="monitor-display">
    <div class="header">
      <div class="start-box"></div>
      <div class="left-box">
        <div class="box-menu-text">
          <span
            :class="[
              activeName === '场景监控' ? 'actived-menu' : '',
              'menu-text',
            ]"
            @click="corresponContent('场景监控')"
          >
            {{ $t('systemOperation.monitorScene.monitorScene') }}
          </span>
          <div class="menu-line"></div>
          <span
            :class="[
              activeName === '节点监控' ? 'actived-menu' : '',
              'menu-text',
            ]"
            @click="corresponContent('节点监控')"
          >
            {{ $t('systemOperation.nodeMonitoring.nodeMonitoring') }}
          </span>
        </div>
      </div>
      <div class="info-name">
        <div>{{ sysName }}</div>
      </div>
      <div class="right-box">
        <div class="box-menu-text">
          <template>
            <span
              :class="[
                activeName === '流量分析' ? 'actived-menu' : '',
                'menu-text',
              ]"
              @click="corresponContent('流量分析')"
            >
              {{ $t('systemOperation.trafficAnalysis.trafficAnalysis') }}
            </span>
            <div class="menu-line"></div>
            <span
              :class="[
                activeName === '事件分析' ? 'actived-menu' : '',
                'menu-text',
              ]"
              @click="corresponContent('事件分析')"
            >
              {{ $t('systemOperation.eventAnalysis.eventanalysis') }}
            </span>
            <div class="menu-line"></div>
          </template>
          <span
            :class="[
              activeName === '复盘回放' ? 'actived-menu' : '',
              'menu-text',
            ]"
            @click="corresponContent('复盘回放')"
            v-if="!hiddenTab"
          >
            {{ $t('systemOperation.monitorReplay.monitorReplay') }}
          </span>
        </div>
      </div>
      <div class="end-box"></div>
      <div class="bottom-info">
        <div v-show="showInfo" class="left-info">
          <div class="info-label">
            {{ $t('systemOperation.monitor.creator') }}
          </div>
          <div class="info-desc">
            {{ createInfo && createInfo.create_username }}
          </div>
          <div class="info-label">
            {{ $t('systemOperation.monitor.creationTime') }}
          </div>
          <div class="info-desc">
            {{ createInfo && createInfo.create_time }}
          </div>
        </div>
        <div v-show="showInfo" class="right-info">
          <div class="info-label">
            {{ $t('systemOperation.monitor.runTime') }}
          </div>
          <div class="info-desc">
            {{ createInfo && getHours(createInfo.run_minutes) }}
          </div>
          <div class="info-label">
            {{ $t('systemOperation.monitor.sceneIsolation') }}
          </div>
          <div class="info-desc">
            {{ createInfo && getsceneAttr(createInfo.scene_attr) }}
          </div>
        </div>
      </div>
    </div>
    <div class="display-content">
      <scene-monitor
        v-if="activeName === '场景监控'"
        :nodeId.sync="nodeId"
        @goNode="goNode"
      />
      <node-monitor
        v-else-if="activeName === '节点监控'"
        :nodeId.sync="nodeId"
      />
      <traffic-analysis v-else-if="activeName === '流量分析'" />
      <event-analysis
        v-else-if="activeName === '事件分析'"
        :nodeId.sync="nodeId"
        @goNode="goNode"
      />
      <replay v-else-if="activeName === '复盘回放'" />
    </div>
  </div>
</template>
<script>
import SceneMonitor from './scene-monitor/index.vue';
import NodeMonitor from './node-monitor/index.vue';
import TrafficAnalysis from './traffic-analysis/index.vue';
import EventAnalysis from './event-analysis/index.vue';
import Replay from './replay/index.vue';
import { getSceneInfo, getSceneData } from '@/api/monitor';
import { SceneMap } from '../../constant';
import { sceneType } from '@/constants/scene/scene-type';
import { getI18N } from '@cyber/helper';
export default {
  components: {
    SceneMonitor,
    NodeMonitor,
    TrafficAnalysis,
    EventAnalysis,
    Replay,
  },
  data() {
    return {
      hiddenTab: false,
      createInfo: {},
      activeName: '',
      nodeId: '',
      sysName: '',
    };
  },
  computed: {
    showInfo() {
      if (this.activeName === '场景监控' || this.activeName === '复盘回放') {
        return true;
      }
      return false;
    },
  },
  watch: {
    activeName: {
      handler: function (nv, ov) {
        if (nv !== '节点监控') {
          this.nodeId = '';
        }
      },
      deep: true,
      immediate: true,
    },
  },
  created() {
    this.hiddenTab = !!this.$route?.query?.hiddenTab;
  },
  mounted() {
    this.sceneId = this.$route.params.id;
    this.getSceneInfo();
    this.getSceneData();
    document.body.classList.add('cy-common-theme__dark');
  },
  destroyed() {
    document.body.classList.remove('cy-common-theme__dark');
  },
  methods: {
    goNode() {
      this.activeName = '节点监控';
    },
    // 场景创建信息
    getSceneInfo() {
      getSceneInfo(this.sceneId).then((res) => {
        const data = _.get(res, 'data.data', []);
        this.createInfo = {
          create_username: data.create_username,
          create_time: data.create_time,
          run_minutes: data.run_minutes,
          scene_attr: data.scene_attr,
        };
        let drill = '';
        if (getI18N().locale === 'zh-CN') {
          drill = this.$t('systemOperation.scene.drill');
        } else {
          drill = ' ' + this.$t('systemOperation.scene.drill');
        }
        if (sceneType[data.reference_type]) {
          this.sysName = sceneType[data.reference_type].label + drill;
        } else {
          this.sysName = this.$t('systemOperation.scene.other') + drill;
        }
      });
    },
    // 获取场景信息
    getSceneData() {
      const query = {
        id: this.sceneId,
      };
      getSceneData(query).then((res) => {
        const data = _.get(res, 'data.data');
        const scene = data.scene.topology.scene;
        const event = scene.event;
        const event_status = scene.event_status;
        const eventMap = `${event}-${event_status}`;
        const evenMaps = SceneMap[eventMap];
        // if (evenMaps === this.$t('systemOperation.scene.deleted')) {
        //   this.showOther = false;
        //   this.activeName = '复盘回放';
        // } else {
        // this.showOther = true;
        this.activeName = '场景监控';
        // }
      });
    },
    getHours(time) {
      const hour = parseInt(time / 60);
      const minus = time % 60;
      return `${hour} ${this.$t(
        'systemOperation.monitor.hours',
      )} ${minus} ${this.$t('systemOperation.monitor.minus')}`;
    },
    getsceneAttr(value) {
      if (value === 2) {
        return this.$t('systemOperation.scene.teamIsolated');
      } else if (value === 1) {
        return this.$t('systemOperation.scene.individualIsolation');
      } else {
        return this.$t('systemOperation.scene.noIsolation');
      }
    },
    corresponContent(val) {
      this.activeName = val;
    },
  },
};
</script>
<style lang="scss" scoped>
.monitor-display {
  background: url('./assets/img/bg.png') no-repeat;
  background-size: cover;
  height: 100%;
  width: 100%;
  min-width: 1600px;
  min-height: 900px;
  .header {
    width: 100%;
    height: 75px;
    background-color: #1b212c;
    display: flex;
    position: relative;
    justify-content: center;
    .box-menu-text {
      display: flex;
      align-items: center;
      padding-bottom: 26px;
      z-index: 1;
      .menu-text {
        cursor: pointer;
        font-size: 16px;
        font-family: Microsoft YaHei;
        font-weight: 600;
        color: #e7efff;
        margin: 0 18px;
      }
      .menu-line {
        width: 1px;
        height: 12px;
        background: #00a2ff;
      }
      .actived-menu {
        color: #0bdaff;
      }
    }
    .info-name {
      height: 100%;
      width: 600px;
      background: url('./assets/img/header_center.png') no-repeat;
      background-position: bottom;
      background-size: 100% 60px;
      padding-top: 10px;
      display: flex;
      justify-content: center;
      & > div {
        font-size: 30px;
        font-weight: 400;
        font-family: youshebiaotihei;
        background: linear-gradient(
          0deg,
          #bde1ff 0%,
          #ffffff 50%,
          #e7efff 100%
        );
        background-clip: text;
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
      }
    }
    .left-box,
    .right-box {
      height: 100%;
      width: 450px;
      display: flex;
      align-items: center;
      justify-content: flex-start;
      position: relative;
      &::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: url('./assets/img/header_line.png') no-repeat;
        background-position: bottom;
        background-size: 100% 60px;
      }
    }
    .left-box {
      justify-content: flex-end;
      &::before {
        transform: scaleX(-1);
      }
    }
    .start-box,
    .end-box {
      width: calc(50% - 300px - 450px);
      height: 100%;
      background: url('./assets/img/header_end.png') no-repeat;
      background-position: bottom left;
      background-size: auto 60px;
    }
    .start-box {
      transform: scaleX(-1);
    }
    .bottom-info {
      width: 100%;
      position: absolute;
      bottom: 6px;
      display: flex;
      justify-content: space-between;
      padding: 0 20px;
      .left-info,
      .right-info {
        display: flex;
        align-items: center;
        font-size: 12px;
        .info-label {
          color: #a9b7d6;
          margin-left: 20px;
        }
        .info-desc {
          margin: 0 20px;
          font-size: 14px;
          font-family: Microsoft YaHei;
          font-weight: 700;
          color: #bde1ff;
          text-shadow: 0px 0px 20px #0b1e41;
        }
      }
    }
  }
  .display-content {
    height: calc(100% - 75px);
    width: calc(100% - 24px);
    padding: 0 12px;
    box-sizing: content-box;
    ::v-deep .elc-scene-loader-container {
      background-image: none;
    }
  }
}
</style>
