<template>
  <cb-dialog
    custom-class="cb-scene-editor probe-batch-wrapper"
    width="960px"
    height="600px"
    :visible.sync="visibleValue"
    append-to-body
    @close="handleClose"
  >
    <template slot="title">
      <div>{{ $tt('menu.dialog.probe.templateDetail') }}</div>
    </template>
    <div class="template-detail-wrapper">
      <div class="content">
        <div class="title-header-box">
          <span class="title">{{ $tt('menu.dialog.probe.basic') }}</span>
        </div>
        <div class="basic-box">
          <div><span>{{ $tt('menu.dialog.probe.templateName') }} ：</span>{{ probesForm.name || '--' }}</div>
          <div><span>{{ $tt('menu.dialog.probe.templateDesc') }} ：</span>{{ probesForm.description || '--' }}</div>
          <div><span>{{ $tt('menu.dialog.probe.os_type') }} ：</span>{{ SYSTEM_TYPE[probesForm.os_type] || '--' }}</div>
        </div>
        <div class="title-header-box template">
          <span class="title">{{ $tt('menu.menu.dataCollect') }}</span>
        </div>
        <cb-tabs class="probe-wrapper">
          <cb-tab-pane :label="$tt('menu.dialog.probe.baseCollection')">
            <div v-for="(probe, index) in baseProbes" :key="JSON.stringify('baseCollection' + index + probe)">
              {{ probe.name }}
              <div class="desc base">{{ probe.description }}</div>
            </div>
            <empty-box v-if="!baseProbes || !baseProbes.length" type="table"></empty-box>
          </cb-tab-pane>
          <cb-tab-pane :label="$tt('menu.dialog.probe.eventCollection')">
            <div v-for="(probe, index) in eventProbes" :key="JSON.stringify('eventCollection' + index + probe)"
                 :style="{'opacity': probe.disabled ? '0.4' : '1'}">
              {{ probe.name }}
              <div :class="{'desc': true, 'base': !['006', '007'].includes(probe.id)}">{{ probe.description }}
              </div>
              <cb-row v-if="['006', '007'].includes(probe.id)" class="file-path">
                <cb-col :span="2" :style="{width: lang == 'zh-CN' ? '9%' : '11%'}">
                  <span v-if="probe.id == '006'">{{ $tt('menu.dialog.probe.filePath') }} ：</span>
                  <span v-if="probe.id == '007'">{{ $tt('menu.dialog.probe.registryKey') }} ：</span>
                </cb-col>
                <cb-col :span="lang == 'zh-CN' ? 21 : 19">
                  <template v-if="showPath(probe)">
                    <div class="path" v-for="item in probe.paths">{{ item }}</div>
                  </template>
                  <template v-else><span>--</span></template>
                </cb-col>
              </cb-row>
            </div>
            <empty-box v-if="!eventProbes || !eventProbes.length" type="table"></empty-box>
          </cb-tab-pane>
          <cb-tab-pane :label="$tt('menu.dialog.probe.logCollection')">
            <div v-for="(probe, index) in logProbes" :key="JSON.stringify('logCollection' + index + probe)"
                 :style="{'opacity': probe.disabled ? '0.4' : '1'}">
              {{ probe.name }}
              <div :class="{'desc': true, 'base': probe.id != '011'}">{{ probe.description }}</div>
              <cb-row v-if="probe.id == '011'" class="file-path">
                <cb-col :span="2" style="width: 9%">
                  <span>{{ $tt('menu.dialog.probe.filePath') }} ：</span>
                </cb-col>
                <cb-col :span="21">
                  <template v-if="showPath(probe)">
                    <div class="path" v-for="item in probe.paths">{{ item }}</div>
                  </template>
                  <template v-else><span>--</span></template>
                </cb-col>
              </cb-row>
            </div>
            <empty-box v-if="!logProbes || !logProbes.length" type="table"></empty-box>
          </cb-tab-pane>
          <cb-tab-pane :label="$tt('menu.dialog.probe.customCollection')">
            <!-- 自定义采集-探针列表 -->
            <div class="probe-dialog-content custom-probe-list">
              <cb-search-table
                ref="customListRef"
                :cols="columns"
                row-key="key"
                :dataSource="customProbes"
                :hidePaginOnDemand="true"
              >
                <template v-slot:probe_category="scope">
                  <slot name="thumbNoData">{{ CATEGORY_PROB_OBJECT[scope.data.probe_category] || '--' }}</slot>
                </template>
                <template v-slot:os_type="scope">
                  <slot name="thumbNoData">
                    <span :title="showOS_Type(scope.data.os_type)">{{ showOS_Type(scope.data.os_type) }}</span></slot>
                </template>
              </cb-search-table>
            </div>
          </cb-tab-pane>
        </cb-tabs>
      </div>
    </div>
  </cb-dialog>
</template>

<script>
import {computed, getCurrentInstance, inject, reactive, ref} from '@vue/composition-api';
import t from '../../../../../utils/i18n';
import {FORM_RULES} from "../../components/constant/form-rules";
import PageStatus from "../../../../store/page-status";
import {
  CATEGORY_PROB,
  CATEGORY_PROB_OBJECT,
  CUSTOM_PROBE_TEMPLATE_DETAIL,
  SYSTEM_TYPE
} from "../../components/constant/probe";
import EmptyBox from "../../components/empty-box/empty-box";
import {getProbesTemplateDetail} from "../../../../../api";

export default {
  name: 'probe-template',
  components: {
    EmptyBox,
  },
  props: {
    /**
     * 是否弹窗
     */
    visible: {
      type: Boolean,
      default: false,
    },
    templateId: {
      type: String,
      default: '',
    },
  },
  setup(props, {emit}) {
    const $tt = t;
    const {proxy} = getCurrentInstance();
    const {$message, $confirm} = proxy;
    const lang = inject('lang');

    const formRef = ref(null);
    let shareState = ref(PageStatus.state);
    let columns = ref(CUSTOM_PROBE_TEMPLATE_DETAIL);
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
    let probesForm = ref({});
    getProbesTemplateDetail({id: props.templateId}).then((res) => {
      probesForm.value = _.get(res.data, 'data', {})
    })
    const baseProbes = computed(
      {
        get: () => {
          return probesForm.value?.basic_info_probes || []
        },
      })

    const eventProbes = computed(
      {
        get: () => {
          return probesForm.value?.event_probes || []
        },
      })

    const logProbes = computed(
      {
        get: () => {
          return probesForm.value?.log_probes || []
        },
      })

    const customProbes = computed(
      {
        get: () => {
          return probesForm.value?.custom_probes || []
        },
      })

    const showOS_Type = (str) => {
      let list = str.split(',');
      return list.map(item => {
        return SYSTEM_TYPE[item];
      }).join('、')
    }
    const showPath = (probe) => {
      return probe.paths && probe.paths.length && !_.isEmpty(probe.paths)
    }
    const handleClose = () => {
      visibleValue.value = false;
      emit('close', {type: 'close'})
    }
    return {
      $tt,
      lang,
      SYSTEM_TYPE,
      FORM_RULES,
      CATEGORY_PROB,
      CATEGORY_PROB_OBJECT,
      columns,
      formRef,
      visibleValue,
      shareState,
      baseProbes,
      eventProbes,
      logProbes,
      customProbes,
      probesForm,
      showPath,
      showOS_Type,
      handleClose,
    };
  }
}
</script>
