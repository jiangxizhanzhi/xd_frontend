<template>
  <cb-dialog
    custom-class="cb-scene-editor probe-batch-wrapper no-padding"
    width="750px"
    height="300px"
    :visible.sync="visibleValue"
    append-to-body
    @close="handleClose"
  >
    <template slot="title">
      <div>{{ $tt('menu.menu.importDataConfig') }}</div>
    </template>
    <div class="import-wrapper">
      <cb-form
        ref="fromRef"
        :model.sync="importData"
        width="100%"
        label-position="left"
        label-width="180px"
        :isBgColor="false"
      >
        <cb-upload-file
          class="upload-box"
          drag
          accept=".json"
          :type="'file'"
          :show-file-list="true"
          :limit="1"
          :fetchPromise="fetchPromise"
        >
          <i class="el-icon-upload"></i>
          <div class="el-upload__text">
            {{ $tt('menu.menu.dragInfo')
            }}<em>{{ $tt('menu.menu.clickUpload') }}</em>
          </div>
          <template v-slot:tip>{{ $tt('menu.menu.onlyJson') }}</template>
        </cb-upload-file>
      </cb-form>
    </div>
    <template slot="footer">
      <div class="cb-scene-dialog-footer">
        <cb-button-group space="middle">
          <cb-button
            button-type="confirm"
            @click="submitForm"
            class="fix-width-btn"
            :disabled="!canSave"
          >
            {{ $tt('global.sure') }}
          </cb-button>
          <cb-button button-type="cancel" mr @click="handleClose"></cb-button>
        </cb-button-group>
      </div>
    </template>
  </cb-dialog>
</template>

<script>
import t from '../../../../utils/i18n';
import {reactive, ref, computed, getCurrentInstance} from '@vue/composition-api';
import { importSceneData } from '../../../../api/index';
import PageStatus from '../../../store/page-status';
import sceneStore from "../../../../store/scene-store";
import {canAddNodes, isUpperNode} from "../../../../utils/common";
// import {cyberBus} from "../../../../utils/event-bus";

export default {
  name: 'Import',
  components: {},
  props: {
    /**
     * 是否弹窗
     */
    visible: {
      type: Boolean,
      default: false,
    },
    // 场景ID，主要用于分层拓扑数据获取
    sceneConfigId: {
      type: String,
      default: '',
    },
  },
  model: {
    prop: 'visible',
    event: 'update',
  },
  setup(props, { emit }) {
    const $tt = t;
    const { proxy } = getCurrentInstance();
    const { $message } = proxy;
    let visibleValue = computed({
      get: () => {
        // console.log('visibleValue', props.visible);
        return props.visible;
      },
      set: (val) => {
        emit('update:visible', val);
      },
    });
    const fromRef = ref(null);
    // 导入的配置数据
    const importData = reactive({});
    // 提交表单
    const submitForm = () => {
      emit('import-scene-data', importData.value);
      handleClose();
    };
    let canSave = ref(false);
    // 重置表单
    const resetForm = () => {};
    // 上传文件
    const fetchPromise = (file) => {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('area_id', PageStatus.state.currentTreeLevelId);
      formData.append('id', props.sceneConfigId);
      importSceneData(formData).then((res) => {
        importData.value = res?.data?.data;
        // 排除非当前层的节点
        let nodesNum = 0;
        sceneStore.state.graph.getNodes()?.forEach(node => {
          if (!isUpperNode(node) && node.shape === 'rect') {
            nodesNum++;
          }
        })
        let addNodes = importData.value?.scene_config?.topology?.out_area_element_num || 0;
        canAddNodes(nodesNum, addNodes)
          .then(async () => {
            canSave.value = true;
          })
          .catch(() => {
          });
      }).catch(err => {
        $message.error(err.data?.message);
      });
    };

    // 上传成功的回调
    const onSuccess = (file) => {
      console.log('导入成功', file);
    };
    const handleClose = () => {
      emit('close-import', false);
      visibleValue.value = false;
    };
    const handleClick = () => {
      emit('click');
    };

    return {
      fromRef,
      importData,
      handleClose,
      handleClick,
      submitForm,
      resetForm,
      fetchPromise,
      onSuccess,
      $tt,
      visibleValue,
      canSave,
    };
  },
};
</script>
