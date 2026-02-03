<!--
* 3d图标
-->
<template>
  <div class="default-image">
    <div
      v-if="showThree"
      v-loading="showThree && loading"
      class="three-wrapper"
    >
      <div class="close-box" @click="closePreview">
        <span class="close"></span>
      </div>
      <model-fbx
        v-if="showThree"
        :src="currentFdx"
        :backgroundAlpha="0.7"
        :backgroundColor="'rgba(0, 0, 0, 0)'"
        :controlsOptions="{
          enablePan: true,
          enableZoom: true,
          enableRotate: true,
        }"
        :scale="scale"
        @on-load="onLoad"
      ></model-fbx>
    </div>
    <div class="imag-container">
      <div
        :class="{ 'icon-box cursor': true, active: icon3Form == item.key }"
        v-for="(item, index) in list"
        :key="index"
        @mouseover="handleLayer(index)"
        @mouseleave="handleLayer()"
      >
        <div v-show="showMaskLayer === index" class="icon-box mask" @click.self="changeBackground(item.key)">
          <span @click.self="previewItem(item, index)">{{$tt('target.preview')}}</span>
        </div>
        <cb-image :src="item.value" fit="contain" />
      </div>
    </div>
  </div>
</template>

<script>
import t from '../../../../../utils/i18n';
import { ModelFbx } from 'vue-3d-model';
import PageStatus from "../../../../store/page-status";
import _ from "lodash";

export default {
  name: 'DefaultImage',
  props: {
    icon3: {
      type: String,
      default: '',
    },
  },
  components: {ModelFbx},
  data() {
    return {
      list: [],
      fdx_list: [],
      showThree: false,
      currentFdx: '',
      scale: {
        x: 0.75,
        y: 0.75,
        z: 0.75,
      },
      loading: true,
      showMaskLayer: null,
      showPreviewMask: false,
    };
  },
  computed: {
    icon3Form: {
      get() {
        return this.icon3
      },
      set(val) {
        this.$emit('update:icon3', val)
        return val;
      },
    }
  },
  mounted() {
    if (!_.isEmpty(PageStatus.state.model3DData)) {
      for (const defaultKey in PageStatus.state.model3DData) {
        this.list.push({
          key: defaultKey,
          value: PageStatus.state.model3DData[defaultKey]?.cover || ''
        })
        this.fdx_list.push({
          key: defaultKey,
          value: PageStatus.state.model3DData[defaultKey]?.file || ''
        })
      }
    }
  },
  watch: {},
  methods: {
    $tt: t,
    // 预览
    previewItem(data, index) {
      this.showThree = true;
      this.$nextTick(() => {
        this.showThree = true;
        this.currentFdx = this.fdx_list.find(item => item.key === data.key).value
      })
    },
    closePreview() {
      this.showThree = false;
      this.currentFdx = '';
    },
    handleLayer(index) {
      this.showMaskLayer = index;
    },
    onLoad() {
      this.loading = false;
    },
    changeBackground(key) {
      if (key == this.icon3Form) {
        this.$emit('changeImage', '');
      } else {
        this.$emit('changeImage', key);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.default-image {
  .icon-box {
    display: inline-block;
    margin-right: 7px;
    width: 55px;
    height: 50px;
    overflow: hidden;
    border: 1px solid transparent;
    &.active {
      position: relative;
      border: 1px solid #0bdaff;
    }
    img {
      width: 100%;
      height: 100%;
    }
    &.mask {
      position: absolute;
      z-index: 1;
      background-color: var(--mask-color);
      text-align: center;
      span {
        color: var(--primary-color);
        position: relative;
        top: 8px;
        z-index: 1;
        font-size: 13px;
        &:hover {
          text-decoration: underline;
        }
      }
    }
  }
  .imag-container {
    margin-top: -10px;
  }
  .three-wrapper {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 101;
    .close-box {
      position: absolute;
      top: 40px;
      right: 40px;
      width: 40px;
      cursor: pointer;
      background-color: #606266;
      display: flex;
      align-items: center;
      justify-content: center;
      height: 40px;
      border-radius: 50%;
    }
    .close {
      display: inline-block;
      width: 20px;
      height: 1px;
      background: #fff;
      transform: rotate(45deg);
    }

    .close::after {
      content: '';
      display: block;
      width: 20px;
      height: 1px;
      background: #fff;
      transform: rotate(-90deg);
    }
  }
}
</style>
