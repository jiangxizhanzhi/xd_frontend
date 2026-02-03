<!--
* 流量发生
-->
<template>
  <div class="drawer-flow">
    <cb-dialog
      :visible="visible"
      height="520px"
      width="80%"
      @close="handleClose"
      append-to-body
    >
      <template slot="title">
        <span>{{ $tt('menu.dialog.generatedTrafficEdit') }}</span>
      </template>
      <div class="flow-container">
        <cb-table-transfer
          :query="query"
          :selectData="selectData"
          :shareMode="2"
          :treeData="[]"
          :props="config"
          :tree="false"
          :url="url[query.interactiveType]"
          :baseURL="'/api/mp'"
          :columns="columns"
          :queryName="{ tableSearchName: 'title' }"
          @onChange="handleSelectChange"
          @onSelectRowKeys="handleOnSelectRowKeys"
        >
          <template v-slot:leftSearch>
            <cb-select
              v-model="query.interactiveType"
              :options="options"
              :popper-append-to-body="false"
            >
            </cb-select>
            <cb-input
              v-model="query.search"
              :placeholder="$tt('global.placeInputName')"
            >
            </cb-input>
          </template>
          <template v-slot:category="scope">
            <span :title="categoryList(scope.data.category)">{{
              categoryList(scope.data.category)
            }}</span>
          </template>
          <template v-slot:rightSearch>
            <span class="subtitle">{{
              $tt('menu.dialog.selectedTraffic')
            }}</span>
          </template>
          <template v-slot:interactive_type="scope">
            {{ typeList(scope.data.interactive_type) }}
          </template>
          <template v-slot:op="scope">
            <cb-iconfont
              v-if="
                scope.data.interactive_type != 3 &&
                scope.data.interactive_type != 0
              "
              @click.native="operation(scope)"
              type="icon-shezhi"
              class="cursor"
              size="18"
            ></cb-iconfont>
            <span v-else>--</span>
          </template>
        </cb-table-transfer>
      </div>
      <template slot="footer">
        <div>
          <cb-button button-type="confirm" mr @click="handleSure"></cb-button>
          <cb-button button-type="cancel" mr @click="handleClose"></cb-button>
        </div>
      </template>
    </cb-dialog>
    <cb-dialog
      :visible.sync="operation_visible"
      width="70%"
      append-to-body
      @close="handleCloseParams"
    >
      <!--头部-->
      <template slot="title">
        <div class="dialog-title">
          {{ $tt('menu.dialog.presetParamsList') }}
        </div>
      </template>
      <cb-search-table
        ref="params"
        :cols="default_columns"
        :selection="true"
        row-key="id"
        :selection.sync="default_multipleSelection"
        :fetchPromise="fetchPromise"
        :row-selection="rowSelection"
        @onChange="paramsOnChange"
      >
        <template slot="search">
          <cb-button-group>
            <cb-button button-type="add" @click="addParams"></cb-button>
            <cb-button
              :disabled="!default_multipleSelection.length"
              button-type="delete"
              @click="deleteParams(false, $event)"
            ></cb-button>
          </cb-button-group>
        </template>
        <template v-slot:op="scope">
          <cb-button v-if="editable(scope.data.param_key)" type="text" @click="editParams(scope)"
          >{{ $tt('global.edit') }}
          </cb-button>
        </template>
        <template v-slot:param_type="scope">
          {{ CATEGORY_PARAM[scope.data.param_type] }}
        </template>
      </cb-search-table>
      <template slot="footer">
        <div>
          <cb-button button-type="confirm" mr @click="handleSureParams"></cb-button>
          <cb-button button-type="cancel" mr @click="handleCloseParams"></cb-button>
        </div>
      </template>
    </cb-dialog>
    <cb-dialog
      :visible.sync="params_visible"
      width="70%"
      append-to-body
      @close="handleParamsClose"
    >
      <!--头部-->
      <template slot="title">
        <div class="dialog-title">
          {{
            isEdit
              ? $tt('menu.dialog.editPresetParam')
              : $tt('menu.dialog.addPresetParam')
          }}
        </div>
      </template>
      <cb-form
        ref="fromRef"
        :model.sync="form"
        :rules="rules"
        width="100%"
        label-position="right"
        :label-width="lang === 'en-US' ? '140px' : '80px'"
      >
        <cb-form-item :label="$tt('menu.dialog.paramName')" prop="param_key">
          <cb-input
            v-model="form.param_key"
            :placeholder="$tt('global.placeInput')"
            type="text"
            :disabled="isEdit"
          ></cb-input>
        </cb-form-item>

        <cb-form-item :label="$tt('menu.dialog.paramType')" prop="param_type">
          <cb-select
            v-model="form.param_type"
            :options="params_options"
            :placeholder="$tt('global.placeSelect')"
            class="type_select"
            :disabled="isEdit"
          ></cb-select>
        </cb-form-item>

        <cb-form-item
          :label="$tt('menu.dialog.paramIntro')"
          prop="param_desc"
        >
          <cb-input
            v-model="form.param_desc"
            :placeholder="$tt('global.placeInput')"
            type="text"
            :disabled="isEdit"
          ></cb-input>
        </cb-form-item>

        <cb-form-item
          :label="$tt('menu.dialog.defaultValue')"
          prop="param_value"
          v-if="form.param_type != 3"
        >
          <cb-input
            v-model="form.param_value"
            :placeholder="$tt('global.placeInput')"
            type="text"
          ></cb-input>
        </cb-form-item>

        <cb-form-item
          :label="$tt('menu.dialog.defaultValue')"
          prop="param_value"
          v-if="form.param_type == 3"
        >
          <cb-select
            v-model="form.param_value"
            :options="params_options_default_val"
            :placeholder="$tt('global.placeInput')"
            class="collection-select"
          ></cb-select>
        </cb-form-item>
      </cb-form>
      <template slot="footer">
        <div class="form-button-group">
          <cb-button-group space="middle">
            <cb-button
              loading
              button-type="confirm"
              @click="submitForm($event)"
            ></cb-button>
            <cb-button button-type="cancel" @click="handleCancel"></cb-button>
          </cb-button-group>
        </div>
      </template>
    </cb-dialog>
  </div>
