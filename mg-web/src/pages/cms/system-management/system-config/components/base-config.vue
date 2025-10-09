<template>
  <div>
    <cb-form
      ref="elFormRef"
      label-position="right"
      label-width="120px"
      :model.sync="model"
      :rules="rules"
      :url="url"
      :baseURL="baseURL"
      json
    >
      <cb-form-item
        :label="$t('systemManagement.system.systemName')"
        prop="system_name"
      >
        <cb-input v-model="model.system_name" />
      </cb-form-item>
      <cb-form-item
        label="副标题"
        prop="sub_system_name"
      >
        <cb-input v-model="model.sub_system_name" />
      </cb-form-item>
      <cb-form-item
        :label="$t('systemManagement.system.versionData')"
        prop="copyright"
        class="cb-form-textarea"
      >
        <cb-input v-model="model.copyright" type="textarea" />
      </cb-form-item>
<!--      <cb-form-item-->
<!--        v-if="showScenePerson"-->
<!--        :label="$t('systemManagement.system.scenesPerson')"-->
<!--        prop="env_per_person"-->
<!--      >-->
<!--        <cb-input-number-->
<!--          v-model="model.env_per_person"-->
<!--          controls-position="right"-->
<!--          :min="0"-->
<!--          :max="500"-->
<!--        />-->
<!--      </cb-form-item>-->
<!--      <cb-form-item-->
<!--        :label="$t('systemManagement.system.isRegistered')"-->
<!--        prop="public_register"-->
<!--      >-->
<!--        <cb-switch-->
<!--          v-model="model.public_register"-->
<!--          active-value="1"-->
<!--          inactive-value="0"-->
<!--        >-->
<!--        </cb-switch>-->
<!--      </cb-form-item>-->
<!--      <div class="row-form-item">-->
<!--        <cb-form-item-->
<!--          v-show="model.public_register === '1'"-->
<!--          :label="$t('systemManagement.system.registerUser')"-->
<!--          prop="user_audit"-->
<!--        >-->
<!--          <cb-switch-->
<!--            v-model="model.user_audit"-->
<!--            active-value="1"-->
<!--            inactive-value="0"-->
<!--          >-->
<!--          </cb-switch>-->
<!--        </cb-form-item>-->
<!--        <cb-form-item-->
<!--          v-if="model.public_register === '1' && model.user_audit === '0'"-->
<!--          prop="register_user_default_role"-->
<!--          :label="$t('systemManagement.system.registerDefaultUser')"-->
<!--        >-->
<!--          <cb-select-->
<!--            v-model="model.register_user_default_role"-->
<!--            :options="roleList"-->
<!--          />-->
<!--        </cb-form-item>-->
<!--      </div>-->
      <cb-form-item :label="$t('systemManagement.system.openRecordingScreen')">
        <cb-switch
          v-model="model.screen_recording"
          active-value="1"
          inactive-value="0"
        >
        </cb-switch>
        <div class="record-tip">
          {{ $t('systemManagement.system.recordTip') }}
        </div>
      </cb-form-item>
      <cb-form-item :label="$t('systemManagement.system.openTheme')">
        <cb-switch
          v-model="model.system_theme"
          active-value="1"
          inactive-value="0"
        >
        </cb-switch>
      </cb-form-item>
<!--      <cb-form-item-->
<!--        v-if="langSwitch"-->
<!--        :label="$t('systemManagement.system.openLanguage')"-->
<!--      >-->
<!--        <cb-switch-->
<!--          v-model="model.system_lang"-->
<!--          active-value="1"-->
<!--          inactive-value="0"-->
<!--        >-->
<!--        </cb-switch>-->
<!--      </cb-form-item>-->
      <cb-form-item
        :label="$t('systemManagement.system.systemLogo')"
        prop="logo"
      >
        <cb-upload-file
          type="image"
          :limit="1"
          :fetch-promise="upLoad"
          tipText=""
          :fileSize="fileSize"
          v-model="list"
          accept=".png,.jpg,.jpeg"
          @delete="deleteLogo"
        >
          <template v-slot:tip>
            <div class="tips">
              {{ $t('systemManagement.system.logoSize') }},
              {{ $t('systemManagement.system.logoFormat') }}
            </div>
          </template>
        </cb-upload-file>
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
import {
  getRoleData,
  getSystemSettingSystemConfig,
  uploadSystemImgageMp,
  getModulesActivedApi,
} from '@/api/system';
import { getResponse } from '@cyber/helper';
import _ from 'lodash';
import Utils from '@/utils/utils';
import {
  remoteList,
  backupIntervalList,
} from '@/pages/cms/system-management/constant.js';

