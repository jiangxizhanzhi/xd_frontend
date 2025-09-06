<template>
  <div id="home">
    <!-- <cb-select
      v-model="selected"
      :options="mode_type"
      @change="changeMode"
    ></cb-select> -->
    <cb-upload-file
      type="file"
      accept=".sh,.py,.bat"
      v-model="list"
      @delete="deleteFile"
      :fetch-promise="uploadFunc"
      :file-size="fileSize"
    >
      <template v-slot:tip>
        <div class="tips">
          {{ $t('probes.codeFileFormat') }}
          {{ $t('traffic.codeDemoFile') }}
          <template v-for="item in demoFile">
            [
            <a :key="item.name" :href="item.file_url" :download="item.name">{{
              item.name
            }}</a
            >]
          </template>
          <cb-button type="text" v-if="file" @click="handleClick">{{
            $t('traffic.pcapFileDownload')
          }}</cb-button>
        </div>
      </template>
    </cb-upload-file>
    <codemirror
      ref="myCm"
      :value="code"
      :options="cmOptions"
      @input="onCmCodeChange"
    />
  </div>
</template>

<script>
import 'codemirror/mode/python/python.js';
import 'codemirror/mode/shell/shell.js';

import 'codemirror/theme/dracula.css';

import 'codemirror/addon/edit/matchbrackets.js';
import 'codemirror/addon/display/fullscreen.css';
import 'codemirror/addon/display/fullscreen.js';

import 'codemirror/addon/fold/foldgutter.css';
import 'codemirror/addon/fold/foldcode.js';
import 'codemirror/addon/fold/foldgutter.js';
import 'codemirror/addon/fold/comment-fold.js';
import 'codemirror/addon/fold/brace-fold.js';

import { ListenDomChange } from '@cyber/ui';
import { fetchDemoFile } from '@/api/traffic/traffic';

var python_mode = {
  name: 'python',
  version: 2,
  singleLineStringErrors: false,
};
var shell_mode = {
  name: 'shell',
  singleLineStringErrors: false,
};

export default {
  name: 'ScriptCode',
  components: {},
  props: {
    code: {
      type: String,
      default: '',
    },
    suffix: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      list: [],
      demoFile: [],
      fileSize: 1024 * 10,
      file: '',
      file_name: '',
      selected: this.suffix,
      codeLine: this.code,

      cmOptions: {
        mode: shell_mode,
        indentUnit: 4,
        theme: 'dracula',
        lineNumbers: true,
        matchBrackets: true,

        lineWrapping: false,
        foldGutter: true,
        gutters: ['CodeMirror-linenumbers', 'CodeMirror-foldgutter'],

        // readOnly: true,        //只读
        extraKeys: {
          // Tab键换成4个空格
          Tab: function (cm) {
            var spaces = Array(cm.getOption('indentUnit') + 1).join(' ');
            cm.replaceSelection(spaces);
          },
          F11: function (cm) {
            cm.setOption('fullScreen', !cm.getOption('fullScreen'));
          },
          Esc: function (cm) {
            if (cm.getOption('fullScreen')) cm.setOption('fullScreen', false);
          },
        },
      },
      // mode_type: [
      //   {
      //     label: 'python',
      //     value: 0,
      //   },
      //   {
      //     label: 'shell',
      //     value: 1,
      //   },
      //   {
      //     label: 'bat',
      //     value: 2,
      //   },
      // ],
      listen: new ListenDomChange({
        dom: document.body,
        callback: this.themeChange,
      }),
    };
  },
  computed: {
    codemirror() {
      return this.$refs.myCm.codemirror;
    },
  },
  watch: {
    file_name(val) {
      if (!_.isEmpty(val)) {
        if (val.indexOf('.sh') > 0) {
          this.selected = 0;
        } else if (val.indexOf('.py') > 0) {
          this.selected = 1;
        } else if (val.indexOf('.bat') > 0) {
          this.selected = 2;
        }
        this.$emit('update:suffix', this.selected);
      } else {
      }
    },
    suffix(newValue) {
      this.selected = newValue;
      this.cmOptions.mode = newValue === 1 ? python_mode : shell_mode;
    },
  },
  mounted() {
    // 获取demo文件数据
    const type = 2;
    fetchDemoFile(type).then((res) => {
      this.demoFile = res.data.data.demo_list;
    });
    this.listen.createListen();
  },
  methods: {
    onCmCodeChange(newCode) {
      this.$emit('update:code', newCode);
    },
    themeChange(theme) {
      // if (theme === 'theme-light') {
      //   this.cmOptions.theme = 'default';
      // } else if (theme === 'theme-dark') {
      //   this.cmOptions.theme = 'dracula';
      // }
    },

    isScript(file) {
      return /\.(py|sh|bat)$/.test(file.name);
    },
    deleteFile() {
      this.file = '';
      this.file_name = '';
      this.$emit('update:code', '');
    },
    uploadFunc(file) {
      if (!this.isScript(file)) {
        this.$message.error(this.$t('traffic.codeFileFormat'));
        return false;
      }
      this.file_name = file.name;
      if (file.name.indexOf('py') > 0) {
        this.selected = 0;
      } else if (file.name.indexOf('sh') > 0) {
        this.selected = 1;
      } else {
        this.selected = 2;
      }
      if (this.file) {
        this.file = '';
      }
      this.readerData(file);
    },
    readerData(rawFile) {
      this.loading = true;
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          const data = e.target.result;
          this.codeLine = data;
          this.$emit('update:code', this.codeLine);
          this.loading = false;
          resolve();
        };
        reader.readAsText(rawFile);
      });
    },
    handleClick() {
      this.$request.download(this.file);
    },
  },
  beforeDestroy() {
    this.listen.destroyListen();
  },
};
</script>

<style lang="scss">
#home {
  .CodeMirror-line {
    text-align: left;
    height: 26px;
    line-height: 32px;
  }
  .CodeMirror {
    height: 500px;
    width: 95%;
  }
  .vue-codemirror {
    margin-top: 20px;
  }
  .tips {
    font-size: 14px;
    color: var(--neutral5);
    > a {
      color: var(--primary-color);
    }
  }
}
</style>
<style lang="scss" scoped></style>
