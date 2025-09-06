<template>
  <cb-inner-page :background="false" v-loading="loading">
    <cb-form
      ref="formRef"
      label-position="right"
      label-width="120px"
      :model.sync="model"
      :rules="rules"
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
      <cb-form-item :label="$t('traffic.pcapFile')" prop="file_name">
        <cb-input v-model="model.file_name" style="display: none" />
        <cb-upload-file
          type="file"
          accept=".pcap"
          v-model="list"
          @delete="deleteFile"
          :fetch-promise="uploadFunc"
          :file-size="fileSize"
        >
          <template v-slot:tip
            >{{ $t('traffic.onlyUploadPcap') }}
            <cb-button
              type="text"
              v-if="model.pcap_file_path"
              @click="handleClick"
              >{{ $t('traffic.pcapFileDownload') }}</cb-button
            ></template
          >
        </cb-upload-file>
      </cb-form-item>
      <cb-form-item :label="$t('table.type')" prop="category">
        <cb-select v-model="model.category" :options="categoryOptions" />
      </cb-form-item>
      <cb-form-item
        v-if="model.protocol_list.length"
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
import {
  validateTitleLength,
  validateDescriptionLength,
  validateProtocolList,
} from '@/utils/rules-cms';
import '@/lang/all-lang/index';
import { trans } from '@/lang';
import { getOptionList, importPcap } from '@/api/traffic/traffic';
export default {
  name: 'TrafficDetail',
  props: ['id'],
  data() {
    return {
      loading: false,
      url: '/flow/info/background',
      model: {
        title: '',
        pcap_file: null,
        pcap_file_path: null,
        file_name: '',
        introduction: '',
        category: null,
        protocol_list: [],
        protocols: '',
      },
      fileSize: 1024 * 1024 * 100,
      list: [],
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
        pcap_file: [
          {
            required: true,
            message: this.$t('traffic.uploadPcapFile'),
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
        introduction: [
          {
            required: true,
            message: this.$t('traffic.inputTrafficInf'),
            trigger: 'blur',
          },
          { validator: validateDescriptionLength, trigger: 'blur' },
        ],
        category: [
          {
            required: true,
            message: this.$t('traffic.selectCategory'),
            trigger: 'blur',
          },
        ],
        protocol_list: [
          {
            required: true,
            validator: validateProtocolList,
            trigger: 'blur',
          },
        ],
        loop: [
          {
            required: true,
            message: this.$t('traffic.inputPlayTimes'),
            trigger: 'blur',
          },
        ],
        multiplier: [
          {
            required: true,
            message: this.$t('traffic.inputPlayMultiple'),
            trigger: 'blur',
          },
        ],
        mbps: [
          {
            required: true,
            message: this.$t('traffic.inputPlayMbps'),
            trigger: 'blur',
          },
        ],
      },
    };
  },
  mounted() {
    if (this.id) {
      this.$refs.formRef.getModelData().then((res) => {
        this.list = [{ name: res.file_name, url: res.pcap_file_path }];
      });
    }
    this.getOptionsList();
  },
  computed: {},
  methods: {
    removeBlank() {
      this.model.introduction = this.model.introduction.trim();
    },
    uploadFunc(file) {
      this.loading = true;
      if (!file.name || !this.$_.endsWith(file.name, '.pcap')) {
        this.$message.error(this.$t('traffic.uploadPcapFile'));
        this.list = [];
        return;
      }
      this.model.pcap_file = file;
      this.model.file_name = file.name;
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
    uploadSuccess(data) {
      this.model.pcap_file = data.pcap_file;
      this.model.file_name = data.file_name;
    },
    deleteFile() {
      this.model.pcap_file = '';
      this.model.file_name = '';
      this.model.pcap_file_path = '';
    },
    handleClick() {
      this.$request.download(this.model.pcap_file_path);
    },

    submitForm() {
      //无值时提交前删除此值
      if (!this.model.pcap_file_path) {
        delete this.model.pcap_file_path;
      }
      //协议数据转换为字符串，后端用来解析
      this.model.protocols = JSON.stringify(this.model.protocol_list);
      this.$refs.formRef.submit().then(() => {
        this.$router.push({ path: '/admin/traffic/background' });
      });
    },
    resetForm() {
      this.$router.push({ path: '/admin/traffic/background' });
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
    trans,
  },
};
</script>

<style lang="scss" scoped>
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
