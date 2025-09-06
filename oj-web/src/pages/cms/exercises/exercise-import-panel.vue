<template>
  <cb-dialog
    :visible.sync="importDialog"
    :title="$t('m.dialogExerciseTitle')"
    width="35%"
  >
    <div class="user-export-panel">
      <cb-form
        ref="formRef"
        :url="url"
        :baseURL="baseURL"
        :model="model"
        :rules="rules"
        label-width="90px"
        onsubmit="return false"
      >
        <cb-form-item :label="$t('m.importFile')" prop="file">
          <div class="file-picker-bar">
            <cb-upload-file
              type="file"
              v-model="list"
              :fetch-promise="uploadFunc"
              tipText=""
              @delete="deleteFile"
            ></cb-upload-file>
          </div>
        </cb-form-item>
      </cb-form>
    </div>
    <div class="form-button-bar" slot="footer">
      <cb-button @click="cancel" buttonType="cancel">{{
        $t('button.cancel')
      }}</cb-button>
    </div>
    <upload-process :percentage="process" :isShowProgress="showProgress">
    </upload-process>
  </cb-dialog>
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
      url: '/oj/admin/practice/set/batch_loads/',
      baseURL: '/api/ojj',
      contentType: 'form-data',
      importDialog: false,
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
    uploadFunc(file) {
      this.showProgress = true;
      const formData = new FormData();
      formData.append('file', file);
      this.$request
        .post(`/oj/admin/practice/set/batch_loads/`, formData, {
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
    cancel() {
      this.$emit('close');
    },
    deleteFile() {
      this.model.file = '';
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
