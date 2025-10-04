<template>
  <div class="teacher-control">
    <!-- 团队教员导调控制页面 -->
    <div class="main-wrap">
      <div :class="this.isShow == 'true' ? 'left-wrap' : 'left-wrap-other'">
        <div
          class="direct-type"
          :key="index"
          v-for="(item, index) in directTypeList"
          :class="[active === index ? 'active' : '']"
          @click="handleClick(index)"
        >
          <div class="img-wrap">
            <cb-iconfont :size="24" :type="item.icon"></cb-iconfont>
          </div>
          <span class="name">{{ item.name }}</span>
        </div>
      </div>
      <!-- 左侧导调切换按钮 -->
      <div class="right-wrap">
        <!-- 环境导调 -->
        <pilot-environment
          v-if="active === 0"
          @sceneId="sceneId"
          @topoId="topoId"
          @sendData="getData"
        ></pilot-environment>
        <!-- 任务导调 -->
        <pilot-task
          v-if="active === 1"
          :cr-event-data="crEventData"
        ></pilot-task>
        <!-- 行为导调 -->
        <pilot-behavior
          v-if="active === 2"
          :controlSceneId="controlSceneId"
          :active="active"
        ></pilot-behavior>
        <!-- 态势导调5.4.1新页面 -->
        <pilot-situation
          v-if="active === 3"
          :screen-name="screenName"
          :controlSceneId="controlSceneId"
          :controlTopoId="controlTopoId"
        >
        </pilot-situation>
      </div>
    </div>
    <div class="footer">
      <time-line :scale-times="scaleTimes" />
    </div>
  </div>
</template>

<script>
import { getTimeLineApi, getIsShowApi } from '@/api/web/team-training';
import pilotEnvironment from './pilot-environment.vue'; //环境导调
import pilotTask from './pilot-task.vue'; //任务导调
import pilotBehavior from './pilot-behavior.vue'; //行为导调
// import pilotSituation from './pilot-situation.vue'; //态势导调5.4
import pilotSituation from './team-pilot-situation.vue'; //团队态势导调5.4.1

import timeLine from '@/components/TimeLine/TeacherTimeLineControl.vue'; //底部时间轴
export default {
  components: {
    pilotEnvironment,
    pilotTask,
    pilotBehavior,
    pilotSituation,
    timeLine,
  },
  props: {
    crEventData: {
      type: Object,
      default: () => {},
    },
    screenName: {
      type: String,
      default: '',
    },
    timeLineUpData: {
      type: Number,
      default() {
        return 0;
      },
    },
  },
  data() {
    return {
      isShow: '',
      controlSceneId: '',
      resource_id: '',
      active: 0,
      directTypeList: [
        {
          icon: 'icon-tuopu1',
          name: this.$t('rbt.environmentModulation'),
        },
        {
          icon: 'icon-renwudaotiao',
          name: this.$t('rbt.taskModulation'),
        },
        // {
        //   icon: 'icon-liuliang',
        //   name: this.$t('rbt.behaviorModulation'),
        // },
        // {
        //   icon: 'icon-taishidaotiao',
        //   name: this.$t('rbt.situationModulation'),
        // },
      ],
      scaleTimes: {
        data: [],
        start_time: '',
        end_time: '',
        duration_time: '',
      },
    };
  },
  watch: {
    timeLineUpData: {
      handler(val, oldVal) {
        if (val) {
          //更新时间轴
          this.getTimeLineInfo(
            this.$route.params && this.$route.params.resource_id,
          );
        }
      },
      immediate: true,
      deep: true,
    },
  },

  computed: {},
  created() {
    this.resource_id = this.$route.params && this.$route.params.resource_id;
    this.getSituationData();
  },
  mounted() {
    this.getTimeLineInfo(this.$route.params && this.$route.params.resource_id);
  },
  beforeDestroy() {},
  destroy() {},
  methods: {
    // 显示隐藏态势导调
    getSituationData() {
      getIsShowApi().then((res) => {
        res.data.data.forEach((item) => {
          if (item.name === 'isShowSituation') {
            this.isShow = item.content;
            if (this.isShow) {
              if (this.isShow === 'false') {
                this.directTypeList = this.directTypeList.slice(0, -1);
              } else if (this.isShow === 'true') {
                this.directTypeList = this.directTypeList;
              }
            }
          }
        });
      });
    },
    sceneId(data) {
      // 获取态势导调的sceneid(启动场景)
      this.controlSceneId = data;
      this.$emit('sceneId', data);
    },
    topoId(data) {
      // 获取态势导调的topoid(未启动场景)
      this.controlTopoId = data;
      this.$emit('topoId', data);
    },
    getData(hasLayer) {},
    // 教员-获取时间轴数据
    getTimeLineInfo(id) {
      getTimeLineApi({ resource_id: id }).then((res) => {
        _.forEach(res.data.data.user_time_line_config, (item) => {
          if (item.type === 1) {
            this.$set(item, 'actionName', this.$t('m.issueTask'));
          } else {
            this.$set(item, 'actionName', this.$t('m.sendTraffic'));
          }
        });
        this.scaleTimes.data = res.data.data.user_time_line_config;
        this.scaleTimes.start_time = res.data.data.start_time;
        this.scaleTimes.end_time = res.data.data.end_time;
        this.scaleTimes.current_time = res.data.data.current_time;
      });
    },
    handleClick(index) {
      this.active = index;
    },
  },
};
</script>
<style lang="scss" scoped>
.teacher-control {
  width: 100%;
  height: 100%;
  .main-wrap {
    width: 100%;
    height: 100%;
    display: flex;
    .left-wrap-other {
      height: 240px !important;
    }
    .left-wrap,
    .left-wrap-other {
      min-width: 80px;
      height: 320px;
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
    .right-wrap {
      // flex: 1;
      width: calc(100% - 96px);
      margin-left: 16px;
    }
  }
  .footer {
    width: calc(100% - 80px);
    box-sizing: border-box;
    height: 56px;
    position: fixed;
    bottom: 0px;
    left: 0;
    left: 40px;
  }
}
</style>
