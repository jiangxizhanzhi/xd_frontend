<template>
  <!--单节点数据采集编排-->
  <div class="cb-scene-editor" v-if="visible">
    <div class="cb-scene-dialog">
      <div class="no-padding">
        <cb-dialog
          custom-class="cb-scene-editor probe-batch-wrapper"
          width="960px"
          :visible="visible"
          append-to-body
          @close="handleClose">
          <template slot="title">
            <div class="cb-scene-dialog-header">
              {{ DialogTitle[5] }}
            </div>
          </template>
          <div class="probe-switch-btn">
            <span>{{ DialogTitle[5] }}：</span>
            <!--active-text="开启" inactive-text="关闭"-->
            <cb-switch v-model="enable_probe_collect" size="middle"></cb-switch>
          </div>
          <div class="probe-single-node-wrapper">
            <div class="filter-tip">
              {{ $tt('menu.dialog.probe.tip', {system: system_type}) }}
            </div>
            <div class="content">
              <div class="title-header-box">
                <span class="title">{{ $tt('menu.menu.dataCollect') }}</span>
                <cb-button icon="icon-daoru" hollow @click="importTemplate">{{
                    $tt('menu.dialog.probe.import')
                  }}
                </cb-button>
              </div>
              <cb-tabs class="probe-wrapper">
                <cb-tab-pane :label="$tt('menu.dialog.probe.baseCollection')">
                  <cb-scrollbar height="283px">
                    <div v-for="(probe, index) in baseProbes" :key="JSON.stringify('baseCollection' + index + probe)"
                         :class="{'last-probe': index == baseProbes.length - 1}">
                      {{ probe.name }}
                      <div class="desc base">{{ probe.desc }}</div>
                    </div>
                    <empty-box v-if="!baseProbes.length" type="table"></empty-box>
                  </cb-scrollbar>
                </cb-tab-pane>
                <cb-tab-pane :label="$tt('menu.dialog.probe.eventCollection')">
                  <cb-scrollbar height="283px">
                    <div v-for="(item, index) in eventProbes" :key="JSON.stringify('eventCollection' + index + item)"
                       class="probe-box">
                    <cb-checkbox :label="item.name" v-model="item.open" @change="changeEventCollection($event, index)">
                      <span>{{ item.name }}</span>
                      <div class="desc">{{ item.desc }}</div>
                    </cb-checkbox>
                    <template v-if="item.collect_path && ['006', '007'].includes(item.id)">
                      <cb-row v-for="(path, idx) in item.collect_path" :key="JSON.stringify(index + idx)"
                              :class="{'input-box': true, 'last-input-box': item.collect_path.length-1 == idx }">
                        <cb-col :span="16">
                          <cb-input
                            size="small"
                            v-model="item.collect_path[idx]"
                            :placeholder="item.id == '006' ? $tt('menu.dialog.placeholder.file') : $tt('menu.dialog.placeholder.register')"
                          />
                        </cb-col>
                        <cb-col :span="3">
                          <div class="btn-box">
                            <cb-button v-if="item.collect_path.length > 1" type="text" icon="icon-jianshao"
                                       @click="deleteEventItem(index, idx)"></cb-button>
                            <cb-button v-if="idx === item.collect_path.length-1" type="text" icon="icon-xinzeng"
                                       @click="addEventItem(index)"
                                       class="add-btn"></cb-button>
                          </div>
                        </cb-col>
                      </cb-row>
                    </template>
                  </div>
                    <empty-box v-if="!eventProbes.length" type="table"></empty-box>
                  </cb-scrollbar>
                </cb-tab-pane>
                <cb-tab-pane :label="$tt('menu.dialog.probe.logCollection')">
                  <cb-scrollbar height="283px">
                    <div v-for="(item, index) in logProbes" :key="JSON.stringify('logCollection' + index + item)"
                       class="probe-box">
                    <cb-checkbox :label="item.name" v-model="item.open"
                                 @change="changelogCollection($event, index, item)">
                      <span>{{ item.name }}</span>
                      <div class="desc">{{ item.desc }}</div>
                    </cb-checkbox>
                    <template v-if="item.collect_path && ['011'].includes(item.id)">
                      <cb-row v-for="(path, idx) in item.collect_path"
                              :key="JSON.stringify('logCollection_collect_path' + index + idx + item)"
                              :class="{'input-box': true, 'last-input-box': item.collect_path.length-1 == idx }">
                        <cb-col :span="16">
                          <cb-input
                            size="small"
                            v-model="item.collect_path[idx]"
                            :placeholder="$tt('menu.dialog.placeholder.log')"
                          />
                        </cb-col>
                        <cb-col :span="3">
                          <div class="btn-box">
                            <cb-button v-if="item.collect_path.length > 1" type="text" icon="icon-jianshao"
                                       @click="deleteLogItem(index, idx)"></cb-button>
                            <cb-button v-if="idx === item.collect_path.length-1" type="text" icon="icon-xinzeng"
                                       @click="addLogItem(index)"
                                       class="add-btn"></cb-button>
                          </div>
                        </cb-col>
                      </cb-row>
                    </template>
                  </div>
                    <empty-box v-if="!logProbes.length" type="table"></empty-box>
                  </cb-scrollbar>
                </cb-tab-pane>
                <cb-tab-pane :label="$tt('menu.dialog.probe.customCollection')">
                  <!-- 自定义采集-探针列表 -->
                  <custom-probe-list v-if="!showTemplateList" :customProbes.sync="customProbes"
                                     :system_type="system_type"
                                     @save="saveCustomProbes"></custom-probe-list>
                </cb-tab-pane>
              </cb-tabs>
            </div>
          </div>
          <template slot="footer">
            <div class="cb-scene-dialog-footer">
              <cb-button-group>
                <cb-button button-type="confirm" @click="submitForm()">
                  {{ $tt('global.sure') }}
                </cb-button>
                <cb-button button-type="cancel" hollow @click="handleClose()">
                  {{ $tt('global.cancel') }}
                </cb-button>
              </cb-button-group>
            </div>
          </template>
          <!-- 采集模板列表 -->
          <probe-template-list v-if="showTemplateList" :system_type="system_type" :visible.sync="showTemplateList"
                               @onChangeTemplate="handleChangeTemplate"></probe-template-list>
        </cb-dialog>
      </div>
    </div>
  </div>
