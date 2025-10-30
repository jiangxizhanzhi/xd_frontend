<template>
  <div id="home">
    <cb-select
      v-model="selected"
      :options="mode_type1"
      @change="changeMode"
    ></cb-select>
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
    disable: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      cmOptions: {
        mode: python_mode,
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
      mode_type: ['python', 'shell'],
      mode_type1: [
        {
          label: 'python',
          value: 0,
        },
        {
          label: 'shell',
          value: 1,
        },
      ],
      selected: this.suffix,
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
    suffix(newValue) {
      // console.log(newValue);
      this.selected = newValue;
      this.cmOptions.mode = newValue === 0 ? python_mode : shell_mode;
    },
  },
  mounted() {
    this.listen.createListen();
  },
  methods: {
    onCmCodeChange(newCode) {
      this.$emit('update:code', newCode);
    },
    changeMode() {
      this.cmOptions.mode = this.selected === 0 ? python_mode : shell_mode;
      this.$emit('update:suffix', this.selected);
    },
    themeChange(theme) {
      if (theme === 'theme-light') {
        this.cmOptions = 'default';
      } else if (theme === 'theme-dark') {
        this.cmOptions = 'dracula';
      }
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
}
</style>
<style lang="scss" scoped>
// #home ::v-deep .CodeMirror {
//   background: var(--bg-color-fifth) !important;
// }
// #home ::v-deep .cm-s-dracula .CodeMirror-gutters {
//   background: var(--bg-color-first) !important;
// }
</style>
