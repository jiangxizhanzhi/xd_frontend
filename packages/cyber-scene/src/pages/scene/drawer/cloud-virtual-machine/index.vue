<template>
  <div :class="{'cb-scene-editor drawer-wrapper network-wrapper': true, 'hide-title': !showTitle }">
    <div class="g-title">
      <span class="title ft14">超融合云虚拟机</span>
    </div>
    <div class="search-box">
      <cb-search-input
        size="small"
        v-model="searchName"
        @change="getTargetListAllFunc"
        trigger="lazy"
        :debounce="300"
        :width="'100%'"
        class="search-input"
      ></cb-search-input>
    </div>
    <cb-scrollbar :height="'calc(100% - 100px)'">
      <cb-filter-condition
          size="small"
          v-model="conditionParams"
          condition="厂商"
          :filterList="TYPE_LISTS"
          :class="{'ml16': true }"
      ></cb-filter-condition>
      <!--      靶标查询结果列表-->
      <template v-if="deviceData && deviceData.length">
        <div
          v-for="(item, index) in deviceData"
          :key="JSON.stringify(item.image_uuid + index)"
          class="content-wrapper"
        >
          <div
            class="content-box"
            @mousedown="drag($event, (item.logo), item)"
          >
            <span v-if="item.logo" class="box-icon">
              <img :draggable="false" :src="(item.logoData)" alt="" />
            </span>
            <div class="right-box">
              <span class="box-label" :title="item.label">{{
                item.label
              }}</span>
              <div class="box-tag">
                <cb-tag v-if="computedImage_type(item)" size="small">{{
                  computedImage_type(item)
                }}</cb-tag>
                <cb-tag v-if="computedCPU_disk_ram(item)" size="small">{{
                  computedCPU_disk_ram(item)
                }}</cb-tag>
                <cb-tag v-if="computedSystem(item)" size="small">{{
                  computedSystem(item)
                }}</cb-tag>
                <cb-tag v-if="computedBit(item)" size="small">{{
                  computedBit(item)
                }}</cb-tag>
                <cb-tag v-if="computedLanguage(item)" size="small">{{
                  computedLanguage(item)
                }}</cb-tag>
                <cb-tag v-if="computedCloudInit(item)" size="small">{{
                    computedCloudInit(item)
                  }}</cb-tag>
              </div>
            </div>
          </div>
        </div>
      </template>
      <template v-if="!(deviceData && deviceData.length)">
        <template v-if="loading">
          <div
            class="loading-container"
            v-loading="loading"
            element-loading-background="transparent"
          ></div>
        </template>
        <template v-else>
          <empty-box type="table"></empty-box>
        </template>
      </template>
    </cb-scrollbar>
  </div>
</template>

<script>
import PageStatus from '../../../store/page-status.ts';
import t from '../../../../utils/i18n';
import _ from 'lodash';
import { inject, ref } from '@vue/composition-api';
import { cyberBus } from '../../../../utils/event-bus';
import { ENUM_IMAGE_TYPE} from './constant';
import { SYSTEM_TYPE } from '../../dialog/components/constant/probe';
import { LANGUAGE } from '../../dialog/components/constant/device-info';
import EmptyBox from '../../dialog/components/empty-box/empty-box';
import { getTargetListAll, getTypesL2Categories } from '../../../../api';
import sceneStore from '../../../../store/scene-store';
import {canAddNodes, getImagePromise, isUpperNode} from "../../../../utils/common";

