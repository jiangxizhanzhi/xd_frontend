<template>
  <cb-inner-page :background="false">
    <!-- 授权访问 -->
    <div v-if="AuthAccess == 'access'">
      <auth-access
        :AuthAccessIds="AuthAccessIds"
        @closeAuthBatch="closeAuthBatch"
      ></auth-access>
    </div>
    <!-- 授权操作 -->
    <div v-else-if="AuthAccess == 'opreate'">
      <auth-operate
        :AuthOperateIds="AuthOperateIds"
        @closeAuthBatch="closeAuthBatch"
      ></auth-operate>
    </div>
    <div v-else>
      <cb-search-table
        ref="sdlRef"
        :selector="selector"
        :selection.sync="selection"
        :url="url"
        :data.sync="query"
        :cols.sync="columns"
        row-key="resource_id"
        baseURL="/api/ojj"
      >
        <template slot="filter">
          <cb-select
            v-model="query.direction"
            :first="{
              value: null,
              label: $t('m.allDirection'),
            }"
            :options="directionOptions"
            :placeholder="$t('m.allDirection')"
          >
          </cb-select>
          <cb-select
            v-model="query.difficulty"
            :first="{
              value: null,
              label: $t('m.allDifficulty'),
            }"
            :options="difficultyOptions"
            :placeholder="$t('m.allDifficulty')"
          >
          </cb-select>
          <cb-checkbox v-model="query.myCourse">{{
            $t('m.myCourse')
          }}</cb-checkbox>
          <cb-checkbox v-model="query.systemCourse">{{
            $t('m.systemCourses')
          }}</cb-checkbox>
          <cb-checkbox v-model="query.shareCourse">{{
            $t('m.sharedCourses')
          }}</cb-checkbox>
          <cb-search-input
            v-model="query.pattern"
            :placeholder="$t('m.namePh')"
          ></cb-search-input>
        </template>
        <template v-slot:search>
          <cb-button-group>
            <cb-button button-type="add" @click="addCourse"></cb-button>
            <cb-button
              buttonType="delete"
              hollow
              :disabled="selection.length === 0"
              @click="deleteCourse(selection, $event)"
              >{{ $t('m.delete') }}</cb-button
            >
            <cb-button
              icon="icon-yulan"
              hollow
              :warnMsg="publicMsg"
              :completeMsg="publicSuccessMsg"
              :disabled="selection.length === 0"
              @click="toPublic(selection, $event)"
              >{{ $t('m.public') }}</cb-button
            >
            <cb-button
              icon="icon-yincang1"
              hollow
              :warnMsg="hideMsg"
              :completeMsg="hideSuccessMsg"
              :disabled="selection.length === 0"
              @click="toHide(selection, $event)"
              >{{ $t('m.hide') }}</cb-button
            >
            <cb-button
              button-type="import"
              hollow
              @click="importDialog = true"
            ></cb-button>
            <cb-button
              button-type="export"
              hollow
              :disabled="selection.length === 0"
              @click="exportCourse(selection, $event)"
            ></cb-button>
            <cb-button
              hollow
              icon="icon-shouquancaozuo"
              :disabled="selection.length === 0"
              @click="batchAuth(selection, $event)"
              >{{ $t('button.authSet') }}</cb-button
            >
            <cb-button
              hollow
              icon="icon-shouquanfangwen"
              :disabled="selection.length === 0"
              @click="batchVisi(selection, $event)"
              >{{ $t('button.visiSet') }}</cb-button
            >
          </cb-button-group>
        </template>
        <template slot="searchRightArea">
          <cb-button icon="icon-fangxiangguanli" @click="toType" hollow>{{
            $t('m.typeManage')
          }}</cb-button>
        </template>
        <template v-slot:difficulty="scope">
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
        <template v-slot:public="scope">
          <div />
          <span v-if="scope.data.is_public">{{ $t('m.public') }}</span>
          <span v-if="!scope.data.is_public">{{ $t('m.hide') }}</span>
        </template>
        <template v-slot:create_user_name="scope">
          <div />
          <span v-if="scope.data.create_user_name == 'admin'">{{
            $t('common.trainadmin')
          }}</span>
          <span v-else>{{ scope.data.create_user_name }}</span>
        </template>
        <template v-slot:share="scope">
          <div />
          <cb-button
            type="text"
            v-show="
              scope.data.share === $CONSTANT.COURSES.SHARE.PART &&
              !scope.data.share_count
            "
            color-type="yellow"
            @click="privateAuth(scope.data)"
            >{{ $t('m.private') }}</cb-button
          >
          <cb-button
            type="text"
            v-show="
              scope.data.share === $CONSTANT.COURSES.SHARE.PART &&
              scope.data.share_count
            "
            @click="privateAuth(scope.data)"
            >{{ $t('m.shared') }}({{ scope.data.share_count }})</cb-button
          >

          <cb-button
            type="text"
            v-show="scope.data.share === $CONSTANT.COURSES.SHARE.ALL"
            @click="privateAuth(scope.data)"
            >{{ $t('m.authorizeAll') }}</cb-button
          >
        </template>
        <template v-slot:auth="scope">
          <div />
          <cb-button
            type="text"
            v-show="
              scope.data.auth === $CONSTANT.COURSES.AUTH.PART &&
              !scope.data.auth_count
            "
            color-type="yellow"
            @click="authorize(scope.data)"
            >{{ $t('m.unauthorized') }}</cb-button
          >
          <cb-button
            type="text"
            v-show="
              scope.data.auth === $CONSTANT.COURSES.AUTH.PART &&
              scope.data.auth_count
            "
            @click="authorize(scope.data)"
            >{{ $t('m.authorized') }}({{ scope.data.auth_count }})</cb-button
          >

          <cb-button
            type="text"
            v-show="scope.data.auth === $CONSTANT.COURSES.AUTH.ALL"
            @click="authorize(scope.data)"
            >{{ $t('m.authorizeAll') }}</cb-button
          >
        </template>
        <template v-slot:opeator="scope">
          <div />
          <cb-button-group>
            <cb-button
              type="text"
              @click="edit(scope.data)"
              button-type="edit"
            ></cb-button>
            <cb-button type="text" @click="management(scope.data)">{{
              $t('m.classManage')
            }}</cb-button>
          </cb-button-group>
        </template>
      </cb-search-table>
      <cb-dialog
        :title="$t('m.dialogTitle')"
        width="600px"
        center
        :visible.sync="importDialog"
      >
        <course-import-panel
          v-if="importDialog"
          @close="closeImporter"
        ></course-import-panel>
      </cb-dialog>
    </div>
  </cb-inner-page>
