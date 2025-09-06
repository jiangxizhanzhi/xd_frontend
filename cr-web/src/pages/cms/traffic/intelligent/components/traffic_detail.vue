<template>
  <cb-inner-page :background="false" v-loading="loading">
    <cb-form
      ref="formRef"
      :label-width="getI18Nn().locale == 'en-US' ? '180px' : '140px'"
      :model.sync="model"
      :rules="resourceType === 0 ? rules : rules2"
      :url="url"
      :id="id"
      :isBgColor="true"
      baseURL="/api/mp"
    >
      <cb-form-item :label="$t('traffic.name')" prop="title">
        <cb-input v-model="model.title" />
      </cb-form-item>

      <cb-form-item :label="$t('traffic.description')" prop="introduction">
        <cb-input
          v-model="model.introduction"
          type="textarea"
          @blur="removeBlank"
        />
      </cb-form-item>

      <cb-form-item :label="$t('table.type')" prop="category">
        <cb-select v-model="model.category" :options="categoryOptions" />
      </cb-form-item>
      <cb-form-item>
        <cb-radio-group
          v-model="resourceType"
          class="cb-checkbox-boxs"
          style="margin-right: 20px"
          @change="change"
        >
          <cb-radio :label="0" style="margin-right: 16px">{{
            $t('traffic.pcapFile')
          }}</cb-radio>
          <cb-radio :label="1">{{ $t('traffic.ScriptFile') }}</cb-radio>
        </cb-radio-group>
      </cb-form-item>
      <!-- pcap文件 -->
      <cb-form-item
        v-show="resourceType === 0"
        label="pcap文件"
        prop="file_name"
      >
        <cb-input v-model="model.file_name" style="display: none" />
        <cb-upload-file
          type="file"
          accept=".pcap"
          v-model="pcapList"
          @delete="deletePcap"
          :fetch-promise="uploadPcap"
          :file-size="100 * 1024 * 1024"
        >
          <template v-slot:tip>
            <div class="tips">{{ $t('traffic.onlyUploadPcap') }}</div>
          </template>
        </cb-upload-file>
      </cb-form-item>
      <!-- pcap有效协议 -->
      <cb-form-item
        v-if="resourceType === 0 && model.protocol_list.length"
        :label="$t('traffic.pcapValidProtocol')"
        prop="protocol_list"
        class="protocol-list"
      >
        <div
          v-for="(item, index) in model.protocol_list"
          :key="index"
          class="protocol"
        >
          <div>
            <cb-checkbox
              v-model="item.marked"
              :label="item.protocol_name"
              :true-label="1"
              :false-label="0"
            >
              {{ item.protocol_name }} — {{ item.rate }}%
            </cb-checkbox>
            <div class="desc">
              {{ item.desc }}
            </div>
          </div>
        </div>
      </cb-form-item>
      <!-- 脚本文件 -->
      <cb-form-item
        v-show="resourceType === 1"
        :label="$t('traffic.uploadScript')"
      >
        <cb-upload-file
          type="file"
          accept=".sh,.py"
          v-model="list"
          @delete="deleteFile"
          :fetch-promise="uploadFunc"
          :file-size="fileSize"
        >
          <template v-slot:tip>
            <div class="tips">
              {{ $t('traffic.codeFileFormat') }}
              {{ $t('traffic.codeDemoFile') }}
              <template v-for="item in demoFile">
                [
                <a
                  :key="item.name"
                  :href="item.file_url"
                  :download="item.name"
                  >{{ item.name }}</a
                >]
              </template>
              <cb-button type="text" v-if="model.file" @click="handleClick">{{
                $t('traffic.pcapFileDownload')
              }}</cb-button>
            </div>
          </template>
        </cb-upload-file>
      </cb-form-item>
      <cb-form-item
        v-if="resourceType === 1"
        :label="$t('traffic.code')"
        prop="code"
      >
        <script-code
          :code.sync="model.code"
          :suffix.sync="model.suffix"
          :disable="disable"
        />
      </cb-form-item>
      <cb-form-item v-if="resourceType === 1" :label="$t('traffic.params')">
        <traffic-parameter-edit-modal
          :param="params"
          ref="params"
          @saveParam="saveParameter"
        />
      </cb-form-item>

      <div slot="fixedBottom">
        <cb-button-group space="middle">
          <cb-button button-type="confirm" @click="submitForm"> </cb-button>
          <cb-button button-type="cancel" @click="resetForm"> </cb-button>
        </cb-button-group>
      </div>
    </cb-form>
  </cb-inner-page>
