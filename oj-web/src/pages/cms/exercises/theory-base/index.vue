<template>
  <cb-inner-page :background="false">
    <div class="theory-content">
      <cb-search-table
        ref="theoryListRef"
        :baseURL="baseURL"
        :url="url"
        :record-ctg="$t('m.theoreticalBasis')"
        :cols.sync="columns"
        :data.sync="query"
        :selector="tableSelector"
        :selection.sync="multipleSelection"
        row-key="resource_id"
      >
        <template v-slot:search>
          <cb-button button-type="add" @click="push" mr="mr">
            {{ $t('m.add') }}</cb-button
          >
          <cb-button
            :disabled="multipleSelection.length === 0"
            hollow
            button-type="delete"
            @click="deleteSelectedTheory(multipleSelection, $event)"
            >{{ $t('m.delete') }}
          </cb-button>
          <cb-button
            :disabled="multipleSelection.length === 0"
            hollow
            icon="icon-yulan"
            :warnMsg="publicWarnMsg"
            :completeMsg="publicCompleteMsg"
            @click="toggleSelection(multipleSelection, $event)"
            ><span>{{ $t('m.public') }}</span>
          </cb-button>
          <cb-button
            :disabled="multipleSelection.length === 0"
            hollow
            icon="icon-yincang1"
            :warnMsg="hideWarnMsg"
            :completeMsg="hideCompleteMsg"
            @click="close(multipleSelection, $event)"
            ><span>{{ $t('m.hide') }}</span>
          </cb-button>
          <cb-button hollow @click="handleClick">
            <i class="iconfont icon-size">&#xe65b;</i>
            <span class="marleft5">{{ $t('m.upload') }}</span>
          </cb-button>
        </template>
        <template v-slot:filter>
          <cb-select
            v-model="query.practice_set_id"
            :first="{ name: $t('m.allProblem'), resource_id: '' }"
            :options="practice_set_id"
            titleField="name"
            valueField="resource_id"
          ></cb-select>
          <cb-select
            v-model="query.category_id"
            :first="{ name: $t('m.allTypes'), resource_id: '' }"
            :options="category_id"
            titleField="name"
            valueField="resource_id"
          ></cb-select>
          <cb-select
            v-model="query.difficulty"
            :first="{ label: $t('m.allDifficulty'), value: '' }"
            :options="difficultyOptions"
          ></cb-select>
          <!-- 全部题目类型筛选-->
          <cb-select
            v-model="query.theory_type"
            :first="{ label: $t('m.allTopicType'), value: '' }"
            :options="topicTypeOptions"
          ></cb-select>
          <cb-search-input
            v-model="query.pattern"
            :placeholder="$t('m.namePh')"
          ></cb-search-input>
        </template>
        <template v-slot:searchRightArea>
          <cb-button
            type="primary"
            icon="icon-fangxiangguanli"
            @click="toType"
            hollow
            >{{ $t('m.typeManage') }}</cb-button
          >
        </template>

        <template v-slot:difficulty="scope">
          <!-- <div>
            <span>{{ computedDiffculty(scope.data.difficulty) }}</span>
          </div> -->
          <div>
            <span v-if="scope.data.difficulty % 3 === 0">{{
              computedDiffculty(scope.data.difficulty)
            }}</span>
            <span v-if="scope.data.difficulty % 3 === 1">{{
              computedDiffculty(scope.data.difficulty)
            }}</span>
            <span v-if="scope.data.difficulty % 3 === 2">{{
              computedDiffculty(scope.data.difficulty)
            }}</span>
          </div>
        </template>
        <!-- 题目类型 -->
        <template v-slot:theory_type="scope">
          <div>
            {{ optionsTypeLabels[scope.data.theory_type] }}
          </div>
        </template>

        <template v-slot:public="scope">
          <div v-if="scope.data.is_public === true">
            {{ $t('m.public') }}
          </div>
          <div v-else>{{ $t('m.hide') }}</div>
        </template>
        <template v-slot:operate="scope">
          <cb-button
            button-type="edit"
            type="text"
            @click="edit(scope.data.resource_id)"
            >{{ $t('button.edit') }}</cb-button
          >
        </template>
      </cb-search-table>
    </div>
    <cb-dialog
      :title="$t('m.uploadQuestion')"
      :visible.sync="uploadDialogVisible"
      @close="resetForm"
      width="580px"
      v-loading="loading"
    >
      <cb-form
        :model="addForm"
        :rules="addFormRules"
        ref="addFormRef"
        label-width="120px"
      >
        <cb-form-item :label="$t('m.problemSet')" prop="practice_set_id">
          <cb-select
            style="width: 100%"
            v-model="addForm.practice_set_id"
            :options="practice_type"
            titleField="name"
            valueField="resource_id"
          ></cb-select>
        </cb-form-item>
        <!-- 理论基础上传题目方向去除 -->
        <!-- <cb-form-item :label="$t('m.direction')" prop="category_id">
          <cb-select
            v-model="addForm.category_id"
            style="width: 100%"
            :options="categorybox"
            titleField="name"
            valueField="resource_id"
          ></cb-select>
        </cb-form-item> -->

        <cb-form-item :label="$t('m.annex')" prop="fileobj">
          <cb-upload-file
            ref="upload"
            accept=".xls,.xlsx"
            type="file"
            v-model="list"
            @delete="theoryRemove"
            :fetch-promise="uploadFunc"
            ><template v-slot:tip>
              <div class="tips">
                {{ $t('m.support') }}(.xls,.xlsx){{ $t('m.formatFile') }},
                {{ $t('m.downloadTemplate') }}: [<cb-link
                  class="underlineStyle"
                  :href="
                    getI18Nn().locale == 'en-US' ? xlsdownloadEn : xlsdownload
                  "
                  download="excel_demo.xls"
                  :underline="false"
                  >excel_demo.xls</cb-link
                >]
                <!-- ,<cb-link
                  class="underlineStyle"
                  :href="
                    getI18Nn().locale == 'en-US' ? txtdownloadEn : txtdownload
                  "
                  download="txt_demo.txt"
                  :underline="false"
                  >txt_demo.txt</cb-link
                > -->
              </div>
            </template>
          </cb-upload-file>
        </cb-form-item>
      </cb-form>

      <span class="dialog-footer" slot="footer">
        <cb-button button-type="confirm" @click="upload" mr="mr">{{
          $t('button.confirm')
        }}</cb-button>
        <cb-button button-type="cancel" @click="resetForm">{{
          $t('button.cancel')
        }}</cb-button>
      </span>
    </cb-dialog>
  </cb-inner-page>
