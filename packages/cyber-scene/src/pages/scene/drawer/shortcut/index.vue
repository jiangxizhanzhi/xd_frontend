<template>
  <div :class="{ 'drawer-wrapper network-wrapper simple-target-wrapper': true, 'hide-title': !showTitle }">
    <div class="mb10 g-title simple-title">
      <span class="title ft14">{{ title }}</span>
    </div>
    <div class="shortcut-wrapper">
      <template v-for="item in shortCutData">
        <cb-col :span="8" :key="item.name" :title="item.name" class="node-box">
          <div
            class="node"
            @mousedown="onDragStart($event, (item.logo), item)"
          >
            <img :src="(item.logoData)" alt="" :class="{'icon-box': true, 'islayer': item.isLayer}" />
            <span>{{ item.name }}</span>
          </div>
        </cb-col>
      </template>
      <div class="empty-txt" v-if="!loading && !shortCutData.length">
        {{ $tt('stage.noDataAvailable') }}
      </div>
    </div>
  </div>
</template>

<script>
import { getCurrentInstance, ref } from '@vue/composition-api';
import t from '../../../../utils/i18n';
import _ from 'lodash';
import PageStatus from '../../../store/page-status';
import { getShortcutList } from '../../../../api';
import { cyberBus } from '../../../../utils/event-bus';
import sceneStore from '../../../../store/scene-store';
import {canAddNodes, getImagePromise, isUpperNode} from "../../../../utils/common";
import {isBase64} from "../../painter/node";

export default {
  name: 'drawer-shortcut',
  components: {},
  props: {
    showTitle: {
      type: Boolean,
      default: true,
    },
    openLayer: {
      type: Boolean,
      default: false,
    },
  },
  setup(props) {
    const $tt = t;
    const { proxy } = getCurrentInstance();
    const { $message } = proxy;
    const title = $tt('menu.menu.shortcut');
    let loading = ref(true);
    let shortCutData = ref([]);
    const DEFAULT_IMAGES = PageStatus.state.defaultIcon;
    const computedIcon = async (logo) => {
      return getImagePromise(logo)
    };
    const onDragStart = (event, image, data) => {
      window.getSelection().removeAllRanges();
      // 排除非当前层的节点
      let nodesNum = 0;
      sceneStore.state.graph.getNodes()?.forEach(node => {
        if (!isUpperNode(node) && node.shape === 'rect') {
          nodesNum++;
        }
      })
      if (data?.isLayer) {
        cyberBus.emit('drag', {
          event,
          image,
          data,
        });
      } else {
        canAddNodes(nodesNum, 1)
          .then(async () => {
            cyberBus.emit('drag', {
              event,
              image,
              data,
            });
          })
          .catch(() => {
            $message.error(
              $tt('stage.supportNodeLimit', {
                maxCount: PageStatus.state.maxCount,
                currentCount: nodesNum + PageStatus.state.anotherLayerNodeCount,
              }),
            );
          });
      }
    };
    const elementMouseUp = (event) => {
    };

    return {
      title,
      loading,
      shortCutData,
      onDragStart,
      elementMouseUp,
      computedIcon,
      $tt,
    };
  },
  beforeMount() {
    this.getShortcutData();
  },
  methods: {
    getShortcutData() {
      getShortcutList(null).then((res) => {
        this.loading = false;
        if (_.isEmpty(res.data.data?.list) || !res.data) {
          this.shortCutData = [];
        } else {
          if (!sceneStore.state.iconPoolData) {
            sceneStore.state.iconPoolData = new Map();
          }
          let resList = res.data.data?.list;
          for (let i = 0; i < resList?.length; i++) {
            let item = resList[i];
            this.shortCutData.push({
              ...item,
              category2: item.second_category,
              category3: item.l3_category,
              image_uuid: item.uuid,
              mirror: item.image,
              label: item.name,
              is_build_in: item.is_build_in, // 是否内置
              logoData: item.logo,
            })
            this.shortCutData?.length && (
              this.shortCutData?.forEach(async (item, index) => {
                let icon = '';
                if (isBase64(item.logo)) {
                  icon = item.logo;
                } else if (sceneStore.state.iconPoolData.get(item.logo)) {
                  icon = sceneStore.state.iconPoolData.get(item.logo).data;
                } else {
                  icon = await this.computedIcon(item.logo);
                  sceneStore.setIconPoolData(item.logo, {data: icon, ids: []})
                }
                this.shortCutData[index]['logoData'] = icon;
              })
            )
          }
          if (this.openLayer) {
            let logo = require('../../../../assets/images/level-icon.svg').default;
            this.shortCutData.push({
              isLayer: true,
              type: 'layerNode',
              logo: logo,
              label: t('target.layer'),
              name: t('target.layer'),
            });
            this.shortCutData[this.shortCutData.length - 1]['logoData'] = logo;
          }
        }
      });
    },
  },
};
</script>

<style scoped lang="scss">
.network-wrapper {
  width: 260px;
  padding: 26px 16px 0 16px;
  z-index: 1;
  overflow-y: hidden;
  height: calc(100% - 75px);

  .g-title {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .simple-title {
    padding-left: 16px;
  }

  .shortcut-wrapper {
    margin: 0 8px;

    .icon-box {
      width: 40px;
      height: 40px;
      &.islayer {
        width: 37px;
        height: 37px;
      }
    }

    .node-box:hover {
      background: var(--neutral1);
    }

    .node {
      display: flex;
      flex-direction: column;
      align-items: center;
      margin: 8px 0;
      cursor: pointer;

      span {
        margin: 8px 0;
        color: var(--neutral9);
        font-size: 12px;
        width: 100%;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 1;
        overflow: hidden;
        text-align: center;
      }
    }

    .empty-txt {
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      color: var(--neutral9);
      font-size: 14px;
    }
  }
  &.hide-title {
    top: 12px;
    height: calc(100% - 23px);
  }
}

.simple-target-wrapper {
  padding: 12px 0 26px 0;
}
</style>
