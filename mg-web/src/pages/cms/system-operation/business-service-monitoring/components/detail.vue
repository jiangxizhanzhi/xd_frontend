<template>
  <cb-inner-page
    :background="true"
    title="超融合平台管理"
  >
    <div>
      <cb-form
        ref="formRef"
        label-position="right"
        label-width="120px"
        :model.sync="model"
        :rules="rules"
        :isBgColor="true"
      >
        <cb-form-item
          :label="$t('平台名称')"
          prop="name"
        >
          <cb-input
            v-model="model.name"
            :placeholder="$t('请输入平台名称')"
          />
        </cb-form-item>
        <cb-form-item
          :label="$t('所属厂商')"
          prop="company"
        >
          <cb-input
            v-model="model.company"
            :placeholder="$t('请输入所属厂商')"
          />
        </cb-form-item>
        <cb-form-item
          :label="$t('参数')"
          prop="params"
        >
          <!-- <cb-input
            v-model="model.params"
          /> -->
          <span class="params-item">
            <span>CPU</span>
            <cb-input-number
              v-model="model.params.cpu"
              controls-position="right"
              :min="0"
              size="small"
            ></cb-input-number>
            G
          </span>
          <span class="params-item">
            <span>磁盘</span>
            <cb-input-number
              v-model="model.params.disk"
              controls-position="right"
              :min="0"
              size="small"
            ></cb-input-number>
            G
          </span>
          <span class="params-item">
            <span>内存</span>
            <cb-input-number
              v-model="model.params.memory"
              controls-position="right"
              :min="0"
              size="small"
            ></cb-input-number>
            G
          </span>
        </cb-form-item>
        <cb-form-item
          :label="$t('架构类型')"
          prop="system_type"
        >
          <cb-input
            v-model="model.system_type"
            :placeholder="$t('请输入架构类型')"
          />
        </cb-form-item>
        <cb-form-item
          :label="$t('在位状态')"
          prop="in_position"
        >
          <cb-switch v-model="model.in_position"></cb-switch>
        </cb-form-item>
        <cb-form-item
          :label="$t('接入配置')"
          prop="connect_config"
        > <cb-search-table
            :scroll="{ y: 560 }"
            :cols="cols"
            :selector="selector"
            :selection.sync="selection"
            ref="accessTableRef"
            :hidePaginOnDemand="true"
            :data-source="model.access_protocol_list"
            :searchBarBg="false"
          >
            <template v-slot:search>
              <cb-button
                button-type="add"
                @click="addConnectConfig"
              ></cb-button>
              <cb-button
                hollow
                button-type="delete"
                @click="deleteSelected(selection, $event)"
                :disabled="selection.length === 0"
              ></cb-button>
            </template>
            <template v-slot:operate="scoped">
              <cb-button
                type="text"
                @click="editConfig(scoped.data)"
              >编辑</cb-button>
            </template>

          </cb-search-table>
        </cb-form-item>

        <div slot="fixedBottom">
          <cb-button-group space="middle">
            <cb-button
              buttonType="confirm"
              @click="confirm"
              mr
            ></cb-button>
            <cb-button
              buttonType="cancel"
              @click="cancel"
            ></cb-button>
          </cb-button-group>
        </div>
      </cb-form>
    </div>
    <!-- 配置弹框 -->
    <cb-dialog
      :title="$t('新增配置')"
      center
      :visible.sync="configVisible"
      width="500px"
      @close="protocolCancel"
    >
      <cb-form
        :model.sync="accessProtocolModel"
        :rules="protocolRules"
        label-width="100px"
        ref="protocolFormRef"
      >
        <cb-form-item
          :label="$t('device.agreement')"
          prop="protocol"
        >
          <cb-select
            style="width: 100%"
            v-model="accessProtocolModel.protocol"
            :options="protocolList"
            :placeholder="$t('device.plzSelectagree')"
            clearable
          />
        </cb-form-item>
        <cb-form-item
          :label="$t('device.port')"
          prop="port"
        >
          <cb-input v-model="accessProtocolModel.port"></cb-input>
        </cb-form-item>
        <cb-form-item
          :label="$t('device.accessIPAddress')"
          prop="hostname"
        >
          <cb-input v-model="accessProtocolModel.hostname"></cb-input>
        </cb-form-item>
        <cb-form-item
          :label="$t('device.username')"
          prop="username"
        >
          <cb-input v-model="accessProtocolModel.username"></cb-input>
        </cb-form-item>
        <cb-form-item
          :label="$t('device.password')"
          prop="password"
        >
          <cb-input v-model="accessProtocolModel.password"></cb-input>
        </cb-form-item>
        <div class="form-button-bar">
          <cb-button-group space="middle">
            <cb-button
              button-type="confirm"
              mr
              @click="protocolSubmit"
            ></cb-button>
            <cb-button
              button-type="cancel"
              @click="protocolCancel"
            ></cb-button>
          </cb-button-group>
        </div>
      </cb-form>
    </cb-dialog>
  </cb-inner-page>
</template>