</template>

<script>
import {computed, getCurrentInstance, inject, reactive, ref} from '@vue/composition-api';
import _ from 'lodash';
import t from '../../../../../utils/i18n';
import {FORM_RULES} from "../../components/constant/form-rules";
import PageStatus from "../../../../store/page-status";
import {CATEGORY_PROB, SYSTEM_TYPE} from "../../components/constant/probe";
import CustomProbeList from "./custom-probe-list";
import EmptyBox from "../../components/empty-box/empty-box";
import ProbeTemplateList from "./probe-template-list";
import {DialogTitle} from "../../../../../types/dialog";
import {getParameter} from "../../../../../utils/dialog/probe";
import SceneStore from "../../../../../store/scene-store";
import sceneStore from "../../../../../store/scene-store";

export default {
  name: 'probe-single-node',
  components: {
    CustomProbeList,
    EmptyBox,
    ProbeTemplateList,
  },
  props: {
    /**
     * 是否弹窗
     */
    visible: {
      type: Boolean,
      default: false,
    },
    nodeInfo: {
      type: Object,
      default: () => ({}),
    },
    currentNode: {},
  },
  model: {
    prop: 'visible',
    event: 'update',
  },
  setup(props, {emit}) {
    const $tt = t;
    const {proxy} = getCurrentInstance();
    const {$message, $confirm} = proxy;
    const nodeFormData = props.currentNode.data;
    const formRef = ref(null);
    let shareState = ref(PageStatus.state);
    let enable_probe_collect = ref(false);

    let _cpCollection = []
    if (nodeFormData.cpcollection && nodeFormData.cpcollection.hasOwnProperty('elements')) {
      if (nodeFormData.cpcollection.elements && nodeFormData.cpcollection.elements.hasOwnProperty(props.nodeInfo.id)) {
        enable_probe_collect.value = nodeFormData.cpcollection.elements[props.nodeInfo.id]?.enable_probe_collect;
        let probes = nodeFormData.cpcollection.elements[props.nodeInfo.id]?.probes;
        if (probes) {
          probes?.forEach(item => {
            item['open'] = !item.disabled
          })
        } else {
          nodeFormData.cpcollection.elements[props.nodeInfo.id] = { probes: SceneStore.state.commonProbes, enable_probe_collect: true }
        }
        _cpCollection = nodeFormData.cpcollection.elements[props.nodeInfo.id]
      }
    }

    let nodeForm = reactive(_.cloneDeep(Object.assign(
      {},
      nodeFormData.basicConfig,
      {cpcollection: _cpCollection}
    )));

    const system_type = SYSTEM_TYPE[shareState.value.systemType[nodeForm.system_type]] || '--';

    let baseProbes = ref(nodeForm.cpcollection.probes?.filter(probe => probe.common == true && probe.type == 0) || [])
    let eventProbes = ref(nodeForm.cpcollection.probes?.filter(probe => probe.common == true && probe.type == 1) || [])
    let logProbes = ref(nodeForm.cpcollection.probes?.filter(probe => probe.common == true && probe.type == 2) || [])
    let customProbes = ref(nodeForm.cpcollection.probes?.filter(probe => probe.common == false) || [])

    const changeEventCollection = ($event, index) => {
      if ($event) {
        eventProbes.value[index].disabled = false;
        eventProbes.value[index]['collect_path'].push('')
      } else {
        eventProbes.value[index].disabled = true;
        eventProbes.value[index]['collect_path'] = []
      }
    }
    // 日志采集
    const changelogCollection = ($event, index, item) => {
      if (item.id == '011') {
        if ($event) {
          logProbes.value[index]['collect_path'].push('');
        } else {
          logProbes.value[index]['collect_path'] = []
        }
      }
      logProbes.value[index].disabled = !$event;
    }

    // 文件变更事件
    const deleteEventItem = (index, idx) => {
      if (eventProbes.value[index]['collect_path'].length > 1) {
        eventProbes.value[index]['collect_path'].splice(idx, 1)
      }
    }
    const addEventItem = (index) => {
      eventProbes.value[index]['collect_path'].push('')
    }

    // 日志事件
    const deleteLogItem = (index, idx) => {
      if (logProbes.value[index]['collect_path'].length > 1) {
        logProbes.value[index]['collect_path'].splice(idx, 1)
      }
    }
    const addLogItem = (index) => {
      logProbes.value[index]['collect_path'].push('')
    }

    const saveCustomProbes = (data) => {
      customProbes.value = data;
    }

    let showTemplateList = ref(false);
    // 导入模板
    const importTemplate = () => {
      $confirm($tt('menu.dialog.probe.importConfirm'))
        .then((res) => {
          showTemplateList.value = true;
        })
        .catch(() => {
        });
    }

    const handleClose = () => {
      emit('update', false);
    }

    const handleChangeTemplate = (data) => {
      let {basic_info_probes, custom_probes, event_probes, log_probes} = data
      // 将探针管理的结构=》场景需要的结构
      baseProbes.value = packageData(basic_info_probes, 0, 0)
      eventProbes.value = packageData(event_probes, 0, 1)
      logProbes.value = packageData(log_probes, 0, 2)
      customProbes.value = packageData(custom_probes, 1, null)
    }

    /**
     *
     * @param data 探针数组
     * @param probeType
     * @param probeCategory
     */
    const packageData = (data, probeType, probeCategory) => {
      return data?.map((item, index) => {
        return {
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
        };
      });
    }
    const submitForm = () => {
      nodeForm.cpcollection.probes = [
        ...baseProbes.value,
        ...eventProbes.value,
        ...logProbes.value,
        ...customProbes.value,
      ]

      _.set(nodeFormData.cpcollection['elements'][props.nodeInfo.id], 'enable_probe_collect', enable_probe_collect.value);
      _.set(nodeFormData.cpcollection['elements'][props.nodeInfo.id], 'edited', enable_probe_collect.value);
      _.set(nodeFormData.cpcollection['elements'][props.nodeInfo.id], 'probes', nodeForm.cpcollection.probes);
      props.currentNode.setData(nodeFormData);
      if (sceneStore.state.sceneStatus !== 'display') {
        // 节点配置页面保存
        emit('update-node-data-edit', props.currentNode);
      }
      handleClose()
    }
    return {
      $tt,
      FORM_RULES,
      SYSTEM_TYPE,
      CATEGORY_PROB,
      DialogTitle,
      system_type,
      formRef,
      nodeForm,
      nodeFormData,
      shareState,
      baseProbes,
      eventProbes,
      logProbes,
      customProbes,
      showTemplateList,
      enable_probe_collect,
      handleChangeTemplate,
      handleClose,
      importTemplate,
      saveCustomProbes,
      deleteEventItem,
      addEventItem,
      deleteLogItem,
      addLogItem,
      changelogCollection,
      changeEventCollection,
      submitForm,
    };
  }
}
</script>
