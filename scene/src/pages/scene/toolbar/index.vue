<template>
  <div class="topology-toolbar ft14" v-show="showToolbar">
    <div class="canvas-toolbar-wrapper triangle flex-around">
      <cb-tooltip
        class="item"
        effect="dark"
        :content="itm.name"
        placement="left"
        v-for="itm in canvasBarList"
        :key="JSON.stringify(itm.name + itm.index)"
        :popper-class="
          itm.index === 6 ? 'toolbar-self-width-max' : 'toolbar-self-width-min'
        "
      >
        <div class="toolbar-icon" @click="clickBar(itm)">
          <cb-popover
            popper-class="scene-editor-popover"
            v-if="itm.index === 8"
            trigger="click"
            placement="left-end"
            :append-to-body="false"
            :popper-options="popperOption"
          >
            <div class="help-box">
              <div class="help-value">
                <div class="help-item" v-for="(item, i) in shortcuts" :key="i">
                  {{ item.value }}
                </div>
              </div>
              <div class="help-name">
                <div class="help-item" v-for="(item, i) in shortcuts" :key="i">
                  <span v-for="(key, j) in item.key" :key="j + key">
                    <span v-if="typeof key === 'string'"> {{ key }}</span>
                    <span v-else>
                      <cb-iconfont
                        :size="16"
                        color="var(--neutral8)"
                        :type="key.icon"
                      ></cb-iconfont>
                    </span>
                  </span>
                </div>
              </div>
            </div>
            <cb-iconfont
              class="help-icon"
              :type="itm.icon"
              :size="itm.size || '18'"
              color="var(--neutral8)"
              slot="reference"
            ></cb-iconfont>
          </cb-popover>
          <cb-iconfont
            class="help-icon"
            v-else
            :type="itm.icon"
            :size="itm.size || '18'"
            color="var(--neutral8)"
          ></cb-iconfont>
        </div>
      </cb-tooltip>
    </div>
  </div>
</template>

<script>
import PageStatus from '../../../pages/store/page-status.ts';
import t from '../../../utils/i18n';
import { inject, ref } from '@vue/composition-api';
import { help } from './constant';
import _ from 'lodash';

