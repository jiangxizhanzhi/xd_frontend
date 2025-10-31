<template>
  <div class="usb-config-wrapper" v-if="system_type_name === 'Windows' || system_type_name === 'Linux'">
    <!--    虚拟USB设备-->
    <cb-form-item :label="$tt('target.virtual_usb') + ' ：'">
      <div class="usb-tags-box">
        <template v-if="virtual_usbs_form && virtual_usbs_form.length">
          <cb-tag
            v-for="tag in virtual_usbs_form"
            :key="tag.uuid"
            class="scene-tag-item"
            :omit="true"
            :closable="!uneditableBySceneStatus"
            @close="deleteUSB(tag, 'virtual')"
            :title="tag.name"
          >{{tag.name}}
          </cb-tag>
        </template>
        <template v-if="virtual_usbs_form.length < MAX_COUNT && !uneditableBySceneStatus">
          <span :class="{'add-rect-box': true, 'empty-rect-box': !virtual_usbs_form.length}" @click="selectUSB('virtual')">
            <cb-iconfont type="icon-xinzeng" :size="'16'" color="var(--primary-color)"></cb-iconfont>
          </span>
        </template>
        <template v-if="virtual_usbs_form.length >= MAX_COUNT && !uneditableBySceneStatus">
          <cb-tooltip effect="dark" :disabled="uneditableBySceneStatus" :content="$tt('target.virtual_usb_num_limit', {maxCount: MAX_COUNT})" placement="top">
            <span class="add-rect-box add-rect-box-disable">
              <cb-iconfont type="icon-xinzeng" :size="'16'" color="var(--primary-color-4)"></cb-iconfont>
            </span>
          </cb-tooltip>
        </template>
      </div>
    </cb-form-item>
    <!--    实体USB设备-->
    <cb-form-item v-if="image_type != 'container'" :label="$tt('target.entity_usb') + ' ：'">
      <div class="usb-tags-box">
        <template v-if="entity_usbs_form && entity_usbs_form.length">
          <cb-tag
            v-for="tag in entity_usbs_form"
            :key="tag.uuid"
            class="scene-tag-item"
            :omit="true"
            :closable="!uneditableBySceneStatus"
            @close="deleteUSB(tag, 'entity')"
            :title="tag.name"
          >{{tag.name}}
          </cb-tag>
        </template>
        <template v-if="entity_usbs_form.length < MAX_COUNT && !uneditableBySceneStatus">
          <span :class="{'add-rect-box': true, 'empty-rect-box': !virtual_usbs_form.length}" @click="selectUSB('entity')">
            <cb-iconfont type="icon-xinzeng" :size="'16'" color="var(--primary-color)"></cb-iconfont>
          </span>
        </template>
        <template v-if="entity_usbs_form.length >= MAX_COUNT && !uneditableBySceneStatus">
          <cb-tooltip effect="dark" :disabled="uneditableBySceneStatus" :content="$tt('target.entity_usb_num_limit', {maxCount: MAX_COUNT})" placement="top">
            <span class="add-rect-box add-rect-box-disable">
              <cb-iconfont type="icon-xinzeng" :size="'16'" color="var(--primary-color-4)"></cb-iconfont>
            </span>
          </cb-tooltip>
        </template>
      </div>
    </cb-form-item>
    <!--    虚拟USB设备选择列表-->
    <cb-dialog
      :visible.sync="virtualUSBVisible"
      width="1000px"
      top="120px"
      append-to-body
      :destroy-on-close="true"
      @close="handleClose"
    >
      <template slot="title">
        <span>{{$tt('target.addVirtualUSBTitle')}}</span>
      </template>
      <div class="cb-scene-dialog-content">
        <cb-search-table
          ref="virtualUSBTableRef"
          :url="url"
          baseURL="/api/mp"
          rowKey="uuid"
          :cols.sync="TABLE_COLUMNS"
          :data="query"
          :selection.sync="selection"
          :row-selection="rowSelection"
          selector="checkbox"
          :scroll="{y: 350}"
          @onSelect="onSelect('virtual')"
        >
          <template v-slot:filter>
            <cb-search-input
              clearable
              v-model="query.name"
              :debounce="300"
              :placeholder="$tt('global.placeInputName')"
              @clear="onSelect('virtual')"
            />
          </template>
          <template v-slot:capacity="scope"> {{ scope.data.capacity }}G </template>
        </cb-search-table>
      </div>
      <template slot="footer">
        <div class="cb-scene-dialog-footer">
          <cb-button-group>
            <cb-button button-type="confirm" @click="saveForm('virtual')">
              {{ $tt('global.sure') }}
            </cb-button>
            <cb-button button-type="cancel" hollow @click="handleClose()">
              {{ $tt('global.cancel') }}
            </cb-button>
          </cb-button-group>
        </div>
      </template>
    </cb-dialog>
    <!--    实体USB设备选择列表-->
    <cb-dialog
      :visible.sync="entityUSBVisible"
      width="1000px"
      top="120px"
      append-to-body
      :destroy-on-close="true"
      @close="handleClose"
    >
      <template slot="title">
        <span>{{$tt('target.addEntityUSBTitle')}}</span>
      </template>
      <div class="cb-scene-dialog-content">
        <cb-search-table
          ref="entityUSBTableRef"
          :url="entityURL"
          baseURL="/api/mp"
          rowKey="id"
          :cols.sync="TABLE_COLUMNS"
          :data="queryEntity"
          :selection.sync="selectionEntity"
          :row-selection="rowSelectionEntity"
          selector="checkbox"
          :scroll="{y: 350}"
          @onSelect="onSelect('entity')"
          hide-pagin-on-demand
        >
          <template v-slot:filter>
            <cb-search-input
              clearable
              v-model="queryEntity.name"
              :placeholder="$tt('global.placeInputName')"
              :debounce="300"
              @clear="onSelect('entity')"
            />
          </template>
          <template v-slot:host="scope">{{ scope.data.ext_entity_usb.host || '-' }} </template>
          <template v-slot:capacity="scope"> {{ scope.data.capacity }}G </template>
        </cb-search-table>
      </div>
      <template slot="footer">
        <div class="cb-scene-dialog-footer">
          <cb-button-group>
            <cb-button button-type="confirm" @click="saveForm('entity')">
              {{ $tt('global.sure') }}
            </cb-button>
            <cb-button button-type="cancel" hollow @click="handleClose()">
              {{ $tt('global.cancel') }}
            </cb-button>
          </cb-button-group>
        </div>
      </template>
    </cb-dialog>
  </div>
