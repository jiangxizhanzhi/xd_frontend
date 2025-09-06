<template>
  <div id="import-file">
    <!--导入功能-->
    <cb-dialog
      :title="$t('common.import')"
      :visible.sync="newImportVisible"
      width="30%"
      :show-close="false"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      center
    >
      <cb-upload-file
        v-model="fileList"
        v-show="!infoVisible"
        type="file"
        :fetch-promise="uploadFileFunc"
        :tipText="$t('common.textTip')"
        accept=".zip"
        :showFileList="false"
        :loading="infoVisible"
      ></cb-upload-file>
      <cb-button :loading="infoVisible" :hollow="true" v-show="infoVisible">{{
        $t('common.importing')
      }}</cb-button>

      <span slot="footer" class="dialog-footer">
        <cb-button button-type="cancel" @click="newImportVisible = false">
          {{ $t('common.cancel') }}
        </cb-button>
      </span>
    </cb-dialog>
  </div>
</template>

<script>
import { request } from '@cyber/helper';

export default {
  name: 'ImportFile',
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    action: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      newImportVisible: this.visible,
      infoVisible: false,
      fileList: [],
    };
  },
  watch: {
    visible(val, oldVal) {
      this.newImportVisible = val;
    },
    newImportVisible(val, oldVal) {
      this.$emit('update:visible', val);
    },
  },
  methods: {
    uploadFileFunc(file) {
      this.infoVisible = true;
      const formData = new FormData();
      formData.append('file', file);
      request
        .put(this.action, formData, { baseURL: '/api/ojj' })
        .then((resp) => {
          this.infoVisible = false;
          this.$message.success(this.$t('common.uploadSuccess'));
          this.$emit('reloadGetList');
          this.newImportVisible = false;
          this.fileList = [];
        })
        .catch((error) => {
          this.infoVisible = false;
          this.fileList = [];
          if (error.response.status === 413) {
            this.infoVisible = false;
            this.$message.error(this.$t('crEvent.uploadedFileIsLarge'));
            return;
          }
        });
    },
    beforeUpload(file) {
      const fileName = file.name;
      const pos = fileName.lastIndexOf('.');
      const lastName = fileName.substring(pos, fileName.length);
      if (lastName.toLowerCase() !== '.zip') {
        this.$message.error(
          this.$t('crScene.uploadZipFilesCanOnlyBeZIPFormat'),
        );
        return false;
      }
      this.infoVisible = true;
      return true;
    },
    uploadSuccess(response, file, fileList) {
      this.infoVisible = false;
      this.$message.success(this.$t('common.uploadSuccess'));
      this.$emit('reloadGetList');
    },
    uploadError(error, file, fileList) {
      this.infoVisible = false;
      if (error.status === 413) {
        this.infoVisible = false;
        this.$message.error(this.$t('crEvent.uploadedFileIsLarge'));
        return;
      }
      const messages = JSON.parse(error.message);
      if (messages.length > 0) {
        this.$message.error(messages[0].message);
      } else {
        this.$message.error(this.$t('common.uploadFailed'));
      }
    },
  },
};
</script>
<style lang="scss" scoped>
::v-deep .is-loading::before {
  background-color: transparent !important;
}
::v-deep .cb-upload-file {
  max-width: unset !important;
}
</style>

<style lang="scss">
#import-file {
  .upload-demo {
    text-align: center;
  }
  ::v-deep .el-upload {
    width: 80%;
    .el-upload-dragger {
      width: 100%;
    }
  }
  .cb-dialog-body {
    text-align: center;
  }
  .cb-upload-file-content {
    text-align: center;
  }
}
</style>