</template>
<script>
import Constant from './course-constant.js';
import CourseImportPanel from './course-import-panpel';
import msger from '@/utils/message.js';
import SearchInput from '@/components/search-condition/search-input.vue';
import CommonUtils from '@/utils/utils.js';
import AuthAccess from './manage-auth-batch.vue';
import AuthOperate from './private-course-batch.vue';

export default {
  components: {
    CourseImportPanel,
    SearchInput, // 查询 input 公用组件
    AuthAccess,
    AuthOperate,
  },
  data() {
    return {
      AuthAccessIds: [],
      AuthOperateIds: [],
      AuthAccess: 'course', //course是课程列表，opreate 授权操作，access 访问
      url: '/oj/admin/course/list',
      query: {
        pattern: '',
        direction: null,
        difficulty: null,
        systemCourse: true,
        myCourse: true,
        shareCourse: true,
      },
      selector: {
        maxSelect: 0,
      },
      selection: [],
      directionOptions: [],
      // 难度分类数据
      difficultyOptions: [],
      multipleSelection: [],
      difficultyValue: '',
      tableData: [],
      pagination: {
        current_page: 1,
        total: 0,
        per_page: 10,
      },
      importDialog: false,
      columns: [],
    };
  },
  computed: {
    hideMsg() {
      const that = this;
      const recordCtg = that.$t('coursesBreadcrumbs.course');
      return CommonUtils.formatString(
        that.$t('common.confirmConcealMsg'),
        recordCtg,
      );
    },
    hideSuccessMsg() {
      const that = this;
      const recordCtg = that.$t('coursesBreadcrumbs.course');
      return CommonUtils.formatString(
        that.$t('common.concealSuccess'),
        recordCtg,
      );
    },
    publicMsg() {
      const that = this;
      const recordCtg = that.$t('coursesBreadcrumbs.course');
      return CommonUtils.formatString(
        that.$t('common.confirmOvertMsg'),
        recordCtg,
      );
    },
    publicSuccessMsg() {
      const that = this;
      const recordCtg = that.$t('coursesBreadcrumbs.course');
      return CommonUtils.formatString(
        that.$t('common.overtSuccess'),
        recordCtg,
      );
    },

    $CONSTANT() {
      return Constant;
    },
  },
  created() {
    this.tableSelector = {
      maxSelect: 0,
    };
    this.columns = [
      {
        label: this.$t('m.courseName'),
        prop: 'name',
        sorter: 'name',
        width: 330,
        resizable: true,
      },
      {
        label: this.$t('m.direction'),
        prop: 'direction_name',
        sorter: 'category_id',
        width: 194,
        resizable: true,
      },
      {
        label: this.$t('m.difficulty'),
        prop: 'difficulty',
        slot: 'difficulty',
        sorter: 'difficulty',
        width: 100,
      },
      {
        label: this.$t('m.classHours'),
        prop: 'lesson_count',
        sorter: 'lesson_count',
        width: 90,
      },
      {
        label: this.$t('m.studentScore'),
        prop: 'score',
        width: 70,
      },
      {
        label: this.$t('m.status'),
        slot: 'public',
        width: 70,
      },
      {
        label: this.$t('m.creator'),
        slot: 'create_user_name',
        width: '100px',
      },
      {
        label: this.$t('m.authorizedOperation'),
        slot: 'share',
        width: '100px',
      },
      {
        label: this.$t('m.authorizedAccess'),
        slot: 'auth',
        width: 100,
      },
      {
        label: this.$t('m.operation'),
        slot: 'opeator',
        width: '132px',
      },
    ];
  },
  mounted() {
    this.getDirectionOptions();
    this.getDifficultyOptions();
  },
  methods: {
    computedDiffculty(difficulty) {
      const data = this.difficultyOptions.filter(
        (item) => item.value === difficulty,
      );
      if (data.length) {
        return data[0].label;
      }
    },
    closeAuthBatch(aa) {
      this.AuthAccess = 'course';
      this.selection = [];
    },
    getStyle(data) {
      if (data === $CONSTANT.COURSES.DIFFICULTY.ADVANCED) {
        return $t('m.advanced');
      } else if (data === $CONSTANT.COURSES.DIFFICULTY.MEDIUM) {
        return $t('m.medium');
      } else {
        return $t('m.primary');
      }
    },
    closeImporter(
      { reload } = {
        reload: false,
      },
    ) {
      this.importDialog = false;
      if (reload) {
        this.$refs.sdlRef.reload({
          page: 1,
        });
      }
    },
    batchAuth(data, done) {
      const ids = [];
      if (data && data.length) {
        data.map((item) => ids.push(item.resource_id));
      } else {
        ids.push(data.resource_id);
      }
      if (ids && ids.length > 0) {
        this.AuthOperateIds = ids;
        this.AuthAccess = 'opreate';
      } else {
        this.AuthOperateIds = [];
        msger.error(this.$t('views.course.batch.chooseCourseToProceed'), this);
      }
    },
    batchVisi(data, done) {
      const ids = [];
      const { multipleSelection } = this;
      if (data && data.length) {
        data.map((item) => ids.push(item.resource_id));
      } else {
        ids.push(data.resource_id);
      }
      if (ids && ids.length > 0) {
        this.AuthAccessIds = ids;
        this.AuthAccess = 'access';
      } else {
        this.AuthAccessIds = [];
        msger.error(this.$t('views.course.batch.chooseCourseToProceed'), this);
      }
    },
    getId(val) {
      const arr = [];
      for (let i = 0; i < val.length; i++) {
        arr.push(val[i].resource_id);
      }
      return arr;
    },
    // 查询出所有的课程方向
    getDirectionOptions() {
      this.$request
        .get(
          '/oj/admin/course/direction/list',
          {
            children: false,
            page: 1,
            per_page: 9999,
          },
          {
            baseURL: '/api/ojj',
          },
        )
        .then((res) => {
          // let dataArr = res.data.data;
          let dataArr = _.get(res, 'data.data.list', []);
          this.directionOptions = dataArr.map((item) => {
            return {
              label: item.name,
              value: item.resource_id,
            };
          });
        });
    },
    // 获取难度类型
    getDifficultyOptions() {
      this.$request
        .get(
          '/cr/common/constants_config',
          {
            type: 9,
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
    // 新增
    addCourse() {
      this.$router.push({ name: 'courses-add' });
    },
    // 私有,共享
    privateAuth(row) {
      this.$router.push({
        name: 'courses-auth',
        params: {
          courseId: row.resource_id,
        },
      });
    },
    // 授权
    authorize(row) {
      this.$router.push({
        name: 'courses-visiblity',
        params: {
          courseId: row.resource_id,
        },
      });
    },
    // 编辑
    edit(row) {
      this.$router.push({
        name: 'courses-edit',
        params: {
          courseId: row.resource_id,
        },
      });
    },
    management(row) {
      this.$router.push({
        name: 'lessons-manage',
        params: { courseId: row.resource_id },
      });
    },
    // 删除
    deleteCourse(data, done) {
      const that = this;
      const ids = [];
      if (data && data.length) {
        data.map((item) => ids.push(item.resource_id));
      } else {
        ids.push(data.resource_id);
      }
      that.$request
        .delete(
          '/oj/admin/course/batch',
          {
            resource_ids: ids,
          },
          {
            baseURL: '/api/ojj',
          },
        )
        .then(() => {
          done();
          that.selection = [];
          that.$refs.sdlRef.reload();
        })
        .catch(() => {
          done(false);
        });
    },
    toPublic(data, done) {
      // this.$refs.sdlRef.batchOvert();
      const that = this;
      const recordCtg = that.$t('coursesBreadcrumbs.course');
      const ids = [];
      const validSelection = _.filter(data, (item) => !item.is_public);
      if (validSelection && validSelection.length > 0) {
        if (data && data.length) {
          data.map((item) => ids.push(item.resource_id));
        } else {
          ids.push(data.resource_id);
        }
        that.$request
          .patch(
            '/oj/admin/course/batch-public',
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
            that.selection = [];
            that.$refs.sdlRef.reload();
          })
          .catch(() => {
            done(false);
          });
      } else {
        const msgTemplate = that.$t('common.selectRecordToOvert');
        const msg = CommonUtils.formatString(msgTemplate, recordCtg);
        msger.error(msg, that);
        done(false);
        // rej(msg);
      }
    },
    toHide(data, done) {
      const that = this;
      const recordCtg = that.$t('coursesBreadcrumbs.course');
      // this.$refs.sdlRef.batchConceal();
      const ids = [];
      const validSelection = _.filter(data, (item) => item.is_public);
      if (validSelection && validSelection.length > 0) {
        if (data && data.length) {
          data.map((item) => ids.push(item.resource_id));
        } else {
          ids.push(data.resource_id);
        }
        that.$request
          .patch(
            '/oj/admin/course/batch-public',
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
            that.selection = [];
            that.$refs.sdlRef.reload();
          })
          .catch(() => {
            done(false);
          });
      } else {
        const msgTemplate = that.$t('common.selectRecordToConceal');
        const msg = CommonUtils.formatString(msgTemplate, recordCtg);
        msger.error(msg, that);
        done(false);
        // rej(msg);
      }
    },
    // 导出课程
    exportCourse(data, done) {
      const ids = [];
      if (data && data.length) {
        data.map((item) => ids.push(item.resource_id));
      } else {
        ids.push(data.resource_id);
      }
      if (ids && ids.length > 0) {
        this.$request
          .get(
            '/oj/admin/course/batch_dumps',
            {
              ids: ids,
            },
            {
              responseType: 'arraybuffer',
              baseURL: '/api/ojj',
            },
          )
          .then((res) => {
            this.$request.download(
              res.data,
              data.length > 1 ? 'Course.zip' : `course_${data[0].name}.zip`,
            );
          });
      } else {
        done(false);
        msger.error(this.$t('views.course.batch.chooseCourseToProceed'), this);
      }
    },
    toType() {
      this.$router.push({ name: 'courses-aspect' });
    },
    handleSelectionChange(val) {
      this.multipleSelection = [];
      for (let i = 0; i < val.length; i++) {
        this.multipleSelection.push(val[i].resource_id);
      }
    },
  },
};
</script>
<style scoped lang="scss"></style>
