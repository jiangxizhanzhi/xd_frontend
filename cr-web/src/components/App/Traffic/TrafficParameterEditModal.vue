<template>
  <div class="params-all">
    <cb-form-item prop="params">
      <cb-search-table
        ref="param_tab"
        :cols="cols"
        :selector="selector"
        :selection.sync="selection"
        :data-source="tableData()"
        :hidePaginOnDemand="true"
        :searchBarBg="false"
      >
        <template v-slot:search>
          <cb-button hollow button-type="add" @click="addParam">
            {{ $t('traffic.addParam') }}
          </cb-button>

          <cb-button
            hollow
            button-type="delete"
            @click="removeParam(selection, $event)"
            :disabled="selection.length === 0"
          ></cb-button>
        </template>

        <template v-slot:operate="scope">
          <cb-button
            v-if="editAble(scope.data.name)"
            type="text"
            @click="editParam(scope.data.name)"
            button-type="edit"
            mr
          ></cb-button>
          <span v-else>-</span>
        </template>
      </cb-search-table>
    </cb-form-item>
    <cb-dialog
      :title="$t('traffic.editParams')"
      :append-to-body="true"
      :visible.sync="showEditParam"
      class="editParams"
      width="800px"
    >
      <cb-form
        ref="paramForm"
        class="paramForm"
        :model.sync="currentParam"
        :rules="paramRules"
        :label-width="getI18Nn().locale == 'en-US' ? '180px' : '100px'"
        label-position="right"
      >
        <cb-form-item :label="$t('traffic.paramName')" prop="name">
          <cb-input
            v-model="currentParam.name"
            :disabled="is_edit_page"
          ></cb-input>
        </cb-form-item>
        <cb-form-item :label="$t('traffic.paramType')" prop="type">
          <cb-select
            v-model="currentParam.type"
            :options="paramTypeOptions"
            :disabled="is_edit_page"
            @change="changeInput"
            :placeholder="$t('traffic.selectParamType')"
            style="width: 100%"
          >
          </cb-select>
        </cb-form-item>
        <cb-form-item :label="$t('traffic.paraDesc')" prop="desc">
          <cb-input
            v-model.trim="currentParam.desc"
            type="textarea"
            :disabled="is_edit_page"
          />
        </cb-form-item>
        <cb-form-item :label="$t('traffic.paraValue')" prop="value">
          <cb-select
            v-if="currentParam.type === 'Bool'"
            v-model="currentParam.value"
            style="width: 100%"
            :options="booleanValues"
          >
          </cb-select>
          <cb-input
            v-else-if="currentParam.type === 'Number'"
            v-model="currentParam.value"
          />
          <cb-input v-else v-model="currentParam.value" />
        </cb-form-item>
      </cb-form>
      <div slot="footer" class="dialog-footer">
        <cb-button button-type="confirm" @click="saveParam" mr> </cb-button>
        <cb-button button-type="cancel" @click="showEditParam = false">
        </cb-button>
      </div>
    </cb-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import _ from 'lodash';
import {
  isAlphabetsNumber,
  forbiddenSpaces,
  validateParametersLength,
} from '@/utils/rules-cms';
import { getI18n } from '@/lang/';
import { getI18N } from '@cyber/helper';