</template>

<script>
import TrafficParameterEditModal from '@/components/App/Traffic/TrafficParameterEditModal';
import ScriptCode from './codemirror';
import {
  validateTitleLength,
  validateDescriptionLength,
  validateProtocolList,
} from '@/utils/rules-cms';
import _ from 'lodash';
import '@/lang/all-lang/index';
import { trans } from '@/lang';
import { getI18N } from '@cyber/helper';

import {
  fetchDemoFile,
  getOptionList,
  importPcap,
} from '@/api/traffic/traffic';

export default {
  name: 'TrafficDetail',
  props: ['id'],
  components: {
    ScriptCode,
    TrafficParameterEditModal,
  },
  data() {
    return {
      loading: false,
      url: '/flow/info/attack',
      demoFile: [],
      disable: false,
      list: [],
      pcapList: [],
      fileSize: 1024 * 10,
      resourceType: 0,
      model: {
        parameter: '',
        title: null,
        introduction: null,
        resourceType: 0,
        pcapFile: null,
        fileName: null,
        protocol_list: [],
        protocols: '',
        file_name: '',
        file_path: '',
        code: null,
        category: null,
        run_cmd: '',
        suffix: this.$CONSTANT.Traffic.Intelligent.ScriptType.PYTHON.value,
      },
      params: {},
      error: '',
      categoryOptions: [],
      rules: {
        title: [
          {
            required: true,
            message: this.$t('traffic.inputName'),
            trigger: 'blur',
          },
          { validator: validateTitleLength, trigger: 'blur' },
        ],
        introduction: [
          {
            required: true,
            message: this.$t('traffic.inputTrafficInf'),
            trigger: 'blur',
          },
          { validator: validateDescriptionLength, trigger: 'blur' },
        ],
        code: [
          {
            required: true,
            message: this.$t('traffic.codeEmpty'),
            trigger: 'blur',
          },
        ],
        category: [
          {
            required: true,
            message: this.$t('traffic.selectCategory'),
            trigger: 'blur',
          },
        ],
        file_name: [
          {
            required: true,
            message: this.$t('traffic.uploadPcapFile'),
            trigger: 'change',
          },
        ],
        protocol_list: [
          {
            required: true,
            validator: validateProtocolList,
            trigger: 'blur',
          },
        ],
      },
      rules2: {
        title: [
          {
            required: true,
            message: this.$t('traffic.inputName'),
            trigger: 'blur',
          },
          { validator: validateTitleLength, trigger: 'blur' },
        ],
        introduction: [
          {
            required: true,
            message: this.$t('traffic.inputTrafficInf'),
            trigger: 'blur',
          },
          { validator: validateDescriptionLength, trigger: 'blur' },
        ],
        code: [
          {
            required: true,
            message: this.$t('traffic.codeEmpty'),
            trigger: 'blur',
          },
        ],
        category: [
          {
            required: true,
            message: this.$t('traffic.selectCategory'),
            trigger: 'blur',
          },
        ],
        // file_name: [
        //   {
        //     required: true,
        //     message: this.$t('traffic.uploadPcapFile'),
        //     trigger: 'change',
        //   },
        // ],
      },
    };
  },
  watch: {
    // 监听code的校验
    'model.code'(val) {
      if (val.trim()) {
        this.$refs.formRef.clearValidate('code');
      } else {
        this.$refs.formRef.validateField('code');
      }
    },
    'model.file_name'(val) {
      if (_.isEmpty(val) && !this.id) {
        if (val.indexOf('.sh') > 0) {
          this.model.suffix =
            this.$CONSTANT.Traffic.Intelligent.ScriptType.SHELL.value;
        } else {
          this.model.suffix =
            this.$CONSTANT.Traffic.Intelligent.ScriptType.PYTHON.value;
        }
        this.disable = true;
      } else {
        this.disable = false;
      }
    },
  },
  computed: {},
  created() {
    // 获取demo文件数据
    fetchDemoFile().then((res) => {
      this.demoFile = res.data.data.demo_list;
    });
  },
  mounted() {
    if (this.id) {
      this.$refs.formRef.getModelData().then((data) => {
        this.resourceType = data.resource_type;
        // this.pcapList = [{ name: data.file_name }];
        // this.$refs.params.params = data.parameter
        //   ? JSON.parse(data.parameter)
        //   : '';
        if (data.resource_type === 0) {
          this.pcapList = [{ name: data.file_name }];
        }
        this.params = data.parameter ? JSON.parse(data.parameter) : '';
      });
    }
    this.getOptionsList();
  },
  methods: {
    change() {
      this.model.file_name = '';
      this.pcapList = [];
      this.list = [];
      this.model.code = '';
    },
    getI18Nn() {
      return getI18N();
    },
    //获取下拉选框options列表数据
    getOptionsList() {
      getOptionList().then((res) => {
        const tempList = (this.options = _.get(res, 'data.data', []));
        this.categoryOptions = tempList.map((item) => {
          return {
            label: item.name,
            value: item.code,
          };
        });
      });
    },
    deleteFile() {
      this.model.file_path = '';
      this.model.file_name = '';
      this.model.code = '';
    },
    deletePcap() {
      this.model.pcapFile = '';
      this.model.file_name = '';
      this.model.file_path = '';
      this.pcapList = [];
    },
    uploadPcap(file) {
      this.loading = true;
      if (!this.isPcap(file)) {
        return false;
      }
      this.model.file_name = file.name;
      this.model.pcapFile = file;
      this.disable = true;

      //上传文件获取支持的协议
      const formData = new FormData();
      formData.append('file', file);
      importPcap(formData)
        .then((res) => {
          const data = _.get(res, 'data.data.protocol_list', []);
          this.model.protocol_list = data;
          this.loading = false;
        })
        .catch(() => {
          this.loading = false;
        });
    },
    uploadFunc(file) {
      if (!this.isScript(file)) {
        this.$message.error(this.$t('traffic.codeFileFormat'));
        return false;
      }
      this.model.file_name = file.name;
      this.disable = true;
      if (file.name.indexOf('.sh') > 0) {
        this.model.suffix =
          this.$CONSTANT.Traffic.Intelligent.ScriptType.SHELL.value;
      } else {
        this.model.suffix =
          this.$CONSTANT.Traffic.Intelligent.ScriptType.PYTHON.value;
      }
      if (this.model.file) {
        this.model.file = '';
      }
      this.readerData(file);
    },
    readerData(rawFile) {
      this.loading = true;
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          const data = e.target.result;
          this.model.code = data;
          this.loading = false;
          resolve();
        };
        reader.readAsText(rawFile);
      });
    },
    isScript(file) {
      return /\.(py|sh)$/.test(file.name);
    },
    isPcap(file) {
      return /\.(pcap)$/.test(file.name);
    },
    // 脚本上传前
    beforeUpload(file) {},
    // 脚本上传完成
    uploadSuccess(data, fileName) {
      this.model.code = data;
      this.model.file_name = fileName;
      this.disable = true;

      if (fileName.indexOf('.sh') > 0) {
        this.model.suffix =
          this.$CONSTANT.Traffic.Intelligent.ScriptType.SHELL.value;
      } else {
        this.model.suffix =
          this.$CONSTANT.Traffic.Intelligent.ScriptType.PYTHON.value;
      }
    },
    saveParameter(param) {
      this.model.parameter = param;
    },
    removeBlank() {
      this.model.introduction = this.model.introduction.trim();
    },
    submitForm() {
      this.model.resourceType = this.resourceType;
      //协议数据转换为字符串，后端用来解析
      this.model.protocols = JSON.stringify(this.model.protocol_list);
      this.$refs.formRef
        .submit()
        .then(() => {
          this.$router.push({ path: '/admin/traffic/intelligent' });
        })
        .catch((err) => {});
    },
    handleClick() {
      this.$request.download(this.model.file);
    },
    resetForm() {
      this.$router.push({ path: '/admin/traffic/intelligent' });
    },
    trans,
  },
};
</script>
<style lang="scss" scoped>
.tips {
  font-size: 14px;
  color: var(--neutral8);
  > a {
    color: var(--primary-color);
  }
}

.cb-checkbox-boxs {
  display: flex;
  align-items: center;
}

.protocol-list {
  .protocol {
    margin-bottom: 10px;
    padding-top: 4px;
  }
  .desc {
    padding-left: 24px;
    font-size: 12px;
    color: var(--neutral5);
    height: 20px;
    line-height: 20px;
  }
}
</style>
