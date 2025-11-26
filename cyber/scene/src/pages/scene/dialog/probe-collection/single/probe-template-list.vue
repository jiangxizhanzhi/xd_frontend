<template>
  <div class="probe-single-template-wrapper" v-if="visibleValue">
    <cb-dialog
      custom-class="cb-scene-editor probe-batch-wrapper"
      width="960px"
      :visible.sync="visibleValue"
      append-to-body
      @close="handleClose"
    >
      <template slot="title">
        <div>{{ $tt('stage.chooseTemplate') }}</div>
      </template>
      <div class="probe-dialog-content content">
        <cb-search-table
          ref="templateListRef"
          :cols="columns"
          :row-selection="rowSelection"
          row-key="id"
          :selector="tableSelector"
          :selection.sync="multipleSelection"
          :hidePaginOnDemand="true"
          :data="query"
          :tableHeight="450"
          url="/collection/template/page/"
          baseURL="/api/mp"
          @data-loaded="handleDataLoaded"
        >
          <template slot="search">
            <cb-search-input v-model="templateName" :placeholder="$tt('stage.placeInputTemplateName')"></cb-search-input>
          </template>
          <template v-slot:os_type="scope">
            <slot name="thumbNoData">{{SYSTEM_TYPE[scope.data.os_type]}}</slot>
          </template>
          <template v-slot:op="scope">
            <slot name="thumbNoData">
              <cb-button type="text" @click="checkTemplateDetail(scope.data.id)">{{$tt('global.check')}}</cb-button>
            </slot>
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
      <template-detail v-if="showTemplateDetail" :visible.sync="showTemplateDetail" :template-id="templateId"></template-detail>
    </cb-dialog>
  </div>
</template>

<script>
import t from '../../../../../utils/i18n';
import {computed, inject, ref, getCurrentInstance} from '@vue/composition-api';
import {PROBE_TEMPLATE_TABLE, SYSTEM_OPTION, SYSTEM_TYPE} from "../../components/constant/probe";
import PageStatus from "../../../../store/page-status";
import {getProbesList, getProbesTemplateDetail} from "../../../../../api";
import TemplateDetail from "../batch/template-detail";
import _ from "lodash";

export default {
  name: "probe-template-list",
  components: {
    TemplateDetail,
  },
  props: {
    /**
     * 是否弹窗
     */
    visible: {
      type: Boolean,
      default: false,
    },
    /**
     * 节点的系统类型，用来筛选符合该系统类型的模板
     */
    system_type: {
      type: String,
      default: '',
    },
  },
  setup(props, {emit}) {
    const $tt = t;
    const {proxy} = getCurrentInstance();
    const {$message} = proxy;
    let shareState = ref(PageStatus.state);
    let templateId = ref(null);
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
            },
          };
        },
        set: (val) => {
          return val;
        }
      }
    );

    const tableSelector = ref({maxSelect: 1})
    // 默认选中第一个
    const multipleSelection = ref([]);
    // 采集模板列名
    const columns = ref(PROBE_TEMPLATE_TABLE);

    let templateName = ref('');
    const query = computed({
      get: () => {
        return {
          osTypes: SYSTEM_TYPE[props.system_type],
          name: templateName.value,
          pageSize: 1000,
        }
      },
      set: () => {
      }
    })

    const fetchPromise = (queryData, option) => {
      multipleSelection.value=[]
      return getProbesList(queryData).then((res) => {
        let list = _.get(res.data, 'data.list', []);
        if (list.length) {
          // 默认选中第一个模板，并过滤出适用当前模板的系统的节点
          multipleSelection.value.push(list[0])
        }
        return {
          data: { data: list }
        }
      })
    }

    const handleDataLoaded = (res) => {
      multipleSelection.value = [];
      let list = _.get(res, 'tableData', []);
      if (list.length) {
        // 默认选中第一个模板，并过滤出适用当前模板的系统的节点
        multipleSelection.value.push(list[0])
      }
    }

    let showTemplateDetail = ref(false);
    const checkTemplateDetail = (id) => {
      showTemplateDetail.value = true
      templateId.value = id
    }

    const handleClose = () => {
      visibleValue.value = false;
      emit('close')
    }

    const submit = () => {
      // 根据选中的值，调用接口获取到模板详情数据
      if ( multipleSelection.value &&  multipleSelection.value.length) {
        let { id } = multipleSelection.value[0];
        getProbesTemplateDetail({id}).then((res) => {
          emit('onChangeTemplate', _.get(res.data, 'data', {}))
          handleClose();
        })
      } else {
        handleClose();
      }
    }

    return {
      $tt,
      SYSTEM_TYPE,
      templateId,
      query,
      checkTemplateDetail,
      showTemplateDetail,
      tableSelector,
      multipleSelection,
      columns,
      visibleValue,
      rowSelection,
      templateName,
      shareState,
      handleClose,
      fetchPromise,
      submit,
      handleDataLoaded,
    }
  }
}
</script>
