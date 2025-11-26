<template>
  <div class="cb-scene-editor" v-if="visibleValue">
    <div class="cb-scene-dialog">
      <div class="probe-batch-wrapper">
        <cb-dialog
          custom-class="cb-scene-editor probe-batch-wrapper no-padding"
          width="960px"
          height="470px"
          :visible.sync="visibleValue"
          append-to-body
          @close="handleClose"
        >
          <template slot="title">
            <div>{{ $tt('menu.dialog.batchOrchestrationTitle') }}</div>
          </template>
          <cb-steps class="step-box" style="margin: 16px 200px 16px 200px;" :active="active" :data="stepLabel"></cb-steps>
          <div class="probe-dialog-content content" v-show="active == 1">
            <cb-search-table
              ref="templateListRef"
              :cols="columns"
              :row-selection="rowSelection"
              :selection="tableSelector"
              row-key="id"
              :selector="tableSelector"
              :selection.sync="multipleSelection"
              :hidePaginOnDemand="true"
              :data="query"
              url="/collection/template/page/"
              @data-loaded="handleDataLoaded"
              baseURL="/api/mp"
            >
              <template slot="search">
                <cb-select
                  clearable
                  v-model="query.osTypes"
                  :options="SYSTEM_OPTION"
                  :placeholder="$tt('menu.dialog.probe.allSystems')"
                  :popper-append-to-body="false"
                ></cb-select>
                <cb-search-input v-model="query.name"
                                 :placeholder="$tt('stage.placeInputTemplateName')"></cb-search-input>
              </template>
              <template v-slot:os_type="scope">
                <slot name="thumbNoData">{{ SYSTEM_TYPE[scope.data.os_type] }}</slot>
              </template>
              <template v-slot:op="scope">
                <slot name="thumbNoData">
                  <cb-button type="text" @click="checkTemplateDetail(scope.data.id)">{{ $tt('global.check') }}
                  </cb-button>
                </slot>
              </template>
            </cb-search-table>
          </div>
          <div class="probe-dialog-content-nodes" v-show="active == 2">
            <div class="filter-tip">{{ $tt('menu.dialog.applied') }}</div>
            <div class="content">
              <cb-checkbox-group v-model="checkedNodeList" v-if="filterNodes.length">
                <cb-checkbox :label="item.id" v-for="item in filterNodes" :key="item.id"
                             class="node-wrapper">
                  <img class="node-icon" :src="item.icon" alt=""/>
                  <span class="node-label" :title="item.name">{{ item.name }}</span>
                </cb-checkbox>
              </cb-checkbox-group>
              <empty-box v-else type="table"></empty-box>
            </div>
          </div>
          <template slot="footer">
            <div class="cb-scene-dialog-footer">
              <cb-button-group v-if="active == 1">
                <cb-button button-type="confirm" @click="nextStep">
                  {{ $tt('global.nextStep') }}
                </cb-button>
              </cb-button-group>
              <cb-button-group v-else>
                <cb-button button-type="confirm" hollow @click="previousStep">
                  {{ $tt('global.previousStep') }}
                </cb-button>
                <cb-button button-type="confirm" @click="submit" class="fix-width-btn">
                  {{ $tt('global.sure') }}
                </cb-button>
              </cb-button-group>
            </div>
          </template>
          <template-detail v-if="showTemplateDetail" :visible="showTemplateDetail"
                           :template-id="templateId" @close="handleTemplateDetailClose"></template-detail>
        </cb-dialog>
      </div>
    </div>
  </div>
</template>

<script>
import t from '../../../../../utils/i18n';
import {computed, inject, ref, getCurrentInstance} from '@vue/composition-api';
import {PROBE_TEMPLATE_TABLE, SYSTEM_OPTION, SYSTEM_TYPE} from "../../components/constant/probe";
import PageStatus from "../../../../store/page-status";
import {getProbesList, getProbesTemplateDetail} from "../../../../../api";
import TemplateDetail from "./template-detail";
import EmptyBox from "../../components/empty-box/empty-box";
import _ from "lodash";
import {getParameter} from "../../../../../utils/dialog/probe";