</template>

<script>
import { computed, inject } from '@vue/composition-api';
import t from '../../../../utils/i18n';
import { FLOW_CATEGORY, FLOW_TYPE } from '../components/constant/flow-occurs';
import _ from 'lodash';
import { getListByCollectionIds } from '../../../../api';
import sceneStore from "../../../../store/scene-store";
// 0 string,1 IP,2 number,3 bool
const CATEGORY_PARAM = {
  0: 'String',
  1: 'IP',
  2: 'Number',
  3: 'Bool',
  null: '--',
};
export default {
  name: 'DrawerFlow',
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    currentNode: {},
    /**
     * 节点信息
     * role、image_type、nodeId
     */
    nodeInfo: {
      type: Object,
      default: () => {},
    },
  },
  model: {
    prop: 'visible',
    event: 'update',
  },
  setup(props) {
    const lang = inject('lang');
    const cpFlowForm = props.currentNode.getData(); // 当前表格数据
    return {
      cpFlowForm,
      lang,
    };
  },
  data() {
    // 预设参数添加校验规则
    const checkParamValue = (rule, value, callback) => {
      const type = this.form.param_type;
      if (type === 2) {
        if (isNaN(value)) {
          callback(new Error(this.$tt('menu.dialog.validator.number')));
        } else {
          callback();
        }
      } else if (type === 3) {
        if (!['true', 'false'].includes(value)) {
          callback(new Error(this.$tt('menu.dialog.validator.bool')));
        } else {
          callback();
        }
      } else if (type === 1) {
        const ipRexp =
          /^((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.){3}(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])(?::(?:[0-9]|[1-9][0-9]{1,3}|[1-5][0-9]{4}|6[0-4][0-9]{3}|65[0-4][0-9]{2}|655[0-2][0-9]|6553[0-5]))?$/;
        if (!ipRexp.test(value.toString())) {
          callback(new Error(this.$tt('menu.dialog.validator.ip')));
        } else {
          callback();
        }
      }
      callback();
    };
    const checkParamKey = (rule, value, callback) => {
      const keyRexp = /^[_a-zA-Z0-9]+$/;
      if (value.toString().length > 255) {
        callback(
          new Error(
            this.$tt('menu.dialog.validator.name', { min: 1, max: 255 }),
          ),
        );
      }
      if (!keyRexp.test(value.toString())) {
        callback(new Error(this.$tt('menu.dialog.validator.paramKey')));
      } else {
        callback();
      }
    };
    return {
      CATEGORY_PARAM,
      selectData: [],
      query: { interactiveType: 1, search: '', search_fields: 'title' },
      tableData: [],
      leftSearchCategory: 1,
      rightSearchCategory: 2,
      options: [
        {
          label: this.$tt('menu.dialog.attackTraffic'),
          value: 1,
        },
        {
          label: this.$tt('menu.dialog.backgroundTraffic'),
          value: 0,
        },
        {
          label: this.$tt('menu.dialog.trafficCollection'),
          value: 3,
        },
      ],
      params_options_default_val: [
        { label: 'true', value: 'true' },
        { label: 'false', value: 'false' },
      ],
      config: {
        children: 'children',
        label: 'label',
      },
      columns: [
        { title: this.$tt('global.name'), prop: 'title' },
        { title: this.$tt('global.introduction'), prop: 'introduction' },
        { title: this.$tt('global.category'), slot: 'category' },
        {
          title: this.$tt('global.type'),
          slot: 'interactive_type',
          position: 'right',
        },
        { title: this.$tt('global.operation'), slot: 'op', position: 'right' },
      ],
      url: {
        0: '/flow/info/page',
        1: '/flow/info/page',
        3: '/flow/collection/page',
      },
      operation_visible: false,
      params_visible: false,
      params_options: [
        {
          label: 'String',
          value: 0,
        },
        {
          label: 'IP',
          value: 1,
        },
        {
          label: 'Number',
          value: 2,
        },
        {
          label: 'Bool',
          value: 3,
        },
      ],
      default_columns: [
        { title: this.$tt('menu.dialog.paramName'), prop: 'param_key' },
        { title: this.$tt('menu.dialog.paramType'), slot: 'param_type' },
        { title: this.$tt('menu.dialog.paramIntro'), prop: 'param_desc' },
        { title: this.$tt('menu.dialog.defaultValue'), prop: 'param_value' },
        { title: this.$tt('global.operation'), slot: 'op' },
      ],
      default_multipleSelection: [],
      operationIndex: null, // 保存点击操作按钮的序号
      operation_data: {}, // 保存点击操作按钮的数据
      form: {
        param_key: '',
        param_type: '',
        param_desc: '',
        param_value: '',
      },
      isEdit: false,
      rules: {
        param_key: [
          {
            required: true,
            message: this.$tt('global.placeInput'),
            trigger: ['blur', 'change'],
          },
          { validator: checkParamKey, trigger: ['blur', 'change'] },
        ],
        param_type: [
          {
            required: true,
            message: this.$tt('global.placeSelect'),
            trigger: ['blur', 'change'],
          },
        ],
        param_desc: [
          {
            required: true,
            message: this.$tt('global.placeInput'),
            trigger: ['blur', 'change'],
          },
          {
            min: 1,
            max: 255,
            message: this.$tt('menu.dialog.validator.descLength', {
              min: 1,
              max: 255,
            }),
            trigger: ['blur', 'change'],
          },
        ],
        param_value: [
          {
            required: true,
            message: this.$tt('global.placeInput'),
            trigger: ['blur', 'change'],
          },
          { validator: checkParamValue, trigger: ['blur', 'change'] },
        ],
      },
    };
  },
  computed: {
    rowSelection(record) {
      return {
        onChange: (selectedRowKeys, selectedRows) => {
          this.default_multipleSelection = _.cloneDeep(selectedRows);
        },
      };
    },
  },
  created() {
    if (!this.cpFlowForm.cpFlow?.elements) {
      return;
    }
    const flows = this.cpFlowForm.cpFlow?.elements?.hasOwnProperty(
      this.nodeInfo.id,
    )
      ? this.cpFlowForm.cpFlow.elements[this.nodeInfo.id] ?
        this.cpFlowForm.cpFlow.elements[this.nodeInfo.id].hasOwnProperty('flows') ?
          this.cpFlowForm.cpFlow.elements[this.nodeInfo.id].flows : [] : [] : [];
    if (flows && flows.length) {
      flows.forEach((flow) => {
        this.selectData.push({
          resource_id: flow.id,
          title: flow.name,
          category: flow.type,
          introduction: flow.desc,
          interactive_type: flow.interactive_type,
          script_param_models: flow.script_param_models,
        });
      });
    }
  },
  watch: {
    'form.param_type': {
      // 参数类型变动重新校验默认值字段
      handler(val) {
        if (this.form.param_value) {
          this.$refs['fromRef']?.validateField('param_value');
        }
      },
    },
  },
  methods: {
    $tt: t,
    // ip字段的名称不可编辑
    editable(key) {
      return key !== 'ip';
    },
    operation(data) {
      this.operation_visible = true;
      this.operation_data = data.data?.script_param_models?.map(param => {
        return {
          ...param,
          checkbox: {
            disabled: param.param_key === 'ip' || param.param_key === 'port',
          }
        }
      }) || [];
      this.operationIndex = this.selectData.findIndex(
        (item) => item.resource_id === data.data.resource_id,
      );
    },
    deleteParams(bool, done) {
      this.default_multipleSelection.forEach((item, index) => {
        const paramIndex = this.operation_data.findIndex(
          (param) => param.id === item.id,
        );
        if (paramIndex >= 0) {
          this.operation_data.splice(paramIndex, 1);
        }
        done();
      });
      this.default_multipleSelection = [];
    },
    addParams() {
      this.isEdit = false;
      this.form = {
        id: '',
        param_key: '',
        param_type: '',
        param_desc: '',
        param_value: '',
      };
      this.params_visible = true;
    },
    fetchPromise() {
      return new Promise((resolve) => {
        resolve({ data: { data: this.operation_data } });
      });
    },
    editParams(data) {
      this.isEdit = true;
      this.form = _.clone(data.data);
      this.params_visible = true;
    },
    handleParamsClose() {
      this.params_visible = false;
    },
    handleCancel() {
      this.params_visible = false;
    },
    submitForm(done) {
      this.$refs['fromRef'].validate((valid) => {
        if (valid) {
          // 新增参数
          if (!this.isEdit) {
            if (
              this.selectData.length &&
              this.selectData[this.operationIndex]?.script_param_models?.some(
                (item) => item.param_key === this.form.param_key,
              )
            ) {
              this.$message.error(this.$tt('menu.dialog.repeatParam'));
              done();
              return
            } else {
              this.form.id = `data-source-row-key--"${this.operation_data.length}`;
              this.operation_data.push(this.form);
            }
          } else {
            // 编辑参数
            this.operation_data.forEach((param, index) => {
              if (this.form.param_key === param.param_key) {
                this.operation_data.splice(index, 1, this.form);
              }
            });
          }
          this.params_visible = false;
        } else {
          done();
        }
      });
    },
    categoryList(category) {
      return FLOW_CATEGORY[category];
    },
    typeList(type) {
      return FLOW_TYPE[type];
    },
    /**
     * selectData改变
     */
    handleSelectChange(val) {
      this.selectData = val;
    },

    handleOnSelectRowKeys(val) {
      // 流量集合选中单独处理
      if (this.query.interactiveType == 3) {
        if (val && val.length) {
          let ids = val.map((item) => item.id);
          getListByCollectionIds(ids).then((res) => {
            let flows = _.get(res.data, 'data', []);
            flows.forEach((item) => {
              let selectDataIndex = this.selectData.findIndex(
                (data) => data.resource_id == item.resource_id,
              );
              if (selectDataIndex > 0 || selectDataIndex === 0) {
                this.selectData.splice(selectDataIndex, 1, item);
              } else {
                this.selectData.push(item);
              }
            });
          });
        }
      }
    },

    paramsOnChange(data) {
      this.default_multipleSelection = data;
    },

    handleSureParams(data) {
      this.selectData[this.operationIndex].script_param_models =
        this.operation_data;
      this.operation_visible = false;
    },

    handleCloseParams(data) {
      this.operation_visible = false;
    },

    /**
     * 取消
     */
    handleClose() {
      this.$emit('update', false);
    },

    /**
     * 确定
     */
    handleSure() {
      let _flows = [];
      // 过滤掉流量集合数据
      let saveData = this.selectData.filter(
        (item) => item.interactive_type != 3,
      );
      saveData?.forEach((item, index) => {
        _flows.push({
          desc: item.introduction,
          id: item.resource_id,
          name: item.title,
          status: '',
          status_text: '',
          type: item.category,
          interactive_type: item.interactive_type,
          script_param_models: item.script_param_models,
          category: item.category,
        });
      });
      this.cpFlowForm.cpFlow = {
        elements: {
          [this.nodeInfo.id]: {
            flows: _flows,
          },
        },
      };
      this.currentNode.setData(this.cpFlowForm);
      if (sceneStore.state.sceneStatus !== 'display') {
        // 节点配置页面保存
        this.$emit('update-node-data-edit', this.currentNode);
      }
      this.handleClose();
    },
    /**
     * 选择项切换
     */
    handleChange(val) {},
  },
};
</script>

<style lang="scss" scoped>
.flow-container {
  ::v-deep.cb-search-input {
    display: none;
  }
  ::v-deep.custom-page-left {
    width: 700px;
  }
  ::v-deep.custom-page-right {
    width: 900px;
  }
}

.subtitle {
  color: var(--primary-color);
}

.cb-select.type_select,
.cb-select.collection-select {
  width: 100% !important;
}

.cursor {
  cursor: pointer;
}
.flow-container {
  .cb-select {
    width: 100% !important;
    ::v-deep .el-select-dropdown .el-select-dropdown__wrap {
      margin-bottom: 0 !important;
    }
  }
}
</style>
