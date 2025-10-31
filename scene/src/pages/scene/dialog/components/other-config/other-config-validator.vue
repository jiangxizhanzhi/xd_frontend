<template>
  <cb-row class="other-config-wrapper">
    <cb-col :span="24">
      <cb-form-item :label="$tt('target.customCommand') + ' ：'" prop="init_commands" :rules="FORM_RULES.otherConfig.init_commands">
        <cb-input :disabled="uneditableBySceneStatus" v-model="orderForm" type="text" :placeholder="$tt('target.placeInputCommand')"></cb-input>
      </cb-form-item>
    </cb-col>
    <cb-col :span="24">
      <cb-form-item prop="icon" :label="$tt('global.attachment') + ' ：'" >
        <cb-upload-file
          :disabled="uneditableBySceneStatus"
          :limit="1"
          :type="'file'"
          accept=".zip"
          :value="fileList"
          :fetch-promise="fetchPromise"
          :isDownload="true"
          @download="download"
          @delete="deleteFile"
        >
          <template v-slot:tip>{{$tt('global.placeUploadZip')}}</template>
        </cb-upload-file>
        <div v-if="showFileInput" class="box-file-input">
          <div class="file-input-box">
            <cb-form-item prop="node_command" :rules="FORM_RULES.otherConfig.node_command">
              <cb-input :disabled="uneditableBySceneStatus" v-model="fileOrderForm" type="text" :placeholder="$tt('target.placeInputCommand')"></cb-input>
            </cb-form-item>
          </div>
        </div>
      </cb-form-item>
    </cb-col>
  </cb-row>
</template>

<script>
import t from '../../../../../utils/i18n';
import _ from "lodash";
import {ref, computed} from '@vue/composition-api';
import {downloadFile, uploadFileAttachment} from "../../../../../api";
import {FORM_RULES} from "../constant/form-rules";
import sceneStore from "../../../../../store/scene-store";

export default {
  name: "otherConfig",
  components: {},
  props: {
    // 节点的init_support字段
    init_support: {
      type: Boolean,
      default: false,
    },
    // 自定义命令字段
    order: {
      type: Array | String,
      default: ()=>[],
    },
    // 附件
    file: {
      type: String,
      default: '',
    },
    // 附件的自定义命令字段
    node_command: {
      type: String,
      default: '',
    },
    /**
     * 节点的镜像类型
     */
    image_type: {
      type: String,
      default: '',
    },
    /**
     * 角色信息
     */
    role: {
      type: Number,
      default: 0,
    },
    // 节点的实例id
    eid: {
      type: String,
      default: ''
    },
  },
  setup(props, {emit}) {
    // 场景状态
    const uneditableBySceneStatus = computed({
      get: () => {
        if (props.role === 4) {
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
    // 回显附件
    const fileList = computed({
      get: () => {
        if (props.file) {
          let _file = props.file.split('?');
          return [{url: _file[0], name: _file[1].split('=')[1]}];
        }
      },
      set: (val) => {
        return val;
      }
    });
    // 自定义命令
    const orderForm = computed({
      get() {
        if (Array.isArray(props.order)) {
          return props.order.join(',');
        } else {
          return props.order;
        }
      },
      set(val) {
        emit('update:order', Array.isArray(props.order) ? val.split(',') : val);
        return val;
      },
    });
    // 附件的自定义命令
    const fileOrderForm = computed({
      get() {
        if (props.node_command !== '') {
          return props.node_command;
        }
      },
      set(val) {
        emit('update:node_command', val);
        return val;
      },
    });
    // 是否展示附件的自定义命令
    const showFileInput = computed({
      get() {
        return !!props.file;
      },
      set(val) {
        return val;
      },
    });
    // 上传附件
    const fetchPromise = (file) => {
      const formData = new FormData();
      formData.append('file', file);
      uploadFileAttachment(formData)
        .then((res) => {
          const url = _.get(res, 'data.data.http_url', '');
          const file_name = _.get(res, 'data.data.file_name', '');
          fileList.value = [{url, name: file_name}];
          emit('update:file', `${url}?filename=${file_name}`);
          showFileInput.value = true;
        })
    }
    // 下载附件
    const download = (val) => {
      let url = val.url;
      const a = document.createElement('a')
      a.href = url
      a.download = val.name // 下载后文件名
      a.style.display = 'none'
      document.body.appendChild(a)
      a.click() // 点击下载
      document.body.removeChild(a) // 下载完成移除元素
    }
    // 删除附件
    const deleteFile = () => {
      fileOrderForm.value = '';
      showFileInput.value = false;
      emit('update:file', '');
    }
    return {
      FORM_RULES,
      uneditableBySceneStatus,
      fileList,
      showFileInput,
      orderForm,
      fileOrderForm,
      fetchPromise,
      download,
      deleteFile,
      $tt: t,
    }
  },
}
</script>