export default {
  data() {
    return {
      remoteList,
      backupIntervalList,
      url: '/sys/config/updateall',
      baseURL: '/api/mp',
      list: [],
      fileList: [],
      roleList: [],
      showScenePerson: false,
      model: {
        system_name: '',
        sub_system_name: '',
        copyright: '',
        env_per_person: '',
        logo: '',
        public_register: '1',
        user_audit: '1',
        register_user_default_role: '',
        screen_recording: '1',
        system_theme: '0',
        system_lang: '0',
      },
      fileSize: 1024 * 1024 * 2,
      rules: {
        system_name: [
          {
            required: true,
            message: this.$t('systemManagement.system.inputSystemName'),
            trigger: 'blur',
          },
          { validator: Utils.validateTitleLength, trigger: 'blur' },
        ],
        register_user_default_role: [
          {
            required: true,
            message: this.$t('systemManagement.system.changeDefaultRole'),
            trigger: 'blur',
          },
        ],
      },
    };
  },
  computed: {
    langSwitch() {
      // 如果在public/config.json中设置了系统语言，则不展示语言切换按钮
      return _.get(this.$store.state.config.configData, 'language')
        ? false
        : true;
    },
  },
  created() {
    this.getModulesActived();
    this.getRoleList();
    this.getSystemInfo();
  },
  methods: {
    // 获取授权模块信息
    getModulesActived() {
      getModulesActivedApi().then((res) => {
        const modulesItems = _.get(res, 'data.data.items', []);
        const haveOJ = _.findIndex(modulesItems, (item) => {
          return item.key === 'LCS-FUNC-CR-SHIXUN' && item.value === '1';
        });
        if (haveOJ > -1) {
          //授权实训模块
          this.showScenePerson = true;
        }
      });
    },
    /* 获取角色 */
    getRoleList() {
      getRoleData().then((res) => {
        const data = _.get(res, 'data.data', []);
        const list = data.map((item) => {
          return {
            label: item.name,
            value: item.id,
          };
        });
        this.roleList = [...list];
      });
    },
    // 获取基础配置信息
    getSystemInfo() {
      getSystemSettingSystemConfig().then((res) => {
        const dataResult = _.get(res, 'data.data', []);
        for (let key in this.model) {
          for (let i = 0; i < dataResult.length; i++) {
            if (key === dataResult[i].key_name) {
              if (key == 'logo') {
                this.list = [];
                if (dataResult[i].value) {
                  this.list.push({ url: dataResult[i].value });
                }
                this.model.logo = dataResult[i].value;
              } else {
                this.model[key] = dataResult[i].value;
              }
              break;
            }
          }
        }
        const data = _.cloneDeep(this.model);
        this.$store.dispatch('user/setSystemSetting', data);
      });
    },
    upLoad(file) {
      const formData = new FormData();
      formData.append('file', file);
      uploadSystemImgageMp(formData).then((resp) => {
        const data = _.get(resp, 'data', '') || null;
        this.model.logo = _.get(data.data, 'http_url', '') || '';
      });
    },
    deleteLogo() {
      this.model.logo = '';
      this.list = [];
    },
    upLoadFile(file) {
      const size = file.size / (1024 * 1024);
      if (size <= 0 || size > 50) {
        this.$error(this.$t('systemManagement.system.uploadFileSize'));
        return false;
      }
      const formData = new FormData();
      formData.append('file', file);
      uploadImgageMp(formData)
        .then((resp) => {
          const data = _.get(resp, 'data', '') || null;
          this.vpnModel.url = _.get(data.data, 'http_url', '') || '';
        })
        .catch((error) => {
          that.fileList = [];
        });
    },
    deleteFile(data) {
      this.vpnModel.url = '';
    },
    submitForm(done, msg = true) {
      const submitFormData = [];
      if (this.model.user_audit === '1') {
        this.model.register_user_default_role = '';
      }
      for (let key in this.model) {
        submitFormData.push({
          key_name: key,
          value: this.model[key],
        });
      }
      this.$refs.elFormRef
        .submit(submitFormData)
        .then(() => {
          msg &&
            this.$success(this.$t('systemManagement.system.updateSuccess'));
          this.getSystemInfo();
          document.title = this.model.system_name;
          done();
        })
        .catch((err) => {
          const code = getResponse(err).code;
          if (code === 'MP-000001') {
            this.model.user_audit = '1';
            this.submitForm(done, false);
          } else {
            // this.getSystemInfo();
            done();
          }
        });
    },
  },
};
</script>

<style lang="scss" scoped>
.record-tip {
  color: var(--neutral5);
  line-height: 1;
  margin-top: 10px;
}
.row-form-item {
  display: flex;
}
</style>