export default {
  name: 'TopologyToolbar',
  props: {
    showToolbar: {
      type: Boolean,
      default: false,
    },
    toolbar: {
      type: Array,
      default: () => [],
    },
  },
  setup() {
    const lang = inject('lang');
    let shareState = ref(PageStatus.state);
    return {
      lang,
      shareState,
    };
  },
  data() {
    return {
      active: 0,
      isFullScreen: false,
      shortcuts: help,
      popperOption: {
        boundariesElement: '.canvas-toolbar-wrapper',
      },
      canvasBarList: [],
      barList: [
        {
          name: this.$tt('toolbar.amplify'),
          icon: 'icon-fangda',
          index: 4,
          value: 'positive',
          config: {},
        },
        {
          name: this.$tt('toolbar.shrink'),
          icon: 'icon-suoxiao',
          index: 5,
          value: 'negative',
          config: {},
        },
        {
          name: this.$tt('toolbar.restore'),
          icon: 'icon-shijidaxiao',
          index: 6,
          value: 'restore',
          config: {},
        },
        {
          name: this.$tt('toolbar.help'),
          icon: 'icon-bangzhu',
          index: 8,
          value: 'help',
          config: {},
        },
      ],
      barCancelItem: {
        name: this.$tt('toolbar.cancelFullscreen'),
        icon: 'icon-quxiaoquanping',
        index: 7,
        value: 'fullScreen',
        config: {},
      },
      barFullItem: {
        name: this.$tt('toolbar.fullscreen'),
        icon: 'icon-quanping',
        index: 7,
        value: 'fullScreen',
        config: {},
      },
    };
  },
  computed: {
    toolbarStatus() {
      return PageStatus.state;
    },
  },
  methods: {
    $tt: t,
    clickBar(toolbar) {
      let _toolbar = _.clone(this.toolbarStatus.toolbarConfig);
      //禁用一些状态
      if (![4, 5, 6, 7, 8].includes(toolbar.index)) {
        PageStatus.setToolbar({
          eventConfig: {
            ..._toolbar.eventConfig,
            ...toolbar.config,
          },
          index: toolbar.index,
        });
      }
      if (toolbar.index === 7) {
        if (this.isFullScreen) {
          this.exitScreen();
        } else {
          this.fullScreen();
        }
      }
      this.$emit(
        'clickToolbar',
        toolbar.value,
        toolbar.index,
        _toolbar.eventConfig.index,
      );
      this.active = toolbar.index;
    },
    fullScreen() {
      let el = document.querySelector('.scene-all');
      el.style.position = 'fixed';
      el.style.top = '0';
      el.style.bottom = '0';
      el.style.left = '0';
      el.style.right = '0';
      el.style.zIndex = 1001; // 需高于业务层级
      this.isFullScreen = true;
      el.classList.add('fullscreen');
    },
    exitScreen() {
      let el = document.querySelector('.scene-all');
      el.style.position = 'relative';
      this.isFullScreen = false;
      el.classList.remove('fullscreen');
      el.style.zIndex = 1;
    },
    setToolbar() {
      if (!this.toolbar.length) return;
      const toolbar = this.toolbar,
        canvasBarList = this.canvasBarList,
        list = [];
      for (let i = 0; i < toolbar.length; i++) {
        for (let j = 0; j < canvasBarList.length; j++) {
          if (toolbar[i] === canvasBarList[j].value) {
            list.push(canvasBarList[j]);
            break;
          }
        }
      }
      this.canvasBarList = list;
    },
  },
  mounted() {
    this.setToolbar();
  },
  watch: {
    isFullScreen: {
      handler(val) {
        if (val) {
          const list = _.cloneDeep(this.canvasBarList);
          list.splice(0, 1, this.barCancelItem);
          this.canvasBarList = list;
        } else {
          if (!this.canvasBarList.length) {
            this.canvasBarList = [this.barFullItem, ...this.barList];
          } else {
            const list = _.cloneDeep(this.canvasBarList);
            list.splice(0, 1, this.barFullItem);
            this.canvasBarList = list;
          }
        }
        PageStatus.setFullScreen(val);
      },
      immediate: true,
    },
  },
};
</script>

<style lang="scss">
.scene-editor-popover {
  min-width: unset !important;
  border-color: var(--neutral3) !important;
  background-color: var(--bg-color-2) !important;
  padding: 8px !important;

  .help-box {
    display: flex;

    .help-item {
      height: 20px;
      line-height: 20px;
      font-size: 12px;
      white-space: nowrap;
    }

    .help-name {
      .help-item {
        display: flex;
        justify-content: flex-end;
        align-items: center;

        span {
          width: 28px;
          text-align: center;
        }
      }
    }

    .help-value {
      margin-right: 5px;

      .help-item {
        text-align: left;
      }
    }
  }

  .popper__arrow {
    &::after {
      border-left-color: var(--neutral3) !important;
    }
  }
}
.toolbar-self-width-max {
  text-align: center;
  min-width: 80px;
}
.toolbar-self-width-min {
  text-align: center;
  min-width: 50px;
}
</style>
<style lang="scss" scoped>
@mixin transition-collapse($left, $time) {
  left: $left;
  transition: left $time;
  transition-timing-function: ease;
}

.topology-toolbar {
  .canvas-toolbar-wrapper {
    width: 40px;
    position: absolute;
    right: 12px;
    bottom: 12px;
    flex-direction: column;
    border: 1px solid var(--neutral3);
    background-color: var(--bg-color-2);
  }

  .toolbar-wrapper {
    height: 40px;
    position: absolute;
    top: 64px;
    left: 160px;
    @include transition-collapse(150px, 0.1s);

    &.en-layout {
      @include transition-collapse(170px, 0.1s);
    }

    &.collapse {
      @include transition-collapse(60px, 0.15s);
    }

    .react {
      display: inline-block;
      width: 13px;
      height: 13px;

      &:hover {
        border-color: var(--primary-color);
      }
    }
  }

  .toolbar-icon {
    width: 40px;
    height: 40px;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    color: var(--primary-color);

    &:hover {
      .help-icon {
        color: var(--primary-color) !important;
      }
    }
  }
}
</style>
