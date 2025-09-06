<template>
  <cb-markdown
    style="height: 550px"
    v-model="markComputed"
    :uploadImages="showImg ? _uploadImages : null"
    :uploadFile="_uploadFile"
    :uploadZip="showZip ? uploadZip : null"
    :exportFile="showZip ? exportFile : null"
  />
</template>
<script>
import { saveImageCommonAdmin, uploadMd } from '@/api/common.js';
export default {
  components: {},
  props: {
    showImg: {
      type: Boolean,
      default: true,
    },
    showZip: {
      type: Boolean,
      default: true,
    },
    mavonData: {
      type: String,
      default: '',
    },
    businessType: {
      type: [String, Number],
      default: '',
    },
    attachmentType: {
      type: [String, Number],
      default: '',
    },
    // 上传文件最大的大小,单位B
    fileSize: {
      type: Number | String,
      default: '',
    },
  },
  data() {
    return {};
  },
  computed: {
    // 翻译
    language() {
      return this.$store.state.app.language;
    },
    markComputed: {
      get() {
        return this.mavonData || '';
      },
      set(val) {
        this.$emit('update:mavonData', val);
      },
    },
  },
  methods: {
    // markdown 上传图片
    _uploadImages($file) {
      return new Promise((resolve, reject) => {
        let reader = new FileReader();
        reader.onload = (_) => {
          if (this.filterImages($file[0])) {
            let formdata = new FormData();
            formdata.append('file', $file[0]);
            formdata.append('type', this.businessType);

            saveImageCommonAdmin(formdata).then((res) => {
              resolve([
                {
                  url: res.data.data.file_path,
                },
              ]);
            });
          }
        };
        reader.readAsDataURL($file[0]);
      });
    },
    // markdown 上传文件
    _uploadFile($file) {
      return new Promise((resolve, reject) => {
        //校验文件大小
        if ($file[0].size > this.fileSize && this.fileSize != '') {
          this.$message.warning(
            this.$t('m.fileSizeLimit', {
              size: (this.fileSize / 1024 / 1024).toFixed(2),
            }),
          );
          return false;
        }
        let reader = new FileReader();
        reader.onload = (_) => {
          let formdata = new FormData();
          formdata.append('file', $file[0]);
          formdata.append('type', this.attachmentType);
          this.$request
            .post('/common/admin/attachment_upload', formdata, {
              baseURL: '/api/ojj',
            })
            .then((res) => {
              resolve([
                {
                  name: $file[0].name,
                  ...res.data.data,
                  url: res.data.data.file_path,
                },
              ]);
            })
            .catch((err) => {
              this.$serverError(err);
            });
        };
        reader.readAsDataURL($file[0]);
      });
    },
    // 上传可解析md的zip
    uploadZip(file) {
      return new Promise((resolve, reject) => {
        //校验文件大小
        if (file.size > this.fileSize && this.fileSize != '') {
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
            this.$emit('update:mavonData', data.content);
          }
        });
      });
    },
    // 下载文件
    exportFile() {
      this.$request.download('/cpms/built_in/Demo.zip');
    },
    // 上传图片校验
    filterImages(file) {
      const suffix = this.$_.last(this.$_.split(file.name, '.'));
      if (!this.$_.includes(['jpg', 'jpeg', 'png'], this.$_.toLower(suffix))) {
        this.$message({
          message: this.$t('m.pleaseUploadPictures'),
          type: 'error',
        });
        return false;
      }
      return true;
    },
  },
};
</script>
<style lang="scss" scoped>
::v-deep.el-input--mini .el-input__inner {
  border-radius: 15px;
  height: 30px;
  line-height: 30px;
}
</style>
