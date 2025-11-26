<template>
  <cb-form-item
    :label="$tt('target.keyFile')"
    :prop="'network.' + index + '.access_modes.' + idx + '.private_key_path'"
    :rules="FORM_RULES.networkConfig.private_key_path"
    :class="{ 'key-box': true, 'no-file': !uploadData.length }"
  >
    <cb-upload-file
      :disabled="uneditableBySceneStatus"
      :limit="1"
      :type="'file'"
      accept=".txt"
      v-model="uploadData"
      :fetch-promise="fetchPromise"
      @delete="handleDelete"
      @download="handleDownload"
      class="key-upload-file-box"
    >
      <template v-slot:tip>
        {{$tt('target.uploadPubTip')}}
      </template>
    </cb-upload-file>
  </cb-form-item>

</template>

<script>
import t from '../../../../../utils/i18n';
import {FORM_RULES} from "../constant/form-rules";
import {computed} from "@vue/composition-api";
import {uploadPrivateKey} from "../../../../../api";
import _ from "lodash";
import sceneStore from "../../../../../store/scene-store";

export default {
  name: "private-key-upload",
  props: {
    index: {
      type: Number,
      default: null,
    },
    idx: {
      type: Number,
      default: null,
    },
    private_key_file_name: {
      type: String,
      default: '',
    },
    private_key_path: {
      type: String,
      default: '',
    },
  },
  setup(props, {emit}) {
    const $tt = t;
    // 场景状态
    const uneditableBySceneStatus = computed({
      get: () => {
        return (sceneStore.state.sceneStatus === 'display' || sceneStore.state.sceneStatus === 'update');
      },
    });
    const uploadData = computed({
      get: () => {
        if (props.private_key_path) {
          return [{
            name: props.private_key_file_name || null,
            url: props.private_key_path || null,
            isDownload: true,
          }]
        } else {
          return [];
        }
      },
      set: (val) => {
        emit('update:private_key_path',  val.length ? val[0].url : null);
        emit('update:private_key_file_name', val.length ? val[0].name : null);
        return val
      }
    })

    // 上传附件
    const fetchPromise = (file) => {
      const formData = new FormData();
      formData.append('file', file);
      uploadPrivateKey(formData)
        .then((res) => {
          uploadData.value = [{
            name:  _.get(res, 'data.data.file_name', ''),
            url: _.get(res, 'data.data.http_url', ''),
          }]
        })
    }

    // 删除附件
    const handleDelete = (val) => {
      uploadData.value = [];
    }

    // 下载附件
    const handleDownload = (val) => {
      let url = val.url;
      const a = document.createElement('a')
      a.href = url
      a.download = val.name // 下载后文件名
      a.style.display = 'none'
      document.body.appendChild(a)
      a.click() // 点击下载
      document.body.removeChild(a) // 下载完成移除元素
    }

    return {
      $tt,
      FORM_RULES,
      uploadData,
      uneditableBySceneStatus,
      handleDownload,
      handleDelete,
      fetchPromise,
    }
  }
}
</script>
