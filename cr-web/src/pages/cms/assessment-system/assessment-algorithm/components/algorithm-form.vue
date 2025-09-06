<template>
  <cb-inner-page :background="false">
    <div class="box-card">
      <cb-form
        class="base-form"
        ref="formRef"
        :label-width="getI18Nn().locale == 'en-US' ? '150px' : '100px'"
        :model.sync="model"
        :rules="rules"
        :url="url"
        :id="id && { resource_id: id }"
        baseURL="/api/ojj"
        json
        :method="method"
      >
        <div class="info-area">
          <div class="title">{{ $t('assessment.basicInformation') }}</div>
          <!-- 算法名称-->
          <cb-form-item
            :label="$t('assessment.algorithmName') + ':'"
            prop="name"
          >
            <cb-input
              v-model="model.name"
              :placeholder="$t('assessment.searchName')"
            />
          </cb-form-item>
          <!-- 算法描述 -->
          <cb-form-item
            :label="$t('assessment.algorithmDesc') + ':'"
            prop="description"
          >
            <cb-input
              v-model="model.description"
              type="textarea"
              :placeholder="$t('assessment.searchDesc')"
            />
          </cb-form-item>
          <!-- 算法类型 -->
          <cb-form-item
            :label="$t('assessment.algorithmTYpe') + ':'"
            prop="type"
            class="radio-style"
          >
            <cb-radio-group v-model="model.type">
              <cb-radio
                v-for="option in options"
                :key="option.code"
                :label="option.code"
                @change="changeFn"
                >{{ option.name }}</cb-radio
              >
            </cb-radio-group>
          </cb-form-item>
        </div>
        <div class="info-area">
          <!-- 代码 -->
          <div class="title">{{ $t('assessment.code') }}</div>
          <!-- 脚本语言 -->
          <cb-form-item
            :label="$t('assessment.scriptLanguage') + ':'"
            prop="algorithm_language"
          >
            <cb-radio
              :label="0"
              v-model="model.algorithm_language"
              style="position: relative; top: 5px"
              >python</cb-radio
            >
          </cb-form-item>
          <!-- 脚本代码 -->
          <cb-form-item :label="$t('assessment.scriptCode') + ':'" prop="code">
            <script-code :code.sync="model.code" :disable="disable" />
          </cb-form-item>
        </div>
        <div class="info-area">
          <div class="title">{{ $t('assessment.parameterList') }}</div>

          <!-- 可配置参数列表 -->
          <cb-form-item>
            <cb-search-table
              ref="param_tab"
              :cols="cols"
              :selector="selector"
              :selection.sync="selection"
              :hidePaginOnDemand="true"
              :data-source="model.params"
              :searchBarBg="false"
            >
              <!-- :key="param_name" -->
              <template v-slot:search>
                <!-- 新增参数 -->
                <cb-button hollow button-type="add" @click="addParams">
                  {{ $t('assessment.addParam') }}
                </cb-button>
                <!-- 删除 -->
                <cb-button
                  hollow
                  button-type="delete"
                  @click="removeParam(selection, $event)"
                  :disabled="selection.length === 0"
                ></cb-button>
              </template>

              <template v-slot:param_type="scope">
                <span>{{ exchangeParamType(scope.data.param_type) }}</span>
              </template>
              <!-- 编辑 -->
              <template v-slot:operate="scope">
                <cb-button
                  type="text"
                  @click="editParam(scope.data)"
                  button-type="edit"
                  mr
                ></cb-button>
              </template>
            </cb-search-table>
          </cb-form-item>
        </div>

        <div slot="fixedBottom">
          <cb-button-group space="middle">
            <cb-button button-type="confirm" @click="submitForm"></cb-button>

            <cb-button
              button-type="cancel"
              @click="resetForm"
              v-if="!this.id"
            ></cb-button>
            <cb-button
              button-type="cancel"
              @click="cancelForm"
              v-else
            ></cb-button>
          </cb-button-group>
        </div>
      </cb-form>

      <cb-dialog
        v-if="addParamsDialog"
        :title="$t('assessment.editParams')"
        :visible.sync="addParamsDialog"
        class="elc-dialog add-params-dialog"
        @close="resetDialogForm()"
        width="600px"
      >
        <cb-form
          ref="addParamsForm"
          :model="dialogForm"
          :rules="dialogFormRules"
          class="demo-ruleForm save-record-form"
          :label-width="getI18Nn().locale == 'en-US' ? '115px' : '100px'"
        >
          <!-- 参数名称 -->
          <cb-form-item :label="$t('assessment.name') + ':'" prop="param_name">
            <cb-input v-model="dialogForm.param_name" class="elc-input" />
          </cb-form-item>
          <!-- 参数类型 -->
          <cb-form-item :label="$t('assessment.type') + ':'" prop="param_type">
            <cb-radio-group
              v-model="dialogForm.param_type"
              @change="handleChangeRadio"
            >
              <!-- Number:0,String:1,Bool:2,IP:3 -->
              <cb-radio
                v-for="option in parameterOptions"
                :key="option.code"
                :label="option.code"
                >{{ option.name }}</cb-radio
              >
            </cb-radio-group>
          </cb-form-item>
          <!-- 默认值 -->
          <cb-form-item
            :label="$t('assessment.defaultValue') + ':'"
            prop="default_value"
          >
            <cb-radio-group
              v-if="dialogForm.param_type === '2'"
              v-model="dialogForm.default_value"
              class="elc-radio-label"
            >
              <cb-radio :label="true.toString()">true</cb-radio>
              <cb-radio :label="false.toString()">false</cb-radio>
            </cb-radio-group>
            <cb-input
              v-else-if="dialogForm.param_type === '0'"
              v-model="dialogForm.default_value"
              class="elc-input"
            />
            <cb-input
              v-else
              v-model="dialogForm.default_value"
              class="elc-input"
            />
          </cb-form-item>
          <cb-form-item :label="$t('assessment.description') + ':'" prop="desc">
            <cb-input
              v-model="dialogForm.desc"
              class="elc-input"
              type="textarea"
            />
          </cb-form-item>
        </cb-form>
        <div slot="footer" class="dialog-footer">
          <cb-button-group space="middle">
            <cb-button
              button-type="confirm"
              round
              class="elc-dialog-btn-ensure common-btn"
              @click="addParamsAction()"
            ></cb-button>
            <cb-button
              button-type="cancel"
              round
              class="elc-dialog-btn-ensure common-btn"
              @click="cancelParamsAction()"
            ></cb-button>
          </cb-button-group>
        </div>
      </cb-dialog>
    </div>
  </cb-inner-page>
