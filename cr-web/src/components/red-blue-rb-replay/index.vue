<template>
  <div class="teacher-reply">
    <!-- 团队教员复盘回放页面-->
    <div class="main-wrap">
      <div class="left-wrap">
        <div
          class="reply-type"
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
      <!-- 左侧复盘切换按钮 -->
      <div v-if="sceneId" class="right-wrap">
        <!-- 用户复盘 -->
        <replay-user
          v-if="showUser && active === 0"
          :isRedBlue="isRedBlue"
          :sceneId="sceneId"
          @switchReplay="switchReplay"
        >
        </replay-user>
        <!-- 设备复盘 -->
        <replay-device
          v-if="active === 1"
          :isRedBlue="isRedBlue"
          :sceneId="sceneId"
          @switchReplay="switchReplay"
        >
        </replay-device>
        <!-- 态势复盘 -->
        <div v-if="active === 2" style="height: 100%">
          <replay-situation
            :isRedBlue="isRedBlue"
            :sceneId="sceneId"
            :topoId="topoId"
          >
          </replay-situation>
        </div>
      </div>
      <!-- 无数据时 -->
      <div v-else class="no-data">
        <div class="info">
          <cb-iconfont type="icon-zanwuziyuan" size="56"></cb-iconfont>
          <div>{{ $t('m.noData') }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ReplayUser from './replay-user.vue';
import ReplayDevice from './replay-device.vue';
import ReplaySituation from './replay-situation.vue';

export default {
  props: {
    //区分综合演训与红蓝，默认是红蓝
    isRedBlue: {
      type: Boolean,
      default: () => {
        return true;
      },
    },
    //场景id
    sceneId: {
      type: String,
      default: () => {
        return '';
      },
    },
    //topoId
    topoId: {
      type: String,
      default: () => {
        return '';
      },
    },
  },
  components: {
    ReplayUser,
    ReplayDevice,
    ReplaySituation,
  },
  data() {
    return {
      //默认用户复盘
      showUser: true,
      active: 0,
      directTypeList: [
        {
          icon: 'icon-yonghufupan',
          name: this.$t('common.userReplay'),
        },
        {
          icon: 'icon-shebeifupan',
          name: this.$t('common.deviceReplay'),
        },
        {
          icon: 'icon-taishifupan',
          name: this.$t('common.situationReplay'),
        },
      ],
    };
  },
  watch: {},

  computed: {},
  created() {},
  mounted() {},
  beforeDestroy() {},
  destroy() {},
  methods: {
    handleClick(index) {
      this.active = index;
    },
    switchReplay() {
      this.showUser = !this.showUser;
    },
  },
};
</script>
<style lang="scss" scoped>
.teacher-reply {
  width: 100%;
  height: 100%;

  .main-wrap {
    width: 100%;
    height: 100%;
    display: flex;
    .left-wrap {
      min-width: 80px;
      height: 240px;
      border-radius: 4px;
      border: 1px solid var(--bg-color-2);
      .reply-type {
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
    .reply-type:hover {
      background: var(--bg-color-2);
    }
    .right-wrap {
      width: calc(100% - 96px);
      margin-left: 16px;
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
