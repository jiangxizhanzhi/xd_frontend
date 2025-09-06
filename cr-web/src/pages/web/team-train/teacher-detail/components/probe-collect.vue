<template>
  <div class="collect-probe">
    <!-- 团队教员探针采集页面 -->
    <div class="main-wrap">
      <!-- 左侧切换图标主机信息,采集数据 -->
      <div class="left-wrap">
        <div
          class="collect-type"
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
      <!-- 右侧内容 -->
      <div class="right-wrap">
        <!-- 主机信息 -->
        <host-info v-if="active === 0" :sceneId="sceneCollectId"></host-info>
        <!-- 采集数据 -->
        <collect-data
          v-if="active === 1"
          :sceneId="sceneCollectId"
        ></collect-data>
      </div>
    </div>
  </div>
</template>

<script>
import hostInfo from './probe-content/host-info'; //主机信息
import collectData from './probe-content/collect-data'; //采集数据
export default {
  components: {
    hostInfo,
    collectData,
  },
  props: {
    // 接收场景id
    sceneId: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      sceneCollectId: this.sceneId, //获取场景id赋值
      active: 0,
      directTypeList: [
        {
          icon: 'icon-tuopu1',
          name: this.$t('rbt.hostInfo'),
        },
        {
          icon: 'icon-renwudaotiao',
          name: this.$t('rbt.collectData'),
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
  },
};
</script>
<style lang="scss" scoped>
.collect-probe {
  width: 100%;
  height: 100%;
  .main-wrap {
    width: 100%;
    height: 100%;
    display: flex;
    .left-wrap {
      min-width: 80px;
      height: 160px;
      border-radius: 4px;
      border: 1px solid var(--bg-color-2);
      .collect-type {
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
        &:hover {
          background: var(--bg-color-2);
        }
      }
      .active {
        background: var(--bg-color-2);
        color: var(--primary-color);
      }
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
    height: 70px;
    position: fixed;
    bottom: 0px;
    left: 0;
    left: 40px;
  }
}
</style>