</template>

<script>
//代码
import ScriptCode from './script-code';
import { validateAssessName, validateDescription } from '@/utils/rules-cms';
import Utils from '@/utils/util';
import _ from 'lodash';
import '@/lang/all-lang/index';
import { getI18N } from '@cyber/helper';
const algorithmTemplate = {
  // 评分
  Format: {
    value:
      'def solution(data, other_arguments) -> int:\n' +
      '    """\n' +
      '    评分算法模板\n' +
      '    :param data: {\n' +
      '         "baseTime": #{时间戳}: ms,\n' +
      '         "data": [\n' +
      '           {\n' +
      '                 "t": #{baseTime偏移量 ms}: int,\n' +
      '                 "v": #{格式化算法返回值}: str,\n' +
      '                 "m": #{是否被匹配, 0|1}: int\n' +
      '           },\n' +
      '          { }...\n' +
      '        ]\n' +
      '   }\n' +
      '   :param other_arguments: List[int, str, bool], 可配置参数列表, 长度、索引一致\n' +
      '   :return: 评分结果, 0~100\n' +
      '    """\n',
  },
  // 匹配算法
  Check: {
    value:
      'from typing import List\n' +
      'def solution(data, other_arguments) -> List[int]:\n' +
      '    """\n' +
      '    模型匹配算法模板\n' +
      '    :param data: {\n' +
      '         "baseTime": #{时间戳 ms}: int,\n' +
      '         "data": [\n' +
      '           {\n' +
      '                 "t": #{baseTime偏移量 ms}: int,\n' +
      '                 "v": #{格式化算法返回值}: str\n' +
      '           },\n' +
      '           { }...\n' +
      '       ]\n' +
      '    }\n' +
      '    :param other_arguments: List[int, str, bool], 可配置参数列表, 长度、索引一致\n' +
      '    :return: 匹配结果. 为[0, 1, 1, ...], 0-未匹配, 1-匹配. 长度、索引应与data["data"]中元素一致\n' +
      '    """\n',
  },
  // 格式化
  Score: {
    value:
      'def solution(data: str, other_arguments) -> str:\n' +
      '    """\n' +
      '    格式化算法模板\n' +
      '    :param data: 探针采集数据, jsonString\n' +
      '    :param other_arguments: List[int, str, bool], 可配置参数列表, 长度、索引一致\n' +
      '    :return: 格式化结果字符串\n' +
      '    """\n',
  },
  // 聚合
  Group: {
    value:
      'from typing import List\n' +
      'def solution(data: List[int], other_arguments) -> int:\n' +
      '    """\n' +
      '    聚合算法模板\n' +
      '    :param data: 包含元素均为0~100 int\n' +
      '    :param other_arguments: List[int, str, bool], 可配置参数列表, 长度、索引一致\n' +
      '    :return: 聚合算法结果, 0~100\n' +
      '    """\n',
  },
};