export default {
  name: 'DrawerDevice',
  components: { EmptyBox },
  props: {
    menuIndex: {
      type: Number,
      default: null,
    },
    showTitle: {
      type: Boolean,
      default: true,
    },
  },
  setup() {},
  data() {
    return {
      TYPE_CONDITION: [],
      shareState: PageStatus.state,
      CATEGORIES: [
        this.$tt('menu.menu.operateSystem'),
        this.$tt('menu.menu.applicationSystem'),
        this.$tt('menu.menu.networkEquipment'),
        this.$tt('menu.menu.securityEquipment'),
      ],
      type: '',
      draggable: false,
      deviceData: [],
      loading: true,
      requestId: 0,
      searchName: '',
      conditionParams: 1, // 厂商
      conditionParamsNetwork: '',
      categories: [],
      secondCategory: '',
      requestCategoryId: 0, // 分类接口请求id
      visibleParams: true,
      requestList: [],
      beforeDestroyStatus: false,
      TYPE_LISTS: [
        {
          label: '厂商一',
          value: 1,
        },
        {
          label: '厂商二',
          value: 2,
        },
        {
          label: '厂商三',
          value: 3,
        },
      ]
    };
  },
  watch: {
    menuIndex: {
      handler(val) {
        this.resetSearchParams();
        this.getTargetListAllFunc();
        this.resetStatus();
        this.getTypesL2CategoriesFunc();
      },
      deep: true,
      immediate: true,
    },
    conditionParams: {
      handler(val) {
        this.getTargetListAllFunc();
      },
      deep: true,
      immediate: true,
    },
  },
  computed: {
    // TYPE_LISTS() {
    //   let type_list = TYPE_LISTS;
    //   if (this.menuIndex === 8) {
    //     if (!type_list['common'][1].some(item => item.value === 'dynamips')) {
    //       type_list['common'][1].push({
    //         label: t('menu.drawer.Gns3Target'),
    //         value: 'dynamips',
    //       })
    //     }
    //   } else {
    //     type_list['common'][1].length = 4;
    //   }
    //   return type_list;
    // },
  },
  methods: {
    $tt: t,
    async computedIcon(logo) {
      let xhr = getImagePromise(logo);
      this.requestList.push(xhr);
      return xhr;
    },
    computedImage_type(data) {
      return ENUM_IMAGE_TYPE[data?.image_type];
    },
    computedCPU_disk_ram(data) {
      if (data?.image_type == 'vm') {
        if (data?.ext_vm?.cpu || !data?.ext_vm?.ram || data?.ext_vm?.disk) {
          return `${data?.ext_vm?.cpu}${this.$tt('target.core')}/${
            data?.ext_vm?.ram
          }M${this.$tt('target.memory')}/${data?.ext_vm?.disk}G${this.$tt(
            'target.hardDisk',
          )}`;
        }
      }
    },
    computedSystem(data) {
      if (data?.ext_system_info?.system_type) {
        return SYSTEM_TYPE[
          this.shareState.systemType[data?.ext_system_info?.system_type]
        ];
      }
    },
    computedBit(data) {
      if (data?.ext_system_info?.system_architecture) {
        return `${data?.ext_system_info?.system_architecture}bit`;
      }
    },
    computedLanguage(data) {
      if (data?.ext_system_info?.language) {
        return LANGUAGE[data?.ext_system_info?.language];
      }
    },
    computedCloudInit(data) {
      if (data?.ext_vm?.init_support || data?.ext_docker?.init_support) {
        return 'Cloud-init';
      }
    },

    getTypesL2CategoriesFunc() {
      this.categories = [];
      if ([7, 8, 9].includes(this.menuIndex)) {
        let currentId = ++this.requestCategoryId;
        getTypesL2Categories({ firstTypeId: this.menuIndex - 5 }).then(
          (res) => {
            if (currentId !== this.requestCategoryId) {
              return;
            }
            this.categories.push({
              label:
                this.menuIndex === 9
                  ? this.$tt('menu.drawer.allSecurity')
                  : this.menuIndex === 7
                  ? this.$tt('menu.drawer.allApplication')
                  : this.$tt('menu.drawer.allTypes'),
              value: '',
            });
            let list = res?.data?.data?.items[0]?.child || [];
            list.forEach((item) => {
              this.categories.push({
                label: item.name,
                value: item.id,
              });
            });
          },
        );
      }
    },

    getTargetListAllFunc: _.debounce(function () {
      let currentId = ++this.requestId;
      this.deviceData = [];
      this.loading = true;
      getTargetListAll({
        name: this.searchName === '' ? undefined : this.searchName,
        vendor: this.conditionParams,
      })
        .then((res) => {
          if (currentId !== this.requestId) {
            return;
          }
          this.loading = false;
          if (_.isEmpty(res.data.data?.list)) {
            this.deviceData = [];
            return;
          }
          this.deviceData = this.package(res.data.data.list);
        })
        .catch((err) => {
          this.$serverError(err);
        });
    }, 200),
    package(list) {
      if (!sceneStore.state.iconPoolData) {
        sceneStore.state.iconPoolData = new Map();
      }
      let listData = [];
      for (let i = 0; i < list?.length; i++) {
        let item = list[i];
        listData.push({
          ...item,
          category2: item.second_category,
          category3: item.l3_category,
          image_uuid: item.uuid,
          label: item.name,
          logoData: undefined,
        })
      }
      if (!this.beforeDestroyStatus) {
        listData?.length && (listData?.forEach(async (item, index) => {
            let icon = '';
            if (sceneStore.state.iconPoolData.get(item.logo)?.data) {
              icon = sceneStore.state.iconPoolData.get(item.logo).data;
              listData[index].logoData = icon;
            } else {
              //如果是url，则读文件流转base64
              let request = new XMLHttpRequest();
              request.onreadystatechange = done;
              request.responseType = 'blob';
              request.open('GET', item.logo, true);
              request.send();
              function done() {
                if (request.readyState !== 4) return;
                if (request.status !== 200) {
                  // reject('error');
                  return;
                }
                let encoder = new FileReader();
                encoder.onloadend = function () {
                  // resolve(encoder.result);
                  let res = encoder.result
                  icon = res;
                  sceneStore.setIconPoolData(item.logo, {data: res, ids: []})
                  listData[index].logoData = icon;
                };
                encoder.readAsDataURL(request.response);
              }
              this.requestList.push(request);
            }
          })
        )
      }

      return listData;
    },
    resetSearchParams() {
      this.visibleParams = false;
      this.$nextTick(() => {
        this.visibleParams = true;
      })
      this.searchName = '';
      this.secondCategory = '';
      this.conditionParams = 1;
    },

    drag(event, image, data) {
      window.getSelection().removeAllRanges();
      // 排除非当前层的节点
      let nodesNum = 0;
      sceneStore.state.graph.getNodes()?.forEach(node => {
        if (!isUpperNode(node) && node.shape === 'rect') {
          nodesNum++;
        }
      })
      canAddNodes(nodesNum, 1)
        .then(async () => {
          cyberBus.emit('drag', {
            event,
            image,
            data,
          });
        })
        .catch(() => {
          this.$message.error(
            this.$tt('stage.supportNodeLimit', {
              maxCount: PageStatus.state.maxCount,
              currentCount: nodesNum + PageStatus.state.anotherLayerNodeCount,
            }),
          );
        });
    },
    resetStatus() {
      this.deviceData = [];
      this.loading = true;
      this.search = '';
    },
  },
  beforeDestroy() {
    this.beforeDestroyStatus = true;
    // 取消未响应的请求
    this.requestList?.forEach(item => {
      item.abort();
    })
  },
};
</script>

