<template>
  <div class="cb-upload-file">
    <cb-upload
      ref="uploads"
      v-if="!drag"
      :drag="drag"
      :action="action"
      :show-file-list="false"
      :limit="listNumber"
      :accept="acceptType"
      :multiple="multipleCustom"
      :on-exceed="handleExceed"
      :file-list="fileList"
      :before-upload="beforeUpload"
      :on-success="onSuccess"
      :disabled="disabled"
    >
      <cb-button
        slot="trigger"
        button-type="import"
        :hollow="true"
        :disabled="disabled"
        :loading="loading"
        v-if="limit !== 1 && !drag"
        style="height: 38px"
      ></cb-button>
      <cb-button-group slot="trigger" v-if="limit === 1 && !drag">
        <cb-button
          v-if="fileList.length == 0"
          button-type="import"
          hollow
          :loading="loading"
          :disabled="disabled"
          style="height: 38px"
        ></cb-button>
        <cb-button
          v-if="fileList.length == 1 && limit == 1"
          hollow
          :loading="loading"
          :disabled="disabled"
          icon="icon-genghuan"
          style="height: 38px"
          >{{ $t('g.reImport') }}
        </cb-button>
      </cb-button-group>

      <span class="cb-upload-file-slot">
        <!-- @slot 导入后面的插槽 -->
        <slot></slot>
      </span>
      <div class="cb-upload-file-content">
        <div slot="tip" class="prompt-msg" v-if="tipText === '' || !$slots.tip">
          <!-- @slot message 提示信息插槽 -->
          <slot name="tip">
            {{ tipText }}
          </slot>
        </div>
      </div>
      <cb-image-preview
        :url-list="imgList"
        :initial-index="imageIndex"
        v-model="isShow"
      ></cb-image-preview>
    </cb-upload>
    <cb-upload
      v-else
      :drag="drag"
      :action="action"
      :limit="listNumber"
      :accept="acceptType"
      :multiple="multipleCustom"
      :on-exceed="handleExceed"
      :file-list="fileList"
      :before-upload="beforeUpload"
      :on-success="onSuccess"
      :disabled="disabled"
      :show-file-list="false"
    >
      <slot></slot>
      <div slot="tip" class="prompt-msg" v-if="tipText === '' || !$slots.tip">
        <!-- @slot message 提示信息插槽 -->
        <slot name="tip">
          {{ tipText }}
        </slot>
      </div>
      <cb-image-preview
        :url-list="imgList"
        :initial-index="imageIndex"
        v-model="isShow"
      ></cb-image-preview>
    </cb-upload>

    <!-- 文件列表 -->
    <div class="file-list" v-if="showFileList && type === 'file'">
      <div
        v-for="(item, index) in fileList"
        :key="index"
        class="file-list-item"
      >
        <div class="file-list-item-name" :title="item.name">
          {{ item.name }}
        </div>
        <div class="file-list-item-action">
          <cb-button-group space="middle">
            <slot name="custom"></slot>
            <cb-button
              type="text"
              v-if="isPreview || item.isPreview"
              @click="previewItem(item, index)"
              >{{ $t('g.preview') }}
            </cb-button>
            <cb-button
              type="text"
              v-if="isDownload || item.isDownload"
              @click="downloadItem(item, index)"
              >{{ $t('g.download') }}
            </cb-button>
            <cb-button
              type="text"
              button-type="delete"
              :disabled="disabled"
              @click="deleteItem(item, index, true, $event)"
            ></cb-button>
          </cb-button-group>
        </div>
      </div>
    </div>
    <!-- 图片列表 -->
    <div class="img-list" v-if="showFileList && type === 'image'">
      <section :style="imageStyle" v-for="(item, index) in fileList" :key="'cb-upload-file-list-' + index">
        <cb-image :style="imageStyle" :src="item.url" :fit="fit"></cb-image>
        <div class="img-hover">
          <cb-button-group>
            <cb-button type="text" @click="previewItem(item, index)"
              >{{ $t('g.preview') }}
            </cb-button>
            <cb-button
              type="text"
              button-type="delete"
              :disabled="disabled"
              @click="deleteItem(item, index, true, $event)"
            ></cb-button>
          </cb-button-group>
        </div>
      </section>
    </div>
  </div>
</template>

<script>
/**
 * @displayName cb-upload-file 文件上传
 * @classify Form/表单
 */