export default {
  name: 'AlgorithmDetail',
  props: {
    id: {
      type: String,
      default: '',
    },
  },
  components: {
    ScriptCode,
  },
  data() {
    //default_value默认值校验
    var isCorrectParamType = (rule, value, callback) => {
      const types = this.dialogForm.param_type;
      let hashError = false;
      // Number
      if (types === '0') {
        if (isNaN(value)) {
          callback(new Error());
          hashError = true;
        }
      } else if (types === '2') {
        // 布尔
        if (typeof value !== 'string') {
          callback(new Error());
          hashError = true;
        }
      } else if (types === '3') {
        //Ip
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
    // 校验数据长度1-255
    const validateLength = (rule, value, callback) => {
      if (value) {
        const len = Utils.getByteDescLen(value);
        if (len < 1 || len > 255) {
          callback(new Error(this.$t('assessment.probeParamValLengthError')));
        } else {
          callback();
        }
      } else {
        callback();
      }
    };
    return {
      url: '/cr/eval/algorithm',
      addParamsDialog: false,
      isEdit: false,
      method: 'post',

      dialogForm: {
        param_name: '',
        desc: '',
        param_type: '',
        default_value: '',
      },
      paramTypeLists: [],
      options: [],
      parameterOptions: {},
      disable: false,
      cols: [
        {
          label: this.$t('assessment.parameterName'),
          prop: 'param_name',
        },
        {
          label: this.$t('assessment.parameterType'),
          // prop: 'param_type',
          slot: 'param_type',
        },
        {
          label: this.$t('assessment.description'),
          prop: 'desc',
        },
        {
          label: this.$t('assessment.defaultValue'),
          prop: 'default_value',
        },
        {
          label: this.$t('assessment.operation'),
          slot: 'operate',
        },
      ],
      selector: {
        maxSelect: 0,
      },
      selection: [],
      model: {
        name: null,
        description: null,
        type: 2, //默认评分算法
        algorithm_language: 0, //默认python
        code: algorithmTemplate.Score.value,
        params: [],
      },
      error: '',
      rules: {
        // 算法名称1-255
        name: [
          {
            required: true,
            message: this.$t('assessment.inputName'),
            trigger: 'blur',
          },
          // 1-255
          { validator: validateAssessName, trigger: 'blur' },
        ],
        // 算法描述1-2048 validateDescription
        description: [{ validator: validateDescription, trigger: 'blur' }],
        code: [
          {
            required: true,
            message: this.$t('assessment.codeEmpty'),
            trigger: 'blur',
          },
        ],
      },
      dialogFormRules: {
        param_name: [
          {
            required: true,
            message: this.$t('assessment.pleaseInputParamName'),
            trigger: ['blur', 'change'],
          },
          // 1-255
          { validator: validateAssessName, trigger: 'blur' },
        ],
        desc: [
          // 描述1-2048
          { validator: validateDescription, trigger: 'blur' },
        ],
        param_type: [
          {
            required: true,
            message: this.$t('assessment.requireParameter'),
            trigger: ['blur', 'change'],
          },
        ],
        default_value: [
          {
            required: true,
            message: this.$t('assessment.pleaseDefaultValue'),
            trigger: ['blur', 'change'],
          },
          // 输入和参数类型不匹配
          {
            validator: isCorrectParamType,
            message: this.$t('assessment.paramDefaultError'),
            trigger: 'blur',
          },
          // 默认值数据长度1-255
          {
            validator: validateLength,
            trigger: 'blur',
          },
        ],
      },
    };
  },
  watch: {},
  computed: {},
  created() {
    // 算法类型type为5
    this.$request
      .get('/cr/common/constants_config', { type: 5 }, { baseURL: '/api/ojj' })
      .then((res) => {
        const data = _.get(res, 'data.data');
        this.options = [
          this.findArrOne(data, 2),
          this.findArrOne(data, 3),
          this.findArrOne(data, 1),
          this.findArrOne(data, 4),
        ];
        if (this.id) {
          this.model = { ...this.model, type: data[0].code };
        }
      });

    // 预设参数类型 type为8
    this.$request
      .get('/cr/common/constants_config', { type: 8 }, { baseURL: '/api/ojj' })
      .then((res) => {
        const data = _.get(res, 'data.data');
        this.parameterOptions = data.map((item) => {
          return {
            ...item,
            code: item.code.toString(),
          };
        });
      });
  },
  mounted() {
    if (this.id) {
      this.method = 'put';
      this.$request
        .get(
          '/cr/eval/algorithm',
          { resource_id: this.id },
          { baseURL: '/api/ojj' },
        )
        .then((res) => {
          this.model = { ...res.data.data };
          this.model.algorithm_language = res.data.data.algorithm_language;
          this.model.type = res.data.data.type;
        });
    }
  },
  methods: {
    //算法类型顺序转化
    findArrOne(arr, data) {
      return arr.find((item) => {
        return item.code === data;
      });
    },
    changeFn(val) {
      if (val === 1) {
        this.model.code = algorithmTemplate.Format.value;
      } else if (val === 2) {
        this.model.code = algorithmTemplate.Score.value;
      } else if (val === 3) {
        this.model.code = algorithmTemplate.Check.value;
      } else if (val === 4) {
        this.model.code = algorithmTemplate.Group.value;
      }
    },
    getI18Nn() {
      return getI18N();
    },
    // 预设参数类型切换
    handleChangeRadio(data) {
      this.dialogForm = {
        ...this.dialogForm,
        default_value: '',
      };
    },
    //列表转化param_type
    exchangeParamType(type) {
      switch (type) {
        case '0': {
          return 'Number';
        }
        case '1': {
          return 'String';
        }
        case '2': {
          return 'Bool';
        }
        case '3': {
          return 'IP';
        }
        default: {
          return '';
        }
      }
    },
    // 新增参数
    addParams() {
      this.addParamsDialog = true;
    },
    getDifferenceSet(arr1, arr2) {
      return arr1
        .map(JSON.stringify)
        .concat(arr2.map(JSON.stringify))
        .filter((v, i, arr) => {
          return arr.indexOf(v) === arr.lastIndexOf(v);
        })
        .map(JSON.parse);
    },

    //删除参数todo
    removeParam(data, done) {
      // 获取当前的列表信息
      const selected_rows = this.selection;
      this.model.params = this.getDifferenceSet(
        selected_rows,
        this.model.params,
      );

      done();
      this.selection = [];
    },
    // 新增参数弹框确定
    addParamsAction() {
      if (this.isEdit) {
        //编辑
        this.$refs['addParamsForm'].validate((valid) => {
          if (valid) {
            const jsonForm = JSON.parse(JSON.stringify(this.dialogForm));
            const filterParamName = this.model.params.filter((item) => {
              return item.id !== jsonForm.id;
            });
            if (!this.judgeParamName(jsonForm, filterParamName)) {
              this.model.params = this.model.params.map((item) => {
                if (item.id === jsonForm.id) {
                  return {
                    ...jsonForm,
                  };
                } else {
                  return {
                    ...item,
                  };
                }
              });
              this.resetDialogForm();
            } else {
              this.$message.error(this.$t('assessment.duplicateName'));
            }
          } else {
            return false;
          }
        });
      } else {
        // 新增参数弹窗确定
        this.$refs['addParamsForm'].validate((valid) => {
          if (valid) {
            const jsonForm = JSON.parse(JSON.stringify(this.dialogForm));
            if (!this.judgeParamName(jsonForm, this.model.params)) {
              this.model.params.push(jsonForm);
              this.resetDialogForm();
            } else {
              this.$message.error(this.$t('assessment.duplicateName'));
            }
          } else {
            return false;
          }
        });
      }
    },
    //判断参数名字是否重复
    judgeParamName(data, arr) {
      let result = false;
      arr.forEach((element) => {
        if (element.param_name === data.param_name) {
          result = true;
        }
      });
      return result;
    },
    // 编辑参数
    editParam(data) {
      // const { resource_id } = data;
      this.addParamsDialog = true;
      this.dialogForm = { ...data };
      this.isEdit = true;
    },
    // 新增弹框取消
    cancelParamsAction() {
      this.addParamsDialog = false;
      this.resetDialogForm();
    },
    resetDialogForm() {
      this.$refs['addParamsForm'].resetFields();
      this.dialogForm = {};
      this.isEdit = false;
      this.addParamsDialog = false;
    },
    submitForm() {
      this.$refs.formRef
        .submit()
        .then(() => {
          this.$router.push({ path: '/admin/assessment-algorithm' });
        })
        .catch((err) => {});
    },
    // 取消
    resetForm() {
      this.$router.push({ path: '/admin/assessment-algorithm' });
    },
    // 编辑取消
    cancelForm(done) {
      this.$confirm(this.$t('assessment.editMsg') + '？').then(() => {
        this.$router.push({ path: '/admin/assessment-algorithm' });
        done();
      });
    },
  },
  watch: {
    dialogForm: {
      handler: function (now, old) {},
      // 开启深度监听：只要obj中的任何一个属性发生改变，都会触发相应的代码
      deep: true,
    },
  },
};
</script>
<style lang="scss" scoped>
.cb-inner-page {
  padding-top: 0px;
}
.box-card {
  padding-right: 20px;
  margin-bottom: 60px;
  ::v-deep .el-form {
    padding: 0px 0px 20px 0px;
  }
}
.title {
  font-size: 16px;
  line-height: 24px;
  color: var(--neutral8);
  margin-bottom: 20px;
  &::before {
    content: '';
    display: inline-block;
    width: 6px;
    height: 8px;
    vertical-align: middle;
    background: var(--primary-color);
    margin: -2px 8px 0 16px;
  }
}

.radio-style {
  ::v-deep .el-form-item__label {
    position: relative;
    top: -2px;
  }
}
.info-area {
  background: var(--bg-color-2);
  padding: 20px 20px 1px 0px;
  margin-bottom: 20px;
}
</style>
