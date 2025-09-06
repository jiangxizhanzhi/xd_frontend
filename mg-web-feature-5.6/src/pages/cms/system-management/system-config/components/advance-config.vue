<template>
  <div class="system-setting">
    <cb-form
      ref="elFormRef"
      label-position="right"
      label-width="160px"
      :model.sync="model"
      :rules="rules"
      :url="url"
      :baseURL="baseURL"
      json
    >
      <cb-form-item
        :label="$t('systemManagement.system.flagLength')"
        prop="flag_length"
      >
        <cb-input-number
          v-model="model.flag_length"
          :controls="false"
          :placeholder="$t('systemManagement.system.flagLengthLimit')"
        />
      </cb-form-item>
      <cb-form-item
        :label="$t('systemManagement.system.answerPrefix')"
        prop="flag_prefix"
      >
        <cb-input v-model="model.flag_prefix"></cb-input>
      </cb-form-item>
      <cb-form-item
        :label="$t('systemManagement.system.resetVLANTokenBucket')"
        prop="vlan_bucket"
      >
        <div class="flex-box">
          <cb-input
            v-model="model.vlan_bucket"
            class="mr20"
            :placeholder="$t('systemManagement.system.example1000')"
          ></cb-input>
          <cb-button
            buttonType="confirm"
            @click="resetVPN"
            :hollow="true"
            :warnMsg="$t('systemManagement.system.warnMsg')"
            >{{ $t('systemManagement.system.reset') }}</cb-button
          >
        </div>
      </cb-form-item>

      <!-- 暂时隐藏VPN软件包 -->
      <!-- <cb-form-item
        :label="$t('systemManagement.system.VPNSoftwarePackage')"
        prop="version"
      >
        <cb-form
          class="vpn-form"
          ref="vpnFormRef"
          label-position="right"
          label-width="100px"
          :model.sync="vpnModel"
          :rules="vpnRules"
          :url="url"
          :baseURL="baseURL"
          json
        >
          <cb-form-item
            :label="$t('systemManagement.system.clientName')"
            prop="name"
          >
            <cb-input v-model="vpnModel.name"></cb-input>
          </cb-form-item>
          <cb-form-item
            :label="$t('systemManagement.system.uploadFile')"
            prop="url"
          >
            <cb-input
              v-model="vpnModel.url"
              type="hidden"
              style="height: 0px; line-height: 0px; display: block"
            />
            <cb-upload-file
              type="file"
              tipText=""
              accept=".zip,.rar"
              @delete="deleteData"
              :fetch-promise="upLoad"
              v-model="fileList"
            ></cb-upload-file>
          </cb-form-item>
          <cb-form-item
            :label="$t('systemManagement.system.clientDescription')"
            prop="description"
          >
            <div class="flex-box">
              <cb-input v-model="vpnModel.description" class="mr20"></cb-input>
              <cb-button
                :hollow="true"
                buttonType="confirm"
                @click="vpnSubmitForm"
                >{{ $t('systemManagement.userManage.add') }}</cb-button
              >
            </div>
          </cb-form-item>
        </cb-form>
        <div class="mt20 vpn-table">
          <cb-search-table
            :cols="cols"
            ref="vpnListRef"
            :data-source="tableData"
            hidePaginOnDemand
          >
            <template v-slot:operate="scope">
              <cb-button-group>
                <cb-button type="text" @click="downloadFile(scope.data.url)"
                  ><cb-iconfont type="icon-xiazai" />
                  {{ $t('systemManagement.system.download') }}</cb-button
                >
                <cb-button
                  type="text"
                  buttonType="delete"
                  @click="vpnDelete(scope.data, $event)"
                ></cb-button>
              </cb-button-group>
            </template>
          </cb-search-table>
        </div>
      </cb-form-item> -->
      <cb-form-item
        v-if="false"
        :label="$t('systemManagement.system.AutomaticDataClearingTime')"
        prop="scene_auto_clean_interval_day"
      >
        <cb-input-number
          v-model="model.scene_auto_clean_interval_day"
          class="AutomaticDataClearingTime"
          controls-position="right"
          :min="0"
        />
        {{ $t('systemManagement.system.day') }}
      </cb-form-item>
      <cb-form-item
        v-if="false"
        :label="$t('systemManagement.system.AllowCourseSceneDelay')"
      >
        <cb-row>
          <cb-col :span="2">
            <cb-switch
              v-model="allow_course_scene_delay.enable"
              active-value="1"
              inactive-value="0"
            >
            </cb-switch>
          </cb-col>
          <template v-if="allow_course_scene_delay.enable === '1'">
            <cb-col :span="9">
              {{ $t('systemManagement.system.EachTimeYouApplyForAnExtension') }}
              <cb-input-number
                v-model="allow_course_scene_delay.allow_delay_minutes"
                class="AutomaticDataClearingTime"
                controls-position="right"
              />
              {{ $t('systemManagement.system.baseMin') }}
            </cb-col>
            <cb-col :span="10">
              {{
                $t(
                  'systemManagement.system.maximumNumberOfApplicationsPerScenario',
                )
              }}
              <cb-input-number
                v-model="allow_course_scene_delay.allow_delay_times"
                class="AutomaticDataClearingTime"
                controls-position="right"
              />
              {{ $t('systemManagement.system.counts') }}
            </cb-col>
          </template>
        </cb-row>
      </cb-form-item>
      <div class="form-button-bar">
        <cb-button
          buttonType="confirm"
          loading
          @click="submitForm"
          mr
        ></cb-button>
      </div>
    </cb-form>
  </div>
