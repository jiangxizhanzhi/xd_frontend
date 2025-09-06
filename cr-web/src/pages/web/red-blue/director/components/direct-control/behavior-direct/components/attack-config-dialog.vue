<template>
  <div>
    <cb-dialog :visible.sync="attackIsShow" append-to-body @close="handleClose">
      <!--头部-->
      <template slot="title">
        <div class="dialog-title">
          {{ $t('flowTypes.presetParamsList') }}
        </div>
      </template>
      <!-- 预设参数列表数据 -->
      <cb-search-table
        ref="param_tab"
        :cols="cols"
        :selector="selector"
        :selection.sync="selection"
        :hidePaginOnDemand="true"
        :searchBarBg="false"
        v-if="!showEditParam"
        :data-source="flowTableData"
      >
        <!-- 参数类型 -->
        <template v-slot:conf_type="scope">
          <span>{{ exchangeParamType(scope.data.conf_type) }}</span>
        </template>
        <!-- 编辑按钮 -->
        <template v-slot:operate="scope">
          <cb-button
            v-if="scope.data.conf_key !== 'ip'"
            type="text"
            @click="editParam(scope.data)"
            button-type="edit"
            mr
          ></cb-button>
        </template>
      </cb-search-table>
      <!-- 编辑的表单数据 -->
      <cb-form
        ref="paramForm"
        class="paramForm"
        :model.sync="currentParam"
        :rules="paramRules"
        :label-width="getI18Nn().locale == 'en-US' ? '180px' : '100px'"
        label-position="right"
        v-if="showEditParam"
      >
        <!-- 参数名字 -->
        <cb-form-item :label="$t('traffic.paramName')" prop="name">
          <cb-input
            v-model="currentParam.name"
            :disabled="is_edit_page"
          ></cb-input>
        </cb-form-item>
        <!-- 参数类型 -->
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
        <!-- 参数说明 -->
        <cb-form-item :label="$t('traffic.paraDesc')" prop="desc">
          <cb-input
            v-model.trim="currentParam.desc"
            type="textarea"
            :disabled="is_edit_page"
          />
        </cb-form-item>
        <!-- 默认值 -->
        <cb-form-item :label="$t('traffic.paraValue')" prop="value">
          <!-- 默认值,类型为bool的时候 -->
          <cb-select
            v-if="currentParam.type === 3"
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
      <!-- 底部按钮 -->
      <div slot="footer" class="dialog-footer">
        <!-- 外层表格按钮 -->
        <cb-button-group v-if="!showEditParam">
          <cb-button button-type="confirm" @click="confirmFn" mr> </cb-button>
          <cb-button button-type="cancel" @click="cancelFn"></cb-button>
        </cb-button-group>
        <!-- 编辑表单按钮 -->
        <cb-button-group v-else>
          <cb-button button-type="confirm" @click="saveParam" mr> </cb-button>
          <cb-button
            button-type="cancel"
            @click="showEditParam = false"
          ></cb-button>
        </cb-button-group>
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
import { configFlowApi } from '@/api/web/team-training';
export default {
  props: {
    // 接收是否展示新增任务弹框
    attackShow: {
      type: Boolean,
      default: false,
    },
    attackData: {
      type: Array,
      default() {
        return [];
      },
    },
    attack_id: {
      type: String,
      default: '',
    },
  },
  data() {
    var isCorrectParamType = (rule, value, callback) => {
      const types = Number(this.currentParam.type);
      let hashError = false;

      if (types === 2) {
        // 正则校验number类型  v-model.number修饰文本框输入过长会变成Infinity
        const numRexp = /[^\d]/g;
        if (numRexp.test(value)) {
          callback(new Error());
          hashError = true;
        }
      } else if (types === 3) {
        if (typeof value !== 'boolean') {
          callback(new Error());
          hashError = true;
        }
      } else if (types === 1) {
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
        types === this.$CONSTANT.ProbesNew.ParamType.NUMBER.value
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
      attackIsShow: this.attackShow,
      flow_task_conf: {},
      flowTableData: [],
      // params: {
      // },
      addDefault: {},
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
      // params: {},
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
      // 预设参数列表
      cols: [
        {
          label: this.$t('traffic.paramName'),
          prop: 'conf_key',
        },
        {
          label: this.$t('traffic.paramType'),
          // prop: 'conf_type',
          slot: 'conf_type',
        },
        {
          label: this.$t('traffic.paraDesc'),
          prop: 'conf_desc',
        },
        {
          label: this.$t('traffic.paraValue'),
          prop: 'conf_value',
        },
        {
          label: this.$t('common.operation'),
          slot: 'operate',
        },
      ],
    };
  },
  created() {
    this.getParamTypeOptions();
    this.flowTableData = this.attackData;
  },
  mounted() {},
  computed: {
    ...mapGetters(['language']),
  },

  methods: {
    //列表转化param_type
    exchangeParamType(conf_type) {
      switch (Number(conf_type)) {
        case 2: {
          return 'Number';
        }
        case 0: {
          return 'String';
        }
        case 3: {
          return 'Bool';
        }
        case 1: {
          return 'IP';
        }
        default: {
          return '';
        }
      }
    },
    // 点击关闭攻击流量配置弹窗
    handleClose() {
      this.$emit('closeAttackDialog', false);
    },
    // 预设参数列表点击确定
    confirmFn() {
      this.flow_task_conf = {
        attack_confs: this.flowTableData,
      };
      configFlowApi({
        flow_task_conf: this.flow_task_conf,
        task_id: this.attack_id,
      }).then((res) => {});
      this.$emit('closeAttackDialog', false);
    },
    // 预设参数列表点击编辑
    cancelFn() {
      this.handleClose();
    },
    getI18Nn() {
      return getI18N();
    },
    getParamTypeOptions() {
      const paramList = this.$CONSTANT.LIST.Traffic.ParamTypesNew;
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
      const boolType = this.$CONSTANT.ProbesNew.ParamType.BOOL.value;
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

    // 初始化列表数据
    tableData() {},
    saveParam() {
      // 校验
      const temp = JSON.parse(JSON.stringify(this.flowTableData)) || {};
      const key = this.currentParam.name; //修改的名称
      const value = [
        this.currentParam.type,
        this.currentParam.value,
        this.currentParam.desc,
      ];

      /// 重复参数校验
      const paramName = [];
      temp.forEach((item) => {
        paramName.push(item.conf_key);
      });
      if (this.oldParamName) {
        const index = paramName.indexOf(this.oldParamName);
        paramName.splice(index, 1);
      }
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
          // 保存当前编辑参数
          this.flowTableData = this.flowTableData.map((item) => {
            if (item.id === this.currentParam.id) {
              return {
                conf_key: this.currentParam.name,
                conf_value: this.currentParam.value,
                conf_type: this.currentParam.type,
                conf_desc: this.currentParam.desc,
                id: this.currentParam.id,
              };
            } else {
              return item;
            }
          });
          this.showEditParam = false;
        } else {
          return false;
        }
      });

      // this.$emit('saveParam', this.raw_params);
    },

    // 编辑参数
    editParam(data) {
      const key = data.conf_key;
      if (this.addDefault) {
        if (key === 'port') {
          this.is_edit_page = true;
        } else {
          this.is_edit_page = true;
        }
      }
      this.currentParam = {
        id: data.id,
        name: key,
        type: data.conf_type,
        value: data.conf_value,
        desc: data.conf_desc,
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

  watch: {
    attackData: {
      handler(val, oldVal) {
        this.flowTableData = val;
      },
      deep: true,
      immediate: true,
    },
    attackShow: {
      handler(val) {
        this.attackIsShow = val;
      },
    },
  },
};
</script>

<style scoped lang="scss"></style>