<script>
import {
  PROTOCOLLIST,
} from '../constant';
import { addPlatformApi, editPlatformApi, getPlatformApiDetail } from '@/api/business-service-monitoring.js'
export default {
  props: {
    id: {
      type: String,
      default: '',
    },
  },
  components: {},
  data() {
    const validateIP = (rule, value, callback) => {
      const valid =
        /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/g;
      if (value && valid.test(value)) {
        callback();
      } else if (!value) {
        callback();
      } else {
        callback(new Error(this.$t('device.plzInputCorrectIp')));
      }
    };
    return {
      model: {
        name: "",
        company: "",
        params: {
          cpu: 0,
          disk: 0,
          memory: 0,
        },
        system_type: "",
        in_position: true,
        access_protocol_list: [],
      },
      rules: {
        name: [
          {
            required: true,
            message: this.$t('请输入平台名称'),
            trigger: 'blur',
          },
        ],
        company: [
          {
            required: true,
            message: this.$t('请输入所属厂商'),
            trigger: 'blur',
          },
        ],
        system_type: [
          {
            required: true,
            message: this.$t('请输入架构类型'),
            trigger: 'blur',
          },
        ],
      },
      // 协议数据
      protocolList: PROTOCOLLIST,
      protocolRules: {
        protocol: [
          {
            required: true,
            message: this.$t('device.plzSelectagree'),
            trigger: 'blur',
          },
        ],
        hostname: [{ validator: validateIP, trigger: 'blur' }],
      },
      cols: [
        {
          label: '协议',
          prop: 'protocol',
        },
        {
          label: '接入地址',
          prop: 'hostname',
        },
        {
          label: '端口',
          prop: 'port',
        },
        {
          label: '用户名',
          prop: 'username',
        },
        {
          label: '密码',
          prop: 'password',
        },
        {
          label: '操作',
          slot: 'operate',
        },
      ],
      // 接入配置表格
      selector: {
        maxSelect: 0,
      },
      selection: [],
      configVisible: false,
      accessProtocolModel: {
        protocol: null,
        port: null,
        hostname: null,
        username: null,
        password: null,
      },
      editConfigId: '',
    };
  },
  computed: {
  },
  created() {
  },
  mounted() {
    if (this.id) {
      this.getBackData();
    }
  },
  methods: {
    getBackData() {
      getPlatformApiDetail(this.id).then(res => {
        const data = _.get(res, 'data.data', {});
        this.model = {
          ...data,
          params: JSON.parse(data.params),
          in_position: data.in_position ? true : false,
          access_protocol_list: data.access_protocol_list ? data.access_protocol_list : [],
        }
      })
    },
    addConnectConfig() {
      this.configVisible = true;
    },
    editConfig(data) {
      this.editConfigId = data.id;
      this.configVisible = true;
      this.accessProtocolModel.protocol = data.protocol;
      this.accessProtocolModel.port = data.port;
      this.accessProtocolModel.hostname = data.hostname;
      this.accessProtocolModel.username = data.username;
      this.accessProtocolModel.password = data.password;
    },
    // 无接口删除表格数据
    deleteSelected(selection, done) {
      let tableList = this.model.access_protocol_list;
      for (let i = 0; i < selection.length; i++) {
        for (let j = 0; j < tableList.length; j++) {
          if (tableList[j].id === selection[i].id) {
            tableList.splice(j, 1);
            j -= 1;
          }
        }
      }
      done();
      this.selection = [];
    },
    // 管理协议确定
    protocolSubmit() {
      this.$refs.protocolFormRef.validate((valid) => {
        if (!valid) {
          return false;
        } else {
          if (this.editConfigId) {
            // 编辑
            this.model.access_protocol_list.forEach(item => {
              if (item.id === this.editConfigId) {
                item.protocol = this.accessProtocolModel.protocol;
                item.port = this.accessProtocolModel.port;
                item.hostname = this.accessProtocolModel.hostname;
                item.username = this.accessProtocolModel.username;
                item.password = this.accessProtocolModel.password;
              }
            })
          } else {
            // 新增
            this.model.access_protocol_list.push(this.accessProtocolModel)
          }
          this.configVisible = false;
        }
      });
      this.accessProtocolModel = {
        protocol: null,
        port: null,
        hostname: null,
        username: null,
        password: null,
      };
      this.editConfigId = '';
    },
    protocolCancel() {
      this.configVisible = false;
      this.accessProtocolModel = {
        protocol: null,
        port: null,
        hostname: null,
        username: null,
        password: null,
      };
      this.editConfigId = '';
    },
    confirm() {
      const params = {
        ...this.model,
        params: JSON.stringify(this.model.params),
        in_position: this.model.in_position ? 1 : 0
      }
      this.$refs.formRef.validate(valid => {
        if (valid) {
          if (this.id) {
            // 编辑
            params.id = this.id;
            editPlatformApi(params).then(res => {
              this.$router.push({
                name: 'business-service-monitoring'
              })
            })
          } else {
            // 新增
            addPlatformApi(params).then(res => {
              this.$router.push({
                name: 'business-service-monitoring'
              })
            })
          }
        } else {
          return false
        }
      })
    },
    cancel() {
      this.$router.push({
        name: 'business-service-monitoring'
      })
    }
  },
};
</script>

<style lang="scss" scoped>
.params-item {
  margin-right: 16px;
}
</style>