</template>

<script>
import t from '../../../../../utils/i18n';
import {computed, ref} from '@vue/composition-api';
import {SYSTEM_TYPE} from "../constant/probe";
import PageStatus from "../../../../store/page-status";
import {ENTITY_USB_TABLE, VIRTUAL_USB_TABLE} from "../constant/device-info";
import _ from "lodash";
import sceneStore from "../../../../../store/scene-store";

export default {
  name: "usb-config",
  components: {},
  props: {
    nodeInfo: {
      type: Object,
      default: () => {
      },
    },
    /**
     * 角色信息，如果为终端 4 ，显示网卡数量，其他不显示
     */
    role: {
      type: Number,
      default: 0,
    },
    /**
     * 镜像信息，如果为容器，不显示cpu、内存、硬盘
     * 如果为dynamips，显示 NVRAM配置
     */
    image_type: {
      type: String,
      default: '',
    },
    system_type: {
      type: String | Number,
      default: '',
    },
    virtual_usbs: {
      type: Array,
      default: () => [],
    },
    entity_usbs: {
      type: Array,
      default: () => [],
    },
    // 节点的实例id
    eid: {
      type: String,
      default: ''
    },
  },
  setup(props, {emit}) {
    let shareState = ref(PageStatus.state);
    let showHelp = ref(false);
    let virtualUSBVisible = ref(false);
    let entityUSBVisible = ref(false);
    let virtualUSBTableRef = ref(null);
    let entityUSBTableRef = ref(null);
    let url = ref('/devops/cluster/virtual_usb/page');
    let entityURL = ref('/devops/cluster/real-equipment/page');
    let selection = ref();
    let selectionEntity = ref();
    let query = ref({ name: ''});
    let queryEntity = ref({ category: 5, second_category: 600, per_page: 1000, name: '' });
    const MAX_COUNT = 4;
    let used_virtual_usbs_uuids = ref([]);
    let used_entity_usbs_uuids = ref([]);

    // 在同一个场景中，一个虚拟 USB 只能添加给一个终端节点。已添加到终端节点的 USB 出现在列表中，不能选择。
    sceneStore.state.graph.getNodes()?.forEach(node => {
      if (props.nodeInfo.id != node.id && node.data?.basicConfig?.role == 4) {
        if (node.data?.basicConfig?.virtual_usbs?.length) {
          used_virtual_usbs_uuids.value.push(...node.data?.basicConfig?.virtual_usbs?.map(item => item.uuid));
        }
        if (node.data?.basicConfig?.entity_usbs?.length) {
          used_entity_usbs_uuids.value.push(...node.data?.basicConfig?.entity_usbs?.map(item => item.uuid));
        }
      }
    })

    // 场景状态
    const uneditableBySceneStatus = computed({
      get: () => {
        if (props.nodeInfo.role === 4) {
          if (props.eid) {
            return (sceneStore.state.sceneStatus === 'display' || sceneStore.state.sceneStatus === 'update');
          } else {
            return false;
          }
        } else {
          return (sceneStore.state.sceneStatus === 'display' || sceneStore.state.sceneStatus === 'update');
        }
      },
    });

    // 虚拟设备的checkbox禁用
    const rowSelection = computed((record) => {
      return {
        getCheckboxProps: (record) => {
          return {
            props: {
              disabled: selection.value.length >= MAX_COUNT && selection.value.findIndex(data => data.uuid == record.uuid) < 0
                || used_virtual_usbs_uuids.value.includes(record.uuid),
            },
          };
        },
      };
    })

    // 实体设备的checkbox禁用
    const rowSelectionEntity = computed((record) => {
      return {
        getCheckboxProps: (record) => {
          return {
            props: {
              disabled: selectionEntity.value.length >= MAX_COUNT && selectionEntity.value.findIndex(data => data.id == record.id) < 0
                || used_entity_usbs_uuids.value.includes(record.id) || selectionEntity.value.some(item => item?.ext_entity_usb?.host != record.ext_entity_usb?.host),
            },
          };
        },
      };
    })

    const system_type_name = computed(() => {
      return SYSTEM_TYPE[shareState.value.systemType[props.system_type]]
    })

    const TABLE_COLUMNS = computed(() => {
      if (virtualUSBVisible.value) {
        return VIRTUAL_USB_TABLE;
      }
      if (entityUSBVisible.value) {
        return ENTITY_USB_TABLE;
      }
    })

    // 回显虚拟usb
    const virtual_usbs_form = computed({
      get: () => {
        selection.value = _.cloneDeep(props.virtual_usbs);
        return props.virtual_usbs;
      },
      set: (val) => {
        emit('update:virtual_usbs', val);
        return val;
      }
    });

    // 回显实体usb
    const entity_usbs_form = computed({
      get: () => {
        selectionEntity.value = _.cloneDeep(props.entity_usbs)?.map(item => {
          return {
            ...item,
            id: item.uuid,
            ext_entity_usb: {host: item.host}
          }
        }) || [];
        return props.entity_usbs;
      },
      set: (val) => {
        emit('update:entity_usbs', val);
        return val;
      }
    });

    const selectUSB = (type) => {
      if (type === 'virtual') {
        if (virtual_usbs_form.value.length < MAX_COUNT) {
          virtualUSBVisible.value = true;
        }
      }
      if (type === 'entity') {
        if (entity_usbs_form.value.length < MAX_COUNT) {
          entityUSBVisible.value = true;
        }
      }
    }

    const deleteUSB = (usbTag, type) => {
      if (type === 'virtual') {
        let usb_idx = virtual_usbs_form.value?.findIndex(usb => usb.uuid === usbTag.uuid);
        usb_idx >= 0 && virtual_usbs_form.value.splice(usb_idx, 1);
      }
      if (type === 'entity') {
        let usb_idx = entity_usbs_form.value?.findIndex(usb => usb.id === usbTag.id);
        usb_idx >= 0 && entity_usbs_form.value.splice(usb_idx, 1);
      }
    }
    const saveForm = (type) => {
      if (type === 'virtual') {
        virtual_usbs_form.value = selection.value?.map(item => {
          return {
            uuid: item.uuid,
            name: item.name,
          }
        });
        virtualUSBVisible.value = false;
      }
      if (type === 'entity') {
        entity_usbs_form.value = selectionEntity.value?.map(item => {
          return {
            uuid: item.id,
            id: item.id,
            name: item.name,
            host: item.ext_entity_usb.host,
          }
        });
        entityUSBVisible.value = false;
      }
    }
    const handleClose = () => {
      entityUSBVisible.value = false;
      virtualUSBVisible.value = false;
      query.value.name = '';
      queryEntity.value.name = '';
    }

    const onSelect = (type) => {
      if (type === 'virtual') {
        virtualUSBTableRef.value?.refreshTableData();
      }
      if (type === 'entity') {
        entityUSBTableRef.value?.refreshTableData();
      }
    }

    const hideVirtualUSB = () => {
      query.value.name = '';
      virtualUSBVisible.value = false;
    }
    const hideEntityUSB = () => {
      entityUSBVisible.value = false;
    }

    return {
      uneditableBySceneStatus,
      MAX_COUNT,
      virtualUSBTableRef,
      entityUSBTableRef,
      showHelp,
      system_type_name,
      $tt: t,
      virtualUSBVisible,
      entityUSBVisible,
      url,
      selection,
      selectionEntity,
      TABLE_COLUMNS,
      query,
      rowSelection,
      rowSelectionEntity,
      onSelect,
      virtual_usbs_form,
      entity_usbs_form,
      entityURL,
      queryEntity,
      handleClose,
      saveForm,
      selectUSB,
      hideVirtualUSB,
      deleteUSB,
      hideEntityUSB,
    }
  },
}
</script>

<style lang="scss" scoped>
.usb-config-wrapper {
  ::v-deep .el-form-item__label {
    //margin: 5px 0 0 0;
  }
}
.usb-tags-box {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  .scene-tag-item {
    margin: 3px 0;
    padding-right: 10px;
  }
  .add-rect-box {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 28px;
    height: 28px;
    text-align: center;
    border: 1px solid var(--primary-color);
    vertical-align: middle;
    cursor: pointer;
    &.empty-rect-box {
      margin-top: 3px;
    }
  }
  .add-rect-box-disable {
    border: 1px solid var(--primary-color-4);
    background: rgba(0,0,0,0);
    color: var(--primary-color-4);
    cursor: not-allowed;
  }
}
::v-deep .ant-table-thead .ant-table-selection-column .ant-table-header-column {
  display: none;
}
</style>