</template>

<script>
import { getSystemSettingSystemConfig, uploadSystemVPNMp } from '@/api/system';
import _ from 'lodash';
export default {
  data() {
    var validFlagLen = (rule, value, callback) => {
      if (value > 128 || value < 8) {
        callback(new Error(this.$t('systemManagement.system.flagLengthLimit')));
      }
      callback();
    };
    return {
      url: '/sys/config/updateall',
      baseURL: '/api/mp',
      model: {
        flag_length: '16',
        flag_prefix: 'xctf',
        vlan_bucket: '',
      },
      allow_course_scene_delay: {
        enable: '1', // 1开启 0禁用
        allow_delay_minutes: 0,
        allow_delay_times: 0,
      },
      vpnModel: {
        name: '',
        url: '',
        description: '',
      },
      vpnRules: {
        name: [
          {
            required: true,
            message: this.$t('systemManagement.system.inputClientName'),
            trigger: 'blur',
          },
        ],
        url: [
          {
            required: true,
            message: this.$t('systemManagement.system.uploadFile'),
            trigger: 'change',
          },
        ],
        description: [
          {
            required: true,
            message: this.$t('systemManagement.system.inputClientDesc'),
            trigger: 'blur',
          },
        ],
      },
      fileList: [],
      rules: {
        flag_length: [
          {
            required: true,
            message: this.$t('systemManagement.system.inputFlagLength'),
            trigger: 'blur',
          },
          {
            required: true,
            validator: validFlagLen,
            trigger: 'blur',
          },
        ],
        flag_prefix: [
          {
            required: true,
            message: this.$t('systemManagement.system.inputFlagPrefix'),
            trigger: 'blur',
          },
        ],
      },
      tableData: [],
      cols: [
        {
          label: this.$t('systemManagement.system.clientName'),
          prop: 'name',
        },
        {
          label: this.$t('systemManagement.system.clientDescription'),
          prop: 'description',
        },
        {
          label: this.$t('systemManagement.system.operate'),
          slot: 'operate',
        },
      ],
    };
  },
  created() {
    this.getSystemInfo();
  },
  methods: {
    // 获取基础配置信息
    getSystemInfo(flag) {
      getSystemSettingSystemConfig().then((res) => {
        const dataResult = _.get(res, 'data.data', []);
        //初始化基本配置
        if (!(flag && flag == 'vpnUpdate')) {
          for (let key in this.model) {
            for (let i = 0; i < dataResult.length; i++) {
              if (key === dataResult[i].key_name) {
                this.model[key] = dataResult[i].value;
                break;
              }
            }
          }
        }

        // 初始化vpn
        let vpnDatainit = [];
        for (let i = 0; i < dataResult.length; i++) {
          if (dataResult[i].key_name == 'vpn_packages') {
            if (dataResult[i].value != '') {
              vpnDatainit = _.cloneDeep(JSON.parse(dataResult[i].value));
            }
            break;
          }
        }
        this.tableData = [...vpnDatainit];
      });
    },
    // 重置VPN
    resetVPN(done) {
      const that = this;
      const submitFormData = [
        {
          key_name: 'vlan_bucket',
          value: this.model['vlan_bucket'],
        },
      ];
      that.$refs.elFormRef
        .submit(submitFormData)
        .then(() => {
          that.$success(that.$t('systemManagement.system.resetSuccess'));
          that.getSystemInfo();
        })
        .finally(() => {
          done();
        });
      done(false);
    },
    upLoad(file) {
      const size = file.size / (1024 * 1024);
      if (size <= 0 || size > 50) {
        this.$error(this.$t('systemManagement.system.uploadFileSize'));
        return false;
      }
      const formData = new FormData();
      formData.append('file', file);
      uploadSystemVPNMp(formData)
        .then((resp) => {
          const data = _.get(resp, 'data', '') || null;
          this.vpnModel.url = _.get(data.data, 'http_url', '') || '';
        })
        .catch((error) => {
          that.fileList = [];
        });
    },
    deleteData(data) {
      this.vpnModel.url = '';
    },
    // 新增vpn
    vpnSubmitForm() {
      const that = this;
      let submitFormDataVpn = [
        {
          key_name: 'vpn_packages',
          value: '[]',
        },
      ];
      let vpnValue = _.cloneDeep(this.tableData);
      vpnValue.push({
        id:
          Date.parse(new Date()) *
          parseInt(Math.random() * (10 - 1 + 1) + 1, 10),
        name: this.vpnModel.name,
        description: this.vpnModel.description,
        url: this.vpnModel.url,
      });
      let vpnValueStr = JSON.stringify(vpnValue);
      submitFormDataVpn[0].value = vpnValueStr;
      that.$refs.vpnFormRef.submit(submitFormDataVpn).then(() => {
        that.$success(that.$t('systemManagement.system.addSuccess'));
        that.$refs.vpnFormRef.resetFields();
        that.fileList = [];
        this.getSystemInfo('vpnUpdate');
      });
    },
    // 下载
    downloadFile(file) {
      if (file) {
        this.$request.download(file);
      }
    },
    submitFormDataVpn() {
      let submitFormDataVpn = [
        {
          key_name: 'vpn_packages',
          value: '[]',
        },
      ];
      let vpnValue = _.cloneDeep(this.tableData);
      let vpnValueStr = JSON.stringify(vpnValue);
      submitFormDataVpn[0].value = vpnValueStr;
      return submitFormDataVpn;
    },
    // 删除
    vpnDelete(data, done) {
      let index = this.tableData.findIndex((item) => {
        return item.id == data.id;
      });
      this.tableData.splice(index, 1);
      let submitFormDataVpn = this.submitFormDataVpn();
      this.$request
        .post('/sys/config/updateall', submitFormDataVpn, {
          baseURL: '/api/mp',
        })
        .then(() => {
          this.getSystemInfo('vpnUpdate');
        });
      done();
    },
    submitForm(done) {
      const that = this;
      let modelTemp = _.cloneDeep(this.model);
      delete modelTemp.vlan_bucket;
      const submitFormData = [];
      for (let key in modelTemp) {
        submitFormData.push({
          key_name: key,
          value: modelTemp[key],
        });
      }
      that.$refs.elFormRef
        .submit(submitFormData)
        .then(() => {
          that.$success(that.$t('systemManagement.system.updateSuccess'));
          that.getSystemInfo();
        })
        .finally(() => {
          done();
        });
    },
  },
};
</script>

<style lang="scss" scoped>
.flex-box {
  display: flex;
  justify-content: center;
}
.vpn-table {
  margin-left: 100px;
}
</style>
<style lang="scss" scoped>
::v-deep .vpn-form .el-form {
  padding: 0 0 20px 0;
}
.system-setting {
  .el-input-number {
    width: 100%;
    ::v-deep.el-input__inner {
      text-align: left;
    }
  }
  .AutomaticDataClearingTime {
    width: 180px;
  }
}
</style>
