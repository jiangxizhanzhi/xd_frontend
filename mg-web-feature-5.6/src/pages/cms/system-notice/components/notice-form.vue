<template>
  <div>
    <cb-form
      ref="elFormRef"
      label-position="right"
      label-width="80px"
      :model.sync="model"
      :rules="rules"
      :url="url"
      baseURL="/api/mp"
      :id="id"
      json
      :isBgColor="true"
    >
      <cb-form-item :label="$t('notice.title')" prop="title">
        <cb-input v-model="model.title"></cb-input>
      </cb-form-item>
      <cb-form-item :label="$t('notice.type')" prop="type">
        <cb-select v-model="model.type" :options="typeList" width="420px" />
      </cb-form-item>
      <cb-form-item :label="$t('notice.content')" prop="content">
        <cb-markdown
          v-model="model.content"
          :uploadImages="_uploadImages"
          :uploadFile="_uploadFile"
          style="height: 400px"
          :uploadZip="uploadZip"
          :exportFile="exportFile"
        />
      </cb-form-item>
      <cb-form-item :label="$t('notice.group')" prop="role">
        <cb-select
          v-model="roleData"
          :options="roleList"
          width="420px"
          titleField="name"
          valueField="id"
          @change="handleChangeRole"
          :first="{
            id: '',
            name: $t('notice.groupEnum.all'),
          }"
        />
      </cb-form-item>
      <cb-form-item :label="$t('notice.organization')" prop="organization">
        <cb-cascader
          v-model="organizationSet"
          :options="organizationOptions"
          :props="optionProps"
          @change="handleChange"
          clearable
          style="width: 420px"
        />
      </cb-form-item>
      <template slot="fixedBottom">
        <cb-button-group space="middle">
          <cb-button buttonType="confirm" @click="submitForm" />
          <cb-button buttonType="cancel" @click="resetForm" />
        </cb-button-group>
      </template>
    </cb-form>
  </div>
</template>

<script>
import constant from '../constant.js';
import { getOrganization, roleData, typeData } from '@/api/notice';
import { uploadNoticeImage, uploadNoticeFile, uploadMd } from '@/api/system';
import Utils from '@/utils/utils';
import _ from 'lodash';
export default {
  props: {
    id: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      loadingOrgs: false,
      model: {
        title: '',
        type: '',
        content: '',
        organization: '',
        role_ids: [],
        org_ids: [],
        role: '',
      },
      roleData: '',
      organizationSet: [],
      organizationOptions: [],
      url: '/sys/notice/',
      rules: {},
      typeList: [],
      roleList: [],
      optionProps: {
        checkStrictly: true,
        expandTrigger: 'hover',
        value: 'id',
        label: 'name',
        children: 'children',
      },
    };
  },
  created() {
    const that = this;
    that.rules = {
      title: [
        {
          required: true,
          message: that.$t('notice.validator.inputTitle'),
          trigger: 'blur',
        },
        {
          min: 4,
          max: 40,
          message: that.$t('notice.validator.titleLength'),
          trigger: 'blur',
        },
      ],
      content: [
        {
          required: true,
          message: that.$t('notice.validator.inputContent'),
          trigger: 'blur',
        },
      ],
      type: [
        {
          required: true,
          trigger: 'blur',
        },
      ],
    };
  },
  mounted() {
    const that = this;
    that.getRoleList();
    that.getTypeList();
    if (that.id) {
      this.$refs.elFormRef.getModelData();
      that.pageInitialization = [this.$refs.elFormRef.getModelData()];
      that.pageInitialization.push(that.fetchOrgs());
      Promise.all(that.pageInitialization).then(([notice, orgs]) => {
        const { org_ids, role_ids } = notice;
        that.roleData = (role_ids && role_ids.toString()) || '';
        that.organizationSet = Utils.buildCascaderValue(
          orgs,
          org_ids && org_ids.toString(),
        );
      });
    } else {
      that.fetchOrgs();
    }
  },
  methods: {
    //遍历数组得到新数组,拿到默认键值对数组label value
    getNewArr(data) {
      const list = data.map((item) => {
        return {
          label: item.name,
          value: item.code,
        };
      });
      return list;
    },
    getRoleList() {
      roleData().then((res) => {
        this.roleList = _.get(res, 'data.data', []);
      });
    },
    getTypeList() {
      typeData().then((res) => {
        let tempList = _.get(res, 'data.data', []);
        this.typeList = this.getNewArr(tempList);
        if (!this.id) {
          this.model.type = this.typeList[0].value;
        }
      });
    },
    fetchOrgs() {
      const that = this;
      that.loadingOrgs = true;
      return new Promise((res) => {
        getOrganization()
          .then((resp) => {
            that.organizationOptions = _.get(resp, 'data.data', []);
            res(resp.data.data);
          })
          .finally(() => {
            that.loadingOrgs = false;
          });
      });
    },
    handleChange(value) {
      if (value && value.length > 0) {
        this.model.organization = value[value.length - 1];
        this.model.org_ids = [value[value.length - 1]];
      } else {
        this.model.organization = '';
        this.model.org_ids = [];
      }
    },
    handleChangeRole(value) {
      this.model.role = value;
      this.model.role_ids = [value];
    },

    // markdown 上传图片
    _uploadImages($file) {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = () => {
          if (this.filterImages($file[0])) {
            const formdata = new FormData();
            formdata.append('file', $file[0]);
            uploadNoticeImage(formdata).then((res) => {
              const url = _.get(res, 'data.data.inner_http_url');
              resolve([{ url }]);
            });
          }
        };
        reader.readAsDataURL($file[0]);
      });
    },
    // markdown 上传文件
    _uploadFile($file) {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = () => {
          const formdata = new FormData();
          formdata.append('file', $file[0]);
          uploadNoticeFile(formdata).then((res) => {
            const url = _.get(res, 'data.data.inner_http_url');
            resolve([{ name: $file[0].name, url }]);
          });
        };
        reader.readAsDataURL($file[0]);
      });
    },
    uploadZip(file) {
      return new Promise((resolve, reject) => {
        const formdata = new FormData();
        formdata.append('md', file);
        uploadMd(formdata).then((res) => {
          const data = _.get(res, 'data.data', []);
          const is_extract = data.is_extract;
          if (is_extract) {
            this.model.content = data.content;
          }
        });
      });
    },
    exportFile() {
      this.$request.download('/cpms/built_in/Demo.zip');
    },
    // 上传图片校验
    filterImages(file) {
      const suffix = _.last(_.split(file.name, '.'));
      if (!_.includes(['jpg', 'jpeg', 'png'], _.toLower(suffix))) {
        this.$message.error(this.$t('notice.validator.pleaseUploadPictures'));
        return false;
      }
      return true;
    },
    submitForm() {
      const that = this;
      const data = _.cloneDeep(this.model);
      delete data.role;
      delete data.organization;
      const customFormData = {
        ...data,
        is_public:
          this.model.role_ids &&
          this.model.role_ids.length &&
          this.model.role_ids.toString()
            ? 0
            : 1,
      };
      that.$refs.elFormRef.submit(customFormData).then(() => {
        that.$router.push({ path: '/admin/system-notice' });
      });
    },
    resetForm() {
      const that = this;
      that.$router.push({ path: '/admin/system-notice' });
    },
  },
};
</script>

<style lang="scss"></style>