</template>
<script>
import Http from '@/utils/http.js';
import { errorMessage } from '@/utils/index.js';
import SearchInput from '@/components/search-condition/search-input.vue';
import _ from 'lodash';
import CommonUtils from '@/utils/utils.js';
import { getI18N } from '@cyber/helper';
import { THEORY_DIFF } from '../exercise-constants.js';

export default {
  components: {
    SearchInput,
  },
  data() {
    const that = this;
    return {
      THEORY_DIFF,
      loading: false,
      uploadDialogVisible: false,
      baseURL: '/api/ojj',
      url: '/oj/admin/theory/list',
      difficultyOptions: [],
      topicTypeOptions: [], //筛选条件题目类型
      optionsTypeLabels: {}, //列表题目类型
      query: {
        pattern: '',
        type: '',
        category_id: '',
        practice_set_id: '',
        difficulty: '',
        theory_type: '',
      },
      ploadUrl: 'https://jsonplaceholder.typicode.com/posts/',
      xlsdownload: '/cpms/practice_theory/demo.xls',
      // txtdownload: '/cpms/practice_theory/txt_demo.txt',
      xlsdownloadEn: '/cpms/practice_theory/demo_en.xls',
      // txtdownloadEn: '/cpms/practice_theory/txt_demo_en.txt',
      multipleSelection: [],
      tableData: [],
      category_id: [],
      practice_set_id: [],
      pagination: {
        current_page: 1,
        per_page: 10,
        total: 0,
      },
      addForm: {
        practice_set_id: '',
        // category_id: '',
        fileobj: '',
      },
      addFormRules: {
        practice_set_id: [
          {
            required: true,
            message: this.$t('m.choiceProblemSet'),
            trigger: 'change',
          },
        ],
        // category_id: [
        //   {
        //     required: true,
        //     message: this.$t('m.choiceDirectiont'),
        //     trigger: 'change',
        //   },
        // ],
        fileobj: [
          {
            required: true,
            message: this.$t('m.fileCannotBeEmpty'),
            trigger: 'blur',
          },
        ],
      },
      categorybox: [],
      practice_type: [],
      files: null,
      list: [],
      columns: [],
    };
  },
  computed: {
    publicWarnMsg() {
      const that = this;
      const recordCtg = that.$t('m.theoreticalBasis').toLowerCase();
      return CommonUtils.formatString(
        that.$t('common.confirmOvertMsg'),
        recordCtg,
      );
    },
    publicCompleteMsg() {
      const that = this;
      const recordCtg = that.$t('m.theoreticalBasis').toLowerCase();
      return CommonUtils.formatString(
        that.$t('common.overtSuccess'),
        recordCtg,
      );
    },
    hideWarnMsg() {
      const that = this;
      const recordCtg = that.$t('m.theoreticalBasis').toLowerCase();
      return CommonUtils.formatString(
        that.$t('common.confirmConcealMsg'),
        recordCtg,
      );
    },
    hideCompleteMsg() {
      const that = this;
      const recordCtg = that.$t('m.theoreticalBasis');
      return CommonUtils.formatString(
        that.$t('common.concealSuccess'),
        recordCtg,
      );
    },
  },
  mounted() {
    this.getDifficultyOptions();
  },
  created() {
    const that = this;
    this.getTopicTypeOptions();
    this.rationaleGuidData();
    this.exercisesGuidData();
    this.tableSelector = {
      maxSelect: 0,
    };
    this.columns = [
      {
        label: this.$t('m.practiceName'),
        prop: 'content',
        sorter: 'content',
        width: '260px',
        resizable: true,
      },
      {
        label: this.$t('m.problemSet'),
        getData(row) {
          let practice_id = '';
          that.practice_set_id.forEach((item) => {
            if (item.resource_id === row.practice_set_id) {
              practice_id = item.name;
            }
          });
          return practice_id;
        },
        prop: 'problemSet',
        width: 160,
        resizable: true,
      },
      {
        label: this.$t('m.difficulty'),
        slot: 'difficulty',
        width: 120,
      },
      {
        label: this.$t('m.direction'),
        getData(row) {
          let category_id = '';
          that.category_id.forEach((item) => {
            if (item.resource_id === row.category_id) {
              category_id = item.name;
            }
          });
          return category_id;
        },
        width: 160,
      },
      // 题目类型
      {
        label: this.$t('m.topicType'),
        slot: 'theory_type',
        width: 120,
      },
      {
        label: this.$t('m.status'),
        slot: 'public',
        sorter: 'public',
        width: 120,
      },
      {
        label: this.$t('m.creator'),
        prop: 'create_user_name',
        width: 120,
      },
      {
        label: this.$t('m.updateTime'),
        prop: 'update_time',
        sorter: 'update_time',
        width: 210,
      },
      {
        label: this.$t('m.operation'),
        slot: 'operate',
        width: 100,
      },
    ];
  },
  methods: {
    //获取题目类型分类
    getTopicTypeOptions() {
      this.$request
        .get(
          '/cr/common/constants_config',
          {
            type: 21,
          },
          {
            baseURL: '/api/ojj',
          },
        )
        .then((res) => {
          let arr = res.data.data;
          this.topicTypeOptions = arr.map((item) => {
            //题目类型label转换
            this.optionsTypeLabels[item.code] = item.name;
            return {
              value: item.code,
              label: item.name,
            };
          });
        });
    },
    // 获取难度分类
    getDifficultyOptions() {
      this.$request
        .get(
          '/cr/common/constants_config',
          {
            type: 10,
          },
          {
            baseURL: '/api/ojj',
          },
        )
        .then((res) => {
          let arr = res.data.data;
          arr = arr.map((item) => {
            return {
              value: item.code,
              label: item.name,
            };
          });
          this.difficultyOptions = arr;
        });
    },
    // 表格难度列计算
    computedDiffculty(difficulty) {
      const data = this.difficultyOptions.filter(
        (item) => item.value === difficulty,
      );
      if (data.length) {
        return data[0].label;
      }
    },
    getI18Nn() {
      return getI18N();
    },
    handleClick() {
      this.addForm.fileobj = '';
      this.uploadDialogVisible = true;
      this.list = [];
    },
    uploadFunc(file) {
      this.addForm.fileobj = file;
      const fileName = file.name;
      const pos = fileName.lastIndexOf('.');
      const lastName = fileName.substring(pos, fileName.length);
      const isLt2M = file.size / 1024 / 1024 < 5;
      if (
        lastName.toLowerCase() !== '.xls' &&
        lastName.toLowerCase() !== '.xlsx'
      ) {
        this.$message.error(this.$t('m.UploadTemplate'));
        this.$refs.upload.clearFiles();
        return;
      }
      if (!isLt2M) {
        this.$message.error(this.$t('m.UploadTemplateSize'));
        this.$refs.upload.clearFiles();
        return;
      }
      this.fileName = file.name;
      return false; // 返回false不会自动上传
    },
    // 上传文件校验
    beforeUpload(file, fileList) {
      this.addForm.fileobj = file;
      // const extension = file.raw.type === 'text/plain' || file.raw.type === 'application/vnd.ms-excel'
      const fileName = file.name;
      const pos = fileName.lastIndexOf('.');
      const lastName = fileName.substring(pos, fileName.length);
      const isLt2M = file.size / 1024 / 1024 < 5;
      if (
        lastName.toLowerCase() !== '.xls' &&
        lastName.toLowerCase() !== '.txt'
      ) {
        this.$message.error(this.$t('m.UploadTemplate'));
        this.$refs.upload.clearFiles();
        return;
      }
      if (!isLt2M) {
        this.$message.error(this.$t('m.UploadTemplateSize'));
        this.$refs.upload.clearFiles();
        return;
      }
      if (fileList.length > 1) {
        fileList.splice(0, 1);
      }
      this.fileName = file.name;
      return false; // 返回false不会自动上传
    },
    theoryRemove(fileList) {
      this.addForm.fileobj = '';
    },
    // 提交题目
    upload() {
      this.$refs.addFormRef.validate((valid) => {
        if (valid) {
          this.loading = true;
          const formdata = new FormData();
          formdata.append('practice_set_id', this.addForm.practice_set_id);
          // formdata.append('category_id', this.addForm.category_id);
          formdata.append('file', this.addForm.fileobj);
          this.$request
            .post('oj/admin/theory/import', formdata, { baseURL: '/api/ojj' })
            .then(() => {
              this.$message.success(this.$t('m.UploadSuccessQuestion'));
              this.uploadDialogVisible = false;
              this.$refs.upload.clearFiles();
              this.rationaleGuidData();
              this.$refs.theoryListRef.reload();
            })
            .catch((error) => {
              errorMessage(error, this);
              this.$refs.upload.clearFiles();
            })
            .finally(() => {
              this.loading = false;
            });
        } else {
          return false;
        }
      });
    },
    // 重置表单弹框
    resetForm() {
      this.$refs.addFormRef.resetFields();
      this.$refs.upload.clearFiles();
      this.uploadDialogVisible = false;
    },
    // 理论基础-方向
    rationaleGuidData() {
      const that = this;
      that.$request
        .get(
          'oj/admin/practice/category/list/?page=1&per_page=999&practice_type=0',
          {},
          { baseURL: '/api/ojj' },
        )
        .then((resp) => {
          that.addForm.category_id = _.get(
            resp,
            'data.list[0].resource_id',
            '',
          );
          const newData = _.get(resp, 'data.data.list');
          newData.forEach((item) => {
            if (item.resource_id !== null) {
              that.categorybox.push(item);
            }
          });
          that.category_id = newData;
        });
    },
    // 理论基础-习题集类型
    exercisesGuidData() {
      const that = this;
      that.$request
        .get(
          'oj/admin/practice/set/list/?page=1&per_page=999&practice_type=0',
          {},
          { baseURL: '/api/ojj' },
        )
        .then((resp) => {
          that.addForm.practice_set_id = _.get(
            resp,
            'data.data.list[0].resource_id',
            '',
          );
          const newData = _.get(resp, 'data.data.list');
          newData.forEach((item) => {
            if (item.resource_id !== null) {
              that.practice_type.push(item);
            }
          });
          that.practice_set_id = newData;
        });
    },
    // 方向列表跳转
    toType() {
      this.$router.push({ name: 'theory-to-type' });
    },
    // 添加理论基础跳转
    push() {
      this.$router.push({ name: 'add-theory' });
    },
    // 编辑理论基础啊跳转
    edit(resource_id) {
      this.$router.push({
        name: 'edit-theory',
        params: {
          theoryId: resource_id,
        },
      });
    },
    // 公开提示
    toggleSelection(data, done) {
      const that = this;
      const resource_ids = [];
      if (data && data.length) {
        data.map((item) => resource_ids.push(item.resource_id));
      } else {
        resource_ids.push(data.resource_id);
      }
      that.$request
        .patch(
          '/oj/admin/theory/batch-public',
          {
            resource_ids,
            is_public: 1,
          },
          {
            baseURL: '/api/ojj',
          },
        )
        .then(() => {
          done();
          that.multipleSelection = [];
          that.$refs.theoryListRef.reload();
        })
        .catch(() => {
          done(false);
        });
    },
    // 隐藏提示
    close(data, done) {
      const that = this;
      const resource_ids = [];
      if (data && data.length) {
        data.map((item) => resource_ids.push(item.resource_id));
      } else {
        resource_ids.push(data.resource_id);
      }
      that.$request
        .patch(
          '/oj/admin/theory/batch-public',
          {
            resource_ids,
            is_public: 0,
          },
          {
            baseURL: '/api/ojj',
          },
        )
        .then(() => {
          done();
          that.multipleSelection = [];
          that.$refs.theoryListRef.reload();
        })
        .catch(() => {
          done(false);
        });
    },
    // 删除提示
    deleteSelectedTheory(data, done) {
      const that = this;
      const resource_ids = [];
      if (data && data.length) {
        data.map((item) => resource_ids.push(item.resource_id));
      } else {
        resource_ids.push(data.resource_id);
      }
      that.$request
        .delete('/oj/admin/theory', { resource_ids }, { baseURL: '/api/ojj' })
        .then(() => {
          done();
          that.multipleSelection = [];
          that.$refs.theoryListRef.reload();
        })
        .catch((err) => {
          that.$serverError(err);
          done(false);
        });
    },
  },
};
</script>
<style scoped lang="scss">
.el-select {
  padding-right: 10px;
}
::v-deep {
  &.el-upload {
    margin-left: 15px;
  }
  .el-link {
    &.el-link--default {
      &.underlineStyle {
        height: 20px;
        border-bottom: 1px solid var(--blue-color);
        color: var(--blue-color);
      }
    }
  }
}
.tip {
  margin-left: 60px;
}
.div-loading {
  .dialog-footer {
    display: table;
    margin: auto;
  }
}
.open {
  color: var(--green-color);
}
</style>
