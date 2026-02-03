<!--
 * @Author: Fengxuyan
 * @Date: 2021-08-25 09:55:44
 * @LastEditTime: 2021-10-18 11:50:31
 * @LastEditors: Fengxuyan
 * @Description:
-->
<template>
  <cb-dialog
    width="840px"
    class="drawer-dialog"
    :visible.sync="visibleForm"
    @close="handleClose"
    :modal-append-to-body="false"
  >
    <template slot="title">
      <div>{{ $tt('menu.menu.basicSetting') }}</div>
    </template>
    <div>
      <cb-form
        ref="fromRefDisplaySetting"
        :model.sync="copyForm"
        :rules="rules"
        :url="url"
        :baseURL="baseURL"
        id="displaySetting"
        :json="true"
        width="100%"
        label-position="right"
        :label-width="labelWidth"
      >
        <cb-tabs type="border-card" class="">
          <cb-tab-pane :label="$tt('menu.menu.displaySetting')">
          <cb-form-item :label="$tt('menu.dialog.editBackground') + '：'">
            <cb-radio-group v-model="copyForm.backgroundType" @change="changeBackgroundType">
              <cb-radio label="background-image">{{$tt('menu.dialog.backgroundImage')}}</cb-radio>
              <cb-radio label="background-color">{{$tt('menu.dialog.backgroundColor')}}</cb-radio>
            </cb-radio-group>
          </cb-form-item>
          <cb-form-item v-show="copyForm.backgroundType === 'background-image'">
            <default-image
              @changeImage="changeImage"
              :active="copyForm.active"
              :backgroundList.sync="copyForm.backgroundList"
            ></default-image>
          </cb-form-item>
          <cb-form-item v-show="copyForm.backgroundType === 'background-color'">
            <div class="background-color-box">
              <cb-popover placement="bottom-start" trigger="click">
                <div><Sketch v-model="copyForm.backgroundColor" :preset-colors="presetColors"></Sketch></div>
                <div slot="reference" class="color-preview-box">
                  <div class="color-box" :style="'background-color: ' + colorRGBA"></div>
                </div>
              </cb-popover>
            </div>
          </cb-form-item>
            <!--是否显示网格，对edit和display都生效-->
            <cb-form-item
              :label="$tt('menu.dialog.showGrid') + '：'"
              prop="showGrid"
            >
              <cb-switch v-model="copyForm.showGrid" active-color="#13ce66">
              </cb-switch>
            </cb-form-item>
          <!--画布工具栏和节点数量提示只对编辑模式生效，对display模式不生效-->
          <cb-form-item
            :label="$tt('menu.dialog.isShowGraphToolbar') + '：'"
            prop="showGraphToolbar"
          >
            <cb-switch v-model="copyForm.showGraphToolbar" active-color="#13ce66">
            </cb-switch>
          </cb-form-item>
          <cb-form-item
            :label="$tt('menu.dialog.isOpenSimpleLineMode') + '：'"
            prop="simpleModeToEdge"
          >
            <cb-switch v-model="copyForm.simpleModeToEdge" active-color="#13ce66">
            </cb-switch>
          </cb-form-item>
          <cb-form-item
            :label="$tt('menu.dialog.isShowLineLabels') + '：'"
            prop="showLineLabels"
          >
            <cb-switch v-model="copyForm.showLineLabels" active-color="#13ce66">
            </cb-switch>
          </cb-form-item>
          <cb-form-item
            :label="$tt('menu.dialog.isShowNodeLimitTip') + '：'"
            prop="showNodeLimitTip"
          >
            <cb-switch v-model="copyForm.showNodeLimitTip" active-color="#13ce66">
            </cb-switch>
          </cb-form-item>
          </cb-tab-pane>
          <!-- 数据采集相关配置只在有数据采集菜单的时候有 -->
          <cb-tab-pane :label="$tt('menu.menu.businessSetting')">
            <cb-form-item
              :label="$tt('menu.dialog.isOpenFlowCollect') + '：'"
              prop="collection"
              v-if="!menubar.length || menubar.includes('probe')"
            >
              <cb-switch
                v-model="copyForm.enable_flow_collect"
                active-color="#13ce66"
              >
              </cb-switch>
            </cb-form-item>
            <!-- 是否开始流量镜像 -->
            <cb-form-item
              :label="$tt('menu.dialog.isOpenFlowImage') + '：'"
              prop="mirror"
              v-if="!menubar.length || menubar.includes('probe')"
            >
              <cb-switch
                v-model="copyForm.enable_flow_mirror"
                active-color="#13ce66"
              >
              </cb-switch>
            </cb-form-item>
            <!-- 全局DNS配置 TODO 校验-->
            <div class="dns-wrapper" v-if="dnsForm && dnsForm.length">
              <div v-for="(item, index) in dnsForm" :key="index">
                <cb-form-item
                  :label="index == 0 ? 'DNS：' : ''"
                  :rules="FORM_RULES.networkConfig.ip"
                  class="dns-input"
                >
                  <cb-input
                    :disabled="uneditableBySceneStatus"
                    size="small"
                    v-model="item.domain"
                    type="text"
                    :placeholder="$tt('menu.dialog.inputDNS')"
                    clearable
                  ></cb-input>
                </cb-form-item>
                <cb-form-item label-width="8px" class="server-select">
                  <cb-select
                    size="small"
                    v-model="item.node_id"
                    :options="nodesOptions"
                    width="250px"
                    clearable
                    :placeholder="$tt('menu.dialog.selectServer')"
                  ></cb-select>
                </cb-form-item>
                <div class="btn-box">
                  <cb-button :disabled="uneditableBySceneStatus" type="text" icon="icon-jianshao"
                             @click="deleteDNS(index, item)"></cb-button>
                  <cb-button :disabled="uneditableBySceneStatus" v-if="index == dnsForm.length - 1" type="text" icon="icon-xinzeng" @click="addDNS()" class="add-btn"></cb-button>
                </div>
              </div>
            </div>
            <div v-else :class="{'empty-wrapper': true, 'table': true}">
              <cb-button :disabled="uneditableBySceneStatus" type="text" icon="icon-xinzeng" @click="addDNS()">{{$tt('target.addDNS')}}</cb-button>
            </div>
          </cb-tab-pane>
        </cb-tabs>
      </cb-form>
    </div>
    <template slot="footer">
      <div class="form-button-group">
        <cb-button-group space="middle">
          <cb-button
            button-type="confirm"
            @click="submitForm($event)"
          ></cb-button>
          <cb-button button-type="cancel" @click="handleClose"></cb-button>
        </cb-button-group>
      </div>
    </template>
  </cb-dialog>
