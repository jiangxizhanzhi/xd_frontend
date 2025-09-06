<template>
  <div>
    <cb-dialog
      :visible.sync="visibleForm"
      height="600px"
      width="1000px"
      :class="{ 'usb-file-dialog': showProgress }"
      @close="handleClose"
    >
      <upload-process
        :percentage="uploadPercentage"
        :isShowProgress="showProgress"
      ></upload-process>
      <template slot="title">
        <div>{{ name }}</div>
      </template>
      <div class="upload-btn-wrapper">
        <cb-button-group>
          <cb-upload-file
            v-model="fileList"
            type="file"
            :fetch-promise="uploadFileFunc"
            :showFileList="false"
            :limit="0"
            :fileSize="fileSize"
          >
          </cb-upload-file>
        </cb-button-group>
      </div>
      <cb-search-bar class="search-bar-wrapper">
        <cb-search-input
          slot="filter"
          :trigger="'input'"
          v-model="queryName"
          clearable
          :placeholder="$t('device.placeInputFileName')"
          @change="getFileListByName"
        />
        <div slot="searchRightArea" class="progress-wrapper">
          <cb-progress :percentage="percentage" :format="format"></cb-progress>
        </div>
      </cb-search-bar>
      <cb-search-table
        v-loading="loading"
        ref="usbTableRef"
        rowKey="resource_id"
        :cols.sync="USB_FILE_LIST_COLUMNS"
        :dataSource="dataSource"
        hide-pagin-on-demand
      >
        <template v-slot:operation="scope">
          <cb-button type="text" @click="downloadItemFile(scope.data)" mr
            >{{ $t('device.download') }}
          </cb-button>
          <cb-button
            type="text"
            button-type="delete"
            @click="deleteFile(scope.data, $event)"
          >
          </cb-button>
        </template>
      </cb-search-table>
    </cb-dialog>
  </div>
</template>

<script>
import { ref, computed, watch, getCurrentInstance } from '@vue/composition-api';
import { USB_FILE_LIST_COLUMNS } from '../constant';
import {
  getUsbFileList,
  downloadUsbFile,
  deleteUsbFile,
} from '../../../../../api/device/usb';
import { request } from '@cyber/helper';
import UploadProcess from '../../../../../components/upload-process';
export default {
  name: 'usb-file-list',
  components: {
    UploadProcess,
  },
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    uuid: {
      type: String,
      default: '',
    },
    name: {
      type: String,
      default: '',
    },
  },
  setup(props, { emit }) {
    const { proxy } = getCurrentInstance();
    const { $message, $serverError } = proxy;
    let uploadLoading = ref(false);
    let query = ref({
      uuid: props.uuid,
    });
    const visibleForm = computed({
      get: () => {
        return props.visible;
      },
      set: (val) => {
        emit('update:visible', val);
      },
    });
    let usbTableRef = ref();
    let tableList = ref([]); // 全部的列表数据
    let dataSource = ref([]); // 筛选过的列表数据
    let fileList = ref([]);
    let capacity = ref('');
    let used = ref('');
    let percentage = ref(0);
    let queryName = ref('');
    let loading = ref(true);
    let fileSize = ref('');
    let uploadPercentage = ref(0); // 文件上传的进度
    let showProgress = ref(false); //上传进度条是否显示

    const getFileList = () => {
      loading.value = true;
      getUsbFileList(query.value).then((res) => {
        loading.value = false;
        tableList.value = res?.data?.data?.files?.items;
        getFileListByName(queryName.value);
        used.value = res?.data?.data?.used || 0;
        capacity.value = res?.data?.data?.capacity || 0;
        fileSize.value = Math.min(
          (Number(capacity.value) - Number(used.value)) * 1024 * 1024,
          1024 * 1024 * 1024,
        );
        percentage.value =
          !used.value || !capacity.value
            ? 0
            : (used.value / capacity.value) * 100;
      });
    };

    const getFileListByName = (queryName) => {
      dataSource.value = tableList.value.filter((item) => {
        return item.file_name.indexOf(queryName) >= 0;
      });
    };

    getFileList();

    const downloadItemFile = (data) => {
      let params = {
        fileName: data.file_name,
        uuid: props.uuid,
      };
      downloadUsbFile(params).then((res) => {
        let a = document.createElement('a');
        a.href = res.data.data;
        a.click();
      });
    };

    // 删除
    const deleteFile = (data, done) => {
      let params = {
        fileName: data.file_name || '',
        uuid: props.uuid,
      };
      deleteUsbFile(params).then((res) => {
        done();
        getFileList();
      });
    };

    const uploadFileFunc = (file) => {
      showProgress.value = true;
      uploadLoading.value = true;
      const formData = new FormData();
      formData.append('file', file);
      formData.append('uuid', props.uuid);
      request
        .post('/devops/cluster/virtual_usb/upload', formData, {
          baseURL: '/api/mp',
          onUploadProgress: (progressEvent) => {
            let processStatus =
              ((progressEvent.loaded / progressEvent.total) * 100) | 0;
            uploadPercentage.value = processStatus;
          },
        })
        .then((res) => {
          showProgress.value = false;
          uploadLoading.value = false;
          getFileList();
        })
        .catch((error) => {
          $serverError(error);
          uploadPercentage.value = 0;
          showProgress.value = false;
        });
    };
    const format = () => {
      return `${used.value}M/${capacity.value}M`;
    };

    const handleClose = () => {
      emit('close');
    };

    return {
      USB_FILE_LIST_COLUMNS,
      usbTableRef,
      query,
      dataSource,
      visibleForm,
      queryName,
      fileList,
      percentage,
      loading,
      fileSize,
      uploadLoading,
      uploadPercentage,
      showProgress,
      downloadItemFile,
      deleteFile,
      getFileList,
      uploadFileFunc,
      format,
      getFileListByName,
      handleClose,
    };
  },
};
</script>

<style scoped lang="scss">
.search-wrapper {
  margin-bottom: 16px;
}
.upload-btn-wrapper {
  display: block;
  padding-left: 16px;
}
.progress-wrapper {
  width: 500px;
  float: right;
}
.search-bar-wrapper {
  padding: 0 16px 0 16px;
  margin: 8px 0 -8px 0;
}
.usb-file-dialog {
  pointer-events: none;
}
</style>
