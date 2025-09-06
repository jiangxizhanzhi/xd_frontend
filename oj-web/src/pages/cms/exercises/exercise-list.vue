<template>
  <cb-inner-page :background="false">
    <exercise-import-panel
      ref="importDialogRef"
      @close="closeImporter"
    ></exercise-import-panel>
    <div class="exam-content" v-if="isAuthActive && isAccessActive">
      <cb-search-table
        ref="exercisesListRef"
        :url="url"
        :record-ctg="$t('m.problemSet')"
        :cols.sync="columns"
        :data.sync="query"
        :selector="tableSelector"
        :selection.sync="multipleSelection"
        row-key="resource_id"
        baseURL="/api/ojj"
      >
        <template v-slot:search>
          <cb-button button-type="add" @click="push" mr="mr">
            {{ $t('m.add') }}
          </cb-button>
          <cb-button
            :disabled="multipleSelection.length === 0"
            hollow
            button-type="delete"
            @click="deleteSelectedExercises(multipleSelection, $event)"
            mr="mr"
            >{{ $t('m.delete') }}
          </cb-button>
          <cb-button
            :disabled="multipleSelection.length === 0"
            hollow
            icon="icon-yulan"
            :warnMsg="publicWarnMsg"
            :completeMsg="publicCompleteMsg"
            @click="toggleSelection(multipleSelection, $event)"
            mr="mr"
            ><span>{{ $t('m.public') }}</span>
          </cb-button>
          <cb-button
            :disabled="multipleSelection.length === 0"
            hollow
            icon="icon-yincang1"
            :warnMsg="hideWarnMsg"
            :completeMsg="hideCompleteMsg"
            @click="close(multipleSelection, $event)"
            mr="mr"
            ><span>{{ $t('m.hide') }}</span>
          </cb-button>
          <cb-button
            button-type="import"
            hollow
            @click="importDialogClick"
            mr="mr"
          >
            {{ $t('m.import') }}
          </cb-button>
          <cb-button
            :disabled="multipleSelection.length === 0"
            hollow
            button-type="export"
            @click="exportExercise"
            mr="mr"
          >
            {{ $t('m.export') }}
          </cb-button>
          <cb-button
            icon="icon-shouquancaozuo"
            hollow
            :disabled="multipleSelection.length === 0"
            @click="batchAuth"
            mr="mr"
            >{{ $t('button.batchAuthSet') }}</cb-button
          >
          <cb-button
            icon="icon-shouquanfangwen"
            hollow
            :disabled="multipleSelection.length === 0"
            @click="batchVisi"
            >{{ $t('button.batchVisiSet') }}</cb-button
          >
        </template>
        <template v-slot:filter>
          <cb-select
            v-model="query.practice_type"
            :options="exeType"
            clearable="clearable"
            :first="{
              value: '',
              label: $t('m.allType'),
            }"
          ></cb-select>
          <cb-search-input
            v-model="query.pattern"
            :placeholder="$t('m.namePh')"
          ></cb-search-input>
        </template>
        <template v-slot:type="scope">
          <!-- <div v-show="scope.data.practice_type === EXERTYPE.EXAM">
            {{ $t('m.theoreticalBasis') }}
          </div>
          <div v-show="scope.data.practice_type === EXERTYPE.CHECK">
            {{ $t('m.captureTheFlag') }}
          </div> -->
          <div>
            {{ computedType(scope.data.practice_type) }}
          </div>
        </template>
        <template v-slot:public="scope">
          <div v-if="scope.data.is_public === true">
            {{ $t('m.public') }}
          </div>
          <div v-else>{{ $t('m.hide') }}</div>
        </template>
        <template v-slot:operation_auth_type="scope">
          <cb-button
            type="text"
            color-type="yellow"
            v-show="
              scope.data.operation_auth_type === COURSES.SHARE.PART &&
              !scope.data.operation_count
            "
            @click="private(scope.data)"
            >{{ $t('m.private') }}
          </cb-button>
          <cb-button
            type="text"
            v-show="
              scope.data.operation_auth_type === COURSES.SHARE.PART &&
              scope.data.operation_count
            "
            @click="private(scope.data)"
            >{{ $t('m.sharedTeacher') }}({{ scope.data.operation_count }})
          </cb-button>
          <cb-button
            type="text"
            v-show="scope.data.operation_auth_type === COURSES.SHARE.ALL"
            @click="private(scope.data)"
            >{{ $t('m.authorizeAll') }}
          </cb-button>
        </template>
        <template v-slot:read_auth_type="scope">
          <cb-button
            type="text"
            color-type="yellow"
            v-show="
              scope.data.read_auth_type === COURSES.AUTH.PART &&
              !scope.data.read_count
            "
            @click="authorize(scope.data)"
            >{{ $t('m.unauthorized') }}
          </cb-button>
          <cb-button
            type="text"
            v-show="
              scope.data.read_auth_type === COURSES.AUTH.PART &&
              scope.data.read_count
            "
            @click="authorize(scope.data)"
            >{{ $t('m.authorized') }}({{ scope.data.read_count }})
          </cb-button>
          <cb-button
            type="text"
            v-show="scope.data.read_auth_type === COURSES.AUTH.ALL"
            @click="authorize(scope.data)"
            >{{ $t('m.authorizeAll') }}
          </cb-button>
        </template>
        <template v-slot:operate="scope">
          <cb-button button-type="edit" @click="edit(scope.data)" type="text">{{
            $t('button.edit')
          }}</cb-button>
        </template>
      </cb-search-table>
    </div>
    <private-exercises-auth
      v-if="!isAuthActive"
      @close="getAuthActive"
    ></private-exercises-auth>
    <manage-exercises-auth
      v-if="!isAccessActive"
      @close="getAccessActive"
    ></manage-exercises-auth>
  </cb-inner-page>
