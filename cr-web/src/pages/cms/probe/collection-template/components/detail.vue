<template>
  <cb-inner-page :background="false">
    <div class="collect-page">
      <cb-form
        class="collect-form"
        ref="formRef"
        :label-width="getI18Nn().locale == 'en-US' ? '150px' : '100px'"
        :model.sync="model"
        :id="id"
        :url="url"
        baseURL="/api/mp"
        :rules="rules"
        :contentType="contentType"
      >
        <div class="info-area">
          <div class="title">{{ $t('probes.basicInfo') }}</div>
          <cb-form-item :label="$t('probes.templateName')" prop="name">
            <cb-input
              v-model="model.name"
              :placeholder="$t('probes.inputTemplateName')"
            />
          </cb-form-item>

          <cb-form-item :label="$t('probes.templateDesc')" prop="description">
            <cb-input
              type="textarea"
              :placeholder="$t('probes.inputDescInfo')"
              v-model="model.description"
            />
          </cb-form-item>

          <cb-form-item :label="$t('probes.applicableSystem')">
            <cb-radio-group v-model="model.os_type">
              <cb-radio
                v-for="option in applicableSystems"
                :key="option.value"
                :label="option.value"
              >
                {{ option.label }}
              </cb-radio>
            </cb-radio-group>
          </cb-form-item>
        </div>
        <div class="collect-area">
          <div class="title">{{ $t('probes.dataCollection') }}</div>
          <cb-form-item class="data-collection">
            <cb-tabs>
              <cb-tab-pane :label="$t('probes.baseInfoCollection')">
                <div class="base-info-area">
                  <p>{{ baseInfo.hardware.title }}</p>
                  <p class="text">{{ baseInfo.hardware.desc }}</p>
                  <p>{{ baseInfo.system.title }}</p>
                  <p class="text">{{ baseInfo.system.desc }}</p>
                  <p>{{ baseInfo.interface.title }}</p>
                  <p class="text">{{ baseInfo.interface.desc }}</p>
                  <p>{{ baseInfo.port.title }}</p>
                  <p class="text">{{ baseInfo.port.desc }}</p>
                  <p>{{ baseInfo.process.title }}</p>
                  <p class="text">{{ baseInfo.process.desc }}</p>
                </div>
              </cb-tab-pane>

              <cb-tab-pane :label="$t('probes.eventCollection')">
                <div>
                  <cb-checkbox
                    v-model="model.event_probes[0].disabled"
                    :true-label="0"
                    :false-label="1"
                    @change="changeDoc($event)"
                    >{{ eventcollectInfo.docChange.title }}</cb-checkbox
                  >
                  <p class="tip">{{ eventcollectInfo.docChange.desc }}</p>
                  <div
                    v-show="model.event_probes[0].disabled == 0"
                    class="action-input"
                  >
                    <div
                      v-for="(item, index) in model.event_probes[0].paths"
                      :key="index"
                      class="document-area"
                    >
                      <cb-input
                        style="width: 50%"
                        v-model="model.event_probes[0].paths[index]"
                        :placeholder="$t('probes.inputDocPath')"
                      />
                      <cb-button
                        v-show="model.event_probes[0].paths.length > 1"
                        type="text"
                        icon="icon-jianshao"
                        @click="deleteDoc(index, item)"
                        class="reduce-btn"
                      ></cb-button>
                      <cb-button
                        v-show="index + 1 == model.event_probes[0].paths.length"
                        type="text"
                        icon="icon-xinzeng"
                        @click="addDoc()"
                        class="add-btn"
                      ></cb-button>
                    </div>
                  </div>
                  <cb-checkbox
                    v-model="model.event_probes[1].disabled"
                    :true-label="0"
                    :false-label="1"
                    @change="changeReg($event)"
                    >{{ eventcollectInfo.regChange.title }}</cb-checkbox
                  >
                  <p class="tip">{{ eventcollectInfo.regChange.desc }}</p>
                  <div
                    v-show="model.event_probes[1].disabled == 0"
                    class="action-input"
                  >
                    <div
                      v-for="(item, index) in model.event_probes[1].paths"
                      :key="index"
                      class="document-area"
                    >
                      <cb-input
                        style="width: 50%"
                        v-model="model.event_probes[1].paths[index]"
                        :placeholder="$t('probes.inputReg')"
                      />
                      <cb-button
                        v-show="model.event_probes[1].paths.length > 1"
                        type="text"
                        icon="icon-jianshao"
                        @click="deleteRegistry(index, item)"
                        class="reduce-btn"
                      ></cb-button>
                      <cb-button
                        v-show="index + 1 == model.event_probes[1].paths.length"
                        type="text"
                        icon="icon-xinzeng"
                        @click="addRegistry()"
                        class="add-btn"
                      ></cb-button>
                    </div>
                  </div>
                </div>
              </cb-tab-pane>

              <cb-tab-pane :label="$t('probes.logCollection')">
                <div>
                  <cb-checkbox
                    v-model="model.log_probes[0].disabled"
                    :true-label="0"
                    :false-label="1"
                    @change="changeLog($event)"
                    >{{ logCollectDesc.logDoc.title }}</cb-checkbox
                  >
                  <p class="tip">{{ logCollectDesc.logDoc.desc }}</p>
                  <div
                    v-show="model.log_probes[0].disabled == 0"
                    class="action-input"
                  >
                    <div
                      v-for="(item, index) in model.log_probes[0].paths"
                      :key="index"
                      class="document-area"
                    >
                      <cb-input
                        style="width: 50%"
                        v-model="model.log_probes[0].paths[index]"
                        :placeholder="$t('probes.inputLogDocPath')"
                      />
                      <cb-button
                        v-show="model.log_probes[0].paths.length > 1"
                        type="text"
                        icon="icon-jianshao"
                        @click="deleteLog(index, item)"
                        class="reduce-btn"
                      ></cb-button>
                      <cb-button
                        v-show="index + 1 == model.log_probes[0].paths.length"
                        type="text"
                        icon="icon-xinzeng"
                        @click="addLog()"
                        class="add-btn"
                      ></cb-button>
                    </div>
                  </div>
                  <cb-checkbox
                    v-model="model.log_probes[1].disabled"
                    :true-label="0"
                    :false-label="1"
                    >{{ logCollectDesc.securitySoftware.title }}</cb-checkbox
                  >
                  <p class="tip">{{ logCollectDesc.securitySoftware.desc }}</p>
                  <cb-checkbox
                    v-model="model.log_probes[2].disabled"
                    :true-label="0"
                    :false-label="1"
                    >{{ logCollectDesc.system.title }}</cb-checkbox
                  >
                  <p class="tip">{{ logCollectDesc.system.desc }}</p>
                  <cb-checkbox
                    v-model="model.log_probes[3].disabled"
                    :true-label="0"
                    :false-label="1"
                    >{{ logCollectDesc.applicationSys.title }}</cb-checkbox
                  >
                  <p class="tip">{{ logCollectDesc.applicationSys.desc }}</p>
                </div>
              </cb-tab-pane>
              <cb-tab-pane :label="$t('probes.customCollection')">
                <cb-search-table
                  :scroll="{ y: 480 }"
                  rowKey="id"
                  :cols="cols"
                  :dataSource="model.custom_probes"
                  :selection.sync="selection"
                  :hidePaginOnDemand="true"
                  ref="tableRef"
                  :searchBarBg="false"
                >
                  <template v-slot:search>
                    <cb-button button-type="import" hollow @click="importFile">
                      {{ $t('common.import') }}
                    </cb-button>
                    <cb-button
                      hollow
                      button-type="delete"
                      @click="deleteSelected(selection, $event)"
                      :disabled="selection.length === 0"
                    ></cb-button>
                  </template>
                  <template v-slot:probeCate="scope">
                    <span v-if="scope.data.probe_category == '0'">{{
                      $t('probes.infoClass')
                    }}</span>
                    <span v-else-if="scope.data.probe_category == '1'">{{
                      $t('probes.eventClass')
                    }}</span>
                    <span v-else>{{ $t('probes.logClass') }}</span>
                  </template>
                  <template v-slot:operation="scope">
                    <cb-button
                      :disabled="!scope.data.parameter"
                      type="text"
                      @click="setParam(scope.data)"
                      mr
                    >
                      {{ $t('probes.set') }}
                    </cb-button>
                  </template>
                </cb-search-table>
              </cb-tab-pane>
            </cb-tabs>
          </cb-form-item>
        </div>
        <div slot="fixedBottom">
          <cb-button-group space="middle">
            <cb-button button-type="confirm" @click="submit"> </cb-button>
            <cb-button button-type="cancel" @click="cancel"> </cb-button>
          </cb-button-group>
        </div>
      </cb-form>
      <cb-dialog
        :title="$t('probes.selectProbe')"
        :visible.sync="showProbe"
        width="50%"
      >
        <cb-search-table
          :scroll="{ y: 400 }"
          rowKey="id"
          :cols="probeCols"
          :selection.sync="probeSelection"
          :url="probeUrl"
          :baseURL="baseURL"
          :data="probeQuery"
          :hidePaginOnDemand="true"
          :pageSize="pageSize"
          ref="probeRef"
          :searchBarBg="false"
        >
          <template v-slot:search>
            <cb-select
              v-model="probeQuery.probe_categories"
              :placeholder="$t('common.pleaseChoose')"
              :options="probesTypes"
              :first="{ label: $t('probes.allType'), value: '' }"
            />
            <cb-search-input
              v-model="probeQuery.name"
              :placeholder="$t('probes.inputProbeName')"
            ></cb-search-input>
          </template>
          <template v-slot:probeCate="scope">
            <span v-if="scope.data.probe_category == '0'">{{
              $t('probes.infoClass')
            }}</span>
            <span v-if="scope.data.probe_category == '1'">{{
              $t('probes.eventClass')
            }}</span>
            <span v-if="scope.data.probe_category == '2'">{{
              $t('probes.logClass')
            }}</span>
          </template>
        </cb-search-table>
        <div slot="footer" class="dialog-footer">
          <cb-button button-type="confirm" @click="importProbe" mr> </cb-button>
          <cb-button button-type="cancel" @click="closeProbeDialog">
          </cb-button>
        </div>
      </cb-dialog>
      <cb-dialog
        :title="$t('probes.set')"
        :visible.sync="showParam"
        width="640px"
      >
        <cb-form
          ref="paramForm"
          class="paramForm"
          :model.sync="currentParam"
          :rules="paramRules"
          :label-width="getI18Nn().locale == 'en-US' ? '180px' : '100px'"
          label-position="right"
        >
          <cb-form-item :label="$t('probes.param')">
            <cb-select
              v-model="currentParam.name"
              :options="options"
              @change="changeInput"
              style="width: 100%"
            >
            </cb-select>
          </cb-form-item>
          <cb-form-item :label="$t('probes.type')">
            <span>{{ currentParam.type }}</span>
          </cb-form-item>
          <cb-form-item :label="$t('probes.paramDefault')" prop="value">
            <cb-select
              v-if="currentParam.type === 'Bool'"
              v-model="currentParam.value"
              style="width: 100%"
              :options="booleanValues"
            >
            </cb-select>
            <cb-input
              v-else-if="currentParam.type === 'Number'"
              v-model.number="currentParam.value"
            />
            <cb-input v-else v-model="currentParam.value" />
          </cb-form-item>
        </cb-form>
        <div slot="footer" class="dialog-footer">
          <cb-button button-type="confirm" @click="saveParam" mr> </cb-button>
          <cb-button button-type="cancel" @click="closeParamDialog">
          </cb-button>
        </div>
      </cb-dialog>
    </div>
  </cb-inner-page>
