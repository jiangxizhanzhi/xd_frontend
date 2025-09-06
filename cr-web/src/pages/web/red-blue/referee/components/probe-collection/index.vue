<template>
  <div class="probe-collection el-tabs__content">
    <div class="left-wrap">
      <div
        class="category"
        :key="index"
        v-for="(item, index) in categoryList"
        :class="[active === index ? 'active' : '']"
        @click="handleClick(index)"
      >
        <div class="img-wrap">
          <cb-iconfont :size="24" :type="item.icon"></cb-iconfont>
        </div>
        <span class="name">{{ item.name }}</span>
      </div>
    </div>
    <div class="right-wrap">
      <host-info v-if="active === 0" :sceneId="sceneId"></host-info>
      <collect-data v-if="active === 1" :sceneId="sceneId"></collect-data>
    </div>
  </div>
</template>

<script>
import hostInfo from './host-info/index.vue';
import collectData from './collect-data/index.vue';
export default {
  components: {
    hostInfo,
    collectData,
  },
  props: {
    sceneId: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      active: 0,
      categoryList: [
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
  methods: {
    handleClick(index) {
      this.active = index;
    },
  },
};
</script>
<style lang="scss" scoped>
.probe-collection {
  width: 100%;
  height: 100%;
  display: flex;
  .left-wrap {
    width: 80px;
    height: 160px;
    border-radius: 4px;
    border: 1px solid var(--bg-color-2);
    .category {
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
    width: calc(100% - 96px);
    margin-left: 16px;
  }
}
</style>