</template>

<script>
import t from '../../../../utils/i18n';
import background_dark from '../../../../assets/images/dark/background.png';
import background2_dark from '../../../../assets/images/dark/background2.png';
import background3_dark from '../../../../assets/images/dark/background3.png';
import background_light from '../../../../assets/images/light/background.png';
import background2_light from '../../../../assets/images/light/background2.png';
import background3_light from '../../../../assets/images/light/background3.png';
import { inject, computed, ref, reactive } from '@vue/composition-api';
import DefaultImage from './default-image.vue';
import _ from 'lodash';
import { cyberBus } from '../../../../utils/event-bus';
import PageStatus from '../../../store/page-status';
import sceneStore from '../../../../store/scene-store';
import {Sketch} from 'vue-color';
import {initialThemeColorToRGBA, transferRGBA} from "../../../../utils/common/colorful";
import {FORM_RULES} from "../components/constant/form-rules";
import EmptyBox from "../components/empty-box/empty-box";

export default {
  name: 'DialogBasicConfig',
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    menubar: {
      type: Array,
      default: () => [],
    },
  },
  setup(props, {emit}) {
    const lang = inject('lang');
    const labelWidth = computed(() => {
      return lang === 'zh-CN' ? '130px' : '180px';
    });
    const form = ref(sceneStore.state.basicConfig);
    if (_.isEmpty(form.value)) {
      _.merge(form.value, {
        active:
          form.value && form.value.active ? form.value.active : 'background',
        enable_flow_collect: false,
        enable_flow_mirror: false,
        showLineLabels: false,
        dns_nameservers:
          form.value && form.value.dns_nameservers
            ? form.value.dns_nameservers
            : [],
        backgroundList:
          form.value && form.value.backgroundList
            ? form.value.backgroundList
            : [
                { key: 'background', value: '' },
                { key: 'background2', value: '' },
                { key: 'background3', value: '' },
              ],
        /**
         * 连线模式
         * true 简易型连线模式
         * false 需要选择端口
         */
        simpleModeToEdge: true,
        // 右下方节点数量限制信息展示
        showNodeLimitTip: true,
        // 右下方画布工具栏
        showGraphToolbar: true,
        // 布局类型
        layoutType: 'none',
        // 背景类型
        backgroundType: 'background-image', // background-image || background-color
        // 背景色值
        backgroundColor: 'var(--bg-color-1)', // 背景色值
        // 网格
        showGrid: true,
      });
    }
    const visibleForm = computed({
      get: () => {
        return props.visible;
      },
      set: (val) => {
        return val;
      },
    });
    // 场景状态
    const uneditableBySceneStatus = computed({
      get: () => {
        return (sceneStore.state.sceneStatus === 'display' || sceneStore.state.sceneStatus === 'update');
      },
    });
    return {
      labelWidth,
      form,
      visibleForm,
      uneditableBySceneStatus,
      FORM_RULES,
    };
  },
  data() {
    return {
      baseURL: '',
      url: '',
      rules: {},
      defaultBackroundList: [
        {
          key: 'background',
          value:
            PageStatus.state.theme === 'dark'
              ? background_dark
              : background_light,
        },
        {
          key: 'background2',
          value:
            PageStatus.state.theme === 'dark'
              ? background2_dark
              : background2_light,
        },
        {
          key: 'background3',
          value:
            PageStatus.state.theme === 'dark'
              ? background3_dark
              : background3_light,
        },
      ],
      copyForm: [],
      flagImage: false, // 是否切换图片
      // 颜色拾取器预置的色值
      presetColors: [
        'rgb(208, 2, 27)',
        'rgb(245, 166, 35)',
        'rgb(248, 231, 28)',
        'rgb(139, 87, 42)',
        'rgb(126, 211, 33)',
        'rgb(65, 117, 5)',
        'rgb(189, 16, 224)',
        'rgb(144, 19, 254)',
        'rgb(74, 144, 226)',
        'rgb(80, 227, 194)',
        'rgb(184, 233, 134)',
        'rgb(0, 0, 0)',
        'rgb(74, 74, 74)',
        'rgb(155, 155, 155)',
        'rgb(255, 255, 255)',
        '#131926',
        '#EDF0F2'
      ],
      dnsForm: [],
    };
  },
  created() {
    this.copyForm = _.cloneDeep(this.form);
    this.dnsForm = this.copyForm.dns_nameservers;
  },
  computed: {
    colorRGBA() {
      if (typeof this.copyForm.backgroundColor == 'string' && this.copyForm.backgroundColor.indexOf('var') >=0) {
        return initialThemeColorToRGBA(this.copyForm.backgroundColor);
      }
      if (typeof this.copyForm.backgroundColor == 'object') {
        return transferRGBA(this.copyForm.backgroundColor.rgba);
      }
      return this.copyForm.backgroundColor;
    },
    nodesOptions() {
      return _.compact(sceneStore.state.graph.getNodes()?.map(node => {
        if (node.shape === 'rect') {
          return {
            label: node.data?.basicConfig?.name,
            value: node.id
          }
        }
      }));
    }
  },
  watch: {},
  methods: {
    $tt: t,
    handleClose() {
      this.$emit('handleClose', false);
    },
    changeImage(active) {
      this.flagImage = true;
      this.copyForm.active = active;
    },
    changeBackgroundType(data) {
      this.copyForm.backgroundType = data;
    },
    submitForm() {
      let _icon = this.getBackground();
      this.copyForm.backgroundColor = this.colorRGBA;
      // 设置dns_nameservers
      this.copyForm.dns_nameservers = this.dnsForm;
      // 基础配置
      sceneStore.state.basicConfig = reactive(this.copyForm);
      // 需要判定是切换的背景图片还是背景色
      let updateBg = {
        'background-image': _icon,
        'background-color': this.colorRGBA,
      }
      // 切换背景图和背景色
      cyberBus.emit('changeBackground', { type: this.copyForm.backgroundType, data: updateBg[this.copyForm.backgroundType] });
      // 展示或者隐藏端口名称
      if (this.copyForm.showLineLabels != this.form.showLineLabels) {
        cyberBus.emit('set-line-labels', this.copyForm.showLineLabels);
      }
      // 网格
      if (this.copyForm.showGrid != this.form.showGrid) {
        cyberBus.emit('set-show-grid', this.copyForm.showGrid);
      }
      // 布局
      cyberBus.emit('set-layout', this.copyForm.layoutType);
      // 是否开启简易型连线模式
      if (this.copyForm.simpleModeToEdge != this.form.simpleModeToEdge) {
        cyberBus.emit(
          'set-simple-mode-to-edge',
          this.copyForm.simpleModeToEdge,
        );
      }
      this.$emit('handleClose', false);
    },
    getBackground() {
      if (this.copyForm.active) {
        this.form.active = this.copyForm.active;
        if (
          ['background', 'background2', 'background3'].includes(
            this.copyForm.active,
          )
        ) {
          return this.defaultBackroundList.filter(
            (item) => item.key == this.copyForm.active,
          )[0].value;
        } else {
          return this.copyForm.active;
        }
      } else {
        this.form.active = 'background';
        return this.defaultBackroundList.filter(
          (item) => item.key == 'background',
        )[0].value;
      }
    },
    addDNS() {
      let addData = {
        domain: '',
        node_id: ''
      }
      this.dnsForm.push(addData);
    },
    deleteDNS(index) {
      this.dnsForm.splice(index, 1);
    },
  },
  components: { DefaultImage, Sketch, EmptyBox },
};
</script>

<style lang="scss" scoped>
.form-button-group {
  text-align: center;
}
.background-color-box {
  width: 100%;
  .color-preview-box {
    cursor: pointer;
    width: 100%;
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px solid var(--neutral1);
    .color-box {
      width: calc(100% - 20px);
      height: 12px;
    }
  }
}
.dns-wrapper {
  max-height: 260px;
  overflow-y: auto;
  .dns-input {
    display: inline-block;
    width: 350px;
  }
  .server-select {
    display: inline-block;
  }
  .btn-box {
    display: inline-block;
    margin-left: 20px;
    .add-btn {
      margin-left: 16px;
    }
  }
}
.empty-wrapper {
  text-align: center;
}
</style>
