<template>
  <cb-inner-page :background="false">
    <div class="dynamic-efficiency-form">
      <cb-form
        ref="fromRef"
        label-position="right"
        :label-width="language === 'en-US' ? '190px' : '110px'"
        :model.sync="model"
        :rules="rules"
        :baseURL="baseURL"
        :url="url"
        :json="true"
      >
        <cb-form-item
          :label="$t('situation3DManage.dynamicEffectName')"
          prop="name"
        >
          <cb-input
            v-model="model.name"
            :placeholder="$t('situation3DManage.inputDynamicName')"
            type="text"
          ></cb-input>
        </cb-form-item>
        <!-- 上传缩略图 -->
        <cb-form-item
          :label="$t('situation3DManage.thumbnail')"
          prop="thumbnail"
        >
          <cb-upload-file
            type="image"
            :limit="1"
            :fetch-promise="upLoadLogo"
            :fileSize="2 * 1024 * 1024"
            v-model="logoList"
            accept=".png,.jpg,.jpeg"
            @delete="deleteLogo"
          >
            <template v-slot:tip>
              <div class="tips">
                {{ $t('situation3DManage.thumbnailTips') }}
              </div>
            </template>
          </cb-upload-file>
        </cb-form-item>
        <cb-form-item :label="$t('situation3DManage.category')" prop="category">
          <cb-select
            v-model="model.category"
            titleField="name"
            valueField="resource_id"
            :options="options"
            :placeholder="$t('situation3DManage.selectCategory')"
          />
        </cb-form-item>
        <cb-form-item
          :label="$t('situation3DManage.dynamicEffectFile')"
          prop="source_node_dynamic_file"
        >
          <cb-upload-file
            type="file"
            v-model="sourceList"
            :fetch-promise="uploadSource"
            :fileSize="200 * 1024 * 1024"
            accept=".zip"
            @delete="deleteSource"
          >
            <template v-slot:tip>
              <div class="tips">
                {{ $t('situation3DManage.effectfileTips') }}
              </div>
            </template>
          </cb-upload-file>
        </cb-form-item>
        <div slot="fixedBottom">
          <cb-button-group space="middle">
            <cb-button button-type="confirm" @click="submitForm"></cb-button>
            <cb-button
              hollow
              button-type="cancel"
              @click="resetForm"
            ></cb-button>
          </cb-button-group>
        </div>
      </cb-form>
    </div>
  </cb-inner-page>
</template>

<script>
// import { getEffectCategory } from '@/api/cms/situation-management/dynamic-efficiency';
// import { uploadImage, uploadFile } from '@/api/common';
// /**
//  * 长度校验
//  */
import { validateTitleLength255 } from '@/utils/rules-cms.js';
import { getLanguage } from '@cyber/helper';
export default {
  components: {},
  props: {},
  data() {
    return {
      language: getLanguage(),
      baseURL: '/api/ojj',
      url: '/situation/dynamic_effect_library',
      model: {
        name: '',
        category: '',
        thumbnail: '',
        source_node_dynamic_file: '',
        focus: '1',
        color: '',
        line: '',
        line_size: 1,
      },
      logoList: [],
      sourceList: [],
      targetList: [],
      rules: {
        name: [
          {
            required: true,
            message: this.$t('situation3DManage.inputDynamicName'),
            trigger: ['blur', 'change'],
          },
          { validator: validateTitleLength255, trigger: 'blur' },
        ],
        thumbnail: [
          {
            required: true,
            message: this.$t('situation3DManage.uploadThumbnail'),
            trigger: ['blur', 'change'],
          },
        ],
        category: [
          {
            required: true,
            message: this.$t('situation3DManage.selectCategory'),
            trigger: ['blur', 'change'],
          },
        ],
        source_node_dynamic_file: [
          {
            required: true,
            message: this.$t('situation3DManage.uploadEffectFile'),
            trigger: ['blur', 'change'],
          },
        ],
      },
      options: [],
    };
  },
  watch: {},
  computed: {},
  created() {},
  mounted() {
    // this.getEffectCategory();
  },
  methods: {
    // 获取动效类型
    getEffectCategory() {
      getEffectCategory().then((res) => {
        const data = _.get(res, 'data.data', []);
        this.options = data;
        this.model.category = data[0]?.resource_id || '';
      });
    },

    // 上传缩略图
    upLoadLogo(file) {
      const formData = new FormData();
      formData.append('file', file);
      uploadImage(formData).then((resp) => {
        const data = _.get(resp, 'data.data', '') || 'null';
        this.model.thumbnail = data && data.file_path;
      });
    },
    uploadSource(file) {
      // 上传源节点
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', 9);
      uploadFile(formData).then((resp) => {
        const data = _.get(resp, 'data.data', '') || 'null';
        this.model.source_node_dynamic_file = data && data.file_path;
      });
    },

    deleteLogo() {
      this.model.thumbnail = '';
      this.logoList = [];
    },
    deleteSource() {
      this.model.source_node_dynamic_file = '';
      this.sourceList = [];
    },

    submitForm() {
      this.$refs.fromRef.submit().then((res) => {
        this.$router.push({
          name: 'dynamic-effects-resources-list',
        });
      });
    },
    resetForm() {
      this.$router.push({
        name: 'dynamic-effects-resources-list',
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.dynamic-efficiency-form {
  background: var(--bg-color-2);
  .line-content {
    display: flex;
  }
}
</style>