export default {
  components: {},
  props: {
    addDefault: {
      type: Boolean,
      default() {
        return true;
      },
    },
    param: {
      type: [Object, Array, String],
      default: () => {},
    },
  },
  data() {
    var isCorrectParamType = (rule, value, callback) => {
      const types = this.currentParam.type;
      let hashError = false;

      if (types === 'Number') {
        // 正则校验number类型  v-model.number修饰文本框输入过长会变成Infinity
        const numRexp = /[^\d]/g;
        if (numRexp.test(value)) {
          callback(new Error());
          hashError = true;
        }
      } else if (types === 'Bool') {
        if (typeof value !== 'boolean') {
          callback(new Error());
          hashError = true;
        }
      } else if (types === 'IP') {
        const ipRexp = /^(\d+)\.(\d+)\.(\d+)\.(\d+)$/;
        if (ipRexp.test(value)) {
          value.match(ipRexp);
          if (
            !(
              RegExp.$1 <= 255 &&
              RegExp.$1 > 0 &&
              RegExp.$2 <= 255 &&
              RegExp.$2 >= 0 &&
              RegExp.$3 <= 255 &&
              RegExp.$3 >= 0 &&
              RegExp.$4 <= 255 &&
              RegExp.$4 >= 0
            )
          ) {
            callback(new Error());
            hashError = true;
          }
        } else {
          callback(new Error());
          hashError = true;
        }
      }

      if (!hashError) callback();
    };
    // 校验数据长度
    var validateLength = (min, max) => {
      return (rule, value, callback) => {
        if (value.toString().length < min || value.toString().length > max) {
          callback(new Error());
        } else {
          callback();
        }
      };
    };
    var validatePort = (rule, value, callback) => {
      // 单独校验名字是port的参数,值的范围在1~65535
      const types = this.currentParam.type;
      const name = this.currentParam.name;
      if (
        name === 'port' &&
        types === this.$CONSTANT.Probe.ParamType.NUMBER.value
      ) {
        if (value < 1 || value > 65535) {
          callback(new Error());
        } else {
          callback();
        }
      } else {
        callback();
      }
    };
    return {
      paramTypeOptions: [],
      lastParamType: undefined,
      booleanValues: [
        {
          value: true,
          label: 'true',
        },
        {
          value: false,
          label: 'false',
        },
      ],
      showEditParam: false,
      is_edit_page: false,
      params: {},
      raw_params: '',
      currentParam: {
        name: '',
        type: '',
        value: '',
        desc: '',
      },
      oldParamName: '',
      paramRules: {
        name: [
          {
            required: true,
            message: getI18n().t('event.enterParams'),
            trigger: 'blur',
          },
          {
            validator: forbiddenSpaces,
            message: getI18n().t('user.containSpaces'),
            trigger: 'blur',
          },
          {
            validator: isAlphabetsNumber,
            message: getI18n().t('probeRules.paramElementLimit'),
            trigger: 'blur',
          },
          {
            min: 4,
            max: 40,
            message: getI18n().t('probeRules.paramLengthError'),
            trigger: 'blur',
          },
        ],
        value: [
          {
            required: true,
            message: getI18n().t('probeRules.pleaseInputParamDefault'),
            trigger: 'blur',
          },
          {
            validator: isCorrectParamType,
            message: getI18n().t('probeRules.paramDefaultError'),
            trigger: 'blur',
          },
          {
            validator: validateLength(1, 50),
            message: getI18n().t('probeRules.paramDefaultLengthError'),
            trigger: 'blur',
          },
          {
            validator: validatePort,
            message: getI18n().t('probeRules.paramPortValueError'),
            trigger: 'blur',
          },
        ],
        type: [
          {
            required: true,
            message: getI18n().t('event.enterParams'),
            trigger: 'blur',
          },
        ],
        desc: [
          {
            required: true,
            message: getI18n().t('probeRules.pleaseInputParamDes'),
            trigger: 'blur',
          },
          // 现校验1-2048
          { validator: validateParametersLength, trigger: 'blur' },
        ],
      },
      selector: {
        maxSelect: 0,
      },
      selection: [],
      cols: [
        {
          label: this.$t('traffic.paramName'),
          prop: 'name',
        },
        {
          label: this.$t('traffic.paramType'),
          prop: 'type',
        },
        {
          label: this.$t('traffic.paraDesc'),
          prop: 'desc',
        },
        {
          label: this.$t('traffic.paraValue'),
          prop: 'value',
        },
        {
          label: this.$t('common.operation'),
          slot: 'operate',
        },
      ],
    };
  },
  created() {
    this.params = this.param;
    this.getParamTypeOptions();
  },
  mounted() {},
  computed: {
    ...mapGetters(['language']),
  },
  watch: {},
  methods: {
    getI18Nn() {
      return getI18N();
    },
    getParamTypeOptions() {
      const paramList = this.$CONSTANT.LIST.Traffic.ParamType;
      const list = paramList.map((item) => {
        return {
          label: item.name.toString(),
          value: item.value,
        };
      });
      this.paramTypeOptions = [...list];
    },
    // type发生变化时触发
    changeInput() {
      const boolType = this.$CONSTANT.Probe.ParamType.BOOL.value;
      if (
        this.currentParam.type === boolType ||
        this.lastParamType === boolType
      ) {
        this.currentParam.value = '';
      }
      this.recordParamType();
    },
    recordParamType() {
      this.lastParamType = this.currentParam.type;
    },
    // ip字段的名称不可编辑
    editAble(key) {
      if (this.addDefault) {
        if (key === 'ip') {
          return false;
        } else {
          return true;
        }
      } else {
        return true;
      }
    },
    removeParam(data, done) {
      const temp = JSON.parse(JSON.stringify(this.params)) || {};
      /* const selected_rows = this.$refs.param_tab.selection */
      const selected_rows = this.selection;
      for (let i = 0; i < selected_rows.length; i++) {
        const key = selected_rows[i].name;
        if (this.addDefault) {
          if (!(key === 'ip' || key === 'port')) {
            delete temp[key];
          }
        } else {
          delete temp[key];
        }
      }

      this.params = temp;
      this.raw_params = JSON.stringify(temp);
      this.$emit('saveParam', this.raw_params);
      done();
      this.selection = [];
    },
    // 初始化列表数据
    tableData() {
      const data = [];
      // 添加默认参数

      if (this.addDefault) {
        const default_ip = ['IP', '', ''];
        default_ip[2] = this.$t('traffic.ipDesc');
        const default_port = ['Number', '80', ''];
        default_port[2] = this.$t('traffic.portDesc');
        // 默认ip被修改过
        if (!(this.params && 'ip' in this.params)) {
          const temp = JSON.parse(JSON.stringify(this.params)) || {};
          temp['ip'] = default_ip;
          this.params = temp;
          this.raw_params = JSON.stringify(temp);
          this.$emit('saveParam', this.raw_params);
        }
        // 默认port被修改过
        if (!(this.params && 'port' in this.params)) {
          const temp = JSON.parse(JSON.stringify(this.params)) || {};
          temp['port'] = default_port;
          this.params = temp;
          this.raw_params = JSON.stringify(temp);
          this.$emit('saveParam', this.raw_params);
        }
      }

      // 循环参数，将参数绑定到table数据中
      for (const param in this.params) {
        if (this.params.hasOwnProperty(param)) {
          const tmp = {};
          tmp['name'] = param;
          tmp['type'] = this.params[param][0];
          tmp['value'] = this.params[param][1];
          tmp['desc'] = this.params[param][2];
          tmp.checkbox = {
            disabled: param === 'ip' || param === 'port',
          };
          data.push(tmp);
        }
      }
      // 根据名称排序
      data.sort((a, b) => {
        return a.name > b.name ? 1 : -1;
      });
      return data;
    },

    saveParam() {
      // 保存当前编辑参数
      const temp = JSON.parse(JSON.stringify(this.params)) || {};
      const key = this.currentParam.name;
      const value = [
        this.currentParam.type,
        this.currentParam.value,
        this.currentParam.desc,
      ];

      // 重复参数校验
      const paramName = [];
      for (var item in temp) {
        paramName.push(item);
      }
      // 名称可不更改
      if (this.oldParamName) {
        const index = paramName.indexOf(this.oldParamName);
        paramName.splice(index, 1);
      }
      // 重复参数校验
      try {
        _.forEach(paramName, (param) => {
          if (param === key) {
            this.$message.error(this.$t('probeRules.duplicateParams'));
            throw new Error('error');
          }
        });
      } catch (e) {
        return false;
      }
      // 参数校验
      this.$refs.paramForm.validate((valid) => {
        if (valid) {
          delete temp[this.oldParamName];
          temp[key] = value;
          this.params = temp;
          this.raw_params = JSON.stringify(temp);
          this.showEditParam = false;
        } else {
          return false;
        }
      });

      this.$emit('saveParam', this.raw_params);
    },
    // 添加参数
    addParam() {
      this.oldParamName = '';
      this.is_edit_page = false;
      this.currentParam = {
        name: '',
        type: '',
        desc: '',
        value: '',
      };
      this.showEditParam = true;
    },
    // 编辑参数
    editParam(key) {
      if (this.addDefault) {
        if (key === 'port') {
          this.is_edit_page = true;
        } else {
          this.is_edit_page = false;
        }
      }
      this.currentParam = {
        name: key,
        type: this.params[key][0],
        value: this.params[key][1],
        desc: this.params[key][2],
      };
      //将"true""false"从字符串转为布尔类型，否则编辑布尔类型参数时校验容易报错
      if (this.currentParam.type == 'Bool') {
        this.currentParam.value = this.params[key][1]
          ? JSON.parse(this.params[key][1])
          : false;
      }
      // 记录更改前的name
      this.oldParamName = key;
      this.showEditParam = true;
    },
    removeBlank() {
      this.currentParam.desc = this.currentParam.desc.trim();
    },
  },
};
</script>

<style lang="scss"></style>