</template>

<script>
import { EXERTYPE, COURSES } from './exercise-constants.js';
import msger from '@/utils/message.js';
import { ss } from '@/utils/storage.js';
import ExerciseConst from './exercise-constants.js';
import SearchInput from '@/components/search-condition/search-input.vue';
import ExerciseImportPanel from './exercise-import-panel.vue';
import privateExercisesAuth from './private-exercises-batch.vue';
import manageExercisesAuth from './manage-exercises-batch.vue';
import CommonUtils from '@/utils/utils.js';
import _ from 'lodash';
export default {
  components: {
    SearchInput,
    ExerciseImportPanel,
    privateExercisesAuth,
    manageExercisesAuth,
  },
  data() {
    return {
      // 习题分类
      exeType: [],
      EXERTYPE,
      COURSES,
      url: '/oj/admin/practice/set/list',
      query: {
        pattern: '',
        practice_type: '',
      },
      queryDisplay: {
        search: '',
      },
      multipleSelection: [],
      tableData: [],
      pagination: {
        current_page: 1,
        per_page: 10,
        total: 0,
      },
      isAuthActive: true,
      isAccessActive: true,
      columns: [],
    };
  },
  computed: {
    publicWarnMsg() {
      const that = this;
      const recordCtg = that.$t('m.problemSet');
      return CommonUtils.formatString(
        that.$t('common.confirmOvertMsg'),
        recordCtg,
      );
    },
    publicCompleteMsg() {
      const that = this;
      const recordCtg = that.$t('m.problemSet');
      return CommonUtils.formatString(
        that.$t('common.overtSuccess'),
        recordCtg,
      );
    },
    hideWarnMsg() {
      const that = this;
      const recordCtg = that.$t('m.problemSet');
      return CommonUtils.formatString(
        that.$t('common.confirmConcealMsg'),
        recordCtg,
      );
    },
    hideCompleteMsg() {
      const that = this;
      const recordCtg = that.$t('m.problemSet');
      return CommonUtils.formatString(
        that.$t('common.concealSuccess'),
        recordCtg,
      );
    },
  },
  created() {
    this.tableSelector = {
      maxSelect: 0,
    };
    this.columns = [
      {
        label: this.$t('m.practiceName'),
        prop: 'name',
        sorter: 'name',
        width: 250,
        resizable: true,
      },
      {
        label: this.$t('m.type'),
        slot: 'type',
      },
      {
        label: this.$t('m.number'),
        prop: 'practice_count',
        sorter: 'practice_count',
      },
      {
        label: this.$t('m.status'),
        slot: 'public',
        sorter: 'public',
      },
      {
        label: this.$t('m.creator'),
        prop: 'create_user_name',
      },
      {
        label: this.$t('m.authorizedOperation'),
        slot: 'operation_auth_type',
      },
      {
        label: this.$t('m.authorizedAccess'),
        slot: 'read_auth_type',
      },
      {
        label: this.$t('m.operation'),
        slot: 'operate',
        width: 100,
      },
    ];
  },

  mounted() {
    this.getExeType();
  },
  methods: {
    // 获取习题类型
    getExeType() {
      this.$request
        .get(
          '/cr/common/constants_config',
          {
            type: 12,
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
          this.exeType = arr;
        });
    },
    // 表格习题类型列展示
    computedType(typeId) {
      const data = this.exeType.filter((item) => item.value === typeId);
      if (data.length) {
        return data[0].label;
      }
    },
    importDialogClick() {
      this.$refs.importDialogRef.importDialog = true;
    },
    closeImporter(
      { reload } = {
        reload: false,
      },
    ) {
      this.$refs.importDialogRef.importDialog = false;
      this.$refs.importDialogRef.model.file = '';
      this.$refs.importDialogRef.list = [];
      if (reload) {
        this.$refs.exercisesListRef.reload({
          page: 1,
        });
      }
    },
    batchAuth() {
      const { multipleSelection } = this;
      if (multipleSelection && multipleSelection.length > 0) {
        ss.set(
          ExerciseConst.stashedExerciseIdKey,
          multipleSelection.map((item) => item.resource_id),
        );
        this.isAuthActive = false;
      } else {
        ss.set(ExerciseConst.stashedExerciseIdKey, false);
        msger.error(
          this.$t('views.exercise.batch.chooseCourseToProceed'),
          this,
        );
      }
    },
    getAuthActive(value) {
      this.isAuthActive = value;
      this.multipleSelection = [];
    },
    batchVisi() {
      const { multipleSelection } = this;
      if (multipleSelection && multipleSelection.length > 0) {
        ss.set(
          ExerciseConst.stashedExerciseIdKey,
          multipleSelection.map((item) => item.resource_id),
        );
        this.isAccessActive = false;
      } else {
        ss.set(ExerciseConst.stashedExerciseIdKey, false);
        msger.error(
          this.$t('views.exercise.batch.chooseCourseToProceed'),
          this,
        );
      }
    },
    getAccessActive(value) {
      this.isAccessActive = value;
      this.multipleSelection = [];
    },
    // 添加列表页
    push() {
      this.$router.push({ name: 'add-exercises' });
    },
    // 编辑列表页
    edit(row) {
      this.$router.push({
        name: 'edit-exercises',
        params: {
          exercisesId: row.resource_id,
        },
      });
    },
    // 授权操作页
    private(row) {
      this.$router.push({
        // path: `/admin/exercises/private-exercises/${row.resource_id}`,
        name: 'exercises-auth',
        params: {
          exercisesId: row.resource_id,
        },
      });
    },
    // 授权访问页
    authorize(row) {
      this.$router.push({
        name: 'exercises-visibility',
        params: {
          exercisesId: row.resource_id,
        },
        // path: `/admin/exercises/manage-exercises/${row.resource_id}`,
      });
    },
    // 全局搜索
    getSearchName(params) {
      this.query.pattern = params;
      this.pagination.current_page = 1;
    },
    // 公开提示
    toggleSelection(data, done) {
      const that = this;
      const ids = [];
      if (data && data.length) {
        data.map((item) => ids.push(item.resource_id));
      } else {
        ids.push(data.resource_id);
      }
      that.$request
        .patch(
          '/oj/admin/practice/set/batch-public',
          {
            resource_ids: ids,
            is_public: true,
          },
          {
            baseURL: '/api/ojj',
          },
        )
        .then(() => {
          done();
          that.multipleSelection = [];
          that.$refs.exercisesListRef.reload();
        })
        .catch(() => {
          done(false);
        });
    },
    // 隐藏提示
    close(data, done) {
      const that = this;
      const ids = [];
      if (data && data.length) {
        data.map((item) => ids.push(item.resource_id));
      } else {
        ids.push(data.resource_id);
      }
      that.$request
        .patch(
          '/oj/admin/practice/set/batch-public',
          {
            resource_ids: ids,
            is_public: false,
          },
          {
            baseURL: '/api/ojj',
          },
        )
        .then(() => {
          done();
          that.multipleSelection = [];
          that.$refs.exercisesListRef.reload();
        })
        .catch(() => {
          done(false);
        });
    },

    // 删除提示
    deleteSelectedExercises(data, done) {
      const that = this;
      const ids = [];
      if (data && data.length) {
        data.map((item) => ids.push(item.resource_id));
      } else {
        ids.push(data.resource_id);
      }
      that.$request
        .delete(
          '/oj/admin/practice/set',
          {
            resource_ids: ids,
          },
          { baseURL: '/api/ojj' },
        )
        .then(() => {
          done();
          that.multipleSelection = [];
          that.$refs.exercisesListRef.reload();
        })
        .catch((err) => {
          done(false);
        });
    },
    // 导出习题集
    exportExercise() {
      const { multipleSelection } = this;
      if (multipleSelection && multipleSelection.length > 0) {
        const finalIds = multipleSelection.map((item) => item['resource_id']);
        const url = `${
          location.origin
        }/api/ojj/oj/admin/practice/set/batch_dumps?ids=${finalIds.join(
          '&ids=',
        )}`;
        this.$request
          .get(url, null, {
            responseType: 'arraybuffer',
            baseURL: '/api/ojj',
          })
          .then((res) => {
            this.$request.download(
              res.data,
              multipleSelection.length > 1
                ? 'PracticeSet.zip'
                : `PracticeSet_${multipleSelection[0].name}.zip`,
            );
          });
        // window.open(url);
      } else {
        msger.error(
          this.$t('views.exercise.batch.chooseCourseToProceed'),
          this,
        );
      }
    },
  },
};
</script>
<style scoped lang="scss"></style>
<style lang="scss">
.el-dialog__wrapper {
  .el-dialog__header {
    background: transparent !important;
  }
}
</style>
