<template>
  <div class="document-wrapper">
    <cb-tooltip
      class="item"
      effect="dark"
      :content="$t('director.document')"
      placement="left-start"
    >
      <div class="document-box" @click="showDocument">
        <cb-iconfont type="icon-yanxiwenshu" size="28" />
      </div>
    </cb-tooltip>
    <cb-dialog
      v-if="documentDialog"
      :title="$t('director.document')"
      center
      :visible.sync="documentDialog"
      width="1000px"
    >
      <div class="document">
        <div class="condition">
          <span class="tip">{{ $t('director.sendTo') }}：</span>
          <cb-radio-group v-model="role_group">
            <cb-radio :label="4">
              {{ $t('list.red') }}
            </cb-radio>
            <cb-radio :label="5">
              {{ $t('list.blue') }}
            </cb-radio>
          </cb-radio-group>
        </div>
        <CbMarkdown
          v-model="model.content"
          :uploadImages="uploadImages"
          :uploadFile="uploadFile"
          :uploadZip="uploadZip"
          :exportFile="exportFile"
        />
      </div>
      <div slot="footer" class="dialog-footer">
        <cb-button button-type="confirm" @click="submit" mr />
        <cb-button button-type="cancel" @click="cancel" />
      </div>
    </cb-dialog>
  </div>
</template>

<script>
import { exercisePaper, getExercisePaper } from '@/api/web/red-blue.js';
import { BUSINESS_TYPE } from '@/pages/web/RedVsBlue/constants.js';
import { saveImageWeb, uploadAttachmentWeb, uploadMd } from '@/api/common';
export default {
  components: {},
  props: {
    resourceId: {
      type: [String, Number],
      default: '',
    },
  },
  data() {
    return {
      fileSize: 1024 * 1024 * 1024,
      BUSINESS_TYPE,
      resource_id: '',
      documentDialog: false,
      role_group: 4,
      model: {
        content: '',
      },
    };
  },
  watch: {
    role_group: {
      handler(nv) {
        this.getExercisePaper();
      },
    },
  },
  computed: {},
  created() {
    this.resource_id = this.$route.params && this.$route.params.resource_id;
  },
  mounted() {
    this.getExercisePaper();
  },
  methods: {
    getExercisePaper() {
      const params = {
        resource_id: this.resource_id,
        group_hash: this.role_group,
      };
      getExercisePaper(params).then((res) => {
        this.model.content = res.data.data.exercise_paper || '';
      });
    },
    showDocument() {
      this.documentDialog = true;
    },
    submit() {
      exercisePaper({
        exercise_paper: this.model.content,
        group_hash: this.role_group,
        resource_id: this.resourceId,
      }).then((res) => {
        this.documentDialog = false;
        this.$message({
          message: this.$t('m.successful'),
          type: 'success',
        });
      });
    },
    cancel() {
      this.documentDialog = false;
    },
    // 上传图片
    uploadImages(item) {
      var formdata = new FormData();
      formdata.append('file', item[0]);
      formdata.append('type', this.BUSINESS_TYPE.CR_WEB_RED);
      return this.$request
        .post('/common/web/image_upload/', formdata, { baseURL: '/api/ojj' })
        .then((res) => {
          return [
            {
              url: res.data.data.file_path,
            },
          ];
        })
        .catch((res) => {});
    },
    //上传附件
    uploadFile($file) {
      return new Promise((resolve) => {
        //校验文件大小
        if ($file[0].size > this.fileSize) {
          this.$message.warning(
            this.$t('m.fileSizeLimit', {
              size: (this.fileSize / 1024 / 1024).toFixed(2),
            }),
          );
          return false;
        }
        const formdata = new FormData();
        formdata.append('type', '12');
        formdata.append('file', $file[0]);
        uploadAttachmentWeb(formdata).then((res) => {
          const data = _.get(res, 'data.data', []);
          resolve([
            {
              name: data.file_name,
              url: data.file_path,
            },
          ]);
        });
      });
    },
    // 导入文件
    uploadZip(file) {
      return new Promise((resolve, reject) => {
        //校验文件大小
        if (file.size > this.fileSize) {
          this.$message.warning(
            this.$t('m.fileSizeLimit', {
              size: (this.fileSize / 1024 / 1024).toFixed(2),
            }),
          );
          return false;
        }
        const formdata = new FormData();
        formdata.append('md', file);
        uploadMd(formdata).then((res) => {
          const data = _.get(res, 'data.data', []);
          const is_extract = data.is_extract;
          if (is_extract) {
            this.model.content = data.content;
          }
        });
      });
    },
    exportFile() {
      this.$request.download('/cpms/built_in/Demo.zip');
    },
  },
};
</script>
<style lang="scss" scoped>
.document-wrapper {
  .document-box {
    position: fixed;
    right: 16px;
    bottom: 160px;
    width: 40px;
    height: 40px;
    background: var(--bg-color-3);
    border-radius: 50%;
    box-shadow: 8px 8px 30px 0px var(--box-shadow-color);
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    &:hover {
      background: var(--primary-color-2);
    }
  }

  .document {
    height: 500px;
    .condition {
      display: flex;
      align-items: center;
      margin-bottom: 16px;
      .tip {
        margin-right: 8px;
      }
    }
    .cb-markdown {
      height: calc(100% - 50px);
    }
  }
}
</style>
