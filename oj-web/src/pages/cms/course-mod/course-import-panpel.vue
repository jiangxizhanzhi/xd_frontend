<template>
  <div class="user-export-panel">
    <cb-form
      ref="formRef"
      :model="model"
      :url="url"
      :rules="rules"
      label-width="90px"
      baseURL="/api/ojj"
    >
      <cb-form-item :label="$t('m.importFile')" prop="file">
        <div class="file-picker-bar">
          <cb-upload-file
            :limit="1"
            type="file"
            :fetch-promise="uploadFile"
            @delete="fileRemove"
            accept=".zip"
            v-model="list"
          >
          </cb-upload-file>
        </div>
      </cb-form-item>
    </cb-form>
    <div class="form-button-bar">
      <cb-button class="mr20" @click="cancel" button-type="cancel">{{
        $t('button.cancel')
      }}</cb-button>
    </div>
    <upload-process :percentage="process" :isShowProgress="showProgress">
    </upload-process>
  </div>
</template>

<script>
import UploadProcess from '@/components/upload-process';
export default {
  props: {
    orgs: {
      type: Array,
      default() {
        return [];
      },
    },
  },
  components: {
    UploadProcess,
  },
  data() {
    return {
      process: 0,
      showProgress: false,
      url: '/oj/admin/course/batch_loads/',
      model: {
        file: '',
      },
      list: [],
    };
  },
  created() {
    const that = this;
    that.rules = {
      file: [
        {
          required: true,
          message: that.$t('m.chooseFile'),
          trigger: 'blur',
        },
      ],
    };
  },
  methods: {
    uploadFile(file) {
      this.showProgress = true;
      const formData = new FormData();
      formData.append('file', file);
      this.$request
        .post(`/oj/admin/course/batch_loads/`, formData, {
          baseURL: '/api/ojj',
          onUploadProgress: (progressEvent) => {
            let processStatus =
              ((progressEvent.loaded / progressEvent.total) * 100) | 0;
            this.process = processStatus;
          },
        })
        .then(() => {
          this.showProgress = false;
          this.process = 0;
          this.$emit('close', {
            reload: true,
          });
          this.$message({
            message: this.$t('m.importedSuccessfully'),
            type: 'success',
          });
        })
        .catch(() => {
          this.showProgress = false;
          this.process = 0;
        });
    },
    fileRemove(file) {
      this.model.file = '';
    },
    cancel() {
      this.$emit('close');
    },
  },
};
</script>

<style scoped lang="scss">
.template-download-link {
  margin-left: 50px;
}
.file-picker-bar {
  display: flex;
  align-items: center;
}
</style>