</template>

<script>
import { getI18N } from '@cyber/helper';
import {
  PROBESTYPES,
  APPLICABLESYSTEMS,
  SCRIPTTYPELISTS,
} from '../../constant';
import { validateTemplateName, validateProbeDesc } from '@/utils/rules-cms';
export default {
  props: ['id'],
  components: {},
  data() {
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
    var isCorrectParamType = (rule, value, callback) => {
      const types = this.currentParam.type;
      let hashError = false;

      if (types === 'Number') {
        if (isNaN(value)) {
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
    return {
      options: [],
      url: '/collection/template/',
      contentType: 'application/json',
      pageSize: 9999,
      disable: false,
      showProbe: false,
      showParam: false,
      probesTypes: PROBESTYPES,
      applicableSystems: APPLICABLESYSTEMS,
      scriptTypes: SCRIPTTYPELISTS,
      params: [],
      //记录删除的自定义探针
      deleteProbes: [],
      editRowId: '',
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
      baseInfo: {
        hardware: {},
        system: {},
        interface: {},
        port: {},
        process: {},
      },
      eventcollectInfo: {
        docChange: {},
        regChange: {},
      },
      logCollectDesc: {
        logDoc: {},
        securitySoftware: {},
        system: {},
        applicationSys: {},
      },
      model: {
        name: '',
        description: '',
        os_type: 0,
        custom_probes: [],
        event_probes: [
          {
            disabled: 1,
            paths: [],
            id: '006',
          },
          {
            disabled: 1,
            paths: [],
            id: '007',
          },
        ],
        log_probes: [
          {
            disabled: 1,
            paths: [],
            id: '011',
          },
          {
            disabled: 1,
            id: '010',
          },
          {
            disabled: 1,
            id: '008',
          },
          {
            disabled: 1,
            id: '009',
          },
        ],
      },
      probeUrl: '',
      baseURL: '/api/mp',
      selection: [],
      probeSelection: [],
      probeQuery: {
        probe_categories: '',
        name: '',
      },
      currentParam: {
        name: '',
        type: '',
        value: '',
        desc: '',
      },
      cols: [
        {
          label: this.$t('probes.name'),
          prop: 'name',
        },
        {
          label: this.$t('probes.describe'),
          prop: 'description',
        },
        {
          label: this.$t('probes.type'),
          slot: 'probeCate',
        },
        {
          label: this.$t('probes.applicableSystem'),
          getData: (data) => {
            const type = ['Windows', 'Unix', 'Linux', 'BSD', 'Other'];
            const osTypes = data.os_types;
            const types = _.map(osTypes, (index) => type[index]);
            return types.join(', ');
          },
        },
        {
          label: this.$t('common.operation'),
          slot: 'operation',
        },
      ],
      probeCols: [
        {
          label: this.$t('probes.name'),
          prop: 'name',
        },
        {
          label: this.$t('probes.describe'),
          prop: 'description',
        },
        {
          label: this.$t('probes.type'),
          slot: 'probeCate',
        },
        {
          label: this.$t('probes.applicableSystem'),
          getData: (data) => {
            const type = ['Windows', 'Unix', 'Linux', 'BSD', 'Other'];
            const OsTypes = data.os_types;
            const types = _.map(OsTypes, (index) => type[index]);
            return types.join(', ');
          },
        },
      ],
      rules: {
        name: [
          {
            required: true,
            message: this.$t('probes.inputTemplateName'),
            trigger: 'blur',
          },
          { validator: validateTemplateName, trigger: 'blur' },
        ],
        description: [{ validator: validateProbeDesc, trigger: 'blur' }],
      },
      paramRules: {
        value: [
          {
            required: true,
            message: this.$t('probeRules.pleaseInputParamDefault'),
            trigger: 'blur',
          },
          {
            validator: isCorrectParamType,
            message: this.$t('probeRules.paramDefaultError'),
            trigger: 'blur',
          },
          {
            validator: validateLength(1, 500),
            message: this.$t('settings.probeParamValLengthError'),
            trigger: 'blur',
          },
        ],
      },
    };
  },

  watch: {
    'currentParam.value': function (value) {
      let index = this.params.findIndex(
        (item) => item.label == this.currentParam.name,
      );
      if (index >= 0) {
        this.params[index].value = value.toString();
      }
    },
  },

  created() {},
  mounted() {
    this.getCollectDesc();
    if (this.id) {
      this.$refs.formRef.getModelData().then((data) => {});
    }
  },
  methods: {
    //数据采集词条采用接口返回的数据
    getCollectDesc() {
      this.$request
        .get(
          '/probes/page',
          { types: 0, perPage: 1000 },
          { baseURL: '/api/mp' },
        )
        .then((res) => {
          const list = res.data.data.list;
          list.forEach((item, index) => {
            if (item.id == '001') {
              this.$set(this.baseInfo.hardware, 'title', item.name);
              this.$set(this.baseInfo.hardware, 'desc', item.description);
            } else if (item.id == '002') {
              this.$set(this.baseInfo.system, 'title', item.name);
              this.$set(this.baseInfo.system, 'desc', item.description);
            } else if (item.id == '003') {
              this.$set(this.baseInfo.interface, 'title', item.name);
              this.$set(this.baseInfo.interface, 'desc', item.description);
            } else if (item.id == '004') {
              this.$set(this.baseInfo.port, 'title', item.name);
              this.$set(this.baseInfo.port, 'desc', item.description);
            } else if (item.id == '005') {
              this.$set(this.baseInfo.process, 'title', item.name);
              this.$set(this.baseInfo.process, 'desc', item.description);
            } else if (item.id == '006') {
              this.$set(this.eventcollectInfo.docChange, 'title', item.name);
              this.$set(
                this.eventcollectInfo.docChange,
                'desc',
                item.description,
              );
            } else if (item.id == '007') {
              this.$set(this.eventcollectInfo.regChange, 'title', item.name);
              this.$set(
                this.eventcollectInfo.regChange,
                'desc',
                item.description,
              );
            } else if (item.id == '008') {
              this.$set(this.logCollectDesc.system, 'title', item.name);
              this.$set(this.logCollectDesc.system, 'desc', item.description);
            } else if (item.id == '009') {
              this.$set(this.logCollectDesc.applicationSys, 'title', item.name);
              this.$set(
                this.logCollectDesc.applicationSys,
                'desc',
                item.description,
              );
            } else if (item.id == '010') {
              this.$set(
                this.logCollectDesc.securitySoftware,
                'title',
                item.name,
              );
              this.$set(
                this.logCollectDesc.securitySoftware,
                'desc',
                item.description,
              );
            } else if (item.id == '011') {
              this.$set(this.logCollectDesc.logDoc, 'title', item.name);
              this.$set(this.logCollectDesc.logDoc, 'desc', item.description);
            }
          });
        });
    },
    getI18Nn() {
      return getI18N();
    },
    changeDoc($event) {
      if ($event) {
        this.model.event_probes[0].paths = [];
      } else {
        this.model.event_probes[0].paths.push('');
      }
    },
    changeReg($event) {
      if ($event) {
        this.model.event_probes[1].paths = [];
      } else {
        this.model.event_probes[1].paths.push('');
      }
    },
    changeLog($event) {
      if ($event) {
        this.model.log_probes[0].paths = [];
      } else {
        this.model.log_probes[0].paths.push('');
      }
    },
    addDoc() {
      this.model.event_probes[0].paths.push('');
    },
    deleteDoc(index) {
      this.model.event_probes[0].paths.splice(index, 1);
    },
    addRegistry() {
      this.model.event_probes[1].paths.push('');
    },
    deleteRegistry(index) {
      this.model.event_probes[1].paths.splice(index, 1);
    },
    addLog() {
      this.model.log_probes[0].paths.push('');
    },
    deleteLog(index) {
      this.model.log_probes[0].paths.splice(index, 1);
    },
    importFile() {
      this.probeUrl = `/probes/page/?types=${1}&os_types=${this.model.os_type}`;
      this.showProbe = true;
    },
    importProbe() {
      this.showProbe = false;
      this.probeSelection.forEach((item) => {
        let probeIndex = this.model.custom_probes.findIndex(
          (probe) => probe.id == item.id,
        );
        // 覆盖旧探针需添加标识让后端识别进行覆盖
        //导入时判断有重复的探针则进行替换
        if (probeIndex >= 0) {
          item.reload = 1;
          this.$set(this.model.custom_probes, probeIndex, item);
          //删除后重新导入也需要加标识
        } else if (this.deleteProbes.indexOf(item.id) != -1) {
          item.reload = 1;
          this.model.custom_probes.push(item);
        } else {
          this.model.custom_probes.push(item);
        }
      });
      this.probeSelection = [];
    },
    deleteSelected(selection, done) {
      this.selection.forEach((item) => {
        let probeIndex = this.model.custom_probes.findIndex(
          (probe) => probe.id == item.id,
        );
        if (probeIndex > 0 || probeIndex == 0) {
          if (
            this.deleteProbes.indexOf(
              this.model.custom_probes[probeIndex].id,
            ) == -1
          ) {
            this.deleteProbes.push(this.model.custom_probes[probeIndex].id);
          }
          this.model.custom_probes.splice(probeIndex, 1);
        }
      });
      done();
    },

    closeProbeDialog() {
      this.showProbe = false;
    },
    setParam(data) {
      this.params = [];
      this.showParam = true;
      this.editRowId = data.id;

      this.options = [];
      const temp = JSON.parse(data.parameter);
      for (let index in temp) {
        this.params.push({
          label: index,
          type: temp[index][0],
          value: temp[index][1],
          desc: temp[index][2],
        });
        this.options.push({
          label: index,
          value: index,
        });
      }

      this.currentParam.name = this.params[0].label;
      this.currentParam.type = this.params[0].type;
      this.currentParam.desc = this.params[0].desc;
      //将"true""false"从字符串转为布尔类型，否则编辑布尔类型参数时校验容易报错
      if (this.params[0].type == 'Bool') {
        this.currentParam.value = this.params[0].value
          ? JSON.parse(this.params[0].value)
          : false;
      } else {
        this.currentParam.value = this.params[0].value;
      }
    },
    changeInput() {
      let index = this.params.findIndex(
        (item) => item.label == this.currentParam.name,
      );
      this.currentParam.name = this.params[index].label;
      this.currentParam.type = this.params[index].type;
      this.currentParam.desc = this.params[index].desc;
      //将"true""false"从字符串转为布尔类型，否则编辑布尔类型参数时校验容易报错
      if (this.params[index].type == 'Bool') {
        this.currentParam.value = this.params[index].value
          ? JSON.parse(this.params[index].value)
          : false;
      } else {
        this.currentParam.value = this.params[index].value;
      }
    },

    saveParam() {
      this.$refs['paramForm'].validate((valid) => {
        if (!valid) {
          return false;
        } else {
          this.showParam = false;
          const temp = {};
          this.params.forEach((item) => {
            temp[item.label] = [item.type, item.value, item.desc];
          });
          let editIndex = this.model.custom_probes.findIndex(
            (probe) => probe.id == this.editRowId,
          );
          this.model.custom_probes[editIndex].parameter = JSON.stringify(temp);
        }
      });
    },
    closeParamDialog() {
      this.showParam = false;
    },

    submit() {
      let submitData;
      if (this.id) {
        submitData = {
          ...this.model,
          id: this.id.id,
        };
      } else {
        submitData = {
          ...this.model,
        };
      }

      this.$refs.formRef.submit(submitData).then(() => {
        this.$router.push({ name: 'collection-template' });
      });
    },
    cancel() {
      this.$confirm(this.$t('probes.leaveWarning')).then(() => {
        this.$router.push({ name: 'collection-template' });
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.collect-page {
  margin-right: 20px;
  .collect-form {
    ::v-deep .el-form {
      padding: 0px 0px 20px 0px;
    }
    .info-area {
      background: var(--bg-color-2);
      padding: 20px 20px 1px 20px;
      margin-bottom: 20px;
    }
    .collect-area {
      min-height: 480px;
      background: var(--bg-color-2);
      padding: 20px 20px 1px 20px;
      margin-bottom: 20px;
    }
    .base-info-area {
      color: var(--neutral8);
      margin-top: -15px;
      p {
        margin-top: 25px;
        line-height: 14px;
        font-size: 14px;
      }
      .text {
        margin-top: 7px;
        color: var(--neutral5);
        line-height: 12px;
        font-size: 12px;
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
    .data-collection {
      width: 98%;
      ::v-deep .el-form-item__content {
        margin-left: 30px !important;
      }
      ::v-deep .cb-search-table .ant-table .ant-table-tbody .cb-table-zebra {
        background: var(--bg-color-2);
      }
    }
    .tip {
      font-size: 12px;
      color: var(--neutral5);
      line-height: 12px;
      margin: 7px 0px 24px 30px;
    }
    .action-input {
      margin: -10px 0px 24px 0px;
      .document-area {
        margin: 0px 0px 8px 30px;
        .reduce-btn {
          margin-left: 15px;
        }
      }
    }
    .add {
      margin-left: 50px;
    }
    .add-btn {
      margin-left: 15px;
    }
  }
}
</style>
