<template>
  <div class="import-probe-table-wrapper">
    <cb-dialog
      width="960px"
      :visible="visibleValue"
      :append-to-body="true"
      @close="handleClose"
    >
      <template slot="title">
        <div>{{ $tt('menu.dialog.probe.importProbeTitle') }}</div>
      </template>
      <div class="probe-dialog-content content">
        <cb-search-table
          :tableHeight="450"
          ref="templateListRef"
          :cols="columns"
          :row-selection="rowSelection"
          :selection="tableSelector"
          row-key="id"
          :fetchPromise="fetchPromise"
          :selector="tableSelector"
          :selection.sync="multipleSelection"
          :hidePaginOnDemand="true"
          :data="query"
        >
          <template slot="search">
            <cb-select
              clearable
              v-model="probeType"
              :options="probeTypeOptions"
              :placeholder="$tt('menu.dialog.probe.probeType')[3]"
              :popper-append-to-body="false"
            ></cb-select>
            <cb-search-input v-model="name" :placeholder="$tt('menu.dialog.probe.placeInputName')"></cb-search-input>
          </template>
          <template slot="searchRightArea">
            {{ $tt('menu.dialog.probe.applySystem', {system: system_type || '--'}) }}
          </template>
          <template v-slot:type="scope">
            <slot name="thumbNoData">{{ CATEGORY_PROB_OBJECT[scope.data.type] || '--' }}</slot>
          </template>
          <template v-slot:os_type="scope">
            <slot name="thumbNoData">{{ showOS_Type(scope.data.os_type) }}</slot>
          </template>
        </cb-search-table>
      </div>
      <template slot="footer">
        <div class="cb-scene-dialog-footer">
          <cb-button-group>
            <cb-button button-type="confirm" @click="submit">
              {{ $tt('global.sure') }}
            </cb-button>
            <cb-button button-type="confirm" hollow @click="handleClose">
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
import {computed, inject, ref, getCurrentInstance} from '@vue/composition-api';
import {
  CATEGORY_PROB_OBJECT,
  CUSTOM_PROBE_IMPORT_TABLE,
  PROBE_TYPE_OPTIONS,
  SYSTEM_TYPE
} from "../../components/constant/probe";
import {getCustomProbes} from "../../../../../api";
import _ from "lodash";
import {getParameter} from "../../../../../utils/dialog/probe";

export default {
  name: "import-probe-table",
  components: {
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
    }
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
            onChange: (selectedRowKeys, selectedRows) => {},
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
    let probeTypeOptions = ref(PROBE_TYPE_OPTIONS);
    // 采集模板列名
    const columns = ref(CUSTOM_PROBE_IMPORT_TABLE);

    let probeType = ref('');
    let name = ref('');
    const query = computed({
      get: () => {
        return {
          probeCategories: probeType.value,
          osTypes: SYSTEM_TYPE[props.system_type],
          name: name.value,
        }
      },
    })

    const packageData = (data) => {
      return data.map((item) => {
        return {
          common: !Boolean(item.type),
          desc: item.description,
          id: item.id,
          interval: item.interval_sec,
          name: item.name,
          os_type: item.os_type,
          output_format: item.output_format,
          script_type: item.script_type,
          script_url: item.script_url,
          type: item.probe_category,
          params: getParameter(item.parameter),
          disabled: false,
        };
      });
    }
    const fetchPromise = (queryData, option) => {
      return getCustomProbes(queryData).then((res) => {
        return {
          data: {
            data: packageData(_.get(res.data, 'data.list', []))
          }
        }
      })
    }

    const showOS_Type = (str) => {
      let list = str.split(',');
      return list.map(item => {
        return SYSTEM_TYPE[item];
      }).join('、')
    }

    const handleClose = () => {
      visibleValue.value = false;
      emit('close', {type: 'close'})
    }
    const handleClick = () => {
      emit('click')
    }

    const submit = () => {
      emit('save', {type: 'save', data: multipleSelection.value})
    }

    return {
      CATEGORY_PROB_OBJECT,
      $tt,
      query,
      tableSelector,
      multipleSelection,
      columns,
      visibleValue,
      rowSelection,
      probeType,
      probeTypeOptions,
      name,
      handleClose,
      handleClick,
      fetchPromise,
      showOS_Type,
      submit,
    }
  }
}
</script>
<style lang="scss" scoped>
.import-probe-table-wrapper {
  .cb-select {
    width: 100% !important;
    ::v-deep .el-select-dropdown .el-select-dropdown__wrap {
      margin: 0 !important;
    }
  }
}
</style>
