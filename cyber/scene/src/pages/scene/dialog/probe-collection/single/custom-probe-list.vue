<template>
  <div class="probe-batch-wrapper">
    <cb-button-group space="middle">
      <cb-button size="middle" icon="icon-daoru" hollow @click="importProbe">{{ $tt('global.import') }}
      </cb-button>
      <cb-button :disabled="!multipleSelection.length" size="middle" button-type="delete" hollow  @click="deleteProbes(true,$event)">{{ $tt('global.delete') }}</cb-button>
    </cb-button-group>
    <div class="probe-dialog-content">
      <cb-search-table
        ref="customListRef"
        :cols="columns"
        :row-selection="rowSelection"
        :selection="tableSelector"
        row-key="id"
        :dataSource="customProbesForm"
        :selector="tableSelector"
        :selection.sync="multipleSelection"
        :hidePaginOnDemand="true"
        @onSelectAll="handleSelectAll"
        :tableHeight="235"
      >
        <template v-slot:type="scope">
          <slot name="thumbNoData">{{ CATEGORY_PROB_OBJECT[scope.data.type] || '--' }}</slot>
        </template>
        <template v-slot:os_type="scope">
          <slot name="thumbNoData"><span :title="showOS_Type(scope.data.os_type)">{{ showOS_Type(scope.data.os_type) }}</span></slot>
        </template>
        <template v-slot:op="scope">
          <slot name="thumbNoData">
            <cb-button type="text" :disabled="disableParamsSetting(scope.index)" @click="paramsSetting(scope.data, scope.index)">{{$tt('global.setting')}}</cb-button>
          </slot>
        </template>
      </cb-search-table>
    </div>
    <!-- 自定义采集-导入弹窗 -->
    <import-probe-table v-if="showImportProbeTable" :visible.sync="showImportProbeTable" :system_type="system_type"
                        @save="handleImport" @close="handleImport"></import-probe-table>
    <!-- 自定义采集-参数设置 -->
    <params-setting v-if="showParamsSetting" :visible.sync="showParamsSetting" :paramsData.sync="paramsData"
                    @save="handleSaveParams" @close="handleCloseParam"></params-setting>
  </div>
</template>

<script>
import t from '../../../../../utils/i18n';
import {computed, inject, ref, getCurrentInstance} from '@vue/composition-api';
import {
  CATEGORY_PROB_OBJECT,
  CUSTOM_PROBE_TEMPLATE_TABLE,
  SYSTEM_TYPE
} from "../../components/constant/probe";
import ImportProbeTable from "./import-probe-table";
import ParamsSetting from "./params-setting";

export default {
  name: "custom-probe-list",
  components: {
    ImportProbeTable,
    ParamsSetting,
  },
  props: {
    /**
     * 是否弹窗
     */
    visible: {
      type: Boolean,
      default: false,
    },
    system_type: {
      type: String,
      default: '',
    },
    customProbes: {
      type: Array,
      default: () => [],
    },
  },
  setup(props, {emit}) {
    const $tt = t;
    const {proxy} = getCurrentInstance();
    const {$message} = proxy;

    let visibleValue = computed(
      {
        get: () => {
          return props.visible;
        },
        set: (val) => {
          emit('update:visible', val);
          return val;
        }
      }
    );

    let rowSelection = computed(
      {
        get: () => {
          return {
            onChange: (selectedRowKeys, selectedRows) => {
              customProbesForm.value?.forEach((item, index) => {
                customProbesForm.value[index]['disabled'] = !selectedRows.some(row => row.id === item.id);
              })
            },
          };
        },
        set: (val) => {
          return val;
        }
      }
    );

    const tableSelector = ref({maxSelect: 0})
    // 默认选中第一个
    const multipleSelection = ref([]);
    // 采集模板列名
    const columns = ref(CUSTOM_PROBE_TEMPLATE_TABLE);

    const customProbesForm = computed({
      get: () => {
        multipleSelection.value = [];
        props.customProbes.forEach(probe => {
          probe['open'] = !probe.disabled
          if (!probe.disabled) {
            multipleSelection.value.push(probe)
          }
        })
        return props.customProbes
      },
      set: (val) => {
        val.forEach(probe => {
          probe['open'] = !probe.disabled
          if (!probe.disabled) {
            multipleSelection.value.push(probe)
          }
        })
        emit('update:customProbes', val);
        return val
      }
    })

    // 参数设置按钮
    const disableParamsSetting = (index) => {
      return !(customProbesForm.value[index].params && customProbesForm.value[index].params.length)
    }

    // 导入
    let showImportProbeTable = ref(false);
    const importProbe = () => {
      showImportProbeTable.value = true;
    }
    const deleteProbes = (bool, done) => {
      multipleSelection.value.forEach(item => {
        let probeIndex = customProbesForm.value.findIndex(probe => probe.id == item.id)
        if (probeIndex >= 0) {
          customProbesForm.value.splice(probeIndex, 1);
        }
      })
      done();
    }

    const handleImport = (data) => {
      showImportProbeTable.value = false;
      multipleSelection.value = [];
      if (data.type === 'save') {
        // 保存选择的探针数据
        data.data.forEach(item => {
          let probeIndex = customProbesForm.value.findIndex(probe => probe.id == item.id)
          if (probeIndex >= 0) {
            customProbesForm.value[probeIndex] = item
          } else {
            customProbesForm.value.push(item)
          }
          multipleSelection.value.push(item)
        })
      }
    }

    const handleCloseParam = () => {
      showParamsSetting.value = false
    }

    const showOS_Type = (str) => {
      let list = str.split(',');
      return list.map(item => {
        return SYSTEM_TYPE[item];
      }).join('、')
    }

    // 操作-设置
    let showParamsSetting = ref(false);
    let paramsData = ref({});
    const paramsSetting = (scopeData, index) => {
      if (customProbesForm.value[index].params && customProbesForm.value[index].params.length) {
        showParamsSetting.value = true;
        paramsData.value = {
          params: customProbesForm.value[index].params,
          index: index,
        }
      } else {
        $message.info($tt('menu.dialog.validator.noParam'))
      }
    }

    const handleSelectAll = (val) => {
      if (!val) {
        multipleSelection.value = [];
      }
    }

    const handleSaveParams = (data) => {
      customProbesForm.value[data.data.index]['params'] = data.data.params;
    }

    return {
      $tt,
      CATEGORY_PROB_OBJECT,
      tableSelector,
      multipleSelection,
      columns,
      visibleValue,
      rowSelection,
      showImportProbeTable,
      customProbesForm,
      showParamsSetting,
      paramsData,
      handleSelectAll,
      disableParamsSetting,
      paramsSetting,
      showOS_Type,
      importProbe,
      deleteProbes,
      handleImport,
      handleSaveParams,
      handleCloseParam,
    }
  }
}
</script>
