<template>
  <!-- 镜像图标图集 -->
  <div class="cover-set">
    <cb-tabs v-model="activeName">
      <cb-tab-pane :label="$t('device.stereo')" :name="tabNames.stereoscopic">
        <fieldset
          class="select-default-panel"
          v-if="activeName === tabNames.stereoscopic"
        >
          <img
            v-for="(item, index) in stereoscopicData"
            :key="index"
            :src="item"
            class="image-item"
            @click="selectDefaultLogo(item)"
          />
        </fieldset>
      </cb-tab-pane>
      <cb-tab-pane :label="$t('device.flat')" :name="tabNames.flat">
        <fieldset
          class="select-default-panel"
          v-if="activeName === tabNames.flat"
        >
          <img
            v-for="(item, index) in flatData"
            :key="index"
            :src="item"
            class="image-item"
            @click="selectDefaultLogo(item)"
          />
        </fieldset>
      </cb-tab-pane>
      <cb-tab-pane :label="$t('device.linear')" :name="tabNames.linear">
        <fieldset
          class="select-default-panel"
          v-if="activeName === tabNames.linear"
        >
          <img
            v-for="(item, index) in linearData"
            :key="index"
            :src="item"
            class="image-item"
            @click="selectDefaultLogo(item)"
          />
        </fieldset>
      </cb-tab-pane>
      <cb-tab-pane :label="$t('device.realistic')" :name="tabNames.realistic">
        <fieldset
          class="select-default-panel"
          v-if="activeName === tabNames.realistic"
        >
          <img
            v-for="(item, index) in realisticData"
            :key="index"
            :src="item"
            class="image-item"
            @click="selectDefaultLogo(item)"
          />
        </fieldset>
      </cb-tab-pane>
    </cb-tabs>
    <div class="tip-info">
      <cb-iconfont
        class="tip-info-icon"
        type="icon-jinggao"
        size="14"
        :style="{ color: 'var(--neutral5)', marginRight: '5px' }"
      ></cb-iconfont
      >{{ $t('device.imageSelectHint') }}
    </div>
  </div>
</template>

<script>
import _ from 'lodash';
export default {
  props: {
    dataList: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      activeName: 'stereoscopic', // 默认数据

      tabNames: {
        stereoscopic: 'stereoscopic', // 立体
        flat: 'flat', // 扁平
        linear: 'linear', // 线性
        realistic: 'realistic', // 写实
      },
      stereoscopicData: [],
      flatData: [],
      linearData: [],
      realisticData: [],
    };
  },
  watch: {
    dataList: {
      handler(val) {
        _.forEach(val, (item) => {
          if (item.style === 'default') {
            this.stereoscopicData = item.imgs;
          } else if (item.style === 'flat') {
            this.flatData = item.imgs;
          } else if (item.style === 'line') {
            this.linearData = item.imgs;
          } else if (item.style === 'realistic') {
            this.realisticData = item.imgs;
          }
        });
      },
      immediate: true,
      deep: true,
    },
  },
  mounted() {},
  methods: {
    selectDefaultLogo(data) {
      const selectedData = {
        url: data,
        name: data,
        key: data,
      };
      this.$emit('selectDefaultLogo', selectedData);
    },
  },
};
</script>

<style lang="scss" scoped>
.cover-set {
  background: var(--neutral0);
  margin-top: 10px;
  padding: 2px 16px 16px;
  position: relative;
  .select-default-panel {
    border: none;
    padding: 0;
    margin-left: -10px;
    .image-item {
      width: 60px;
      height: 60px;
      padding: 10px;
      &:hover {
        cursor: pointer;
      }
    }
  }

  .tip-info {
    color: var(--neutral5);
    font-size: 14px;
    position: absolute;
    right: 0;
    top: -38px;
  }
}
</style>