export default {
  name: "probe-batch",
  components: {
    EmptyBox,
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
    topology: {
      type: Array,
      default: () => ([])
    },
  },
  model: {
    prop: 'visible',
    event: 'update',
  },
  setup(props, {emit}) {
    const $tt = t;
    const {proxy} = getCurrentInstance();
    const {$message} = proxy;
    let nodes = props.topology?.filter(cell => cell.shape === 'rect');
    let shareState = ref(PageStatus.state);
    let templateId = ref(null);
    // 模板操作系统类型
    let templateOsType = ref(null);
    let filterNodes = ref([]);
    let checkedNodeList = ref([]);
    let active = ref(1);
    let stepLabel = [{title: $tt('menu.dialog.chooseTemplate')}, {title: $tt('menu.dialog.chooseNodes')}];

    let visibleValue = computed({
      get: () => {
        return props.visible;
      },
      set: (val) => {
        emit('update:visible', val)
      }
    });

    let rowSelection = computed(
      {
        get: () => {
          return {
            onChange: (selectedRowKeys, selectedRows) => {
              templateOsType.value = selectedRows[0].os_type
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

    let osValue = ref('');
    let templateName = ref('');
    const query = ref({
      osTypes: '',
      name: '',
      pageSize: 1000,
    })

    const handleDataLoaded = (res) => {
      multipleSelection.value = []
      let list = _.get(res, 'tableData', []);
      if (list.length) {
        // 默认选中第一个模板，并过滤出适用当前模板的系统的节点
        multipleSelection.value.push(list[0])
        templateOsType.value = list[0].os_type
      }
    }
    const fetchPromise = (queryData, option) => {
      multipleSelection.value = []
      return getProbesList(queryData).then((res) => {
        let list = _.get(res.data, 'data.list', []);
        if (list.length) {
          // 默认选中第一个模板，并过滤出适用当前模板的系统的节点
          multipleSelection.value.push(list[0])
          templateOsType.value = list[0].os_type
        }
        return {
          data: { data: list }
        }
      })
    }

    // 查看模板详情
    let showTemplateDetail = ref(false);
    const checkTemplateDetail = (id) => {
      showTemplateDetail.value = true
      templateId.value = id
    }

    const handleClose = () => {
      emit('update', false);
      emit('close', false);
    }
    const handleClick = () => {
      emit('click')
    }

    const nextStep = () => {
      if (multipleSelection.value.length === 0) {
        $message.error($tt('menu.dialog.probe.chooseTemplatePls'));
      } else {
        active.value++;
        filterNodes.value = []
        // 获取到模板数据后，过滤掉没有系统类型和不支持cloud-init 的节点
        nodes?.filter(cell => cell.shape === 'rect').forEach(cell => {
          let {basicConfig = {}} = cell.data;
          let nodeSystemType = shareState.value.systemType[basicConfig.system_type];
          let existNodes = filterNodes.value.some(item => item.id == cell.id);
          if (basicConfig?.init_support && (nodeSystemType == templateOsType.value) && !existNodes) {
            filterNodes.value.push({...basicConfig, id: cell.id})
          }
        })
      }
    }

    const previousStep = () => {
      active.value--;
    }
    /**
     *
     * @param data 探针数组
     * @param probeType
     * @param probeCategory
     * @returns {*}
     */
    const packageData = (data, probeType, probeCategory) => {
      let probe = [];
      data?.forEach((item, type) => {
        probe.push({
          common: !Boolean(probeType),
          desc: item.description,
          id: item.id,
          disabled: Boolean(item.disabled),
          interval: item.interval_sec,
          name: item.name,
          os_type: item.os_type,
          output_format: item.output_format,
          script_type: item.script_type,
          script_url: item.script_url,
          type: probeType ? item.probe_category : probeCategory,
          collect_path: item.paths,
          params: getParameter(item.parameter), // TODO
          open: !Boolean(item.disabled),
        });
      });
      return probe;
    }
    const handleTemplateDetailClose = () => {
      showTemplateDetail.value = false
    }

    const submit = () => {
      let probes = [];
      // 根据选中的值，调用接口获取到模板详情数据
      let { id } = multipleSelection.value[0];
      getProbesTemplateDetail({id}).then((res) => {
        probes = _.get(res.data, 'data', {});
        let {basic_info_probes, custom_probes, event_probes, log_probes} = probes
        // 将探针管理的结构=》场景需要的结构
        let packageProbes = [
          ...packageData(basic_info_probes, 0, 0),
          ...packageData(event_probes, 0, 1),
          ...packageData(log_probes, 0, 2),
          ...packageData(custom_probes, 1, null),
        ]
        // 遍历选中的节点进行赋值
        checkedNodeList.value?.forEach(nodeId => {
          let node = nodes?.filter(node => node.id === nodeId)[0];
          if (node?.data?.cpcollection.hasOwnProperty('elements')) {
            emit('update-probes', {nodeId, probes: packageProbes, enable_probe_collect: true, edited: true});
          }
        })
        if (checkedNodeList.value && checkedNodeList.value.length) {
          $message.success($tt('stage.operateSuccess'))
        }
        handleClose();
      })
    }

    return {
      $tt,
      SYSTEM_TYPE,
      templateId,
      query,
      checkedNodeList,
      showTemplateDetail,
      tableSelector,
      multipleSelection,
      columns,
      active,
      stepLabel,
      visibleValue,
      rowSelection,
      osValue,
      SYSTEM_OPTION,
      templateName,
      filterNodes,
      shareState,
      handleTemplateDetailClose,
      checkTemplateDetail,
      handleClose,
      handleClick,
      fetchPromise,
      nextStep,
      previousStep,
      submit,
      handleDataLoaded,
    }
  }
}
</script>
<style lang="scss" scoped>
.probe-batch-wrapper {
  .cb-select {
    //width: 100% !important;
    ::v-deep .el-select-dropdown .el-select-dropdown__wrap {
      margin-bottom: 0 !important;
    }
  }
}
</style>