<style lang="scss" scoped>
.network-wrapper {
  width: 440px;
  padding-top: 12px;
  padding-left: 16px;
  padding-right: 16px;
  z-index: 1;
  overflow-y: hidden;
  height: calc(100% - 75px);

  .g-title {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .search-box {
    display: flex;
    justify-content: space-between;
    margin: 8px 0 16px 0;
  }

  .search-input {
    display: inline-block;
  }

  ::v-deep .el-scrollbar__wrap {
    margin-right: -6px !important;
    margin-bottom: -6px !important;
  }

  .content-wrapper:hover {
    background-color: var(--neutral0);
  }

  //单个靶标
  .content-box {
    display: flex;
    cursor: pointer;
    padding: 12px 6px 12px 0;
    border-top: 1px solid var(--neutral0);

    .box-icon {
      display: inline-block;
      width: 40px;
      height: 40px;
      margin-right: 12px;

      img {
        object-fit: contain;
        width: 100%;
        height: 100%;
      }
    }

    .right-box {
      display: inline-block;
      width: calc(100% - 55px);

      .box-label {
        flex: 1;
        color: var(--neutral9);
        /**
         超出两行省略号
        */
        word-wrap: break-word;
        word-break: break-all;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2; /*超出2行显示省略号*/
        overflow: hidden;
        font-size: 14px;
        line-height: 1.4;
      }

      .box-tag {
        .cb-tag {
          margin-top: 8px;
        }
      }
    }
  }

  .loading-container {
    height: 400px;
    display: flex;
    align-items: center;
    background-color: var(--bg-color-2);
  }
  &.hide-title {
    top: 12px;
    height: calc(100% - 23px);
  }
  ::v-deep .cb-filter-condition {
    .cb-filter-condition-title {
      //width: 82px !important;
      text-align: right;
      letter-spacing: 1px;
    }
    &.cloud-init {
      .cb-filter-condition-title {
        letter-spacing: 0;
      }
    }
  }
}
</style>
