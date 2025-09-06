<template>
  <div
    ref="cbMarkdownRef"
    :class="['cb-markdown', type]"
    id="cb-markdown"
    @click="clickOther"
  >
    <Editor
      v-if="type === 'editor'"
      :value="markdownValue"
      @change="handleChange"
      :plugins="pluginsOptions"
      :mode="mode"
      :locale="langObj"
      :language="language"
      :sanitize="sanitize"
      :uploadImages="uploadImages"
    />
    <Viewer :value="markdownValue" :plugins="pluginsOptions" v-else />
  </div>
</template>

<script>
// import { Editor, Viewer } from '@bytemd/vue';
import Editor from './editor.vue';
import Viewer from './viewer.vue';
import highlight from '@bytemd/plugin-highlight';
import ZhHans from 'bytemd/locales/zh_Hans.json';
import EN from 'bytemd/locales/en.json';
import UploadFile from './../plugins/bytemd-plugin-upload-file/index.js';
import gfm from '@bytemd/plugin-gfm';
import gfmZh from '@bytemd/plugin-gfm/locales/zh_Hans.json';
import gfmEn from '@bytemd/plugin-gfm/locales/en.json';
import uploadEn from './../plugins/bytemd-plugin-upload-file/locales/en.json';
import uploadZh from './../plugins/bytemd-plugin-upload-file/locales/zh_Hans.json';

import { codeLang } from './../components/index.js';
import breaks from '@bytemd/plugin-breaks';
import UploadZip from './../plugins/bytemd-plugin-zip/index.js';
import uploadZipEn from './../plugins/bytemd-plugin-zip/locales/en.json';
import uploadZipZh from './../plugins/bytemd-plugin-zip/locales/zh_Hans.json';

import ExportFile from './../plugins/bytemd-plugin-export-file/index.js';
import exportFileEn from './../plugins/bytemd-plugin-export-file/locales/en.json';
import exportFileZh from './../plugins/bytemd-plugin-export-file/locales/zh_Hans.json';
import { getLanguage } from '@cyber/helper';
import { setFullscreen } from '../../../utils/bus.js';
/**
 * @displayName cb-markdown markdown编辑器
 * @classify Editor/编辑器
 */
export default {
  name: 'CbMarkdown',
  props: {
    /**
     * 编辑器高度
     */
    height: {
      type: Number,
      default: 400,
    },
    /**
     * 编辑器模式
     * @values auto,split,tab
     */
    mode: {
      type: String,
      default: 'auto',
    },
    /**
     * markdown 类型编辑器/展示
     * @values editor,viewer
     */
    type: {
      type: String,
      default: 'editor',
    },
    /**
     * 编辑器内容
     */
    value: {
      type: String,
      default: '',
    },
    /**
     * 编辑器插件选项
     */
    plugins: {
      type: Array,
      default: () => {
        return [];
      },
    },
    /**
     * sanitize
     */
    sanitize: {
      type: Function,
    },
    /**
     * 上传图片
     */
    uploadImages: {
      type: Function,
    },
    /**
     * 上传附件
     */
    uploadFile: {
      type: Function,
    },
    /**
     * 导入文件
     */
    uploadZip: {
      type: Function,
    },
    /**
     * 导出模板文件
     */
    exportFile: {
      type: Function,
    },
    /**
     * 国际化
     * @values en-US,zh-CN
     */
    language: {
      type: String,
      default: getLanguage() || 'zh-CN',
    },
  },
  data() {
    return {
      ZhHans,
      markdownValue: this.value,
      defaultOptions: [
        highlight(),
        codeLang(),
        gfm({ locale: this.language === 'zh-CN' ? gfmZh : gfmEn }),
        breaks(),
        this.uploadFile
          ? UploadFile({
              locale: this.language === 'zh-CN' ? uploadZh : uploadEn,
              uploadFile: this.uploadFile,
            })
          : '',
        this.uploadZip
          ? UploadZip({
              locale: this.language === 'zh-CN' ? uploadZipZh : uploadZipEn,
              uploadZip: this.uploadZip,
            })
          : '',
        this.exportFile
          ? ExportFile({
              locale: this.language === 'zh-CN' ? exportFileZh : exportFileEn,
              exportFile: this.exportFile,
            })
          : '',
      ],
      observer: null,
    };
  },
  computed: {
    langObj() {
      Object.assign(ZhHans, uploadZh, uploadZipZh, exportFileZh);
      Object.assign(EN, uploadEn, uploadZipEn, exportFileEn);
      const lang = {
        'en-US': EN,
        'zh-CN': ZhHans,
      };
      return lang[this.language];
    },
    pluginsOptions() {
      return this.defaultOptions.concat(this.plugins);
    },
  },
  watch: {
    value(val) {
      this.markdownValue = val;
    },
  },
  mounted() {
    const config = {
      attributes: true,
      childList: false,
      characterData: false,
      subtree: false,
      attributeFilter: ['class'],
      attributeOldValue: false,
      characterDataOldValue: false,
    };
    let that = this;
    // 当观察到变动时执行的回调函数
    const callback = function (e) {
      if (e[0] && e[0].target.classList.contains('bytemd-fullscreen')) {
        setFullscreen(true);
        that.$emit('set-fullscreen', true);
      } else {
        setFullscreen(false);
        that.$emit('set-fullscreen', false);
      }
    };
    // 创建一个观察器实例并传入回调函数
    this.observer = new MutationObserver(callback);
    // 选择需要观察变动的节点（获取到DOM）
    const targetNode = this.$refs.cbMarkdownRef.querySelector(
      '#cb-markdown>div>.bytemd',
    );
    // 观察器的配置（需要观察什么变动）
    // 以上述配置开始观察目标节点
    if (targetNode) {
      this.observer.observe(targetNode, config);
    }
  },
  methods: {
    clickOther(e) {
      if (e.target.nodeName === 'A') {
        window.open(e.target.href, '_blank');
        e.preventDefault();
      }
    },
    handleChange(val) {
      this.$emit('input', val);
      this.markdownValue = val;
    },
  },

  beforeDestroy() {
    this.observer.disconnect();
    // window.removeEventListener('click', this.clickOther);
  },
  components: { Editor, Viewer },
};
</script>