import { Upload, Image } from 'element-ui'
import CbButton from '../../button'
import CbButtonGroup from '../../button-group'
import CbImagePreview from '../../image-preview'
export default {
  name: 'CbUploadFile',
  components:{
    'cb-upload':Upload,
    'cb-image':Image,
    CbButton,
    CbButtonGroup,
    CbImagePreview
  },
  props: {
    /**
     * 图片填充方式
     * @values fill / contain / cover / none / scale-down
     */
    fit: {
      type: String,
      default: 'cover',
    },
    /**
     * 是否显示列表
     */
    showFileList: {
      type: Boolean,
      default: true,
    },
    /**
     * 上传图片的接口地址
     *
     */
    url: {
      type: String,
      default: '',
    },
    /**
     * 上传组件类型
     * @values image/file
     */
    type: {
      type: String,
      default: 'image',
    },
    /**
     * 接受文件类型
     * @values '.jpg,.png,.jpeg,.gif,.svg'
     */
    accept: {
      type: String,
      default: '',
    },
    /**
     * 上传文件个数限制
     *
     */
    limit: {
      type: Number,
      default: 1,
    },
    /**
     * 上传文件地址
     *
     */
    action: {
      type: String,
      default: '',
    },
    /**
     * 文字提示信息
     */
    tipText: {
      type: String,
      default: '',
    },

    /**
     * 自定义上传
     */
    fetchPromise: {
      type: Function,
      default: null,
    },
    /**
     * 是否需要预览,也可以通过list配置
     */
    isPreview: {
      type: Boolean,
      default: false,
    },
    /**
     * 是否需要下载按钮,也可以通过list配置
     */
    isDownload: {
      type: Boolean,
      default: false,
    },
    /**
     * 上传文件最大的大小,单位B
     */
    fileSize: {
      type: Number | String,
      default: '',
    },
    /**
     * 绑定值
     */
    value: {
      type: Array,
      default() {
        return [];
      },
    },
    /**
     * 临时api
     */
    rename: {
      type: Boolean,
      default: true,
    },
    /**
     * 是否禁用
     */
    disabled: {
      type: Boolean,
      default: false,
    },
    /**
     * 预览图片大小
     */
    imageSize: {
      type: Array,
      default: () => [200, 110],
    },
    /**
     * 是否支持拖拽上传
     */
    drag: {
      type: Boolean,
      default: false,
    },
    /**
     * 控制按钮loading
     */
    loading: {
      type: Boolean,
      default: false,
    },
    /**
     * 控制是否支持多选文件
     */
    multiple: {
      type: null,
      default: null,
    },
  },
  data() {
    return {
      fileList: [],
      isShow: false,
      imageIndex: 0,
      acceptType: '',
    };
  },
  computed: {
    imgList() {
      const arr = [];
      this.fileList.forEach((element) => {
        arr.push(element.url);
      });
      return arr;
    },
    listNumber() {
      let num = 0;
      this.limit !== 1 ? (num = this.limit) : (num = 1000);
      return num;
    },
    multipleCustom() {
      if (this.multiple !==null) {
        return this.multiple
      } else {
        return this.limit > 1
      }
    },
    imageStyle() {
      let style = {};
      if (this.imageSize.length === 1) {
        style = {
          width: this.imageSize[0] + 'px',
          height: this.imageSize[0] + 'px',
        };
      } else {
        style = {
          width: this.imageSize[0] + 'px',
          height: this.imageSize[1] + 'px',
        };
      }
      return style;
    },
  },
  mounted() {
    this.fileList = this.value;
    this.acceptType = this.accept;
    if (this.type === 'image' && this.accept === '') {
      this.acceptType = '.jpg,.png,.jpeg,.gif,.svg';
    }
  },
  watch: {
    value(val) {
      this.fileList = val;
    },
  },
  methods: {
    /**
     * 清除已上传文件列表
     * this.$refs[xxx].clearFiles()调用
     * @event success
     * @type {object}
     */
    clearFiles() {
      this.fileList = [];
      this.$refs.uploads.clearFiles();
    },
    requestData(bool) {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          if (bool) {
            resolve();
          } else {
            reject();
          }
        }, 500);
      });
    },
    //文件上传之前的钩子
    beforeUpload(file) {
      // 文件上传的大小限制
      if (file.size === 0) {
        this.$message.warning(this.$t('g.notNullFile'));
        return false;
      }
      // 过大限制
      if (file.size > this.fileSize && this.fileSize != '') {
        this.$message.warning(
          this.$t('g.outofFileSizeLimit', {
            size: (this.fileSize / 1024 / 1024).toFixed(2),
          }),
        );
        return false;
      }
      // 文件上传类型再次校验
      const fileType =
        '.' + file.name.substring(file.name.lastIndexOf('.') + 1).toLowerCase();
      const typeArr = this.acceptType.split(',');
      const isType = typeArr.includes(fileType);
      if (!isType && this.acceptType !== '') {
        this.$message.error(this.$t('g.errorFileType'));
        return false;
      }
      if (this.limit === 1) {
        this.fileList.splice(0, this.fileList.length);
      }
      if (this.rename) {
        let reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (e) => {
          this.fileList.push({ name: file.name, url: e.target.result });
          this.$emit('input', this.fileList);
        };
      }
      if (this.fetchPromise) {
        this.fetchPromise(file);
      }
      return !this.fetchPromise;
    },
    //下载
    downloadItem(item, index) {
      /**
       * 下载方法
       * @event download
       * @property {object} 删除子项的信息
       */
      this.$emit('download', item);
    },
    //删除
    deleteItem(item, index, bool, done) {
      this.fileList.splice(index, 1);
      this.requestData(bool)
        .then(() => {
          done();
        })
        .catch(() => {
          // 不弹出成功提示
          done(false);
        });
      /**
       * 删除方法
       * @event delete
       * @property {object} 删除子项的信息
       */
      this.$emit('delete', item);
    },
    // 预览
    previewItem(item, index) {
      if (this.type === 'image') {
        this.imageIndex = index;
        this.isShow = true;
      }
      /**
       * 预览方法
       * @event preview
       * @property {object} 预览的详细信息
       */
      this.$emit('preview', item);
    },
    onSuccess(response, file, fileList) {
      //多文件上传
      if (Array.isArray(response)) {
        this.fileList = this.fileList.concat(response);
      } else {
        this.fileList.push(response);
      }
      /**
       * 上传成功的回调
       * @event input
       * @property {Array} 文件列表
       */
      this.$emit('input', this.fileList);
    },
    //文件超过限制
    handleExceed(files, fileList) {
      if (files.length + fileList.length > this.limit) {
        this.$message.warning(
          this.$t('g.outLimitCount', { limit: this.limit }),
        );
      }
    },
  },
};
</script>
