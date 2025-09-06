<template>
  <div>
    <!-- 新增任务的弹框 -->
    <cb-dialog
      :visible="addTaskShow"
      @close="handleClose"
      height="600px"
      append-to-body
      width="1390px"
    >
      <!-- 头部 -->
      <template slot="title">
        <span>{{ $t('rbt.createTask') }}</span>
      </template>
      <div class="flow-container">
        <div class="left-content">
          <cb-input
            :placeholder="$t('rbt.enterHostName')"
            @change="searchHostFn(name)"
            v-model="name"
          ></cb-input>

          <div class="host-list">
            <div
              v-for="(list, index) in hostList"
              class="single-host"
              :key="list.id"
              @click="changeHostFn(list, index)"
              :class="index == currentKey ? 'active' : ''"
            >
              <div class="name-style">{{ list.name }}</div>
              <div class="ip-style">{{ list.ip }}</div>
            </div>
          </div>
        </div>
        <div class="right-content">
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
              <!-- 流量类型选择 -->
              <cb-select
                v-model="query.interactiveType"
                :options="options"
                :popper-append-to-body="false"
              >
              </cb-select>
              <!-- 输入名称 -->
              <cb-input
                v-model="query.search"
                :placeholder="$t('rbt.enterName')"
              >
              </cb-input>
            </template>
            <template v-slot:category="scope">
              <!-- 分类 -->
              <span :title="categoryList(scope.data.category)">{{
                categoryList(scope.data.category)
              }}</span>
            </template>
            <template v-slot:rightSearch>
              <!-- 已选择流量 -->
              <span class="subtitle"
                >{{ $t('rbt.selectedFlow') }}
                <!-- <span style="margin-left: 4px">{{
                  selectFlowNum
                }}</span> -->
              </span>
            </template>
            <!-- 右侧类型 -->
            <template v-slot:interactive_type="scope">
              {{ typeList(scope.data.interactive_type) }}
            </template>
            <!-- 配置 -->

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
      </div>
      <!-- 底部按钮 -->
      <template slot="footer">
        <div>
          <cb-button button-type="confirm" mr @click="handleSure"></cb-button>
          <cb-button button-type="cancel" mr @click="handleClose"></cb-button>
        </div>
      </template>
    </cb-dialog>

    <!-- 配置参数弹框 -->
    <cb-dialog
      :visible.sync="operation_visible"
      width="70%"
      append-to-body
      @close="handleCloseParamsFn"
    >
      <!--头部-->
      <template slot="title">
        <div class="dialog-title">
          {{ $t('rbt.presetParamsList') }}
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
        <template v-slot:op="scope">
          <cb-button
            v-if="editable(scope.data.param_key)"
            type="text"
            @click="editParams(scope)"
            >{{ $t('rbt.edit') }}
          </cb-button>
        </template>
        <template v-slot:param_type="scope">
          <!-- {{param_type}} -->
          {{ CATEGORY_PARAM[scope.data.param_type] }}
        </template>
      </cb-search-table>
      <template slot="footer">
        <div>
          <cb-button
            button-type="confirm"
            mr
            @click="handleSureParams"
          ></cb-button>
          <cb-button
            button-type="cancel"
            mr
            @click="handleCloseParams"
          ></cb-button>
        </div>
      </template>
    </cb-dialog>
    <!-- 参数编辑 -->
    <cb-dialog
      :visible.sync="params_visible"
      width="70%"
      append-to-body
      @close="handleParamsClose"
    >
      <!--头部-->
      <template slot="title">
        <div class="dialog-title">
          {{ isEdit ? $t('rbt.editParam') : $t('rbt.addParam') }}
        </div>
      </template>
      <cb-form
        ref="fromRef"
        :model.sync="form"
        :rules="rules"
        width="100%"
        label-position="right"
        label-width="140px"
      >
        <!-- :label-width="lang === 'en-US' ? '140px' : '80px'" -->
        <cb-form-item :label="$t('rbt.paramName')" prop="param_key">
          <cb-input
            v-model="form.param_key"
            :placeholder="$t('rbt.inputRequire')"
            type="text"
            :disabled="isEdit"
          ></cb-input>
        </cb-form-item>

        <cb-form-item :label="$t('rbt.paramType')" prop="param_type">
          <cb-select
            v-model="form.param_type"
            :options="params_options"
            :placeholder="$t('rbt.inputSelect')"
            class="type_select"
            :disabled="isEdit"
          ></cb-select>
        </cb-form-item>

        <cb-form-item :label="$t('rbt.paramDesc')" prop="param_desc">
          <cb-input
            v-model="form.param_desc"
            :placeholder="$t('rbt.inputRequire')"
            type="text"
            :disabled="isEdit"
          ></cb-input>
        </cb-form-item>

        <cb-form-item
          :label="$t('rbt.paramDefault')"
          prop="param_value"
          v-if="form.param_type != 3"
        >
          <cb-input
            v-model="form.param_value"
            :placeholder="$t('rbt.inputRequire')"
            type="text"
          ></cb-input>
        </cb-form-item>

        <cb-form-item
          :label="$t('rbt.paramDefault')"
          prop="param_value"
          v-if="form.param_type == 3"
        >
          <cb-select
            v-model="form.param_value"
            :options="params_options_default_val"
            :placeholder="$t('rbt.inputRequire')"
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
import { FLOW_CATEGORY, FLOW_TYPE } from './flow-type.js';
import {
  getMainInfoListApi,
  addTaskFlowApi,
  getListByCollectionIdsApi,
} from '@/api/web/team-training';
const CATEGORY_PARAM = {
  0: 'String',
  1: 'IP',
  2: 'Number',
  3: 'Bool',
  null: '--',
};
export default {
  props: {
    // 接收是否展示新增任务弹框
    addTaskShow: {
      type: Boolean,
      default: false,
    },

    // 接收场景启动场景实例id
    controlSceneId: {
      type: String,
      default: '',
    },
  },
  data() {
    // 预设参数添加校验规则
    const checkParamValue = (rule, value, callback) => {
      const type = this.form.param_type;
      if (type === 2) {
        if (isNaN(value)) {
          callback(new Error(this.$t('rbt.numberError')));
        } else {
          callback();
        }
      } else if (type === 3) {
        if (!['true', 'false'].includes(value)) {
          callback(new Error(this.$t('rbt.boolError')));
        } else {
          callback();
        }
      } else if (type === 1) {
        const ipRexp =
          /^((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.){3}(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])(?::(?:[0-9]|[1-9][0-9]{1,3}|[1-5][0-9]{4}|6[0-4][0-9]{3}|65[0-4][0-9]{2}|655[0-2][0-9]|6553[0-5]))?$/;
        if (!ipRexp.test(value.toString())) {
          callback(new Error(this.$t('rbt.ipError')));
        } else {
          callback();
        }
      }
      callback();
    };
    const checkParamKey = (rule, value, callback) => {
      const keyRexp = /^[_a-zA-Z0-9]+$/;
      if (value.toString().length > 255) {
        callback(new Error(this.$t('rbt.nameError', { min: 1, max: 255 })));
      }
      if (!keyRexp.test(value.toString())) {
        callback(
          new Error(this.$t('参数名称仅由大小写字母、数字、下划线组成')),
        );
      } else {
        callback();
      }
    };
    return {
      params_visible: false,
      CATEGORY_PARAM,
      name: '',
      flow_ids: [],
      details: [],
      nodeId: '',
      currentKey: 0,
      selectHostData: [],
      hostList: [],
      selectData: [],

      query: { interactiveType: 1, search: '', search_fields: 'title' },
      options: [
        {
          label: this.$t('rbt.dynamicTraffic'),
          value: 1,
        },
        {
          label: this.$t('rbt.staticTraffic'),
          value: 0,
        },
        {
          label: this.$t('rbt.trafficScheme'),
          value: 3,
        },
      ],
      params_options_default_val: [
        { label: 'true', value: 'true' },
        { label: 'false', value: 'false' },
      ],

      columns: [
        { title: this.$t('rbt.name'), prop: 'title' },
        { title: this.$t('rbt.desc'), prop: 'introduction', position: 'left' },
        { title: this.$t('rbt.type'), slot: 'category', position: 'left' },
        // { title: '分类', slot: 'interactive_type', position: 'left' },
        {
          title: this.$t('rbt.type'),
          slot: 'interactive_type',
          position: 'right',
        },
        { title: this.$t('rbt.disposition'), slot: 'op', position: 'right' },
      ],
      url: {
        0: '/flow/info/page',
        1: '/flow/info/page',
        3: '/flow/collection/page',
      },
      operation_visible: false,
      default_columns: [
        { title: this.$t('rbt.paramName'), prop: 'param_key' },
        { title: this.$t('rbt.paramType'), slot: 'param_type' },
        { title: this.$t('rbt.paramDesc'), prop: 'param_desc' },
        { title: this.$t('rbt.paramDefault'), prop: 'param_value' },
        { title: this.$t('rbt.operate'), slot: 'op' },
      ],
      default_multipleSelection: [],
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
            message: this.$t('rbt.inputRequire'),
            trigger: ['blur', 'change'],
          },
          { validator: checkParamKey, trigger: ['blur', 'change'] },
        ],
        param_type: [
          {
            required: true,
            message: this.$t('rbt.inputSelect'),
            trigger: ['blur', 'change'],
          },
        ],
        param_desc: [
          {
            required: true,
            message: this.$t('rbt.inputRequire'),
            trigger: ['blur', 'change'],
          },
          {
            min: 1,
            max: 255,
            message: this.$t('rbt.nameError', {
              min: 1,
              max: 255,
            }),
            trigger: ['blur', 'change'],
          },
        ],
        param_value: [
          {
            required: true,
            message: this.$t('rbt.inputRequire'),
            trigger: ['blur', 'change'],
          },
          { validator: checkParamValue, trigger: ['blur', 'change'] },
        ],
      },
      config: {
        children: 'children',
        label: 'label',
      },
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
    };
  },
  created() {},
  mounted() {
    if (this.controlSceneId) {
      this.getMainInfo(this.sceneId, name);
    }
  },
  computed: {
    rowSelection(record) {
      return {
        onChange: (selectedRowKeys, selectedRows) => {
          this.default_multipleSelection = _.cloneDeep(selectedRows);
        },
      };
    },
    // 新增任务已选择流量数量
    selectFlowNum() {
      return (
        (this.selectHostData[0] && this.selectHostData[0]?.data?.length) || 0
      );
    },
  },
  methods: {
    handleParamsClose() {
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
              return;
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
    handleCancel() {
      this.params_visible = false;
    },
    // ip字段的名称不可编辑
    editable(key) {
      return key !== 'ip';
    },
    handleCloseParams(data) {
      this.operation_visible = false;
    },
    handleSureParams(data) {
      this.selectData[this.operationIndex].script_param_models =
        this.operation_data;

      //处理selectHostData数据
      // console.log(this.selectHostData, 'this.selectHostData');
      this.selectHostData[this.currentKey].data[
        this.operationIndex
      ].script_param_models = this.operation_data;
      this.operation_visible = false;
    },
    handleCloseParamsFn(data) {
      this.operation_visible = false;
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
    paramsOnChange(data) {
      this.default_multipleSelection = data;
    },
    // 点击配置

    operation(data) {
      this.operation_visible = true;
      this.operation_data =
        data.data?.script_param_models?.map((param) => {
          return {
            ...param,
            checkbox: {
              disabled: param.param_key === 'ip' || param.param_key === 'port',
            },
          };
        }) || [];
      this.operationIndex = this.selectData.findIndex(
        (item) => item.resource_id === data.data.resource_id,
      );
    },

    searchHostFn(name) {
      this.getMainInfo(this.sceneId, name);
    },
    // 获取左侧主机列表
    getMainInfo(id, name) {
      getMainInfoListApi(this.controlSceneId, name).then((res) => {
        const list = _.get(res, 'data.data', []) || [];
        if (list.length) {
          const hostList = list.map((item) => {
            return {
              id: item.id,
              name: item.name,
              ip: item.ports.length > 0 ? item.ports[0].ip : ' ',
            };
          });
          this.hostList = hostList;
          this.selectHostData = hostList;
        } else {
          this.hostList = [];
        }
      });
    },

    // 点击选择左侧主机
    changeHostFn(list, index) {
      this.currentKey = index;
      this.selectData = this.selectHostData[index].data;
    },
    // 左侧类型
    categoryList(category) {
      return FLOW_CATEGORY[category];
    },
    // 右侧分类
    typeList(type) {
      return FLOW_TYPE[type];
    },
    // 点击关闭弹窗
    handleClose() {
      this.currentKey = 0;
      this.selectHostData = [];
      this.query = {
        interactiveType: 1,
        search: '',
        search_fields: 'title',
      };
      this.selectData = [];
      this.$emit('closeTaskDialog', false);
    },
    // 确定
    handleSure() {
      // console.log('this.selectHostData---', this.selectHostData);
      let params = {
        id: this.controlSceneId,
        details: this.selectHostData.map((item) => {
          return {
            node_id: item.id,
            flow_infos:
              Array.isArray(item.data) && item.data.length > 0
                ? item.data.map((ele) => {
                    return {
                      flow_id: ele.resource_id,
                      attack_confs:
                        Array.isArray(ele.script_param_models) &&
                        ele.script_param_models.length > 0
                          ? ele.script_param_models.map((j) => {
                              return {
                                conf_desc: j.param_desc,
                                conf_key: j.param_key,
                                conf_type: j.param_type,
                                conf_value: j.param_value,
                              };
                            })
                          : [],
                    };
                  })
                : [],
          };
        }),
      };
      addTaskFlowApi({ ...params })
        .then((res) => {
          // 新增任务成功
          this.handleClose();
          this.$emit('upTable', true);
        })
        .catch((error) => {
          this.handleClose();
        });
    },
    handleSelectChange(val) {
      this.selectData = val;
      this.selectHostData = this.selectHostData.map((item, index) => {
        if (this.currentKey === index) {
          return {
            ...item,
            data: val,
          };
        } else {
          return {
            ...item,
          };
        }
      });
    },

    handleOnSelectRowKeys(val) {
      this.selectData = val;
      this.selectHostData = this.selectHostData.map((item, index) => {
        if (this.currentKey === index) {
          return {
            ...item,
            data: val,
          };
        } else {
          return {
            ...item,
          };
        }
      });
      // 流量集合选中单独处理
      if (this.query.interactiveType == 3) {
        if (val && val.length) {
          let ids = val.map((item) => item.id);
          getListByCollectionIdsApi(ids).then((res) => {
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
  },
  watch: {},
};
</script>

<style scoped lang="scss">
.flow-container {
  ::v-deep.cb-search-input {
    display: none;
  }
  display: flex;
  .active {
    color: var(--primary-color);
  }
  .left-content {
    width: 200px;
    border-right: 1px solid var(--neutral1);
    padding-top: 18px;
    padding-right: 6px;
    .host-list {
      margin-top: 12px;
    }
    .single-host {
      min-height: 60px;

      padding: 8px 12px;
      .name-style {
        font-size: 14px;
      }
      .ip-style {
        margin-top: 12px;
        font-size: 12px;
      }
      &:hover {
        background: var(--primary-color-2);
        cursor: pointer;
      }
    }
  }
  ::v-deep .right-content {
    width: calc(100% - 200px);
    .custom {
      .custom-page-right {
        .select {
          .cb-search-table {
            margin-top: 28px !important;
          }
        }
      }
    }
  }
}
</style>
