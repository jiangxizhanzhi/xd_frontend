<template>
  <div>
    <cb-dialog :visible.sync="visible">
      <template slot="title">
        <div>{{ $t('device.fileInjection') }}</div>
      </template>
      <div>
        <cb-form
          ref="fileFromRef"
          :model="model"
          :rules="rules"
          label-width="100px"
        >
          <cb-form-item :label="$t('device.mirrorName')" prop="mirrorName">
            <cb-input
              class="file-input-box"
              :disabled="true"
              v-model.trim="mirrorName"
            ></cb-input>
          </cb-form-item>
          <cb-form-item :label="$t('device.importFile')" prop="file_url">
            <cb-input v-model="model.file_url" style="display: none" />
            <cb-upload-file
              :limit="1"
              type="file"
              v-model="fileList"
              :fetchPromise="uploadFunc"
              @delete="deleteFile"
              :file-size="fileSize"
            >
            </cb-upload-file>
          </cb-form-item>
          <cb-form-item
            v-if="injectObj.injectState"
            :label="$t('device.injectionStatus')"
          >
            <div v-if="injectObj.injecting" class="custom-icon">
              <cb-iconfont
                themedColor="--warning-color"
                class="jia-zai"
                type="icon-jiazai"
              ></cb-iconfont>
              <span class="jia-zai-span">{{ $t('device.injecting') }}</span>
            </div>
            <div v-if="injectObj.injected" class="custom-icon">
              <span v-if="injectObj.injectSuccess" class="inject-success">{{
                $t('device.injectionSucc')
              }}</span>
              <span v-else class="inject-error"
                >{{ $t('device.injectionErrReason') }}：{{
                  injectObj.errorMessage
                }}</span
              >
            </div>
          </cb-form-item>
        </cb-form>
      </div>
      <!-- 按钮 -->
      <template slot="footer">
        <div>
          <cb-button
            mr
            :disabled="injectObj.injecting"
            @click="handleFileInjection"
            >{{ $t('device.fileInjection') }}</cb-button
          >
          <cb-button hollow mr @click="cancel">{{
            $t('common.cancel')
          }}</cb-button>
        </div>
      </template>
    </cb-dialog>
  </div>
</template>

<script>
import { injectFile, uploadFile } from '@/api/device/image';

export default {
  name: 'FileInjection',
  props: {},
  data() {
    return {
      visible: false,
      model: {
        device_uuid: '',
        file_name: '',
        file_size: 0,
        file_url: '',
      },
      fileList: [],
      fileSize: 200 * 1024 * 1024,
      mirrorName: '',
      rules: {
        file_url: [
          {
            required: true,
            message: this.$t('device.pleaseChangeFile'),
            trigger: 'change',
          },
        ],
      },
      // 注入状态
      injectObj: {
        injectState: false,
        injected: false,
        injecting: false,
        injectSuccess: false,
        errorMessage: '',
      },
    };
  },
  watch: {
    visible: {
      handler(value) {
        if (!value) {
          /* 弹框关闭时，置空数据 */
          this.model.file_name = '';
          this.model.file_size = 0;
          this.model.file_url = '';
          this.fileList = [];
          this.resetInjectObjProp();
        }
      },
      immediate: true,
    },
  },

  methods: {
    // 弹窗打开, 获取父组件传过来的单行数据
    open(row) {
      this.visible = true;
      this.model.device_uuid = row.uuid;
      this.mirrorName = _.get(row, 'name', '');
    },
    // 自定义上传
    uploadFunc(file) {
      const formData = new FormData();
      formData.append('file', file);
      uploadFile(formData)
        .then((res) => {
          const data = _.get(res, 'data.data', '') || {};
          this.model.file_name = data.file_name;
          this.model.file_size = data.file_size;
          this.model.file_url = data.inner_http_url;
        })
        .catch((error) => {
          this.fileList = [];
          this.$serverError(error);
        });
    },
    // 文件删除回调
    deleteFile(file) {
      this.model.file_url = '';
    },

    // 恢复注入对象的初始值
    resetInjectObjProp() {
      for (let key in this.injectObj) {
        if (key === 'errorMessage') {
          this.injectObj[key] = '';
          continue;
        }
        this.injectObj[key] = false;
      }
    },

    // 更新injectObj的属性值
    assignInjectObjProp(newObj) {
      this.injectObj = {
        ...this.injectObj,
        ...newObj,
      };
    },
    cancel() {
      this.visible = false;
    },
    // 文件注入
    handleFileInjection() {
      this.resetInjectObjProp();
      this.$refs.fileFromRef.validate((valid) => {
        if (valid) {
          const objTemp = {
            injectState: true,
            injecting: true,
          };
          this.assignInjectObjProp(objTemp);
          injectFile(this.model)
            .then((res) => {
              const objTemp = {
                injecting: false,
                injected: true,
                injectSuccess: true,
              };
              this.assignInjectObjProp(objTemp);
              /* 注入成功 刷新表格*/
              setTimeout(() => {
                this.visible = false;
                this.$emit('injectSuccess');
              }, 1000);
            })
            .catch((error) => {
              const objTemp = {
                injecting: false,
                injected: true,
                injectSuccess: false,
                errorMessage:
                  error.data.message || this.$t('device.unknownDislocation'),
              };
              this.assignInjectObjProp(objTemp);
            });
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.custom-icon {
  display: flex;
  align-items: center;
  .jia-zai-span {
    color: var(--warning-color);
    margin-left: 5px;
  }
  .inject-success {
    color: var(--primary-color);
  }
  .inject-error {
    color: var(--red-color);
  }
}
.jia-zai {
  animation-name: loading;
  animation-duration: 2s;
  animation-timing-function: linear;
  animation-iteration-count: infinite;
}
@keyframes loading {
  0% {
    transform: rotate(0);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
